// const express = require('express');
// const router = express.Router();
// const pool = require('../db');
// const db = require('../db'); // KHÔNG SAI ĐƯỜNG DẪN


// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const result = await db.query(
//       'SELECT * FROM users WHERE username = $1 AND password = $2',
//       [username, password]
//     );

//     if (result.rows.length > 0) {
//       const user = result.rows[0];
//       res.json({
//         success: true,
//         name: user.name,
//         role: user.role
//       });
//     } else {
//       res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
//     }
//   } catch (err) {
//     console.error('Lỗi truy vấn:', err); // dòng này có rồi
//     console.error(err.stack); // Thêm dòng này để in ra cụ thể hơn
//     res.status(500).json({ success: false, message: 'Lỗi server' });
//   }
  
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db'); // <-- Chắc chắn file db.js đúng

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin đăng nhập' });
  }

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE (username = $1 OR email = $1) AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      // Tạo đối tượng user để trả về cho client với đầy đủ thông tin
      const userResponse = {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        cccd: user.cccd, // Bao gồm cả CCCD
        role: user.role,
        created_at: user.created_at,
        is_verified: user.is_verified || false,
        request_seller: user.request_seller || false,
        is_premium: user.is_premium || false
      };
      
      res.json({
        success: true,
        name: user.name,
        role: user.role,
        user: userResponse // Trả về toàn bộ thông tin user
      });
    } else {
      res.status(401).json({ success: false, message: 'Sai tài khoản hoặc mật khẩu' });
    }
  } catch (err) {
    console.error(' Lỗi truy vấn:', err);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
});

module.exports = router;
