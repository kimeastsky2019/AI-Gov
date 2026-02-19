import { Router } from 'express';
import type { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDBHelper } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: AuthRequest, res: Response) => {
  const { status, category, search } = req.query;
  const db = await getDBHelper();
  let sql = 'SELECT * FROM ai_services WHERE 1=1';
  const params: any[] = [];

  if (status) { sql += ' AND status = ?'; params.push(status); }
  if (category) { sql += ' AND category = ?'; params.push(category); }
  if (search) { sql += ' AND (name LIKE ? OR provider LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  sql += ' ORDER BY created_at DESC';
  const items = db.all(sql, params);
  res.json({ items, total: items.length });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const item = db.get('SELECT * FROM ai_services WHERE id = ?', [req.params.id]);
  if (!item) { res.status(404).json({ error: '서비스를 찾을 수 없습니다' }); return; }
  res.json(item);
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, provider, version, description, category, deploymentType } = req.body;
  if (!name || !provider || !version) { res.status(400).json({ error: '필수 항목을 입력하세요' }); return; }

  const db = await getDBHelper();
  const countResult = db.get('SELECT COUNT(*) as c FROM ai_services', []) as any;
  const id = `SVC-${String(countResult.c + 1).padStart(3, '0')}`;

  db.run(`INSERT INTO ai_services (id, name, provider, version, description, category, deployment_type) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, name, provider, version, description, category, deploymentType]);

  res.status(201).json(db.get('SELECT * FROM ai_services WHERE id = ?', [id]));
});

router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { name, provider, version, status, riskScore, complianceLevel, description } = req.body;
  const db = await getDBHelper();

  db.run(`UPDATE ai_services SET name = COALESCE(?, name), provider = COALESCE(?, provider), version = COALESCE(?, version), status = COALESCE(?, status), risk_score = COALESCE(?, risk_score), compliance_level = COALESCE(?, compliance_level), description = COALESCE(?, description), updated_at = datetime('now') WHERE id = ?`, [name, provider, version, status, riskScore, complianceLevel, description, req.params.id]);

  res.json(db.get('SELECT * FROM ai_services WHERE id = ?', [req.params.id]));
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const result = db.run('DELETE FROM ai_services WHERE id = ?', [req.params.id]);
  if (result.changes === 0) { res.status(404).json({ error: '서비스를 찾을 수 없습니다' }); return; }
  res.json({ success: true });
});

router.get('/stats/summary', async (req: AuthRequest, res: Response) => {
  const db = await getDBHelper();
  const byStatus = db.all('SELECT status, COUNT(*) as count FROM ai_services GROUP BY status', []);
  const avgRisk = db.get('SELECT AVG(risk_score) as avg FROM ai_services', []) as any;
  const avgCompliance = db.get('SELECT AVG(compliance_level) as avg FROM ai_services', []) as any;
  const total = (db.get('SELECT COUNT(*) as total FROM ai_services', []) as any).total;
  res.json({ total, byStatus, avgRiskScore: Math.round(avgRisk.avg || 0), avgCompliance: Math.round(avgCompliance.avg || 0) });
});

export default router;
