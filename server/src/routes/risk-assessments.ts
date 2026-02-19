import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDBHelper } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get all risk assessments with filtering
router.get('/', async (req: AuthRequest, res: Response) => {
  const { status, riskLevel, category, search, page = '1', limit = '20' } = req.query;
  const db = await getDBHelper();
  let sql = 'SELECT * FROM risk_assessments WHERE 1=1';
  const params: any[] = [];

  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (riskLevel) { sql += ' AND risk_level = ?'; params.push(riskLevel); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
  const total = (db.get(countSql, params) as any).total;

  sql += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit as string), offset);

  const items = db.all(sql, params);
  res.json({ items, total, page: parseInt(page as string), limit: parseInt(limit as string), totalPages: Math.ceil(total / parseInt(limit as string)) });
});

// Get single assessment
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const item = db.get('SELECT * FROM risk_assessments WHERE id = ?', [req.params.id]);
  if (!item) { res.status(404).json({ error: '평가를 찾을 수 없습니다' }); return; }
  res.json(item);
});

// Create assessment
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, category, riskLevel, description, assessor, aiServiceId, sector } = req.body;
  if (!title || !category || !riskLevel) {
    res.status(400).json({ error: '필수 항목을 입력하세요' }); return;
  }

  const db = await getDBHelper();
  const countResult = db.get('SELECT COUNT(*) as c FROM risk_assessments', []) as any;
  const id = `RA-2026-${String(countResult.c + 1).padStart(3, '0')}`;

  db.run(`INSERT INTO risk_assessments (id, title, category, risk_level, status, description, assessor, ai_service_id, sector) VALUES (?, ?, ?, ?, 'PENDING', ?, ?, ?, ?)`, [id, title, category, riskLevel, description, assessor, aiServiceId || null, sector || null]);

  db.run(`INSERT INTO audit_log (user_id, action, entity_type, entity_id, details) VALUES (?, 'CREATE', 'risk_assessment', ?, ?)`, [req.user?.userId, id, `위험 평가 생성: ${title}`]);

  const item = db.get('SELECT * FROM risk_assessments WHERE id = ?', [id]);
  res.status(201).json(item);
});

// Update assessment
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, category, riskLevel, status, description, assessor } = req.body;
  const db = await getDBHelper();

  const existing = db.get('SELECT * FROM risk_assessments WHERE id = ?', [req.params.id]);
  if (!existing) { res.status(404).json({ error: '평가를 찾을 수 없습니다' }); return; }

  db.run(`UPDATE risk_assessments SET title = COALESCE(?, title), category = COALESCE(?, category), risk_level = COALESCE(?, risk_level), status = COALESCE(?, status), description = COALESCE(?, description), assessor = COALESCE(?, assessor), updated_at = datetime('now') WHERE id = ?`, [title, category, riskLevel, status, description, assessor, req.params.id]);

  const item = db.get('SELECT * FROM risk_assessments WHERE id = ?', [req.params.id]);
  res.json(item);
});

// Delete assessment
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const result = db.run('DELETE FROM risk_assessments WHERE id = ?', [req.params.id]);
  if (result.changes === 0) { res.status(404).json({ error: '평가를 찾을 수 없습니다' }); return; }
  res.json({ success: true });
});

// Get risk summary statistics
router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const byLevel = db.all(`SELECT risk_level, COUNT(*) as count FROM risk_assessments GROUP BY risk_level`, []);
  const byStatus = db.all(`SELECT status, COUNT(*) as count FROM risk_assessments GROUP BY status`, []);
  const total = (db.get('SELECT COUNT(*) as total FROM risk_assessments', []) as any).total;
  res.json({ total, byLevel, byStatus });
});

export default router;
