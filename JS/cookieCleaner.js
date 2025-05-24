/**
 * Cookie Cleaner và Session Destroyer
 * Dùng để xóa mọi cookie và các dữ liệu liên quan đến session đăng nhập
 */

/**
 * Xóa mọi cookie trong tên miền hiện tại
 */
function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }
  
  console.log('Đã xóa tất cả cookies');
  
  // Xóa cookie cho tất cả đường dẫn khả dĩ
  document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/session;";
  document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/api;";
}

/**
 * Xóa tất cả dữ liệu lưu trữ cục bộ
 */
function clearAllStorage() {
  // Xóa localStorage
  localStorage.clear();
  // Xóa sessionStorage
  sessionStorage.clear();
}

/**
 * Xóa tất cả dữ liệu và cookie đăng nhập
 */
function clearAllLoginData() {
  // Xóa localStorage cụ thể
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
  localStorage.removeItem('user');
  localStorage.removeItem('useSession');
  localStorage.removeItem('token');
  
  // Xóa tất cả storage
  clearAllStorage();
  
  // Xóa cookies
  clearAllCookies();
}

// Công khai các hàm để có thể gọi từ console hoặc các file khác
window.cookieCleaner = {
  clearAllCookies,
  clearAllStorage,
  clearAllLoginData
};
