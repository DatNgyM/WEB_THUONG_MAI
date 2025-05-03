const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const { router: adminAuthRouter, authenticateAdmin } = require('./routes/adminAuth');
const app = express();

// Các route chính
const userRegister = require('./routes/userRegister');
const userAuth = require('./routes/userAuth');
const adminUsers = require('./routes/adminUsers');
const authRoutes = require('./routes/auth');
const requestSellerRoute = require('./routes/requestSeller');

// Các route trong thư mục account/
const profileRoutes = require('./routes/profile');
const accountRoutes = require('./routes/account');
const securityRoutes = require('./routes/security');

// Các route admin
const adminDashboard = require('./routes/adminDashboard');
const adminOrders = require('./routes/adminOrders');
const adminInventory = require('./routes/adminInventory');

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Đăng ký route API
app.use('/user/request-seller', requestSellerRoute);
app.use('/userAuth', userAuth);           // login người dùng
app.use('/auth', authRoutes);             // login admin
app.use('/admin', adminUsers);            // quản lý user từ admin
app.use('/user', userRegister);           // đăng ký tài khoản người dùng

// Các route account settings
app.use('/api/profile', profileRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/security', securityRoutes);

// Admin routes
app.use('/api/admin/auth', adminAuthRouter);

// Protected admin routes
app.use('/api/admin', authenticateAdmin);
app.use('/api/admin/dashboard', adminDashboard);
app.use('/api/admin/orders', adminOrders);
app.use('/api/admin/inventory', adminInventory);

// Serve frontend từ thư mục gốc
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log('\n📄 Các trang chính:');
  console.log(`- Trang chủ        http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập        http://localhost:${PORT}/Page/login.html`);
  console.log(`- Trang Admin      http://localhost:${PORT}/Page/admin/index.html`);
});

module.exports = app;
