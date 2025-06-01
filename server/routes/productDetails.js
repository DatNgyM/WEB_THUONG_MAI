const express = require('express');
const router = express.Router();
const db = require('../db');
const { enhanceProductIntelligently } = require('../middleware/smartProductEnhancer');

// GET single product by ID
router.get('/api/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    console.log(`Fetching product with ID: ${productId}`);
    
    const query = `
      SELECT p.*, 
             c.name as category_name,
             s.name as seller_name
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN sellers s ON p.seller_id = s.id
      WHERE p.id = ?
    `;
    
    const result = await db.query(query, [productId]);
    
    if (result.length === 0) {
      console.log(`Product with ID ${productId} not found`);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = result[0];
    console.log('Found product:', product.name);
    
    // Xử lý images
    let images = [];
    if (product.images) {
      if (Array.isArray(product.images)) {
        images = product.images.map(img => processImagePath(img));
      } else if (typeof product.images === 'string') {
        try {
          const parsedImages = JSON.parse(product.images);
          if (Array.isArray(parsedImages)) {
            images = parsedImages.map(img => processImagePath(img));
          }
        } catch (e) {
          console.log('Error parsing images JSON:', e);
          images = [processImagePath(product.images)];
        }
      }
    }
    
    // Format response
    const formattedProduct = {
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: processImagePath(product.image),
      images: images.length > 0 ? images : [processImagePath(product.image)],
      category: product.category_name || product.category,
      brand: product.brand,
      rating: parseFloat(product.rating) || 4,
      description: product.description,
      seller: product.seller_name
    };
    
    // ↓ SỬ DỤNG SMART ENHANCER ↓
    const enhancedProduct = enhanceProductIntelligently(formattedProduct);
    
    console.log('Enhanced product:', enhancedProduct.name);
    console.log('Product type:', enhancedProduct._enhancer_info?.type);
    console.log('Product tier:', enhancedProduct._enhancer_info?.tier);
    
    res.json(enhancedProduct);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function
function processImagePath(path) {
  if (!path) return '/images/products/default-product.jpg';
  if (!path.startsWith('/') && !path.startsWith('http')) {
    path = '/' + path;
  }
  return path;
}

module.exports = router;

