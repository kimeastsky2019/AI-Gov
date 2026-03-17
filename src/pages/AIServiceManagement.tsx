import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Plus,
  Search,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  GitBranch,
  Shield,
  FileCheck,
  Users,
  Database,
  Zap,
  Target,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Play,
  CircleDot,
  Layers,
  Workflow,
  BookOpen,
  ClipboardCheck,
  Lock,
  Gauge,
  FileText,
  ShieldCheck,
  Monitor,
  Cog,
  TestTube
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface AIService {
  id: string;
  name: string;
  category: string;
  riskLevel: "UNACCEPTABLE" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED" | "IN_DEVELOPMENT";
  createdDate: string;
  lastAuditDate: string;
  complianceScore: number;
  owner: string;
  dataSource: string;
  impactArea: string;
}

interface FinanceAIService {
  id: string;
  name: string;
  description: string;
  complianceItems: number;
  completedItems: number;
  checklist: string[];
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const AIServiceManagement: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mockServices = useMemo((): AIService[] => [
    {
      id: "SVC-001",
      name: t('gov.service.creditRisk') || "신용 위험도 평가 AI",
      category: t('gov.service.creditRiskCategory') || "신용평가",
      riskLevel: "HIGH",
      status: "ACTIVE",
      createdDate: "2024-01-15",
      lastAuditDate: "2026-02-28",
      complianceScore: 92,
      owner: t('gov.service.creditRiskOwner') || "금융팀",
      dataSource: t('gov.service.creditRiskDataSource') || "고객 신용정보",
      impactArea: t('gov.service.creditRiskImpact') || "금융거래"
    },
    {
      id: "SVC-002",
      name: t('gov.service.fraudDetection') || "부정거래 탐지 시스템",
      category: t('gov.service.fraudDetectionCategory') || "사기탐지",
      riskLevel: "MEDIUM",
      status: "ACTIVE",
      createdDate: "2023-08-20",
      lastAuditDate: "2026-03-05",
      complianceScore: 88,
      owner: t('gov.service.fraudDetectionOwner') || "보안팀",
      dataSource: t('gov.service.fraudDetectionDataSource') || "거래 데이터",
      impactArea: t('gov.service.fraudDetectionImpact') || "거래감시"
    },
    {
      id: "SVC-003",
      name: t('gov.service.churn') || "고객 이탈 예측 모델",
      category: t('gov.service.churnCategory') || "고객분석",
      riskLevel: "LOW",
      status: "ACTIVE",
      createdDate: "2024-06-10",
      lastAuditDate: "2026-01-15",
      complianceScore: 85,
      owner: t('gov.service.churnOwner') || "마케팅팀",
      dataSource: t('gov.service.churnDataSource') || "거래이력",
      impactArea: t('gov.service.churnImpact') || "마케팅"
    },
    {
      id: "SVC-004",
      name: t('gov.service.assetMgmt') || "자산운용 추천 알고리즘",
      category: t('gov.service.assetMgmtCategory') || "자산운용",
      riskLevel: "HIGH",
      status: "IN_DEVELOPMENT",
      createdDate: "2025-11-01",
      lastAuditDate: "2026-02-20",
      complianceScore: 76,
      owner: t('gov.service.assetMgmtOwner') || "운용팀",
      dataSource: t('gov.service.assetMgmtDataSource') || "시장데이터",
      impactArea: t('gov.service.assetMgmtImpact') || "투자조언"
    },
    {
      id: "SVC-005",
      name: t('gov.service.hrEval') || "직원 성과 평가 AI",
      category: t('gov.service.hrEvalCategory') || "인사관리",
      riskLevel: "MEDIUM",
      status: "ACTIVE",
      createdDate: "2024-03-15",
      lastAuditDate: "2026-02-10",
      complianceScore: 81,
      owner: t('gov.service.hrEvalOwner') || "인사팀",
      dataSource: t('gov.service.hrEvalDataSource') || "직원정보",
      impactArea: t('gov.service.hrEvalImpact') || "인사관리"
    }
  ], [t]);

  const financeAIServices = useMemo(() => [
    {
      id: "FIN-001",
      name: t('gov.finance.service1') || "1. 신용평가 AI",
      description: t('gov.finance.service1Desc') || "개인/기업 신용도를 평가하는 AI 시스템",
      complianceItems: 8,
      completedItems: 7,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-002",
      name: t('gov.finance.service2') || "2. 거래 감시 AI",
      description: t('gov.finance.service2Desc') || "부정거래 탐지 및 돈세탁 감시 시스템",
      complianceItems: 8,
      completedItems: 8,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-003",
      name: t('gov.finance.service3') || "3. 투자조언 AI",
      description: t('gov.finance.service3Desc') || "고객 맞춤형 투자상품 추천 시스템",
      complianceItems: 8,
      completedItems: 6,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-004",
      name: t('gov.finance.service4') || "4. 고객분류 AI",
      description: t('gov.finance.service4Desc') || "고객 세분화 및 위험도 분류 시스템",
      complianceItems: 8,
      completedItems: 7,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-005",
      name: t('gov.finance.service5') || "5. 위험도 평가 AI",
      description: t('gov.finance.service5Desc') || "포트폴리오 및 상품 위험도 평가 시스템",
      complianceItems: 8,
      completedItems: 5,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    }
  ], [t]);

  // Process Development State
  const [activePhase, setActivePhase] = useState<number>(0);
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);

  // AI Service Lifecycle Flow - GnG CyberGuide 프로세스설계서 기반
  const lifecyclePhases = useMemo(() => [
    {
      id: "planning",
      phase: "1단계: 기획 및 요구분석",
      icon: Target,
      color: "from-blue-500 to-blue-600",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      status: "완료",
      progress: 100,
      gate: "기획 게이트",
      gateDesc: "AI 서비스 필요성 및 타당성 검토 승인",
      steps: [
        { name: "비즈니스 요구사항 정의", status: "completed", owner: "사업부서", duration: "2주" },
        { name: "AI 적용 타당성 분석", status: "completed", owner: "AI CoE", duration: "1주" },
        { name: "위험등급 사전분류 (UNACCEPTABLE/HIGH/MEDIUM/LOW)", status: "completed", owner: "리스크관리팀", duration: "1주" },
        { name: "데이터 가용성 및 품질 사전평가", status: "completed", owner: "데이터팀", duration: "1주" },
        { name: "규제 영향 사전검토 (EU AI Act, 금융감독원 가이드)", status: "completed", owner: "컴플라이언스팀", duration: "1주" },
        { name: "윤리 영향 사전평가", status: "completed", owner: "AI 윤리위원회", duration: "3일" },
      ],
      deliverables: ["AI 서비스 기획서", "위험등급 사전분류 보고서", "데이터 사전평가서", "규제 영향 검토서"],
      approvers: ["AI 거버넌스 위원회", "사업부서장"]
    },
    {
      id: "process-design",
      phase: "2단계: 프로세스 설계",
      icon: Workflow,
      color: "from-indigo-500 to-indigo-600",
      borderColor: "border-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      status: "완료",
      progress: 100,
      gate: "설계 게이트",
      gateDesc: "프로세스 설계 적정성 및 보안 요건 충족 검토",
      steps: [
        { name: "AI 파이프라인 아키텍처 설계", status: "completed", owner: "AI 아키텍트", duration: "2주" },
        { name: "데이터 수집/전처리 프로세스 정의", status: "completed", owner: "데이터 엔지니어", duration: "1주" },
        { name: "모델 학습/검증 워크플로우 설계", status: "completed", owner: "ML 엔지니어", duration: "2주" },
        { name: "보안 위협 모델링 (STRIDE/DREAD)", status: "completed", owner: "보안팀", duration: "1주" },
        { name: "개인정보 처리 프로세스 설계 (PIA)", status: "completed", owner: "DPO", duration: "1주" },
        { name: "모니터링/알림 프로세스 설계", status: "completed", owner: "운영팀", duration: "1주" },
      ],
      deliverables: ["프로세스 설계서(GnG CyberGuide)", "보안 위협 모델링 결과", "PIA 보고서", "모니터링 설계서"],
      approvers: ["CTO", "CISO", "DPO"]
    },
    {
      id: "development",
      phase: "3단계: 프로세스 개발",
      icon: Cog,
      color: "from-purple-500 to-purple-600",
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      status: "진행 중",
      progress: 65,
      gate: "개발 게이트",
      gateDesc: "개발 완성도 및 품질 기준 충족 여부 검토",
      steps: [
        { name: "데이터 파이프라인 구축", status: "completed", owner: "데이터 엔지니어", duration: "3주" },
        { name: "피처 엔지니어링 및 데이터 전처리", status: "completed", owner: "ML 엔지니어", duration: "2주" },
        { name: "모델 개발 및 학습", status: "in-progress", owner: "ML 엔지니어", duration: "4주" },
        { name: "API/서빙 레이어 개발", status: "in-progress", owner: "백엔드 개발자", duration: "2주" },
        { name: "보안 코드 리뷰 (SAST/DAST)", status: "pending", owner: "보안팀", duration: "1주" },
        { name: "단위/통합 테스트 구현", status: "pending", owner: "QA팀", duration: "2주" },
        { name: "편향성/공정성 테스트 구현", status: "pending", owner: "AI 윤리팀", duration: "1주" },
        { name: "설명가능성 모듈 통합 (SHAP/LIME)", status: "pending", owner: "ML 엔지니어", duration: "1주" },
      ],
      deliverables: ["소스 코드 및 모델 아티팩트", "테스트 결과 보고서", "보안 코드 리뷰 결과", "편향성 검사 결과"],
      approvers: ["테크 리드", "AI CoE 리드"]
    },
    {
      id: "verification",
      phase: "4단계: 검증 및 승인",
      icon: ShieldCheck,
      color: "from-amber-500 to-amber-600",
      borderColor: "border-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      status: "대기",
      progress: 0,
      gate: "배포 게이트",
      gateDesc: "운영 환경 배포 적합성 최종 승인",
      steps: [
        { name: "모델 성능 검증 (정확도/재현율/F1)", status: "pending", owner: "ML 엔지니어", duration: "1주" },
        { name: "공정성/편향성 최종 검증", status: "pending", owner: "AI 윤리위원회", duration: "1주" },
        { name: "보안 취약점 스캔 (침투 테스트)", status: "pending", owner: "보안팀", duration: "1주" },
        { name: "규제 준수 최종 검토", status: "pending", owner: "컴플라이언스팀", duration: "1주" },
        { name: "성능 부하 테스트", status: "pending", owner: "인프라팀", duration: "1주" },
        { name: "거버넌스 위원회 최종 승인", status: "pending", owner: "AI 거버넌스 위원회", duration: "3일" },
      ],
      deliverables: ["검증 결과 종합 보고서", "보안 취약점 스캔 결과", "거버넌스 승인서", "배포 승인서"],
      approvers: ["AI 거버넌스 위원회", "CISO", "CRO"]
    },
    {
      id: "deployment",
      phase: "5단계: 배포",
      icon: Zap,
      color: "from-emerald-500 to-emerald-600",
      borderColor: "border-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      status: "대기",
      progress: 0,
      gate: "운영 게이트",
      gateDesc: "운영 안정성 확인 및 정식 운영 전환 승인",
      steps: [
        { name: "스테이징 환경 배포 및 검증", status: "pending", owner: "DevOps", duration: "3일" },
        { name: "카나리아/블루-그린 배포 실행", status: "pending", owner: "DevOps", duration: "2일" },
        { name: "실시간 모니터링 대시보드 활성화", status: "pending", owner: "운영팀", duration: "1일" },
        { name: "롤백 절차 확인 및 테스트", status: "pending", owner: "DevOps", duration: "1일" },
        { name: "운영자/사용자 교육", status: "pending", owner: "AI CoE", duration: "2일" },
        { name: "정식 운영 전환(Go-Live)", status: "pending", owner: "프로젝트 매니저", duration: "1일" },
      ],
      deliverables: ["배포 체크리스트 완료서", "모니터링 설정 확인서", "롤백 절차서", "교육 완료 보고서"],
      approvers: ["운영 책임자", "서비스 오너"]
    },
    {
      id: "operations",
      phase: "6단계: 운영 및 지속관리",
      icon: Monitor,
      color: "from-rose-500 to-rose-600",
      borderColor: "border-rose-500",
      bgColor: "bg-rose-50",
      textColor: "text-rose-700",
      status: "대기",
      progress: 0,
      gate: "재평가 게이트",
      gateDesc: "정기 재평가 및 모델 갱신 필요 여부 판단",
      steps: [
        { name: "모델 드리프트 모니터링 (데이터/컨셉)", status: "pending", owner: "ML 엔지니어", duration: "상시" },
        { name: "성능 지표 실시간 추적 (SLA 준수)", status: "pending", owner: "운영팀", duration: "상시" },
        { name: "보안 이벤트 감시 및 대응", status: "pending", owner: "SOC팀", duration: "상시" },
        { name: "정기 편향성/공정성 재검증 (분기별)", status: "pending", owner: "AI 윤리팀", duration: "분기별" },
        { name: "규제 변경 사항 모니터링 및 대응", status: "pending", owner: "컴플라이언스팀", duration: "상시" },
        { name: "모델 재학습/갱신 프로세스 실행", status: "pending", owner: "ML 엔지니어", duration: "필요 시" },
        { name: "서비스 폐기/전환 관리", status: "pending", owner: "서비스 오너", duration: "필요 시" },
      ],
      deliverables: ["월간 운영 보고서", "분기별 재평가 보고서", "연간 종합 감사 보고서", "인시던트 대응 보고서"],
      approvers: ["서비스 오너", "AI 거버넌스 위원회"]
    }
  ], []);

  // Process Development Detail Data
  const processDevStages = useMemo(() => [
    {
      id: "data-pipeline",
      name: "데이터 파이프라인 구축",
      icon: Database,
      status: "completed" as const,
      progress: 100,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "원천 데이터 수집부터 전처리까지의 자동화된 파이프라인",
      subProcesses: [
        { name: "데이터 소스 연동 (API/DB/파일)", status: "completed", detail: "REST API, JDBC, S3 연동 완료" },
        { name: "데이터 품질 검증 자동화", status: "completed", detail: "Great Expectations 기반 품질 규칙 87개 적용" },
        { name: "데이터 전처리 파이프라인", status: "completed", detail: "Apache Airflow DAG 구성 완료" },
        { name: "데이터 버전관리 (DVC)", status: "completed", detail: "DVC + S3 백엔드 구성" },
        { name: "개인정보 비식별화 처리", status: "completed", detail: "K-익명성, L-다양성 적용" },
      ],
      metrics: { completionRate: 100, testCoverage: 92, securityScore: 95 }
    },
    {
      id: "feature-engineering",
      name: "피처 엔지니어링",
      icon: Layers,
      status: "completed" as const,
      progress: 100,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      description: "모델 학습에 필요한 특성 변수 설계 및 생성",
      subProcesses: [
        { name: "피처 스토어 구축", status: "completed", detail: "Feast 기반 온라인/오프라인 피처 스토어" },
        { name: "피처 변환 로직 개발", status: "completed", detail: "45개 피처 변환 함수 구현" },
        { name: "피처 중요도 분석", status: "completed", detail: "SHAP Value 기반 피처 선택" },
        { name: "피처 모니터링 설정", status: "completed", detail: "피처 드리프트 감지 알림 구성" },
      ],
      metrics: { completionRate: 100, testCoverage: 88, securityScore: 90 }
    },
    {
      id: "model-development",
      name: "모델 개발 및 학습",
      icon: Cpu,
      status: "in-progress" as const,
      progress: 65,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "AI/ML 모델 설계, 학습, 하이퍼파라미터 튜닝",
      subProcesses: [
        { name: "베이스라인 모델 구현", status: "completed", detail: "XGBoost + LSTM 앙상블 모델" },
        { name: "하이퍼파라미터 최적화", status: "completed", detail: "Optuna 기반 베이지안 최적화" },
        { name: "모델 학습 파이프라인 (MLflow)", status: "in-progress", detail: "실험 추적 및 모델 레지스트리 구성 중" },
        { name: "교차 검증 및 성능 평가", status: "in-progress", detail: "5-Fold CV 진행 중 (F1: 0.92)" },
        { name: "모델 경량화/최적화", status: "pending", detail: "ONNX 변환 및 양자화 예정" },
        { name: "A/B 테스트 설계", status: "pending", detail: "챔피언-챌린저 테스트 설계 예정" },
      ],
      metrics: { completionRate: 65, testCoverage: 75, securityScore: 85 }
    },
    {
      id: "api-serving",
      name: "API/서빙 레이어 개발",
      icon: Zap,
      status: "in-progress" as const,
      progress: 40,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      description: "모델 추론 서빙 API 및 인프라 구축",
      subProcesses: [
        { name: "추론 API 개발 (FastAPI)", status: "completed", detail: "REST/gRPC 엔드포인트 구현" },
        { name: "모델 서빙 인프라 (Triton)", status: "in-progress", detail: "GPU 서빙 인프라 구성 중" },
        { name: "캐싱/배치 추론 최적화", status: "in-progress", detail: "Redis 캐시 + 배치 스케줄러" },
        { name: "API 보안 (인증/인가/암호화)", status: "pending", detail: "OAuth2 + mTLS 적용 예정" },
        { name: "API 문서화 (OpenAPI)", status: "pending", detail: "Swagger 자동 생성 예정" },
      ],
      metrics: { completionRate: 40, testCoverage: 60, securityScore: 70 }
    },
    {
      id: "security-review",
      name: "보안 코드 리뷰",
      icon: Shield,
      status: "pending" as const,
      progress: 0,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "SAST/DAST 기반 보안 취약점 점검 및 코드 리뷰",
      subProcesses: [
        { name: "정적 분석 (SAST) - SonarQube", status: "pending", detail: "코드 품질 및 보안 취약점 스캔" },
        { name: "동적 분석 (DAST) - OWASP ZAP", status: "pending", detail: "런타임 보안 취약점 스캔" },
        { name: "의존성 취약점 검사 (SCA)", status: "pending", detail: "Snyk/Dependabot 기반 라이브러리 검사" },
        { name: "시크릿 스캔 (Secret Detection)", status: "pending", detail: "자격증명 노출 여부 점검" },
        { name: "컨테이너 보안 스캔", status: "pending", detail: "Trivy 기반 이미지 취약점 점검" },
      ],
      metrics: { completionRate: 0, testCoverage: 0, securityScore: 0 }
    },
    {
      id: "testing",
      name: "테스트 및 품질 검증",
      icon: TestTube,
      status: "pending" as const,
      progress: 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      description: "단위/통합/성능 테스트 및 AI 특화 품질 검증",
      subProcesses: [
        { name: "단위 테스트 (Unit Test)", status: "pending", detail: "모델/API 단위 테스트 80% 이상 커버리지" },
        { name: "통합 테스트 (Integration Test)", status: "pending", detail: "E2E 파이프라인 통합 검증" },
        { name: "성능/부하 테스트 (Load Test)", status: "pending", detail: "K6/Locust 기반 부하 테스트" },
        { name: "편향성/공정성 테스트", status: "pending", detail: "Fairlearn 기반 보호 속성별 검증" },
        { name: "설명가능성 검증 (XAI)", status: "pending", detail: "SHAP/LIME 통합 및 검증" },
        { name: "적대적 공격 테스트", status: "pending", detail: "모델 로버스트니스 검증" },
      ],
      metrics: { completionRate: 0, testCoverage: 0, securityScore: 0 }
    }
  ], []);

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === "all" || service.riskLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (level: AIService['riskLevel']) => {
    const colors = {
      UNACCEPTABLE: "bg-red-500",
      HIGH: "bg-orange-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    };
    return colors[level];
  };

  const getStatusBadgeColor = (status: AIService['status']) => {
    const colors = {
      ACTIVE: "bg-green-50 text-green-700 border-green-200",
      INACTIVE: "bg-gray-50 text-gray-700 border-gray-200",
      DEPRECATED: "bg-red-50 text-red-700 border-red-200",
      IN_DEVELOPMENT: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return colors[status];
  };

  return (
    <Layout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('governance.services.title') || 'AI 서비스 관리'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('governance.services.subtitle') || '조직의 모든 AI 서비스를 일관되게 관리하고 금융 5대 AI 체크리스트 준수'}
            </p>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.totalServices') || '총 서비스'}
              value={mockServices.length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.activeServices') || '운영 중'}
              value={mockServices.filter(s => s.status === "ACTIVE").length}
              change={"+0"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.avgCompliance') || '평균 준수율'}
              value="85%"
              change={"+3%"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.highRisk') || '고위험 서비스'}
              value={mockServices.filter(s => s.riskLevel === "HIGH").length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
        </motion.div>

        {/* Flow Entry Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Workflow className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">AI 서비스 거버넌스 플로우</h3>
                    <p className="text-sm text-white/80">
                      요청서 작성부터 배포/운영까지 19단계 거버넌스 프로세스를 단계별로 진행합니다
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-2"
                    onClick={() => navigate("/governance/flow/request-form")}
                  >
                    <Play className="w-4 h-4" />
                    새 플로우 시작
                  </Button>
                  <Button
                    className="bg-white text-purple-700 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => navigate("/governance/flow/pre-review-request")}
                  >
                    사전검토 요청
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="w-full space-y-6">
          <TabsList className="bg-transparent gap-6 border-b pb-0 h-auto w-full justify-start rounded-none">
            <TabsTrigger
              value="services"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <Cpu className="w-4 h-4 mr-2" />
              {t('gov.serviceTab.title')}
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('gov.financeTab.title')}
            </TabsTrigger>
            <TabsTrigger
              value="process-dev"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <Workflow className="w-4 h-4 mr-2" />
              프로세스 개발
            </TabsTrigger>
            <TabsTrigger
              value="lifecycle"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              생애주기 플로우
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.serviceRegistry.title')}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('gov.serviceRegistry.addNew')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t('gov.serviceRegistry.addNew')}</DialogTitle>
                        <DialogDescription>
                          {t('gov.serviceRegistry.addNewDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">서비스명</label>
                          <Input placeholder="서비스 이름을 입력하세요" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">카테고리</label>
                          <Input placeholder="예: 신용평가, 사기탐지, 거래감시" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">담당팀</label>
                          <Input placeholder="담당 팀을 입력하세요" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">데이터 소스</label>
                          <Input placeholder="학습 데이터 소스를 설명하세요" />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">취소</Button>
                          <Button className="flex-1">등록</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="서비스명 또는 ID로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={filterLevel === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("all")}
                    >
                      전체
                    </Button>
                    <Button
                      variant={filterLevel === "HIGH" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("HIGH")}
                    >
                      고위험
                    </Button>
                    <Button
                      variant={filterLevel === "MEDIUM" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("MEDIUM")}
                    >
                      중위험
                    </Button>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{service.name}</h4>
                              <Badge variant="outline" className="font-mono text-xs">
                                {service.id}
                              </Badge>
                              <Badge className={cn(
                                "text-white",
                                getRiskColor(service.riskLevel)
                              )}>
                                {service.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1">상태</p>
                            <Badge variant="outline" className={cn(
                              "text-xs border",
                              getStatusBadgeColor(service.status)
                            )}>
                              {service.status === "ACTIVE" && "운영 중"}
                              {service.status === "INACTIVE" && "비활성"}
                              {service.status === "DEPRECATED" && "폐기됨"}
                              {service.status === "IN_DEVELOPMENT" && "개발 중"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">담당팀</p>
                            <p className="font-medium">{service.owner}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">생성일</p>
                            <p className="font-medium">{service.createdDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">마지막 감사</p>
                            <p className="font-medium">{service.lastAuditDate}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-medium">준수율</span>
                              <span className="font-bold">{service.complianceScore}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full",
                                  service.complianceScore >= 85 && "bg-green-500",
                                  service.complianceScore >= 70 && service.complianceScore < 85 && "bg-yellow-500",
                                  service.complianceScore < 70 && "bg-red-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${service.complianceScore}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          <div className="text-xs">
                            <p className="text-muted-foreground mb-1">영향 범위</p>
                            <p className="font-medium">{service.impactArea}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">데이터 소스:</span> {service.dataSource}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance AI Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {financeAIServices.map((finService, idx) => {
                const completionPercent = Math.round((finService.completedItems / finService.complianceItems) * 100);
                return (
                  <motion.div
                    key={finService.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{finService.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{finService.description}</p>
                          </div>
                          <Badge className={cn(
                            "text-white",
                            completionPercent === 100 && "bg-green-500",
                            completionPercent >= 75 && completionPercent < 100 && "bg-blue-500",
                            completionPercent >= 50 && completionPercent < 75 && "bg-yellow-500",
                            completionPercent < 50 && "bg-red-500"
                          )}>
                            {completionPercent}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">체크리스트 진행률</span>
                            <span className="text-muted-foreground">
                              {finService.completedItems} / {finService.complianceItems}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${completionPercent}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm mb-3">필수 점검 항목</h4>
                          {finService.checklist.map((item, i) => {
                            const isCompleted = i < finService.completedItems;
                            return (
                              <motion.div
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                                )}
                                <span className={cn(
                                  "text-sm",
                                  isCompleted && "text-muted-foreground line-through"
                                )}>
                                  {item}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 border-t">
                        <Button variant="outline" className="w-full gap-2">
                          <BarChart3 className="w-4 h-4" />
                          상세 점검 보고서 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Finance AI Info Card */}
            <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20 border-blue-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">금융분야 AI 안내서</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  금융감독청의 AI 리스크 관리 권고사항에 따른 5대 금융 AI 서비스별 필수 체크리스트
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>신용평가, 거래감시, 투자조언, 고객분류, 위험도평가</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>각 서비스별 8가지 필수 체크리스트 점검</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>정기적 재평가 및 모니터링 체계 구축</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Process Development Tab */}
          <TabsContent value="process-dev" className="space-y-6">
            {/* Process Development Overview */}
            <Card className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 border-purple-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cog className="w-5 h-5 text-purple-600" />
                  AI 서비스 프로세스 개발 현황
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  GnG CyberGuide 프로세스설계서 기반 - AI 서비스 개발 파이프라인의 각 단계별 진행 현황
                </p>
              </CardHeader>
              <CardContent>
                {/* Overall Progress */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">전체 진행률</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {Math.round(processDevStages.reduce((sum, s) => sum + s.progress, 0) / processDevStages.length)}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div
                        className="h-full bg-purple-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(processDevStages.reduce((sum, s) => sum + s.progress, 0) / processDevStages.length)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">완료 단계</p>
                    <p className="text-2xl font-bold text-green-700">
                      {processDevStages.filter(s => s.status === "completed").length}/{processDevStages.length}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">진행 중</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {processDevStages.filter(s => s.status === "in-progress").length}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-1">대기</p>
                    <p className="text-2xl font-bold text-gray-500">
                      {processDevStages.filter(s => s.status === "pending").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Stages Detail */}
            <div className="space-y-4">
              {processDevStages.map((stage, idx) => {
                const StageIcon = stage.icon;
                const isExpanded = expandedProcess === stage.id;
                return (
                  <motion.div
                    key={stage.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-300",
                      stage.status === "in-progress" && "ring-2 ring-purple-300 shadow-md"
                    )}>
                      {/* Stage Header */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedProcess(isExpanded ? null : stage.id)}
                      >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stage.bgColor)}>
                          <StageIcon className={cn("w-6 h-6", stage.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{stage.name}</h3>
                            <Badge className={cn(
                              "text-xs",
                              stage.status === "completed" && "bg-green-100 text-green-700 border-green-300",
                              stage.status === "in-progress" && "bg-amber-100 text-amber-700 border-amber-300",
                              stage.status === "pending" && "bg-gray-100 text-gray-500 border-gray-300"
                            )}>
                              {stage.status === "completed" && "완료"}
                              {stage.status === "in-progress" && "진행 중"}
                              {stage.status === "pending" && "대기"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{stage.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full",
                                  stage.progress === 100 ? "bg-green-500" : stage.progress > 0 ? "bg-purple-500" : "bg-gray-300"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.progress}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">{stage.progress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* Metric Badges */}
                          <div className="hidden md:flex items-center gap-3">
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground">테스트</p>
                              <p className={cn("text-xs font-bold", stage.metrics.testCoverage >= 80 ? "text-green-600" : stage.metrics.testCoverage > 0 ? "text-amber-600" : "text-gray-400")}>
                                {stage.metrics.testCoverage}%
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] text-muted-foreground">보안</p>
                              <p className={cn("text-xs font-bold", stage.metrics.securityScore >= 80 ? "text-green-600" : stage.metrics.securityScore > 0 ? "text-amber-600" : "text-gray-400")}>
                                {stage.metrics.securityScore}%
                              </p>
                            </div>
                          </div>
                          {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                        </div>
                      </div>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t">
                              <div className="pt-4 space-y-3">
                                {stage.subProcesses.map((sub, subIdx) => (
                                  <motion.div
                                    key={subIdx}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIdx * 0.05 }}
                                  >
                                    <div className="mt-0.5">
                                      {sub.status === "completed" ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : sub.status === "in-progress" ? (
                                        <CircleDot className="w-5 h-5 text-amber-500 animate-pulse" />
                                      ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={cn(
                                        "text-sm font-medium",
                                        sub.status === "completed" && "text-muted-foreground"
                                      )}>
                                        {sub.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-0.5">{sub.detail}</p>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                      "text-[10px] shrink-0",
                                      sub.status === "completed" && "border-green-300 text-green-600",
                                      sub.status === "in-progress" && "border-amber-300 text-amber-600",
                                      sub.status === "pending" && "border-gray-300 text-gray-500"
                                    )}>
                                      {sub.status === "completed" ? "완료" : sub.status === "in-progress" ? "진행 중" : "대기"}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Process Development Guidelines */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200/50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="w-5 h-5 text-slate-600" />
                  프로세스 개발 가이드라인 (GnG CyberGuide)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-4 h-4 text-red-500" />
                      <h4 className="font-semibold text-sm">보안 필수 요건</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                        <span>모든 API 엔드포인트 인증/인가 적용</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                        <span>데이터 암호화 (전송 중/저장 시)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                        <span>시크릿/자격증명 안전 관리</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                        <span>컨테이너 이미지 취약점 스캔</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-red-400 shrink-0" />
                        <span>모델 적대적 공격 방어 구현</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge className="w-4 h-4 text-blue-500" />
                      <h4 className="font-semibold text-sm">품질 기준</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>코드 커버리지 80% 이상</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>보안 스코어 90점 이상 (배포 기준)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>API 응답시간 p99 &lt; 200ms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>모델 성능 F1 Score 0.85 이상</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>편향성 지표 DPD &lt; 0.1</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck className="w-4 h-4 text-green-500" />
                      <h4 className="font-semibold text-sm">산출물 체크리스트</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <span>소스 코드 (Git 버전관리)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <span>모델 아티팩트 (MLflow 등록)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <span>API 명세서 (OpenAPI/Swagger)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <span>테스트 결과 보고서</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-400 shrink-0" />
                        <span>보안 코드 리뷰 결과서</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lifecycle Flow Tab */}
          <TabsContent value="lifecycle" className="space-y-6">
            {/* Lifecycle Overview Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">AI 서비스 생애주기 관리 플로우</h2>
                    <p className="text-blue-100 text-sm">
                      GnG CyberGuide 프로세스설계서 기반 6단계 생애주기 관리 체계
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-xs text-blue-200">단계</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-xs text-blue-200">게이트</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">38</p>
                      <p className="text-xs text-blue-200">프로세스</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {lifecyclePhases.map((phase, idx) => {
                const PhaseIcon = phase.icon;
                return (
                  <Button
                    key={phase.id}
                    variant={activePhase === idx ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "whitespace-nowrap gap-1.5 shrink-0",
                      activePhase === idx && `bg-gradient-to-r ${phase.color} border-0`
                    )}
                    onClick={() => setActivePhase(idx)}
                  >
                    <PhaseIcon className="w-3.5 h-3.5" />
                    {phase.phase.split(": ")[1]}
                  </Button>
                );
              })}
            </div>

            {/* Visual Flow Diagram */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-500" />
                  생애주기 플로우 다이어그램
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Flow Steps */}
                  <div className="flex flex-col gap-0">
                    {lifecyclePhases.map((phase, idx) => {
                      const PhaseIcon = phase.icon;
                      const isActive = activePhase === idx;
                      const isCompleted = phase.status === "완료";
                      const isInProgress = phase.status === "진행 중";
                      return (
                        <React.Fragment key={phase.id}>
                          {/* Phase Card */}
                          <motion.div
                            className={cn(
                              "relative flex items-stretch gap-4 cursor-pointer",
                              isActive && "z-10"
                            )}
                            onClick={() => setActivePhase(idx)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            {/* Timeline Line */}
                            <div className="flex flex-col items-center w-10 shrink-0">
                              <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all",
                                isCompleted && "bg-green-500 border-green-500 text-white",
                                isInProgress && "bg-amber-500 border-amber-500 text-white animate-pulse",
                                !isCompleted && !isInProgress && "bg-gray-100 border-gray-300 text-gray-400"
                              )}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <PhaseIcon className="w-5 h-5" />
                                )}
                              </div>
                              {idx < lifecyclePhases.length - 1 && (
                                <div className={cn(
                                  "w-0.5 flex-1 min-h-[24px]",
                                  isCompleted ? "bg-green-400" : "bg-gray-200"
                                )} />
                              )}
                            </div>

                            {/* Phase Content */}
                            <div className={cn(
                              "flex-1 p-4 rounded-lg border mb-3 transition-all",
                              isActive && `${phase.bgColor} ${phase.borderColor} shadow-md`,
                              !isActive && "hover:bg-muted/30"
                            )}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <h3 className={cn("font-semibold text-sm", isActive && phase.textColor)}>
                                    {phase.phase}
                                  </h3>
                                  <Badge className={cn(
                                    "text-[10px]",
                                    phase.status === "완료" && "bg-green-100 text-green-700",
                                    phase.status === "진행 중" && "bg-amber-100 text-amber-700",
                                    phase.status === "대기" && "bg-gray-100 text-gray-500"
                                  )}>
                                    {phase.status}
                                  </Badge>
                                </div>
                                <span className="text-xs font-medium">{phase.progress}%</span>
                              </div>

                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200/60 rounded-full h-1.5 mb-3">
                                <motion.div
                                  className={cn(
                                    "h-full rounded-full bg-gradient-to-r",
                                    phase.color
                                  )}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${phase.progress}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>

                              {/* Expanded Phase Detail */}
                              {isActive && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="space-y-4"
                                >
                                  {/* Steps */}
                                  <div>
                                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">주요 활동</h4>
                                    <div className="space-y-1.5">
                                      {phase.steps.map((step, stepIdx) => (
                                        <div key={stepIdx} className="flex items-center gap-2 text-xs p-1.5 rounded bg-white/60">
                                          {step.status === "completed" ? (
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                          ) : step.status === "in-progress" ? (
                                            <CircleDot className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                                          ) : (
                                            <div className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0" />
                                          )}
                                          <span className="flex-1">{step.name}</span>
                                          <span className="text-muted-foreground shrink-0">{step.owner}</span>
                                          <Badge variant="outline" className="text-[9px] shrink-0">{step.duration}</Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Deliverables */}
                                  <div>
                                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">산출물</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {phase.deliverables.map((d, dIdx) => (
                                        <Badge key={dIdx} variant="outline" className="text-[10px] bg-white/60">
                                          <FileText className="w-2.5 h-2.5 mr-1" />
                                          {d}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Approvers */}
                                  <div>
                                    <h4 className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">승인 주체</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                      {phase.approvers.map((a, aIdx) => (
                                        <Badge key={aIdx} className="text-[10px] bg-white/80 text-foreground border">
                                          <Users className="w-2.5 h-2.5 mr-1" />
                                          {a}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>

                          {/* Gate between phases */}
                          {idx < lifecyclePhases.length - 1 && (
                            <div className="flex items-center gap-4 ml-[11px]">
                              <div className="w-[18px]" />
                              <motion.div
                                className="flex-1 flex items-center gap-2 px-3 py-1.5 mb-3 rounded border border-dashed border-orange-300 bg-orange-50/50"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 + 0.05 }}
                              >
                                <Shield className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-orange-700">{phase.gate}</p>
                                  <p className="text-[9px] text-orange-600/80 truncate">{phase.gateDesc}</p>
                                </div>
                                {isCompleted ? (
                                  <Badge className="text-[9px] bg-green-100 text-green-700 border-green-300">통과</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-[9px] border-orange-300 text-orange-600">대기</Badge>
                                )}
                              </motion.div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifecycle RACI Matrix */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                  생애주기 단계별 RACI 매트릭스
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">역할/단계</th>
                        <th className="p-2 text-center font-semibold">기획</th>
                        <th className="p-2 text-center font-semibold">설계</th>
                        <th className="p-2 text-center font-semibold bg-purple-50">개발</th>
                        <th className="p-2 text-center font-semibold">검증</th>
                        <th className="p-2 text-center font-semibold">배포</th>
                        <th className="p-2 text-center font-semibold">운영</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { role: "AI CoE / ML 엔지니어", values: ["C", "R", "R", "R", "C", "C"] },
                        { role: "사업부서 (서비스 오너)", values: ["R", "C", "I", "C", "I", "A"] },
                        { role: "거버넌스 위원회", values: ["A", "A", "I", "A", "A", "A"] },
                        { role: "보안팀 / CISO", values: ["C", "R", "R", "R", "C", "C"] },
                        { role: "컴플라이언스팀", values: ["R", "C", "I", "R", "I", "R"] },
                        { role: "데이터팀 / DPO", values: ["C", "R", "R", "C", "I", "C"] },
                        { role: "DevOps / 인프라팀", values: ["I", "C", "C", "C", "R", "R"] },
                        { role: "AI 윤리위원회", values: ["C", "C", "I", "R", "I", "C"] },
                      ].map((row, rIdx) => (
                        <tr key={rIdx} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{row.role}</td>
                          {row.values.map((v, vIdx) => (
                            <td key={vIdx} className={cn("p-2 text-center", vIdx === 2 && "bg-purple-50/50")}>
                              <Badge className={cn(
                                "text-[10px] w-6 h-6 rounded-full p-0 flex items-center justify-center mx-auto",
                                v === "R" && "bg-blue-100 text-blue-700 border-blue-300",
                                v === "A" && "bg-red-100 text-red-700 border-red-300",
                                v === "C" && "bg-green-100 text-green-700 border-green-300",
                                v === "I" && "bg-gray-100 text-gray-500 border-gray-300"
                              )}>
                                {v}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Badge className="bg-red-100 text-red-700 text-[9px] px-1">A</Badge> Accountable (최종 승인)</span>
                    <span className="flex items-center gap-1"><Badge className="bg-blue-100 text-blue-700 text-[9px] px-1">R</Badge> Responsible (실행 담당)</span>
                    <span className="flex items-center gap-1"><Badge className="bg-green-100 text-green-700 text-[9px] px-1">C</Badge> Consulted (자문)</span>
                    <span className="flex items-center gap-1"><Badge className="bg-gray-100 text-gray-500 text-[9px] px-1">I</Badge> Informed (통보)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Continuous Improvement Cycle */}
            <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border-emerald-200/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  지속적 개선 사이클 (Continuous Improvement)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Plan (계획)",
                      icon: Target,
                      color: "text-blue-600",
                      bg: "bg-blue-100",
                      items: ["위험 재평가 주기 설정", "성능 목표 갱신", "규제 변경 반영"]
                    },
                    {
                      title: "Do (실행)",
                      icon: Play,
                      color: "text-green-600",
                      bg: "bg-green-100",
                      items: ["모델 재학습 실행", "보안 패치 적용", "피처 업데이트"]
                    },
                    {
                      title: "Check (점검)",
                      icon: Search,
                      color: "text-amber-600",
                      bg: "bg-amber-100",
                      items: ["성능 드리프트 모니터링", "편향성 재검증", "SLA 준수 확인"]
                    },
                    {
                      title: "Act (조치)",
                      icon: Zap,
                      color: "text-red-600",
                      bg: "bg-red-100",
                      items: ["이상 탐지 시 알림", "자동 롤백 트리거", "거버넌스 재승인"]
                    }
                  ].map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        className="p-4 bg-white rounded-lg border relative"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-3", item.bg)}>
                          <ItemIcon className={cn("w-4 h-4", item.color)} />
                        </div>
                        <h4 className="font-semibold text-sm mb-2">{item.title}</h4>
                        <ul className="space-y-1">
                          {item.items.map((li, liIdx) => (
                            <li key={liIdx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                              {li}
                            </li>
                          ))}
                        </ul>
                        {idx < 3 && (
                          <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400 z-10" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Layout>
  );
};

export default AIServiceManagement;
