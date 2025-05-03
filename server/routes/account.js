const express = require('express');
const router = express.Router();
const db = require('../db');

// Cập nhật username
router.put('/:userId/username', async (req, res) => {
  const { userId } = req.params;
  const { username } = req.body;
  await db.query('UPDATE users SET username = $1 WHERE id = $2', [username, userId]);
  res.json({ message: 'Username updated' });
});

// Xoá tài khoản
router.delete('/:userId', async (req, res) => {
  const { userId } = req.params;
  await db.query('DELETE FROM users WHERE id = $1', [userId]);
  res.json({ message: 'Account deleted' });
});

module.exports = router; // 
