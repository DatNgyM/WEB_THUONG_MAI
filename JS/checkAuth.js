const isLoggedIn = localStorage.getItem('isLoggedIn');
const role = localStorage.getItem('role');

if (!isLoggedIn || role !== 'admin') {
  alert('Bạn chưa đăng nhập với quyền admin!');
  window.location.href = '/Page/login.html';
}
function logout() {
  localStorage.clear(); // xoá toàn bộ thông tin đăng nhập
  window.location.href = '/Page/login.html'; // chuyển về trang login
}
