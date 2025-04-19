const express = require('express');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const PORT = 3000;

// ✅ Phải để middleware này TRƯỚC các route!
app.use(express.json());

// Route xử lý API
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// ✅ Serve frontend
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log('\n🌐 Các trang chính:');
  console.log(`- Trang chủ       👉 http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập       👉 http://localhost:${PORT}/Page/login.html`);
  console.log(`- Đăng ký         👉 http://localhost:${PORT}/Page/login.html (tab Register)`);
  console.log(`- Trang Admin     👉 http://localhost:${PORT}/Page/admin/index.html`);
});
