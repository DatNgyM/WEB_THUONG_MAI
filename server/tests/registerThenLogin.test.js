// server/tests/registerThenLogin.test.js
const request = require('supertest');
const express = require('express');
const registerRoute = require('../routes/userRegister');
const loginRoute = require('../routes/userAuth');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/user', registerRoute);
app.use('/userAuth', loginRoute);


const timestamp = Date.now();
const user = {
  name: 'Mock User',
  username: `mockuser_${timestamp}`,
  email: `mock${timestamp}@mail.com`,
  password: '123456'
};

console.log('[MOCK TEST] User:', user);

describe('Test full flow: Register ➜ Login', () => {
  it('should register successfully', async () => {
    const res = await request(app).post('/user/register').send(user);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should login successfully right after registration', async () => {
    const res = await request(app).post('/userAuth/login').send({
      username: user.username,
      password: user.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.name).toBe(user.name);
  });
});

afterAll(async () => {
  await db.end(); // đóng pool DB
});
