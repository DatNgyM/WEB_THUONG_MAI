/**
 * Session-based Logout Script
 * Handles secure session logout
 */

async function logoutSession() {
  try {
    console.log('Đang đăng xuất...');
      // Sử dụng cookieCleaner để xóa triệt để mọi dữ liệu đăng nhập
    if (window.cookieCleaner) {
      window.cookieCleaner.clearAllLoginData();
    } else {
      // Fallback nếu cookieCleaner không tồn tại
      localStorage.clear();
      
      // Xóa từng mục cụ thể để đảm bảo
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('name');
      localStorage.removeItem('user');
      localStorage.removeItem('useSession');
      
      // Xóa tất cả cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    }
    
    // Gọi API logout để xóa session trên server
    const res = await fetch('/session/logout', {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await res.json();
    
    if (result.success) {
      console.log('Đăng xuất thành công');
      
      // Chuyển hướng về trang login
      window.location.href = '/Page/login.html?t=' + new Date().getTime();
    } else {
      console.error('Lỗi khi đăng xuất:', result);
      
      // Vẫn chuyển hướng về login để đảm bảo người dùng được đăng xuất
      window.location.href = '/Page/login.html?t=' + new Date().getTime();
    }  } catch (error) {
    alert('Lỗi khi đăng xuất');
    console.error('Error during logout:', error);
    
    // Trong trường hợp lỗi, vẫn cố gắng xóa dữ liệu và chuyển hướng
    localStorage.clear();
    window.location.href = '/Page/login.html?error=true&t=' + new Date().getTime();
  }
}

// Xử lý sự kiện nhấn nút đăng xuất
function handleLogoutClick(e) {
  if (e) {
    e.preventDefault();
  }
  
  console.log('Xử lý đăng xuất...');
  
  // Vô hiệu hóa nút đăng xuất để tránh nhấn nhiều lần
  const logoutButtons = document.querySelectorAll('.logout-button, #logout-button, [data-action="logout"]');
  logoutButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.tagName === 'A') {
      btn.style.pointerEvents = 'none';
    }
  });
  
  // Luôn xóa localStorage trước
  localStorage.clear();
  
  // Thực hiện đăng xuất
  logoutSession();
}

// Gắn sự kiện cho các nút đăng xuất
document.addEventListener('DOMContentLoaded', function() {
  const logoutButtons = document.querySelectorAll('.logout-button, #logout-button, [data-action="logout"]');
  
  logoutButtons.forEach(button => {
    console.log('Tìm thấy nút đăng xuất:', button);
    button.addEventListener('click', handleLogoutClick);
  });
  
  // Thêm nút đăng xuất toàn cục nếu đang đăng nhập
  if (localStorage.getItem('isLoggedIn') === 'true') {
    console.log('Người dùng đã đăng nhập, thêm nút đăng xuất toàn cục');
    
    // Nếu nút đăng xuất chưa tồn tại, thêm vào header
    if (document.querySelectorAll('.logout-button, #logout-button, [data-action="logout"]').length === 0) {
      const headerRight = document.querySelector('.header-right');
      if (headerRight) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'logout-button';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất';
        logoutBtn.addEventListener('click', handleLogoutClick);
        headerRight.appendChild(logoutBtn);
      }
    }
  }
    });
  });
});
