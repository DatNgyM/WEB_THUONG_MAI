const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM admins WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      res.json({
        success: true,
        role: 'admin',
        name: admin.name || admin.username
      });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
