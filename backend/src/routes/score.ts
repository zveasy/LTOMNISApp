import express, {Response} from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';
import {updateUserScore} from '../utils/scoreEngine';

const router = express.Router();

router.get('/score', authMiddleware, (req: AuthRequest, res) => {
  try {
    updateUserScore(req.userId!);
    const user = db.prepare('SELECT omnis_score FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) { res.status(404).json({error: 'User not found'}); return; }
    res.json({scoreObject: {score: user.omnis_score}});
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

router.get('/borrower/score/breakdown', authMiddleware, (req: AuthRequest, res) => {
  try {
    const loans = db.prepare('SELECT * FROM loans WHERE borrower_id = ?').all(req.userId) as any[];
    const totalBorrowed = loans.reduce((s: number, l: any) => s + l.principal, 0);
    const totalRepaid = loans.reduce((s: number, l: any) => s + l.amount_repaid, 0);
    const completed = loans.filter((l: any) => l.status === 'completed').length;
    const defaulted = loans.filter((l: any) => l.status === 'defaulted').length;

    const schedules = db.prepare(`
      SELECT rs.* FROM repayment_schedules rs
      JOIN loans l ON rs.loan_id = l.id WHERE l.borrower_id = ?
    `).all(req.userId) as any[];
    const onTime = schedules.filter((s: any) => s.status === 'paid').length;
    const late = schedules.filter((s: any) => s.status === 'late').length;

    res.json({
      repaymentTimeliness: {onTimeRepayments: onTime, lateRepayments: late},
      amountBorrowed: totalBorrowed,
      amountRepaid: totalRepaid,
      loansCompleted: completed,
      loansDefaulted: defaulted,
      totalLoans: loans.length,
    });
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

router.get('/lender/score/breakdown', authMiddleware, (req: AuthRequest, res) => {
  try {
    const loans = db.prepare('SELECT * FROM loans WHERE lender_id = ?').all(req.userId) as any[];
    const totalLent = loans.reduce((s: number, l: any) => s + l.principal, 0);
    const totalReturned = loans.reduce((s: number, l: any) => s + l.amount_repaid, 0);
    const active = loans.filter((l: any) => l.status === 'active').length;
    const completed = loans.filter((l: any) => l.status === 'completed').length;

    res.json({
      lendingBehavior: {totalLent, totalReturned, profit: totalReturned - totalLent},
      activeLoans: active,
      completedLoans: completed,
      totalLoans: loans.length,
    });
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

router.get('/credit/history', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const history = db.prepare(
      'SELECT * FROM credit_history WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.userId);
    res.json({history});
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

router.get('/credit/summary', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT omnis_score, trust_tier FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) { res.status(404).json({error: 'User not found'}); return; }

    const confirmedPayments = db.prepare(
      `SELECT COUNT(*) as count FROM payments p
       JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ? AND p.status = 'confirmed'`
    ).get(req.userId) as any;

    const totalRepaid = db.prepare(
      `SELECT COALESCE(SUM(p.amount), 0) as total FROM payments p
       JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ? AND p.status = 'confirmed'`
    ).get(req.userId) as any;

    const schedules = db.prepare(
      `SELECT rs.* FROM repayment_schedules rs
       JOIN loans l ON rs.loan_id = l.id WHERE l.borrower_id = ?`
    ).all(req.userId) as any[];
    const onTime = schedules.filter((s: any) => s.status === 'paid').length;
    const total = schedules.filter((s: any) => s.status === 'paid' || s.status === 'late').length;
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 100;

    let longestStreak = 0;
    let currentStreak = 0;
    const sorted = schedules
      .filter((s: any) => s.status === 'paid' || s.status === 'late')
      .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    for (const s of sorted) {
      if (s.status === 'paid') {
        currentStreak++;
        if (currentStreak > longestStreak) longestStreak = currentStreak;
      } else {
        currentStreak = 0;
      }
    }

    const platformBreakdown = db.prepare(
      `SELECT COALESCE(p.platform, p.method) as platform, COUNT(*) as count, SUM(p.amount) as totalAmount
       FROM payments p JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ? AND p.status = 'confirmed'
       GROUP BY COALESCE(p.platform, p.method)`
    ).all(req.userId);

    const firstConfirmed = db.prepare(
      `SELECT MIN(ch.created_at) as first_date FROM credit_history ch
       WHERE ch.user_id = ? AND ch.event_type = 'payment_confirmed'`
    ).get(req.userId) as any;
    let creditAge = 0;
    if (firstConfirmed?.first_date) {
      creditAge = Math.floor((Date.now() - new Date(firstConfirmed.first_date).getTime()) / (30 * 24 * 60 * 60 * 1000));
    }

    res.json({
      omnisScore: user.omnis_score,
      trustTier: user.trust_tier,
      totalPaymentsConfirmed: confirmedPayments?.count || 0,
      totalAmountRepaid: totalRepaid?.total || 0,
      onTimeRate,
      longestStreak,
      platformBreakdown,
      creditAge,
    });
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

router.get('/credit/report', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) { res.status(404).json({error: 'User not found'}); return; }

    const paymentHistory = db.prepare(
      `SELECT p.payment_date as date, p.amount, COALESCE(p.platform, p.method) as platform, p.status, p.loan_id as loanId
       FROM payments p JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ?
       ORDER BY p.created_at DESC`
    ).all(req.userId);

    const loanHistory = db.prepare(
      `SELECT u.first_name || ' ' || u.last_name as lender, l.principal as amount, l.status,
              c.term_months as term, l.funded_at as startDate, l.completed_at as endDate
       FROM loans l
       LEFT JOIN users u ON l.lender_id = u.id
       LEFT JOIN contracts c ON l.contract_id = c.id
       WHERE l.borrower_id = ?
       ORDER BY l.created_at DESC`
    ).all(req.userId);

    const confirmedPayments = db.prepare(
      `SELECT COUNT(*) as count FROM payments p JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ? AND p.status = 'confirmed'`
    ).get(req.userId) as any;

    const totalRepaid = db.prepare(
      `SELECT COALESCE(SUM(p.amount), 0) as total FROM payments p JOIN loans l ON p.loan_id = l.id
       WHERE l.borrower_id = ? AND p.status = 'confirmed'`
    ).get(req.userId) as any;

    const loans = db.prepare('SELECT * FROM loans WHERE borrower_id = ?').all(req.userId) as any[];
    const completed = loans.filter((l: any) => l.status === 'completed').length;
    const defaulted = loans.filter((l: any) => l.status === 'defaulted').length;

    res.json({
      personalInfo: {
        name: `${user.first_name} ${user.last_name}`.trim(),
        memberSince: user.created_at,
      },
      score: user.omnis_score,
      tier: user.trust_tier,
      paymentHistory,
      loanHistory,
      summary: {
        totalPaymentsConfirmed: confirmedPayments?.count || 0,
        totalAmountRepaid: totalRepaid?.total || 0,
        loansCompleted: completed,
        loansDefaulted: defaulted,
        totalLoans: loans.length,
      },
    });
  } catch (e: any) {
    res.status(500).json({error: e.message});
  }
});

export default router;
