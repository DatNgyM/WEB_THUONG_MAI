-- Sample Data for E-commerce Database
-- Created: June 22, 2025
USE ecommerce_db;

-- Insert Categories
INSERT INTO categories
    (name, slug, description, image, sort_order)
VALUES
    ('Điện thoại', 'dien-thoai', 'Điện thoại thông minh các loại', 'images/categories/phones.jpg', 1),
    ('Laptop', 'laptop', 'Máy tính xách tay, laptop gaming', 'images/categories/laptops.jpg', 2),
    ('Đồng hồ', 'dong-ho', 'Đồng hồ thông minh và truyền thống', 'images/categories/watches.jpg', 3),
    ('Phụ kiện', 'phu-kien', 'Phụ kiện điện tử, tai nghe, cáp sạc', 'images/categories/accessories.jpg', 4),
    ('Máy tính bảng', 'may-tinh-bang', 'iPad, Android tablet', 'images/categories/tablets.jpg', 5);

-- Insert Products
INSERT INTO products
    (name, slug, description, short_description, sku, price, sale_price, stock_quantity, category_id, brand, featured)
VALUES
    ('iPhone 16 Pro Max', 'iphone-16-pro-max', 'iPhone 16 Pro Max với chip A18 Bionic mạnh mẽ, camera 48MP, màn hình Super Retina XDR 6.9 inch. Thiết kế titan sang trọng, bền bỉ.', 'iPhone 16 Pro Max - Đỉnh cao công nghệ Apple', 'IP16PM001', 32990000, 29990000, 50, 1, 'Apple', 1),
    ('iPhone 16 Pro', 'iphone-16-pro', 'iPhone 16 Pro với chip A18 Bionic, camera 48MP, màn hình 6.3 inch. Hiệu năng vượt trội, thiết kế premium.', 'iPhone 16 Pro - Hiệu năng đỉnh cao', 'IP16P001', 28990000, 26990000, 40, 1, 'Apple', 1),
    ('MacBook Pro 14 inch M4', 'macbook-pro-14-m4', 'MacBook Pro 14 inch với chip M4 mạnh mẽ, RAM 16GB, SSD 512GB. Màn hình Liquid Retina XDR, thời lượng pin cả ngày.', 'MacBook Pro M4 - Sức mạnh chuyên nghiệp', 'MBP14M4001', 52990000, 49990000, 25, 2, 'Apple', 1),
    ('MacBook Air 13 inch M3', 'macbook-air-13-m3', 'MacBook Air 13 inch với chip M3, thiết kế siêu mỏng nhẹ, thời lượng pin 18 giờ. Lý tưởng cho công việc hàng ngày.', 'MacBook Air M3 - Mỏng nhẹ, hiệu năng cao', 'MBA13M3001', 28990000, 26990000, 35, 2, 'Apple', 1),
    ('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'Apple Watch Ultra 2 với vỏ Titanium 49mm, GPS + Cellular. Thiết kế siêu bền, pin 36 giờ, lý tưởng cho thể thao.', 'Apple Watch Ultra 2 - Đồng hồ thể thao cao cấp', 'AWU2001', 19990000, 18990000, 20, 3, 'Apple', 1),
    ('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Galaxy S24 Ultra với bút S Pen, camera 200MP, chip Snapdragon 8 Gen 3. Màn hình Dynamic AMOLED 6.8 inch.', 'Galaxy S24 Ultra - Flagship Android', 'SGS24U001', 29990000, 27990000, 30, 1, 'Samsung', 1),
    ('Dell XPS 13', 'dell-xps-13', 'Dell XPS 13 với Intel Core i7 thế hệ 13, RAM 16GB, SSD 512GB. Thiết kế premium, màn hình InfinityEdge.', 'Dell XPS 13 - Ultrabook cao cấp', 'DXPS13001', 25990000, 23990000, 15, 2, 'Dell', 0),
    ('MSI Gaming Laptop', 'msi-gaming-laptop', 'MSI Gaming Laptop với RTX 4060, Intel i7, RAM 16GB, SSD 1TB. Lý tưởng cho gaming và đồ họa.', 'MSI Gaming - Laptop chơi game chuyên nghiệp', 'MSIGAME001', 32990000, 29990000, 12, 2, 'MSI', 1),
    ('AirPods Pro 2', 'airpods-pro-2', 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động thế hệ mới, hộp sạc MagSafe.', 'AirPods Pro 2 - Tai nghe không dây cao cấp', 'APP2001', 5990000, 5490000, 60, 4, 'Apple', 0),
    ('iPad Air 11 inch', 'ipad-air-11', 'iPad Air 11 inch với chip M2, màn hình Liquid Retina, hỗ trợ Apple Pencil thế hệ 2.', 'iPad Air - Máy tính bảng đa năng', 'IPA11001', 16990000, 15990000, 25, 5, 'Apple', 0);

-- Insert Product Images
INSERT INTO product_images
    (product_id, image_path, alt_text, sort_order, is_primary)
VALUES
    (1, 'images/products/iphone-16-pro-max-1.jpg', 'iPhone 16 Pro Max - Ảnh chính', 1, 1),
    (1, 'images/products/iphone-16-pro-max-2.jpg', 'iPhone 16 Pro Max - Ảnh 2', 2, 0),
    (1, 'images/products/iphone-16-pro-max-3.jpg', 'iPhone 16 Pro Max - Ảnh 3', 3, 0),
    (1, 'images/products/iphone-16-pro-max-4.jpg', 'iPhone 16 Pro Max - Ảnh 4', 4, 0),
    (2, 'images/products/iphone-16-pro-1.jpg', 'iPhone 16 Pro - Ảnh chính', 1, 1),
    (2, 'images/products/iphone-16-pro-2.jpg', 'iPhone 16 Pro - Ảnh 2', 2, 0),
    (3, 'images/products/macbook-pro-14-m4-1.jpg', 'MacBook Pro 14 M4 - Ảnh chính', 1, 1),
    (3, 'images/products/macbook-pro-14-m4-2.jpg', 'MacBook Pro 14 M4 - Ảnh 2', 2, 0),
    (4, 'images/products/macbook-air-13-m3-1.jpg', 'MacBook Air 13 M3 - Ảnh chính', 1, 1),
    (5, 'images/products/apple-watch-ultra-2-1.jpg', 'Apple Watch Ultra 2 - Ảnh chính', 1, 1),
    (6, 'images/products/samsung-s24-ultra-1.jpg', 'Samsung Galaxy S24 Ultra - Ảnh chính', 1, 1),
    (7, 'images/products/dell-xps-13-1.jpg', 'Dell XPS 13 - Ảnh chính', 1, 1),
    (8, 'images/products/msi-gaming-1.jpg', 'MSI Gaming Laptop - Ảnh chính', 1, 1),
    (9, 'images/products/airpods-pro-2-1.jpg', 'AirPods Pro 2 - Ảnh chính', 1, 1),
    (10, 'images/products/ipad-air-11-1.jpg', 'iPad Air 11 - Ảnh chính', 1, 1);

-- Insert Users (Password: 123456 - hashed with password_hash())
INSERT INTO users
    (username, email, password, first_name, last_name, phone, role)
VALUES
    ('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', '0123456789', 'admin'),
    ('customer1', 'customer1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn', 'Văn A', '0987654321', 'customer'),
    ('customer2', 'customer2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần', 'Thị B', '0912345678', 'customer'),
    ('seller1', 'seller1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Shop', 'Technology', '0901234567', 'seller'),
    ('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', '0123456700', 'customer');

-- Insert User Addresses
INSERT INTO user_addresses
    (user_id, type, first_name, last_name, address_line_1, city, state, postal_code, phone, is_default)
VALUES
    (2, 'shipping', 'Nguyễn', 'Văn A', '123 Đường ABC, Phường XYZ', 'Hồ Chí Minh', 'Hồ Chí Minh', '70000', '0987654321', 1),
    (2, 'billing', 'Nguyễn', 'Văn A', '123 Đường ABC, Phường XYZ', 'Hồ Chí Minh', 'Hồ Chí Minh', '70000', '0987654321', 1),
    (3, 'shipping', 'Trần', 'Thị B', '456 Đường DEF, Phường UVW', 'Hà Nội', 'Hà Nội', '10000', '0912345678', 1);

-- Insert Sample Orders
INSERT INTO orders
    (user_id, order_number, status, total_amount, subtotal, payment_method, payment_status, billing_first_name, billing_last_name, billing_address_line_1, billing_city, billing_phone, billing_email, shipping_first_name, shipping_last_name, shipping_address_line_1, shipping_city, shipping_phone)
VALUES
    (2, 'ORD001', 'delivered', 32990000, 32990000, 'credit_card', 'paid', 'Nguyễn', 'Văn A', '123 Đường ABC, Phường XYZ', 'Hồ Chí Minh', '0987654321', 'customer1@example.com', 'Nguyễn', 'Văn A', '123 Đường ABC, Phường XYZ', 'Hồ Chí Minh', '0987654321'),
    (3, 'ORD002', 'processing', 52990000, 52990000, 'bank_transfer', 'paid', 'Trần', 'Thị B', '456 Đường DEF, Phường UVW', 'Hà Nội', '0912345678', 'customer2@example.com', 'Trần', 'Thị B', '456 Đường DEF, Phường UVW', 'Hà Nội', '0912345678');

-- Insert Order Items
INSERT INTO order_items
    (order_id, product_id, product_name, product_sku, quantity, price, total)
VALUES
    (1, 1, 'iPhone 16 Pro Max', 'IP16PM001', 1, 32990000, 32990000),
    (2, 3, 'MacBook Pro 14 inch M4', 'MBP14M4001', 1, 52990000, 52990000);

-- Insert Sample Reviews
INSERT INTO product_reviews
    (product_id, user_id, rating, title, comment, status)
VALUES
    (1, 2, 5, 'Tuyệt vời!', 'iPhone 16 Pro Max thật sự xuất sắc, camera chụp ảnh rất đẹp, hiệu năng mượt mà.', 'approved'),
    (1, 3, 4, 'Rất tốt', 'Sản phẩm chất lượng, giao hàng nhanh. Giá hơi cao nhưng xứng đáng.', 'approved'),
    (3, 2, 5, 'MacBook tuyệt vời', 'Chip M4 thật sự mạnh mẽ, xử lý video rất nhanh. Thiết kế đẹp và bền.', 'approved');

-- Insert Settings
INSERT INTO settings
    (key_name, value, type, description)
VALUES
    ('site_name', 'Website Thương Mại', 'string', 'Tên website'),
    ('site_description', 'Cửa hàng điện tử trực tuyến uy tín', 'string', 'Mô tả website'),
    ('contact_email', 'contact@example.com', 'string', 'Email liên hệ'),
    ('contact_phone', '0123456789', 'string', 'Số điện thoại liên hệ'),
    ('currency', 'VND', 'string', 'Đơn vị tiền tệ'),
    ('tax_rate', '10', 'number', 'Thuế VAT (%)'),
    ('shipping_fee', '30000', 'number', 'Phí giao hàng cố định'),
    ('free_shipping_threshold', '500000', 'number', 'Miễn phí ship từ số tiền'),
    ('products_per_page', '12', 'number', 'Số sản phẩm mỗi trang'),
    ('enable_reviews', '1', 'boolean', 'Cho phép đánh giá sản phẩm');

-- Insert Coupons
INSERT INTO coupons
    (code, type, value, minimum_amount, usage_limit, expires_at)
VALUES
    ('WELCOME10', 'percentage', 10, 500000, 100, '2025-12-31 23:59:59'),
    ('SAVE50K', 'fixed', 50000, 1000000, 50, '2025-12-31 23:59:59'),
    ('FREESHIP', 'fixed', 30000, 300000, 200, '2025-12-31 23:59:59');
