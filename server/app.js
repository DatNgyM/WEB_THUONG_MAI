const express = require('express');
const cors = require('cors');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const { router: adminAuthRouter, authenticateAdmin } = require('./routes/adminAuth');
const app = express();

// Các route chính
const userRegister = require('./routes/userRegister');
const userAuth = require('./routes/userAuth');
const userUpdate = require('./routes/userUpdate'); // Thêm route cập nhật thông tin người dùng
const adminUsers = require('./routes/adminUsers');
const authRoutes = require('./routes/auth');
const requestSellerRoute = require('./routes/requestSeller');
const chatbotRoute = require('./routes/chatbot');
const featuredProductsRoute = require('./routes/featuredProducts'); 
const productsRoute = require('./routes/products'); // Route cho sản phẩm

// Các route trong thư mục account/
const profileRoutes = require('../JS/profile');
const accountRoutes = require('./routes/account');
const securityRoutes = require('./routes/security');
const notificationRoutes = require('./routes/notification');
const billingRoutes = require('./routes/billing');


// Các route admin
const adminDashboard = require('./routes/adminDashboard');
const adminOrders = require('./routes/adminOrders');
const adminInventory = require('./routes/adminInventory');
const adminProducts = require('./routes/adminProducts');
// Thêm vào phần import routes (sau các require khác)
const productDetailsRouter = require('./routes/productDetails');


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
app.use('/users', userUpdate);            // cập nhật thông tin người dùng
app.use('/api/chatbot', chatbotRoute);    // chatbot API
app.use('/server/featured-products', featuredProductsRoute);
app.use('/api/products', productsRoute);  // API sản phẩm

// Các route account settings
app.use('/api/profile', profileRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/billing', billingRoutes);


// Admin routes
app.use('/api/admin/auth', adminAuthRouter);

// Unprotected products API (tạm thời để test) 
app.use('/api/admin/products', adminProducts);
app.use('/', productDetailsRouter); // Đảm bảo có dòng này
// Protected admin routes
app.use('/api/admin', authenticateAdmin);
app.use('/api/admin/dashboard', adminDashboard);
app.use('/api/admin/orders', adminOrders);
app.use('/api/admin/inventory', adminInventory);

// Serve frontend từ thư mục gốc
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log('\n Các trang chính:');
  console.log(`- Trang chủ        http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập        http://localhost:${PORT}/Page/login.html`);
  console.log(`- Trang Admin      http://localhost:${PORT}/Page/admin/index.html`);
  console.log(`- Chatbot          http://localhost:${PORT}/Page/chatbot.html`);
});

module.exports = app;
