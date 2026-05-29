<?php
// Week 1: Basic Database Connectivity Test
// PDO MySQL Connection

$DB_HOST = '127.0.0.1';
$DB_NAME = 'banking_system';
$DB_USER = 'root';
$DB_PASS = '';

try {
    $pdo = new PDO("mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h1>✅ Database Connection Successful!</h1>";
    echo "<p><strong>Host:</strong> {$DB_HOST}</p>";
    echo "<p><strong>Database:</strong> {$DB_NAME}</p>";
    
    // Test query - show tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<h2>Database Tables:</h2>";
    echo "<ul>";
    foreach ($tables as $table) {
        echo "<li>{$table}</li>";
    }
    echo "</ul>";
    
} catch (PDOException $e) {
    echo "<h1>❌ Database Connection Failed</h1>";
    echo "<p><strong>Error:</strong> " . $e->getMessage() . "</p>";
}
?>
