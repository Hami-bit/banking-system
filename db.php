<?php
// db.php - PDO MySQL connection helper
// Configure these values if your environment differs
$DB_HOST = '127.0.0.1';
$DB_NAME = 'banking_system';
$DB_USER = 'root';
$DB_PASS = '';

// Recommended PDO options
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

/**
 * Return a shared PDO instance.
 * Usage: $pdo = getPDO();
 */
function getPDO()
{
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $options;
    static $pdo = null;

    if ($pdo === null) {
        $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
        } catch (PDOException $e) {
            // Log the error and show a generic message
            error_log('DB Connection error: ' . $e->getMessage());
            http_response_code(500);
            exit('Database connection failed.');
        }
    }

    return $pdo;
}
