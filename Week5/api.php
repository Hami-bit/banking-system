<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once 'db.php';
$userId = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $action = $input['action'] ?? null;

    switch ($action) {
        case 'getBalance':
            $stmt = $pdo->prepare('SELECT balance, fullname, email FROM users WHERE id = ?');
            $stmt->execute([$userId]);
            $user = $stmt->fetch();
            echo json_encode(['balance' => $user['balance'], 'fullname' => $user['fullname'], 'email' => $user['email']]);
            break;

        case 'getTransactions':
            $type = $input['type'] ?? null;
            $from = $input['from'] ?? null;
            $to = $input['to'] ?? null;

            $query = 'SELECT type, amount, created_at FROM transactions WHERE user_id = ?';
            $params = [$userId];

            if ($type && in_array($type, ['deposit', 'withdraw'], true)) {
                $query .= ' AND type = ?';
                $params[] = $type;
            }
            if ($from) {
                $query .= ' AND created_at >= ?';
                $params[] = $from . ' 00:00:00';
            }
            if ($to) {
                $query .= ' AND created_at <= ?';
                $params[] = $to . ' 23:59:59';
            }

            $query .= ' ORDER BY created_at DESC LIMIT 50';
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            echo json_encode(['transactions' => $stmt->fetchAll()]);
            break;

        case 'deposit':
            $amount = (float)($input['amount'] ?? 0);
            if ($amount <= 0) {
                echo json_encode(['error' => 'Invalid deposit amount']);
                break;
            }
            $pdo->beginTransaction();
            $pdo->prepare('UPDATE users SET balance = balance + ? WHERE id = ?')->execute([$amount, $userId]);
            $pdo->prepare('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)')->execute([$userId, 'deposit', $amount]);
            $pdo->commit();
            echo json_encode(['success' => true]);
            break;

        case 'withdraw':
            $amount = (float)($input['amount'] ?? 0);
            if ($amount <= 0) {
                echo json_encode(['error' => 'Invalid withdrawal amount']);
                break;
            }
            $stmt = $pdo->prepare('SELECT balance FROM users WHERE id = ?');
            $stmt->execute([$userId]);
            $user = $stmt->fetch();

            if ($user['balance'] < $amount) {
                echo json_encode(['error' => 'Insufficient funds']);
                break;
            }

            $pdo->beginTransaction();
            $pdo->prepare('UPDATE users SET balance = balance - ? WHERE id = ?')->execute([$amount, $userId]);
            $pdo->prepare('INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)')->execute([$userId, 'withdraw', $amount]);
            $pdo->commit();
            echo json_encode(['success' => true]);
            break;

        default:
            echo json_encode(['error' => 'Invalid action']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['export'])) {
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="transactions.csv"');

    $type = $_GET['type'] ?? null;
    $from = $_GET['from'] ?? null;
    $to = $_GET['to'] ?? null;

    $query = 'SELECT type, amount, created_at FROM transactions WHERE user_id = ?';
    $params = [$userId];

    if ($type && in_array($type, ['deposit', 'withdraw'], true)) {
        $query .= ' AND type = ?';
        $params[] = $type;
    }
    if ($from) {
        $query .= ' AND created_at >= ?';
        $params[] = $from . ' 00:00:00';
    }
    if ($to) {
        $query .= ' AND created_at <= ?';
        $params[] = $to . ' 23:59:59';
    }

    $query .= ' ORDER BY created_at DESC';
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $output = fopen('php://output', 'w');
    fputcsv($output, ['Type', 'Amount', 'Created At']);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, [$row['type'], number_format($row['amount'], 2), $row['created_at']]);
    }
    fclose($output);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
