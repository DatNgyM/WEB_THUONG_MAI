const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');

// Cập nhật thông tin CCCD (bảo vệ bằng session)
router.post('/update-cccd', isAuthenticated, async (req, res) => {
  // Lấy userId từ session thay vì body request
  const userId = req.session.user.id;
  const { cccd } = req.body;
  
  if (!cccd) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin CCCD' });
  }

  try {
    // Kiểm tra định dạng CCCD
    if (!/^\d{12}$/.test(cccd)) {
      return res.status(400).json({ success: false, message: 'CCCD phải có đúng 12 chữ số' });
    }

    // Kiểm tra xem CCCD này đã được sử dụng chưa
    const checkCCCD = await pool.query('SELECT * FROM users WHERE cccd = $1 AND id != $2', [cccd, userId]);
    if (checkCCCD.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'CCCD này đã được đăng ký bởi người dùng khác' });
    }

    // Cập nhật CCCD trong database
    const result = await pool.query(
      'UPDATE users SET cccd = $1 WHERE id = $2 RETURNING *',
      [cccd, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    // Cập nhật thông tin người dùng trong session
    req.session.user.cccd = cccd;

    res.status(200).json({ 
      success: true, 
      message: 'Cập nhật CCCD thành công', 
      user: result.rows[0] 
    });
  } catch (err) {
    console.error('[UPDATE CCCD ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// Cập nhật thông tin profile bao gồm cả CCCD (bảo vệ bằng session)
router.post('/update-profile', isAuthenticated, async (req, res) => {
  // Lấy userId từ session thay vì body request
  const userId = req.session.user.id;
  const { name, phoneNumber, address, email, cccd } = req.body;
  
  try {
    // Xây dựng câu truy vấn động
    let updateFields = [];
    let queryParams = [];
    let paramCount = 1;
    
    // Thêm các trường cần cập nhật nếu có
    if (name) {
      updateFields.push(`name = $${paramCount}`);
      queryParams.push(name);
      paramCount++;
    }
    
    if (phoneNumber) {
      updateFields.push(`phone = $${paramCount}`);
      queryParams.push(phoneNumber);
      paramCount++;
    }
    
    if (address) {
      updateFields.push(`address = $${paramCount}`);
      queryParams.push(address);
      paramCount++;
    }
    
    if (email) {
      updateFields.push(`email = $${paramCount}`);
      queryParams.push(email);
      paramCount++;
    }
    
    if (cccd) {
      // Kiểm tra định dạng CCCD nếu được cung cấp
      if (!/^\d{12}$/.test(cccd)) {
        return res.status(400).json({ success: false, message: 'CCCD phải có đúng 12 chữ số' });
      }
      
      // Kiểm tra xem CCCD này đã được sử dụng chưa
      const checkCCCD = await pool.query('SELECT * FROM users WHERE cccd = $1 AND id != $2', [cccd, userId]);
      if (checkCCCD.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'CCCD này đã được đăng ký bởi người dùng khác' });
      }
      
      updateFields.push(`cccd = $${paramCount}`);
      queryParams.push(cccd);
      paramCount++;
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có thông tin nào để cập nhật' });
    }
    
    // Thêm userId vào tham số truy vấn
    queryParams.push(userId);
    
    // Thực hiện truy vấn cập nhật
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;
    
    const result = await pool.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    
    const updatedUser = result.rows[0];
    
    // Cập nhật thông tin phiên người dùng
    if (name) req.session.user.name = name;
    if (email) req.session.user.email = email;
    if (cccd) req.session.user.cccd = cccd;
    
    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updatedUser
    });
    
  } catch (err) {
    console.error('[UPDATE PROFILE ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// Cập nhật mật khẩu (bảo vệ bằng session)
router.post('/update-password', isAuthenticated, async (req, res) => {
  const userId = req.session.user.id;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Thiếu mật khẩu hiện tại hoặc mật khẩu mới' });
  }
  
  try {
    // Kiểm tra mật khẩu hiện tại
    const checkPass = await pool.query('SELECT * FROM users WHERE id = $1 AND password = $2', [userId, currentPassword]);
    
    if (checkPass.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Cập nhật mật khẩu mới
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);
    
    res.status(200).json({ success: true, message: 'Cập nhật mật khẩu thành công' });
  } catch (err) {
    console.error('[UPDATE PASSWORD ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

module.exports = router;
