const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'WEB_THUONG_MAI',
  password: '1111',
  port: 5432,
});

// Kiểm tra kết nối
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Lỗi kết nối PostgreSQL:', err);
  } else {
    console.log('PostgreSQL đã kết nối thành công vào', res.rows[0].now);
  }
});

// Export đối tượng pool để các file khác có thể import
module.exports = {
  pool,
  query: (text, params) => pool.query(text, params)
};



