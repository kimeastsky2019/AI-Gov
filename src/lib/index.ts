export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // ── AI 거버넌스 필라 ──
  GOVERNANCE_DASHBOARD: "/governance/dashboard",
  RISK_MANAGEMENT: "/governance/risk-management",
  ORGANIZATION: "/governance/organization",
  SERVICE_MANAGEMENT: "/governance/services",
  GOVERNANCE_REPORTS: "/governance/reports",

  // ── AI 기술 검토 필라 ──
  DATA_QUALITY: "/tech-review/data-quality",
  MODEL_PERFORMANCE: "/tech-review/model-performance",
  FAIRNESS: "/tech-review/fairness",
  EXPLAINABILITY: "/tech-review/explainability",
  SECURITY: "/tech-review/security",
  SLLM_STUDIO: "/tech-review/sllm-studio",

  // ── AI관련 규제 검토 필라 ──
  PRIVACY: "/regulation/privacy",
  CONSUMER_PROTECTION: "/regulation/consumer-protection",
  ETHICS: "/regulation/ethics",
  COMPLIANCE_MGMT: "/regulation/compliance",
  AI_INTELLIGENCE: "/regulation/intelligence",

  // ── AI 거버넌스 플로우 ──
  GOVERNANCE_FLOW: "/governance/flow/:stepId",

  // ── 데이터 품질 검증 플로우 ──
  DQ_FLOW: "/tech-review/dq-flow/:stepId",

  // ── Legacy (리다이렉트용) ──
  DASHBOARD: "/dashboard",
  RISK_ASSESSMENT: "/risk-assessment",
  COMPLIANCE: "/compliance",
  AI_SERVICES: "/ai-services",
  REPORTS: "/reports",
} as const;

export interface RiskAssessment {
  id: string;
  title: string;
  category: string;
  riskLevel: "UNACCEPTABLE" | "HIGH" | "MEDIUM" | "LOW";
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  description: string;
  assessor: string;
}

export interface ComplianceReport {
  id: string;
  title: string;
  standard: string;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED" | "PENDING";
  completionDate: string;
  score: number;
  findings: number;
}

export const RISK_LEVELS = {
  UNACCEPTABLE: {
    label: "common.risk.unacceptable",
    color: "var(--chart-1)",
    severity: 4,
    description: "common.risk.unacceptable.desc",
  },
  HIGH: {
    label: "common.risk.high",
    color: "var(--chart-2)",
    severity: 3,
    description: "common.risk.high.desc",
  },
  MEDIUM: {
    label: "common.risk.medium",
    color: "var(--chart-3)",
    severity: 2,
    description: "common.risk.medium.desc",
  },
  LOW: {
    label: "common.risk.low",
    color: "var(--chart-4)",
    severity: 1,
    description: "common.risk.low.desc",
  },
};

export const COMPLIANCE_STATUS = {
  COMPLETED: {
    label: "common.compliance.completed",
    color: "var(--chart-4)",
  },
  IN_PROGRESS: {
    label: "common.compliance.inProgress",
    color: "var(--chart-3)",
  },
  PENDING: {
    label: "common.compliance.pending",
    color: "var(--chart-5)",
  },
  FAILED: {
    label: "common.compliance.failed",
    color: "var(--chart-1)",
  },
};

export type DashboardMetric = {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
};

export interface AIService {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED";
  riskScore: number;
  lastAssessmentDate: string;
  complianceLevel: number;
}
