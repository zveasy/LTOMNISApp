import db from '../database';
import { v4 as uuidv4 } from 'uuid';

export function checkAndAwardBadges(userId: string): void {
  // "verified_identity" — if all 3 verification types approved
  const verifiedCount = (db.prepare(
    `SELECT COUNT(DISTINCT type) as count FROM identity_verifications WHERE user_id = ? AND status = 'approved'`
  ).get(userId) as any)?.count || 0;
  if (verifiedCount >= 3) {
    awardBadge(userId, 'verified_identity');
  }

  // "first_loan" — if user has 1+ completed loans as borrower
  const completedLoans = (db.prepare(
    `SELECT COUNT(*) as count FROM loans WHERE borrower_id = ? AND status = 'completed'`
  ).get(userId) as any)?.count || 0;
  if (completedLoans >= 1) {
    awardBadge(userId, 'first_loan');
  }

  // "perfect_repayer" — if user has completed a loan with 0 late payments
  const completedLoanIds = db.prepare(
    `SELECT id FROM loans WHERE borrower_id = ? AND status = 'completed'`
  ).all(userId) as any[];
  for (const loan of completedLoanIds) {
    const latePayments = (db.prepare(
      `SELECT COUNT(*) as count FROM repayment_schedules WHERE loan_id = ? AND status = 'late'`
    ).get(loan.id) as any)?.count || 0;
    if (latePayments === 0) {
      awardBadge(userId, 'perfect_repayer');
      break;
    }
  }

  // "community_leader" — if user is admin of 2+ groups
  const adminGroups = (db.prepare(
    `SELECT COUNT(*) as count FROM community_memberships WHERE user_id = ? AND role = 'admin'`
  ).get(userId) as any)?.count || 0;
  if (adminGroups >= 2) {
    awardBadge(userId, 'community_leader');
  }

  // "top_lender" — if user has lent $1000+
  const totalLent = (db.prepare(
    `SELECT COALESCE(SUM(principal), 0) as total FROM loans WHERE lender_id = ?`
  ).get(userId) as any)?.total || 0;
  if (totalLent >= 1000) {
    awardBadge(userId, 'top_lender');
  }

  // "five_loans_funded" — if user has funded 5+ loans as lender
  const fundedLoans = (db.prepare(
    `SELECT COUNT(*) as count FROM loans WHERE lender_id = ?`
  ).get(userId) as any)?.count || 0;
  if (fundedLoans >= 5) {
    awardBadge(userId, 'five_loans_funded');
  }

  // "early_repayer" — if user has a loan repaid before all due dates
  for (const loan of completedLoanIds) {
    const overdueSchedules = (db.prepare(
      `SELECT COUNT(*) as count FROM repayment_schedules
       WHERE loan_id = ? AND (status = 'late' OR (status = 'scheduled' AND due_date < datetime('now')))`
    ).get(loan.id) as any)?.count || 0;
    const allSchedules = (db.prepare(
      `SELECT COUNT(*) as count FROM repayment_schedules WHERE loan_id = ?`
    ).get(loan.id) as any)?.count || 0;
    if (overdueSchedules === 0 && allSchedules > 0) {
      awardBadge(userId, 'early_repayer');
      break;
    }
  }
}

function awardBadge(userId: string, badgeType: string): void {
  const existing = db.prepare(
    `SELECT id FROM badges WHERE user_id = ? AND badge_type = ?`
  ).get(userId, badgeType);
  if (!existing) {
    db.prepare(
      `INSERT INTO badges (id, user_id, badge_type) VALUES (?, ?, ?)`
    ).run(uuidv4(), userId, badgeType);
  }
}
