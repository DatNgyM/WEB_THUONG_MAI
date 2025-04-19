// JS/checkAdmin.js
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
  
    if (!isLoggedIn || role !== 'admin') {
      alert('Bạn chưa đăng nhập với quyền admin!');
      window.location.href = '/Page/login.html';
    }
  });
  