import { Router } from 'express';
import type { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDBHelper } from '../config/database.js';

const router = Router();

// Get dashboard overview data
router.get('/overview', async (req: Request, res: Response) => {
  const db = await getDBHelper();

  const totalServices = (db.get('SELECT COUNT(*) as c FROM ai_services', []) as any).c;
  const activeServices = (db.get("SELECT COUNT(*) as c FROM ai_services WHERE status = 'ACTIVE'", []) as any).c;
  const highRiskSystems = (db.get("SELECT COUNT(*) as c FROM risk_assessments WHERE risk_level IN ('HIGH', 'UNACCEPTABLE')", []) as any).c;
  const completedAssessments = (db.get("SELECT COUNT(*) as c FROM risk_assessments WHERE status = 'COMPLETED'", []) as any).c;
  const totalAssessments = (db.get('SELECT COUNT(*) as c FROM risk_assessments', []) as any).c;
  const avgCompliance = db.get('SELECT AVG(compliance_level) as avg FROM ai_services WHERE compliance_level > 0', []) as any;
  const complianceRate = Math.round(avgCompliance.avg || 0);
  const inProgressAssessments = (db.get("SELECT COUNT(*) as c FROM risk_assessments WHERE status = 'IN_PROGRESS'", []) as any).c;

  const metrics = [
    { title: '전체 AI 서비스', value: totalServices, change: `활성 ${activeServices}`, trend: 'up' as const },
    { title: '고위험 시스템', value: highRiskSystems, change: `전체 ${totalAssessments}건`, trend: highRiskSystems > 3 ? 'up' as const : 'down' as const },
    { title: '컴플라이언스 준수율', value: `${complianceRate}%`, change: `완료 ${completedAssessments}건`, trend: complianceRate >= 80 ? 'up' as const : 'down' as const },
    { title: '진행 중인 위험 평가', value: inProgressAssessments, change: `대기 포함`, trend: 'neutral' as const },
  ];

  const recentAssessments = db.all('SELECT * FROM risk_assessments ORDER BY updated_at DESC LIMIT 5', []);
  const recentCompliance = db.all('SELECT * FROM compliance_reports ORDER BY created_at DESC LIMIT 5', []);
  const topRiskServices = db.all('SELECT * FROM ai_services WHERE risk_score > 30 ORDER BY risk_score DESC LIMIT 5', []);

  res.json({ metrics, recentAssessments, recentCompliance, topRiskServices });
});

// Get security overview (Cyber Shield data)
router.get('/security', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const events = db.all('SELECT * FROM security_events ORDER BY created_at DESC LIMIT 20', []);
  const bySeverity = db.all('SELECT severity, COUNT(*) as count FROM security_events GROUP BY severity', []);
  const openEvents = (db.get("SELECT COUNT(*) as c FROM security_events WHERE status = 'open'", []) as any).c;

  res.json({
    securityScore: 82,
    events,
    bySeverity,
    openEvents,
    threatCategories: [
      { name: 'Prompt Injection', severity: 'critical', count: 3 },
      { name: 'Data Poisoning', severity: 'high', count: 5 },
      { name: 'Model Security', severity: 'medium', count: 8 },
      { name: 'API Security', severity: 'high', count: 4 },
    ],
    coverage: 98,
  });
});

// Get risk items
router.get('/risk-items', async (req: Request, res: Response) => {
  const db = await getDBHelper();
  const items = db.all('SELECT * FROM risk_items ORDER BY code ASC', []);
  res.json({ items, total: items.length });
});

// Contact inquiry submission (public)
router.post('/contact', async (req: Request, res: Response) => {
  const { name, company, email, phone, product, requestType, message } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: '필수 항목을 입력하세요' }); return;
  }

  const db = await getDBHelper();
  const id = `INQ-${uuidv4().slice(0, 8)}`;
  db.run(`INSERT INTO contact_inquiries (id, name, company, email, phone, product, request_type, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [id, name, company, email, phone, product, requestType, message]);

  res.status(201).json({ success: true, message: '상담/데모 요청이 접수되었습니다. 곧 연락드리겠습니다.', id });
});

export default router;
