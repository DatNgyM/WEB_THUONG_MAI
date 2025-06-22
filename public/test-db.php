<?php
/**
 * Database Connection Test
 * Test file to verify MySQL connection
 */

// Include configuration
require_once '../config/config.php';
require_once '../config/database.php';
require_once '../app/core/Database.php';

echo "<h1>Five:07 Database Connection Test</h1>";

try {
    // Test database connection
    $db = new Database();
    echo "<p style='color: green;'>✓ Database connection successful!</p>";

    // Test if tables exist
    $db->query("SHOW TABLES");
    $tables = $db->resultSet();

    echo "<h3>Database Tables:</h3>";
    echo "<ul>";
    foreach ($tables as $table) {
        $tableName = array_values($table)[0];
        echo "<li>$tableName</li>";
    }
    echo "</ul>";

    // Test users table
    $db->query("SELECT COUNT(*) as count FROM users");
    $userCount = $db->single();
    echo "<p>Total users: " . $userCount['count'] . "</p>";

    // Test products table
    $db->query("SELECT COUNT(*) as count FROM products");
    $productCount = $db->single();
    echo "<p>Total products: " . $productCount['count'] . "</p>";

    // Test categories table
    $db->query("SELECT COUNT(*) as count FROM categories");
    $categoryCount = $db->single();
    echo "<p>Total categories: " . $categoryCount['count'] . "</p>";

    echo "<hr>";
    echo "<h3>Sample Products:</h3>";
    $db->query("SELECT name, price, brand FROM products LIMIT 5");
    $products = $db->resultSet();

    echo "<table border='1' style='border-collapse: collapse; width: 100%;'>";
    echo "<tr><th>Name</th><th>Price</th><th>Brand</th></tr>";
    foreach ($products as $product) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($product['name']) . "</td>";
        echo "<td>" . number_format($product['price']) . " VND</td>";
        echo "<td>" . htmlspecialchars($product['brand']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";

} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Database connection failed: " . $e->getMessage() . "</p>";

    // Show debug info
    echo "<h3>Debug Information:</h3>";
    echo "<p>Host: " . DB_HOST . "</p>";
    echo "<p>Database: " . DB_NAME . "</p>";
    echo "<p>User: " . DB_USER . "</p>";
    echo "<p>Port: " . DB_PORT . "</p>";
}

echo "<hr>";
echo "<h3>Configuration Info:</h3>";
echo "<p>Base URL: " . BASE_URL . "</p>";
echo "<p>Root Path: " . ROOT_PATH . "</p>";
echo "<p>PHP Version: " . phpversion() . "</p>";
echo "<p>Current Time: " . date('Y-m-d H:i:s') . "</p>";

echo "<hr>";
echo "<p><a href='" . BASE_URL . "'>← Back to Home</a></p>";
?>