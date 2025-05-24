/**
 * Session-based Admin Logout
 * Handles secure admin logout using server-side sessions
 */

// Function to logout admin with session
async function logoutAdminSession() {
  try {
    console.log('Executing session-based admin logout...');
    
    // Clean cookies if cookieCleaner is available
    if (window.cookieCleaner) {
      window.cookieCleaner.clearAllLoginData();
    }
    
    // Call the session logout endpoint
    const res = await fetch('/api/admin/session/logout', {
      credentials: 'include' // Important for session cookies
    });
    
    const result = await res.json();
    
    if (result.success) {
      console.log('Admin session successfully logged out on server');
    } else {
      console.error('Server reported logout failure:', result.message);
    }
  } catch (err) {
    console.error('Error during admin session logout:', err);
  } finally {
    // Always clean up local storage data regardless of server response
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('useSession');
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('adminRedirectUrl');
    
    // Add cache-busting timestamp
    const timestamp = new Date().getTime();
    
    // Redirect to login page
    window.location.href = '/Page/admin/login.html?t=' + timestamp;
  }
}

// Prevent back navigation to admin pages after logout
window.addEventListener('pageshow', function(event) {
  // Check if loading from cache (back button)
  if (event.persisted) {
    // If page is cached, check session status
    checkAdminSessionStatus().then(isAuthenticated => {
      if (!isAuthenticated && window.location.pathname.includes('/admin/')) {
        // Force redirect to login if admin session is invalid and on admin page
        window.location.replace('/Page/admin/login.html?back=1');
      }
    });
  }
});

// Export function for direct usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { logoutAdminSession };
}
