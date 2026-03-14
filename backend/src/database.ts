import Database, {Database as DatabaseType} from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'omnis.db');
const db: DatabaseType = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initializeDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT DEFAULT '',
      last_name TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      country TEXT DEFAULT '',
      state TEXT DEFAULT '',
      city TEXT DEFAULT '',
      address TEXT DEFAULT '',
      postal_code TEXT DEFAULT '',
      avatar_url TEXT DEFAULT '',
      balance REAL DEFAULT 0.0,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      is_verified INTEGER DEFAULT 0,
      omnis_score INTEGER DEFAULT 50,
      trust_tier INTEGER DEFAULT 1,
      verification_code TEXT,
      phone_verification_code TEXT,
      detection_preferences TEXT DEFAULT '{}',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS identity_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      document_url TEXT,
      reviewer_id TEXT,
      reviewer_notes TEXT,
      reason TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS risk_flags (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      flag_type TEXT NOT NULL,
      severity TEXT DEFAULT 'info',
      description TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS friends (
      id TEXT PRIMARY KEY,
      requester_id TEXT NOT NULL REFERENCES users(id),
      receiver_id TEXT NOT NULL REFERENCES users(id),
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      creator_id TEXT NOT NULL REFERENCES users(id),
      visibility TEXT DEFAULT 'public',
      max_exposure REAL DEFAULT 10000,
      loan_visibility INTEGER DEFAULT 1,
      pool_enabled INTEGER DEFAULT 0,
      max_loan_amount REAL DEFAULT 5000,
      member_count INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS community_memberships (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL REFERENCES communities(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      role TEXT DEFAULT 'member',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(community_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS pool_transactions (
      id TEXT PRIMARY KEY,
      community_id TEXT NOT NULL REFERENCES communities(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      reason TEXT DEFAULT '',
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      image_url TEXT,
      repayment_date TEXT,
      repayment_type TEXT DEFAULT 'installments',
      visibility TEXT DEFAULT 'public',
      group_id TEXT,
      status TEXT DEFAULT 'open',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES posts(id),
      lender_id TEXT NOT NULL REFERENCES users(id),
      borrower_id TEXT NOT NULL REFERENCES users(id),
      amount REAL NOT NULL,
      interest_percentage REAL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      payment_plan_months INTEGER,
      payment_plan_ppm REAL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS counter_offers (
      id TEXT PRIMARY KEY,
      offer_id TEXT NOT NULL REFERENCES offers(id),
      proposed_amount REAL,
      proposed_interest REAL,
      proposed_term INTEGER,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      offer_id TEXT NOT NULL REFERENCES offers(id),
      lender_id TEXT NOT NULL REFERENCES users(id),
      borrower_id TEXT NOT NULL REFERENCES users(id),
      principal REAL NOT NULL,
      interest_rate REAL DEFAULT 0,
      total_repayment REAL NOT NULL,
      monthly_payment REAL,
      term_months INTEGER,
      late_fee_percentage REAL DEFAULT 5,
      status TEXT DEFAULT 'pending',
      borrower_signed INTEGER DEFAULT 0,
      lender_signed INTEGER DEFAULT 0,
      borrower_signed_at TEXT,
      lender_signed_at TEXT,
      terms_text TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contract_amendments (
      id TEXT PRIMARY KEY,
      contract_id TEXT NOT NULL REFERENCES contracts(id),
      requested_by TEXT NOT NULL REFERENCES users(id),
      new_amount REAL,
      new_term INTEGER,
      new_interest_rate REAL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS loans (
      id TEXT PRIMARY KEY,
      contract_id TEXT REFERENCES contracts(id),
      offer_id TEXT REFERENCES offers(id),
      post_id TEXT REFERENCES posts(id),
      lender_id TEXT NOT NULL REFERENCES users(id),
      borrower_id TEXT NOT NULL REFERENCES users(id),
      principal REAL NOT NULL,
      amount_repaid REAL DEFAULT 0,
      amount_overdue REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      next_payment_date TEXT,
      funded_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS repayment_schedules (
      id TEXT PRIMARY KEY,
      loan_id TEXT NOT NULL REFERENCES loans(id),
      payment_number INTEGER NOT NULL,
      amount REAL NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT DEFAULT 'scheduled',
      paid_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      loan_id TEXT REFERENCES loans(id),
      payer_id TEXT NOT NULL REFERENCES users(id),
      amount REAL NOT NULL,
      method TEXT DEFAULT 'bank_transfer',
      platform TEXT,
      reference_number TEXT,
      payment_date TEXT,
      proof_url TEXT,
      notes TEXT,
      direction TEXT,
      counterparty TEXT,
      raw_text TEXT,
      confidence REAL,
      status TEXT DEFAULT 'pending',
      confirmed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS disputes (
      id TEXT PRIMARY KEY,
      loan_id TEXT,
      contract_id TEXT,
      filed_by TEXT NOT NULL REFERENCES users(id),
      against_user TEXT REFERENCES users(id),
      type TEXT NOT NULL,
      description TEXT,
      evidence_url TEXT,
      status TEXT DEFAULT 'open',
      resolution TEXT,
      outcome TEXT,
      resolved_at TEXT,
      assigned_to TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS dispute_messages (
      id TEXT PRIMARY KEY,
      dispute_id TEXT NOT NULL REFERENCES disputes(id),
      sender_id TEXT NOT NULL REFERENCES users(id),
      message TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ledger_events (
      id TEXT PRIMARY KEY,
      loan_id TEXT REFERENCES loans(id),
      user_id TEXT REFERENCES users(id),
      event_type TEXT NOT NULL,
      description TEXT,
      amount REAL DEFAULT 0,
      running_balance REAL DEFAULT 0,
      reference_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      name TEXT DEFAULT 'Main Wallet',
      balance REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      counterparty_id TEXT,
      status TEXT DEFAULT 'completed',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT,
      message TEXT,
      is_read INTEGER DEFAULT 0,
      reference_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      badge_type TEXT NOT NULL,
      earned_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_type)
    );

    CREATE TABLE IF NOT EXISTS endorsements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      endorser_id TEXT NOT NULL REFERENCES users(id),
      rating INTEGER NOT NULL,
      message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_actions (
      id TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL REFERENCES users(id),
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      platform TEXT NOT NULL,
      handle TEXT NOT NULL,
      display_name TEXT,
      is_primary INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(user_id, platform, handle)
    );

    CREATE TABLE IF NOT EXISTS credit_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      event_type TEXT NOT NULL,
      description TEXT,
      score_change INTEGER DEFAULT 0,
      score_after INTEGER,
      loan_id TEXT,
      payment_id TEXT,
      platform TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export default db;
