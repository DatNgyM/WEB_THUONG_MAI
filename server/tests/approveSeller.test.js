// server/tests/approveSeller.test.js
const request = require('supertest');
const express = require('express');
const adminRoute = require('../routes/adminUsers');
const db = require('../db');

const app = express();
app.use(express.json());
app.use('/admin', adminRoute);

describe('POST /admin/approve-seller', () => {
  it('should approve seller request', async () => {
    const res = await request(app)
      .post('/admin/approve-seller')
      .send({ username: 'nguoiban_test' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('seller');
  });
});

afterAll(async () => {
  await db.end();
});
