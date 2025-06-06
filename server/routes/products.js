/**
 * Product Routes Module
 * This module handles all API routes related to products
 */

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Changed db to pool
const fs = require('fs'); // Require fs module to check file existence

/**
 * GET /api/products
 * Get all products with optional filtering
 */
router.get('/', async (req, res) => {
    try {
        const { category, min_price, max_price, seller_id, search } = req.query;
        
        console.log('Đang truy vấn sản phẩm với các tham số:', { category, min_price, max_price, seller_id, search });
        
        // Truy vấn sản phẩm và thông tin seller, sử dụng trường category trong bảng products
        let queryText = `
            SELECT 
                p.*, 
                COALESCE(u.name, 'Unknown') as seller_name
            FROM 
                products p
            LEFT JOIN 
                users u ON p.seller_id = u.id
            WHERE 1=1
        `;
        const params = [];
        let paramIndex = 1;
        
        // Add category filter if provided - dùng trường category trong bảng products
        if (category) {
            queryText += ` AND p.category = $${paramIndex++}`;
            params.push(category);
        }
        
        // Add price range filter if provided
        if (min_price) {
            queryText += ` AND p.price >= $${paramIndex++}`;
            params.push(parseFloat(min_price));
        }
        if (max_price) {
            queryText += ` AND p.price <= $${paramIndex++}`;
            params.push(parseFloat(max_price));
        }
        
        // Add seller filter if provided
        if (seller_id) {
            queryText += ` AND p.seller_id = $${paramIndex++}`;
            params.push(parseInt(seller_id));
        }
        
        // Add search filter if provided
        if (search) {
            queryText += ` AND (p.name ILIKE $${paramIndex++} OR p.description ILIKE $${paramIndex++})`; // Changed LIKE to ILIKE for case-insensitive search
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }
        
        console.log('Executing query:', queryText);
        console.log('With params:', params);
        
        // Execute the query
        const { rows } = await pool.query(queryText, params); // Changed db.query to pool.query and callback to async/await
            
        console.log(`API trả về ${rows.length} sản phẩm`);
            
        // Xử lý kết quả để đảm bảo các trường đúng định dạng
        // Ensure image paths are valid and fallback to default image if missing
        const processedResults = rows.map(product => {
            // Check if the image exists in the products folder
            const imagePath = `./images/products/${product.image}`;

            if (!product.image || !fs.existsSync(imagePath)) {
                product.image = '/images/products/default-product.jpg';
            } else if (!product.image.startsWith('http') && !product.image.startsWith('/')) {
                product.image = '/images/products/' + product.image;
            }

            return product;
        });
            
        res.json(processedResults);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

/**
 * GET /api/products/:id
 * Get a specific product by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const queryText = `
            SELECT 
                p.*, 
                COALESCE(u.name, 'Unknown') as seller_name
            FROM 
                products p
            LEFT JOIN 
                users u ON p.seller_id = u.id
            WHERE p.id = $1
        `;
        
        const { rows } = await pool.query(queryText, [id]); // Changed db.query to pool.query and callback to async/await
            
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
            
        // Xử lý kết quả để đảm bảo các trường đúng định dạng
        const product = rows[0];
            
        // Đảm bảo đường dẫn ảnh đúng
        const imagePath = `./images/products/${product.image}`;
        if (!product.image || !fs.existsSync(imagePath)) {
            product.image = '/images/products/default-product.jpg';
        } else if (!product.image.startsWith('http') && !product.image.startsWith('/')) {
            product.image = '/images/products/' + product.image;
        }
            
        res.json(product);
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
        const queryText = `
            SELECT 
                p.*, 
                COALESCE(u.name, 'Unknown') as seller_name
            FROM 
                products p
            LEFT JOIN 
                users u ON p.seller_id = u.id
            WHERE p.category = $1 
        `; // Changed p.category = ? to p.category = $1
        
        const { rows } = await pool.query(queryText, [category]); // Changed db.query to pool.query and callback to async/await
        res.json(rows);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
