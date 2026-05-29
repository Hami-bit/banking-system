const API = 'http://localhost:5000';

// Validation Rules
const VALIDATION = {
    fullname: {
        minLength: 2,
        maxLength: 100,
        regex: /^[a-zA-Z\s'-]+$/,
        message: 'Full name must contain only letters, spaces, hyphens, and apostrophes'
    },
    email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    password: {
        minLength: 6,
        maxLength: 50,
        message: 'Password must be at least 6 characters long'
    },
    amount: {
        minValue: 0.01,
        maxValue: 1000000,
        message: 'Amount must be between $0.01 and $1,000,000'
    }
};

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

// Validation Functions
function validateFullName(fullname) {
    if (!fullname) return 'Full name is required';
    if (fullname.length < VALIDATION.fullname.minLength) return `Full name must be at least ${VALIDATION.fullname.minLength} characters`;
    if (fullname.length > VALIDATION.fullname.maxLength) return `Full name cannot exceed ${VALIDATION.fullname.maxLength} characters`;
    if (!VALIDATION.fullname.regex.test(fullname)) return VALIDATION.fullname.message;
    return null;
}

function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!VALIDATION.email.regex.test(email)) return VALIDATION.email.message;
    return null;
}

function validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < VALIDATION.password.minLength) return `Password must be at least ${VALIDATION.password.minLength} characters`;
    if (password.length > VALIDATION.password.maxLength) return `Password cannot exceed ${VALIDATION.password.maxLength} characters`;
    return null;
}

function validateAmount(amount) {
    if (!amount) return 'Amount is required';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 'Amount must be a valid number';
    if (numAmount < VALIDATION.amount.minValue) return `Amount must be at least $${VALIDATION.amount.minValue}`;
    if (numAmount > VALIDATION.amount.maxValue) return `Amount cannot exceed $${VALIDATION.amount.maxValue}`;
    return null;
}

// Password strength checker
function evaluatePasswordStrength(pw) {
    if (!pw) return { score: 0, label: 'Empty', percent: 0, color: '#f44336' };
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

    // Map score to label and percent
    let label = 'Very Weak';
    let percent = Math.min(100, Math.round((score / 6) * 100));
    let color = '#f44336';
    if (score <= 1) { label = 'Very Weak'; color = '#f44336'; }
    else if (score === 2) { label = 'Weak'; color = '#ff9800'; }
    else if (score === 3) { label = 'Fair'; color = '#ffb74d'; }
    else if (score === 4) { label = 'Good'; color = '#ffd54f'; }
    else if (score === 5) { label = 'Strong'; color = '#8bc34a'; }
    else if (score === 6) { label = 'Excellent'; color = '#4caf50'; }

    return { score, label, percent, color };
}

function updatePasswordStrengthUI(pw) {
    const elFill = document.getElementById('strengthFill');
    const elText = document.getElementById('strengthText');
    if (!elFill || !elText) return;
    const res = evaluatePasswordStrength(pw);
    elFill.style.width = res.percent + '%';
    elFill.style.background = res.color;
    elText.innerText = res.label + (pw ? ` (${res.percent}%)` : '');
}

// attach event listener when DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const pwd = document.getElementById('password');
    if (pwd) {
        pwd.addEventListener('input', (e) => updatePasswordStrengthUI(e.target.value));
        // initialize
        updatePasswordStrengthUI(pwd.value || '');
    }
});

// REGISTER with Enhanced Validation
async function register() {
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate all fields
    const fullnameError = validateFullName(fullname);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (fullnameError) {
        showToast(fullnameError, 'error');
        return;
    }
    if (emailError) {
        showToast(emailError, 'error');
        return;
    }
    if (passwordError) {
        showToast(passwordError, 'error');
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

// LOGIN with Enhanced Validation
async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    // Validate email and password
    const emailError = validateEmail(email);
    if (emailError) {
        showToast(emailError, 'error');
        return;
    }

    if (!password) {
        showToast('Password is required', 'error');
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

// DEPOSIT with Enhanced Validation
async function deposit() {
    const amount = document.getElementById('amount').value.trim();

    // Validate amount
    const amountError = validateAmount(amount);
    if (amountError) {
        showToast(amountError, 'error');
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

// WITHDRAW with Enhanced Validation
async function withdrawMoney() {
    const amount = document.getElementById('amount').value.trim();

    // Validate amount
    const amountError = validateAmount(amount);
    if (amountError) {
        showToast(amountError, 'error');
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
