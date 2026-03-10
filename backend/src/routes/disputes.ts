import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.post('/disputes/create', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {loanId, contractId, type, description, againstUser} = req.body;

    const disputeId = uuidv4();
    db.prepare(
      `INSERT INTO disputes (id, loan_id, contract_id, filed_by, against_user, type, description)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(disputeId, loanId, contractId, req.userId, againstUser, type, description);

    res.json({success: true, disputeId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create dispute'});
  }
});

router.get('/disputes/my', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const disputes = db.prepare(
      `SELECT * FROM disputes WHERE filed_by = ? OR against_user = ? ORDER BY created_at DESC`
    ).all(req.userId, req.userId);

    res.json(disputes);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get disputes'});
  }
});

router.get('/disputes/:disputeId/messages', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {disputeId} = req.params;

    const messages = db.prepare(
      `SELECT dm.*, u.first_name, u.last_name
       FROM dispute_messages dm
       JOIN users u ON dm.sender_id = u.id
       WHERE dm.dispute_id = ?
       ORDER BY dm.created_at ASC`
    ).all(disputeId);

    res.json(messages);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get dispute messages'});
  }
});

router.post('/disputes/:disputeId/messages', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {disputeId} = req.params;
    const {message} = req.body;

    const messageId = uuidv4();
    db.prepare(
      `INSERT INTO dispute_messages (id, dispute_id, sender_id, message)
       VALUES (?, ?, ?, ?)`
    ).run(messageId, disputeId, req.userId, message);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to send dispute message'});
  }
});

export default router;
