-- Database Schema for E-commerce Website
-- Created: June 22, 2025

-- Create database
CREATE DATABASE
IF NOT EXISTS ecommerce_db CHARACTER
SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE ecommerce_db;

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
    INDEX idx_sort_order (sort_order)
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
    INDEX idx_category_id (category_id),
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
    INDEX idx_sort_order
            (sort_order)
);

            -- Users table
            CREATE TABLE users
            (
                id INT
                AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR
                (50) UNIQUE NOT NULL,
    email VARCHAR
                (255) UNIQUE NOT NULL,
    password VARCHAR
                (255) NOT NULL,
    first_name VARCHAR
                (100),
    last_name VARCHAR
                (100),
    phone VARCHAR
                (20),
    avatar VARCHAR
                (500),
    date_of_birth DATE,
    gender ENUM
                ('male', 'female', 'other'),
    role ENUM
                ('customer', 'seller', 'admin') DEFAULT 'customer',
    status TINYINT
                (1) DEFAULT 1,
    email_verified TINYINT
                (1) DEFAULT 0,
    phone_verified TINYINT
                (1) DEFAULT 0,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_status (status)
                );

                -- User addresses table
                CREATE TABLE user_addresses
                (
                    id INT
                    AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM
                    ('billing', 'shipping') DEFAULT 'shipping',
    first_name VARCHAR
                    (100),
    last_name VARCHAR
                    (100),
    company VARCHAR
                    (100),
    address_line_1 VARCHAR
                    (255) NOT NULL,
    address_line_2 VARCHAR
                    (255),
    city VARCHAR
                    (100) NOT NULL,
    state VARCHAR
                    (100),
    postal_code VARCHAR
                    (20),
    country VARCHAR
                    (100) DEFAULT 'Vietnam',
    phone VARCHAR
                    (20),
    is_default TINYINT
                    (1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                    UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
                    (user_id) REFERENCES users
                    (id) ON
                    DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_type
                    (type)
);

                    -- Orders table
                    CREATE TABLE orders
                    (
                        id INT
                        AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_number VARCHAR
                        (50) UNIQUE NOT NULL,
    status ENUM
                        ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL
                        (15,2) NOT NULL,
    subtotal DECIMAL
                        (15,2) NOT NULL,
    tax_amount DECIMAL
                        (15,2) DEFAULT 0,
    shipping_amount DECIMAL
                        (15,2) DEFAULT 0,
    discount_amount DECIMAL
                        (15,2) DEFAULT 0,
    payment_method VARCHAR
                        (50),
    payment_status ENUM
                        ('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    currency VARCHAR
                        (3) DEFAULT 'VND',
    
    -- Billing Address
    billing_first_name VARCHAR
                        (100),
    billing_last_name VARCHAR
                        (100),
    billing_company VARCHAR
                        (100),
    billing_address_line_1 VARCHAR
                        (255),
    billing_address_line_2 VARCHAR
                        (255),
    billing_city VARCHAR
                        (100),
    billing_state VARCHAR
                        (100),
    billing_postal_code VARCHAR
                        (20),
    billing_country VARCHAR
                        (100),
    billing_phone VARCHAR
                        (20),
    billing_email VARCHAR
                        (255),
    
    -- Shipping Address
    shipping_first_name VARCHAR
                        (100),
    shipping_last_name VARCHAR
                        (100),
    shipping_company VARCHAR
                        (100),
    shipping_address_line_1 VARCHAR
                        (255),
    shipping_address_line_2 VARCHAR
                        (255),
    shipping_city VARCHAR
                        (100),
    shipping_state VARCHAR
                        (100),
    shipping_postal_code VARCHAR
                        (20),
    shipping_country VARCHAR
                        (100),
    shipping_phone VARCHAR
                        (20),
    
    notes TEXT,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                        UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY
                        (user_id) REFERENCES users
                        (id) ON
                        DELETE
                        SET NULL
                        ,
    INDEX idx_user_id
                        (user_id),
    INDEX idx_status
                        (status),
    INDEX idx_order_number
                        (order_number),
    INDEX idx_created_at
                        (created_at)
);

                        -- Order items table
                        CREATE TABLE order_items
                        (
                            id INT
                            AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    product_name VARCHAR
                            (255) NOT NULL,
    product_sku VARCHAR
                            (100),
    quantity INT NOT NULL,
    price DECIMAL
                            (15,2) NOT NULL,
    total DECIMAL
                            (15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
                            (order_id) REFERENCES orders
                            (id) ON
                            DELETE CASCADE,
    FOREIGN KEY (product_id)
                            REFERENCES products
                            (id) ON
                            DELETE
                            SET NULL
                            ,
    INDEX idx_order_id
                            (order_id),
    INDEX idx_product_id
                            (product_id)
);

                            -- Shopping cart table
                            CREATE TABLE cart_items
                            (
                                id INT
                                AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    session_id VARCHAR
                                (255),
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL
                                (15,2) NOT NULL,
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
    INDEX idx_user_id (user_id),
    INDEX idx_session_id
                                (session_id),
    INDEX idx_product_id
                                (product_id)
);

                                -- Wishlist table
                                CREATE TABLE wishlists
                                (
                                    id INT
                                    AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
                                    (user_id) REFERENCES users
                                    (id) ON
                                    DELETE CASCADE,
    FOREIGN KEY (product_id)
                                    REFERENCES products
                                    (id) ON
                                    DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id
                                    ),
    INDEX idx_user_id
                                    (user_id),
    INDEX idx_product_id
                                    (product_id)
);

                                    -- Product reviews table
                                    CREATE TABLE product_reviews
                                    (
                                        id INT
                                        AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT,
    rating TINYINT
                                        (1) NOT NULL CHECK
                                        (rating >= 1 AND rating <= 5),
    title VARCHAR
                                        (255),
    comment TEXT,
    status ENUM
                                        ('pending', 'approved', 'rejected') DEFAULT 'pending',
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                                        UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY
                                        (product_id) REFERENCES products
                                        (id) ON
                                        DELETE CASCADE,
    FOREIGN KEY (user_id)
                                        REFERENCES users
                                        (id) ON
                                        DELETE
                                        SET NULL
                                        ,
    INDEX idx_product_id
                                        (product_id),
    INDEX idx_user_id
                                        (user_id),
    INDEX idx_status
                                        (status),
    INDEX idx_rating
                                        (rating)
);

                                        -- Coupons table
                                        CREATE TABLE coupons
                                        (
                                            id INT
                                            AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR
                                            (50) UNIQUE NOT NULL,
    type ENUM
                                            ('fixed', 'percentage') NOT NULL,
    value DECIMAL
                                            (15,2) NOT NULL,
    minimum_amount DECIMAL
                                            (15,2) DEFAULT 0,
    maximum_discount DECIMAL
                                            (15,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    expires_at TIMESTAMP NULL,
    status TINYINT
                                            (1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                                            UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status),
    INDEX idx_expires_at (expires_at)
                                            );

                                            -- Settings table for website configuration
                                            CREATE TABLE settings
                                            (
                                                id INT
                                                AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR
                                                (255) UNIQUE NOT NULL,
    value TEXT,
    type ENUM
                                                ('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
                                                UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_name (key_name)
                                                );
