# Hướng Dẫn Kiểm Tra Xác Thực Session

## Các công cụ kiểm tra

Đây là trang thử nghiệm để kiểm tra hệ thống xác thực session. Trang này cho phép bạn kiểm tra các chức năng cơ bản của session như đăng nhập, đăng xuất, kiểm tra trạng thái session và quan sát hành vi của session.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Xác Thực Session</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { padding: 20px; }
        .card { margin-bottom: 20px; }
        .debug-output { background: #f8f9fa; border: 1px solid #ddd; padding: 15px; height: 200px; overflow-y: auto; }
        .debug-output pre { margin: 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="my-4">Trang Kiểm Tra Xác Thực Session</h1>
        
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">Đăng Nhập</div>
                    <div class="card-body">
                        <form id="login-form">
                            <div class="mb-3">
                                <label for="username" class="form-label">Tên đăng nhập:</label>
                                <input type="text" class="form-control" id="username" value="datuser">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Mật khẩu:</label>
                                <input type="password" class="form-control" id="password" value="123456">
                            </div>
                            <button type="submit" class="btn btn-primary">Đăng Nhập</button>
                        </form>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">Kiểm Tra Session</div>
                    <div class="card-body">
                        <button id="check-session" class="btn btn-info">Kiểm Tra Session</button>
                        <button id="check-storage" class="btn btn-secondary ms-2">Kiểm Tra Storage</button>
                        <button id="check-cookies" class="btn btn-warning ms-2">Kiểm Tra Cookies</button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">Đăng Xuất</div>
                    <div class="card-body">
                        <button id="logout" class="btn btn-danger">Đăng Xuất</button>
                        <button id="clear-all" class="btn btn-outline-danger ms-2">Xóa Mọi Dữ Liệu</button>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="card h-100">
                    <div class="card-header">Kết Quả Debug</div>
                    <div class="card-body">
                        <div class="debug-output" id="output">
                            <pre>// Kết quả sẽ hiện ở đây...</pre>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button id="clear-output" class="btn btn-sm btn-secondary">Xóa Output</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Outputs debug info
        function debug(message, data = null) {
            const output = document.getElementById('output');
            const time = new Date().toLocaleTimeString();
            
            let html = `<div>[${time}] ${message}</div>`;
            if (data) {
                if (typeof data === 'object') {
                    html += `<pre>${JSON.stringify(data, null, 2)}</pre>`;
                } else {
                    html += `<pre>${data}</pre>`;
                }
            }
            
            output.innerHTML = html + output.innerHTML;
        }
        
        // Login
        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            debug('Đang đăng nhập...', { username, password: '******' });
            
            try {
                const response = await fetch('/session/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });
                
                const data = await response.json();
                debug('Kết quả đăng nhập:', data);
                
                if (data.success) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('role', data.role || 'buyer');
                    localStorage.setItem('useSession', 'true');
                    localStorage.setItem('user', JSON.stringify(data.user));
                    debug('Đã lưu dữ liệu vào localStorage');
                }
            } catch (error) {
                debug('Lỗi đăng nhập:', error.message);
            }
        });
        
        // Check session
        document.getElementById('check-session').addEventListener('click', async function() {
            debug('Đang kiểm tra session...');
            
            try {
                const response = await fetch('/session/status', {
                    credentials: 'include'
                });
                
                const data = await response.json();
                debug('Trạng thái session:', data);
            } catch (error) {
                debug('Lỗi kiểm tra session:', error.message);
            }
        });
        
        // Check storage
        document.getElementById('check-storage').addEventListener('click', function() {
            debug('Kiểm tra localStorage:');
            
            const storage = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                try {
                    // Try to parse as JSON
                    storage[key] = JSON.parse(localStorage.getItem(key));
                } catch (e) {
                    // If not JSON, store as string
                    storage[key] = localStorage.getItem(key);
                }
            }
            
            debug('Dữ liệu localStorage:', storage);
        });
        
        // Check cookies
        document.getElementById('check-cookies').addEventListener('click', function() {
            debug('Kiểm tra cookies:');
            
            const cookies = document.cookie.split(';')
                .map(cookie => cookie.trim())
                .reduce((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    acc[name] = value;
                    return acc;
                }, {});
            
            debug('Cookies hiện tại:', cookies);
        });
        
        // Logout
        document.getElementById('logout').addEventListener('click', async function() {
            debug('Đang đăng xuất...');
            
            try {
                const response = await fetch('/session/logout', {
                    method: 'GET',
                    credentials: 'include'
                });
                
                const data = await response.json();
                debug('Kết quả đăng xuất:', data);
                
                if (data.success) {
                    localStorage.clear();
                    debug('Đã xóa localStorage');
                }
            } catch (error) {
                debug('Lỗi đăng xuất:', error.message);
            }
        });
        
        // Clear all data
        document.getElementById('clear-all').addEventListener('click', function() {
            debug('Xóa tất cả dữ liệu...');
            
            // Clear localStorage
            localStorage.clear();
            
            // Clear cookies
            document.cookie.split(';').forEach(function(c) {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            
            debug('Đã xóa tất cả dữ liệu localStorage và cookies');
        });
        
        // Clear output
        document.getElementById('clear-output').addEventListener('click', function() {
            document.getElementById('output').innerHTML = '';
        });
        
        // Initial debug
        window.addEventListener('DOMContentLoaded', function() {
            debug('Trang test đã sẵn sàng', { 
                page: window.location.pathname,
                time: new Date().toLocaleString()
            });
        });
    </script>
</body>
</html>
```

## Các bước kiểm tra

1. **Đăng nhập và kiểm tra session**:
   - Mở trang test
   - Điền thông tin đăng nhập và nhấn "Đăng Nhập"
   - Nhấn "Kiểm Tra Session" để xem session đã được tạo chưa
   - Nhấn "Kiểm Tra Storage" để xem thông tin người dùng đã được lưu chưa

2. **Kiểm tra đăng xuất**:
   - Nhấn "Đăng Xuất"
   - Nhấn "Kiểm Tra Session" để đảm bảo session đã bị xóa
   - Nhấn "Kiểm Tra Storage" để đảm bảo localStorage đã được xóa
   - Nhấn "Kiểm Tra Cookies" để đảm bảo cookies đã được xóa

3. **Kiểm tra trạng thái trang sau đăng xuất**:
   - Sau khi đăng xuất, quay lại trang chính
   - Đảm bảo người dùng được chuyển đến trang đăng nhập
   - Đảm bảo thông tin người dùng không còn được hiển thị

4. **Kiểm tra độ bền của session**:
   - Đăng nhập và đóng trình duyệt
   - Mở lại trình duyệt và vào lại trang
   - Nhấn "Kiểm Tra Session" để xem session vẫn còn hay không

5. **Kiểm tra auto-logout khi hết hạn session**:
   - Đăng nhập và đợi hơn 24 giờ (hoặc thời gian cấu hình trong server)
   - Quay lại trang và kiểm tra session
   - Đảm bảo người dùng đã bị đăng xuất tự động

## Sửa lỗi phổ biến

### Lỗi: Cookie không được gửi đi
**Nguyên nhân**: Thiếu `credentials: 'include'` trong fetch API
**Sửa**: Thêm `credentials: 'include'` vào tất cả các request fetch

### Lỗi: CORS không cho phép credentials
**Nguyên nhân**: Cấu hình CORS chưa cho phép credentials
**Sửa**: Trong app.js, đảm bảo CORS được cấu hình:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Lỗi: Session vẫn còn sau khi đăng xuất
**Nguyên nhân**: Cookie không bị xóa hoặc session không bị hủy
**Sửa**: 
- Trong route logout, thêm `res.clearCookie('connect.sid');`
- Xóa cookie bằng JavaScript ở client:
```javascript
document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### Lỗi: Người dùng vẫn xuất hiện đã đăng nhập sau logout
**Nguyên nhân**: localStorage không bị xóa
**Sửa**: 
- Đảm bảo gọi `localStorage.clear()` sau khi logout
- Sử dụng cookieCleaner để xóa triệt để:
```javascript
if (window.cookieCleaner) {
  window.cookieCleaner.clearAllLoginData();
}
```
