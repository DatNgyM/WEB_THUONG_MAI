// document.querySelector('#login-form').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const input = document.querySelector('#loginName').value.trim();
//   const password = document.querySelector('#loginPassword').value.trim();

//   if (!input || !password) {
//     alert('Vui lòng nhập đầy đủ thông tin!');
//     return;
//   }

//   // Nếu input là admin (dựa trên định dạng @admin hoặc username chứa "admin")
//   const isAdmin = input.toLowerCase().includes('admin');

//   if (isAdmin) {
//     await loginAdmin(input, password);
//   } else {
//     await loginUser(input, password);
//   }
// });

// async function loginAdmin(username, password) {
//   try {
//     const res = await fetch('/auth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password })
//     });

//     const result = await res.json();

//     if (result.success) {
//       localStorage.setItem('isLoggedIn', 'true');
//       localStorage.setItem('role', 'admin');
//       localStorage.setItem('name', result.name || 'Admin');

//       window.location.href = '/Page/admin/index.html';
//     } else {
//       alert(result.message || 'Sai tài khoản hoặc mật khẩu admin!');
//     }
//   } catch (err) {
//     alert('Lỗi kết nối server (admin)!');
//     console.error(err);
//   }
// }

// async function loginUser(username, password) {
//   try {
//     const res = await fetch('/userAuth/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ username, password })
//     });

//     const result = await res.json();

//     if (result.success) {
//       localStorage.setItem('isLoggedIn', 'true');
//       localStorage.setItem('role', result.role || 'buyer');
//       localStorage.setItem('name', result.name || '');

//       window.location.href = '/Page/index.html';
//     } else {
//       alert(result.message || 'Sai tài khoản hoặc mật khẩu người dùng!');
//     }
//   } catch (err) {
//     alert('Lỗi kết nối server (user)!');
//     console.error(err);
//   }
// }
document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const login = document.querySelector('#loginName').value.trim();
  const password = document.querySelector('#loginPassword').value.trim();

  if (!login || !password) {
    alert('Vui lòng điền đầy đủ thông tin!');
    return;
  }

  let endpoint = '';
  let payload = {};

  // Kiểm tra nếu là admin (chỉ dùng đúng username đã biết, vd: admin@gmail.com)
  if (login === 'admin@gmail.com') {
    endpoint = '/auth/login';
    payload = { username: login, password };
  } else {
    endpoint = '/userAuth/login';
    payload = { login, password }; // bên backend nhận login là username/email
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.role);
      localStorage.setItem('name', result.name);

      // Redirect theo vai trò
      if (result.role === 'admin') {
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
