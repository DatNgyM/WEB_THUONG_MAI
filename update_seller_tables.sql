
-- Tạo bảng seller_info nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS seller_info (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    shop_name VARCHAR(100) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    tax_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    approved_at TIMESTAMP,
    rating DECIMAL(3,2) DEFAULT 0
);

-- Đảm bảo có cột request_seller trong bảng users
ALTER TABLE users ADD COLUMN IF NOT EXISTS request_seller BOOLEAN DEFAULT FALSE;

-- Thêm index để tìm kiếm nhanh
CREATE INDEX IF NOT EXISTS idx_seller_info_user_id ON seller_info(user_id);
CREATE INDEX IF NOT EXISTS idx_users_cccd ON users(cccd) WHERE cccd IS NOT NULL;

-- Thêm constraint đảm bảo rằng shop_name là duy nhất
ALTER TABLE seller_info DROP CONSTRAINT IF EXISTS unique_shop_name;
ALTER TABLE seller_info ADD CONSTRAINT unique_shop_name UNIQUE (shop_name);
