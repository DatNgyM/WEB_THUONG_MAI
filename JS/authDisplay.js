document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const name = localStorage.getItem('name');
  
    const accountSection = document.getElementById('account-section');
    const guestSection = document.getElementById('guest-section');
    const greetingEl = document.getElementById('user-greeting');
  
    if (isLoggedIn && name) {
      // Nếu đã login
      accountSection.style.display = 'inline-block';
      guestSection.style.display = 'none';
      greetingEl.innerText = `👋 Xin chào, ${name}`;
    } else {
      // Nếu chưa login
      accountSection.style.display = 'none';
      guestSection.style.display = 'inline-block';
    }
  
    //  logout
    const logoutBtn = document.querySelector('.dropdown-item[href="#logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  });

// Hàm xử lý logout có thể gọi từ bất kỳ trang nào
function logout() {
  localStorage.clear();
  window.location.href = '/Page/login.html';
}
