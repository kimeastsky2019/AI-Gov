export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  RISK_ASSESSMENT: "/risk-assessment",
  COMPLIANCE: "/compliance",
  AI_SERVICES: "/ai-services",
  REPORTS: "/reports",
  AI_INTELLIGENCE: "/ai-intelligence",
  SLLM_STUDIO: "/sllm-studio",
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
