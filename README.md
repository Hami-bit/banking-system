# Simple Banking System

A full-stack banking application with Node.js backend, MySQL database, and responsive HTML/CSS/JavaScript frontend.

## Project Structure

```
Banking_System/
├── server/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env
│
└── client/
    ├── index.html
    ├── dashboard.html
    ├── style.css
    └── script.js
```

## Features

✅ User Registration with password hashing (bcrypt)
✅ User Login with JWT Authentication
✅ Deposit Money
✅ Withdraw Money (with balance validation)
✅ View Account Balance
✅ View Transaction History
✅ Persistent MySQL Database
✅ No Cookies - JWT stored in localStorage
✅ Responsive UI with Modern Design

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing

## Setup Instructions

### Step 1: Create MySQL Database

1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Create a new database named `banking_system`
3. Run the following SQL queries:

```sql
CREATE DATABASE banking_system;

USE banking_system;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    balance DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(20),
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### Step 2: Install Backend Dependencies

1. Open PowerShell/Command Prompt
2. Navigate to the server folder:
   ```bash
   cd C:\xampp\htdocs\Banking_System\server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Step 3: Configure Environment Variables

The `.env` file is already configured with default XAMPP settings:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=banking_system
JWT_SECRET=mysecretkey123456
```

**If your XAMPP MySQL has a password**, update `DB_PASSWORD` in `.env`.

### Step 4: Start the Backend Server

1. From the server folder, run:
   ```bash
   npm start
   ```
   
   You should see:
   ```
   Connected to MySQL database
   Server running on port 5000
   ```

### Step 5: Open the Frontend

1. Open your browser and navigate to:
   ```
   http://localhost/Banking_System/client/index.html
   ```

2. You can now:
   - **Register** a new account
   - **Login** with your credentials
   - **Deposit** money
   - **Withdraw** money
   - **View** your balance and transaction history

## How It Works

### Authentication Flow

1. **Register**: User creates account → Password is hashed with bcrypt → Stored in database
2. **Login**: User enters credentials → Password verified → JWT token generated → Stored in localStorage
3. **Protected Requests**: Each request includes `Authorization: Bearer <token>` header
4. **Token Verification**: Server validates JWT before processing requests

### Transaction Flow

1. User enters amount
2. Frontend sends request with JWT token
3. Backend verifies token
4. Updates user balance in database
5. Creates transaction record
6. Returns success message
7. Frontend updates display

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/balance` | Get user balance | ✅ |
| POST | `/deposit` | Deposit money | ✅ |
| POST | `/withdraw` | Withdraw money | ✅ |
| GET | `/transactions` | Get transaction history | ✅ |

## Example API Requests

### Register
```json
POST /register
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "balance": 0
  }
}
```

### Deposit
```json
POST /deposit
Authorization: Bearer <token>
{
  "amount": 100
}
```

## Troubleshooting

### "Cannot connect to MySQL"
- Ensure XAMPP MySQL is running (Start button in Control Panel)
- Check if database name is correct in `.env`
- Verify database user/password

### "Port 5000 already in use"
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or close the application using port 5000

### "Token required" error
- Ensure you're logged in
- Check if localStorage is enabled in browser
- Try clearing browser cache

### CORS errors
- Backend CORS is already enabled
- Ensure frontend is accessing http://localhost:5000 (not https)

## Optional Improvements

Add these features to enhance your system:

- [ ] Admin dashboard
- [ ] Transfer between users
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Mobile responsive UI (partially done)
- [ ] React/Vue frontend
- [ ] Docker deployment
- [ ] Transaction receipts
- [ ] Charts and analytics
- [ ] Account statements
- [ ] Bill payment
- [ ] Loan applications

## Security Notes

⚠️ **Development Only**
- JWT secret should be longer and more complex in production
- Implement HTTPS in production
- Add input validation and sanitization
- Implement rate limiting
- Use environment variables properly
- Never commit `.env` with sensitive data
- Add CSRF protection

## Author

Simple Banking System - Educational Project

## License

MIT License
