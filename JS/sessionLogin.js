/**
 * Session-based Login Script
 * Implements secure session-based authentication
 */

document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.querySelector('#loginName').value.trim();
  const password = document.querySelector('#loginPassword').value.trim();

  if (!input || !password) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  // input là admin (dựa trên định dạng @admin hoặc username chứa "admin")
  const isAdmin = input.toLowerCase().includes('admin');

  if (isAdmin) {
    await loginAdmin(input, password);
  } else {
    await loginUserWithSession(input, password);
  }
});

async function loginAdmin(username, password) {
  try {
    const res = await fetch('/auth/login', {
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
      localStorage.setItem('useSession', 'false'); // Mark that we're not using session for admin yet

      window.location.href = '/Page/admin/index.html';
    } else {
      alert(result.message || 'Sai tài khoản hoặc mật khẩu admin!');
    }
  } catch (err) {
    alert('Lỗi kết nối server (admin)!');
    console.error(err);
  }
}

async function loginUserWithSession(username, password) {
  try {
    console.log('Đang thực hiện đăng nhập với session...');
    
    // Xóa dấu hiệu logout trước đây nếu có
    sessionStorage.removeItem('just_logged_out');
    
    // Use the new session-based endpoint
    const res = await fetch('/session/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include' // Important for session cookies
    });

    const result = await res.json();
    console.log('Kết quả đăng nhập:', result);

    if (result.success) {
      console.log('Đăng nhập thành công, đang cập nhật dữ liệu...');
      
      // Xóa hết dữ liệu cũ trước khi thiết lập dữ liệu mới
      localStorage.clear();
      // Clear existing user data in localStorage to prevent data persistence issues
      localStorage.removeItem('user');
      
      // Set basic login indicators
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.role || 'buyer');
      localStorage.setItem('name', result.name || '');
      localStorage.setItem('useSession', 'true'); // Mark that we're using session-based auth
      
      // Store user data for local reference
      if (result.user) {
        const user = result.user;
        
        // Special handling for known users - ensure consistency
        if (username === 'datuser' && user.id !== 1) {
          user.id = 1;
          user.name = "Nguyen Minh Dat";
        } else if (username === 'lephat' && user.id !== 2) {
          user.id = 2;
          user.name = "Le Ba Phat";
        } else if (username === 'thuxinhgais' && user.id !== 10) {
          user.id = 10;
          user.name = "Trần Minh Thư";
        }
        
        localStorage.setItem('user', JSON.stringify(user));
      }

      window.location.href = '/Page/index.html';
    } else {
      alert(result.message || 'Sai tài khoản hoặc mật khẩu!');
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
    console.error(err);
  }
}

// Function to check session status
async function checkSessionStatus() {
  try {
    console.log('Kiểm tra trạng thái phiên đăng nhập...');
    
    // Kiểm tra nếu người dùng vừa đăng xuất
    if (sessionStorage.getItem('just_logged_out') === 'true') {
      console.log('Phát hiện người dùng vừa đăng xuất, xóa dữ liệu và trả về false');
      sessionStorage.removeItem('just_logged_out');
      localStorage.clear();
      return false;
    }
    
    const res = await fetch('/session/status', {
      credentials: 'include' // Important for session cookies
    });
    
    const result = await res.json();
    console.log('Kết quả kiểm tra session:', result);
    
    if (result.isAuthenticated) {
      console.log('Session hợp lệ, cập nhật dữ liệu người dùng');
      
      // Xóa dữ liệu cũ trước để tránh trộn lẫn
      localStorage.removeItem('user');
      
      // Session is valid, update local storage with session data
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.user.role || 'buyer');
      localStorage.setItem('name', result.user.name || '');
      localStorage.setItem('useSession', 'true');
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(result.user));
      
      return true;
    } else {
      console.log('Không có phiên hợp lệ, xóa dữ liệu cũ');
      // No valid session, clear any local data
      localStorage.clear();
      return false;
    }
  } catch (err) {
    console.error('Lỗi khi kiểm tra trạng thái session:', err);
    return false;
  }
}

// Check session status when page loads
document.addEventListener('DOMContentLoaded', async function() {
  const currentPage = window.location.pathname;
  
  // Only redirect if we're on the login page
  if (currentPage.includes('login.html')) {
    const isSessionActive = await checkSessionStatus();
    
    if (isSessionActive) {
      // User is already logged in, redirect to home
      window.location.href = '/Page/index.html';
    }
  }
});
