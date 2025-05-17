$(document).ready(function() {
    const loginForm = $('#loginForm');
    const errorMessage = $('#errorMessage');
    
    // Debug thông tin ban đầu
    console.log('Trang login.html của admin đã tải');
    console.log('Thông tin localStorage hiện tại:', {
        isLoggedIn: localStorage.getItem('isLoggedIn'),
        role: localStorage.getItem('role'),
        name: localStorage.getItem('name')
    });
    
    loginForm.on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#username').val().trim();
        const password = $('#password').val().trim();
        const rememberMe = $('#rememberMe').is(':checked');
        
        // Simple validation
        if (!username || !password) {
            showError('Vui lòng nhập đầy đủ thông tin đăng nhập');
            return;
        }
        
        console.log('Gửi request đăng nhập với username:', username);
        
        // Send login request to API
        $.ajax({
            url: '/auth/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function(response) {
                console.log('Phản hồi từ server:', response);
                
                // Kiểm tra xem response có thành công không
                if (response && response.success === true) {
                    // Success - store login state in localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('role', 'admin');
                    localStorage.setItem('name', response.name || 'Administrator');
                    
                    // Always store admin session info regardless of remember me
                    sessionStorage.setItem('isAdmin', 'true');
                    sessionStorage.setItem('adminName', response.name || 'Administrator');
                      // Log for debugging
                    console.log('Đăng nhập admin thành công!');
                    console.log('localStorage đã cập nhật:', {
                        isLoggedIn: localStorage.getItem('isLoggedIn'),
                        role: localStorage.getItem('role'),
                        name: localStorage.getItem('name')
                    });
                    
                    // Redirect to admin dashboard or previously attempted page
                    const redirectUrl = sessionStorage.getItem('adminRedirectUrl') || '/Page/admin/index.html';
                    window.location.href = redirectUrl;
                } else {
                    // Server returned success: false
                    showError('Phản hồi từ server không hợp lệ');
                    console.error('Server response missing success flag:', response);
                }
            },
            error: function(xhr) {
                console.error('Lỗi khi đăng nhập:', xhr.status, xhr.statusText);
                
                // Failed login
                let message = 'Tên đăng nhập hoặc mật khẩu không đúng!';
                
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        message = response.message;
                    }
                } catch (e) {
                    console.error('Không thể phân tích phản hồi từ server:', e);
                }
                
                showError(message);
                $('#password').val('').focus();
            }
        });
    });
    
    function showError(message) {
        errorMessage.text(message).fadeIn();
        
        // Hide error after 3 seconds
        setTimeout(function() {
            errorMessage.fadeOut();
        }, 3000);
    }
    
    // Check if user is already logged in as admin
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const role = localStorage.getItem('role');
        const isAdminSession = sessionStorage.getItem('isAdmin') === 'true';
        
        console.log('Kiểm tra trạng thái đăng nhập admin:');
        console.log('- localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));
        console.log('- localStorage.role:', localStorage.getItem('role'));
        console.log('- sessionStorage.isAdmin:', sessionStorage.getItem('isAdmin'));
        
        // Trường hợp đã đăng nhập với quyền admin
        if ((isLoggedIn && role === 'admin') || isAdminSession) {
            console.log('Đã đăng nhập với quyền admin, chuyển hướng đến trang chính');
            
            // Đảm bảo thông tin đăng nhập đầy đủ trong localStorage
            if (!isLoggedIn || role !== 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', 'admin');
                localStorage.setItem('name', sessionStorage.getItem('adminName') || 'Administrator');
            }
            
            // Chuyển đến trang được lưu trước đó hoặc trang admin chính
            const redirectUrl = sessionStorage.getItem('adminRedirectUrl') || '/Page/admin/index.html';
            window.location.href = redirectUrl;
        } else if (isLoggedIn && role !== 'admin') {
            console.log('Đã đăng nhập nhưng không phải quyền admin');
            // Không xóa thông tin đăng nhập người dùng, chỉ hiển thị thông báo
            showError('Tài khoản của bạn không có quyền admin');
        }
    }
      // Check login status when page loads
    checkLoginStatus();
});
