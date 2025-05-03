const express = require('express');
const router = express.Router();
const db = require('../db');

// CHANGE password (giả định old password đã được xác thực)

// router.put('/:userId/password', async (req, res) => {
//   const { userId } = req.params;
//   const { newPassword } = req.body;
//   await db.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);
//   res.json({ message: 'Password changed' });
// });

router.put('/:userId/password', async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  // check & update logic
  await db.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, userId]);
  res.json({ message: 'Password changed' });
});

module.exports = router;
