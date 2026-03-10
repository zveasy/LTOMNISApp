import express, {Response} from 'express';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.get('/loan/:loanId/status', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {loanId} = req.params;

    const loan = db.prepare(
      `SELECT l.*, 
              bl.first_name AS borrower_first_name, bl.last_name AS borrower_last_name,
              ll.first_name AS lender_first_name, ll.last_name AS lender_last_name
       FROM loans l
       JOIN users bl ON l.borrower_id = bl.id
       JOIN users ll ON l.lender_id = ll.id
       WHERE l.id = ?`
    ).get(loanId) as any;

    if (!loan) {
      res.status(404).json({error: 'Loan not found'});
      return;
    }

    const schedules = db.prepare(
      `SELECT * FROM repayment_schedules WHERE loan_id = ? ORDER BY due_date ASC`
    ).all(loanId) as any[];

    const payments = db.prepare(
      `SELECT * FROM payments WHERE loan_id = ? ORDER BY created_at ASC`
    ).all(loanId) as any[];

    const timeline: {state: string; date: string}[] = [];
    timeline.push({state: 'created', date: loan.created_at});
    if (loan.funded_at) timeline.push({state: 'funded', date: loan.funded_at});

    const firstPayment = payments.find((p: any) => p.status === 'confirmed');
    if (firstPayment) timeline.push({state: 'first_payment', date: firstPayment.confirmed_at || firstPayment.created_at});

    if (loan.completed_at) timeline.push({state: 'completed', date: loan.completed_at});

    const nextSchedule = schedules.find((s: any) => s.status === 'scheduled');

    const availableActions: string[] = [];
    if (loan.status === 'active') {
      if (loan.borrower_id === req.userId) {
        availableActions.push('make_payment', 'request_extension');
      }
      if (loan.lender_id === req.userId) {
        availableActions.push('confirm_payment', 'file_dispute');
      }
    }

    res.json({
      loan: {
        id: loan.id,
        contractId: loan.contract_id,
        lenderId: loan.lender_id,
        borrowerId: loan.borrower_id,
        lenderName: `${loan.lender_first_name} ${loan.lender_last_name}`.trim(),
        borrowerName: `${loan.borrower_first_name} ${loan.borrower_last_name}`.trim(),
        principal: loan.principal,
        amountRepaid: loan.amount_repaid,
        amountOverdue: loan.amount_overdue,
        status: loan.status,
      },
      currentState: loan.status,
      timeline,
      keyDates: {
        created: loan.created_at,
        funded: loan.funded_at,
        firstPayment: firstPayment ? (firstPayment.confirmed_at || firstPayment.created_at) : null,
        nextPayment: nextSchedule ? nextSchedule.due_date : null,
        completion: loan.completed_at,
      },
      availableActions,
    });
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to fetch loan status'});
  }
});

export default router;
