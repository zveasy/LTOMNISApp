import request from 'supertest';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, '..', 'test-auth.db');

beforeAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
  process.env.NODE_ENV = 'test';
  process.env.DB_PATH = TEST_DB;
  process.env.JWT_SECRET = 'test-secret';
});

afterAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

let app: any;

beforeAll(async () => {
  const mod = await import('../src/index');
  app = mod.default;
});

describe('Auth endpoints', () => {
  const email = `authtest_${Date.now()}@test.com`;
  const password = 'TestPass123';
  let token: string;
  let userId: string;

  test('POST /api/omnis/account/register_login — registers a new user', async () => {
    const res = await request(app)
      .post('/api/omnis/account/register_login')
      .send({email, password});
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('userId');
    token = res.body.token;
    userId = res.body.userId;
  });

  test('POST /api/omnis/account/login — logs in existing user', async () => {
    const res = await request(app)
      .post('/api/omnis/account/login')
      .send({email, password});
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.userId).toBe(userId);
  });

  test('POST /api/omnis/account/login — rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/omnis/account/login')
      .send({email, password: 'WrongPass999'});
    expect(res.status).toBe(401);
  });

  test('POST /api/omnis/account/verify — verifies user with correct code', async () => {
    const db = (await import('../src/database')).default;
    const user = db.prepare('SELECT verification_code FROM users WHERE id = ?').get(userId) as any;

    const res = await request(app)
      .post('/api/omnis/account/verify')
      .set('Authorization', `Bearer ${token}`)
      .send({code: user.verification_code});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/omnis/score — returns user score', async () => {
    const res = await request(app)
      .get('/api/omnis/score')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.scoreObject).toHaveProperty('score');
  });

  test('GET /api/omnis/notifications — returns empty notifications', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.notifications).toEqual([]);
  });

  test('GET /api/omnis/notifications/unread_count — returns 0', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications/unread_count')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
  });
});
