document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const emailOrUsername = document.querySelector('#loginName').value;
  const password = document.querySelector('#loginPassword').value;

  // Nếu là admin thì dùng route /auth/login
  const isAdmin = emailOrUsername.includes('admin'); // đặt logic kiểm tra

  const endpoint = isAdmin ? '/auth/login' : '/userAuth/login';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: emailOrUsername, password })
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', isAdmin ? 'admin' : 'user');
      localStorage.setItem('name', result.name || result.username || ''); // name để hiển thị

      // Chuyển hướng đúng trang
      if (isAdmin) {
        window.location.href = '/Page/admin/index.html';
      } else {
        window.location.href = '/Page/index.html';
      }
    } else {
      alert(result.message || 'Đăng nhập thất bại!');
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
    console.error(err);
  }
});
