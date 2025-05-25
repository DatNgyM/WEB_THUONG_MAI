/**
 * Product Routes Module
 * This module handles all API routes related to products
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * GET /api/products
 * Get all products with optional filtering
 */
router.get('/', async (req, res) => {
    try {
        const { category, min_price, max_price, seller_id, search } = req.query;
        
        // Build query with potential filters
        let query = 'SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE 1=1';
        const params = [];
        
        // Add category filter if provided
        if (category) {
            query += ' AND p.category = ?';
            params.push(category);
        }
        
        // Add price range filter if provided
        if (min_price) {
            query += ' AND p.price >= ?';
            params.push(parseFloat(min_price));
        }
        if (max_price) {
            query += ' AND p.price <= ?';
            params.push(parseFloat(max_price));
        }
        
        // Add seller filter if provided
        if (seller_id) {
            query += ' AND p.seller_id = ?';
            params.push(parseInt(seller_id));
        }
        
        // Add search filter if provided
        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        
        // Execute the query
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/products/:id
 * Get a specific product by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.id = ?';
        
        db.query(query, [id], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }
            
            res.json(results[0]);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/products/category/:category
 * Get products by category
 */
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const query = 'SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.category = ?';
        
        db.query(query, [category], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
