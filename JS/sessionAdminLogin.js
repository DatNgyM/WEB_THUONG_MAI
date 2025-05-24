/**
 * Session-based Admin Login
 * Handles secure admin authentication using server-side sessions
 */

// Function to handle admin login with sessions
async function loginAdminWithSession(username, password) {
  try {
    const res = await fetch('/api/admin/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Important for session cookies
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('name', result.name || 'Admin');
      localStorage.setItem('useSession', 'true'); // Mark that we're using session auth
      
      window.location.href = '/Page/admin/index.html';
    } else {
      alert(result.message || 'Sai tài khoản hoặc mật khẩu admin!');
    }
  } catch (err) {
    alert('Lỗi kết nối server (admin)!');
    console.error(err);
  }
}

// Function to check admin session status
async function checkAdminSessionStatus() {
  try {
    const res = await fetch('/api/admin/session/status', {
      credentials: 'include' // Important for session cookies
    });
    
    const result = await res.json();
    
    if (result.isAuthenticated) {
      // Admin session is valid
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('name', result.admin.name || 'Admin');
      localStorage.setItem('useSession', 'true');
      
      return true;
    } else {
      // No valid admin session
      return false;
    }
  } catch (err) {
    console.error('Error checking admin session status:', err);
    return false;
  }
}

// Function to logout admin with session
async function logoutAdminSession() {
  try {
    const res = await fetch('/api/admin/session/logout', {
      credentials: 'include' // Important for session cookies
    });
    
    const result = await res.json();
    
    if (result.success) {
      // Clear local storage data
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('useSession');
      
      // Redirect to login page
      window.location.href = '/Page/login.html';
    } else {
      alert('Đăng xuất thất bại: ' + (result.message || 'Lỗi không xác định'));
      console.error('Admin logout failed:', result);
    }
  } catch (error) {
    alert('Lỗi khi đăng xuất');
    console.error('Error during admin logout:', error);
  }
}

// Check admin session status when page loads on admin pages
document.addEventListener('DOMContentLoaded', async function() {
  const currentPath = window.location.pathname;
  
  // Only run on admin pages
  if (currentPath.includes('/admin/')) {
    const isSessionActive = await checkAdminSessionStatus();
    
    if (!isSessionActive) {
      // If no valid admin session and we're on an admin page, redirect to login
      if (localStorage.getItem('useSession') === 'true') {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('useSession');
      }
      
      // Don't redirect if we're already on the login page
      if (!currentPath.includes('login.html')) {
        window.location.href = '/Page/login.html';
      }
    }
  }
});
