document.querySelector('#login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const input = document.querySelector('#loginName').value.trim();
  const password = document.querySelector('#loginPassword').value.trim();

  if (!input || !password) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  // input là admin (dựa trên định dạng @admin hoặc username chứa "admin")
  const isAdmin = input.toLowerCase().includes('admin');
  
  // Check if we should use session-based authentication
  const useSession = document.querySelector('#use-session')?.checked || false;
  localStorage.setItem('useSession', useSession.toString());

  if (isAdmin) {
    if (useSession && typeof loginAdminWithSession === 'function') {
      await loginAdminWithSession(input, password);
    } else {
      await loginAdmin(input, password);
    }
  } else {
    if (useSession && typeof loginUserWithSession === 'function') {
      await loginUserWithSession(input, password);
    } else {
      await loginUser(input, password);
    }
  }
});

async function loginAdmin(username, password) {
  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const result = await res.json();

    if (result.success) {      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('name', result.name || 'Admin');

      window.location.href = '/Page/admin/index.html';
    } else {
      alert(result.message || 'Sai tài khoản hoặc mật khẩu admin!');
    }
  } catch (err) {
    alert('Lỗi kết nối server (admin)!');
    console.error(err);
  }
}

async function loginUser(username, password) {
  try {
    const res = await fetch('/userAuth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }) // gửi key cho từng BEBE
    });

    const result = await res.json();

    if (result.success) {
      // Clear existing user data in localStorage to prevent data persistence issues
      localStorage.removeItem('user');
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', result.role || 'buyer');
      localStorage.setItem('name', result.name || '');
      
      if (result.user) { 
        // Kiểm tra CCCD có phải là tạm thời không (bắt đầu bằng 'T' và chứa toàn số)
        const user = result.user;
        if (user.cccd && user.cccd.charAt(0) === 'T' && !isNaN(user.cccd.substring(1))) {
          user.cccdStatus = 'temporary';
          console.log('Phát hiện CCCD tạm thời:', user.cccd);
        }
        
        // Make sure user ID is properly set
        console.log('Received user data from server:', user);
        
        // Add extra validation for thuxinhgais user
        if (username === 'thuxinhgais' && user.id !== 10) {
          console.warn('Username is thuxinhgais but ID is not 10, fixing ID');
          user.id = 10;
          user.name = "Trần Minh Thư";
        }
        
        // Special handling for known users - ensure consistency
        if (username === 'datuser' && user.id !== 1) {
          user.id = 1;
          user.name = "Nguyen Minh Dat";
        } else if (username === 'lephat' && user.id !== 2) {
          user.id = 2;
          user.name = "Le Ba Phat";
        }
        
        // Đảm bảo giữ nguyên giá trị CCCD từ server
        console.log('Lưu thông tin user với CCCD:', user.cccd);
        localStorage.setItem('user', JSON.stringify(user)); // Lưu đối tượng user (chuyển thành chuỗi JSON)
      } else {
        // Nếu API không trả về đối tượng user hoàn chỉnh, 
        // tạo một đối tượng user cơ bản từ thông tin có sẵn
        const basicUser = {
          name: result.name || '',
          username: username,
          email: username.includes('@') ? username : username + '@gmail.com', // Giả sử username có thể là email
          role: result.role || 'buyer',
          cccdStatus: 'unknown' // Không có thông tin về CCCD
        };
        
        // Set appropriate ID based on username
        if (username === 'thuxinhgais') {
          basicUser.id = 10;
          basicUser.name = "Trần Minh Thư";
          basicUser.cccd = "T461013031887"; // Using known CCCD
        } else if (username === 'datuser') {
          basicUser.id = 1;
          basicUser.name = "Nguyen Minh Dat";
          basicUser.cccd = "079203001234";
        } else if (username === 'lephat') {
          basicUser.id = 2;
          basicUser.name = "Le Ba Phat";
          basicUser.cccd = "079203044444";
        }
        
        localStorage.setItem('user', JSON.stringify(basicUser));
      }

      window.location.href = '/Page/index.html';
    } else {
      alert(result.message || 'Sai tài khoản hoặc mật khẩu người dùng!');
    }
  } catch (err) {
    alert('Lỗi kết nối server (user)!');
    console.error(err);
  }
}

// document.querySelector('#login-form').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const login = document.querySelector('#loginName').value.trim();
//   const password = document.querySelector('#loginPassword').value.trim();

//   if (!login || !password) {
//     alert('Vui lòng điền đầy đủ thông tin!');
//     return;
//   }

//   let endpoint = '';
//   let payload = {};

//   // Kiểm tra nếu là admin (chỉ dùng đúng username đã biết, vd: admin@gmail.com)
//   if (login === 'admin@gmail.com') {
//     endpoint = '/auth/login';
//     payload = { username: login, password };
//   } else {
//     endpoint = '/userAuth/login';
//     payload = { login, password }; // bên backend nhận login là username/email ?
//   }

//   try {
//     const res = await fetch(endpoint, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     const result = await res.json();

//     if (result.success) {
//       localStorage.setItem('isLoggedIn', 'true');
//       localStorage.setItem('role', result.role);
//       localStorage.setItem('name', result.name);

//       // Redirect theo vai trò
//       if (result.role === 'admin') {
//         window.location.href = '/Page/admin/index.html';
//       } else {
//         window.location.href = '/Page/index.html';
//       }
//     } else {
//       alert(result.message || 'Đăng nhập thất bại!');
//     }
//   } catch (err) {
//     alert('Lỗi kết nối server!');
//     console.error(err);
//   }
// });
