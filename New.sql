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
-- Thêm trường phone vào bảng users
ALTER TABLE users ADD COLUMN phone VARCHAR(15);
-- Thêm trường address vào bảng users
ALTER TABLE users ADD COLUMN address VARCHAR(255);
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
INSERT INTO users (cccd, name, username, email, password) VALUES ('079203012345', 'Le Ba Phat', 'phatuser', 'phat@gmail.com', '123456');
SELECT * FROM users WHERE id = 2;

INSERT INTO users (id, cccd, name, username, email, password)
VALUES (2, '012345678901', 'Le Ba Phat', 'lephat', 'phat@gmail.com', '123456');
DELETE FROM users WHERE id = 4;
DELETE FROM billing_info WHERE user_id = 1;

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

-- Gợi ý mở rộng: cập nhật bảng invoices để lưu thời điểm đã thanh toán (nếu cần)
ALTER TABLE invoices ADD COLUMN paid_at TIMESTAMP;

-- Gợi ý mở rộng: cập nhật bảng invoices để lưu phương thức thanh toán (nếu muốn linh hoạt)
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

SELECT * FROM products ORDER BY id DESC;
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
select *from invoices
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

-- Cho phép NULL trong trường hợp người dùng thông thường
ALTER TABLE users ALTER COLUMN cccd DROP NOT NULL;

-- HOẶC nếu muốn giữ NOT NULL, sử dụng trigger để tự động tạo mã tạm thời
CREATE OR REPLACE FUNCTION generate_temp_cccd()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cccd IS NULL THEN
        NEW.cccd := 'TEMP' || to_char(NOW(), 'YYMMDD') || lpad(nextval('temp_cccd_seq')::text, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_temp_cccd_trigger
BEFORE INSERT ON users
FOR EACH ROW
EXECUTE PROCEDURE generate_temp_cccd();



-- Thêm cài đặt thông báo cho user_id = 1
INSERT INTO notification_settings (user_id, comments, updates, reminders, events, pages_you_follow, alert_login, alert_password)
VALUES (1, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE)
ON CONFLICT (user_id) DO UPDATE 
SET comments = EXCLUDED.comments,
    updates = EXCLUDED.updates,
    reminders = EXCLUDED.reminders,
    events = EXCLUDED.events,
    pages_you_follow = EXCLUDED.pages_you_follow,
    alert_login = EXCLUDED.alert_login,
    alert_password = EXCLUDED.alert_password;
-- 
INSERT INTO notification_settings (user_id, comments, updates, reminders, events, pages_you_follow, alert_login, alert_password)
VALUES (2, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE)
ON CONFLICT (user_id) DO UPDATE 
SET comments = EXCLUDED.comments,
    updates = EXCLUDED.updates,
    reminders = EXCLUDED.reminders,
    events = EXCLUDED.events,
    pages_you_follow = EXCLUDED.pages_you_follow,
    alert_login = EXCLUDED.alert_login,
    alert_password = EXCLUDED.alert_password;
-- 
select *FROM notification_settings
SELECT * FROM users WHERE id = 2;

-- Thêm thông tin thanh toán cho user_id = 1
INSERT INTO billing_info (user_id, is_premium, payment_method, account_number, account_name, bank_name, billing_email)
VALUES (1, FALSE, '96111222333444', '079000123456', 'NGUYEN MINH DAT', 'Techcombank', 'dat@gmail.com')
ON CONFLICT (user_id) DO UPDATE
SET is_premium = EXCLUDED.is_premium,
    payment_method = EXCLUDED.payment_method,
    account_number = EXCLUDED.account_number,
    account_name = EXCLUDED.account_name,
    bank_name = EXCLUDED.bank_name,
    billing_email = EXCLUDED.billing_email;
SELECT * FROM billing_info ORDER BY user_id ASC;

INSERT INTO billing_info (user_id, is_premium, payment_method, account_number, account_name, bank_name, billing_email)
VALUES (2, FALSE, '1026666666', '079000123456', 'LE BA PHAT', 'Vietcombank', 'phat@gmail.com')
ON CONFLICT (user_id) DO UPDATE
SET is_premium = EXCLUDED.is_premium,
    payment_method = EXCLUDED.payment_method,
    account_number = EXCLUDED.account_number,
    account_name = EXCLUDED.account_name,
    bank_name = EXCLUDED.bank_name,
    billing_email = EXCLUDED.billing_email;



	-- Tạo bảng sessions để lưu trữ phiên đăng nhập
CREATE TABLE sessions (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- Tạo chỉ mục cho phép truy vấn nhanh sessions theo thời hạn
CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");