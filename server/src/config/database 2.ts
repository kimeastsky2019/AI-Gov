import initSqlJs from 'sql.js';
import type { Database as SqlJsDatabase } from 'sql.js';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/governance.db');

let db: SqlJsDatabase | null = null;
let SQL: any = null;

// Helper: save DB to disk periodically
function saveToDisk() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, buffer);
  }
}

async function getDatabase(): Promise<SqlJsDatabase> {
  if (db) return db;

  if (!SQL) SQL = await initSqlJs();

  // Load existing DB or create new one
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  console.log(`SQLite database connected: ${DB_PATH}`);

  // Auto-save every 30 seconds
  setInterval(saveToDisk, 30000);

  return db as SqlJsDatabase;
}

// Wrapper: synchronous-like query helpers
export class DBHelper {
  private db: SqlJsDatabase;

  constructor(database: SqlJsDatabase) {
    this.db = database;
  }

  run(sql: string, params: any[] = []): { changes: number } {
    this.db.run(sql, params);
    const changes = this.db.getRowsModified();
    return { changes };
  }

  get(sql: string, params: any[] = []): any {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      return row;
    }
    stmt.free();
    return null;
  }

  all(sql: string, params: any[] = []): any[] {
    const results: any[] = [];
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  save(): void {
    saveToDisk();
  }
}

let dbHelper: DBHelper | null = null;

export async function getDBHelper(): Promise<DBHelper> {
  if (dbHelper) return dbHelper;
  const database = await getDatabase();
  dbHelper = new DBHelper(database);
  return dbHelper;
}

export async function initializeDatabase(): Promise<void> {
  const helper = await getDBHelper();

  helper.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'viewer',
      department TEXT,
      avatar_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS ai_services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      version TEXT NOT NULL,
      status TEXT DEFAULT 'ACTIVE',
      risk_score INTEGER DEFAULT 0,
      compliance_level INTEGER DEFAULT 0,
      description TEXT,
      category TEXT,
      deployment_type TEXT,
      last_assessment_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS risk_assessments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      risk_level TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      description TEXT,
      assessor TEXT,
      ai_service_id TEXT,
      sector TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compliance_reports (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      standard TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      score INTEGER DEFAULT 0,
      findings INTEGER DEFAULT 0,
      completion_date TEXT,
      auditor TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rmf_evaluations (
      id TEXT PRIMARY KEY,
      assessment_id TEXT NOT NULL,
      principle TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      max_score INTEGER DEFAULT 100,
      items_evaluated INTEGER DEFAULT 0,
      findings TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS risk_items (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      severity INTEGER DEFAULT 1,
      sector_relevance TEXT DEFAULT '{}',
      mitigation_status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      source TEXT,
      description TEXT,
      status TEXT DEFAULT 'open',
      threat_category TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS governance_documents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      doc_type TEXT NOT NULL,
      standard TEXT,
      version TEXT DEFAULT '1.0',
      status TEXT DEFAULT 'draft',
      content TEXT,
      file_path TEXT,
      author TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS process_workflows (
      id TEXT PRIMARY KEY,
      sector TEXT NOT NULL,
      phase TEXT NOT NULL,
      step_name TEXT NOT NULL,
      step_order INTEGER NOT NULL,
      input_desc TEXT,
      output_desc TEXT,
      owner TEXT,
      sla TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      tagline TEXT,
      problem TEXT,
      capabilities TEXT DEFAULT '[]',
      scenarios TEXT DEFAULT '[]',
      impact TEXT DEFAULT '[]',
      tech_stack TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS solutions (
      id TEXT PRIMARY KEY,
      industry TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      pain_points TEXT DEFAULT '[]',
      offerings TEXT DEFAULT '[]',
      products TEXT DEFAULT '[]',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      product TEXT,
      request_type TEXT,
      message TEXT,
      status TEXT DEFAULT 'new',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  console.log('Database schema initialized successfully');
}

export async function seedDatabase(): Promise<void> {
  const helper = await getDBHelper();

  const hasData = helper.get('SELECT COUNT(*) as count FROM ai_services', []);
  if (hasData && hasData.count > 0) return;

  console.log('Seeding database with initial data...');

  // Seed AI Services
  const services = [
    ['SVC-001', 'FinanceInsight-LLM', 'Internal AI Team', 'v2.4.1', 'ACTIVE', 28, 92, '금융 대출 심사 및 투자 분석을 위한 LLM', '금융/신용', '2026-01-15'],
    ['SVC-002', 'CustomerSupport-Bot', 'OpenAI (Custom)', 'gpt-4o-2026', 'ACTIVE', 45, 85, 'LLM 기반 고객 상담 챗봇', '고객 서비스', '2026-02-10'],
    ['SVC-003', 'HR-Scanner', 'RecruitTech Inc.', 'v1.0.0', 'INACTIVE', 72, 40, '채용 이력서 자동 스크리닝', '인적자원', '2025-12-01'],
    ['SVC-004', 'Marketing-Generator', 'CreativeAI', 'v3.2.0', 'ACTIVE', 12, 98, '마케팅 콘텐츠 생성 AI', '마케팅', '2026-02-14'],
    ['SVC-005', 'Agent', 'GnG Meta', 'v1.0.0', 'ACTIVE', 15, 95, 'LLM Agent - 문서 검색, 요약, Q&A', 'AI Agent', '2026-02-01'],
    ['SVC-006', 'DAMCP', 'GnG Meta', 'v1.0.0', 'ACTIVE', 20, 90, '데이터 수집·정합·거버넌스 파이프라인', 'Data Activation', '2026-02-01'],
    ['SVC-007', 'InfoStream', 'GnG Meta', 'v1.0.0', 'ACTIVE', 18, 92, '실시간 이벤트 스트림 이상 탐지', 'Real-time Insight', '2026-02-01'],
    ['SVC-008', 'ChronoPredictor', 'GnG Meta', 'v1.0.0', 'ACTIVE', 22, 88, '다중 수평 시계열 예측', 'Forecasting', '2026-02-01'],
    ['SVC-009', 'BlazeMotion', 'GnG Meta', 'v1.0.0', 'ACTIVE', 35, 85, '실시간 비전 기반 품질/안전 모니터링', 'Vision Intelligence', '2026-02-01'],
    ['SVC-010', 'TravelMate', 'GnG Meta', 'v1.0.0', 'ACTIVE', 10, 96, 'AI 컨시어지 여행 서비스', 'AI Tour', '2026-02-01'],
  ];
  for (const s of services) {
    helper.run('INSERT INTO ai_services (id, name, provider, version, status, risk_score, compliance_level, description, category, last_assessment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', s);
  }

  // Seed Risk Assessments
  const assessments = [
    ['RA-2026-001', '금융 대출 심사 AI 알고리즘 평가', '금융/신용', 'HIGH', 'COMPLETED', '개인 대출 승인 및 한도 결정을 위한 자동화 시스템의 편향성 및 공정성 평가', '김철수 책임연구원', 'SVC-001', '2026-01-15', '2026-02-10'],
    ['RA-2026-002', '고객 응대 챗봇 서비스 안전성 검토', '고객 서비스', 'MEDIUM', 'IN_PROGRESS', 'LLM 기반 상담 챗봇의 부적절한 답변 생성 및 개인정보 유출 방지 메커니즘 검토', '이영희 선임', 'SVC-002', '2026-02-01', '2026-02-14'],
    ['RA-2026-003', '채용 이력서 자동 스크리닝 시스템', '인적자원', 'HIGH', 'PENDING', '입사 지원서 자동 분류 과정에서의 성별, 연령 차별 가능성 전수 조사', '박지민 매니저', 'SVC-003', '2026-02-12', '2026-02-12'],
    ['RA-2026-004', '사내 식당 메뉴 추천 AI', '복지/편의', 'LOW', 'COMPLETED', '직원 선호도 기반 메뉴 추천 엔진의 데이터 편중성 검토', '최동석 연구원', null, '2025-12-20', '2026-01-05'],
    ['RA-2026-005', '공공장소 실시간 안면 인식 보안 시스템', '보안/감시', 'UNACCEPTABLE', 'REJECTED', '무분별한 개인 정보 수집 및 기본권 침해 우려로 인한 배포 금지 결정', '거버넌스 위원회', null, '2026-01-10', '2026-01-25'],
  ];
  for (const a of assessments) {
    helper.run('INSERT INTO risk_assessments (id, title, category, risk_level, status, description, assessor, ai_service_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', a);
  }

  // Seed Compliance Reports
  const reports = [
    ['CR-2026-01', 'EU AI Act 대응 정기 점검 보고서', 'EU AI Act v1.2', 'COMPLETED', 94, 2, '2026-01-30'],
    ['CR-2026-02', '인공지능 윤리 가이드라인 준수 현황', 'KISA AI Ethics', 'IN_PROGRESS', 78, 12, null],
    ['CR-2026-03', '데이터 보안 및 프라이버시 영향 평가', 'ISO/IEC 42001', 'FAILED', 52, 24, '2026-02-05'],
    ['CR-2026-04', 'LLM 취약점 분석 및 레드팀 테스트', 'OWASP Top 10 for LLM', 'PENDING', 0, 0, null],
  ];
  for (const r of reports) {
    helper.run('INSERT INTO compliance_reports (id, title, standard, status, score, findings, completion_date) VALUES (?, ?, ?, ?, ?, ?, ?)', r);
  }

  // Seed Products
  const products: any[][] = [
    ['agent', 'Agent', 'LLM Agent', '문서 검색 · 요약 · Q&A — 접근 권한까지 한 번에', '기업 내 문서가 분산되어 있고, 검색·요약·질의응답 시 보안 권한을 통합 관리할 수 없다.', JSON.stringify(['RAG 기반 문서 검색·요약', '역할 기반 접근 제어 (RBAC)', '멀티턴 대화 Q&A', 'MCP 연동 워크플로우 자동화']), JSON.stringify(['사내 규정집 검색 및 요약 제공', '부서별 접근 권한에 따른 문서 필터링']), JSON.stringify(['문서 검색 시간 70% 단축', '정보 접근 사고 0건 달성']), JSON.stringify(['LangChain/LangGraph', 'Vector DB (Milvus)', 'RBAC 미들웨어']), 1],
    ['damcp', 'DAMCP', 'Data Activation', '수집 · 정합 · 거버넌스를 한 파이프라인에서', '데이터 소스가 다양하고, 수집 → 정합 → 적재 과정에서 품질과 거버넌스가 누락된다.', JSON.stringify(['이기종 소스 자동 수집', '스키마 정합 및 품질 검증', '메타데이터 자동 태깅']), JSON.stringify(['ERP/CRM 데이터 통합 파이프라인']), JSON.stringify(['데이터 정합 오류 85% 감소']), JSON.stringify(['Apache Kafka', 'Spark Streaming']), 2],
    ['infostream', 'InfoStream', 'Real-time Insight', '이벤트 스트림에서 이상 징후를 즉시 포착', '대량 이벤트 로그에서 이상 징후를 실시간으로 탐지하고 알림을 보내기 어렵다.', JSON.stringify(['실시간 스트림 이상 탐지', '자동 알림 및 에스컬레이션']), JSON.stringify(['금융 거래 이상 탐지']), JSON.stringify(['이상 탐지 정확도 95%+']), JSON.stringify(['Flink/Kafka Streams', 'Isolation Forest']), 3],
    ['chronopredictor', 'ChronoPredictor', 'Forecasting', '멀티 호라이즌 시계열 예측', '단기·중기·장기 수요를 동시에 예측하고 불확실성까지 정량화하기 어렵다.', JSON.stringify(['다중 수평 동시 예측', '확률적 불확실성 구간 제공']), JSON.stringify(['전력 수요 예측']), JSON.stringify(['예측 정확도 MAPE < 5%']), JSON.stringify(['Temporal Fusion Transformer', 'Prophet']), 4],
    ['blazemotion', 'BlazeMotion', 'Vision Intelligence', '실시간 영상 기반 품질·안전 모니터링', '제조 라인 품질 검수와 현장 안전 관리를 수작업에 의존하여 누락이 발생한다.', JSON.stringify(['실시간 비전 품질 검사', '안전 장구 착용 감지']), JSON.stringify(['제조 라인 불량 검출']), JSON.stringify(['불량률 90% 감소']), JSON.stringify(['YOLOv8/RT-DETR', 'TensorRT']), 5],
    ['travelmate', 'TravelMate', 'AI Tour Service', 'AI 컨시어지로 나만의 여행을', '여행 계획 수립에 시간이 많이 걸리고, 현지 정보를 실시간으로 얻기 어렵다.', JSON.stringify(['AI 맞춤 여행 일정 생성', '실시간 현지 정보 제공']), JSON.stringify(['개인 맞춤 해외여행 플래닝']), JSON.stringify(['여행 계획 시간 80% 단축']), JSON.stringify(['GPT-4o', 'Google Maps API']), 6],
  ];
  for (const p of products) {
    helper.run('INSERT INTO products (id, name, category, tagline, problem, capabilities, scenarios, impact, tech_stack, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p);
  }

  // Seed Solutions
  const solutions = [
    ['sol-finance', '금융', '금융 AI 솔루션', '이상거래 탐지부터 컴플라이언스까지', JSON.stringify(['FDS 오탐률 과다', '규제 보고 수작업']), JSON.stringify(['실시간 이상거래 탐지', 'AI 리스크 자동 평가']), JSON.stringify(['infostream', 'chronopredictor', 'agent'])],
    ['sol-manufacturing', '제조', '스마트 제조 솔루션', '예지정비부터 품질관리까지', JSON.stringify(['설비 고장 예측 어려움']), JSON.stringify(['설비 예지 정비', '비전 기반 품질 검사']), JSON.stringify(['blazemotion', 'chronopredictor'])],
    ['sol-public', '공공/지자체', '공공 AI 솔루션', '시민 서비스 혁신', JSON.stringify(['민원 처리 지연']), JSON.stringify(['AI 민원 상담', '통합 데이터 플랫폼']), JSON.stringify(['agent', 'damcp'])],
    ['sol-education', '교육', '교육 AI 솔루션', '맞춤형 학습 지원', JSON.stringify(['학습 수준 차이']), JSON.stringify(['적응형 학습 추천', 'AI 학습 분석']), JSON.stringify(['agent', 'chronopredictor'])],
  ];
  for (const s of solutions) {
    helper.run('INSERT INTO solutions (id, industry, title, description, pain_points, offerings, products) VALUES (?, ?, ?, ?, ?, ?, ?)', s);
  }

  // Seed Risk Items
  const riskItems = [
    ['ri-01', 'R-01', '딥페이크 악용', 'malicious_use', '허위 영상/음성 생성을 통한 사기 및 명예훼손', 3],
    ['ri-02', 'R-02', '자동화 무기', 'malicious_use', 'AI를 활용한 자율 무기 시스템 개발', 4],
    ['ri-03', 'R-03', '편향된 의사결정', 'malfunction', 'AI 모델의 학습 데이터 편향으로 인한 차별적 결과 도출', 3],
    ['ri-04', 'R-04', '환각(Hallucination)', 'malfunction', 'LLM의 사실과 다른 정보 생성 및 확산', 3],
    ['ri-05', 'R-05', '프라이버시 침해', 'systematic_risk', 'AI 시스템에 의한 대규모 개인정보 수집 및 분석', 4],
    ['ri-06', 'R-06', '프롬프트 인젝션', 'malicious_use', '악의적 입력을 통한 AI 시스템 조작', 3],
    ['ri-07', 'R-07', '데이터 포이즈닝', 'malicious_use', '학습 데이터 오염을 통한 모델 성능 저하', 3],
    ['ri-08', 'R-08', '모델 보안 취약점', 'systematic_risk', 'AI 모델의 보안 취약점을 통한 정보 유출', 3],
  ];
  for (const r of riskItems) {
    helper.run('INSERT INTO risk_items (id, code, name, category, description, severity) VALUES (?, ?, ?, ?, ?, ?)', r);
  }

  // Seed admin user
  const adminHash = bcrypt.hashSync('admin1234', 10);
  helper.run('INSERT OR IGNORE INTO users (id, email, password_hash, name, role, department) VALUES (?, ?, ?, ?, ?, ?)', ['USR-001', 'admin@gngmeta.com', adminHash, '김관리 팀장', 'admin', 'AI거버넌스팀']);

  helper.save();
  console.log('Database seeded successfully');
}

export function closeDatabase(): void {
  if (db) {
    saveToDisk();
    db.close();
    db = null;
    dbHelper = null;
    console.log('Database connection closed');
  }
}
