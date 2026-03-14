import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /friends/search
router.get('/friends/search', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query parameter is required' });
      return;
    }
    const pattern = `%${query}%`;
    const users = db.prepare(`
      SELECT id, first_name, last_name, email FROM users
      WHERE (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)
        AND id != ?
    `).all(pattern, pattern, pattern, req.userId) as any[];

    const results = users.map((user) => {
      const friendship = db.prepare(`
        SELECT id FROM friends
        WHERE ((requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?))
          AND status = 'accepted'
      `).get(req.userId, user.id, user.id, req.userId);
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isFriend: !!friendship,
      };
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// POST /friend/send/request
router.post('/friend/send/request', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { friendId } = req.body;
    if (!friendId) {
      res.status(400).json({ error: 'friendId is required' });
      return;
    }
    const id = uuidv4();
    db.prepare(`
      INSERT INTO friends (id, requester_id, receiver_id, status) VALUES (?, ?, ?, 'pending')
    `).run(id, req.userId, friendId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send friend request' });
  }
});

// GET /groups/mygroups
router.get('/groups/mygroups', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const groups = db.prepare(`
      SELECT c.* FROM communities c
      JOIN community_memberships cm ON cm.community_id = c.id
      WHERE cm.user_id = ?
    `).all(req.userId);

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

// GET /groups/featured
router.get('/groups/featured', authMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const groups = db.prepare(`
      SELECT * FROM communities ORDER BY member_count DESC
    `).all();

    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get featured groups' });
  }
});

// GET /groups/all
router.get('/groups/all', authMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const groups = db.prepare(`SELECT * FROM communities`).all();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get groups' });
  }
});

// POST /group/creategroup
router.post('/group/creategroup', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { name, description, visibility, maxExposure, loanVisibility, poolEnabled, maxLoanAmount, taggedFriends } = req.body;
    const groupId = uuidv4();
    const membershipId = uuidv4();

    db.prepare(`
      INSERT INTO communities (id, name, description, creator_id, visibility, max_exposure, loan_visibility, pool_enabled, max_loan_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(groupId, name, description || '', req.userId, visibility || 'public', maxExposure || 10000, loanVisibility ? 1 : 0, poolEnabled ? 1 : 0, maxLoanAmount || 5000);

    db.prepare(`
      INSERT INTO community_memberships (id, community_id, user_id, role) VALUES (?, ?, ?, 'admin')
    `).run(membershipId, groupId, req.userId);

    if (taggedFriends && Array.isArray(taggedFriends)) {
      const insertMember = db.prepare(`
        INSERT INTO community_memberships (id, community_id, user_id, role) VALUES (?, ?, ?, 'member')
      `);
      const updateCount = db.prepare(`
        UPDATE communities SET member_count = member_count + 1 WHERE id = ?
      `);
      for (const friendId of taggedFriends) {
        insertMember.run(uuidv4(), groupId, friendId);
        updateCount.run(groupId);
      }
    }

    res.json({ success: true, groupId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// GET /group/:groupId
router.get('/group/:groupId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = db.prepare(`SELECT * FROM communities WHERE id = ?`).get(groupId) as any;
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const memberCount = (db.prepare(`SELECT COUNT(*) AS count FROM community_memberships WHERE community_id = ?`).get(groupId) as any).count;
    group.member_count = memberCount;

    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get group details' });
  }
});

// POST /group/:groupId/join
router.post('/group/:groupId/join', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const id = uuidv4();

    db.prepare(`
      INSERT INTO community_memberships (id, community_id, user_id, role) VALUES (?, ?, ?, 'member')
    `).run(id, groupId, req.userId);

    db.prepare(`
      UPDATE communities SET member_count = member_count + 1 WHERE id = ?
    `).run(groupId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join group' });
  }
});

// POST /group/:groupId/leave
router.post('/group/:groupId/leave', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    db.prepare(`
      DELETE FROM community_memberships WHERE community_id = ? AND user_id = ?
    `).run(groupId, req.userId);

    db.prepare(`
      UPDATE communities SET member_count = member_count - 1 WHERE id = ?
    `).run(groupId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave group' });
  }
});

// GET /group/:groupId/admin
router.get('/group/:groupId/admin', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = db.prepare(`SELECT * FROM communities WHERE id = ?`).get(groupId);
    if (!group) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const members = db.prepare(`
      SELECT u.id, u.first_name, u.last_name, u.email, cm.role
      FROM community_memberships cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.community_id = ?
    `).all(groupId);

    res.json({ group, members });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get group admin details' });
  }
});

// POST /group/:groupId/remove_member
router.post('/group/:groupId/remove_member', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    db.prepare(`
      DELETE FROM community_memberships WHERE community_id = ? AND user_id = ?
    `).run(groupId, userId);

    db.prepare(`
      UPDATE communities SET member_count = member_count - 1 WHERE id = ?
    `).run(groupId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// PUT /group/:groupId/settings
router.put('/group/:groupId/settings', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { name, description, visibility, maxExposure } = req.body;

    db.prepare(`
      UPDATE communities SET name = ?, description = ?, visibility = ?, max_exposure = ? WHERE id = ?
    `).run(name, description, visibility, maxExposure, groupId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update group settings' });
  }
});

// DELETE /group/:groupId
router.delete('/group/:groupId', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    db.prepare(`DELETE FROM community_memberships WHERE community_id = ?`).run(groupId);
    db.prepare(`DELETE FROM communities WHERE id = ?`).run(groupId);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// GET /group/:groupId/loan_requests
router.get('/group/:groupId/loan_requests', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const posts = db.prepare(`
      SELECT p.*, u.first_name, u.last_name, u.email
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.group_id = ?
    `).all(groupId);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get loan requests' });
  }
});

// GET /group/:groupId/pool
router.get('/group/:groupId/pool', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;

    const group = db.prepare(`SELECT * FROM communities WHERE id = ?`).get(groupId) as any;

    const transactions = db.prepare(`
      SELECT pt.*, u.first_name, u.last_name
      FROM pool_transactions pt
      JOIN users u ON u.id = pt.user_id
      WHERE pt.community_id = ?
      ORDER BY pt.created_at DESC
    `).all(groupId) as any[];

    let balance = 0;
    for (const tx of transactions) {
      if (tx.type === 'contribution') {
        balance += tx.amount;
      } else {
        balance -= tx.amount;
      }
    }

    const members = db.prepare(`
      SELECT u.id, u.first_name, u.last_name, cm.role
      FROM community_memberships cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.community_id = ?
    `).all(groupId);

    res.json({
      balance,
      activities: transactions,
      members,
      poolRules: {
        maxContribution: group ? group.max_loan_amount : 5000,
        minContribution: 10,
        maxRequestAmount: group ? group.max_loan_amount : 5000,
        requireApproval: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pool info' });
  }
});

// POST /group/:groupId/pool (unified endpoint)
router.post('/group/:groupId/pool', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { type, amount, reason } = req.body;

    if (!type || !amount) {
      res.status(400).json({ error: 'type and amount are required' });
      return;
    }

    if (type !== 'contribution' && type !== 'request') {
      res.status(400).json({ error: 'type must be contribution or request' });
      return;
    }

    const id = uuidv4();
    db.prepare(`
      INSERT INTO pool_transactions (id, community_id, user_id, type, amount, reason) VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, groupId, req.userId, type, amount, reason || '');

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process pool transaction' });
  }
});

// POST /group/:groupId/pool/contribute
router.post('/group/:groupId/pool/contribute', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { amount } = req.body;
    const id = uuidv4();

    db.prepare(`
      INSERT INTO pool_transactions (id, community_id, user_id, type, amount) VALUES (?, ?, ?, 'contribution', ?)
    `).run(id, groupId, req.userId, amount);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to contribute to pool' });
  }
});

// POST /group/:groupId/pool/request
router.post('/group/:groupId/pool/request', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { groupId } = req.params;
    const { amount, reason } = req.body;
    const id = uuidv4();

    db.prepare(`
      INSERT INTO pool_transactions (id, community_id, user_id, type, amount, reason) VALUES (?, ?, ?, 'request', ?, ?)
    `).run(id, groupId, req.userId, amount, reason || '');

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request from pool' });
  }
});

export default router;
