<?php
/**
 * Insert Sample Products
 * Script để thêm sản phẩm mẫu vào database
 */

// Include configuration
require_once '../config/config.php';
require_once '../config/database.php';
require_once '../app/core/Database.php';

echo "<h1>Insert Sample Products</h1>";

try {
    $db = new Database();

    // Sample products data
    $products = [
        [
            'name' => 'iPhone 16 Pro Max',
            'description' => 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ, camera 48MP, màn hình 6.9 inch Super Retina XDR',
            'price' => 29990000,
            'sale_price' => 27990000,
            'category' => 'Điện thoại',
            'brand' => 'Apple',
            'stock' => 50,
            'image_url' => 'images/iphone-16-pro-max-1-638639190782955686.jpg',
            'status' => 1,
            'featured' => 1
        ],
        [
            'name' => 'MacBook Pro M4 14 inch',
            'description' => 'MacBook Pro 14 inch với chip M4, 16GB RAM, 512GB SSD, màn hình Liquid Retina XDR',
            'price' => 45990000,
            'sale_price' => 42990000,
            'category' => 'Laptop',
            'brand' => 'Apple',
            'stock' => 30,
            'image_url' => 'images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg',
            'status' => 1,
            'featured' => 1
        ],
        [
            'name' => 'Apple Watch Ultra 2',
            'description' => 'Apple Watch Ultra 2 LTE 49mm viền Titanium dây Milan, chống nước, GPS, theo dõi sức khỏe',
            'price' => 19999000,
            'category' => 'Đồng hồ thông minh',
            'brand' => 'Apple',
            'stock' => 25,
            'image_url' => 'images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg',
            'status' => 1,
            'featured' => 1
        ],
        [
            'name' => 'MSI Stealth 14 AI Studio',
            'description' => 'Laptop gaming MSI Stealth 14 AI Studio với Intel Ultra 7, RTX 4060, 16GB RAM, 1TB SSD',
            'price' => 32990000,
            'category' => 'Laptop',
            'brand' => 'MSI',
            'stock' => 15,
            'image_url' => 'images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg',
            'status' => 1,
            'featured' => 1
        ],
        [
            'name' => 'Đồng hồ Ferrari 0830772',
            'description' => 'Đồng hồ Ferrari nam 0830772 thiết kế thể thao, chống nước, dây da cao cấp',
            'price' => 5990000,
            'sale_price' => 4990000,
            'category' => 'Đồng hồ',
            'brand' => 'Ferrari',
            'stock' => 20,
            'image_url' => 'images/ferrari-0830772-nam1-700x467.jpg',
            'status' => 1,
            'featured' => 0
        ]
    ];

    // Insert products
    $sql = "INSERT INTO products (name, description, price, sale_price, category, brand, stock, image_url, status, featured, created_at, updated_at) 
            VALUES (:name, :description, :price, :sale_price, :category, :brand, :stock, :image_url, :status, :featured, NOW(), NOW())";

    $inserted = 0;
    foreach ($products as $product) {
        // Check if product already exists
        $db->query("SELECT id FROM products WHERE name = :name");
        $db->bind(':name', $product['name']);
        $existing = $db->single();

        if (!$existing) {
            $db->query($sql);
            $db->bind(':name', $product['name']);
            $db->bind(':description', $product['description']);
            $db->bind(':price', $product['price']);
            $db->bind(':sale_price', $product['sale_price'] ?? null);
            $db->bind(':category', $product['category']);
            $db->bind(':brand', $product['brand']);
            $db->bind(':stock', $product['stock']);
            $db->bind(':image_url', $product['image_url']);
            $db->bind(':status', $product['status']);
            $db->bind(':featured', $product['featured']);

            if ($db->execute()) {
                echo "<p style='color: green;'>✓ Inserted: " . $product['name'] . "</p>";
                $inserted++;
            } else {
                echo "<p style='color: red;'>✗ Failed to insert: " . $product['name'] . "</p>";
            }
        } else {
            echo "<p style='color: orange;'>⚠ Already exists: " . $product['name'] . "</p>";
        }
    }

    echo "<hr>";
    echo "<h3>Summary</h3>";
    echo "<p>Total products inserted: <strong>$inserted</strong></p>";

    // Show current products count
    $db->query("SELECT COUNT(*) as count FROM products WHERE status = 1");
    $result = $db->single();
    echo "<p>Total active products: <strong>" . $result['count'] . "</strong></p>";

} catch (Exception $e) {
    echo "<p style='color: red;'>✗ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><a href='../index.php?page=products'>→ View Products Page</a></p>";
echo "<p><a href='test-db.php'>→ Back to Database Test</a></p>";
?>