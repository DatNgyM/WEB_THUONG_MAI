document.querySelector('#register-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const name = document.querySelector('#registerName').value;
    const username = document.querySelector('#registerUsername').value;
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;
    const repeatPassword = document.querySelector('#registerRepeatPassword').value;
  
    if (password !== repeatPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
  
    try {
      const res = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }) // ✅ gửi đúng định dạng
      });
  
      const result = await res.json();
      alert(result.message); // backend trả về message sẽ hiển thị
  
      if (result.success) {
        // Lưu thông tin vào localStorage để hiển thị trên index.html
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('name', name);
        localStorage.setItem('username', username);
      
        // Chuyển hướng sang index.html sau khi đăng ký
        window.location.href = '/Page/index.html';
      }
      
    } catch (err) {
      alert('Lỗi kết nối server!');
      console.error(err);
    }
  });
  