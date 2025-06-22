<?php
// Test database connection
require_once 'config/config.php';
require_once 'config/database.php';
require_once 'app/core/Database.php';

try {
    echo "Testing database connection...\n";

    $db = new Database();
    echo "✅ Database connection successful!\n";

    // Test query
    $db->query("SELECT COUNT(*) as count FROM products");
    $result = $db->single();

    if ($result) {
        echo "✅ Database query successful!\n";
        echo "Products count: " . $result['count'] . "\n";
    } else {
        echo "❌ Database query failed!\n";
    }

} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}
?>