import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDBHelper } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  const { status, standard, search } = req.query;
  const db = await getDBHelper();
  let sql = 'SELECT * FROM compliance_reports WHERE 1=1';
  const params: any[] = [];

  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (standard) { sql += ' AND standard LIKE ?'; params.push(`%${standard}%`); }
  if (search) { sql += ' AND (title LIKE ? OR standard LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }

  sql += ' ORDER BY created_at DESC';
  const items = db.all(sql, params);
  res.json({ items, total: items.length });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const item = db.get('SELECT * FROM compliance_reports WHERE id = ?', [req.params.id]);
  if (!item) { res.status(404).json({ error: '보고서를 찾을 수 없습니다' }); return; }
  res.json(item);
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, standard, score, findings, notes, auditor } = req.body;
  if (!title || !standard) { res.status(400).json({ error: '필수 항목을 입력하세요' }); return; }

  const db = await getDBHelper();
  const countResult = db.get('SELECT COUNT(*) as c FROM compliance_reports', []) as any;
  const id = `CR-2026-${String(countResult.c + 1).padStart(2, '0')}`;

  db.run(`INSERT INTO compliance_reports (id, title, standard, score, findings, notes, auditor) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, title, standard, score || 0, findings || 0, notes, auditor]);

  res.status(201).json(db.get('SELECT * FROM compliance_reports WHERE id = ?', [id]));
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { title, standard, status, score, findings, notes, completionDate } = req.body;
  const db = await getDBHelper();

  db.run(`UPDATE compliance_reports SET title = COALESCE(?, title), standard = COALESCE(?, standard), status = COALESCE(?, status), score = COALESCE(?, score), findings = COALESCE(?, findings), notes = COALESCE(?, notes), completion_date = COALESCE(?, completion_date), updated_at = datetime('now') WHERE id = ?`, [title, standard, status, score, findings, notes, completionDate, req.params.id]);

  res.json(db.get('SELECT * FROM compliance_reports WHERE id = ?', [req.params.id]));
});

router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const byStatus = db.all('SELECT status, COUNT(*) as count FROM compliance_reports GROUP BY status', []);
  const avgScore = db.get('SELECT AVG(score) as avg_score FROM compliance_reports WHERE score > 0', []) as any;
  const total = (db.get('SELECT COUNT(*) as total FROM compliance_reports', []) as any).total;
  res.json({ total, byStatus, avgScore: Math.round(avgScore.avg_score || 0) });
});

export default router;
