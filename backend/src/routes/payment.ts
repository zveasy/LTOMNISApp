import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import multer from 'multer';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();
const upload = multer({dest: 'uploads/'});

router.post('/payment/mark_paid', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {loanId, amount, method, referenceNumber, paymentDate} = req.body;
    if (!loanId || !amount) {
      res.status(400).json({error: 'loanId and amount are required'});
      return;
    }

    const paymentId = uuidv4();
    db.prepare(
      `INSERT INTO payments (id, loan_id, payer_id, amount, method, reference_number, payment_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(paymentId, loanId, req.userId, amount, method || 'bank_transfer', referenceNumber || null, paymentDate || null);

    const eventId = uuidv4();
    db.prepare(
      `INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount)
       VALUES (?, ?, ?, 'repayment_marked_paid', ?, ?)`
    ).run(eventId, loanId, req.userId, `Payment of ${amount} marked as paid`, amount);

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

    res.json({reminders: schedules});
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

    res.json({overduePayments: overdue});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch late payments'});
  }
});

router.post('/payment/request_extension', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {loanId, newDueDate, reason} = req.body;
    if (!loanId || !newDueDate) {
      res.status(400).json({error: 'loanId and newDueDate are required'});
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
    ).run(notifId, loan.lender_id, reason || `Extension requested to ${newDueDate}`, loanId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to request extension'});
  }
});

export default router;
