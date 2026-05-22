const API = 'http://localhost:5000';

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// REGISTER
async function register() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!fullname || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullname, email, password })
        });

        const data = await response.json();
        showToast(data.message, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('fullname').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// LOGIN
async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast(data.message, 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// LOAD BALANCE
async function loadBalance() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API}/balance`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('balance').innerText =
                `Balance: $${parseFloat(data.balance).toFixed(2)}`;
        } else {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

// DEPOSIT
async function deposit() {
    const amount = document.getElementById('amount').value;

    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        const data = await response.json();
        showToast(data.message, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('amount').value = '';
            loadBalance();
            loadTransactions();
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// WITHDRAW
async function withdrawMoney() {
    const amount = document.getElementById('amount').value;

    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ amount: parseFloat(amount) })
        });

        const data = await response.json();
        showToast(data.message, response.ok ? 'success' : 'error');

        if (response.ok) {
            document.getElementById('amount').value = '';
            loadBalance();
            loadTransactions();
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// LOAD TRANSACTIONS
async function loadTransactions() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API}/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();
        const list = document.getElementById('transactions');

        list.innerHTML = '';

        if (data.length === 0) {
            list.innerHTML = '<li>No transactions yet</li>';
            return;
        }

        data.forEach((transaction) => {
            const li = document.createElement('li');
            const typeClass = transaction.type === 'deposit' ? 'deposit' : 'withdraw';

            const date = new Date(transaction.created_at);
            const formattedDate = date.toLocaleString();

            li.className = typeClass;
            li.innerHTML = `
                <div>
                    <span style="font-size: 14px;">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                    <div class="timestamp">${formattedDate}</div>
                </div>
                <span class="amount">$${parseFloat(transaction.amount).toFixed(2)}</span>
            `;

            list.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Initialize dashboard on page load
if (window.location.pathname.includes('dashboard.html')) {
    loadBalance();
    loadTransactions();

    // Refresh every 5 seconds
    setInterval(loadBalance, 5000);
    setInterval(loadTransactions, 5000);
}
