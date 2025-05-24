const express = require('express');
const router = express.Router();
const pool = require('../db');
const { v4: uuidv4 } = require('uuid');

// Admin login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      
      // Create admin session
      req.session.admin = {
        id: admin.id,
        name: admin.name,
        username: admin.username,
        role: 'admin',
        sessionId: uuidv4() // Unique session identifier
      };
      
      res.json({
        success: true,
        name: admin.name,
        role: 'admin'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Session status check
router.get('/status', (req, res) => {
  if (req.session && req.session.admin) {
    res.json({
      isAuthenticated: true,
      admin: {
        id: req.session.admin.id,
        name: req.session.admin.name,
        username: req.session.admin.username,
        role: 'admin'
      }
    });
  } else {
    res.json({
      isAuthenticated: false
    });
  }
});

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  if (req.session && req.session.admin) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Unauthorized'
  });
};

module.exports = {
  router,
  authenticateAdmin
};
