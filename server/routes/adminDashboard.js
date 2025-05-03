const express = require('express');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        // Here you would normally fetch this data from your database
        // This is mock data for demonstration
        const stats = {
            todayOrders: 125,
            ordersTrend: 12,
            revenue: 15850,
            revenueTrend: 8,
            activeUsers: 485,
            newUsers: 15,
            lowStockItems: 15,
            salesData: [
                { date: 'Jan', amount: 12000 },
                { date: 'Feb', amount: 19000 },
                { date: 'Mar', amount: 3000 },
                { date: 'Apr', amount: 5000 },
                { date: 'May', amount: 2000 },
                { date: 'Jun', amount: 3000 }
            ],
            categoryData: [
                { category: 'Smartphones', percentage: 45 },
                { category: 'Laptops', percentage: 25 },
                { category: 'Accessories', percentage: 20 },
                { category: 'Others', percentage: 10 }
            ]
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
    }
});

// Get recent orders
router.get('/recent-orders', async (req, res) => {
    try {
        // Mock data - replace with database queries
        const orders = [
            {
                id: '122349',
                customerName: 'John Doe',
                items: 'iPhone 16 Pro Max',
                total: 1299.00,
                status: 'processing'
            }
            // Add more orders as needed
        ];
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent orders' });
    }
});

// Get top products
router.get('/top-products', async (req, res) => {
    try {
        // Mock data - replace with database queries
        const products = [
            {
                name: 'iPhone 16 Pro Max',
                unitsSold: 150,
                revenue: 194850
            }
            // Add more products as needed
        ];
        
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top products' });
    }
});

// Get customer activity
router.get('/customer-activity', async (req, res) => {
    try {
        // Mock data - replace with database queries
        const activities = [
            {
                customerName: 'John Doe',
                action: 'purchased',
                product: 'iPhone 16 Pro Max',
                timeAgo: '1 hour ago'
            }
            // Add more activities as needed
        ];
        
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer activity' });
    }
});

module.exports = router;