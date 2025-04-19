const express = require('express');
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');

const PORT = 3000;

app.use(express.json());
app.use('/auth', authRoutes); // sử dụng router login admin
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log('\nCác trang chính:');
  console.log(`- Trang chủ       👉 http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập       👉 http://localhost:${PORT}/Page/login.html`);
  console.log(`- Đăng ký         👉 http://localhost:${PORT}/Page/login.html (tab Register)`);
  console.log(`- Trang Admin     👉 http://localhost:${PORT}/Page/admin/index.html`);
});
