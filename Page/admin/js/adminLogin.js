$(document).ready(function() {
    const loginForm = $('#loginForm');
    const errorMessage = $('#errorMessage');
    
    // Temporary admin credentials for demonstration
    const adminUser = {
        username: 'admin',
        password: 'admin123'
    };
    
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
        
        // Check credentials (in a real app, this would be an API call)
        if (username === adminUser.username && password === adminUser.password) {
            // Success - store login state if remember me is checked
            if (rememberMe) {
                localStorage.setItem('isLoggedIn', 'true');
            } else {
                sessionStorage.setItem('isLoggedIn', 'true');
            }
            
            // Redirect to admin dashboard
            window.location.href = 'index.html';
        } else {
            // Failed login
            showError('Tên đăng nhập hoặc mật khẩu không đúng!');
            $('#password').val('').focus();
        }
    });
    
    function showError(message) {
        errorMessage.text(message).fadeIn();
        
        // Hide error after 3 seconds
        setTimeout(function() {
            errorMessage.fadeOut();
        }, 3000);
    }
    
    // Check if user is already logged in
    function checkLoginStatus() {
        if (localStorage.getItem('isLoggedIn') === 'true' || 
            sessionStorage.getItem('isLoggedIn') === 'true') {
            window.location.href = 'index.html';
        }
    }
    
    // Check login status when page loads
    checkLoginStatus();
});