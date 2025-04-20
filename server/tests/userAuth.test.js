// server/tests/userAuth.test.js
const request = require('supertest');
const express = require('express');
const userAuth = require('../routes/userAuth');
const db = require('../db'); 

const app = express();
app.use(express.json());
app.use('/userAuth', userAuth);

describe('POST /userAuth/login', () => {
  it('should return 401 if wrong credentials', async () => {
    const res = await request(app).post('/userAuth/login').send({
      username: 'saiuser',
      password: 'saipass'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
afterAll(async () => {
    await db.end(); // đóng pool khi test xong
  });