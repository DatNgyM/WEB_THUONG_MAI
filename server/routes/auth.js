// server/routes/auth.js


const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM admins WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
