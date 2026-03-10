import express, {Response} from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.get('/risk/dashboard', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const trustTier = user.trust_tier || 1;
    const borrowingLimit = trustTier * 1000;

    const lendingExposureRow = db.prepare(
      `SELECT COALESCE(SUM(principal), 0) AS total FROM loans WHERE lender_id = ? AND status = 'active'`
    ).get(req.userId) as any;
    const lendingExposure = lendingExposureRow.total;

    const totalLoans = db.prepare(
      `SELECT COUNT(*) AS count FROM loans WHERE borrower_id = ?`
    ).get(req.userId) as any;

    const completedOnTime = db.prepare(
      `SELECT COUNT(*) AS count FROM loans WHERE borrower_id = ? AND status = 'completed'`
    ).get(req.userId) as any;

    const onTimeRate = totalLoans.count > 0
      ? Math.round((completedOnTime.count / totalLoans.count) * 100)
      : 100;

    const defaults = db.prepare(
      `SELECT COUNT(*) AS count FROM loans WHERE borrower_id = ? AND status = 'defaulted'`
    ).get(req.userId) as any;

    res.json({
      trustTier,
      borrowingLimit,
      lendingExposure,
      activeRestrictions: [],
      scoreBreakdown: {
        onTimeRate,
        defaultHistory: defaults.count,
        accountAge: user.created_at,
        communityStanding: user.omnis_score,
      },
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch risk dashboard'});
  }
});

router.get('/risk/borrowing_limits', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const currentTier = user.trust_tier || 1;
    const maxLoanAmount = currentTier * 1000;

    const activeBorrowedRow = db.prepare(
      `SELECT COALESCE(SUM(principal - amount_repaid), 0) AS total FROM loans WHERE borrower_id = ? AND status = 'active'`
    ).get(req.userId) as any;

    const currentUtilization = maxLoanAmount > 0
      ? Math.round((activeBorrowedRow.total / maxLoanAmount) * 100)
      : 0;

    const progressToNextTier = Math.min(user.omnis_score, 100);

    res.json({
      currentTier,
      maxLoanAmount,
      currentUtilization,
      progressToNextTier,
      requirements: [],
      limitHistory: [],
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch borrowing limits'});
  }
});

router.get('/risk/lender_exposure', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const totalLentRow = db.prepare(
      `SELECT COALESCE(SUM(principal), 0) AS total FROM loans WHERE lender_id = ? AND status = 'active'`
    ).get(req.userId) as any;
    const totalLent = totalLentRow.total;

    const borrowers = db.prepare(
      `SELECT l.borrower_id, u.first_name, u.last_name, SUM(l.principal) AS amount
       FROM loans l JOIN users u ON l.borrower_id = u.id
       WHERE l.lender_id = ? AND l.status = 'active'
       GROUP BY l.borrower_id`
    ).all(req.userId) as any[];

    const exposurePerBorrower = borrowers.map(b => ({
      borrowerName: `${b.first_name} ${b.last_name}`.trim(),
      amount: b.amount,
      percentage: totalLent > 0 ? Math.round((b.amount / totalLent) * 100) : 0,
    }));

    const maxSingleBorrowerLimit = totalLent * 0.5;

    const concentrationWarnings = exposurePerBorrower
      .filter(b => totalLent > 0 && (b.amount / totalLent) > 0.5)
      .map(b => `High concentration: ${b.borrowerName} represents ${b.percentage}% of lending exposure`);

    res.json({
      totalLent,
      exposurePerBorrower,
      maxSingleBorrowerLimit,
      concentrationWarnings,
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch lender exposure'});
  }
});

export default router;
