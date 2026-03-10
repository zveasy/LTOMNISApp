import express from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.get('/score', authMiddleware, (req: AuthRequest, res) => {
  try {
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

export default router;
