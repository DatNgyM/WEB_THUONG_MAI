document.querySelector('#register-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.querySelector('#registerName').value.trim();
  const username = document.querySelector('#registerUsername').value.trim();
  const email = document.querySelector('#registerEmail').value.trim();
  const password = document.querySelector('#registerPassword').value.trim();
  const repeatPassword = document.querySelector('#registerRepeatPassword').value.trim();
  const cccd = document.querySelector('#registerCCCD').value.trim();

  if (password !== repeatPassword) {
    alert('Mật khẩu không khớp!');
    return;
  }
  
  // Kiểm tra định dạng CCCD nếu được nhập
  if (cccd && !/^\d{12}$/.test(cccd)) {
    alert('Số CCCD phải có đúng 12 chữ số. Vui lòng kiểm tra lại hoặc để trống.');
    return;
  }

  try {
    // Tạo payload cho request, thêm cccd nếu có
    const payload = { name, username, email, password };
    if (cccd) {
      payload.cccd = cccd;
    }
    
    const res = await fetch('/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    
    if (result.success) {
      alert('Đăng ký tài khoản thành công!');
      document.getElementById('tab-login').click(); // chuyển sang tab login
    } else {
      alert(result.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
    console.error(err);
  }
});
