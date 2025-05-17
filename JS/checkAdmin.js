// JS/checkAdmin.js
window.addEventListener('DOMContentLoaded', () => {
    // Thêm thông tin debug
    console.log('Kiểm tra quyền admin:');
    console.log('- isLoggedIn:', localStorage.getItem('isLoggedIn'));
    console.log('- role:', localStorage.getItem('role'));
    console.log('- name:', localStorage.getItem('name'));

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    
    // Đây là cách kiểm tra thêm từ sessionStorage nếu localStorage bị thiếu thông tin
    if (!isLoggedIn && sessionStorage.getItem('isAdmin') === 'true') {
      console.log('Khôi phục thông tin admin từ sessionStorage');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('name', sessionStorage.getItem('adminName') || 'Administrator');
    }
  
    // Trường hợp đang ở trang login admin
    if (window.location.pathname.includes('/admin/login.html')) {
      // Nếu đã đăng nhập admin, chuyển sang trang admin
      if ((isLoggedIn === 'true' && role === 'admin') || 
          sessionStorage.getItem('isAdmin') === 'true') {
        window.location.href = '/Page/admin/index.html';
      }
      return;
    }
  
    // Kiểm tra quyền admin cho các trang admin khác
    if ((isLoggedIn !== 'true' || role !== 'admin') && 
        sessionStorage.getItem('isAdmin') !== 'true') {
      console.log('Không đủ quyền truy cập trang admin');
      alert('Bạn chưa đăng nhập với quyền admin!');
      
      // Lưu URL hiện tại để sau khi đăng nhập có thể quay lại
      sessionStorage.setItem('adminRedirectUrl', window.location.href);
      
      // Chuyển đến trang đăng nhập admin (không phải trang đăng nhập người dùng thông thường)
      window.location.href = '/Page/admin/login.html';
    } else {
      console.log('Đã xác thực quyền admin thành công');
    }
  });
  