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
      body: JSON.stringify({ name, username, email, password })
    });

    const result = await res.json();
    alert(result.message);

    if (result.success) {
      document.getElementById('tab-login').click(); // chuyển sang tab login
    }
  } catch (err) {
    alert('Lỗi kết nối server!');
    console.error(err);
  }
});
