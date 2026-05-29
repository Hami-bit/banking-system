<?php
// Week 3: PHP Syntax Practice & Dynamic User Input Handling

// Database Connection
$DB_HOST = '127.0.0.1';
$DB_NAME = 'banking_system';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed']));
}

// Sanitize and Validate User Input
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false;
}

function validatePassword($password) {
    return strlen($password) >= 6 ? true : false;
}

// Register User (Example)
function registerUser($fullname, $email, $password) {
    global $pdo;
    
    // Validate inputs
    if (empty($fullname) || empty($email) || empty($password)) {
        return ['success' => false, 'message' => 'All fields required'];
    }

    if (!validateEmail($email)) {
        return ['success' => false, 'message' => 'Invalid email format'];
    }

    if (!validatePassword($password)) {
        return ['success' => false, 'message' => 'Password too short'];
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {
        // Prepared statement to prevent SQL injection
        $stmt = $pdo->prepare('INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)');
        $stmt->execute([sanitizeInput($fullname), sanitizeInput($email), $hashedPassword]);
        
        return ['success' => true, 'message' => 'User registered successfully'];
    } catch (PDOException $e) {
        if ($e->getCode() == '23000') {
            return ['success' => false, 'message' => 'Email already exists'];
        }
        return ['success' => false, 'message' => 'Registration failed'];
    }
}

// Get User by Email
function getUserByEmail($email) {
    global $pdo;
    
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([sanitizeInput($email)]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Update User Balance
function updateUserBalance($userId, $amount) {
    global $pdo;
    
    $stmt = $pdo->prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
    return $stmt->execute([$amount, $userId]);
}

// Handle API Requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;

    switch ($action) {
        case 'register':
            $result = registerUser($input['fullname'], $input['email'], $input['password']);
            echo json_encode($result);
            break;

        case 'login':
            $user = getUserByEmail($input['email']);
            if ($user && password_verify($input['password'], $user['password'])) {
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
            }
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }
    exit;
}
?>
