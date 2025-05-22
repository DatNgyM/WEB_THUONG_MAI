const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ success: false, message: 'Thiếu username' });

  try {
    // Kiểm tra CCCD của người dùng trước khi cho đăng ký
    const userCheck = await db.query(
      `SELECT cccd FROM users WHERE username = $1`,
      [username]
    );
    
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    
    // Kiểm tra CCCD có hợp lệ không (không phải tạm thời)
    const cccd = userCheck.rows[0].cccd;
    if (!cccd || (cccd.charAt(0) === 'T' && !isNaN(cccd.substring(1)))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bạn cần cập nhật CCCD hợp lệ trước khi đăng ký người bán',
        needCccdUpdate: true
      });
    }
    
    // Nếu CCCD hợp lệ, tiếp tục đăng ký
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

router.get('/status/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const result = await db.query(
      `SELECT is_seller, request_seller FROM users WHERE username = $1`,
      [username]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    const user = result.rows[0];
    res.json({ 
      success: true, 
      is_seller: user.is_seller,
      request_pending: user.request_seller 
    });
  } catch (err) {
    console.error('Lỗi kiểm tra trạng thái:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi kiểm tra trạng thái' });
  }
});

module.exports = router;
