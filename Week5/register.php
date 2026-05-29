<?php
require_once 'db.php';
$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullname = trim($_POST['fullname'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirm_password'] ?? '';

    if (strlen($fullname) < 3) {
        $errors[] = 'Full name must be at least 3 characters.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Provide a valid email address.';
    }
    if (strlen($password) < 8) {
        $errors[] = 'Password must be at least 8 characters long.';
    }
    if ($password !== $confirmPassword) {
        $errors[] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = 'Email is already registered.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare('INSERT INTO users (fullname, email, password, balance) VALUES (?, ?, ?, 0)');
            $stmt->execute([$fullname, $email, $hash]);
            $success = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banking System - Register</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="auth-container">
    <div class="auth-card">
        <h1>Create account</h1>
        <?php if ($errors): ?>
            <div class="alert alert-error">
                <ul>
                    <?php foreach ($errors as $error): ?>
                        <li><?php echo htmlspecialchars($error); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php elseif ($success): ?>
            <div class="alert alert-success">
                Registration complete. <a href="login.php">Login now</a>.
            </div>
        <?php endif; ?>

        <form method="POST">
            <label>Full Name</label>
            <input type="text" name="fullname" value="<?php echo htmlspecialchars($_POST['fullname'] ?? ''); ?>" required>
            <label>Email</label>
            <input type="email" name="email" value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>" required>
            <label>Password</label>
            <input type="password" name="password" required>
            <label>Confirm Password</label>
            <input type="password" name="confirm_password" required>
            <button type="submit">Register</button>
        </form>
        <p class="small-text">Already have an account? <a href="login.php">Login</a></p>
    </div>
</div>
</body>
</html>
