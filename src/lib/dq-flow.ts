/**
 * 데이터 품질 검증 플로우 단계 정의
 * 6단계: 계획 수립 → 프로파일링 → 이상탐지/처리 → 편향성 검증 → 최종 승인 → 지속 모니터링
 */

export const DQ_FLOW_STEP_IDS = [
  "dq-plan",
  "dq-scope",
  "dq-tools",
  "dq-profiling-schema",
  "dq-profiling-stats",
  "dq-profiling-lineage",
  "dq-anomaly-rules",
  "dq-anomaly-missing",
  "dq-anomaly-outlier",
  "dq-anomaly-dedup",
  "dq-bias-identify",
  "dq-bias-measure",
  "dq-bias-mitigate",
  "dq-bias-report",
  "dq-validation-metrics",
  "dq-validation-integrity",
  "dq-validation-privacy",
  "dq-validation-approval",
  "dq-monitor-dashboard",
  "dq-monitor-drift",
  "dq-monitor-revalidation",
] as const;

export type DqFlowStepId = (typeof DQ_FLOW_STEP_IDS)[number];

export interface DqFlowStepBranch {
  key: string;
  path: string;
  label: string;
}

export interface DqFlowStepDef {
  id: DqFlowStepId;
  path: string;
  title: string;
  description: string;
  phase: string;
  phaseColor: string;
  nextPath?: string;
  nextBranch?: DqFlowStepBranch[];
  prevPath?: string;
}

const BASE = "/tech-review/dq-flow";

export const DQ_FLOW_STEPS: Record<string, DqFlowStepDef> = {
  // ── Phase 1: 계획 수립 ──
  "dq-plan": {
    id: "dq-plan",
    path: `${BASE}/dq-plan`,
    title: "품질 검증 계획 수립",
    description: "검증 대상 데이터셋의 범위를 정의하고 품질 지표(KPI)와 목표값을 설정합니다.",
    phase: "1단계: 계획 수립",
    phaseColor: "from-blue-500 to-blue-600",
    nextPath: `${BASE}/dq-scope`,
    prevPath: "/tech-review/data-quality",
  },
  "dq-scope": {
    id: "dq-scope",
    path: `${BASE}/dq-scope`,
    title: "검증 기준 및 임계값 설정",
    description: "완전성, 정확성, 일관성, 적시성 각 지표별 임계값과 합격 기준을 정의합니다.",
    phase: "1단계: 계획 수립",
    phaseColor: "from-blue-500 to-blue-600",
    nextPath: `${BASE}/dq-tools`,
    prevPath: `${BASE}/dq-plan`,
  },
  "dq-tools": {
    id: "dq-tools",
    path: `${BASE}/dq-tools`,
    title: "검증 도구 및 파이프라인 구성",
    description: "Great Expectations, dbt, Airflow 등 검증 도구를 선정하고 자동화 파이프라인을 구성합니다.",
    phase: "1단계: 계획 수립",
    phaseColor: "from-blue-500 to-blue-600",
    nextPath: `${BASE}/dq-profiling-schema`,
    prevPath: `${BASE}/dq-scope`,
  },

  // ── Phase 2: 프로파일링 ──
  "dq-profiling-schema": {
    id: "dq-profiling-schema",
    path: `${BASE}/dq-profiling-schema`,
    title: "스키마 검증",
    description: "컬럼 타입, 제약조건, 참조 무결성 등 데이터 스키마의 정합성을 검증합니다.",
    phase: "2단계: 데이터 프로파일링",
    phaseColor: "from-indigo-500 to-indigo-600",
    nextPath: `${BASE}/dq-profiling-stats`,
    prevPath: `${BASE}/dq-tools`,
  },
  "dq-profiling-stats": {
    id: "dq-profiling-stats",
    path: `${BASE}/dq-profiling-stats`,
    title: "통계 프로파일 분석",
    description: "각 컬럼별 분포, 평균, 표준편차, 사분위수, 유일성을 분석하고 이상 패턴을 식별합니다.",
    phase: "2단계: 데이터 프로파일링",
    phaseColor: "from-indigo-500 to-indigo-600",
    nextPath: `${BASE}/dq-profiling-lineage`,
    prevPath: `${BASE}/dq-profiling-schema`,
  },
  "dq-profiling-lineage": {
    id: "dq-profiling-lineage",
    path: `${BASE}/dq-profiling-lineage`,
    title: "데이터 리니지 추적",
    description: "원천 데이터에서 학습 데이터까지의 변환 경로를 추적하고 문서화합니다.",
    phase: "2단계: 데이터 프로파일링",
    phaseColor: "from-indigo-500 to-indigo-600",
    nextPath: `${BASE}/dq-anomaly-rules`,
    prevPath: `${BASE}/dq-profiling-stats`,
  },

  // ── Phase 3: 이상 탐지/처리 ──
  "dq-anomaly-rules": {
    id: "dq-anomaly-rules",
    path: `${BASE}/dq-anomaly-rules`,
    title: "이상 탐지 규칙 실행",
    description: "사전 정의된 87개 품질 규칙을 자동 실행하고 탐지된 이상 항목을 분류합니다.",
    phase: "3단계: 이상 데이터 탐지/처리",
    phaseColor: "from-amber-500 to-amber-600",
    nextPath: `${BASE}/dq-anomaly-missing`,
    prevPath: `${BASE}/dq-profiling-lineage`,
  },
  "dq-anomaly-missing": {
    id: "dq-anomaly-missing",
    path: `${BASE}/dq-anomaly-missing`,
    title: "결측치 분석 및 처리",
    description: "결측 패턴(MCAR/MAR/MNAR)을 분류하고 대치/삭제/플래그 처리 방법을 결정합니다.",
    phase: "3단계: 이상 데이터 탐지/처리",
    phaseColor: "from-amber-500 to-amber-600",
    nextPath: `${BASE}/dq-anomaly-outlier`,
    prevPath: `${BASE}/dq-anomaly-rules`,
  },
  "dq-anomaly-outlier": {
    id: "dq-anomaly-outlier",
    path: `${BASE}/dq-anomaly-outlier`,
    title: "극값 탐지 및 중복 제거",
    description: "IQR/Z-Score 기반 극값을 탐지하고, Fuzzy Matching으로 중복 데이터를 식별/제거합니다.",
    phase: "3단계: 이상 데이터 탐지/처리",
    phaseColor: "from-amber-500 to-amber-600",
    nextPath: `${BASE}/dq-anomaly-dedup`,
    prevPath: `${BASE}/dq-anomaly-missing`,
  },
  "dq-anomaly-dedup": {
    id: "dq-anomaly-dedup",
    path: `${BASE}/dq-anomaly-dedup`,
    title: "이상 처리 결과 검증",
    description: "처리 전후 품질 지표를 비교하고 잔여 이상 현황을 문서화합니다.",
    phase: "3단계: 이상 데이터 탐지/처리",
    phaseColor: "from-amber-500 to-amber-600",
    nextPath: `${BASE}/dq-bias-identify`,
    prevPath: `${BASE}/dq-anomaly-outlier`,
  },

  // ── Phase 4: 편향성 검증 ──
  "dq-bias-identify": {
    id: "dq-bias-identify",
    path: `${BASE}/dq-bias-identify`,
    title: "보호 속성 식별 및 표현도 분석",
    description: "성별, 연령, 지역, 소득 등 보호 속성을 정의하고 데이터 내 표현도를 분석합니다.",
    phase: "4단계: 편향성 검증",
    phaseColor: "from-purple-500 to-purple-600",
    nextPath: `${BASE}/dq-bias-measure`,
    prevPath: `${BASE}/dq-anomaly-dedup`,
  },
  "dq-bias-measure": {
    id: "dq-bias-measure",
    path: `${BASE}/dq-bias-measure`,
    title: "불균형 지수 산출",
    description: "Disparate Impact(DI), Statistical Parity Difference(SPD), Equal Opportunity Difference(EOD) 등 편향 지표를 산출합니다.",
    phase: "4단계: 편향성 검증",
    phaseColor: "from-purple-500 to-purple-600",
    nextPath: `${BASE}/dq-bias-mitigate`,
    prevPath: `${BASE}/dq-bias-identify`,
  },
  "dq-bias-mitigate": {
    id: "dq-bias-mitigate",
    path: `${BASE}/dq-bias-mitigate`,
    title: "편향 완화 기법 적용",
    description: "리샘플링(SMOTE), 가중치 조정, 데이터 증강 등 편향 완화 기법을 적용합니다.",
    phase: "4단계: 편향성 검증",
    phaseColor: "from-purple-500 to-purple-600",
    nextPath: `${BASE}/dq-bias-report`,
    prevPath: `${BASE}/dq-bias-measure`,
  },
  "dq-bias-report": {
    id: "dq-bias-report",
    path: `${BASE}/dq-bias-report`,
    title: "편향성 검증 보고서 작성",
    description: "완화 전후 지표를 비교 분석하고 공정성 인증 보고서를 작성합니다.",
    phase: "4단계: 편향성 검증",
    phaseColor: "from-purple-500 to-purple-600",
    nextPath: `${BASE}/dq-validation-metrics`,
    prevPath: `${BASE}/dq-bias-mitigate`,
  },

  // ── Phase 5: 최종 검증 및 승인 ──
  "dq-validation-metrics": {
    id: "dq-validation-metrics",
    path: `${BASE}/dq-validation-metrics`,
    title: "4대 품질 지표 종합 검증",
    description: "완전성, 정확성, 일관성, 적시성 목표 달성 여부를 최종 확인합니다.",
    phase: "5단계: 최종 검증 및 승인",
    phaseColor: "from-emerald-500 to-emerald-600",
    nextPath: `${BASE}/dq-validation-integrity`,
    prevPath: `${BASE}/dq-bias-report`,
  },
  "dq-validation-integrity": {
    id: "dq-validation-integrity",
    path: `${BASE}/dq-validation-integrity`,
    title: "무결성 및 비식별화 검증",
    description: "SHA-256 해시 기반 무결성 검증과 K-익명성, L-다양성 기반 비식별화 적정성을 확인합니다.",
    phase: "5단계: 최종 검증 및 승인",
    phaseColor: "from-emerald-500 to-emerald-600",
    nextPath: `${BASE}/dq-validation-privacy`,
    prevPath: `${BASE}/dq-validation-metrics`,
  },
  "dq-validation-privacy": {
    id: "dq-validation-privacy",
    path: `${BASE}/dq-validation-privacy`,
    title: "품질 검증 종합 보고서",
    description: "전 단계 검증 결과를 종합하고 잔여 위험과 조건부 승인 사항을 문서화합니다.",
    phase: "5단계: 최종 검증 및 승인",
    phaseColor: "from-emerald-500 to-emerald-600",
    nextPath: `${BASE}/dq-validation-approval`,
    prevPath: `${BASE}/dq-validation-integrity`,
  },
  "dq-validation-approval": {
    id: "dq-validation-approval",
    path: `${BASE}/dq-validation-approval`,
    title: "데이터 품질 위원회 최종 승인",
    description: "데이터 품질 위원회가 종합 보고서를 심의하고 학습 데이터 사용을 최종 승인합니다.",
    phase: "5단계: 최종 검증 및 승인",
    phaseColor: "from-emerald-500 to-emerald-600",
    nextPath: `${BASE}/dq-monitor-dashboard`,
    prevPath: `${BASE}/dq-validation-privacy`,
  },

  // ── Phase 6: 지속 모니터링 ──
  "dq-monitor-dashboard": {
    id: "dq-monitor-dashboard",
    path: `${BASE}/dq-monitor-dashboard`,
    title: "실시간 품질 모니터링 대시보드",
    description: "운영 중 데이터 품질 지표를 실시간으로 모니터링하고 알림 체계를 구축합니다.",
    phase: "6단계: 지속 모니터링",
    phaseColor: "from-rose-500 to-rose-600",
    nextPath: `${BASE}/dq-monitor-drift`,
    prevPath: `${BASE}/dq-validation-approval`,
  },
  "dq-monitor-drift": {
    id: "dq-monitor-drift",
    path: `${BASE}/dq-monitor-drift`,
    title: "데이터 드리프트 감지",
    description: "PSI, KL Divergence 기반 분포 변화를 감지하고 재학습 필요 여부를 판단합니다.",
    phase: "6단계: 지속 모니터링",
    phaseColor: "from-rose-500 to-rose-600",
    nextPath: `${BASE}/dq-monitor-revalidation`,
    prevPath: `${BASE}/dq-monitor-dashboard`,
  },
  "dq-monitor-revalidation": {
    id: "dq-monitor-revalidation",
    path: `${BASE}/dq-monitor-revalidation`,
    title: "정기 재검증 및 근본 원인 분석",
    description: "월간/분기별 품질 재검증을 수행하고, 이슈 발생 시 RCA를 통해 근본 원인을 파악합니다.",
    phase: "6단계: 지속 모니터링",
    phaseColor: "from-rose-500 to-rose-600",
    nextPath: undefined,
    prevPath: `${BASE}/dq-monitor-drift`,
  },
};

/** 6단계 여정 스텝 */
export const DQ_JOURNEY_STEPS = [
  { id: "plan", title: "계획 수립", steps: ["dq-plan", "dq-scope", "dq-tools"] },
  { id: "profile", title: "프로파일링", steps: ["dq-profiling-schema", "dq-profiling-stats", "dq-profiling-lineage"] },
  { id: "anomaly", title: "이상 탐지", steps: ["dq-anomaly-rules", "dq-anomaly-missing", "dq-anomaly-outlier", "dq-anomaly-dedup"] },
  { id: "bias", title: "편향 검증", steps: ["dq-bias-identify", "dq-bias-measure", "dq-bias-mitigate", "dq-bias-report"] },
  { id: "validate", title: "최종 승인", steps: ["dq-validation-metrics", "dq-validation-integrity", "dq-validation-privacy", "dq-validation-approval"] },
  { id: "monitor", title: "모니터링", steps: ["dq-monitor-dashboard", "dq-monitor-drift", "dq-monitor-revalidation"] },
];

export function getDqJourneyIndex(stepId: string): number {
  for (let i = 0; i < DQ_JOURNEY_STEPS.length; i++) {
    if (DQ_JOURNEY_STEPS[i].steps.includes(stepId)) return i;
  }
  return 0;
}

export function getDqFlowStepById(stepId: string): DqFlowStepDef | undefined {
  return DQ_FLOW_STEPS[stepId];
}
