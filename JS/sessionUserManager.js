/**
 * Session-based User Data Manager
 * Manages user data with server sessions instead of just localStorage
 */

// Variables to track session check
let sessionChecked = false;
let sessionValid = false;

// Check session status when page loads
document.addEventListener('DOMContentLoaded', async function() {
  await checkAndValidateSession();
  
  // Setup forms and UI elements based on session status
  setupSessionForms();
  
  // Display user information
  displayUserInfoFromSession();
  
  // Check CCCD status if user is logged in
  if (sessionValid) {
    checkCccdStatusWithSession();
  }
});

/**
 * Check and validate the current session
 */
async function checkAndValidateSession() {
  try {
    const res = await fetch('/session/status', {
      credentials: 'include'
    });
    
    const result = await res.json();
    sessionChecked = true;
    
    if (result.isAuthenticated) {
      sessionValid = true;
      
      // Update user data in localStorage for compatibility with existing code
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.user.role || 'buyer');
      localStorage.setItem('name', result.user.name || '');
      localStorage.setItem('useSession', 'true');
      localStorage.setItem('user', JSON.stringify(result.user));
      
      console.log('[Session Manager] Active session found:', result.user.name);
      return true;
    } else {
      sessionValid = false;
      console.log('[Session Manager] No active session found');
      
      // Check if we need to redirect to login
      if (localStorage.getItem('useSession') === 'true' && localStorage.getItem('isLoggedIn') === 'true') {
        // Session was expected but isn't valid - clear localStorage
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('user');
        localStorage.removeItem('useSession');
        
        // Redirect to login if not already on login page
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login.html')) {
          window.location.href = '/Page/login.html';
        }
      }
      
      return false;
    }
  } catch (error) {
    console.error('[Session Manager] Error checking session status:', error);
    sessionChecked = true;
    sessionValid = false;
    return false;
  }
}

/**
 * Set up forms and UI elements for session-based authentication
 */
function setupSessionForms() {
  // Profile form submission
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await updateProfileWithSession();
    });
  }
  
  // CCCD update form
  const cccdForm = document.getElementById('cccd-form');
  if (cccdForm) {
    cccdForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await updateCccdWithSession();
    });
  }
  
  // Password update form
  const passwordForm = document.getElementById('password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      await updatePasswordWithSession();
    });
  }
}

/**
 * Display user information from session data
 */
function displayUserInfoFromSession() {
  if (!sessionValid && !localStorage.getItem('isLoggedIn')) {
    return;
  }
  
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    
    const user = JSON.parse(userString);
    
    // Fill general user info elements
    fillElementIfExists('user-name', user.name);
    fillElementIfExists('user-email', user.email);
    fillElementIfExists('user-username', user.username);
    fillElementIfExists('user-role', user.role);
    fillElementIfExists('user-cccd', user.cccd);
    fillElementIfExists('user-phone', user.phone || user.phoneNumber);
    fillElementIfExists('user-address', user.address);
    
    // Fill form inputs if they exist
    fillInputIfExists('name', user.name);
    fillInputIfExists('email', user.email);
    fillInputIfExists('phoneNumber', user.phone || user.phoneNumber);
    fillInputIfExists('address', user.address);
    fillInputIfExists('cccd', user.cccd);
    
    console.log('[Session Manager] User info displayed from session data');
  } catch (error) {
    console.error('[Session Manager] Error displaying user info:', error);
  }
}

/**
 * Helper function to fill an element with text if it exists
 */
function fillElementIfExists(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

/**
 * Helper function to fill an input with value if it exists
 */
function fillInputIfExists(id, value) {
  const input = document.getElementById(id);
  if (input && value) {
    input.value = value;
  }
}

/**
 * Update user profile with session authentication
 */
async function updateProfileWithSession() {
  if (!sessionValid) {
    alert('Phiên đăng nhập của bạn đã hết hạn');
    window.location.href = '/Page/login.html';
    return;
  }
  
  // Get form values
  const name = document.getElementById('name')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const phoneNumber = document.getElementById('phoneNumber')?.value?.trim();
  const address = document.getElementById('address')?.value?.trim();
  
  // Validate input
  if (!name && !email && !phoneNumber && !address) {
    alert('Vui lòng nhập thông tin cần cập nhật');
    return;
  }
  
  try {
    const res = await fetch('/api/profile/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        name,
        email,
        phoneNumber,
        address
      })
    });
    
    const result = await res.json();
    
    if (result.success) {
      alert('Cập nhật thông tin thành công');
      
      // Update user data in localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) {
          user.phone = phoneNumber;
          user.phoneNumber = phoneNumber;
        }
        if (address) user.address = address;
        
        localStorage.setItem('user', JSON.stringify(user));
        if (name) localStorage.setItem('name', name);
      }
      
      // Refresh user display
      displayUserInfoFromSession();
    } else {
      alert('Lỗi: ' + (result.message || 'Không thể cập nhật'));
    }
  } catch (error) {
    console.error('[Session Manager] Error updating profile:', error);
    alert('Lỗi kết nối server');
  }
}

/**
 * Update CCCD with session authentication
 */
async function updateCccdWithSession() {
  if (!sessionValid) {
    alert('Phiên đăng nhập của bạn đã hết hạn');
    window.location.href = '/Page/login.html';
    return;
  }
  
  const cccd = document.getElementById('cccd')?.value?.trim();
  
  if (!cccd) {
    alert('Vui lòng nhập số CCCD');
    return;
  }
  
  if (!/^\d{12}$/.test(cccd)) {
    alert('CCCD phải có đúng 12 chữ số');
    return;
  }
  
  try {
    const res = await fetch('/api/profile/update-cccd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ cccd })
    });
    
    const result = await res.json();
    
    if (result.success) {
      alert('Cập nhật CCCD thành công');
      
      // Update user data in localStorage
      const userString = localStorage.getItem('user');
      if (userString) {
        const user = JSON.parse(userString);
        user.cccd = cccd;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      // Refresh user display
      displayUserInfoFromSession();
    } else {
      alert('Lỗi: ' + (result.message || 'Không thể cập nhật CCCD'));
    }
  } catch (error) {
    console.error('[Session Manager] Error updating CCCD:', error);
    alert('Lỗi kết nối server');
  }
}

/**
 * Update password with session authentication
 */
async function updatePasswordWithSession() {
  if (!sessionValid) {
    alert('Phiên đăng nhập của bạn đã hết hạn');
    window.location.href = '/Page/login.html';
    return;
  }
  
  const currentPassword = document.getElementById('currentPassword')?.value;
  const newPassword = document.getElementById('newPassword')?.value;
  const confirmPassword = document.getElementById('confirmPassword')?.value;
  
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert('Vui lòng nhập đầy đủ thông tin');
    return;
  }
  
  if (newPassword !== confirmPassword) {
    alert('Mật khẩu xác nhận không khớp');
    return;
  }
  
  try {
    const res = await fetch('/api/profile/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });
    
    const result = await res.json();
    
    if (result.success) {
      alert('Cập nhật mật khẩu thành công');
      // Clear password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    } else {
      alert('Lỗi: ' + (result.message || 'Không thể cập nhật mật khẩu'));
    }
  } catch (error) {
    console.error('[Session Manager] Error updating password:', error);
    alert('Lỗi kết nối server');
  }
}

/**
 * Check CCCD status with session
 */
function checkCccdStatusWithSession() {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    
    const user = JSON.parse(userString);
    
    // Show different UI based on CCCD status
    const cccdStatus = document.getElementById('cccd-status');
    const cccdInfoBox = document.getElementById('cccd-info-box');
    const cccdUpdateForm = document.getElementById('cccd-form');
    
    if (cccdStatus && cccdInfoBox) {
      if (!user.cccd) {
        // No CCCD
        cccdStatus.textContent = 'Chưa cập nhật';
        cccdStatus.className = 'status not-verified';
        cccdInfoBox.className = 'info-box warning';
      } else if (user.cccd.startsWith('T')) {
        // Temporary CCCD
        cccdStatus.textContent = 'Tạm thời';
        cccdStatus.className = 'status pending';
        cccdInfoBox.className = 'info-box warning';
      } else {
        // Regular CCCD
        cccdStatus.textContent = 'Đã xác thực';
        cccdStatus.className = 'status verified';
        cccdInfoBox.className = 'info-box success';
        
        // Hide update form if CCCD is verified
        if (cccdUpdateForm) {
          cccdUpdateForm.style.display = 'none';
        }
      }
    }
  } catch (error) {
    console.error('[Session Manager] Error checking CCCD status:', error);
  }
}

// Export functions for use in other scripts
window.sessionManager = {
  checkAndValidateSession,
  updateProfileWithSession,
  updateCccdWithSession,
  updatePasswordWithSession
};
