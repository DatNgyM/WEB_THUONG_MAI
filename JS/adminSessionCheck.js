/**
 * Admin Session Authentication Check
 * Verifies if the admin is authenticated and redirects if not
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Only run on admin pages
  if (!window.location.pathname.includes('/admin/')) {
    return;
  }
  
  // Skip check if we're on login page
  if (window.location.pathname.includes('login.html')) {
    return;
  }
  
  // First check localStorage for quick rejection
  if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('role') !== 'admin') {
    console.log('No local admin authentication data found, redirecting to login');
    window.location.href = '/Page/login.html';
    return;
  }
  
  // If using sessions, verify with server
  if (localStorage.getItem('useSession') === 'true') {
    try {
      const res = await fetch('/api/admin/session/status', {
        credentials: 'include'
      });
      
      const result = await res.json();
      
      if (!result.isAuthenticated) {
        console.log('Admin session expired or invalid, redirecting to login');
        // Clear localStorage data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('useSession');
        
        window.location.href = '/Page/login.html';
      } else {
        console.log('Admin session authentication confirmed');
      }
    } catch (error) {
      console.error('Error checking admin session status:', error);
      // We'll keep the admin on the page if there's an error checking the session
      // This prevents issues with offline mode or temporary server problems
    }
  }
});
