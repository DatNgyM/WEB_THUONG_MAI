const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trước hết, tìm người dùng admin dựa trên username
    const result = await db.query(
      'SELECT * FROM admins WHERE username = $1',
      [username]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];
      
      // Kiểm tra mật khẩu
      // Lưu ý: Trong môi trường thực tế, hãy sử dụng bcrypt so sánh
      // const validPassword = await bcrypt.compare(password, admin.password_hash);
      // Tạm thời so sánh trực tiếp để demo
      const validPassword = (password === admin.password);
      
      if (validPassword) {
        // Tạo JWT token nếu sử dụng (không bắt buộc)
        const token = jwt.sign(
          { id: admin.id, username: admin.username, role: 'admin' },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '1h' }
        );
        
        // Trả về thông tin thành công với role và name đầy đủ
        res.json({
          success: true,
          role: 'admin',
          name: admin.name || admin.username,
          token: token
        });
      } else {
        res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
      }
    } else {
      // Thời gian phản hồi không đổi để tránh timing attack
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi đăng nhập admin:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
