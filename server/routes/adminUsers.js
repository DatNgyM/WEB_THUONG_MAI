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
router.post('/approve-seller', async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ success: false, message: 'Thiếu username!' });
    }
  
    try {
      const result = await db.query(
        'UPDATE users SET role = $1, is_verified = true WHERE username = $2 RETURNING *',
        ['seller', username]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng!' });
      }
  
      res.json({ success: true, message: 'Duyệt thành công', user: result.rows[0] });
    } catch (err) {
      console.error('Lỗi duyệt seller:', err);
      res.status(500).json({ success: false, message: 'Lỗi server khi duyệt seller' });
    }
  });
  
module.exports = router;
