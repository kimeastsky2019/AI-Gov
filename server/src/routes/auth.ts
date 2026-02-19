import { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { getDBHelper } from '../config/database.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

/* ───── POST /api/auth/login ───── */
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: '이메일과 비밀번호를 입력하세요' });
    return;
  }

  const db = await getDBHelper();
  const user = db.get('SELECT * FROM users WHERE email = ?', [email]) as any;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' });
    return;
  }

  db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);
  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      title: user.title,
      phone: user.phone,
      department: user.department,
      avatar_url: user.avatar_url,
      is_master: user.is_master === 1,
    }
  });
});

/* ───── POST /api/auth/register ───── */
router.post('/register', async (req: Request, res: Response) => {
  const { email, password, name, company, title, phone } = req.body;

  // Validation
  if (!email || !password || !name) {
    res.status(400).json({ error: '이메일, 비밀번호, 이름은 필수 입력 항목입니다' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: '비밀번호는 6자 이상이어야 합니다' });
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: '올바른 이메일 형식이 아닙니다' });
    return;
  }

  const db = await getDBHelper();
  const exists = db.get('SELECT id FROM users WHERE email = ?', [email]);
  if (exists) {
    res.status(409).json({ error: '이미 등록된 이메일입니다' });
    return;
  }

  const id = `USR-${uuidv4().slice(0, 8)}`;
  const hash = bcrypt.hashSync(password, 10);
  db.run(
    `INSERT INTO users (id, email, password_hash, name, company, title, phone, role, provider)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'viewer', 'local')`,
    [id, email, hash, name, company || null, title || null, phone || null]
  );
  db.save();

  const token = generateToken({ userId: id, email, role: 'viewer' });
  res.status(201).json({
    token,
    user: { id, email, name, role: 'viewer', company, title, phone }
  });
});

/* ───── POST /api/auth/social ───── */
router.post('/social', async (req: Request, res: Response) => {
  const { provider, providerId, email, name, avatarUrl } = req.body;

  if (!provider || !providerId || !email) {
    res.status(400).json({ error: '소셜 로그인 정보가 부족합니다' });
    return;
  }

  const validProviders = ['google', 'facebook', 'kakao'];
  if (!validProviders.includes(provider)) {
    res.status(400).json({ error: '지원하지 않는 소셜 로그인 제공자입니다' });
    return;
  }

  const db = await getDBHelper();

  // Check if user already exists with this social provider
  let user = db.get(
    'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
    [provider, providerId]
  ) as any;

  if (!user) {
    // Check if email already registered (local account)
    user = db.get('SELECT * FROM users WHERE email = ?', [email]) as any;
    if (user) {
      // Link social to existing account
      db.run(
        'UPDATE users SET provider = ?, provider_id = ?, avatar_url = COALESCE(?, avatar_url), last_login = datetime("now") WHERE id = ?',
        [provider, providerId, avatarUrl, user.id]
      );
    } else {
      // Create new social user
      const id = `USR-${uuidv4().slice(0, 8)}`;
      const dummyHash = bcrypt.hashSync(uuidv4(), 10); // no password login for social
      db.run(
        `INSERT INTO users (id, email, password_hash, name, role, provider, provider_id, avatar_url)
         VALUES (?, ?, ?, ?, 'viewer', ?, ?, ?)`,
        [id, email, dummyHash, name || email.split('@')[0], provider, providerId, avatarUrl || null]
      );
      user = db.get('SELECT * FROM users WHERE id = ?', [id]);
    }
    db.save();
  } else {
    db.run('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company: user.company,
      title: user.title,
      avatar_url: user.avatar_url,
      is_master: user.is_master === 1,
    }
  });
});

/* ───── GET /api/auth/me ───── */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const user = db.get(
    'SELECT id, email, name, role, department, company, title, phone, avatar_url, is_master, provider, created_at, last_login FROM users WHERE id = ?',
    [req.user!.userId]
  ) as any;
  if (!user) { res.status(404).json({ error: '사용자를 찾을 수 없습니다' }); return; }
  res.json({ ...user, is_master: user.is_master === 1 });
});

/* ───── GET /api/auth/users (admin only) ───── */
router.get('/users', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (req.user!.role !== 'admin' && req.user!.role !== 'master') {
    res.status(403).json({ error: '관리자 권한이 필요합니다' });
    return;
  }
  const db = await getDBHelper();
  const users = db.all(
    'SELECT id, email, name, role, company, title, phone, department, provider, is_master, created_at, last_login FROM users ORDER BY created_at DESC'
  );
  res.json(users);
});

export default router;
