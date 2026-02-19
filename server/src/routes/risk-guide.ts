/**
 * AI 위험등급평가 가이드 Routes
 * Excel 기반 32개 평가 문항, 4대 원칙, 위험 등급 기준 데이터 제공
 * + Grok AI 자동 검토 기능
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { chatCompletion, type ChatMessage } from '../services/grok.js';
import { getDBHelper } from '../config/database.js';
import crypto from 'crypto';

const router = Router();

// ========== 평가 가이드 기준 데이터 (Excel 기반) ==========

interface RiskQuestion {
  no: number;
  lv1: string;        // 대분류 (Level 1) - 원칙
  lv2: string;        // 중분류 (Level 2)
  lv3: string;        // 소분류 (Level 3) - 구체적 위험
  score: number;       // 배점
  reviewer: string;    // 검토 담당
  criteria: string;    // 세부 평가기준
  mitigation: string;  // 경감방안 예시
}

const RISK_QUESTIONS: RiskQuestion[] = [
  // 합법성 원칙 (6문항, 20점)
  { no: 1, lv1: '합법성 원칙', lv2: '금융소비자보호법 위반 가능성', lv3: '고지 의무 위반', score: 4, reviewer: 'AI 서비스기획',
    criteria: '6대 영업행위 규제, 차별금지 원칙 등 소보법 위반 가능성 - 적합성/적정성 원칙, 설명의무/부당권유행위 금지 원칙, 불공정 영업행위 금지 원칙/상품 광고 규제',
    mitigation: '기획 단계에서 AI 활용 서비스의 고지의무 및 설명의무 대상을 사전에 식별하여, 관련 법 및 하위규정을 준수하여 AI 서비스 및 시스템이 개발되고 운영될 수 있도록 함' },
  { no: 2, lv1: '합법성 원칙', lv2: '금융소비자보호법 위반 가능성', lv3: '설명 의무/부당권유행위 위반', score: 4, reviewer: 'AI 서비스기획',
    criteria: '추천 및 권유 과정에서 중요 사항에 대해 정확히 설명하고 잘못된 정보를 제공하지 않아야 함',
    mitigation: '기획 단계에서 AI 활용 서비스의 고지의무 및 설명의무 대상을 사전에 식별' },
  { no: 3, lv1: '합법성 원칙', lv2: 'AI기본법 위반 가능성', lv3: 'AI 기본법 위반', score: 4, reviewer: 'AI 서비스기획',
    criteria: 'AI 기본법 위반 가능성 : AI 기본법을 위반하지 않아야 함',
    mitigation: '기획 단계에서 AI 기본법의 주요 의무 및 요구사항을 확인하여, 관련 법 및 하위규정을 준수하여 AI 서비스 및 시스템이 개발되고 운영될 수 있도록 함' },
  { no: 4, lv1: '합법성 원칙', lv2: '데이터 관련법 위반 가능성', lv3: '민감 정보 추출/재식별', score: 2, reviewer: 'AI 서비스기획',
    criteria: '개보법, 신정법 등 데이터 관련 법 위반 가능성 : 정보주체로부터 동의받지 않은 목적을 위해 개인정보를 모델 훈련에 사용하거나 기타 데이터 사용/이동/판매에 관한 법률을 위반하지 않아야 함',
    mitigation: '기획 단계에서 AI 활용 서비스가 적용받는 데이터 관련법을 사전에 검토하고, 이를 준수하여 AI 서비스 및 시스템이 개발되고 운영될 수 있도록 함' },
  { no: 5, lv1: '합법성 원칙', lv2: '데이터 관련법 위반 가능성', lv3: '개인정보의 부적절한 처리', score: 2, reviewer: 'AI 서비스기획',
    criteria: '개인정보 처리 전 과정에서 체크리스트를 통해 위험요인을 제거하고 리스크 관리 방안을 마련',
    mitigation: '개인정보 처리 전 과정 수행 시 체크리스트를 통해 사전에 위험요인을 제거하고 리스크 관리 방안을 마련함' },
  { no: 6, lv1: '합법성 원칙', lv2: '개별 업권법 위반 가능성', lv3: '금융관련 법 위반', score: 4, reviewer: 'AI 서비스기획',
    criteria: '금융관련 법 위반 가능성 : AI 상품·서비스를 출시 및 운용하는 과정에서 기타 개별 금융업권 법률을 위반하지 않아야 함',
    mitigation: '기획 단계에서 AI 활용 서비스가 적용받는 개별 금융관련 법령을 사전에 검토하고, 이를 준수하여 AI 서비스 및 시스템이 개발되고 운영될 수 있도록 함' },
  // 신뢰성 원칙 (11문항, 30점)
  { no: 7, lv1: '신뢰성 원칙', lv2: '품질', lv3: '데이터 불충분성', score: 2, reviewer: 'AI 개발',
    criteria: '데이터 정확성 부족 및 관리 소홀 등으로 인해 발생가능한 위험 - 모델 훈련 과정에 사용되는 데이터가 사실을 정확히 반영하지 못하거나 동일 항목이 일관되지 않게 기록될 위험',
    mitigation: '출처 및 데이터 소스를 분석하여 위험을 파악하고 데이터 수집 또는 라벨링 프로세스 검토를 수행함' },
  { no: 8, lv1: '신뢰성 원칙', lv2: '품질', lv3: '데이터 정확성 부족', score: 2, reviewer: 'AI 개발',
    criteria: '모델 훈련에 사용되는 데이터의 정확성 부족으로 인한 위험',
    mitigation: '학습모델, 데이터 구조 및 구축 방법 변경, 통제 프로세스를 수립하여 데이터 품질을 관리함' },
  { no: 9, lv1: '신뢰성 원칙', lv2: '품질', lv3: '학습 데이터 오염/손실', score: 2, reviewer: 'AI 개발',
    criteria: '모델 훈련에 사용된 데이터가 관리 소홀, 사고 등으로 유실, 변경 또는 손상되어 모델이 작동 불가능할 위험',
    mitigation: '데이터 백업 및 복구 절차 수립, 데이터 품질 관리 가이드라인 적용' },
  { no: 10, lv1: '신뢰성 원칙', lv2: '편향성', lv3: '데이터 편향성', score: 6, reviewer: 'AI 개발',
    criteria: '데이터 편향(표본 편향, 사회적 편향 등)으로 인해 발생가능한 위험 - 모델 훈련 과정에 사용되는 데이터가 전체 고객이나 상황을 대표하지 못할 때 발생할 수 있는 표본 편향',
    mitigation: '모델 학습 전, 중, 후에 편향 완화 기법(가중치 재지정, 라벨링 재지정, 변수 블라인딩 등)을 적용함' },
  { no: 11, lv1: '신뢰성 원칙', lv2: '공정성', lv3: '공정성 위반', score: 6, reviewer: 'AI 개발',
    criteria: '공정성 위반 위험 : 모델의 구조나 알고리즘의 특성에 따라 특정 데이터 또는 입력값에 대해 편향된 결과를 산출하는 위험',
    mitigation: 'AI 모델의 구조, 알고리즘의 특성에 대한 정확한 이해를 바탕으로 데이터 또는 입력값에 대한 결과를 비교하여 편향 여부를 확인' },
  { no: 12, lv1: '신뢰성 원칙', lv2: '설명가능성', lv3: '설명 가능성/투명성 부족', score: 6, reviewer: 'AI 서비스기획',
    criteria: '투명성 부족 위험 : 모델이 내리는 의사결정의 원인과 과정이 명확하지 않아 고객의 요청에도 설명하기 어려운 위험',
    mitigation: '설명가능한 AI 기법을 적용하고 모형의 해석 가능성 등을 점검함, XAI 기술(SHAP, LIME, ICE/PDP 등)을 검토·적용함' },
  { no: 13, lv1: '신뢰성 원칙', lv2: '성능', lv3: '모델 과대/과소 적합 위험', score: 1, reviewer: 'AI 개발',
    criteria: '모델 성능 관련 위험 : 모델의 학습된 데이터에 대한 과대/과소적합 문제',
    mitigation: 'AI 모델의 성능을 측정하고 과대적합/과소적합을 방지하기 위한 검증 절차(홀드아웃 검증, K폴드 검증 등)를 수행함' },
  { no: 14, lv1: '신뢰성 원칙', lv2: '성능', lv3: '모델 드리프트 위험', score: 1, reviewer: 'AI 개발',
    criteria: '시간 경과에 따른 모델 성능 저하 위험',
    mitigation: '모델 성능 모니터링 시스템 구축 및 드리프트 감지 메커니즘 적용' },
  { no: 15, lv1: '신뢰성 원칙', lv2: '성능', lv3: '모델 붕괴 (Model Collapse)', score: 1, reviewer: 'AI 개발',
    criteria: '모델 붕괴 위험 : AI가 생성한 데이터로 재학습 시 발생하는 품질 저하',
    mitigation: '합성 데이터 사용 비율 관리 및 원본 데이터 확보 전략 수립' },
  { no: 16, lv1: '신뢰성 원칙', lv2: '성능', lv3: '모델 성능 지표 부적합', score: 1, reviewer: 'AI 서비스기획',
    criteria: '모델 성능 측정 지표가 비즈니스 목적에 부합하지 않는 위험',
    mitigation: '비즈니스 목적에 맞는 성능 지표 선정 및 지속적 검증' },
  { no: 17, lv1: '신뢰성 원칙', lv2: '성능', lv3: '부정확한 정보 출력 (환각)', score: 2, reviewer: 'AI 서비스기획',
    criteria: '환각 현상 발생 위험 : AI가 사실과 다른 정보를 생성하는 위험',
    mitigation: '검색 기반 생성(RAG), 인간 피드백 기반 강화 학습(RLHF), 고품질 데이터를 활용한 미세조정 등 기법 활용, 모델의 거절 능력(refusal behavior) 강화' },
  // 신의성실의 원칙 (4문항, 20점)
  { no: 18, lv1: '신의성실의 원칙', lv2: '계약 권리 침해', lv3: '의사결정 기능 오작동', score: 6, reviewer: 'AI 서비스기획',
    criteria: '거래제한/금전 손실 위험 : AI의 의사결정으로 인해 금전적 피해가 발생하거나, 고객의 금융거래 계약 조건 등에 영향을 미쳐 자유로운 권리행사를 저해하지 않아야 함',
    mitigation: 'AI의 의사결정으로 인해 금전적 피해가 발생할 가능성을 사전에 검토하고, 피해 발생 시 대응방안을 마련함' },
  { no: 19, lv1: '신의성실의 원칙', lv2: '책임 투명성', lv3: '책임소재 불명확', score: 6, reviewer: 'AI 서비스기획',
    criteria: '책임소재 불명확 위험 : 모델 기획-설계-개발-운영 등 AI 생애주기 전반에 대한 R&R이 불명확하여 분쟁이 발생하지 않아야 함',
    mitigation: 'AI 서비스 기획-설계-개발-운영 등 참여자, 이해관계자와의 책임관계를 명시한 문서를 작성하여 법적 책임에 따른 분쟁을 방지함' },
  { no: 20, lv1: '신의성실의 원칙', lv2: '소비자 보호방안', lv3: '소비자 보호방안 미확보', score: 4, reviewer: 'AI 서비스기획',
    criteria: '소비자 보호방안 미흡 : AI상품·서비스 관련 사고에 대한 구제방안 등 소비자 보호정책 미마련으로 인해 피해가 발생하지 않아야 함',
    mitigation: '소비자보호와 관련한 발생 가능한 사고를 미리 식별하고, 사고 발생 시의 소비자보호 절차 및 기준을 사전에 마련함' },
  { no: 21, lv1: '신의성실의 원칙', lv2: '소비자 보호방안', lv3: '소비자의 편의성 저하', score: 4, reviewer: 'AI 서비스기획',
    criteria: '소비자가 AI상품·서비스의 기능 및 사용 방법을 이해하기 어려워 편의성 저하로 인한 불만이 발생하지 않아야 함',
    mitigation: '사용자 경험(UX) 테스트 및 접근성 평가를 통해 소비자 편의성 확보' },
  // 보안성 원칙 (11문항, 30점)
  { no: 22, lv1: '보안성 원칙', lv2: '보안', lv3: '데이터 유출', score: 2, reviewer: 'AI 개발',
    criteria: 'AI 시스템 접근통제 실패 및 공격 등으로 발생가능한 보안 위험 - 장애, 침입, 해킹, 랜섬웨어 감염 및 접근권한 설정 오류 등으로 인해 AI 시스템이 외부에 노출되거나 침해될 위험',
    mitigation: 'FoolsGold기법, 집계 알고리즘 적용 등을 통해 모델 오염 공격을 예방함, 데이터/모델 보안 관리 수행' },
  { no: 23, lv1: '보안성 원칙', lv2: '보안', lv3: '무단 모델 추출 (Model Extraction)', score: 2, reviewer: 'AI 개발',
    criteria: '모델이 공격에 취약하여 무단 추출 공격에 의해 모델이 복제될 위험',
    mitigation: '모델 접근 제어 강화 및 API 호출 제한, 워터마킹 기법 적용' },
  { no: 24, lv1: '보안성 원칙', lv2: '보안', lv3: '사이버 범죄 지원', score: 2, reviewer: 'AI 서비스기획',
    criteria: 'AI 시스템이 사이버 범죄에 악용될 위험',
    mitigation: '악용 시나리오 사전 식별 및 차단 메커니즘 구축' },
  { no: 25, lv1: '보안성 원칙', lv2: '보안', lv3: '적대적 공격 취약성 (Evasion Attack)', score: 2, reviewer: 'AI 개발',
    criteria: '적대적 공격이나 데이터 오염 공격 등에 의해 시스템이 오작동이 발생할 위험',
    mitigation: '적대적 학습(Adversarial Training) 및 입력 검증 메커니즘 적용' },
  { no: 26, lv1: '보안성 원칙', lv2: '보안', lv3: '가짜 컨텐츠 사기 피해', score: 2, reviewer: 'AI 서비스기획',
    criteria: 'AI가 생성한 가짜 컨텐츠로 인한 사기 피해 위험',
    mitigation: 'AI 생성 컨텐츠 워터마킹 및 탐지 시스템 구축' },
  { no: 27, lv1: '보안성 원칙', lv2: '안정성', lv3: '시스템 안정성', score: 8, reviewer: 'AI 개발',
    criteria: '시스템 안정성 : 사용량 증가에 따른 부하를 견디지 못하거나, 서버 다운 시 복구 방안/대체재 부존재로 인해 문제가 발생할 위험',
    mitigation: 'AI시스템에 대한 백업 및 복구절차를 수립하고 이행함, AI서비스 또는 모델에 대한 외부 제공자와 업무 협약 등을 통해 서비스 안정성을 확보함' },
  { no: 28, lv1: '보안성 원칙', lv2: '위탁/관리', lv3: 'AI 서비스 외부 위탁', score: 3, reviewer: 'AI 서비스기획',
    criteria: '위탁 관련 운영 위험 : 과도한 외부 위탁, 특정 업체에 대한 의존도 심화 등 서비스 제공자의 문제로 인해 운영 취약점이 발생할 위험',
    mitigation: 'AI 서비스 개발 및 운영 관련자 등 이해관계자와의 명확한 책임을 명시한 문서를 작성' },
  { no: 29, lv1: '보안성 원칙', lv2: '위탁/관리', lv3: '모델 외부위탁 위험', score: 3, reviewer: 'AI 서비스기획',
    criteria: '모델 개발 및 운영의 외부 위탁으로 인한 운영 위험',
    mitigation: '외부 위탁 업체와의 SLA 및 책임 범위 명확화' },
  { no: 30, lv1: '보안성 원칙', lv2: '프라이버시', lv3: '개인 식별 정보(PII) 노출', score: 2, reviewer: 'AI 서비스기획',
    criteria: '데이터 유출, 개인정보 침해 등으로 인해 발생가능한 위험 - 모델 훈련 과정 또는 추론에 사용된 개인식별정보 등이 포함된 데이터가 외부로 유출되는 위험',
    mitigation: '사용자 민감 데이터 학습·수집 과정에서 개인정보에 대해 충분히 인지하고 자동으로 삭제 가능한 알고리즘을 적용함' },
  { no: 31, lv1: '보안성 원칙', lv2: '프라이버시', lv3: '모델 인버전 공격 (Model Inversion Attack)', score: 2, reviewer: 'AI 개발',
    criteria: '모델 인버전 공격을 통해 학습 데이터의 개인정보가 유출될 위험',
    mitigation: '차등 프라이버시(Differential Privacy) 기법 적용 및 모델 출력 제한' },
  { no: 32, lv1: '보안성 원칙', lv2: '프라이버시', lv3: '필요 이상 데이터 수집', score: 2, reviewer: 'AI 서비스기획',
    criteria: '사용자를 지나치게 감시하거나 관련 데이터를 필요 이상으로 수집하여 프라이버시를 침해할 위험',
    mitigation: '데이터 수신 당사자 간 데이터 사용 합의서를 통해 재식별화 위험을 관리함, 최소 데이터 수집 원칙 적용' },
];

// 원칙별 요약
const PRINCIPLES = [
  { name: '합법성 원칙', questions: 6, totalScore: 20 },
  { name: '신뢰성 원칙', questions: 11, totalScore: 30 },
  { name: '신의성실의 원칙', questions: 4, totalScore: 20 },
  { name: '보안성 원칙', questions: 11, totalScore: 30 },
];

// 위험 등급 구간
const RISK_LEVELS = [
  { level: '허용불가 서비스', min: 75, max: 100, color: '#dc2626' },
  { level: '고위험 서비스', min: 50, max: 74, color: '#f97316' },
  { level: '중위험 서비스', min: 25, max: 49, color: '#eab308' },
  { level: '저위험 서비스', min: 0, max: 24, color: '#22c55e' },
];

// 완화 정도
const MITIGATION_LEVELS = [
  { symbol: '○', value: 1.0, label: '완전히 완화' },
  { symbol: '△', value: 0.5, label: '완화방안 적용 후에도 잔여위험 존재' },
  { symbol: 'X', value: 0.0, label: '완화방안 적용 후에도 위험 수준 동일' },
];

// ========== API Routes ==========

// GET /api/risk-guide/questions - 전체 평가 문항 가이드
router.get('/questions', (_req: Request, res: Response) => {
  res.json({
    questions: RISK_QUESTIONS,
    principles: PRINCIPLES,
    riskLevels: RISK_LEVELS,
    mitigationLevels: MITIGATION_LEVELS,
    totalQuestions: 32,
    totalScore: 100,
  });
});

// GET /api/risk-guide/principles - 원칙별 요약
router.get('/principles', (_req: Request, res: Response) => {
  res.json({ principles: PRINCIPLES });
});

// POST /api/risk-guide/ai-review - AI 자동 검토 (Grok)
router.post('/ai-review', async (req: Request, res: Response) => {
  try {
    const { serviceName, serviceDescription, answers } = req.body;
    if (!serviceName || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'serviceName and answers are required' });
    }

    // Build prompt with all answers
    const answersBlock = answers.map((a: any) => {
      const q = RISK_QUESTIONS.find(q => q.no === a.no);
      if (!q) return '';
      return `[문항 ${q.no}] ${q.lv1} > ${q.lv2} > ${q.lv3} (배점: ${q.score}점)\n` +
        `  위험 해당 여부: ${a.identified ? 'Yes' : 'No'}\n` +
        `  사유: ${a.reason || '미작성'}\n` +
        `  평가기준: ${q.criteria}`;
    }).filter(Boolean).join('\n\n');

    const systemPrompt = `당신은 GnG Meta AI 거버넌스 플랫폼의 AI 위험등급평가 전문 검토자입니다.
금융분야 AI 위험관리 프레임워크(RMF)에 근거하여 평가를 검토합니다.

평가 대상 AI 서비스: ${serviceName}
서비스 설명: ${serviceDescription || '미제공'}

아래는 담당자가 수행한 32개 위험 식별 결과입니다. 각 항목에 대해:
1. 담당자의 위험 해당 여부 판단이 적절한지 검토
2. 사유가 충분한지 평가
3. 누락된 위험 요소가 있는지 확인
4. 종합 의견 및 권고사항 제시

반드시 한국어로 응답하세요. 각 원칙별로 구분하여 검토 의견을 제시하세요.
마지막에 종합 위험 등급 예상(허용불가/고위험/중위험/저위험)과 그 근거를 제시하세요.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `다음 AI 위험 식별 결과를 검토해 주세요:\n\n${answersBlock}` },
    ];

    const resp = await chatCompletion(messages, { max_tokens: 3000, temperature: 0.2 });
    const review = resp.choices?.[0]?.message?.content || '';

    res.json({
      review,
      usage: resp.usage,
      model: resp.model,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/risk-guide/ai-mitigation-review - 완화방안 AI 검토
router.post('/ai-mitigation-review', async (req: Request, res: Response) => {
  try {
    const { serviceName, mitigations } = req.body;
    if (!serviceName || !mitigations || !Array.isArray(mitigations)) {
      return res.status(400).json({ error: 'serviceName and mitigations are required' });
    }

    const mitigationBlock = mitigations.map((m: any) => {
      const q = RISK_QUESTIONS.find(q => q.no === m.no);
      if (!q) return '';
      return `[문항 ${q.no}] ${q.lv1} > ${q.lv3}\n` +
        `  위험 식별: ${m.identified ? 'Yes' : 'No'}\n` +
        `  완화 방안: ${m.mitigation || '미작성'}\n` +
        `  완화 정도: ${m.mitigationLevel || '미선택'}\n` +
        `  권장 경감방안: ${q.mitigation}`;
    }).filter(Boolean).join('\n\n');

    const systemPrompt = `당신은 GnG Meta AI 거버넌스 플랫폼의 AI 위험 완화방안 검토 전문가입니다.
금융분야 AI RMF에 근거하여 완화방안의 적정성을 검토합니다.

평가 대상 AI 서비스: ${serviceName}

각 문항의 완화 방안에 대해:
1. 완화 방안이 해당 위험에 적절한지 평가
2. 완화 정도(○/△/X) 판단이 적절한지 검토
3. 추가 권고 완화 방안 제시
4. 잔여 위험 수준 예상

한국어로 응답하세요.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `다음 완화방안을 검토해 주세요:\n\n${mitigationBlock}` },
    ];

    const resp = await chatCompletion(messages, { max_tokens: 3000, temperature: 0.2 });
    const review = resp.choices?.[0]?.message?.content || '';

    res.json({ review, usage: resp.usage, model: resp.model });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/risk-guide/ai-auto-assess - AI 자동 위험 평가 (서비스 설명 기반)
router.post('/ai-auto-assess', async (req: Request, res: Response) => {
  try {
    const { serviceName, serviceDescription } = req.body;
    if (!serviceName || !serviceDescription) {
      return res.status(400).json({ error: 'serviceName and serviceDescription are required' });
    }

    const questionsBlock = RISK_QUESTIONS.map(q =>
      `${q.no}. [${q.lv1}] ${q.lv2} > ${q.lv3} (배점:${q.score}) - 평가기준: ${q.criteria}`
    ).join('\n');

    const systemPrompt = `당신은 GnG Meta AI 거버넌스 플랫폼의 AI 위험 자동 평가 시스템입니다.
금융분야 AI 위험관리 프레임워크(RMF)에 근거하여 AI 서비스의 위험을 자동으로 평가합니다.

아래 32개 평가 항목에 대해, 주어진 AI 서비스 설명을 분석하여 각 항목별로:
1. 위험 해당 여부 (Yes/No)
2. 판단 사유 (2-3문장)
3. 권장 완화 방안

을 JSON 배열 형식으로 응답하세요.

응답 형식:
[
  {"no": 1, "identified": true, "reason": "...", "suggestedMitigation": "..."},
  ...
]

반드시 32개 항목 모두에 대해 응답하세요.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `AI 서비스명: ${serviceName}\n서비스 설명: ${serviceDescription}\n\n평가 항목:\n${questionsBlock}` },
    ];

    const resp = await chatCompletion(messages, { max_tokens: 4000, temperature: 0.1 });
    let content = resp.choices?.[0]?.message?.content || '';

    // Try to parse JSON from the response
    let assessments: any[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        assessments = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parse fails, return raw text
    }

    res.json({
      assessments,
      rawReview: content,
      usage: resp.usage,
      model: resp.model,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/risk-guide/save-assessment - 평가 결과 저장
router.post('/save-assessment', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { serviceName, serviceDescription, assessor, answers, mitigations, totalScore, riskLevel, aiReview } = req.body;

    const id = `assess-${crypto.randomUUID().substring(0, 8)}`;
    db.run(
      `INSERT INTO risk_assessments_v2 (id, service_name, service_description, assessor, answers, mitigations, total_score, risk_level, ai_review, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'))`,
      [id, serviceName, serviceDescription || '', assessor || '', JSON.stringify(answers || []), JSON.stringify(mitigations || []),
       totalScore || 0, riskLevel || '', aiReview || '']
    );
    db.save();

    res.status(201).json({ id, status: 'saved' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/risk-guide/assessments - 저장된 평가 목록
router.get('/assessments', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const assessments = db.all('SELECT * FROM risk_assessments_v2 ORDER BY created_at DESC');
    res.json({ items: assessments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/risk-guide/assessments/:id - 특정 평가 상세
router.get('/assessments/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const assessment = db.get('SELECT * FROM risk_assessments_v2 WHERE id = ?', [req.params.id as string]);
    if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
    res.json(assessment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
