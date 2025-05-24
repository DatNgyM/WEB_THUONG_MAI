/**
 * Tool Debug cho Session Authentication
 * Sử dụng tool này để kiểm tra và sửa các vấn đề với xác thực session
 */

// Hiển thị thông tin debug khi trang tải
console.log('%c Debug Tool cho Session Authentication', 'color: blue; font-size: 16px; font-weight: bold');

// Công cụ debug cho authentication
window.debugAuth = {
  // Kiểm tra trạng thái localStorage
  checkLocalStorage() {
    console.log('%c ----- THÔNG TIN LOCALSTORAGE -----', 'color: green');
    console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
    console.log('role:', localStorage.getItem('role'));
    console.log('name:', localStorage.getItem('name'));
    console.log('useSession:', localStorage.getItem('useSession'));
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('user:', user);
    } catch (e) {
      console.log('Lỗi khi parse user:', e);
    }
    
    return true;
  },
  
  // Kiểm tra trạng thái sessionStorage
  checkSessionStorage() {
    console.log('%c ----- THÔNG TIN SESSIONSTORAGE -----', 'color: orange');
    console.log('just_logged_out:', sessionStorage.getItem('just_logged_out'));
    return true;
  },
  
  // Kiểm tra cookie
  checkCookies() {
    console.log('%c ----- THÔNG TIN COOKIES -----', 'color: purple');
    console.log('Tất cả cookies:', document.cookie);
    return true;
  },
  
  // Kiểm tra session với server
  async checkServerSession() {
    console.log('%c ----- KIỂM TRA SESSION VỚI SERVER -----', 'color: blue');
    try {
      const res = await fetch('/session/status', {
        credentials: 'include'
      });
      
      const result = await res.json();
      console.log('Kết quả từ server:', result);
      return result;
    } catch (e) {
      console.error('Lỗi khi kiểm tra session với server:', e);
      return null;
    }
  },
  
  // Xóa tất cả dữ liệu đăng nhập
  clearAllStorageData() {
    console.log('%c ----- XÓA TẤT CẢ DỮ LIỆU ĐĂNG NHẬP -----', 'color: red');
    localStorage.clear();
    sessionStorage.removeItem('just_logged_out');
    console.log('Đã xóa tất cả dữ liệu lưu trữ');
    return true;
  },
  
  // Fix lỗi logout/login
  fixLogoutIssue() {
    console.log('%c ----- KHẮC PHỤC LỖI LOGOUT -----', 'color: red');
    localStorage.clear();
    sessionStorage.setItem('just_logged_out', 'true');
    console.log('Đã thiết lập trạng thái logout, hãy refresh trang');
    return true;
  }
};

// Tự động kiểm tra khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
  // Chỉ log thông tin cơ bản, không chạy tự động các hàm khác
  console.log('Debug Tool sẵn sàng! Sử dụng window.debugAuth để truy cập các công cụ debug.');
  
  // Kiểm tra trạng thái current page
  console.log('Current page:', window.location.pathname);
});
