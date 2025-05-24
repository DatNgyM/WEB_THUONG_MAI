/**
 * User authentication middleware
 * Uses session-based authentication to protect routes
 */

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Người dùng chưa đăng nhập' });
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
};

// Middleware to check if user is a seller
const isSeller = (req, res, next) => {
  if (req.session && req.session.user && 
     (req.session.user.role === 'seller' || req.session.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Yêu cầu quyền người bán' });
};

module.exports = {
  isAuthenticated,
  isAdmin,
  isSeller
};
