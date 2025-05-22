# Hướng dẫn cập nhật CCCD và chức năng người bán

## 1. Các thay đổi đã thực hiện

Chúng tôi đã cập nhật hệ thống để hỗ trợ CCCD không bắt buộc khi đăng ký, với các thay đổi sau:

1. Sửa đổi cơ sở dữ liệu để cho phép CCCD là NULL
2. Tạo CCCD tạm thời cho người dùng đăng ký không có CCCD
3. Thêm giao diện để người dùng cập nhật CCCD sau khi đăng ký
4. Thêm chức năng đăng ký người bán với yêu cầu CCCD hợp lệ

## 2. Hướng dẫn cập nhật cơ sở dữ liệu

### 2.1. Chạy script SQL để loại bỏ ràng buộc NOT NULL

Đã chạy câu lệnh này:

```sql
ALTER TABLE users ALTER COLUMN cccd DROP NOT NULL;
```

### 2.2. Chạy script để thêm bảng seller_info và các cột liên quan

Chạy file `update_seller_tables.sql` bằng cách:

```
psql -U [tên_người_dùng] -d [tên_database] -f update_seller_tables.sql
```

Hoặc mở file trong pgAdmin và thực thi script.

## 3. Các API mới

- `/users/update-cccd` - Cập nhật CCCD cho người dùng
- `/users/update-profile` - Cập nhật thông tin profile bao gồm cả CCCD
- `/users/register-seller` - Đăng ký trở thành người bán

## 4. Cách kiểm tra

1. Đăng ký người dùng mới không cung cấp CCCD
2. Kiểm tra CCCD được tạo tạm thời trong hệ thống
3. Đăng nhập và cập nhật CCCD trong trang cài đặt tài khoản
4. Thử đăng ký làm người bán

## 5. Các file đã được thay đổi

- `server/routes/userRegister.js`
- `server/routes/userAuth.js`
- `server/routes/userUpdate.js` (mới)
- `JS/login.js`
- `JS/fixDisplay.js` 
- `JS/register.js`
- `Page/accountsetting.html`
- `Page/login.html`
- `server/app.js`
- `update_seller_tables.sql` (mới)
