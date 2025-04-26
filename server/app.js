const express = require('express');
const path = require('path');
const app = express();
//const webRouter = require('../server/routes/web.js');
// Các route
const userRegister = require('./routes/userRegister'); 
const userAuth = require('./routes/userAuth'); 
const adminUsers = require('./routes/adminUsers');
const authRoutes = require('./routes/auth');
const requestSellerRoute = require('./routes/requestSeller');

const PORT = 3000;

app.use(express.json());
//app.use('/',webRouter)
// Đăng ký route API
app.use('/user/request-seller', requestSellerRoute); // 👈 Ưu tiên route cụ thể
app.use('/userAuth', userAuth);       // Xử lý login người dùng
app.use('/auth', authRoutes);         // Đăng nhập admin
app.use('/admin', adminUsers);        // Quản lý user từ admin
app.use('/user', userRegister);       // Đăng ký tài khoản người dùng
// Serve frontend
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log('\n Các trang chính:');
  console.log(`- Trang chủ        http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập        http://localhost:${PORT}/Page/login.html`);
  console.log(`- Trang Admin      http://localhost:${PORT}/Page/admin/index.html`);
});

module.exports = app;
