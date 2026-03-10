import {Request, Response, NextFunction} from 'express';
import {verifyToken} from '../utils/jwt';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({error: 'No token provided'});
    return;
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({error: 'Invalid token'});
  }
}

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'admin') {
    res.status(403).json({error: 'Admin access required'});
    return;
  }
  next();
}
