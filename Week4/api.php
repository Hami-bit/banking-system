<?php
// Week 4: Session Management & API Endpoints

session_start();
header('Content-Type: application/json; charset=utf-8');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$DB_HOST = '127.0.0.1';
$DB_NAME = 'banking_system';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? null;

    switch ($action) {
        case 'getBalance':
            $stmt = $pdo->prepare('SELECT balance FROM users WHERE id = ?');
            $stmt->execute([$user_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['balance' => $result['balance'] ?? 0]);
            break;

        case 'getTransactions':
            $stmt = $pdo->prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 10');
            $stmt->execute([$user_id]);
            $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['transactions' => $transactions]);
            break;

        case 'deposit':
            $amount = (float)($input['amount'] ?? 0);
            if ($amount <= 0) { echo json_encode(['error' => 'Invalid amount']); break; }

            $stmt = $pdo->prepare('UPDATE users SET balance = balance + ? WHERE id = ?');
            $stmt->execute([$amount, $user_id]);

            $stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)');
            $stmt->execute([$user_id, 'deposit', $amount]);

            echo json_encode(['success' => true]);
            break;

        case 'withdraw':
            $amount = (float)($input['amount'] ?? 0);
            if ($amount <= 0) { echo json_encode(['error' => 'Invalid amount']); break; }

            $stmt = $pdo->prepare('SELECT balance FROM users WHERE id = ?');
            $stmt->execute([$user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user['balance'] < $amount) { echo json_encode(['error' => 'Insufficient funds']); break; }

            $stmt = $pdo->prepare('UPDATE users SET balance = balance - ? WHERE id = ?');
            $stmt->execute([$amount, $user_id]);

            $stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)');
            $stmt->execute([$user_id, 'withdraw', $amount]);

            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }
    exit;
}

// GET: return user info
$stmt = $pdo->prepare('SELECT id, fullname, email FROM users WHERE id = ?');
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode($user);

?>
