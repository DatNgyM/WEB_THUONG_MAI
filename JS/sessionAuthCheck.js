/**
 * Session-based Authentication Check
 * Verifies if the user is authenticated and redirects if not
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Thêm log để debug
  console.log('SessionAuthCheck: Bắt đầu kiểm tra xác thực...');
  
  // Skip check if we're already on the login page
  if (window.location.pathname.includes('login.html')) {
    console.log('SessionAuthCheck: Đang ở trang login, bỏ qua kiểm tra');
    return;
  }
  
  // Kiểm tra nếu có dữ liệu logout trong sessionStorage
  if (sessionStorage.getItem('just_logged_out') === 'true') {
    console.log('SessionAuthCheck: Phát hiện trạng thái vừa logout, xóa localStorage và chuyển hướng');
    localStorage.clear();
    sessionStorage.removeItem('just_logged_out');
    window.location.replace('/Page/login.html');
    return;
  }
  
  // First check localStorage for quick rejection
  if (!localStorage.getItem('isLoggedIn') || !localStorage.getItem('user')) {
    console.log('SessionAuthCheck: Không tìm thấy dữ liệu xác thực, chuyển hướng đến trang đăng nhập');
    localStorage.clear(); // Đảm bảo xóa tất cả dữ liệu
    window.location.replace('/Page/login.html');
    return;
  }
  
  // If using sessions, verify with server
  if (localStorage.getItem('useSession') === 'true') {
    console.log('SessionAuthCheck: Xác thực session với server...');
    try {
      const res = await fetch('/session/status', {
        credentials: 'include'
      });
      
      const result = await res.json();
        if (!result.isAuthenticated) {
        console.log('SessionAuthCheck: Session hết hạn hoặc không hợp lệ, chuyển hướng đến trang đăng nhập');
        // Clear localStorage data
        localStorage.clear();
        
        // Đảm bảo các trường quan trọng được xóa
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('user');
        localStorage.removeItem('useSession');
        
        window.location.replace('/Page/login.html');
      } else {
        console.log('SessionAuthCheck: Xác thực session thành công');
        // Update local data with latest session data
        const user = result.user;
        
        // Kiểm tra và so sánh với dữ liệu hiện có
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id !== user.id) {
          console.log('SessionAuthCheck: Phát hiện ID người dùng khác nhau, cập nhật dữ liệu mới');
        }
        
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('role', user.role);
        localStorage.setItem('name', user.name);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('useSession', 'true');
      }
    } catch (error) {
      console.error('Error checking session status:', error);
      // We'll keep the user on the page if there's an error checking the session
      // This prevents issues with offline mode or temporary server problems
    }
  }
});
