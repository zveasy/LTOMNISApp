import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import db from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /post/create
router.post('/post/create', authMiddleware, upload.single('image'), (req: AuthRequest, res: Response) => {
  try {
    const { title, description, amount, featured, repaymentDate, repaymentType, visibility, groupId } = req.body;
    const postId = uuidv4();
    const imageUrl = req.file ? req.file.path : null;

    db.prepare(`
      INSERT INTO posts (id, user_id, title, description, amount, is_featured, image_url, repayment_date, repayment_type, visibility, group_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      postId,
      req.userId,
      title,
      description || '',
      amount,
      featured ? 1 : 0,
      imageUrl,
      repaymentDate || null,
      repaymentType || 'installments',
      visibility || 'public',
      groupId || null
    );

    res.json({ success: true, postId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET /posts/featured
router.get('/posts/featured', (_req: AuthRequest, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.is_featured = 1 OR p.amount >= (SELECT AVG(amount) FROM posts)
      ORDER BY p.is_featured DESC, p.amount DESC
    `).all();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get featured posts' });
  }
});

// GET /posts/all
router.get('/posts/all', (_req: AuthRequest, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.status = 'open'
      ORDER BY p.created_at DESC
    `).all();

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// GET /posts/friends
router.get('/posts/friends', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id IN (
        SELECT CASE WHEN requester_id = ? THEN receiver_id ELSE requester_id END
        FROM friends WHERE (requester_id = ? OR receiver_id = ?) AND status = 'accepted'
      )
      ORDER BY p.created_at DESC
    `).all(req.userId, req.userId, req.userId);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get friends posts' });
  }
});

// GET /posts/mypost
router.get('/posts/mypost', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.userId);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get your posts' });
  }
});

// GET /post/:postId
router.get('/post/:postId', (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `).get(postId);

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// GET /posts/search
router.get('/posts/search', (req: AuthRequest, res: Response) => {
  try {
    const { query, minAmount, maxAmount, minScore, visibility, status, sort } = req.query;

    let sql = `
      SELECT p.*, u.first_name, u.last_name, u.email, u.avatar_url, u.omnis_score
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (query && typeof query === 'string') {
      sql += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
      const pattern = `%${query}%`;
      params.push(pattern, pattern);
    }
    if (minAmount) {
      sql += ` AND p.amount >= ?`;
      params.push(Number(minAmount));
    }
    if (maxAmount) {
      sql += ` AND p.amount <= ?`;
      params.push(Number(maxAmount));
    }
    if (minScore) {
      sql += ` AND u.omnis_score >= ?`;
      params.push(Number(minScore));
    }
    if (visibility && typeof visibility === 'string') {
      sql += ` AND p.visibility = ?`;
      params.push(visibility);
    }
    if (status && typeof status === 'string') {
      sql += ` AND p.status = ?`;
      params.push(status);
    }

    if (sort === 'amount_asc') {
      sql += ` ORDER BY p.amount ASC`;
    } else if (sort === 'amount_desc') {
      sql += ` ORDER BY p.amount DESC`;
    } else {
      sql += ` ORDER BY p.created_at DESC`;
    }

    const posts = db.prepare(sql).all(...params);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// GET /posts/borrower
router.get('/posts/borrower', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `).all(req.userId);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get borrower posts' });
  }
});

// GET /posts/borrower/active_offers
router.get('/posts/borrower/active_offers', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const offers = db.prepare(`
      SELECT o.*, p.title AS post_title, p.amount AS post_amount,
             u.first_name AS lender_first_name, u.last_name AS lender_last_name
      FROM offers o
      JOIN posts p ON p.id = o.post_id
      JOIN users u ON u.id = o.lender_id
      WHERE o.borrower_id = ? AND o.status IN ('accepted', 'active')
      ORDER BY o.created_at DESC
    `).all(req.userId);

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get active offers' });
  }
});

// GET /posts/borrower/closed_offers
router.get('/posts/borrower/closed_offers', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const offers = db.prepare(`
      SELECT o.*, p.title AS post_title, p.amount AS post_amount,
             u.first_name AS lender_first_name, u.last_name AS lender_last_name
      FROM offers o
      JOIN posts p ON p.id = o.post_id
      JOIN users u ON u.id = o.lender_id
      WHERE o.borrower_id = ? AND o.status IN ('closed', 'paid')
      ORDER BY o.created_at DESC
    `).all(req.userId);

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get closed offers' });
  }
});

// GET /posts/lender
router.get('/posts/lender', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const offers = db.prepare(`
      SELECT o.*, p.title AS post_title, p.amount AS post_amount,
             u.first_name AS borrower_first_name, u.last_name AS borrower_last_name
      FROM offers o
      JOIN posts p ON p.id = o.post_id
      JOIN users u ON u.id = o.borrower_id
      WHERE o.lender_id = ?
      ORDER BY o.created_at DESC
    `).all(req.userId);

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get lender offers' });
  }
});

// GET /posts/lender/active_offers
router.get('/posts/lender/active_offers', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const offers = db.prepare(`
      SELECT o.*, p.title AS post_title, p.amount AS post_amount,
             u.first_name AS borrower_first_name, u.last_name AS borrower_last_name
      FROM offers o
      JOIN posts p ON p.id = o.post_id
      JOIN users u ON u.id = o.borrower_id
      WHERE o.lender_id = ? AND o.status IN ('accepted', 'active')
      ORDER BY o.created_at DESC
    `).all(req.userId);

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get active lender offers' });
  }
});

// GET /posts/lender/closed_offers
router.get('/posts/lender/closed_offers', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const offers = db.prepare(`
      SELECT o.*, p.title AS post_title, p.amount AS post_amount,
             u.first_name AS borrower_first_name, u.last_name AS borrower_last_name
      FROM offers o
      JOIN posts p ON p.id = o.post_id
      JOIN users u ON u.id = o.borrower_id
      WHERE o.lender_id = ? AND o.status IN ('closed', 'paid')
      ORDER BY o.created_at DESC
    `).all(req.userId);

    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get closed lender offers' });
  }
});

export default router;
