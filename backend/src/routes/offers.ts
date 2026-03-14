import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';
import {validate} from '../middleware/validate';
import {createNotification} from '../utils/notifications';

const router = express.Router();

const offerCreateSchema = z.object({postId: z.string().uuid(), amount: z.number().positive(), interestPercentage: z.number().min(0).max(100)});
const offerAcceptSchema = z.object({offerId: z.string().uuid(), paymentPlan: z.object({ppm: z.number().positive(), months: z.number().int().positive()})});

router.post('/offer/create', authMiddleware, validate(offerCreateSchema), (req: AuthRequest, res: Response) => {
  try {
    const {postId, amount, interestPercentage} = req.body;

    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId) as any;
    if (!post) {
      res.status(404).json({error: 'Post not found'});
      return;
    }

    const offerId = uuidv4();
    const lenderId = req.userId;
    const borrowerId = post.user_id;

    db.prepare(
      `INSERT INTO offers (id, post_id, lender_id, borrower_id, amount, interest_percentage)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(offerId, postId, lenderId, borrowerId, amount, interestPercentage);

    db.prepare('UPDATE posts SET current_amount = current_amount + ? WHERE id = ?').run(amount, postId);

    createNotification(borrowerId, 'new_offer', 'New Offer', 'New offer on your post', offerId);

    res.json({success: true, offerId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create offer'});
  }
});

router.post('/offer/accept', authMiddleware, validate(offerAcceptSchema), (req: AuthRequest, res: Response) => {
  try {
    const {offerId, paymentPlan} = req.body;
    const {ppm, months} = paymentPlan;

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(offerId) as any;
    if (!offer) {
      res.status(404).json({error: 'Offer not found'});
      return;
    }

    db.prepare(
      `UPDATE offers SET status = 'accepted', payment_plan_ppm = ?, payment_plan_months = ? WHERE id = ?`
    ).run(ppm, months, offerId);

    const loanId = uuidv4();
    db.prepare(
      `INSERT INTO loans (id, offer_id, post_id, lender_id, borrower_id, principal, next_payment_date)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now', '+1 month'))`
    ).run(loanId, offerId, offer.post_id, offer.lender_id, offer.borrower_id, offer.amount);

    for (let i = 1; i <= months; i++) {
      const scheduleId = uuidv4();
      db.prepare(
        `INSERT INTO repayment_schedules (id, loan_id, payment_number, amount, due_date)
         VALUES (?, ?, ?, ?, datetime('now', '+' || ? || ' months'))`
      ).run(scheduleId, loanId, i, ppm, i);
    }

    const ledgerId = uuidv4();
    db.prepare(
      `INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount)
       VALUES (?, ?, ?, 'loan_funded', 'Loan funded from accepted offer', ?)`
    ).run(ledgerId, loanId, offer.lender_id, offer.amount);

    createNotification(offer.lender_id, 'offer_accepted', 'Offer Accepted', 'Your offer was accepted', offerId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to accept offer'});
  }
});

router.get('/offers/details/:offerId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {offerId} = req.params;

    const offer = db.prepare(
      `SELECT o.*,
              l.first_name AS lender_first_name, l.last_name AS lender_last_name, l.email AS lender_email,
              b.first_name AS borrower_first_name, b.last_name AS borrower_last_name, b.email AS borrower_email,
              p.title AS post_title, p.description AS post_description, p.amount AS post_amount, p.status AS post_status
       FROM offers o
       JOIN users l ON o.lender_id = l.id
       JOIN users b ON o.borrower_id = b.id
       JOIN posts p ON o.post_id = p.id
       WHERE o.id = ?`
    ).get(offerId) as any;

    if (!offer) {
      res.status(404).json({error: 'Offer not found'});
      return;
    }

    res.json(offer);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get offer details'});
  }
});

router.post('/offer/:offerId/counter', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {offerId} = req.params;
    const {proposedAmount, proposedInterest, proposedTerm, message} = req.body;

    const counterOfferId = uuidv4();
    db.prepare(
      `INSERT INTO counter_offers (id, offer_id, proposed_amount, proposed_interest, proposed_term, message)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(counterOfferId, offerId, proposedAmount, proposedInterest, proposedTerm, message);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create counter offer'});
  }
});

export default router;
