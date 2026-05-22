const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// REGISTER
app.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users(fullname, email, password) VALUES (?, ?, ?)';

    db.query(sql, [fullname, email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Email already exists or error occurred', error: err.message });
        }

        res.json({ message: 'User registered successfully' });
    });
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                fullname: user.fullname,
                balance: user.balance
            }
        });
    });
});

// AUTH MIDDLEWARE
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: 'Token required' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.userId = decoded.id;
        next();
    });
}

// GET BALANCE
app.get('/balance', verifyToken, (req, res) => {
    const sql = 'SELECT balance FROM users WHERE id = ?';

    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results[0]);
    });
});

// DEPOSIT
app.post('/deposit', verifyToken, (req, res) => {
    const { amount } = req.body;

    const updateSql = 'UPDATE users SET balance = balance + ? WHERE id = ?';

    db.query(updateSql, [amount, req.userId], (err) => {
        if (err) return res.status(500).json(err);

        const transactionSql =
            'INSERT INTO transactions(user_id, type, amount) VALUES (?, ?, ?)';

        db.query(transactionSql, [req.userId, 'deposit', amount]);

        res.json({ message: 'Deposit successful' });
    });
});

// WITHDRAW
app.post('/withdraw', verifyToken, (req, res) => {
    const { amount } = req.body;

    const getBalanceSql = 'SELECT balance FROM users WHERE id = ?';

    db.query(getBalanceSql, [req.userId], (err, results) => {
        if (err) return res.status(500).json(err);

        const balance = results[0].balance;

        if (balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const updateSql =
            'UPDATE users SET balance = balance - ? WHERE id = ?';

        db.query(updateSql, [amount, req.userId], (err) => {
            if (err) return res.status(500).json(err);

            const transactionSql =
                'INSERT INTO transactions(user_id, type, amount) VALUES (?, ?, ?)';

            db.query(transactionSql, [req.userId, 'withdraw', amount]);

            res.json({ message: 'Withdrawal successful' });
        });
    });
});

// TRANSACTION HISTORY
app.get('/transactions', verifyToken, (req, res) => {
    const sql =
        'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC';

    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
