import express, {Response} from 'express';
import multer from 'multer';
import {v4 as uuidv4} from 'uuid';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

const upload = multer({dest: 'uploads/'});

router.post('/identity/upload_document', authMiddleware, upload.single('document'), (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({error: 'No document uploaded'});
      return;
    }

    const verificationId = uuidv4();
    db.prepare(
      `INSERT INTO identity_verifications (id, user_id, type, document_url) VALUES (?, ?, 'document', ?)`
    ).run(verificationId, req.userId, file.path);

    res.status(201).json({success: true, verificationId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Document upload failed'});
  }
});

router.post('/identity/verify_selfie', authMiddleware, upload.single('selfie'), (req: AuthRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({error: 'No selfie uploaded'});
      return;
    }

    const verificationId = uuidv4();
    db.prepare(
      `INSERT INTO identity_verifications (id, user_id, type, document_url) VALUES (?, ?, 'selfie', ?)`
    ).run(verificationId, req.userId, file.path);

    res.status(201).json({success: true, verificationId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Selfie verification failed'});
  }
});

router.post('/identity/verify_address', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {address, city, state, postalCode, country} = req.body;
    const verificationId = uuidv4();

    db.prepare(
      `INSERT INTO identity_verifications (id, user_id, type, reason) VALUES (?, ?, 'address', ?)`
    ).run(verificationId, req.userId, JSON.stringify({address, city, state, postalCode, country}));

    res.status(201).json({success: true, verificationId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Address verification failed'});
  }
});

router.get('/identity/status', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const verifications = db.prepare(
      'SELECT * FROM identity_verifications WHERE user_id = ?'
    ).all(req.userId) as any[];

    const grouped: Record<string, any[]> = {};
    for (const v of verifications) {
      if (!grouped[v.type]) {
        grouped[v.type] = [];
      }
      grouped[v.type].push(v);
    }

    const requiredTypes = ['document', 'selfie', 'address'];
    const allApproved = requiredTypes.every(type =>
      grouped[type]?.some((v: any) => v.status === 'approved')
    );

    res.json({
      verifications: grouped,
      overallStatus: allApproved ? 'verified' : 'pending',
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch identity status'});
  }
});

router.get('/identity/risk_flags', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const flags = db.prepare('SELECT * FROM risk_flags WHERE user_id = ?').all(req.userId);
    res.json(flags);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch risk flags'});
  }
});

router.post('/identity_verification', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {linkSessionId} = req.body;
    const verificationId = uuidv4();

    db.prepare(
      `INSERT INTO identity_verifications (id, user_id, type, reason) VALUES (?, ?, 'link_session', ?)`
    ).run(verificationId, req.userId, linkSessionId);

    res.status(201).json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Identity verification failed'});
  }
});

router.get('/token/create', authMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const linkToken = 'link-sandbox-token-' + uuidv4();
    res.json({linkToken});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create token'});
  }
});

router.get('/token/create/auth', authMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const linkToken = 'auth-sandbox-token-' + uuidv4();
    res.json({linkToken});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create auth token'});
  }
});

router.post('/token/public_exchange/get_products', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {publicToken} = req.body;
    if (!publicToken) {
      res.status(400).json({error: 'Public token is required'});
      return;
    }

    res.json({success: true, products: {auth: true, identity: true}});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to exchange token'});
  }
});

export default router;
