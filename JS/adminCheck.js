document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
  
    if (isLoggedIn && role === 'admin') {
      setTimeout(() => {
        if (confirm("Bạn đang đăng nhập bằng tài khoản admin.\nBạn muốn truy cập trang quản trị không?")) {
          window.location.href = '/Page/admin/index.html';
        }
      }, 350); //msms
    }
  });
  