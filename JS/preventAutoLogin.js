/**
 * Ngăn chặn đăng nhập tự động khi đã logout
 */

// Chạy ngay khi file được tải
(function() {
  console.log("Xử lý trang login - xóa dữ liệu đăng nhập");
  
  // Xóa toàn bộ dữ liệu trong localStorage
  localStorage.clear();
  
  // Xóa các trường cụ thể
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('user');
  localStorage.removeItem('useSession');
  
  // Xóa cookies liên quan đến session
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Hiển thị thông báo nếu trang được tải với tham số logout=success
  document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('t') && document.querySelector('.auth-form')) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'alert alert-info';
      messageDiv.textContent = 'Đã đăng xuất thành công!';
      messageDiv.style.marginBottom = '15px';
      
      const formContainer = document.querySelector('.auth-form-container');
      if (formContainer) {
        formContainer.prepend(messageDiv);
        
        // Ẩn thông báo sau 3 giây
        setTimeout(() => {
          messageDiv.style.display = 'none';
        }, 3000);
      }
    }
  });
})();
