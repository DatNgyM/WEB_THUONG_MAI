-- Bảng người dùng (định danh bằng CCCD thay vì ID nội bộ)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    cccd VARCHAR(20) UNIQUE NOT NULL,                    -- Số căn cước công dân giả lập
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Bảng vai trò & trạng thái đăng ký bán hàng của người dùng
CREATE TABLE user_roles (
    cccd VARCHAR(20) PRIMARY KEY REFERENCES users(cccd), -- Liên kết bằng CCCD
    role VARCHAR(20) DEFAULT 'buyer',                    -- Các vai trò: buyer, seller, admin
    is_verified BOOLEAN DEFAULT FALSE,                   -- Đã duyệt làm seller hay chưa
    request_seller BOOLEAN DEFAULT FALSE,                 -- Đã gửi yêu cầu làm seller chưa
	is_premium BOOLEAN DEFAULT FALSE
);

-- Ví dụ thêm dữ liệu người dùng & vai trò
INSERT INTO users (cccd, name, username, email, password) VALUES ('079203001234', 'Nguyen Minh Dat', 'datuser', 'dat@gmail.com', '123456');

-- . Tạo bảng admin
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);
-- . Tạo bảng notification_settings
CREATE TABLE notification_settings (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  comments BOOLEAN DEFAULT FALSE,
  updates BOOLEAN DEFAULT FALSE,
  reminders BOOLEAN DEFAULT FALSE,
  events BOOLEAN DEFAULT FALSE,
  pages_you_follow BOOLEAN DEFAULT FALSE,
  alert_login BOOLEAN DEFAULT FALSE,
  alert_password BOOLEAN DEFAULT FALSE
);

-- 7. Tạo bảng billing_info

CREATE TABLE billing_info (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  is_premium BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  account_number TEXT,
  account_name TEXT,
  bank_name TEXT,
  billing_email TEXT
);

SELECT * FROM users 
ORDER BY id ASC;




-- Truy vấn bảng admins
SELECT * FROM admins;
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- Truy vấn bảng notification_settings
SELECT * FROM notification_settings;

-- Truy vấn bảng billing_info
SELECT * FROM billing_info;

SELECT * FROM admins WHERE username = 'admin@gmail.com' AND password = 'admin123';



-- 9. Gợi ý mở rộng: cập nhật bảng invoices để lưu thời điểm đã thanh toán (nếu cần)
ALTER TABLE invoices ADD COLUMN paid_at TIMESTAMP;

-- 10. Gợi ý mở rộng: cập nhật bảng invoices để lưu phương thức thanh toán (nếu muốn linh hoạt)
ALTER TABLE invoices ADD COLUMN payment_method VARCHAR(50);


-- DỮ LIỆU HÓA ĐƠN & SẢN PHẨM GỘP ĐƠN HÀNG

-- 1. Tạo bảng sản phẩm
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    seller_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id)
);
ALTER TABLE products ADD COLUMN image VARCHAR(255);
Select *from products;
-- Thêm sản phẩm với hình ảnh
INSERT INTO products (name, description, price, stock_quantity, seller_id, image)
VALUES ('iPhone 16 Pro', 'Iphone 16 Pro Bản Mỹ', 28000000.00, 20, 1, 'iphone-16-pro-max-titan.jpg');
-- 2. Tạo bảng hóa đơn (đã gộp cả thông tin đơn hàng)
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    invoice_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    order_status VARCHAR(20) CHECK (order_status IN ('processing', 'shipping', 'delivered', 'canceled')) DEFAULT 'processing',
    shipping_address VARCHAR(255),
    billing_address VARCHAR(255),
    paid_at TIMESTAMP,
    payment_method VARCHAR(50),
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- 3. Bảng chi tiết hóa đơn (sản phẩm trong từng hóa đơn)
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 4. Phiên thanh toán: gom nhiều hóa đơn lại
CREATE TABLE payment_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Chi tiết các hóa đơn trong phiên thanh toán
CREATE TABLE payment_session_details (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    invoice_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES payment_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);
