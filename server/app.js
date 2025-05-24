const express = require('express');
const cors = require('cors');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { router: adminAuthRouter, authenticateAdmin } = require('./routes/adminAuth');
const pool = require('./db');
const app = express();

// Các route chính
const userRegister = require('./routes/userRegister');
const userAuth = require('./routes/userAuth');
const sessionAuth = require('./routes/sessionAuth');
const userUpdate = require('./routes/userUpdate'); // Thêm route cập nhật thông tin người dùng
const adminUsers = require('./routes/adminUsers');
const authRoutes = require('./routes/auth');
const { router: sessionAdminAuth, authenticateAdmin: sessionAuthenticateAdmin } = require('./routes/sessionAdminAuth');
const requestSellerRoute = require('./routes/requestSeller');
const chatbotRoute = require('./routes/chatbot');
const featuredProductsRoute = require('./routes/featuredProducts'); // Thêm dòng này

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



const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());

// Session middleware
app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'sessions'
  }),
  secret: 'ecommerce-web-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


// Đăng ký route API
app.use('/user/request-seller', requestSellerRoute);
app.use('/userAuth', userAuth);           // login người dùng (cũ, sử dụng JWT)
app.use('/session', sessionAuth);         // login người dùng (mới, sử dụng session)
app.use('/auth', authRoutes);             // login admin
app.use('/admin', adminUsers);            // quản lý user từ admin
app.use('/user', userRegister);           // đăng ký tài khoản người dùng
app.use('/users', userUpdate);            // cập nhật thông tin người dùng (cũ, không có bảo mật session)
app.use('/api/profile', require('./routes/sessionUserUpdate')); // cập nhật thông tin người dùng (mới, có bảo mật session)
app.use('/api/chatbot', chatbotRoute);    // chatbot API
app.use('/server/featured-products', featuredProductsRoute); // Thêm dòng này

// Các route account settings
app.use('/api/profile', profileRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/billing', billingRoutes);


// Admin routes
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/session', sessionAdminAuth);  // Session-based admin authentication

// Unprotected products API (tạm thời để test) 
app.use('/api/admin/products', adminProducts);

// Protected admin routes (JWT)
app.use('/api/admin', authenticateAdmin);
app.use('/api/admin/dashboard', adminDashboard);
app.use('/api/admin/orders', adminOrders);
app.use('/api/admin/inventory', adminInventory);

// Protected admin routes (Session)
app.use('/api/admin/session-protected', sessionAuthenticateAdmin);
// Session-based protected APIs can be added here as needed

// Serve frontend từ thư mục gốc
app.use(express.static(path.join(__dirname, '../')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log('\n📄 Các trang chính:');
  console.log(`- Trang chủ        http://localhost:${PORT}/Page/index.html`);
  console.log(`- Đăng nhập        http://localhost:${PORT}/Page/login.html`);
  console.log(`- Trang Admin      http://localhost:${PORT}/Page/admin/index.html`);
  console.log(`- Chatbot          http://localhost:${PORT}/Page/chatbot.html`);
});

module.exports = app;
