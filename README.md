# Banking System Project

This repository contains a progressive banking system sample organized by week.

## Structure
- `Week1/` — Database setup and basic PHP test page.
- `Week2/` — UI prototype and login page mockup.
- `Week3/` — Client-side registration form and validation.
- `Week4/` — Session-based dashboard with deposits, withdrawals, and transactions.
- `Week5/` — Full login/register flow, filtered transaction history, and CSV export.

## Run Locally
1. Copy this folder into XAMPP `htdocs`.
2. Start Apache and MySQL in XAMPP.
3. Import `Week1/week1_db.sql` into MySQL.
4. Open the relevant week page in your browser:
   - Week 1: `http://localhost/banking_system/Week1/index.php`
   - Week 2: `http://localhost/banking_system/Week2/login.html`
   - Week 3: `http://localhost/banking_system/Week3/register.html`
   - Week 4: `http://localhost/banking_system/Week4/login.php`
   - Week 5: `http://localhost/banking_system/Week5/register.php`

## Database
- Database name: `banking_system`
- Credentials:
  - Host: `127.0.0.1`
  - User: `root`
  - Password: ``
- Tables:
  - `users`
  - `transactions`

## Notes
- Week 4 and Week 5 require the imported database and MySQL running.
- Week 5 is the most complete version of the project.
- Root-level helper files were removed to keep the project clean.

## Authors
- Project prepared for GitHub push and local XAMPP deployment.
- Implement rate limiting
- Use environment variables properly
- Never commit `.env` with sensitive data
- Add CSRF protection

## Author

Simple Banking System - Educational Project

## License

MIT License
=======
# Banking System Project

This repository contains a small progressive banking system sample organized by week.

## Structure
- `Week1/` — database setup and initial project proof-of-concept.
- `Week2/` — UI prototype and layout demonstration.
- `Week3/` — registration form, validation, and basic login API.
- `Week4/` — session-protected dashboard with deposit/withdraw transactions.
- `Week5/` — full login/register flow, transaction filters, and CSV export.

## How to run
1. Copy the project into XAMPP `htdocs/banking_system`.
2. Start Apache and MySQL using XAMPP.
3. Import `Week1/week1_db.sql` into MySQL.
4. Open one of the week folders in your browser, for example:
   - `http://localhost/banking_system/Week5/register.php`
   - `http://localhost/banking_system/Week4/login.php`

## Notes
- Database credentials are configured to use `root` with no password.
- Each week folder is independent and shows progressive features.
- Week5 is the most complete version with user registration, login, filtering, and export.
>>>>>>> 1e37d04 (Initial Week1-Week5 banking system project)
