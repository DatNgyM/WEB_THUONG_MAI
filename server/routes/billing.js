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

module.exports = router;
