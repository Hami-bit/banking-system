# Week 3 - Form Validation & Password Strength

## 🎯 Week 3 Objectives
- ✅ JavaScript form validation
- ✅ Password strength checker with visual meter
- ✅ Real-time error messages
- ✅ PHP syntax practice
- ✅ Database connection script
- ✅ Dynamic user input handling

## 📁 Files Included
- `register.html` - Registration form with validation UI
- `validation.js` - Client-side validation and password strength
- `style.css` - Enhanced styles with error states
- `api.php` - PHP validation, sanitization, and database handling
- `README.md` - Week 3 documentation

## 🔐 Validation Features
### Client-Side (JavaScript)
- ✅ Full name: 2-100 chars, letters only
- ✅ Email: RFC-compliant validation
- ✅ Password: Min 6 chars, strength meter
- ✅ Real-time feedback with color coding
- ✅ Error messages below each field

### Server-Side (PHP)
- ✅ Input sanitization (htmlspecialchars)
- ✅ Prepared statements (prevent SQL injection)
- ✅ Password hashing (bcrypt)
- ✅ Email validation (filter_var)
- ✅ Duplicate email check

## 💪 Password Strength Levels
- **Very Weak** (Red): 0-16% - Random chars only
- **Weak** (Orange): 17-33% - Length or special chars
- **Fair** (Light Orange): 34-50% - Multiple criteria met
- **Good** (Light Yellow): 51-66% - Most criteria met
- **Strong** (Light Green): 67-83% - Most requirements met
- **Excellent** (Green): 84-100% - All criteria met

## 🔗 Quick Links
- Register: http://localhost/banking_system/Week3/register.html
- API Test: http://localhost/banking_system/Week3/api.php

## 📊 Validation Rules
```
Full Name: 2-100 chars, letters/spaces/hyphens/apostrophes
Email: Valid RFC format (example@domain.com)
Password: 6-50 chars (recommends upper, lower, numbers, special)
```

## ✨ Next Steps (Week 4)
- Session management
- Authentication basics
- Login handling
- User dashboard
