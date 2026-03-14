import express, {Response} from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

router.get('/user/homefeed', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const offersAccepted = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE borrower_id = ? AND status = 'accepted'`
    ).get(req.userId) as any).count;

    const newOffers = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE borrower_id = ? AND status = 'pending'`
    ).get(req.userId) as any).count;

    const borrowerAcceptedOffers = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE borrower_id = ? AND status = 'accepted'`
    ).get(req.userId) as any).count;

    const borrowerNewOffers = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE borrower_id = ? AND status = 'pending'`
    ).get(req.userId) as any).count;

    const lenderAcceptedOffers = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE lender_id = ? AND status = 'accepted'`
    ).get(req.userId) as any).count;

    const lenderNumOfOffersSent = (db.prepare(
      `SELECT COUNT(*) as count FROM offers WHERE lender_id = ?`
    ).get(req.userId) as any).count;

    res.json({
      homeFeedObject: {
        user: {
          firstName: user.first_name,
          lastName: user.last_name,
          balance: user.balance,
          avatar: user.avatar_url,
        },
        offersAccepted,
        newOffers,
        borrowerAcceptedOffers,
        borrowerNewOffers,
        lenderAcceptedOffers,
        lenderNumOfOffersSent,
      },
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch home feed'});
  }
});

router.put('/user/edit', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {firstName, lastName, email, phoneNumber, country, state, city, address, postalCode} = req.body;
    const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!current) { res.status(404).json({error: 'User not found'}); return; }

    db.prepare(
      `UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, country = ?, state = ?, city = ?, address = ?, postal_code = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(
      firstName ?? current.first_name,
      lastName ?? current.last_name,
      email ?? current.email,
      phoneNumber ?? current.phone,
      country ?? current.country,
      state ?? current.state,
      city ?? current.city,
      address ?? current.address,
      postalCode ?? current.postal_code,
      req.userId
    );

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to update user'});
  }
});

router.get('/user/friend/profile/:friendId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {friendId} = req.params;
    const friend = db.prepare('SELECT * FROM users WHERE id = ?').get(friendId) as any;
    if (!friend) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const friendsCount = (db.prepare(
      `SELECT COUNT(*) as count FROM friends WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted'`
    ).get(friendId, friendId) as any).count;

    res.json({
      firstName: friend.first_name,
      lastName: friend.last_name,
      email: friend.email,
      omnisScore: friend.omnis_score,
      friends: friendsCount,
      status: friend.status,
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch friend profile'});
  }
});

router.get('/user/friend/reputation/:friendId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {friendId} = req.params;

    const loansFunded = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE lender_id = ?`
    ).get(friendId) as any).count;

    const loansRepaid = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'completed'`
    ).get(friendId) as any).count;

    const totalLoans = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ?`
    ).get(friendId) as any).count;

    const onTimeRate = totalLoans > 0 ? Math.round((loansRepaid / totalLoans) * 100) : 0;

    const endorsementCount = (db.prepare(
      `SELECT COUNT(*) as count FROM endorsements WHERE user_id = ?`
    ).get(friendId) as any).count;

    res.json({loansFunded, loansRepaid, onTimeRate, endorsementCount});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch reputation'});
  }
});

router.get('/user/:userId/badges', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;
    const badges = db.prepare('SELECT * FROM badges WHERE user_id = ?').all(userId);
    res.json(badges);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch badges'});
  }
});

router.get('/user/:userId/endorsements', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;
    const endorsements = db.prepare(
      `SELECT e.*, u.first_name, u.last_name, u.avatar_url
       FROM endorsements e
       JOIN users u ON e.endorser_id = u.id
       WHERE e.user_id = ?`
    ).all(userId);
    res.json(endorsements);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch endorsements'});
  }
});

router.post('/user/:userId/endorsements', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;
    const {rating, message} = req.body;
    const id = uuidv4();

    db.prepare(
      `INSERT INTO endorsements (id, user_id, endorser_id, rating, message) VALUES (?, ?, ?, ?, ?)`
    ).run(id, userId, req.userId, rating, message || '');

    res.status(201).json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create endorsement'});
  }
});

const DEFAULT_DETECTION_PREFERENCES = {
  enabled: true,
  monitoredPlatforms: ['venmo', 'zelle', 'cashapp', 'paypal', 'applepay', 'remitly', 'wise', 'worldremit'],
  smsScanning: false,
  autoMatch: true,
  sensitivity: 'medium',
};

router.get('/user/detection-preferences', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT detection_preferences FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    let prefs = DEFAULT_DETECTION_PREFERENCES;
    if (user.detection_preferences && user.detection_preferences !== '{}') {
      try {
        prefs = {...DEFAULT_DETECTION_PREFERENCES, ...JSON.parse(user.detection_preferences)};
      } catch {
        // fall back to defaults
      }
    }

    res.json(prefs);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch detection preferences'});
  }
});

router.put('/user/detection-preferences', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const prefs = req.body;
    db.prepare(
      `UPDATE users SET detection_preferences = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(JSON.stringify(prefs), req.userId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to update detection preferences'});
  }
});

router.get('/user/reputation', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const completedLoans = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'completed'`
    ).get(req.userId) as any).count;

    const totalLoans = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ?`
    ).get(req.userId) as any).count;

    const activeLoans = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'active'`
    ).get(req.userId) as any).count;

    const defaultedLoans = (db.prepare(
      `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'defaulted'`
    ).get(req.userId) as any).count;

    const onTimeRate = totalLoans > 0 ? Math.round((completedLoans / totalLoans) * 100) : 0;

    res.json({
      omnisScore: user.omnis_score,
      trustTier: user.trust_tier,
      repaymentStreak: completedLoans,
      defaultCount: defaultedLoans,
      activeObligations: activeLoans,
      completedObligations: completedLoans,
      onTimeRate,
      scoreHistory: [],
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch reputation'});
  }
});

export default router;
