const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// In-memory admin user (replace with database in production)
const adminUser = {
    username: 'admin',
    // Default password: "admin123" (hashed)
    password: '$2b$10$RzgpS4FpxXwzIb8T5AS8A.t7ITIcHRQ1D8m8F1Ec5VD8Q0JCt3Yte'
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.adminToken || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.admin = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate admin credentials
    if (username !== adminUser.username) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(password, adminUser.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create and assign token
    const token = jwt.sign(
        { id: 'admin', username: adminUser.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
    );

    // Set token in cookie
    res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000 // 1 hour
    });

    res.json({ token });
});

// Check auth status route
router.get('/status', authenticateAdmin, (req, res) => {
    res.json({ status: 'authenticated', admin: req.admin });
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('adminToken');
    res.json({ message: 'Logged out successfully' });
});

// Change password route
router.post('/change-password', authenticateAdmin, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, adminUser.password);
    if (!validPassword) {
        return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    adminUser.password = await bcrypt.hash(newPassword, salt);

    res.json({ message: 'Password changed successfully' });
});

module.exports = {
    router,
    authenticateAdmin
};