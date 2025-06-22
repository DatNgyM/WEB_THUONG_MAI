-- Five:07 E-commerce Database Setup for Laragon MySQL
-- Run this script in phpMyAdmin or MySQL command line

-- Create database
CREATE DATABASE
IF NOT EXISTS ecommerce_db CHARACTER
SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

-- Users table
CREATE TABLE users
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR
    (50) UNIQUE,
    email VARCHAR
    (100) UNIQUE NOT NULL,
    password VARCHAR
    (255) NOT NULL,
    first_name VARCHAR
    (50),
    last_name VARCHAR
    (50),
    phone VARCHAR
    (20),
    cccd VARCHAR
    (12), -- Citizen ID
    address TEXT,
    city VARCHAR
    (50),
    postal_code VARCHAR
    (10),
    role ENUM
    ('admin', 'seller', 'customer') DEFAULT 'customer',
    status TINYINT
    (1) DEFAULT 1,
    email_verified TINYINT
    (1) DEFAULT 0,
    premium_member TINYINT
    (1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
    UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP
    NULL,
    INDEX idx_email
    (email),
    INDEX idx_role
    (role),
    INDEX idx_status
    (status)
);

    -- Categories table
    CREATE TABLE categories
    (
        id INT
        AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
        (255) NOT NULL,
    slug VARCHAR
        (255) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR
        (500),
    parent_id INT NULL,
    sort_order INT DEFAULT 0,
    status TINYINT
        (1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
        UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_status (status),
    INDEX idx_sort_order (sort_order),
    FOREIGN KEY
        (parent_id) REFERENCES categories
        (id) ON
        DELETE
        SET NULL
        );

        -- Products table
        CREATE TABLE products
        (
            id INT
            AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
            (255) NOT NULL,
    slug VARCHAR
            (255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR
            (500),
    sku VARCHAR
            (100) UNIQUE,
    price DECIMAL
            (15,2) NOT NULL,
    sale_price DECIMAL
            (15,2) NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT NOT NULL,
    seller_id INT NULL,
    brand VARCHAR
            (100),
    weight DECIMAL
            (8,2),
    dimensions VARCHAR
            (100),
    featured TINYINT
            (1) DEFAULT 0,
    status TINYINT
            (1) DEFAULT 1,
    views INT DEFAULT 0,
    rating DECIMAL
            (3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
            UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
            (category_id) REFERENCES categories
            (id) ON
            DELETE CASCADE,
    FOREIGN KEY (seller_id)
            REFERENCES users
            (id) ON
            DELETE
            SET NULL
            ,
    INDEX idx_category_id
            (category_id),
    INDEX idx_seller_id
            (seller_id),
    INDEX idx_status
            (status),
    INDEX idx_featured
            (featured),
    INDEX idx_price
            (price),
    INDEX idx_slug
            (slug)
);

            -- Product images table
            CREATE TABLE product_images
            (
                id INT
                AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_path VARCHAR
                (500) NOT NULL,
    alt_text VARCHAR
                (255),
    sort_order INT DEFAULT 0,
    is_primary TINYINT
                (1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
                (product_id) REFERENCES products
                (id) ON
                DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary
                (is_primary)
);

                -- Shopping cart table
                CREATE TABLE cart
                (
                    id INT
                    AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                    UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
                    (user_id) REFERENCES users
                    (id) ON
                    DELETE CASCADE,
    FOREIGN KEY (product_id)
                    REFERENCES products
                    (id) ON
                    DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id
                    ),
    INDEX idx_user_id
                    (user_id)
);

                    -- Orders table
                    CREATE TABLE orders
                    (
                        id INT
                        AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR
                        (50) UNIQUE NOT NULL,
    status ENUM
                        ('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL
                        (15,2) NOT NULL,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR
                        (50),
    payment_status ENUM
                        ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                        UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
                        (user_id) REFERENCES users
                        (id) ON
                        DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status
                        (status),
    INDEX idx_order_number
                        (order_number)
);

                        -- Order items table
                        CREATE TABLE order_items
                        (
                            id INT
                            AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL
                            (15,2) NOT NULL,
    total DECIMAL
                            (15,2) NOT NULL,
    FOREIGN KEY
                            (order_id) REFERENCES orders
                            (id) ON
                            DELETE CASCADE,
    FOREIGN KEY (product_id)
                            REFERENCES products
                            (id) ON
                            DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id
                            (product_id)
);

                            -- Insert sample data
                            -- Admin user
                            INSERT INTO users
                                (username, email, password, first_name, last_name, role, status, email_verified)
                            VALUES
                                ('admin', 'admin@five07.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', 1, 1);
                            -- Password: password

                            -- Sample categories
                            INSERT INTO categories
                                (name, slug, description, status)
                            VALUES
                                ('Electronics', 'electronics', 'Electronic devices and gadgets', 1),
                                ('Smartphones', 'smartphones', 'Mobile phones and accessories', 1),
                                ('Laptops', 'laptops', 'Laptop computers and accessories', 1),
                                ('Watches', 'watches', 'Smart watches and traditional watches', 1),
                                ('Audio', 'audio', 'Headphones, speakers, and audio equipment', 1);

                            -- Sample products
                            INSERT INTO products
                                (name, slug, description, short_description, sku, price, sale_price, stock_quantity, category_id, brand, featured, status)
                            VALUES
                                ('iPhone 16 Pro Max', 'iphone-16-pro-max', 'Latest iPhone with advanced features and powerful performance', 'Premium smartphone with cutting-edge technology', 'IP16PM001', 29990000, 27990000, 50, 2, 'Apple', 1, 1),
                                ('MacBook Pro 14 inch M4', 'macbook-pro-14-m4', 'Professional laptop with M4 chip for ultimate performance', 'High-performance laptop for professionals', 'MBP14M4001', 45990000, NULL, 25, 3, 'Apple', 1, 1),
                                ('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Adventure-ready smartwatch with advanced health features', 'Rugged smartwatch for outdoor activities', 'AWUL2001', 18990000, 17990000, 30, 4, 'Apple', 1, 1),
                                ('MSI Stealth 14 AI Studio', 'msi-stealth-14-ai', 'Gaming laptop with AI-powered performance', 'Powerful gaming laptop with latest AI features', 'MSIS14AI001', 35990000, NULL, 15, 3, 'MSI', 0, 1),
                                ('Ferrari Watch Collection', 'ferrari-watch-collection', 'Luxury Ferrari branded timepiece', 'Premium sports watch inspired by Ferrari design', 'FWC001', 12990000, 11990000, 20, 4, 'Ferrari', 0, 1);

                            -- Sample product images
                            INSERT INTO product_images
                                (product_id, image_path, alt_text, is_primary, sort_order)
                            VALUES
                                (1, '/images/iphone-16-pro-max-titan.jpg', 'iPhone 16 Pro Max Titanium', 1, 1),
                                (1, '/images/iphone-16-pro-max-1-638639190782955686.jpg', 'iPhone 16 Pro Max View 1', 0, 2),
                                (1, '/images/iphone-16-pro-max-2-638639190801601764.jpg', 'iPhone 16 Pro Max View 2', 0, 3),
                                (2, '/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg', 'MacBook Pro 14 M4', 1, 1),
                                (3, '/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg', 'Apple Watch Ultra 2', 1, 1),
                                (4, '/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg', 'MSI Stealth 14 AI Studio', 1, 1),
                                (5, '/images/ferrari-0830772-nam1-700x467.jpg', 'Ferrari Watch', 1, 1);

                            -- Sample customer
                            INSERT INTO users
                                (username, email, password, first_name, last_name, phone, role, status, email_verified)
                            VALUES
                                ('testuser', 'user@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '0123456789', 'customer', 1, 1);
                            -- Password: password

                            -- Sample seller
                            INSERT INTO users
                                (username, email, password, first_name, last_name, phone, cccd, role, status, email_verified)
                            VALUES
                                ('seller1', 'seller@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Seller', '0987654321', '123456789012', 'seller', 1, 1);
-- Password: password
