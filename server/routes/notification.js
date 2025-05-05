const express = require('express');
const router = express.Router();
const db = require('../db');

// PUT /api/notification/:userId
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    alert_login, alert_password,
    comments, updates, reminders, events, pages_follow
  } = req.body;

  try {
    await db.query(`
      INSERT INTO notification_settings (
        user_id, alert_login, alert_password,
        comments, updates, reminders, events, pages_follow
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id)
      DO UPDATE SET
        alert_login = $2,
        alert_password = $3,
        comments = $4,
        updates = $5,
        reminders = $6,
        events = $7,
        pages_follow = $8
    `, [userId, alert_login, alert_password, comments, updates, reminders, events, pages_follow]);

    res.json({ message: 'Notification settings saved' });
  } catch (err) {
    console.error('Notification update error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/notification/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await db.query('SELECT * FROM notification_settings WHERE user_id = $1', [userId]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Notification get error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
