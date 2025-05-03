const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../images/products'));
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Get inventory stats
router.get('/stats', async (req, res) => {
    try {
        // Mock data - replace with database queries
        const stats = {
            totalProducts: 1250,
            lowStockItems: 15,
            outOfStockItems: 5,
            totalValue: 125000
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory statistics' });
    }
});

// Get all inventory items with pagination and filters
router.get('/', async (req, res) => {
    try {
        const { page = 1, search, category } = req.query;
        const limit = 10;

        // Mock data - replace with database queries
        const inventory = [
            {
                id: 'P001',
                name: 'iPhone 16 Pro Max',
                category: 'Smartphones',
                inStock: 25,
                reorderLevel: 10,
                unitPrice: 999.00
            }
            // Add more items as needed
        ];

        const total = 1250; // Total number of items

        res.json({
            inventory,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inventory' });
    }
});

// Get single inventory item
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Mock data - replace with database query
        const item = {
            id,
            name: 'iPhone 16 Pro Max',
            category: 'Smartphones',
            inStock: 25,
            reorderLevel: 10,
            unitPrice: 999.00,
            description: 'Latest iPhone model',
            supplier: 'Apple Inc.',
            sku: 'IPH16PM-256-BLK'
        };

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

// Adjust stock level
router.post('/:id/adjust', async (req, res) => {
    try {
        const { id } = req.params;
        const { type, quantity, reason } = req.body;

        // Validate adjustment type
        if (!['add', 'remove'].includes(type)) {
            return res.status(400).json({ message: 'Invalid adjustment type' });
        }

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: 'Invalid quantity' });
        }

        // Here you would:
        // 1. Get current stock level
        // 2. Update stock level
        // 3. Log the adjustment in stock history
        // 4. Update product total value

        res.json({ message: 'Stock adjusted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adjusting stock' });
    }
});

// Get stock history for an item
router.get('/:id/history', async (req, res) => {
    try {
        const { id } = req.params;

        // Mock data - replace with database query
        const history = [
            {
                date: '2025-05-01',
                type: 'Addition',
                quantity: 10,
                previousStock: 15,
                newStock: 25,
                reason: 'New shipment received',
                updatedBy: 'Admin'
            }
            // Add more history entries as needed
        ];

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock history' });
    }
});

// Export inventory data (CSV/Excel)
router.get('/export', async (req, res) => {
    try {
        const { format = 'csv' } = req.query;

        // Mock CSV data
        const csv = 'Product ID,Name,Category,In Stock,Reorder Level,Unit Price,Total Value\n' +
                   'P001,iPhone 16 Pro Max,Smartphones,25,10,$999.00,$24975.00';

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=inventory-${new Date().toISOString().split('T')[0]}.csv`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error exporting inventory' });
    }
});

// Update reorder level
router.put('/:id/reorder-level', async (req, res) => {
    try {
        const { id } = req.params;
        const { reorderLevel } = req.body;

        if (reorderLevel < 0) {
            return res.status(400).json({ message: 'Invalid reorder level' });
        }

        // Here you would update the reorder level in your database

        res.json({ message: 'Reorder level updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating reorder level' });
    }
});

// Add new product
router.post('/products', async (req, res) => {
    try {
        const productData = req.body;

        // Validate required fields
        const requiredFields = ['name', 'category', 'sku', 'price', 'stock', 'reorderLevel', 'description'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        // Here you would:
        // 1. Check if SKU is unique
        // 2. Save product to database
        // 3. Create initial stock record
        // 4. Update inventory statistics

        // For now, just send success response
        res.status(201).json({
            message: 'Product added successfully',
            product: {
                id: 'P002', // This would normally come from the database
                ...productData
            }
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Handle image uploads
router.post('/upload-images', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }

        // Generate URLs for uploaded images
        const imageUrls = req.files.map(file => `/images/products/${file.filename}`);

        res.json({
            message: 'Images uploaded successfully',
            imageUrls
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Error uploading images' });
    }
});

module.exports = router;