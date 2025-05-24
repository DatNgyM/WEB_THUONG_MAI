// Hàm xử lý logout cho admin
function handleLogout() {
  console.log('Đăng xuất admin...');

  // Check if we're using session-based auth
  const useSession = localStorage.getItem('useSession') === 'true';
  
  try {
    if (useSession) {
      // Use our session-based logout function if available
      if (typeof logoutAdminSession === 'function') {
        logoutAdminSession();
        return; // The function will handle redirect and cleanup
      } else {
        // Fallback to session logout API
        fetch('/api/admin/session/logout', {
          credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
          console.log('Session logout response:', data);
          cleanupAndRedirect();
        })
        .catch(error => {
          console.error('Lỗi khi gọi API session logout:', error);
          cleanupAndRedirect();
        });
      }
    } else {
      // Legacy JWT logout
      fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      .then(() => {
        cleanupAndRedirect();
      })
      .catch(error => {
        console.error('Lỗi khi gọi API logout:', error);
        cleanupAndRedirect();
      });
    }
  } catch (e) {
    console.error('Lỗi khi thực hiện đăng xuất:', e);
    cleanupAndRedirect();
  }

  function cleanupAndRedirect() {
    // Clean cookies if cookieCleaner is available
    if (window.cookieCleaner) {
      window.cookieCleaner.clearAllLoginData();
    }
    
    // Xóa tất cả thông tin đăng nhập khỏi localStorage và sessionStorage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('useSession');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('adminRedirectUrl');
    
    // Add cache-busting timestamp to prevent back navigation issues
    const timestamp = new Date().getTime();
    
    // Chuyển hướng người dùng đến trang đăng nhập admin
    window.location.href = '/Page/admin/login.html?t=' + timestamp;
    
    // Ngăn chặn cache trang admin khi quay lại
    window.history.pushState(null, '', '/Page/admin/login.html?t=' + timestamp);
  }
}
