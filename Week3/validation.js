// Week 3: Form Validation & Password Strength Checker

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
    }
};

// Validation Functions
function validateFullName(fullname) {
    if (!fullname) return 'Full name is required';
    if (fullname.length < VALIDATION.fullname.minLength) 
        return `Full name must be at least ${VALIDATION.fullname.minLength} characters`;
    if (fullname.length > VALIDATION.fullname.maxLength) 
        return `Full name cannot exceed ${VALIDATION.fullname.maxLength} characters`;
    if (!VALIDATION.fullname.regex.test(fullname)) 
        return VALIDATION.fullname.message;
    return null;
}

function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!VALIDATION.email.regex.test(email)) 
        return VALIDATION.email.message;
    return null;
}

function validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < VALIDATION.password.minLength) 
        return `Password must be at least ${VALIDATION.password.minLength} characters`;
    if (password.length > VALIDATION.password.maxLength) 
        return `Password cannot exceed ${VALIDATION.password.maxLength} characters`;
    return null;
}

// Password Strength Evaluation
function evaluatePasswordStrength(pw) {
    if (!pw) return { score: 0, label: 'Empty', percent: 0, color: '#f44336' };
    
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (pw.length >= 12) score += 1;
    if (/[a-z]/.test(pw)) score += 1;
    if (/[A-Z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;

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

// Update Password Strength UI
function updatePasswordStrengthUI(pw) {
    const elFill = document.getElementById('strengthFill');
    const elText = document.getElementById('strengthText');
    if (!elFill || !elText) return;
    
    const res = evaluatePasswordStrength(pw);
    elFill.style.width = res.percent + '%';
    elFill.style.background = res.color;
    elText.innerText = res.label + (pw ? ` (${res.percent}%)` : '');
}

// Show Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show Error Message
function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerText = message;
    el.style.display = message ? 'block' : 'none';
}

// Handle Register Form
function handleRegister(event) {
    event.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validate all fields
    const fullnameError = validateFullName(fullname);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    showError('nameError', fullnameError);
    showError('emailError', emailError);
    showError('passwordError', passwordError);

    if (fullnameError || emailError || passwordError) {
        showToast('Please fix validation errors', 'error');
        return;
    }

    // If all validations pass
    showToast('✅ Registration successful!', 'success');
    console.log('Form data:', { fullname, email, password });
    // Here you would send to backend
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', () => {
    const pwd = document.getElementById('password');
    if (pwd) {
        pwd.addEventListener('input', (e) => updatePasswordStrengthUI(e.target.value));
        updatePasswordStrengthUI(pwd.value || '');
    }
});
