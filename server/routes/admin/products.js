const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../../db');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../..', 'images/products/'));
    },
    filename: function(req, file, cb) {
        cb(null, 'image-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all products (admin view)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                p.*, 
                COALESCE(u.name, 'Unknown') as seller_name 
            FROM 
                products p 
            LEFT JOIN 
                users u ON p.seller_id = u.id 
            ORDER BY p.id DESC
        `;
        
        db.query(query, [], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // Format image URLs
            results = results.map(product => {
                if (product.image && !product.image.startsWith('http')) {
                    product.image = '/images/products/' + product.image;
                }
                return product;
            });
            
            res.json(results);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add new product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        const image = req.file ? req.file.filename : null;
        
        const query = `
            INSERT INTO products 
            (name, category, price, stock, description, image) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(query, [name, category, price, stock, description, image], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.status(201).json({
                id: results.insertId,
                name,
                category,
                price,
                stock,
                description,
                image: image ? '/images/products/' + image : null
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, stock, description } = req.body;
        const image = req.file ? req.file.filename : null;
        
        let query = `
            UPDATE products 
            SET name = ?, category = ?, price = ?, stock = ?, description = ?
        `;
        
        const params = [name, category, price, stock, description];
        
        if (image) {
            query += ', image = ?';
            params.push(image);
        }
        
        query += ' WHERE id = ?';
        params.push(id);
        
        db.query(query, params, (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                id: parseInt(id),
                name,
                category,
                price,
                stock,
                description,
                image: image ? '/images/products/' + image : null
            });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const query = 'DELETE FROM products WHERE id = ?';
        
        db.query(query, [id], (err) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.status(204).send();
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
