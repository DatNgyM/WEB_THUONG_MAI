// server/tests/userRegister.test.js
const request = require('supertest');
const express = require('express');
const userRegister = require('../routes/userRegister');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/user', userRegister);

describe('POST /user/register', () => {
  it('should register a new user successfully', async () => {
    const randomUser = {
      name: 'Test User',
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@gmail.com`,
      password: '123456'
    };

    const res = await request(app).post('/user/register').send(randomUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/đăng ký thành công/i);

  });
});

afterAll(async () => {
  await db.end(); // đóng kết nối db
});
