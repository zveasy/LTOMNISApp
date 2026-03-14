import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import multer from 'multer';
import {z} from 'zod';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';
import {validate} from '../middleware/validate';
import {updateUserScore} from '../utils/scoreEngine';
import {createNotification} from '../utils/notifications';
import {checkAndAwardBadges} from '../utils/badges';

const router = express.Router();
const upload = multer({dest: 'uploads/'});

const markPaidSchema = z.object({loanId: z.string(), amount: z.number().positive(), method: z.string().optional(), platform: z.string().optional(), referenceNumber: z.string().optional(), paymentDate: z.string().optional()});

router.post('/payment/mark_paid', authMiddleware, validate(markPaidSchema), (req: AuthRequest, res: Response) => {
  try {
    const {loanId, amount, method, platform, referenceNumber, paymentDate} = req.body;

    const paymentId = uuidv4();
    db.prepare(
      `INSERT INTO payments (id, loan_id, payer_id, amount, method, platform, reference_number, payment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(paymentId, loanId, req.userId, amount, method || platform || 'bank_transfer', platform || null, referenceNumber || null, paymentDate || null);

    const eventId = uuidv4();
    db.prepare(
      `INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount)
       VALUES (?, ?, ?, 'repayment_marked_paid', ?, ?)`
    ).run(eventId, loanId, req.userId, `Payment of ${amount} marked as paid`, amount);

    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(loanId) as any;
    if (loan) {
      createNotification(loan.lender_id, 'payment_marked', 'Payment Marked', 'Payment marked as paid, please confirm', paymentId);
    }

    res.json({success: true, paymentId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to mark payment'});
  }
});

router.post('/payment/upload_proof', authMiddleware, upload.single('file'), (req: AuthRequest, res: Response) => {
  try {
    const {paymentId, notes} = req.body;
    if (!paymentId) {
      res.status(400).json({error: 'paymentId is required'});
      return;
    }

    const proofUrl = req.file ? req.file.path : null;
    db.prepare(
      `UPDATE payments SET proof_url = ?, notes = ? WHERE id = ?`
    ).run(proofUrl, notes || null, paymentId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to upload proof'});
  }
});

router.get('/payment/pending_confirmations', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const payments = db.prepare(
      `SELECT p.*, u.first_name AS borrower_first_name, u.last_name AS borrower_last_name, u.email AS borrower_email
       FROM payments p
       JOIN loans l ON p.loan_id = l.id
       JOIN users u ON p.payer_id = u.id
       WHERE l.lender_id = ? AND p.status = 'pending'
       ORDER BY p.created_at DESC`
    ).all(req.userId);

    res.json({payments});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch pending confirmations'});
  }
});

router.post('/payment/confirm_receipt', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {paymentId} = req.body;
    if (!paymentId) {
      res.status(400).json({error: 'paymentId is required'});
      return;
    }

    const payment = db.prepare(`SELECT * FROM payments WHERE id = ?`).get(paymentId) as any;
    if (!payment) {
      res.status(404).json({error: 'Payment not found'});
      return;
    }

    db.prepare(
      `UPDATE payments SET status = 'confirmed', confirmed_at = datetime('now') WHERE id = ?`
    ).run(paymentId);

    db.prepare(
      `UPDATE loans SET amount_repaid = amount_repaid + ? WHERE id = ?`
    ).run(payment.amount, payment.loan_id);

    const eventId = uuidv4();
    db.prepare(
      `INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount, reference_id)
       VALUES (?, ?, ?, 'payment_confirmed', ?, ?, ?)`
    ).run(eventId, payment.loan_id, req.userId, `Payment of ${payment.amount} confirmed`, payment.amount, paymentId);

    const loan = db.prepare('SELECT * FROM loans WHERE id = ?').get(payment.loan_id) as any;
    if (loan) {
      db.prepare('INSERT INTO transactions (id, user_id, type, amount, description, counterparty_id) VALUES (?, ?, ?, ?, ?, ?)').run(uuidv4(), loan.borrower_id, 'repayment', payment.amount, 'Loan repayment confirmed', loan.lender_id);
      db.prepare('INSERT INTO transactions (id, user_id, type, amount, description, counterparty_id) VALUES (?, ?, ?, ?, ?, ?)').run(uuidv4(), loan.lender_id, 'received_repayment', payment.amount, 'Loan repayment received', loan.borrower_id);

      const platformName = payment.platform || payment.method || 'bank_transfer';
      const scoreAfter = updateUserScore(loan.borrower_id);
      db.prepare(
        `INSERT INTO credit_history (id, user_id, event_type, description, score_change, score_after, loan_id, payment_id, platform)
         VALUES (?, ?, 'payment_confirmed', ?, 2, ?, ?, ?, ?)`
      ).run(uuidv4(), loan.borrower_id, `Payment of $${payment.amount} confirmed via ${platformName}`, scoreAfter, payment.loan_id, paymentId, platformName);

      createNotification(loan.borrower_id, 'payment_confirmed', 'Payment Confirmed', 'Payment confirmed', paymentId);

      const updatedLoan = db.prepare('SELECT * FROM loans WHERE id = ?').get(payment.loan_id) as any;
      if (updatedLoan && updatedLoan.amount_repaid >= updatedLoan.principal) {
        db.prepare(`UPDATE loans SET status = 'completed', completed_at = datetime('now') WHERE id = ?`).run(updatedLoan.id);

        db.prepare(
          `INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount)
           VALUES (?, ?, ?, 'loan_completed', ?, ?)`
        ).run(uuidv4(), updatedLoan.id, updatedLoan.borrower_id, 'Loan fully repaid', updatedLoan.principal);

        if (updatedLoan.post_id) {
          db.prepare(`UPDATE posts SET status = 'repaid' WHERE id = ?`).run(updatedLoan.post_id);
        }

        const lateCount = (db.prepare(
          `SELECT COUNT(*) as count FROM repayment_schedules WHERE loan_id = ? AND status = 'late'`
        ).get(updatedLoan.id) as any)?.count || 0;

        if (lateCount === 0) {
          const existingBadge = db.prepare(`SELECT id FROM badges WHERE user_id = ? AND badge_type = 'perfect_repayer'`).get(updatedLoan.borrower_id);
          if (!existingBadge) {
            db.prepare(`INSERT INTO badges (id, user_id, badge_type) VALUES (?, ?, 'perfect_repayer')`).run(uuidv4(), updatedLoan.borrower_id);
          }
        }

        const completedCount = (db.prepare(
          `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'completed'`
        ).get(updatedLoan.borrower_id) as any)?.count || 0;

        if (completedCount === 1) {
          const existingBadge = db.prepare(`SELECT id FROM badges WHERE user_id = ? AND badge_type = 'first_loan'`).get(updatedLoan.borrower_id);
          if (!existingBadge) {
            db.prepare(`INSERT INTO badges (id, user_id, badge_type) VALUES (?, ?, 'first_loan')`).run(uuidv4(), updatedLoan.borrower_id);
          }
        }

        updateUserScore(updatedLoan.borrower_id);
        updateUserScore(updatedLoan.lender_id);

        createNotification(updatedLoan.borrower_id, 'loan_completed', 'Loan Completed', 'Your loan has been fully repaid!', updatedLoan.id);
        createNotification(updatedLoan.lender_id, 'loan_completed', 'Loan Completed', 'A loan you funded has been fully repaid!', updatedLoan.id);

        checkAndAwardBadges(updatedLoan.borrower_id);
        checkAndAwardBadges(updatedLoan.lender_id);
      }
    }

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to confirm receipt'});
  }
});

router.get('/payment/reminders', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const schedules = db.prepare(
      `SELECT rs.* FROM repayment_schedules rs
       JOIN loans l ON rs.loan_id = l.id
       WHERE l.borrower_id = ? AND rs.status = 'scheduled' AND rs.due_date >= datetime('now')
       ORDER BY rs.due_date ASC`
    ).all(req.userId);

    res.json({reminders: schedules, preferences: {email: true, push: true, sms: false}});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch reminders'});
  }
});

router.get('/payment/late', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const overdue = db.prepare(
      `SELECT rs.* FROM repayment_schedules rs
       JOIN loans l ON rs.loan_id = l.id
       WHERE l.borrower_id = ? AND rs.status = 'scheduled' AND rs.due_date < datetime('now')
       ORDER BY rs.due_date ASC`
    ).all(req.userId);

    res.json({latePayments: overdue});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch late payments'});
  }
});

router.post('/payment/request_extension', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {paymentId, newDueDate, reason} = req.body;
    let {loanId} = req.body;

    if (paymentId && !loanId) {
      const payment = db.prepare(`SELECT loan_id FROM payments WHERE id = ?`).get(paymentId) as any;
      if (payment) {
        loanId = payment.loan_id;
      }
    }

    if (!loanId) {
      res.status(400).json({error: 'loanId or paymentId is required'});
      return;
    }

    const loan = db.prepare(`SELECT * FROM loans WHERE id = ?`).get(loanId) as any;
    if (!loan) {
      res.status(404).json({error: 'Loan not found'});
      return;
    }

    const notifId = uuidv4();
    db.prepare(
      `INSERT INTO notifications (id, user_id, type, title, message, reference_id)
       VALUES (?, ?, 'extension_request', 'Extension Request', ?, ?)`
    ).run(notifId, loan.lender_id, reason || (newDueDate ? `Extension requested to ${newDueDate}` : 'Payment extension requested'), loanId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to request extension'});
  }
});

export default router;
