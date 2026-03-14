import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import db from '../database';
import {authMiddleware, adminMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get('/admin/stats', (req: AuthRequest, res: Response) => {
  try {
    const activeLoans = (db.prepare(`SELECT COUNT(*) AS count FROM loans WHERE status = 'active'`).get() as any).count;
    const delinquentLoans = (db.prepare(`SELECT COUNT(*) AS count FROM loans WHERE amount_overdue > 0 AND status = 'active'`).get() as any).count;
    const totalUsers = (db.prepare(`SELECT COUNT(*) AS count FROM users`).get() as any).count;
    const newUsersThisMonth = (db.prepare(
      `SELECT COUNT(*) AS count FROM users WHERE created_at >= datetime('now', 'start of month')`
    ).get() as any).count;

    const totalRepaid = (db.prepare(`SELECT COALESCE(SUM(amount_repaid), 0) AS total FROM loans`).get() as any).total;
    const totalPrincipal = (db.prepare(`SELECT COALESCE(SUM(principal), 0) AS total FROM loans`).get() as any).total;
    const repaymentRate = totalPrincipal > 0 ? Math.round((totalRepaid / totalPrincipal) * 100) : 0;

    const defaulted = (db.prepare(`SELECT COUNT(*) AS count FROM loans WHERE status = 'defaulted'`).get() as any).count;
    const totalLoans = (db.prepare(`SELECT COUNT(*) AS count FROM loans`).get() as any).count;
    const defaultRate = totalLoans > 0 ? Math.round((defaulted / totalLoans) * 100) : 0;

    const recentActivity = db.prepare(
      `SELECT * FROM admin_actions ORDER BY created_at DESC LIMIT 20`
    ).all();

    res.json({activeLoans, delinquentLoans, totalUsers, newUsersThisMonth, repaymentRate, defaultRate, recentActivity});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch admin stats'});
  }
});

router.post('/admin/user/:userId/action', (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;
    const {action} = req.body;

    if (!['suspend', 'ban', 'reinstate'].includes(action)) {
      res.status(400).json({error: 'Invalid action. Must be suspend, ban, or reinstate'});
      return;
    }

    const statusMap: Record<string, string> = {suspend: 'suspended', ban: 'banned', reinstate: 'active'};
    db.prepare(`UPDATE users SET status = ? WHERE id = ?`).run(statusMap[action], userId);

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'user', ?, ?, ?)`
    ).run(actionId, req.userId, userId, action, `User ${action} by admin`);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to perform user action'});
  }
});

router.post('/admin/user/:userId/override_score', (req: AuthRequest, res: Response) => {
  try {
    const {userId} = req.params;
    const {newScore} = req.body;

    if (typeof newScore !== 'number') {
      res.status(400).json({error: 'newScore must be a number'});
      return;
    }

    db.prepare(`UPDATE users SET omnis_score = ? WHERE id = ?`).run(newScore, userId);

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'user', ?, 'override_score', ?)`
    ).run(actionId, req.userId, userId, `Score overridden to ${newScore}`);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to override score'});
  }
});

router.get('/admin/contracts/pending', (req: AuthRequest, res: Response) => {
  try {
    const contracts = db.prepare(`SELECT * FROM contracts WHERE status = 'pending'`).all();
    res.json({contracts});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch pending contracts'});
  }
});

router.get('/admin/identity/queue', (req: AuthRequest, res: Response) => {
  try {
    const verifications = db.prepare(`SELECT * FROM identity_verifications WHERE status = 'pending'`).all();
    res.json({verifications});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch identity queue'});
  }
});

router.post('/admin/identity/:verificationId/review', (req: AuthRequest, res: Response) => {
  try {
    const {verificationId} = req.params;
    const {decision, reason} = req.body;

    if (!['approve', 'reject'].includes(decision)) {
      res.status(400).json({error: 'Decision must be approve or reject'});
      return;
    }

    const status = decision === 'approve' ? 'approved' : 'rejected';
    db.prepare(
      `UPDATE identity_verifications SET status = ?, reviewer_id = ?, reviewer_notes = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(status, req.userId, reason || null, verificationId);

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'identity_verification', ?, ?, ?)`
    ).run(actionId, req.userId, verificationId, decision, reason || '');

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to review identity verification'});
  }
});

router.get('/admin/disputes', (req: AuthRequest, res: Response) => {
  try {
    const {status} = req.query;
    let disputes;
    if (status) {
      disputes = db.prepare(`SELECT * FROM disputes WHERE status = ?`).all(status);
    } else {
      disputes = db.prepare(`SELECT * FROM disputes`).all();
    }
    res.json({disputes});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch disputes'});
  }
});

router.post('/admin/disputes/:disputeId/resolve', (req: AuthRequest, res: Response) => {
  try {
    const {disputeId} = req.params;
    const {decision, outcome} = req.body;

    db.prepare(
      `UPDATE disputes SET status = 'resolved', resolution = ?, outcome = ?, resolved_at = datetime('now') WHERE id = ?`
    ).run(decision || null, outcome || null, disputeId);

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'dispute', ?, 'resolve', ?)`
    ).run(actionId, req.userId, disputeId, outcome || '');

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to resolve dispute'});
  }
});

router.get('/admin/fraud/queue', (req: AuthRequest, res: Response) => {
  try {
    const flags = db.prepare(
      `SELECT * FROM risk_flags WHERE status = 'active' ORDER BY
       CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END`
    ).all();
    res.json({flags});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch fraud queue'});
  }
});

router.post('/admin/fraud/:flagId/action', (req: AuthRequest, res: Response) => {
  try {
    const {flagId} = req.params;
    const {action, notes} = req.body;

    if (!['dismiss', 'investigate', 'suspend_user', 'ban_user'].includes(action)) {
      res.status(400).json({error: 'Invalid action'});
      return;
    }

    if (action === 'dismiss') {
      db.prepare(`UPDATE risk_flags SET status = 'dismissed' WHERE id = ?`).run(flagId);
    } else if (action === 'investigate') {
      db.prepare(`UPDATE risk_flags SET status = 'investigating' WHERE id = ?`).run(flagId);
    } else {
      const flag = db.prepare(`SELECT * FROM risk_flags WHERE id = ?`).get(flagId) as any;
      if (flag) {
        const newStatus = action === 'suspend_user' ? 'suspended' : 'banned';
        db.prepare(`UPDATE users SET status = ? WHERE id = ?`).run(newStatus, flag.user_id);
        db.prepare(`UPDATE risk_flags SET status = 'resolved' WHERE id = ?`).run(flagId);
      }
    }

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'risk_flag', ?, ?, ?)`
    ).run(actionId, req.userId, flagId, action, notes || '');

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to process fraud action'});
  }
});

router.get('/admin/loans/search', (req: AuthRequest, res: Response) => {
  try {
    const {query, status} = req.query;

    let sql = `
      SELECT l.*,
             b.first_name AS borrower_first_name, b.last_name AS borrower_last_name,
             le.first_name AS lender_first_name, le.last_name AS lender_last_name
      FROM loans l
      JOIN users b ON l.borrower_id = b.id
      JOIN users le ON l.lender_id = le.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (query && typeof query === 'string') {
      sql += ` AND (l.id LIKE ? OR b.first_name LIKE ? OR b.last_name LIKE ? OR le.first_name LIKE ? OR le.last_name LIKE ?)`;
      const pattern = `%${query}%`;
      params.push(pattern, pattern, pattern, pattern, pattern);
    }
    if (status && typeof status === 'string') {
      sql += ` AND l.status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY l.created_at DESC`;

    const loans = db.prepare(sql).all(...params);
    res.json(loans);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to search loans'});
  }
});

router.post('/admin/loans/:loanId/action', (req: AuthRequest, res: Response) => {
  try {
    const {loanId} = req.params;
    const {action, amount, reason} = req.body;

    if (!['force_complete', 'mark_defaulted', 'apply_adjustment'].includes(action)) {
      res.status(400).json({error: 'Invalid action. Must be force_complete, mark_defaulted, or apply_adjustment'});
      return;
    }

    if (action === 'force_complete') {
      db.prepare(`UPDATE loans SET status = 'completed', completed_at = datetime('now') WHERE id = ?`).run(loanId);
    } else if (action === 'mark_defaulted') {
      db.prepare(`UPDATE loans SET status = 'defaulted' WHERE id = ?`).run(loanId);
    } else if (action === 'apply_adjustment') {
      if (amount !== undefined) {
        db.prepare(`UPDATE loans SET amount_repaid = amount_repaid + ? WHERE id = ?`).run(amount, loanId);
      }
    }

    const actionId = uuidv4();
    db.prepare(
      `INSERT INTO admin_actions (id, admin_id, target_type, target_id, action, details)
       VALUES (?, ?, 'loan', ?, ?, ?)`
    ).run(actionId, req.userId, loanId, action, reason || `Admin action: ${action}`);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to perform loan action'});
  }
});

router.get('/admin/analytics', (req: AuthRequest, res: Response) => {
  try {
    const totalActiveLoans = (db.prepare(`SELECT COUNT(*) AS count FROM loans WHERE status = 'active'`).get() as any).count;
    const totalLent = (db.prepare(`SELECT COALESCE(SUM(principal), 0) AS total FROM loans`).get() as any).total;
    const totalRepaid = (db.prepare(`SELECT COALESCE(SUM(amount_repaid), 0) AS total FROM loans`).get() as any).total;
    const repaymentRate = totalLent > 0 ? Math.round((totalRepaid / totalLent) * 100) : 0;

    const defaulted = (db.prepare(`SELECT COUNT(*) AS count FROM loans WHERE status = 'defaulted'`).get() as any).count;
    const totalLoans = (db.prepare(`SELECT COUNT(*) AS count FROM loans`).get() as any).count;
    const defaultRate = totalLoans > 0 ? Math.round((defaulted / totalLoans) * 100) : 0;

    const userGrowth = db.prepare(
      `SELECT strftime('%Y-%m', created_at) AS month, COUNT(*) AS count FROM users GROUP BY month ORDER BY month DESC LIMIT 12`
    ).all();

    const avgLoanSize = (db.prepare(`SELECT COALESCE(AVG(principal), 0) AS avg FROM loans`).get() as any).avg;
    const avgTerm = (db.prepare(`SELECT COALESCE(AVG(term_months), 0) AS avg FROM contracts`).get() as any).avg;

    const topLenders = db.prepare(
      `SELECT u.id, u.first_name, u.last_name, SUM(l.principal) AS total_lent
       FROM loans l JOIN users u ON l.lender_id = u.id
       GROUP BY l.lender_id ORDER BY total_lent DESC LIMIT 10`
    ).all();

    const topCommunities = db.prepare(
      `SELECT id, name, member_count FROM communities ORDER BY member_count DESC LIMIT 10`
    ).all();

    res.json({
      totalActiveLoans,
      totalLent,
      totalRepaid,
      repaymentRate,
      defaultRate,
      userGrowth,
      averageLoanSize: Math.round(avgLoanSize * 100) / 100,
      averageTerm: Math.round(avgTerm),
      topLenders,
      topCommunities,
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch analytics'});
  }
});

export default router;
