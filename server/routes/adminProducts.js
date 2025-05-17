// adminProducts.js - API endpoints for managing products in admin panel
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Kết nối PostgreSQL (lấy thông tin từ file db.js)
const db = require('../db');
const pool = db.pool;

// Cấu hình multer cho việc upload ảnh
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../images/products');
    
    // Kiểm tra và tạo thư mục nếu không tồn tại
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Tạo tên file gồm timestamp + tên gốc, tránh trùng lặp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Giới hạn kích thước file và filter loại file
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Chỉ chấp nhận file hình ảnh: jpg, jpeg, png, webp"));
  }
});

// GET - Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy danh sách sản phẩm' });
  }
});

// GET - Lấy một sản phẩm theo ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server khi lấy thông tin sản phẩm' });
  }
});

// POST - Thêm sản phẩm mới
router.post('/', upload.single('image'), async (req, res) => {
  // Debug - in ra tất cả dữ liệu nhận được
  console.log('POST /api/admin/products - Body:', req.body);
  console.log('POST /api/admin/products - File:', req.file);
  
  // Lấy dữ liệu từ form
  const { name, description, price, stock_quantity, seller_id, category } = req.body;
  let imagePath = null;

  // Xử lý ảnh nếu có
  if (req.file) {
    // Lưu đường dẫn tương đối đến ảnh
    imagePath = path.relative(path.join(__dirname, '../..'), req.file.path)
      .replace(/\\/g, '/'); // Chuyển dấu \ thành / cho chuẩn URL
  }
  
  try {
    // Thêm sản phẩm vào database
    const query = `
      INSERT INTO products (name, description, price, stock_quantity, seller_id, image) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`;
      // Xác thực và chuyển đổi giá trị số
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0 || numericPrice >= 100000000) {
      throw new Error('Giá sản phẩm không hợp lệ. Giá phải nhỏ hơn 100.000.000');
    }
      const numericStock = parseInt(stock_quantity);
    if (isNaN(numericStock) || numericStock < 0) {
      throw new Error('Số lượng không hợp lệ');
    }
    
    const values = [
      name, 
      description, 
      numericPrice.toFixed(2), // Định dạng số thập phân đúng 
      numericStock, 
      seller_id || 1, // Mặc định là 1 nếu không có
      imagePath
    ];
    
    const result = await pool.query(query, values);
    
    // Trả về thông tin sản phẩm đã thêm
    res.status(201).json({ 
      message: 'Thêm sản phẩm thành công',
      product: result.rows[0]
    });
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm:', err);
    
    // Nếu có lỗi và đã upload file, xóa file đã upload
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Không thể xóa file:', unlinkErr);
      });
    }
    
    res.status(500).json({ error: 'Lỗi server khi thêm sản phẩm', details: err.message });
  }
});

// PUT - Cập nhật sản phẩm
router.put('/:id', upload.single('image'), async (req, res) => {  const { id } = req.params;
  const { name, description, price, stock_quantity, category } = req.body;
  
  try {
    // Kiểm tra sản phẩm tồn tại
    const checkResult = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm cần cập nhật' });
    }
    
    const oldProduct = checkResult.rows[0];
    
    // Xử lý ảnh nếu có
    let imagePath = oldProduct.image; // Giữ nguyên ảnh cũ nếu không cập nhật
    
    if (req.file) {
      // Lưu đường dẫn mới
      imagePath = path.relative(path.join(__dirname, '../..'), req.file.path)
        .replace(/\\/g, '/');
      
      // Xóa ảnh cũ nếu có
      if (oldProduct.image) {
        const oldImagePath = path.join(__dirname, '../..', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Lỗi xóa ảnh cũ:', err);
          });
        }
      }
    }
    
    // Cập nhật sản phẩm
    const query = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, stock_quantity = $4, image = $5
      WHERE id = $6
      RETURNING *`;
    
    const values = [      name || oldProduct.name,
      description || oldProduct.description,
      price || oldProduct.price,
      stock_quantity || oldProduct.stock_quantity,
      imagePath,
      id
    ];
    
    const result = await pool.query(query, values);
    
    res.json({ 
      message: 'Cập nhật sản phẩm thành công',
      product: result.rows[0]
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật sản phẩm:', err);
    
    // Xóa file nếu đã upload nhưng cập nhật thất bại
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Không thể xóa file:', unlinkErr);
      });
    }
    
    res.status(500).json({ error: 'Lỗi server khi cập nhật sản phẩm' });
  }
});

// DELETE - Xóa sản phẩm
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Kiểm tra sản phẩm tồn tại và lấy thông tin ảnh
    const checkResult = await pool.query('SELECT image FROM products WHERE id = $1', [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm cần xóa' });
    }
    
    const imagePath = checkResult.rows[0].image;
    
    // Xóa sản phẩm khỏi database
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    
    // Xóa file ảnh nếu có
    if (imagePath) {
      const fullImagePath = path.join(__dirname, '../..', imagePath);
      if (fs.existsSync(fullImagePath)) {
        fs.unlink(fullImagePath, (err) => {
          if (err) console.error('Lỗi xóa ảnh:', err);
        });
      }
    }
    
    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (err) {
    console.error('Lỗi khi xóa sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi server khi xóa sản phẩm' });
  }
});

module.exports = router;