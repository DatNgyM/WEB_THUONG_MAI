const express = require('express');
const router = express.Router();
const db = require('../server/db');

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, bio, url, location } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = $1, bio = $2, url = $3, location = $4 WHERE id = $5',
      [name, bio, url, location, id]
    );
    res.json({ message: 'Profile updated' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
