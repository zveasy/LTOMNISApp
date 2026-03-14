import request from 'supertest';
import path from 'path';
import fs from 'fs';

const TEST_DB = path.join(__dirname, '..', 'test-workflow.db');

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

describe('Full lending workflow', () => {
  let borrowerToken: string;
  let borrowerId: string;
  let lenderToken: string;
  let lenderId: string;
  let postId: string;
  let offerId: string;
  let loanId: string;

  test('Register borrower', async () => {
    const res = await request(app)
      .post('/api/omnis/account/register_login')
      .send({email: `borrower_${Date.now()}@test.com`, password: 'BorrowerPass1'});
    expect(res.status).toBe(201);
    borrowerToken = res.body.token;
    borrowerId = res.body.userId;
  });

  test('Register lender', async () => {
    const res = await request(app)
      .post('/api/omnis/account/register_login')
      .send({email: `lender_${Date.now()}@test.com`, password: 'LenderPass1'});
    expect(res.status).toBe(201);
    lenderToken = res.body.token;
    lenderId = res.body.userId;
  });

  test('Borrower creates a post', async () => {
    const res = await request(app)
      .post('/api/omnis/post/create')
      .set('Authorization', `Bearer ${borrowerToken}`)
      .send({title: 'Need a loan', description: 'For business', amount: 1000});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    postId = res.body.postId;
  });

  test('Lender creates an offer', async () => {
    const res = await request(app)
      .post('/api/omnis/offer/create')
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({postId, amount: 1000, interestPercentage: 5});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    offerId = res.body.offerId;
  });

  test('Borrower receives notification for new offer', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications')
      .set('Authorization', `Bearer ${borrowerToken}`);
    expect(res.status).toBe(200);
    const offerNotif = res.body.notifications.find((n: any) => n.type === 'new_offer');
    expect(offerNotif).toBeDefined();
  });

  test('Borrower accepts offer', async () => {
    const res = await request(app)
      .post('/api/omnis/offer/accept')
      .set('Authorization', `Bearer ${borrowerToken}`)
      .send({offerId, paymentPlan: {ppm: 175, months: 6}});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Lender receives notification for accepted offer', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications')
      .set('Authorization', `Bearer ${lenderToken}`);
    expect(res.status).toBe(200);
    const acceptedNotif = res.body.notifications.find((n: any) => n.type === 'offer_accepted');
    expect(acceptedNotif).toBeDefined();
  });

  test('Loan was created', async () => {
    const db = (await import('../src/database')).default;
    const loan = db.prepare('SELECT * FROM loans WHERE borrower_id = ? AND lender_id = ?').get(borrowerId, lenderId) as any;
    expect(loan).toBeDefined();
    expect(loan.principal).toBe(1000);
    loanId = loan.id;
  });

  test('Borrower marks payment as paid', async () => {
    const res = await request(app)
      .post('/api/omnis/payment/mark_paid')
      .set('Authorization', `Bearer ${borrowerToken}`)
      .send({loanId, amount: 175, method: 'bank_transfer'});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Lender receives payment notification', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications')
      .set('Authorization', `Bearer ${lenderToken}`);
    expect(res.status).toBe(200);
    const payNotif = res.body.notifications.find((n: any) => n.type === 'payment_marked');
    expect(payNotif).toBeDefined();
  });

  test('Lender confirms payment', async () => {
    const db = (await import('../src/database')).default;
    const payment = db.prepare('SELECT * FROM payments WHERE loan_id = ? AND status = ?').get(loanId, 'pending') as any;
    expect(payment).toBeDefined();

    const res = await request(app)
      .post('/api/omnis/payment/confirm_receipt')
      .set('Authorization', `Bearer ${lenderToken}`)
      .send({paymentId: payment.id});
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('Borrower receives confirmation notification', async () => {
    const res = await request(app)
      .get('/api/omnis/notifications')
      .set('Authorization', `Bearer ${borrowerToken}`);
    expect(res.status).toBe(200);
    const confirmNotif = res.body.notifications.find((n: any) => n.type === 'payment_confirmed');
    expect(confirmNotif).toBeDefined();
  });

  test('Borrower score is updated after payment', async () => {
    const res = await request(app)
      .get('/api/omnis/score')
      .set('Authorization', `Bearer ${borrowerToken}`);
    expect(res.status).toBe(200);
    expect(res.body.scoreObject.score).toBeGreaterThanOrEqual(50);
  });

  test('Mark all notifications as read', async () => {
    const res = await request(app)
      .post('/api/omnis/notifications/read_all')
      .set('Authorization', `Bearer ${borrowerToken}`);
    expect(res.status).toBe(200);

    const countRes = await request(app)
      .get('/api/omnis/notifications/unread_count')
      .set('Authorization', `Bearer ${borrowerToken}`);
    expect(countRes.body.count).toBe(0);
  });
});
