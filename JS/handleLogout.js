// Hàm xử lý logout cho admin
function handleLogout() {
  console.log('Đăng xuất admin...');

  try {
    // Gọi API logout để xóa cookie nếu có
    fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .catch(error => {
      console.error('Lỗi khi gọi API logout:', error);
    });
  } catch (e) {
    console.error('Lỗi khi thực hiện đăng xuất:', e);
  }

  // Xóa tất cả thông tin đăng nhập khỏi localStorage và sessionStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  sessionStorage.removeItem('isAdmin');
  sessionStorage.removeItem('adminName');
  sessionStorage.removeItem('adminRedirectUrl');
  
  // Chuyển hướng người dùng đến trang đăng nhập admin
  window.location.href = '/Page/admin/login.html';
  
  // Ngăn chặn cache trang admin khi quay lại
  window.history.pushState(null, '', '/Page/admin/login.html');
}
