const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// User Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng nhập' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Create user object to store in session
      const userSession = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        cccd: user.cccd,
        role: user.role,
        created_at: user.created_at,
        is_verified: user.is_verified || false,
        request_seller: user.request_seller || false,
        is_premium: user.is_premium || false,
        sessionId: uuidv4() // Unique session identifier
      };
      
      // Store user in session
      req.session.user = userSession;
      
      // Create response object to send to client
      const userResponse = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        cccd: user.cccd,
        role: user.role,
        created_at: user.created_at,
        is_verified: user.is_verified || false,
        request_seller: user.request_seller || false,
        is_premium: user.is_premium || false
      };
      
      res.json({
        success: true,
        name: user.name,
        role: user.role,
        user: userResponse,
        sessionActive: true
      });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi truy vấn:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

// User Logout Route
router.get('/logout', (req, res) => {
  console.log('Processing logout request from session...');
  
  // Lưu thông tin cũ để log
  const oldSession = req.session ? { ...req.session } : null;
  console.log('Old session data:', JSON.stringify(oldSession));
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Đăng xuất thất bại' });
    }
    
    // Xóa cookie session
    res.clearCookie('connect.sid');
    
    console.log('Session destroyed successfully');
    res.json({ success: true, message: 'Đăng xuất thành công' });
  });
});

// Thêm route POST để hỗ trợ cả phương thức POST
router.post('/logout', (req, res) => {
  console.log('Processing POST logout request...');
  
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ success: false, message: 'Đăng xuất thất bại' });
    }
    
    // Xóa cookie session
    res.clearCookie('connect.sid');
    
    console.log('Session destroyed successfully via POST');
    res.json({ success: true, message: 'Đăng xuất thành công' });
  });
});

// Check Authentication Status
router.get('/status', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ 
      isAuthenticated: true, 
      user: {
        id: req.session.user.id,
        name: req.session.user.name,
        role: req.session.user.role,
        email: req.session.user.email,
        username: req.session.user.username,
        cccd: req.session.user.cccd,
        is_verified: req.session.user.is_verified,
        request_seller: req.session.user.request_seller,
        is_premium: req.session.user.is_premium
      }
    });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

module.exports = router;
