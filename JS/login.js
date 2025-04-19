document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const emailOrUsername = document.querySelector('#loginName').value.trim();
  const password = document.querySelector('#loginPassword').value.trim();

  if (!emailOrUsername || !password) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  // Tạm logic đơn giản để xác định là admin (có thể thay bằng backend sau)
  const isAdmin = emailOrUsername.toLowerCase().includes('admin');

  // Chọn route tương ứng
  const endpoint = isAdmin ? '/auth/login' : '/userAuth/login';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: emailOrUsername,
        password: password
      })
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.role); // từ backend trả về
      localStorage.setItem('name', result.name);
    
      if (result.role === 'admin') {
        window.location.href = '/Page/admin/index.html';
      } else {
        window.location.href = '/Page/index.html';
      }
    }
     else {
      alert(result.message || 'Đăng nhập thất bại!');
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
    console.error('Đăng nhập lỗi:', err);
  }
});
