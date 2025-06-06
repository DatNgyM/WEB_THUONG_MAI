const express = require('express');
const router = express.Router();
const db = require('../db');

// PUT /api/billing/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    is_premium,
    payment_method,
    account_number,
    account_name,
    bank_name,
    billing_email
  } = req.body;

  try {
    await db.query(`
      INSERT INTO billing_info (
        user_id, is_premium, payment_method,
        account_number, account_name, bank_name, billing_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) DO UPDATE SET
        is_premium = $2,
        payment_method = $3,
        account_number = $4,
        account_name = $5,
        bank_name = $6,
        billing_email = $7
    `, [id, is_premium, payment_method, account_number, account_name, bank_name, billing_email]);

    await db.query(`UPDATE users SET is_premium = $1 WHERE id = $2`, [is_premium, id]);

    res.json({ message: 'Billing information saved' });
  } catch (err) {
    console.error('Billing update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/billing/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM billing_info WHERE user_id = $1', [id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Billing fetch error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Kiểm tra và sửa route API xử lý cập nhật tài khoản ngân hàng
router.post('/update', async (req, res) => {
  try {
    const { userId, accountNumber, accountName, bankName } = req.body;
    
    // Sửa lại query để phù hợp với PostgreSQL
    const result = await db.query(`
      INSERT INTO billing_info 
        (user_id, account_number, account_name, bank_name)
      VALUES 
        ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE SET
        account_number = $2,
        account_name = $3,
        bank_name = $4
      RETURNING *
    `, [userId, accountNumber, accountName, bankName]);
    
    res.json({ success: true, data: result.rows[0] });
    
  } catch (error) {
    console.error('Lỗi cập nhật tài khoản:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm route này nếu chưa có
router.post('/update', async (req, res) => {
  try {
    const { userId, accountNumber } = req.body;
    
    // Cập nhật vào database
    await db.query(
      `INSERT INTO billing_info (user_id, account_number) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id) DO UPDATE 
       SET account_number = $2`,
      [userId, accountNumber]
    );
    
    res.json({ success: true, message: 'Cập nhật tài khoản thành công' });
  } catch (error) {
    console.error('Error updating bank account:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Thêm API endpoint để lấy thông tin tài khoản ngân hàng theo user ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Log để debug
    console.log('Fetching bank account info for user:', userId);
    
    // Query database
    const result = await db.query(
      'SELECT * FROM billing_info WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length > 0) {
      res.json({
        success: true,
        account: result.rows[0]
      });
    } else {
      res.json({
        success: true,
        account: null,
        message: 'No bank account information found'
      });
    }
  } catch (error) {
    console.error('Error fetching bank account:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
