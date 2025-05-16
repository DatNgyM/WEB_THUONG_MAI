document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu đã đăng nhập và có quyền admin
    function checkAdminAuth() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const role = localStorage.getItem('role');
        
        if (!isLoggedIn || role !== 'admin') {
            // Nếu không phải admin hoặc chưa đăng nhập, redirect về trang login
            window.location.href = '/Page/admin-2_New/staradmin-2-free/dist/pages/samples/login.html';
        } else {
            // Hiển thị tên admin nếu có
            const adminName = localStorage.getItem('name') || 'Admin';
            const adminNameElements = document.querySelectorAll('.admin-name');
            if (adminNameElements) {
                adminNameElements.forEach(element => {
                    element.textContent = adminName;
                });
            }
        }
    }

    // Xử lý đăng xuất
    function setupLogout() {
        const logoutButtons = document.querySelectorAll('.logout-btn');
        if (logoutButtons) {
            logoutButtons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Xóa thông tin đăng nhập
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('role');
                    localStorage.removeItem('name');
                    // Chuyển hướng về trang login
                    window.location.href = '/Page/admin-2_New/staradmin-2-free/dist/pages/samples/login.html';
                });
            });
        }
    }
    
    // Gọi các hàm
    checkAdminAuth();
    setupLogout();
});
