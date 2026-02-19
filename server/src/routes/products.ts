import { Router } from 'express';
import type { Response, Request } from 'express';
import { getDBHelper } from '../config/database.js';

const router = Router();

// Public: Get all products
router.get('/', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const items = db.all('SELECT * FROM products WHERE is_active = 1 ORDER BY display_order ASC', []);
  // Parse JSON fields
  const products = (items as any[]).map(p => ({
    ...p,
    capabilities: JSON.parse(p.capabilities || '[]'),
    scenarios: JSON.parse(p.scenarios || '[]'),
    impact: JSON.parse(p.impact || '[]'),
    techStack: JSON.parse(p.tech_stack || '[]'),
  }));
  res.json({ items: products, total: products.length });
});

// Public: Get single product
router.get('/:id', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const item = db.get('SELECT * FROM products WHERE id = ?', [req.params.id]) as any;
  if (!item) { res.status(404).json({ error: '제품을 찾을 수 없습니다' }); return; }
  res.json({
    ...item,
    capabilities: JSON.parse(item.capabilities || '[]'),
    scenarios: JSON.parse(item.scenarios || '[]'),
    impact: JSON.parse(item.impact || '[]'),
    techStack: JSON.parse(item.tech_stack || '[]'),
  });
});

// Public: Get all solutions
router.get('/solutions/all', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const items = db.all('SELECT * FROM solutions WHERE is_active = 1 ORDER BY created_at ASC', []);
  const solutions = (items as any[]).map(s => ({
    ...s,
    painPoints: JSON.parse(s.pain_points || '[]'),
    offerings: JSON.parse(s.offerings || '[]'),
    products: JSON.parse(s.products || '[]'),
  }));
  res.json({ items: solutions, total: solutions.length });
});

// Public: Get single solution
router.get('/solutions/:id', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const item = db.get('SELECT * FROM solutions WHERE id = ?', [req.params.id]) as any;
  if (!item) { res.status(404).json({ error: '솔루션을 찾을 수 없습니다' }); return; }
  res.json({
    ...item,
    painPoints: JSON.parse(item.pain_points || '[]'),
    offerings: JSON.parse(item.offerings || '[]'),
    products: JSON.parse(item.products || '[]'),
  });
});

export default router;
