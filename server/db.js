// server/db.js
const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'WEB_THUONG_MAI',
  password: '1111',
  port: 5432,
});

client.connect();
module.exports = client;
