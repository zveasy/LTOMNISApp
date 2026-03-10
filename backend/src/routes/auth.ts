import express, {Response} from 'express';
import bcrypt from 'bcryptjs';
import {v4 as uuidv4} from 'uuid';
import db from '../database';
import {generateToken} from '../utils/jwt';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/account/register_login', (req: AuthRequest, res: Response) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({error: 'Email and password are required'});
      return;
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = uuidv4();
    const verificationCode = generateVerificationCode();

    const stmt = db.prepare(
      `INSERT INTO users (id, email, password_hash, verification_code) VALUES (?, ?, ?, ?)`
    );
    stmt.run(userId, email, hashedPassword, verificationCode);

    const token = generateToken(userId, 'user');
    res.status(201).json({token, userId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Registration failed'});
  }
});

router.post('/account/login', (req: AuthRequest, res: Response) => {
  try {
    const {email, password} = req.body;
    if (!email || !password) {
      res.status(400).json({error: 'Email and password are required'});
      return;
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      res.status(401).json({error: 'Invalid credentials'});
      return;
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      res.status(401).json({error: 'Invalid credentials'});
      return;
    }

    const token = generateToken(user.id, user.role);
    res.json({token, userId: user.id, firstName: user.first_name, lastName: user.last_name});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Login failed'});
  }
});

router.post('/account/verify', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {code} = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    if (user.verification_code !== code) {
      res.status(400).json({error: 'Invalid verification code'});
      return;
    }

    db.prepare('UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?').run(req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Verification failed'});
  }
});

router.post('/account/resend_code', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const code = generateVerificationCode();
    db.prepare('UPDATE users SET verification_code = ? WHERE id = ?').run(code, req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to resend code'});
  }
});

router.post('/account/forgot_password', (req: AuthRequest, res: Response) => {
  try {
    const {email} = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    const code = generateVerificationCode();
    db.prepare('UPDATE users SET verification_code = ? WHERE id = ?').run(code, user.id);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to process request'});
  }
});

router.post('/account/update_password', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashedPassword, req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to update password'});
  }
});

router.post('/account/send_phone_code', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {phone} = req.body;
    const code = generateVerificationCode();
    db.prepare('UPDATE users SET phone = ?, phone_verification_code = ? WHERE id = ?').run(phone, code, req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to send phone code'});
  }
});

router.post('/account/verify_phone', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {code} = req.body;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;
    if (!user) {
      res.status(404).json({error: 'User not found'});
      return;
    }

    if (user.phone_verification_code !== code) {
      res.status(400).json({error: 'Invalid phone verification code'});
      return;
    }

    db.prepare('UPDATE users SET phone_verification_code = NULL WHERE id = ?').run(req.userId);
    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Phone verification failed'});
  }
});

router.post('/account/apple_login', (req: AuthRequest, res: Response) => {
  try {
    const {identityToken, fullName, email} = req.body;
    if (!identityToken || !email) {
      res.status(400).json({error: 'Identity token and email are required'});
      return;
    }

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      const userId = uuidv4();
      const firstName = fullName?.givenName || '';
      const lastName = fullName?.familyName || '';
      db.prepare(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, is_verified) VALUES (?, ?, ?, ?, ?, 1)`
      ).run(userId, email, '', firstName, lastName);
      user = {id: userId, role: 'user'};
    }

    const token = generateToken(user.id, user.role || 'user');
    res.json({token, userId: user.id});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Apple login failed'});
  }
});

router.post('/google_sign_in', (req: AuthRequest, res: Response) => {
  try {
    const {idToken, email, firstName, lastName} = req.body;
    if (!idToken || !email) {
      res.status(400).json({error: 'ID token and email are required'});
      return;
    }

    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      const userId = uuidv4();
      db.prepare(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, is_verified) VALUES (?, ?, ?, ?, ?, 1)`
      ).run(userId, email, '', firstName || '', lastName || '');
      user = {id: userId, role: 'user'};
    }

    const token = generateToken(user.id, user.role || 'user');
    res.json({token, userId: user.id});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Google sign-in failed'});
  }
});

export default router;
