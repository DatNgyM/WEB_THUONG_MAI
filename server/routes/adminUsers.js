const express = require('express');
const router = express.Router();
const db = require('../db'); 


router.get('/users', async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, username, email, role, is_verified, request_seller FROM users ORDER BY id');
    res.json({ success: true, users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách người dùng' });
  }
});

module.exports = router;
