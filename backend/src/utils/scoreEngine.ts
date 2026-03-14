import db from '../database';

const INTERNATIONAL_PLATFORMS = ['remitly', 'wise', 'worldremit'];

export function calculateOmnisScore(userId: string): number {
  let score = 50;

  const loans = db.prepare('SELECT * FROM loans WHERE borrower_id = ?').all(userId) as any[];
  const payments = db.prepare(`
    SELECT p.* FROM payments p 
    JOIN loans l ON p.loan_id = l.id 
    WHERE l.borrower_id = ? AND p.status = 'confirmed'
  `).all(userId) as any[];

  // Repayment history (40% weight)
  score += payments.length * 2;
  const latePayments = db.prepare(`
    SELECT COUNT(*) as count FROM repayment_schedules rs
    JOIN loans l ON rs.loan_id = l.id
    WHERE l.borrower_id = ? AND rs.status = 'late'
  `).get(userId) as any;
  score -= (latePayments?.count || 0) * 5;

  const defaults = loans.filter(l => l.status === 'defaulted').length;
  score -= defaults * 20;

  // Account age (10% weight)
  const user = db.prepare('SELECT created_at FROM users WHERE id = ?').get(userId) as any;
  if (user) {
    const months = Math.floor((Date.now() - new Date(user.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000));
    score += Math.min(months, 10);
  }

  // Verification (15% weight)
  const verifications = db.prepare(`SELECT COUNT(*) as count FROM identity_verifications WHERE user_id = ? AND status = 'approved'`).get(userId) as any;
  score += (verifications?.count || 0) * 5;

  // Community (15% weight)
  const memberships = db.prepare('SELECT COUNT(*) as count FROM community_memberships WHERE user_id = ?').get(userId) as any;
  score += (memberships?.count || 0) * 2;

  const goodEndorsements = db.prepare('SELECT COUNT(*) as count FROM endorsements WHERE user_id = ? AND rating >= 4').get(userId) as any;
  score += (goodEndorsements?.count || 0) * 3;

  // Loan completion (20% weight)
  const completed = loans.filter(l => l.status === 'completed').length;
  score += completed * 5;
  score -= defaults * 10;

  // Platform diversity bonus: +1 per unique platform used
  const uniquePlatforms = db.prepare(
    `SELECT COUNT(DISTINCT COALESCE(p.platform, p.method)) as count FROM payments p
     JOIN loans l ON p.loan_id = l.id
     WHERE l.borrower_id = ? AND p.status = 'confirmed'`
  ).get(userId) as any;
  score += uniquePlatforms?.count || 0;

  // International payment bonus: +3 if user has used Remitly, Wise, or WorldRemit
  const intlPlatforms = db.prepare(
    `SELECT COUNT(DISTINCT COALESCE(p.platform, p.method)) as count FROM payments p
     JOIN loans l ON p.loan_id = l.id
     WHERE l.borrower_id = ? AND p.status = 'confirmed'
       AND LOWER(COALESCE(p.platform, p.method)) IN (${INTERNATIONAL_PLATFORMS.map(() => '?').join(',')})`
  ).get(userId, ...INTERNATIONAL_PLATFORMS) as any;
  if ((intlPlatforms?.count || 0) > 0) {
    score += 3;
  }

  // Credit age: +1 per month since first confirmed payment
  const firstConfirmed = db.prepare(
    `SELECT MIN(created_at) as first_date FROM credit_history
     WHERE user_id = ? AND event_type = 'payment_confirmed'`
  ).get(userId) as any;
  if (firstConfirmed?.first_date) {
    const creditMonths = Math.floor((Date.now() - new Date(firstConfirmed.first_date).getTime()) / (30 * 24 * 60 * 60 * 1000));
    score += Math.min(creditMonths, 12);
  }

  // Clamp to 0-100
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function updateUserScore(userId: string): number {
  const score = calculateOmnisScore(userId);
  const tier = score >= 80 ? 5 : score >= 65 ? 4 : score >= 50 ? 3 : score >= 35 ? 2 : 1;
  db.prepare('UPDATE users SET omnis_score = ?, trust_tier = ?, updated_at = datetime(\'now\') WHERE id = ?').run(score, tier, userId);
  return score;
}
