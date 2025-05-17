// checkAdmin_debug.js - Phiên bản cải tiến để gỡ lỗi đăng nhập admin
window.addEventListener('DOMContentLoaded', () => {
    // Thêm thông tin debug
    console.log('=== KIỂM TRA QUYỀN ADMIN ===');
    console.log('URL hiện tại:', window.location.href);
    console.log('Thông tin đăng nhập:');
    console.log('- localStorage.isLoggedIn:', localStorage.getItem('isLoggedIn'));
    console.log('- localStorage.role:', localStorage.getItem('role'));
    console.log('- localStorage.name:', localStorage.getItem('name'));
    console.log('- sessionStorage.isAdmin:', sessionStorage.getItem('isAdmin'));

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    
    // Đây là cách kiểm tra thêm từ sessionStorage nếu localStorage bị thiếu thông tin
    if (!isLoggedIn && sessionStorage.getItem('isAdmin') === 'true') {
        console.log('Khôi phục thông tin admin từ sessionStorage');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'admin');
        localStorage.setItem('name', sessionStorage.getItem('adminName') || 'Administrator');
        console.log('Đã khôi phục xong!');
    }
  
    // Trường hợp đang ở trang login admin
    if (window.location.pathname.includes('/admin/login.html')) {
        console.log('Đang ở trang login admin, kiểm tra nếu đã đăng nhập');
        // Nếu đã đăng nhập admin, chuyển sang trang admin
        if ((isLoggedIn === 'true' && role === 'admin') || 
            sessionStorage.getItem('isAdmin') === 'true') {
            console.log('Đã đăng nhập với quyền admin, chuyển hướng đến trang chính');
            window.location.href = '/Page/admin/index.html';
        } else {
            console.log('Chưa đăng nhập, giữ nguyên ở trang login');
        }
        return;
    }
  
    // Kiểm tra quyền admin cho các trang admin khác
    if ((isLoggedIn !== 'true' || role !== 'admin') && 
        sessionStorage.getItem('isAdmin') !== 'true') {
        console.log('Không đủ quyền truy cập trang admin');
      
        // Thông báo không đủ quyền
        const message = 'Bạn chưa đăng nhập với quyền admin!';
        alert(message);
        console.log(message);
      
        // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
        const currentUrl = window.location.href;
        sessionStorage.setItem('adminRedirectUrl', currentUrl);
        console.log('Đã lưu URL để chuyển hướng sau khi đăng nhập:', currentUrl);
      
        // Chuyển đến trang đăng nhập admin
        const loginUrl = '/Page/admin/login.html';
        console.log('Chuyển hướng đến:', loginUrl);
        window.location.href = loginUrl;
    } else {
        console.log('Đã xác thực quyền admin thành công ✓');
    }
});
