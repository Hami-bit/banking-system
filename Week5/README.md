# Week 5 - Advanced Banking Dashboard

This folder contains the Week 5 version of the banking system with a complete login/register flow, session-based dashboard, transaction filters, and CSV export.

## Features
- Registration and login with secure password hashing.
- Session-protected dashboard.
- Deposit and withdrawal actions with balance updates.
- Transaction history with date/type filters.
- CSV export for transaction records.

## Files
- `db.php` — PDO database helper.
- `register.php` — account registration page.
- `login.php` — login page.
- `logout.php` — secure logout.
- `dashboard.html` — transaction dashboard.
- `dashboard.js` — client-side behavior.
- `api.php` — transaction/summary API.
- `style.css` — UI styling.

## Run
1. Copy `Week1/week1_db.sql` into MySQL or import the database.
2. Open `http://localhost/banking_system/Week5/register.php` to create a user.
3. Login and explore the dashboard.
