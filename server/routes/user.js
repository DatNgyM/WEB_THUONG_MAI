// server/routes/user.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Đăng ký tài khoản người dùng
router.post('/register', async (req, res) => {
  // ✅ Chống crash nếu req.body là undefined
  const body = req.body || {};
  const { name, username, email, password } = body;

  // ✅ In log để debug
  console.log('[DEBUG] req.body:', req.body);

  // Kiểm tra thiếu thông tin
  if (!name || !username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng ký!' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users(name, username, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, username, email, password]
    );

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Register failed:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
