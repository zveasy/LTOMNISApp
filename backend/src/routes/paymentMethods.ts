import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import {z} from 'zod';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';
import {validate} from '../middleware/validate';

const router = express.Router();

const SUPPORTED_PLATFORMS = [
  {id: 'zelle', name: 'Zelle', placeholder: 'Phone or email', icon: 'phone-portrait'},
  {id: 'venmo', name: 'Venmo', placeholder: '@username', icon: 'logo-venmo'},
  {id: 'paypal', name: 'PayPal', placeholder: 'Email or phone', icon: 'logo-paypal'},
  {id: 'cashapp', name: 'Cash App', placeholder: '$cashtag', icon: 'cash'},
  {id: 'applepay', name: 'Apple Pay', placeholder: 'Phone number', icon: 'logo-apple'},
  {id: 'remitly', name: 'Remitly', placeholder: 'Phone or email', icon: 'globe'},
  {id: 'wise', name: 'Wise', placeholder: 'Email', icon: 'globe'},
  {id: 'worldremit', name: 'WorldRemit', placeholder: 'Phone or email', icon: 'globe'},
  {id: 'other', name: 'Other', placeholder: 'Account details', icon: 'wallet'},
];

const createPaymentMethodSchema = z.object({
  platform: z.string(),
  handle: z.string(),
  displayName: z.string().optional(),
});

const updatePaymentMethodSchema = z.object({
  handle: z.string().optional(),
  displayName: z.string().optional(),
});

router.get('/payment-methods/platforms', (_req, res: Response) => {
  res.json({platforms: SUPPORTED_PLATFORMS});
});

router.get('/payment-methods', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const methods = db.prepare(
      'SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC'
    ).all(req.userId);
    res.json({paymentMethods: methods});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch payment methods'});
  }
});

router.post('/payment-methods', authMiddleware, validate(createPaymentMethodSchema), (req: AuthRequest, res: Response) => {
  try {
    const {platform, handle, displayName} = req.body;
    const id = uuidv4();

    const existing = db.prepare(
      'SELECT COUNT(*) as count FROM payment_methods WHERE user_id = ?'
    ).get(req.userId) as any;
    const isPrimary = (existing?.count || 0) === 0 ? 1 : 0;

    db.prepare(
      `INSERT INTO payment_methods (id, user_id, platform, handle, display_name, is_primary)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, req.userId, platform, handle, displayName || null, isPrimary);

    res.json({success: true, id});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create payment method'});
  }
});

router.put('/payment-methods/:id', authMiddleware, validate(updatePaymentMethodSchema), (req: AuthRequest, res: Response) => {
  try {
    const method = db.prepare(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId) as any;
    if (!method) {
      res.status(404).json({error: 'Payment method not found'});
      return;
    }

    const {handle, displayName} = req.body;
    db.prepare(
      'UPDATE payment_methods SET handle = COALESCE(?, handle), display_name = COALESCE(?, display_name) WHERE id = ?'
    ).run(handle || null, displayName || null, req.params.id);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to update payment method'});
  }
});

router.delete('/payment-methods/:id', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const method = db.prepare(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId) as any;
    if (!method) {
      res.status(404).json({error: 'Payment method not found'});
      return;
    }

    db.prepare('DELETE FROM payment_methods WHERE id = ?').run(req.params.id);

    if (method.is_primary) {
      const another = db.prepare(
        'SELECT id FROM payment_methods WHERE user_id = ? LIMIT 1'
      ).get(req.userId) as any;
      if (another) {
        db.prepare('UPDATE payment_methods SET is_primary = 1 WHERE id = ?').run(another.id);
      }
    }

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to delete payment method'});
  }
});

router.put('/payment-methods/:id/primary', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const method = db.prepare(
      'SELECT * FROM payment_methods WHERE id = ? AND user_id = ?'
    ).get(req.params.id, req.userId) as any;
    if (!method) {
      res.status(404).json({error: 'Payment method not found'});
      return;
    }

    db.prepare('UPDATE payment_methods SET is_primary = 0 WHERE user_id = ?').run(req.userId);
    db.prepare('UPDATE payment_methods SET is_primary = 1 WHERE id = ?').run(req.params.id);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to set primary payment method'});
  }
});

router.get('/payment-methods/user/:userId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const methods = db.prepare(
      'SELECT platform, handle FROM payment_methods WHERE user_id = ? ORDER BY is_primary DESC, created_at ASC'
    ).all(req.params.userId);
    res.json({paymentMethods: methods});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch user payment methods'});
  }
});

export default router;
