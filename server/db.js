const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'WEB_THUONG_MAI',
  password: '1111',
  port: 5432,
});

module.exports = pool;


// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('shop.db');

// db.serialize(() => {
//     // Users table
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         username TEXT UNIQUE,
//         password TEXT,
//         email TEXT UNIQUE,
//         role TEXT DEFAULT 'customer',
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);

//     // Products table
//     db.run(`CREATE TABLE IF NOT EXISTS products (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         description TEXT,
//         price REAL,
//         image TEXT,
//         stock INTEGER,
//         category TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )`);

//     // Orders table
//     db.run(`CREATE TABLE IF NOT EXISTS orders (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         user_id INTEGER,
//         total_amount REAL,
//         status TEXT DEFAULT 'pending',
//         shipping_address TEXT,
//         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY(user_id) REFERENCES users(id)
//     )`);

//     // Order details table
//     db.run(`CREATE TABLE IF NOT EXISTS order_details (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         order_id INTEGER,
//         product_id INTEGER,
//         quantity INTEGER,
//         price REAL,
//         FOREIGN KEY(order_id) REFERENCES orders(id),
//         FOREIGN KEY(product_id) REFERENCES products(id)
//     )`);
// });

// module.exports = db;
