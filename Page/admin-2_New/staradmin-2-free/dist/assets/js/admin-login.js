document.addEventListener('DOMContentLoaded', function() {
    // Lấy form đăng nhập
    const loginForm = document.querySelector('#admin-login-form');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Lấy giá trị input
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password) {
            showError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            // Gửi request đăng nhập admin
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await res.json();

            if (result.success) {
                // Lưu thông tin vào localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', 'admin');
                localStorage.setItem('name', result.name || 'Admin');

                // Chuyển hướng đến trang admin dashboard
                window.location.href = '/Page/admin-2_New/staradmin-2-free/dist/index.html';
            } else {
                showError(result.message || 'Sai tài khoản hoặc mật khẩu admin!');
            }
        } catch (err) {
            showError('Lỗi kết nối server!');
            console.error(err);
        }
    });

    // Hiển thị thông báo lỗi
    function showError(message) {
        // Kiểm tra xem có thẻ hiển thị lỗi hay chưa
        let errorElement = document.querySelector('.login-error');
        
        if (!errorElement) {
            // Nếu chưa có, tạo mới
            errorElement = document.createElement('div');
            errorElement.className = 'login-error text-danger mt-3';
            loginForm.appendChild(errorElement);
        }
        
        // Hiển thị thông báo
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Ẩn sau 3 giây
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }
});
