/**
 * AI 거버넌스 서비스 생애주기 플로우 단계 정의
 * 요청서 → 사전검토 요청 → 위험성 평가 → 개발계획 → 위험관리 계획
 * → (위험등급 분기) → 승인 → 개발 의뢰 → 개발 진행 → 운영 전 검증
 * → (검증 분기) → 운영 승인 → 배포 승인 → 배포 → 대시보드 → 개선관리
 */

export const GOV_FLOW_STEP_IDS = [
  "request-form",
  "pre-review-request",
  "risk-assessment",
  "dev-plan",
  "risk-plan",
  "risk-level-judge",
  "risk-plan-approval",
  "governance-approval",
  "dev-request",
  "dev-progress",
  "pre-op-verification",
  "verification-branch",
  "verification-adequacy",
  "third-party-verification",
  "op-approval-request",
  "deployment-approval",
  "deployment",
  "dashboard",
  "improvement",
] as const;

export type GovFlowStepId = (typeof GOV_FLOW_STEP_IDS)[number];

export interface GovFlowStepBranch {
  key: string;
  path: string;
  label: string;
}

export interface GovFlowStepDef {
  id: GovFlowStepId;
  path: string;
  title: string;
  description: string;
  nextPath?: string;
  nextBranch?: GovFlowStepBranch[];
  prevPath?: string;
  prevPaths?: string[];
}

export const GOV_FLOW_STEPS: Record<string, GovFlowStepDef> = {
  "request-form": {
    id: "request-form",
    path: "/governance/flow/request-form",
    title: "AI 서비스 요청서 작성",
    description: "AI 서비스 도입을 위한 요청서를 작성합니다. 서비스 목적, 대상, 예상 영향 등을 기술합니다.",
    nextPath: "/governance/flow/pre-review-request",
    prevPath: "/governance/services",
  },
  "pre-review-request": {
    id: "pre-review-request",
    path: "/governance/flow/pre-review-request",
    title: "사전검토 요청",
    description: "AI 서비스 기획서 및 모델설명서에 대한 사전 기술 검토를 요청합니다.",
    nextPath: "/governance/flow/risk-assessment",
    prevPath: "/governance/flow/request-form",
  },
  "risk-assessment": {
    id: "risk-assessment",
    path: "/governance/flow/risk-assessment",
    title: "위험성 평가",
    description: "AI 서비스의 위험 요소를 식별하고 정량적/정성적 평가를 수행합니다.",
    nextPath: "/governance/flow/dev-plan",
    prevPath: "/governance/flow/pre-review-request",
  },
  "dev-plan": {
    id: "dev-plan",
    path: "/governance/flow/dev-plan",
    title: "개발 계획 수립",
    description: "AI 모델 개발을 위한 상세 계획을 수립합니다. 일정, 자원, 기술 스택 등을 정의합니다.",
    nextPath: "/governance/flow/risk-plan",
    prevPath: "/governance/flow/risk-assessment",
  },
  "risk-plan": {
    id: "risk-plan",
    path: "/governance/flow/risk-plan",
    title: "위험관리 계획",
    description: "식별된 위험에 대한 관리 및 완화 계획을 수립합니다.",
    nextPath: "/governance/flow/risk-level-judge",
    prevPath: "/governance/flow/dev-plan",
  },
  "risk-level-judge": {
    id: "risk-level-judge",
    path: "/governance/flow/risk-level-judge",
    title: "위험등급 판정",
    description: "평가 결과에 따른 위험등급을 확정하고, 등급에 따른 다음 절차를 결정합니다.",
    nextBranch: [
      { key: "low_medium", path: "/governance/flow/risk-plan-approval", label: "저/중위험 → 위험관리 승인" },
      { key: "high", path: "/governance/flow/governance-approval", label: "고위험 → 거버넌스 위원회 승인" },
    ],
    prevPath: "/governance/flow/risk-plan",
  },
  "risk-plan-approval": {
    id: "risk-plan-approval",
    path: "/governance/flow/risk-plan-approval",
    title: "위험관리 계획 승인",
    description: "저/중위험 서비스의 위험관리 계획에 대한 승인을 진행합니다.",
    nextPath: "/governance/flow/dev-request",
    prevPath: "/governance/flow/risk-level-judge",
  },
  "governance-approval": {
    id: "governance-approval",
    path: "/governance/flow/governance-approval",
    title: "거버넌스 위원회 승인",
    description: "고위험 서비스에 대한 AI 거버넌스 위원회의 심의 및 승인을 진행합니다.",
    nextPath: "/governance/flow/dev-request",
    prevPath: "/governance/flow/risk-level-judge",
  },
  "dev-request": {
    id: "dev-request",
    path: "/governance/flow/dev-request",
    title: "개발 의뢰",
    description: "승인된 계획에 따라 AI 개발팀에 공식 개발을 의뢰합니다.",
    nextPath: "/governance/flow/dev-progress",
    prevPaths: ["/governance/flow/risk-plan-approval", "/governance/flow/governance-approval"],
  },
  "dev-progress": {
    id: "dev-progress",
    path: "/governance/flow/dev-progress",
    title: "개발 진행 관리",
    description: "AI 모델 개발 진행 상황을 추적하고 품질 기준 충족 여부를 확인합니다.",
    nextPath: "/governance/flow/pre-op-verification",
    prevPath: "/governance/flow/dev-request",
  },
  "pre-op-verification": {
    id: "pre-op-verification",
    path: "/governance/flow/pre-op-verification",
    title: "운영 전 검증",
    description: "운영 환경 배포 전 성능, 보안, 공정성 등 종합 검증을 수행합니다.",
    nextPath: "/governance/flow/verification-branch",
    prevPath: "/governance/flow/dev-progress",
  },
  "verification-branch": {
    id: "verification-branch",
    path: "/governance/flow/verification-branch",
    title: "검증 수준 판정",
    description: "위험등급에 따라 내부 적합성 검증 또는 제3자 독립 검증을 결정합니다.",
    nextBranch: [
      { key: "medium", path: "/governance/flow/verification-adequacy", label: "중위험 → 내부 적합성 검증" },
      { key: "high", path: "/governance/flow/third-party-verification", label: "고위험 → 제3자 독립 검증" },
    ],
    prevPath: "/governance/flow/pre-op-verification",
  },
  "verification-adequacy": {
    id: "verification-adequacy",
    path: "/governance/flow/verification-adequacy",
    title: "내부 적합성 검증",
    description: "내부 검증팀이 AI 서비스의 적합성, 성능, 보안을 검증합니다.",
    nextPath: "/governance/flow/op-approval-request",
    prevPath: "/governance/flow/verification-branch",
  },
  "third-party-verification": {
    id: "third-party-verification",
    path: "/governance/flow/third-party-verification",
    title: "제3자 독립 검증",
    description: "외부 전문기관이 AI 서비스의 공정성, 안전성, 규제 준수를 독립 검증합니다.",
    nextPath: "/governance/flow/op-approval-request",
    prevPath: "/governance/flow/verification-branch",
  },
  "op-approval-request": {
    id: "op-approval-request",
    path: "/governance/flow/op-approval-request",
    title: "운영 승인 요청",
    description: "검증 완료 후 운영 환경 배포를 위한 최종 승인을 요청합니다.",
    nextPath: "/governance/flow/deployment-approval",
    prevPaths: ["/governance/flow/verification-adequacy", "/governance/flow/third-party-verification"],
  },
  "deployment-approval": {
    id: "deployment-approval",
    path: "/governance/flow/deployment-approval",
    title: "배포 승인",
    description: "운영 책임자가 배포 체크리스트를 확인하고 최종 배포를 승인합니다.",
    nextPath: "/governance/flow/deployment",
    prevPath: "/governance/flow/op-approval-request",
  },
  "deployment": {
    id: "deployment",
    path: "/governance/flow/deployment",
    title: "운영 환경 배포",
    description: "승인된 AI 서비스를 운영 환경에 배포하고 모니터링을 시작합니다.",
    nextPath: "/governance/flow/dashboard",
    prevPath: "/governance/flow/deployment-approval",
  },
  "dashboard": {
    id: "dashboard",
    path: "/governance/flow/dashboard",
    title: "운영 대시보드",
    description: "배포된 AI 서비스의 성능, 안전성, 규제 준수 현황을 실시간 모니터링합니다.",
    nextPath: "/governance/flow/improvement",
    prevPath: "/governance/flow/deployment",
  },
  "improvement": {
    id: "improvement",
    path: "/governance/flow/improvement",
    title: "지속적 개선 관리",
    description: "운영 데이터 분석 기반의 모델 개선, 위험 재평가, 규제 대응을 관리합니다.",
    nextPath: "/governance/flow/dashboard",
    prevPath: "/governance/flow/dashboard",
  },
};

/** 5단계 여정 스텝 정의 */
export const GOV_JOURNEY_STEPS = [
  { id: "planning", title: "기획/요청" },
  { id: "assessment", title: "위험성 평가" },
  { id: "development", title: "개발/검증" },
  { id: "deployment", title: "배포/승인" },
  { id: "operations", title: "운영/개선" },
];

/** stepId → 여정 인덱스 매핑 */
export function getGovJourneyIndex(flowStepId: string): number {
  if (flowStepId === "request-form" || flowStepId === "pre-review-request") return 0;
  if (["risk-assessment", "dev-plan", "risk-plan", "risk-level-judge"].some(s => flowStepId.includes(s))) return 1;
  if (["risk-plan-approval", "governance-approval", "dev-request", "dev-progress", "pre-op-verification", "verification"].some(s => flowStepId.includes(s))) return 2;
  if (["op-approval", "deployment-approval", "deployment"].some(s => flowStepId.includes(s))) return 3;
  if (flowStepId === "dashboard" || flowStepId === "improvement") return 4;
  return 0;
}

export function getGovFlowStepById(stepId: string): GovFlowStepDef | undefined {
  return GOV_FLOW_STEPS[stepId];
}

export function getGovPrevPath(step: GovFlowStepDef): string | undefined {
  if (step.prevPath) return step.prevPath;
  if (step.prevPaths && step.prevPaths.length) return step.prevPaths[0];
  return undefined;
}
