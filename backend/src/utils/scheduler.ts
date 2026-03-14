import db from '../database';
import {v4 as uuidv4} from 'uuid';
import {updateUserScore} from './scoreEngine';
import logger from './logger';

export function checkOverduePayments(): void {
  const now = new Date().toISOString();

  // Mark scheduled payments past due date as 'late'
  const overdue = db.prepare(`
    UPDATE repayment_schedules 
    SET status = 'late' 
    WHERE status = 'scheduled' AND due_date < ? 
  `).run(now);

  if (overdue.changes > 0) {
    logger.info(`Marked ${overdue.changes} payment(s) as late`);
  }

  // Mark loans with 3+ late payments as defaulted
  const defaultCandidates = db.prepare(`
    SELECT l.id, l.borrower_id, COUNT(*) as late_count 
    FROM loans l
    JOIN repayment_schedules rs ON rs.loan_id = l.id
    WHERE l.status = 'active' AND rs.status = 'late'
    GROUP BY l.id
    HAVING late_count >= 3
  `).all() as any[];

  for (const loan of defaultCandidates) {
    db.prepare("UPDATE loans SET status = 'defaulted', completed_at = datetime('now') WHERE id = ?").run(loan.id);
    db.prepare('INSERT INTO ledger_events (id, loan_id, user_id, event_type, description, amount, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime(\'now\'))').run(
      uuidv4(), loan.id, loan.borrower_id, 'loan_defaulted', 'Loan defaulted due to 3+ late payments', 0
    );
    db.prepare('INSERT INTO risk_flags (id, user_id, flag_type, severity, description) VALUES (?, ?, ?, ?, ?)').run(
      uuidv4(), loan.borrower_id, 'loan_default', 'critical', `Loan ${loan.id} defaulted`
    );
    updateUserScore(loan.borrower_id);
    logger.info(`Loan ${loan.id} marked as defaulted`);
  }
}

export function startScheduler(): void {
  // Run every hour
  setInterval(() => {
    try {
      checkOverduePayments();
    } catch (err) {
      logger.error(err, 'Scheduler error');
    }
  }, 60 * 60 * 1000);

  // Run once on startup
  checkOverduePayments();
  logger.info('Payment scheduler started');
}
