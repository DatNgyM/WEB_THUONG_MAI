/**
 * Admin Session Logout
 * Handles secure admin logout using server-side sessions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only run on admin pages
  if (!window.location.pathname.includes('/admin/')) {
    return;
  }
  
  // Find logout buttons
  const logoutButtons = document.querySelectorAll('.logout-button, #logout-button, [data-action="logout"]');
  
  logoutButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Check if we're using session-based auth
      const useSession = localStorage.getItem('useSession') === 'true';
      
      if (useSession && typeof logoutAdminSession === 'function') {
        logoutAdminSession();
      } else {
        // Fall back to regular logout
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        window.location.href = '/Page/login.html';
      }
    });
  });
});
