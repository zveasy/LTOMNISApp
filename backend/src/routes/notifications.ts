import express, {Response} from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.get('/notifications', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const notifications = db.prepare(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`
    ).all(req.userId);
    res.json({notifications});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch notifications'});
  }
});

router.post('/notifications/:id/read', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {id} = req.params;
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(id, req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to mark notification as read'});
  }
});

router.post('/notifications/read_all', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').run(req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to mark all as read'});
  }
});

router.get('/notifications/unread_count', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0').get(req.userId) as any;
    res.json({count: result?.count || 0});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get unread count'});
  }
});

export default router;
