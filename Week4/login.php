<?php
// Week 4: Login Handler with Session Management

session_start();

// Check if form submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = htmlspecialchars($_POST['email'] ?? '', ENT_QUOTES, 'UTF-8');
    $password = $_POST['password'] ?? '';

    // Database connection
    $DB_HOST = '127.0.0.1';
    $DB_NAME = 'banking_system';
    $DB_USER = 'root';
    $DB_PASS = '';

    try {
        $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get user from database
        $stmt = $pdo->prepare('SELECT id, password FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Password correct - create session
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['email'] = $email;
            $_SESSION['login_time'] = time();

            // Redirect to dashboard
            header('Location: dashboard.html');
            exit;
        } else {
            // Invalid credentials
            $error = 'Invalid email or password';
        }
    } catch (PDOException $e) {
        $error = 'Database error: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Banking System - Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
    <h1>🏦 Banking System</h1>
    
    <div class="form-card">
        <h2>Customer Login</h2>
        
        <?php if (isset($error)): ?>
            <div class="error-box">
                <p><?php echo htmlspecialchars($error); ?></p>
            </div>
        <?php endif; ?>

        <form method="POST">
            <input type="email" name="email" placeholder="Email Address" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" class="btn-primary">Login</button>
        </form>
        <p class="auth-link">Don't have an account? <a href="register.html">Register here</a></p>
    </div>
</div>

</body>
</html>
