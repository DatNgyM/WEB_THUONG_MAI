const express = require('express');
const router = express.Router();
const pool = require('../db');

// Đăng ký tài khoản người dùng
router.post('/register', async (req, res) => {
  const { name, username, email, password, cccd } = req.body;
  console.log('BODY:', req.body); 
  try {
    // Check trùng username hoặc email
    const check = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (check.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email hoặc username đã tồn tại' });
    }

    // Generate temporary CCCD if not provided
    // Sử dụng format ngắn hơn, tối đa 20 ký tự
    const userCccd = cccd || `T${Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0')}`;

    const result = await pool.query(
      'INSERT INTO users(name, username, email, password, cccd) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, username, email, password, userCccd]
    );

    res.status(201).json({ success: true, message: 'Đăng ký thành công', user: result.rows[0] });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
