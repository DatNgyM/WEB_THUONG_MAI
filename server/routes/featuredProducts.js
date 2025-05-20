const express = require('express');
const router = express.Router();

// Mock data for featured products
const featuredProducts = [
    {
        id: 1,
        name: "iPhone 16 Pro Max",
        price: 1299.99,
        image: "/images/iphone-16-pro-max-titan.jpg"
    },
    {
        id: 2,
        name: "Apple Watch Ultra 2",
        price: 799.99,
        image: "/images/apple-watch-ultra-2-lte-49mm-vien-titanium-day-milan-638641727211652156-750x500.jpg"
    },
    {
        id: 3,
        name: "MacBook Pro 14-inch M4",
        price: 1999.99,
        image: "/images/macbook-pro-14-inch-m4-16gb-512gb-tgdd-den-1-638660152965882579-750x500.jpg"
    },
    {
        id: 4,
        name: "MSI Stealth 14 AI Studio",
        price: 1799.99,
        image: "/images/msi-stealth-14-ai-studio-a1vfg-ultra-7-085vn.jpg"
    },
    {
        id: 5,
        name: "Ferrari Watch",
        price: 299.99,
        image: "/images/ferrari-0830772-nam1-700x467.jpg"
    }
];

router.get('/', (req, res) => {
    res.json(featuredProducts);
});

module.exports = router;
