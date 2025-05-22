const express = require('express');
const router = express.Router();
const pool = require('../db');

// Cập nhật thông tin CCCD
router.post('/update-cccd', async (req, res) => {
  const { userId, cccd } = req.body;
  
  if (!userId || !cccd) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin userId hoặc CCCD' });
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

// Cập nhật thông tin profile bao gồm cả CCCD
router.post('/update-profile', async (req, res) => {
  const { userId, name, phoneNumber, address, email, cccd } = req.body;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin userId' });
  }

  try {
    let updates = [];
    let params = [];
    let paramCount = 1;
    
    // Thêm các trường cần cập nhật
    if (name) {
      updates.push(`name = $${paramCount++}`);
      params.push(name);
    }
    
    if (phoneNumber) {
      updates.push(`phone = $${paramCount++}`); // Sửa từ phone_number thành phone để khớp với tên cột trong DB
      params.push(phoneNumber);
    }
    
    if (address) {
      updates.push(`address = $${paramCount++}`);
      params.push(address);
    }
    
    if (email) {
      updates.push(`email = $${paramCount++}`);
      params.push(email);
    }
    
    // Kiểm tra CCCD nếu được cung cấp
    if (cccd) {
      // Kiểm tra định dạng CCCD
      if (!/^\d{12}$/.test(cccd)) {
        return res.status(400).json({ success: false, message: 'CCCD phải có đúng 12 chữ số' });
      }

      // Kiểm tra xem CCCD này đã được sử dụng chưa
      const checkCCCD = await pool.query('SELECT * FROM users WHERE cccd = $1 AND id != $2', [cccd, userId]);
      if (checkCCCD.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'CCCD này đã được đăng ký bởi người dùng khác' });
      }
      
      updates.push(`cccd = $${paramCount++}`);
      params.push(cccd);
    }
    
    // Nếu không có gì để cập nhật
    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'Không có thông tin cần cập nhật' });
    }
    
    // Thêm userId vào cuối params
    params.push(userId);
      // Thực hiện cập nhật
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    
    // Chuẩn bị dữ liệu phản hồi với trường phoneNumber
    const updatedUser = {...result.rows[0]};
    updatedUser.phoneNumber = updatedUser.phone; // Đảm bảo có trường phoneNumber
    
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

// API đăng ký người bán
router.post('/register-seller', async (req, res) => {
  const { userId, shopName, businessType, businessAddress, taxCode, cccd } = req.body;
  
  if (!userId || !shopName || !businessType || !businessAddress || !cccd) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin bắt buộc' });
  }

  try {
    // Kiểm tra xem người dùng có hợp lệ không
    const userCheck = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    
    const user = userCheck.rows[0];
    
    // Kiểm tra CCCD
    if (!user.cccd || (user.cccd.charAt(0) === 'T' && !isNaN(user.cccd.substring(1)))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bạn cần cập nhật CCCD hợp lệ trước khi đăng ký người bán' 
      });
    }
    
    // Kiểm tra xem người dùng đã đăng ký làm người bán chưa
    if (user.request_seller) {
      return res.status(409).json({ 
        success: false, 
        message: 'Bạn đã đăng ký làm người bán. Vui lòng đợi phê duyệt.' 
      });
    }
    
    if (user.role === 'seller') {
      return res.status(409).json({ 
        success: false, 
        message: 'Bạn đã là người bán.' 
      });
    }
    
    // Cập nhật trạng thái yêu cầu làm người bán
    await pool.query(
      'UPDATE users SET request_seller = true WHERE id = $1',
      [userId]
    );
    
    // Lưu thông tin cửa hàng
    await pool.query(
      'INSERT INTO seller_info(user_id, shop_name, business_type, address, tax_code) VALUES ($1, $2, $3, $4, $5)',
      [userId, shopName, businessType, businessAddress, taxCode]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Đăng ký người bán thành công. Chúng tôi sẽ xem xét yêu cầu của bạn trong thời gian sớm nhất.' 
    });
  } catch (err) {
    console.error('[REGISTER SELLER ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
});

// Lấy thông tin người dùng
router.get('/get-user-data', async (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin userId' });
  }

  try {
    // Truy vấn thông tin người dùng từ database
    const userResult = await pool.query(`
      SELECT id, name, username, email, cccd, phone, address, created_at
      FROM users WHERE id = $1
    `, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
    
    // Lấy thông tin vai trò người dùng
    const roleResult = await pool.query(`
      SELECT role, is_verified, request_seller, is_premium
      FROM user_roles WHERE cccd = $1
    `, [userResult.rows[0].cccd]);
    
    // Lấy thông tin thanh toán
    const billingResult = await pool.query(`
      SELECT payment_method, account_number, account_name, bank_name, billing_email
      FROM billing_info WHERE user_id = $1
    `, [userId]);
    
    // Lấy thông tin cài đặt thông báo
    const notificationResult = await pool.query(`
      SELECT comments, updates, reminders, events, pages_you_follow, alert_login, alert_password
      FROM notification_settings WHERE user_id = $1
    `, [userId]);
    
    // Tổng hợp thông tin
    const userData = {
      ...userResult.rows[0],
      phoneNumber: userResult.rows[0].phone, // Đảm bảo tính nhất quán giữa phone và phoneNumber
      role: roleResult.rows.length > 0 ? roleResult.rows[0].role : 'buyer',
      is_verified: roleResult.rows.length > 0 ? roleResult.rows[0].is_verified : false,
      request_seller: roleResult.rows.length > 0 ? roleResult.rows[0].request_seller : false,
      is_premium: roleResult.rows.length > 0 ? roleResult.rows[0].is_premium : false
    };
    
    // Thêm thông tin billing nếu có
    if (billingResult.rows.length > 0) {
      userData.billing = billingResult.rows[0];
    }
    
    // Thêm thông tin notification settings nếu có
    if (notificationResult.rows.length > 0) {
      userData.notifications = notificationResult.rows[0];
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Lấy thông tin người dùng thành công',
      user: userData
    });
  } catch (err) {
    console.error('[GET USER DATA ERROR]', err);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ khi lấy thông tin người dùng' });
  }
});

module.exports = router;
