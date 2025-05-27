/**
 * Script để lấy dữ liệu từ bảng products trong PostgreSQL
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Kết nối database từ file db.js
const db = require('./server/db');
const pool = db.pool;

async function getProducts() {
  try {
    console.log('Đang lấy dữ liệu sản phẩm từ cơ sở dữ liệu...');
    
    // Truy vấn để lấy tất cả sản phẩm
    const result = await pool.query(`
      SELECT 
        p.*,
        u.name as seller_name,
        u.email as seller_email,
        c.name as category_name
      FROM 
        products p
      LEFT JOIN 
        users u ON p.seller_id = u.id
      LEFT JOIN
        categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);
    
    console.log(`Tìm thấy ${result.rows.length} sản phẩm.`);
    
    // In kết quả ra console
    console.table(result.rows);
    
    // Lưu kết quả ra file JSON để dễ xem
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    
    fs.writeFileSync(
      path.join(outputDir, 'products.json'),
      JSON.stringify(result.rows, null, 2),
      'utf8'
    );
    
    console.log(`Đã lưu dữ liệu sản phẩm vào file data/products.json`);
    
    return result.rows;
  } catch (error) {
    console.error('Lỗi khi truy vấn dữ liệu sản phẩm:', error);
  } finally {
    // Đóng kết nối pool
    // pool.end();
  }
}

// Gọi hàm để lấy dữ liệu sản phẩm
getProducts();

module.exports = { getProducts };
