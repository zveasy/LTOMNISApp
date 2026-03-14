import express, {Response} from 'express';
import {v4 as uuidv4} from 'uuid';
import PDFDocument from 'pdfkit';
import db from '../database';
import {authMiddleware, AuthRequest} from '../middleware/auth';

const router = express.Router();

router.post('/contract/create', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {offerId, lateFeePercentage, termsAccepted} = req.body;

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(offerId) as any;
    if (!offer) {
      res.status(404).json({error: 'Offer not found'});
      return;
    }

    const principal = offer.amount;
    const interestRate = offer.interest_percentage;
    const termMonths = offer.payment_plan_months || 12;
    const totalRepayment = principal + (principal * interestRate / 100);
    const monthlyPayment = totalRepayment / termMonths;

    const contractId = uuidv4();
    db.prepare(
      `INSERT INTO contracts (id, offer_id, lender_id, borrower_id, principal, interest_rate, total_repayment, monthly_payment, term_months, late_fee_percentage, terms_text)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      contractId, offerId, offer.lender_id, offer.borrower_id,
      principal, interestRate, totalRepayment, monthlyPayment, termMonths,
      lateFeePercentage || 5, termsAccepted ? 'Terms accepted by both parties' : ''
    );

    res.json({success: true, contractId});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to create contract'});
  }
});

router.get('/contract/:contractId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {contractId} = req.params;

    const contract = db.prepare(
      `SELECT c.*,
              l.first_name AS lender_first_name, l.last_name AS lender_last_name,
              b.first_name AS borrower_first_name, b.last_name AS borrower_last_name
       FROM contracts c
       JOIN users l ON c.lender_id = l.id
       JOIN users b ON c.borrower_id = b.id
       WHERE c.id = ?`
    ).get(contractId) as any;

    if (!contract) {
      res.status(404).json({error: 'Contract not found'});
      return;
    }

    res.json(contract);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get contract'});
  }
});

router.get('/contract/:contractId/pdf', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {contractId} = req.params;

    const contract = db.prepare(
      `SELECT c.*,
              l.first_name AS lender_first_name, l.last_name AS lender_last_name,
              b.first_name AS borrower_first_name, b.last_name AS borrower_last_name
       FROM contracts c
       JOIN users l ON c.lender_id = l.id
       JOIN users b ON c.borrower_id = b.id
       WHERE c.id = ?`
    ).get(contractId) as any;

    if (!contract) {
      res.status(404).json({error: 'Contract not found'});
      return;
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=contract-${contractId}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('OMNIS Loan Contract', {align: 'center'});
    doc.moveDown();
    doc.fontSize(12).text(`Contract ID: ${contract.id}`);
    doc.text(`Date: ${contract.created_at}`);
    doc.text(`Status: ${contract.status}`);
    doc.moveDown();
    doc.text(`Borrower: ${contract.borrower_first_name} ${contract.borrower_last_name}`);
    doc.text(`Lender: ${contract.lender_first_name} ${contract.lender_last_name}`);
    doc.moveDown();
    doc.text(`Principal: $${contract.principal}`);
    doc.text(`Interest Rate: ${contract.interest_rate}%`);
    doc.text(`Total Repayment: $${contract.total_repayment}`);
    doc.text(`Monthly Payment: $${contract.monthly_payment}`);
    doc.text(`Term: ${contract.term_months} months`);
    doc.text(`Late Fee: ${contract.late_fee_percentage}%`);
    doc.moveDown();
    if (contract.terms_text) {
      doc.text('Terms:', {underline: true});
      doc.text(contract.terms_text);
    }
    doc.moveDown();
    doc.text(`Borrower Signed: ${contract.borrower_signed ? 'Yes' : 'No'}`);
    doc.text(`Lender Signed: ${contract.lender_signed ? 'Yes' : 'No'}`);

    doc.end();
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to generate contract PDF'});
  }
});

router.post('/contract/:contractId/sign', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {contractId} = req.params;
    const {fullName} = req.body;

    const contract = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contractId) as any;
    if (!contract) {
      res.status(404).json({error: 'Contract not found'});
      return;
    }

    if (req.userId === contract.borrower_id) {
      db.prepare(
        `UPDATE contracts SET borrower_signed = 1, borrower_signed_at = datetime('now') WHERE id = ?`
      ).run(contractId);
    } else if (req.userId === contract.lender_id) {
      db.prepare(
        `UPDATE contracts SET lender_signed = 1, lender_signed_at = datetime('now') WHERE id = ?`
      ).run(contractId);
    } else {
      res.status(403).json({error: 'Not authorized to sign this contract'});
      return;
    }

    const updated = db.prepare('SELECT * FROM contracts WHERE id = ?').get(contractId) as any;
    if (updated.borrower_signed && updated.lender_signed) {
      db.prepare(`UPDATE contracts SET status = 'active' WHERE id = ?`).run(contractId);
    }

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to sign contract'});
  }
});

router.post('/contract/lender_accept', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {offerId} = req.body;

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(offerId) as any;
    if (!offer) {
      res.status(404).json({error: 'Offer not found'});
      return;
    }

    db.prepare(`UPDATE offers SET status = 'accepted' WHERE id = ?`).run(offerId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to accept offer'});
  }
});

router.post('/contract/lender_decline', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {offerId} = req.body;

    const offer = db.prepare('SELECT * FROM offers WHERE id = ?').get(offerId) as any;
    if (!offer) {
      res.status(404).json({error: 'Offer not found'});
      return;
    }

    db.prepare(`UPDATE offers SET status = 'declined' WHERE id = ?`).run(offerId);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to decline offer'});
  }
});

router.post('/contract/:contractId/amend', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {contractId} = req.params;
    const {newAmount, newTerm, newInterestRate, reason} = req.body;

    const amendmentId = uuidv4();
    db.prepare(
      `INSERT INTO contract_amendments (id, contract_id, requested_by, new_amount, new_term, new_interest_rate, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(amendmentId, contractId, req.userId, newAmount, newTerm, newInterestRate, reason);

    res.json({success: true});
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to amend contract'});
  }
});

router.get('/contract/:contractId/amendments', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const {contractId} = req.params;

    const amendments = db.prepare(
      `SELECT * FROM contract_amendments WHERE contract_id = ? ORDER BY created_at DESC`
    ).all(contractId);

    res.json(amendments);
  } catch (err: any) {
    res.status(500).json({error: err.message || 'Failed to get amendments'});
  }
});

export default router;
