const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: 'Thiếu username' });

  try {
    const result = await db.query(
      `UPDATE users SET request_seller = TRUE WHERE username = $1 RETURNING *`,
      [username]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    res.json({ success: true, message: 'Gửi yêu cầu thành công' });
  } catch (err) {
    console.error('Lỗi gửi yêu cầu:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi gửi yêu cầu' });
  }
});

module.exports = router;
