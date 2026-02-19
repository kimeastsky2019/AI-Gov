import {
  RiskAssessment,
  ComplianceReport,
  DashboardMetric,
  AIService
} from "@/lib/index";

type TranslateFunc = (key: string, fallback?: string) => string;

export function createMockRiskAssessments(t: TranslateFunc): RiskAssessment[] {
  return [
    {
      id: "RA-2026-001",
      title: t('data.risk.ra001.title'),
      category: t('data.risk.ra001.category'),
      riskLevel: "HIGH",
      status: "COMPLETED",
      createdAt: "2026-01-15",
      updatedAt: "2026-02-10",
      description: t('data.risk.ra001.desc'),
      assessor: t('data.risk.ra001.assessor')
    },
    {
      id: "RA-2026-002",
      title: t('data.risk.ra002.title'),
      category: t('data.risk.ra002.category'),
      riskLevel: "MEDIUM",
      status: "IN_PROGRESS",
      createdAt: "2026-02-01",
      updatedAt: "2026-02-14",
      description: t('data.risk.ra002.desc'),
      assessor: t('data.risk.ra002.assessor')
    },
    {
      id: "RA-2026-003",
      title: t('data.risk.ra003.title'),
      category: t('data.risk.ra003.category'),
      riskLevel: "HIGH",
      status: "PENDING",
      createdAt: "2026-02-12",
      updatedAt: "2026-02-12",
      description: t('data.risk.ra003.desc'),
      assessor: t('data.risk.ra003.assessor')
    },
    {
      id: "RA-2026-004",
      title: t('data.risk.ra004.title'),
      category: t('data.risk.ra004.category'),
      riskLevel: "LOW",
      status: "COMPLETED",
      createdAt: "2025-12-20",
      updatedAt: "2026-01-05",
      description: t('data.risk.ra004.desc'),
      assessor: t('data.risk.ra004.assessor')
    },
    {
      id: "RA-2026-005",
      title: t('data.risk.ra005.title'),
      category: t('data.risk.ra005.category'),
      riskLevel: "UNACCEPTABLE",
      status: "REJECTED",
      createdAt: "2026-01-10",
      updatedAt: "2026-01-25",
      description: t('data.risk.ra005.desc'),
      assessor: t('data.risk.ra005.assessor')
    }
  ];
}

export function createMockComplianceReports(t: TranslateFunc): ComplianceReport[] {
  return [
    {
      id: "CR-2026-01",
      title: t('data.compliance.cr01.title'),
      standard: "EU AI Act v1.2",
      status: "COMPLETED",
      completionDate: "2026-01-30",
      score: 94,
      findings: 2
    },
    {
      id: "CR-2026-02",
      title: t('data.compliance.cr02.title'),
      standard: "KISA AI Ethics",
      status: "IN_PROGRESS",
      completionDate: "-",
      score: 78,
      findings: 12
    },
    {
      id: "CR-2026-03",
      title: t('data.compliance.cr03.title'),
      standard: "ISO/IEC 42001",
      status: "FAILED",
      completionDate: "2026-02-05",
      score: 52,
      findings: 24
    },
    {
      id: "CR-2026-04",
      title: t('data.compliance.cr04.title'),
      standard: "OWASP Top 10 for LLM",
      status: "PENDING",
      completionDate: "-",
      score: 0,
      findings: 0
    }
  ];
}

export function createMockDashboardMetrics(t: TranslateFunc): DashboardMetric[] {
  return [
    {
      title: t('data.dashboard.totalServices'),
      value: 24,
      change: "+3",
      trend: "up"
    },
    {
      title: t('data.dashboard.highRisk'),
      value: 5,
      change: "-1",
      trend: "down"
    },
    {
      title: t('data.dashboard.complianceRate'),
      value: "88.4%",
      change: "+2.5%",
      trend: "up"
    },
    {
      title: t('data.dashboard.inProgressAssessment'),
      value: 12,
      change: "0",
      trend: "neutral"
    }
  ];
}

export const mockAIServices: AIService[] = [
  {
    id: "SVC-001",
    name: "FinanceInsight-LLM",
    provider: "Internal AI Team",
    version: "v2.4.1",
    status: "ACTIVE",
    riskScore: 28,
    lastAssessmentDate: "2026-01-15",
    complianceLevel: 92
  },
  {
    id: "SVC-002",
    name: "CustomerSupport-Bot",
    provider: "OpenAI (Custom)",
    version: "gpt-4o-2026",
    status: "ACTIVE",
    riskScore: 45,
    lastAssessmentDate: "2026-02-10",
    complianceLevel: 85
  },
  {
    id: "SVC-003",
    name: "HR-Scanner",
    provider: "RecruitTech Inc.",
    version: "v1.0.0",
    status: "INACTIVE",
    riskScore: 72,
    lastAssessmentDate: "2025-12-01",
    complianceLevel: 40
  },
  {
    id: "SVC-004",
    name: "Marketing-Generator",
    provider: "CreativeAI",
    version: "v3.2.0",
    status: "ACTIVE",
    riskScore: 12,
    lastAssessmentDate: "2026-02-14",
    complianceLevel: 98
  }
];
