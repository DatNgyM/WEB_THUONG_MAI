// server/routes/userAuth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ success: true, name: user.name, username: user.username });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('❌ Lỗi đăng nhập user:', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
