import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.get('/ledger/obligations', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const borrowedLoans = db.prepare(
      `SELECT l.*, u.first_name AS lender_first_name, u.last_name AS lender_last_name
       FROM loans l JOIN users u ON l.lender_id = u.id
       WHERE l.borrower_id = ? AND l.status = 'active'`
    ).all(req.userId) as any[];

    const lentLoans = db.prepare(
      `SELECT l.*, u.first_name AS borrower_first_name, u.last_name AS borrower_last_name
       FROM loans l JOIN users u ON l.borrower_id = u.id
       WHERE l.lender_id = ? AND l.status = 'active'`
    ).all(req.userId) as any[];

    const totalBorrowed = borrowedLoans.reduce((sum, l) => sum + l.principal, 0);
    const totalLent = lentLoans.reduce((sum, l) => sum + l.principal, 0);
    const amountOverdue = borrowedLoans.reduce((sum, l) => sum + (l.amount_overdue || 0), 0);
    const amountRepaid = borrowedLoans.reduce((sum, l) => sum + (l.amount_repaid || 0), 0);

    const obligations = [...borrowedLoans, ...lentLoans];

    res.json({
      summary: {totalBorrowed, totalLent, amountOverdue, amountRepaid},
      obligations,
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch obligations'});
  }
});

router.get('/ledger/journal', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const events = db.prepare(
      `SELECT * FROM ledger_events WHERE user_id = ? ORDER BY created_at DESC`
    ).all(req.userId);

    res.json({events});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch journal'});
  }
});

router.get('/ledger/audit', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {loanId} = req.query;
    if (!loanId) {
      res.status(400).json({error: 'loanId query parameter is required'});
      return;
    }

    const events = db.prepare(
      `SELECT * FROM ledger_events WHERE loan_id = ? ORDER BY created_at DESC`
    ).all(loanId);

    res.json({events});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch audit trail'});
  }
});

router.get('/get/wallets', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    let wallets = db.prepare(
      `SELECT * FROM wallets WHERE user_id = ?`
    ).all(req.userId) as any[];

    if (wallets.length === 0) {
      const walletId = uuidv4();
      db.prepare(
        `INSERT INTO wallets (id, user_id, name, balance, currency) VALUES (?, ?, 'Main Wallet', 0, 'USD')`
      ).run(walletId, req.userId);

      wallets = db.prepare(
        `SELECT * FROM wallets WHERE user_id = ?`
      ).all(req.userId) as any[];
    }

    res.json({wallets});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch wallets'});
  }
});

router.get('/transactions/mytransactions', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const transactions = db.prepare(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC`
    ).all(req.userId);

    res.json({transactions});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch transactions'});
  }
});

export default router;
