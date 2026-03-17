import React, { useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import {
  MetricCard,
  ProcessCard
} from "@/components/Cards";
import {
  Database,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Filter,
  Search,
  Download,
  Settings,
  Brain,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Shield,
  FileSearch,
  Layers,
  Workflow,
  Target,
  RefreshCw,
  ClipboardCheck,
  Eye,
  Zap,
  FileText,
  Users,
  ArrowRight,
  Play,
  Upload,
  FolderOpen,
  File,
  X,
  HardDrive,
  Table,
  FileSpreadsheet,
  Loader2,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { useI18n } from "@/lib/i18n";

interface DataQualityMetric {
  name: string;
  value: number;
  target: number;
  status: 'compliant' | 'warning' | 'critical';
  description: string;
}

interface DataProfilingResult {
  datasetId: string;
  datasetName: string;
  totalRecords: number;
  missingValues: number;
  completeness: number;
  duplicates: number;
  consistency: number;
  lastUpdated: string;
}

interface AnomalyItem {
  type: string;
  count: number;
  percentage: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface BiasMetric {
  category: string;
  group: string;
  representationRate: number;
  disparityIndex: number;
  status: 'balanced' | 'imbalanced';
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  progress: number;
  records?: number;
  quality?: number;
  addedAt: Date;
}

const DataQualityReview = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("metrics");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    { id: "uf-1", name: "transactions_2026_q1.csv", size: 245000000, type: "csv", status: "completed", progress: 100, records: 2500000, quality: 98.5, addedAt: new Date("2026-03-09") },
    { id: "uf-2", name: "customer_master.parquet", size: 180000000, type: "parquet", status: "completed", progress: 100, records: 850000, quality: 97.2, addedAt: new Date("2026-03-08") },
    { id: "uf-3", name: "credit_scores.csv", size: 52000000, type: "csv", status: "completed", progress: 100, records: 450000, quality: 99.1, addedAt: new Date("2026-03-09") },
  ]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1000000000) return `${(bytes / 1000000000).toFixed(1)} GB`;
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const simulateUpload = useCallback((file: File) => {
    const id = `uf-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const ext = file.name.split('.').pop()?.toLowerCase() || "unknown";
    const newFile: UploadedFile = {
      id,
      name: file.name,
      size: file.size,
      type: ext,
      status: 'uploading',
      progress: 0,
      addedAt: new Date(),
    };
    setUploadedFiles(prev => [newFile, ...prev]);

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        setUploadedFiles(prev => prev.map(f =>
          f.id === id ? { ...f, progress: 100, status: 'analyzing' as const } : f
        ));
        // Simulate analysis
        setTimeout(() => {
          const mockRecords = Math.floor(Math.random() * 500000) + 10000;
          const mockQuality = Math.round((Math.random() * 10 + 88) * 10) / 10;
          setUploadedFiles(prev => prev.map(f =>
            f.id === id ? { ...f, status: 'completed' as const, records: mockRecords, quality: mockQuality } : f
          ));
        }, 2000);
      } else {
        setUploadedFiles(prev => prev.map(f =>
          f.id === id ? { ...f, progress: Math.min(progress, 99) } : f
        ));
      }
    }, 300);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => simulateUpload(file));
    }
    setIsUploadDialogOpen(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(file => simulateUpload(file));
    }
  }, [simulateUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleFolderPathSubmit = () => {
    if (!folderPath.trim()) return;
    // Simulate loading files from folder path
    const mockFiles = [
      { name: `${folderPath.split('/').pop()}_data.csv`, size: Math.floor(Math.random() * 200000000) + 50000000 },
      { name: `${folderPath.split('/').pop()}_labels.csv`, size: Math.floor(Math.random() * 50000000) + 10000000 },
    ];
    mockFiles.forEach(mf => {
      const mockFile = new File([""], mf.name, { type: "text/csv" });
      Object.defineProperty(mockFile, 'size', { value: mf.size });
      simulateUpload(mockFile);
    });
    setFolderPath("");
    setIsUploadDialogOpen(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'parquet': return <HardDrive className="w-5 h-5 text-blue-500" />;
      case 'json': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'xlsx': case 'xls': return <Table className="w-5 h-5 text-emerald-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  // TTA 요구사항 04, 05, 06 기반 체크리스트
  const dataQualityChecklist = useMemo(() => [
    {
      id: "req04-01",
      category: t('tech.data.checklist.category.info'),
      item: t('tech.data.checklist.item.source'),
      completed: true,
      description: t('tech.data.checklist.desc.source')
    },
    {
      id: "req04-02",
      category: t('tech.data.checklist.category.info'),
      item: t('tech.data.checklist.item.metadata'),
      completed: true,
      description: t('tech.data.checklist.desc.metadata')
    },
    {
      id: "req04-03",
      category: t('tech.data.checklist.category.info'),
      item: t('tech.data.checklist.item.version'),
      completed: true,
      description: t('tech.data.checklist.desc.version')
    },
    {
      id: "req05-01",
      category: t('tech.data.checklist.category.anomaly'),
      item: t('tech.data.checklist.item.detection'),
      completed: true,
      description: t('tech.data.checklist.desc.detection')
    },
    {
      id: "req05-02",
      category: t('tech.data.checklist.category.anomaly'),
      item: t('tech.data.checklist.item.missing'),
      completed: true,
      description: t('tech.data.checklist.desc.missing')
    },
    {
      id: "req05-03",
      category: t('tech.data.checklist.category.anomaly'),
      item: t('tech.data.checklist.item.review'),
      completed: true,
      description: t('tech.data.checklist.desc.review')
    },
    {
      id: "req06-01",
      category: t('tech.data.checklist.category.bias'),
      item: t('tech.data.checklist.item.biasEval'),
      completed: false,
      description: t('tech.data.checklist.desc.biasEval')
    },
    {
      id: "req06-02",
      category: t('tech.data.checklist.category.bias'),
      item: t('tech.data.checklist.item.mitigation'),
      completed: true,
      description: t('tech.data.checklist.desc.mitigation')
    },
    {
      id: "req06-03",
      category: t('tech.data.checklist.category.bias'),
      item: t('tech.data.checklist.item.monitoring'),
      completed: true,
      description: t('tech.data.checklist.desc.monitoring')
    },
  ], [t]);

  // 데이터 품질 메트릭
  const dataQualityMetrics = useMemo((): DataQualityMetric[] => [
    {
      name: t('tech.data.metric.completeness'),
      value: 98.5,
      target: 99.0,
      status: 'compliant',
      description: t('tech.data.metric.completeness.desc')
    },
    {
      name: t('tech.data.metric.accuracy'),
      value: 97.2,
      target: 98.5,
      status: 'warning',
      description: t('tech.data.metric.accuracy.desc')
    },
    {
      name: t('tech.data.metric.consistency'),
      value: 99.1,
      target: 99.0,
      status: 'compliant',
      description: t('tech.data.metric.consistency.desc')
    },
    {
      name: t('tech.data.metric.timeliness'),
      value: 96.8,
      target: 95.0,
      status: 'compliant',
      description: t('tech.data.metric.timeliness.desc')
    },
  ], [t]);

  // 데이터 프로파일링 결과
  const dataProfilingResults = useMemo((): DataProfilingResult[] => [
    {
      datasetId: "DS-001",
      datasetName: "거래 내역 (Transaction)",
      totalRecords: 2500000,
      missingValues: 1250,
      completeness: 99.95,
      duplicates: 342,
      consistency: 99.86,
      lastUpdated: "2024-03-09"
    },
    {
      datasetId: "DS-002",
      datasetName: "고객 정보 (Customer)",
      totalRecords: 850000,
      missingValues: 8500,
      completeness: 99.0,
      duplicates: 1200,
      consistency: 98.5,
      lastUpdated: "2024-03-08"
    },
    {
      datasetId: "DS-003",
      datasetName: "신용도 (Credit Rating)",
      totalRecords: 450000,
      missingValues: 900,
      completeness: 99.8,
      duplicates: 180,
      consistency: 99.92,
      lastUpdated: "2024-03-09"
    },
  ], []);

  // 이상 데이터 탐지 요약
  const anomalyDetectionSummary = useMemo((): AnomalyItem[] => [
    {
      type: "결측치 (Missing Values)",
      count: 10650,
      percentage: 0.22,
      severity: 'low',
      description: "정의된 기준으로 처리 완료"
    },
    {
      type: "극값 (Outliers)",
      count: 3240,
      percentage: 0.067,
      severity: 'medium',
      description: "수동 검토 필요한 항목 포함"
    },
    {
      type: "중복 데이터 (Duplicates)",
      count: 1722,
      percentage: 0.036,
      severity: 'low',
      description: "대부분 제거됨, 일부 검토 중"
    },
    {
      type: "형식 오류 (Format Errors)",
      count: 456,
      percentage: 0.009,
      severity: 'medium',
      description: "데이터 타입 불일치 발견"
    },
    {
      type: "범위 초과 (Out of Range)",
      count: 892,
      percentage: 0.018,
      severity: 'high',
      description: "정의된 범위 밖의 값"
    },
  ], []);

  // 편향 감지 결과
  const biasDetectionReport = useMemo((): BiasMetric[] => [
    {
      category: "성별 (Gender)",
      group: "남성",
      representationRate: 58.3,
      disparityIndex: 1.08,
      status: 'imbalanced'
    },
    {
      category: "성별 (Gender)",
      group: "여성",
      representationRate: 41.7,
      disparityIndex: 0.92,
      status: 'imbalanced'
    },
    {
      category: "연령대 (Age Group)",
      group: "20-30대",
      representationRate: 35.2,
      disparityIndex: 1.05,
      status: 'balanced'
    },
    {
      category: "연령대 (Age Group)",
      group: "40-50대",
      representationRate: 42.8,
      disparityIndex: 1.02,
      status: 'balanced'
    },
    {
      category: "연령대 (Age Group)",
      group: "60대 이상",
      representationRate: 22.0,
      disparityIndex: 0.88,
      status: 'balanced'
    },
    {
      category: "지역 (Region)",
      group: "수도권",
      representationRate: 48.5,
      disparityIndex: 0.95,
      status: 'balanced'
    },
    {
      category: "지역 (Region)",
      group: "지방",
      representationRate: 51.5,
      disparityIndex: 1.05,
      status: 'balanced'
    },
  ], []);

  // 데이터 품질 검증 프로세스 단계
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const dqProcessStages = useMemo(() => [
    {
      id: "dq-planning",
      name: "1단계: 품질 검증 계획 수립",
      icon: Target,
      status: "completed" as const,
      progress: 100,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-400",
      description: "데이터 품질 검증 범위, 기준, 일정을 정의하고 검증 계획을 수립합니다.",
      gate: "계획 게이트",
      gateDesc: "검증 범위 및 품질 기준 적정성 승인",
      gateStatus: "passed" as const,
      subProcesses: [
        { name: "검증 대상 데이터셋 식별 및 범위 정의", status: "completed", owner: "데이터팀", detail: "3개 핵심 데이터셋 (거래내역, 고객정보, 신용도) 선정" },
        { name: "품질 지표(KPI) 정의 (완전성/정확성/일관성/적시성)", status: "completed", owner: "DQM 담당", detail: "4대 핵심 지표 및 목표값 설정 완료" },
        { name: "검증 기준 및 임계값 설정", status: "completed", owner: "DQM 담당", detail: "완전성 ≥99%, 정확성 ≥98.5%, 일관성 ≥99%, 적시성 ≥95%" },
        { name: "검증 도구 및 자동화 파이프라인 선정", status: "completed", owner: "데이터 엔지니어", detail: "Great Expectations + Apache Airflow + dbt" },
        { name: "검증 일정 및 담당자 배정", status: "completed", owner: "PM", detail: "주간 자동 검증 + 월간 수동 검토 일정 확정" },
      ],
      deliverables: ["데이터 품질 검증 계획서", "품질 지표 정의서", "검증 도구 구성서"],
    },
    {
      id: "dq-profiling",
      name: "2단계: 데이터 프로파일링",
      icon: FileSearch,
      status: "completed" as const,
      progress: 100,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      borderColor: "border-indigo-400",
      description: "데이터의 구조, 분포, 통계적 특성을 분석하여 품질 현황을 파악합니다.",
      gate: "프로파일링 게이트",
      gateDesc: "프로파일링 결과 검토 및 이상 패턴 분류 승인",
      gateStatus: "passed" as const,
      subProcesses: [
        { name: "스키마 검증 (컬럼 타입/제약조건/관계)", status: "completed", owner: "데이터 엔지니어", detail: "전체 테이블 스키마 무결성 검증 완료" },
        { name: "통계 프로파일 생성 (분포/평균/표준편차/사분위)", status: "completed", owner: "데이터 분석가", detail: "각 컬럼별 통계 프로파일 자동 생성" },
        { name: "결측치 패턴 분석 (MCAR/MAR/MNAR 분류)", status: "completed", owner: "데이터 분석가", detail: "MCAR 72%, MAR 25%, MNAR 3% 분류 완료" },
        { name: "유일성/카디널리티 분석", status: "completed", owner: "데이터 엔지니어", detail: "PK 유일성 100%, 외래키 참조 무결성 99.97%" },
        { name: "데이터 리니지(Lineage) 추적", status: "completed", owner: "데이터 거버넌스", detail: "원천 → 전처리 → 학습 전 과정 리니지 매핑" },
      ],
      deliverables: ["데이터 프로파일링 보고서", "스키마 검증 결과", "데이터 리니지 맵"],
    },
    {
      id: "dq-anomaly",
      name: "3단계: 이상 데이터 탐지 및 처리",
      icon: AlertTriangle,
      status: "completed" as const,
      progress: 100,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      borderColor: "border-amber-400",
      description: "이상치, 결측치, 중복, 형식오류 등 이상 데이터를 탐지하고 처리합니다.",
      gate: "이상처리 게이트",
      gateDesc: "이상 데이터 처리 완료 및 잔여 위험 수용 여부 승인",
      gateStatus: "passed" as const,
      subProcesses: [
        { name: "자동화 이상 탐지 규칙 실행 (87개 규칙)", status: "completed", owner: "DQM 시스템", detail: "Great Expectations 기반 자동 검증 완료" },
        { name: "결측치 처리 (대치/삭제/플래그)", status: "completed", owner: "데이터 엔지니어", detail: "MCAR→평균대치, MAR→다중대입, MNAR→플래그 처리" },
        { name: "극값(Outlier) 탐지 및 처리 (IQR/Z-Score)", status: "completed", owner: "데이터 분석가", detail: "IQR 1.5배 기준, 3,240건 탐지 → 수동 검토 후 처리" },
        { name: "중복 데이터 식별 및 제거 (Fuzzy Matching)", status: "completed", owner: "데이터 엔지니어", detail: "정확 매칭 + 유사도 0.95 이상 퍼지 매칭 적용" },
        { name: "형식 오류 정규화 (날짜/전화번호/주소)", status: "completed", owner: "데이터 엔지니어", detail: "ISO 8601, E.164 형식으로 통일" },
        { name: "처리 결과 검증 및 이력 관리", status: "completed", owner: "DQM 담당", detail: "처리 전후 비교 보고서 생성, 감사 로그 저장" },
      ],
      deliverables: ["이상 데이터 탐지 보고서", "데이터 처리 이력", "잔여 이상 현황 보고서"],
    },
    {
      id: "dq-bias",
      name: "4단계: 편향성 검증",
      icon: Layers,
      status: "in-progress" as const,
      progress: 70,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-400",
      description: "학습 데이터의 편향성을 검증하고 공정성 기준 충족 여부를 평가합니다.",
      gate: "편향성 게이트",
      gateDesc: "편향성 완화 조치 적정성 및 잔여 편향 수용 여부 승인",
      gateStatus: "pending" as const,
      subProcesses: [
        { name: "보호 속성 식별 (성별/연령/지역/소득)", status: "completed", owner: "AI 윤리팀", detail: "4개 보호 속성 정의, 법적 근거 매핑" },
        { name: "표현도 분석 (Representation Analysis)", status: "completed", owner: "데이터 분석가", detail: "성별 불균형 감지 (남 58.3% vs 여 41.7%)" },
        { name: "불균형 지수 산출 (DI/SPD/EOD)", status: "completed", owner: "데이터 분석가", detail: "DI 범위 0.88~1.08, SPD < 0.1 대부분 충족" },
        { name: "편향 완화 기법 적용 (리샘플링/가중치 조정)", status: "in-progress", owner: "ML 엔지니어", detail: "SMOTE + 클래스 가중치 조정 진행 중" },
        { name: "완화 후 재검증 및 비교 분석", status: "pending", owner: "AI 윤리팀", detail: "완화 전후 지표 비교 분석 예정" },
        { name: "편향성 검증 보고서 작성 및 서명", status: "pending", owner: "DPO", detail: "최종 보고서 작성 및 책임자 서명 예정" },
      ],
      deliverables: ["편향성 검증 보고서", "편향 완화 조치 결과서", "공정성 인증서"],
    },
    {
      id: "dq-validation",
      name: "5단계: 최종 품질 검증 및 승인",
      icon: Shield,
      status: "pending" as const,
      progress: 0,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      borderColor: "border-emerald-400",
      description: "전체 품질 지표를 종합 검증하고 모델 학습용 데이터로의 사용을 최종 승인합니다.",
      gate: "최종 승인 게이트",
      gateDesc: "데이터 품질 기준 충족 확인 및 학습 데이터 사용 최종 승인",
      gateStatus: "pending" as const,
      subProcesses: [
        { name: "4대 품질 지표 종합 검증 (임계값 충족 확인)", status: "pending", owner: "DQM 담당", detail: "완전성/정확성/일관성/적시성 목표 달성 여부 최종 확인" },
        { name: "데이터 무결성 최종 검사 (해시/체크섬)", status: "pending", owner: "데이터 엔지니어", detail: "SHA-256 해시 기반 데이터 무결성 검증" },
        { name: "개인정보 비식별화 적정성 검증", status: "pending", owner: "DPO", detail: "K-익명성(K≥5), L-다양성, T-근접성 충족 확인" },
        { name: "품질 검증 종합 보고서 작성", status: "pending", owner: "DQM 담당", detail: "전 단계 결과 종합 및 잔여 위험 기술" },
        { name: "데이터 품질 위원회 최종 승인", status: "pending", owner: "데이터 품질 위원회", detail: "학습 데이터 사용 적합 판정" },
      ],
      deliverables: ["데이터 품질 종합 보고서", "비식별화 적정성 검증서", "최종 승인서"],
    },
    {
      id: "dq-monitoring",
      name: "6단계: 지속적 모니터링 및 관리",
      icon: Eye,
      status: "pending" as const,
      progress: 0,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      borderColor: "border-rose-400",
      description: "운영 중 데이터 품질을 지속적으로 모니터링하고 드리프트를 감지합니다.",
      gate: "재검증 게이트",
      gateDesc: "품질 저하/드리프트 감지 시 재검증 프로세스 트리거",
      gateStatus: "pending" as const,
      subProcesses: [
        { name: "실시간 품질 대시보드 운영", status: "pending", owner: "운영팀", detail: "품질 지표 실시간 시각화 및 알림" },
        { name: "데이터 드리프트 감지 (PSI/KL Divergence)", status: "pending", owner: "ML 엔지니어", detail: "주간 PSI 모니터링, 임계값 0.2 초과 시 알림" },
        { name: "정기 품질 재검증 (월간/분기별)", status: "pending", owner: "DQM 담당", detail: "월간 자동 검증 + 분기별 수동 심층 검토" },
        { name: "신규 데이터 소스 품질 온보딩", status: "pending", owner: "데이터 거버넌스", detail: "신규 데이터 유입 시 품질 기준 적용 및 검증" },
        { name: "품질 이슈 대응 및 근본 원인 분석 (RCA)", status: "pending", owner: "DQM 담당", detail: "이슈 발생 시 RCA 수행 및 재발 방지 조치" },
      ],
      deliverables: ["월간 품질 모니터링 보고서", "드리프트 감지 보고서", "품질 이슈 RCA 보고서"],
    },
  ], []);

  // 데이터 품질 RACI 매트릭스 데이터
  const dqRaciData = useMemo(() => [
    { role: "데이터 품질 관리자 (DQM)", values: ["R", "R", "R", "C", "R", "R"] },
    { role: "데이터 엔지니어", values: ["C", "R", "R", "C", "R", "C"] },
    { role: "데이터 분석가", values: ["I", "R", "C", "R", "C", "I"] },
    { role: "ML 엔지니어", values: ["I", "C", "I", "R", "I", "C"] },
    { role: "AI 윤리팀", values: ["I", "I", "I", "R", "C", "I"] },
    { role: "DPO (개인정보보호)", values: ["C", "I", "I", "C", "R", "C"] },
    { role: "데이터 품질 위원회", values: ["A", "A", "A", "A", "A", "A"] },
    { role: "운영팀", values: ["I", "I", "I", "I", "I", "R"] },
  ], []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'critical':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'balanced':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'imbalanced':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedCount = dataQualityChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / dataQualityChecklist.length) * 100);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              데이터 품질 검증
            </h1>
            <p className="text-muted-foreground mt-1">
              AI 모델 학습 데이터의 품질 평가 및 이상 데이터 감시 (TTA 2023 요구사항 04, 05, 06)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              보고서 다운로드
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              설정
            </Button>
          </div>
        </div>

        {/* Solution Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">데이터 품질 검증 솔루션</h3>
                    <p className="text-sm text-white/80">
                      TTA 2023 기반 6단계 자동화 품질 검증 - 프로파일링, 이상탐지, 편향 검증, 지속 모니터링
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-white/15 border-white/30 text-white hover:bg-white/25 gap-2 border">
                        <Upload className="w-4 h-4" />
                        데이터 업로드
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Database className="w-5 h-5 text-cyan-600" />
                          데이터 업로드 / 경로 지정
                        </DialogTitle>
                        <DialogDescription>
                          품질 검증을 수행할 데이터 파일을 업로드하거나 데이터 경로를 지정하세요.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        {/* Drag & Drop Zone */}
                        <div
                          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                            isDragging
                              ? "border-cyan-500 bg-cyan-50 scale-[1.02]"
                              : "border-border hover:border-cyan-400 hover:bg-muted/30"
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            multiple
                            accept=".csv,.parquet,.json,.xlsx,.xls,.tsv,.txt"
                            onChange={handleFileSelect}
                          />
                          <div className="flex flex-col items-center gap-3">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                              isDragging ? "bg-cyan-100" : "bg-muted"
                            }`}>
                              <Upload className={`w-8 h-8 ${isDragging ? "text-cyan-600" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">파일을 드래그하거나 클릭하여 선택</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                CSV, Parquet, JSON, Excel, TSV 지원 (최대 500MB)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">또는</span>
                          </div>
                        </div>

                        {/* Folder / Path Input */}
                        <div className="space-y-3">
                          <label className="text-sm font-semibold flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-amber-500" />
                            폴더 경로 / 데이터 소스 지정
                          </label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="예: /data/training/2026-q1 또는 s3://bucket/datasets/"
                              value={folderPath}
                              onChange={(e) => setFolderPath(e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              onClick={handleFolderPathSubmit}
                              disabled={!folderPath.trim()}
                              className="gap-2 bg-cyan-600 hover:bg-cyan-700"
                            >
                              <FolderOpen className="w-4 h-4" />
                              불러오기
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "로컬 파일시스템", icon: HardDrive },
                              { label: "S3 / GCS", icon: Database },
                              { label: "HDFS", icon: HardDrive },
                              { label: "JDBC (DB)", icon: Table },
                            ].map((source) => {
                              const SrcIcon = source.icon;
                              return (
                                <Badge
                                  key={source.label}
                                  variant="outline"
                                  className="text-xs cursor-pointer hover:bg-muted transition-colors gap-1.5 py-1"
                                  onClick={() => setFolderPath(
                                    source.label === "S3 / GCS" ? "s3://my-bucket/datasets/" :
                                    source.label === "JDBC (DB)" ? "jdbc:postgresql://host:5432/db" :
                                    source.label === "HDFS" ? "hdfs://namenode:9000/data/" :
                                    "/data/training/"
                                  )}
                                >
                                  <SrcIcon className="w-3 h-3" />
                                  {source.label}
                                </Badge>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Select - Folder Browser Simulation */}
                        <div
                          className="p-3 border rounded-xl hover:bg-muted/30 cursor-pointer transition-colors flex items-center gap-3"
                          onClick={() => {
                            // Trigger folder select via webkitdirectory
                            folderInputRef.current?.click();
                          }}
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">폴더 선택 (로컬)</p>
                            <p className="text-xs text-muted-foreground">로컬 폴더를 선택하여 내부 모든 데이터 파일을 불러옵니다</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          <input
                            ref={folderInputRef}
                            type="file"
                            className="hidden"
                            // @ts-ignore - webkitdirectory is non-standard but widely supported
                            webkitdirectory=""
                            multiple
                            onChange={handleFileSelect}
                          />
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    className="bg-white text-cyan-700 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => navigate("/tech-review/dq-flow/dq-plan")}
                  >
                    검증 프로세스 시작
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Uploaded Data Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-cyan-600" />
                    등록된 데이터셋
                    <Badge variant="secondary" className="text-xs ml-1">{uploadedFiles.length}</Badge>
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => setIsUploadDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    추가
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <AnimatePresence>
                    {uploadedFiles.map((file, idx) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors group"
                      >
                        {/* File Icon */}
                        <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          {getFileIcon(file.type)}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <Badge variant="outline" className="text-[10px] shrink-0 uppercase">{file.type}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                            {file.records && (
                              <span className="text-xs text-muted-foreground">{file.records.toLocaleString()} records</span>
                            )}
                            <span className="text-xs text-muted-foreground">{file.addedAt.toLocaleDateString()}</span>
                          </div>

                          {/* Upload Progress */}
                          {(file.status === 'uploading' || file.status === 'analyzing') && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                <motion.div
                                  className={`h-full rounded-full ${file.status === 'analyzing' ? 'bg-purple-500' : 'bg-cyan-500'}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: file.status === 'analyzing' ? '100%' : `${file.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                {file.status === 'analyzing' ? '분석 중...' : `${Math.round(file.progress)}%`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Quality Score */}
                        {file.quality && file.status === 'completed' && (
                          <div className="text-center shrink-0">
                            <div className={`text-lg font-bold ${
                              file.quality >= 98 ? "text-green-600" :
                              file.quality >= 95 ? "text-blue-600" :
                              file.quality >= 90 ? "text-amber-600" :
                              "text-red-600"
                            }`}>
                              {file.quality}%
                            </div>
                            <p className="text-[10px] text-muted-foreground">품질 점수</p>
                          </div>
                        )}

                        {/* Status Badge */}
                        <Badge className={`text-[10px] shrink-0 ${
                          file.status === 'completed' ? 'bg-green-100 text-green-700 border-green-300' :
                          file.status === 'analyzing' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                          file.status === 'uploading' ? 'bg-cyan-100 text-cyan-700 border-cyan-300' :
                          'bg-red-100 text-red-700 border-red-300'
                        }`}>
                          {file.status === 'completed' && '검증완료'}
                          {file.status === 'analyzing' && '분석중'}
                          {file.status === 'uploading' && '업로드중'}
                          {file.status === 'error' && '오류'}
                        </Badge>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="전체 데이터 품질"
            value="97.9%"
            change="+0.3%"
            trend="up"
          />
          <MetricCard
            title="완전성"
            value="98.5%"
            change="+0.2%"
            trend="up"
          />
          <MetricCard
            title="일관성"
            value="99.1%"
            change="±0.0%"
            trend="up"
          />
          <MetricCard
            title="이상 데이터"
            value="16,960건"
            change="-245"
            trend="down"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="metrics" className="data-[state=active]:bg-background">
                품질 메트릭
              </TabsTrigger>
              <TabsTrigger value="profiling" className="data-[state=active]:bg-background">
                데이터 프로파일링
              </TabsTrigger>
              <TabsTrigger value="anomaly" className="data-[state=active]:bg-background">
                이상 데이터
              </TabsTrigger>
              <TabsTrigger value="bias" className="data-[state=active]:bg-background">
                편향 감지
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                체크리스트
              </TabsTrigger>
              <TabsTrigger value="process" className="data-[state=active]:bg-background">
                <Workflow className="w-4 h-4 mr-1.5" />
                검증 프로세스
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  className="pl-9 bg-card"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tab: Quality Metrics */}
          <TabsContent value="metrics" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataQualityMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status === 'compliant' ? '준수' : metric.status === 'warning' ? '주의' : '위험'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">현재</span>
                          <span className="text-2xl font-bold">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">목표</span>
                        <span className="font-medium">{metric.target}%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Data Profiling */}
          <TabsContent value="profiling" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>데이터셋 프로파일링 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">데이터셋</th>
                        <th className="text-right py-3 px-4 font-semibold">총 레코드</th>
                        <th className="text-right py-3 px-4 font-semibold">완전성</th>
                        <th className="text-right py-3 px-4 font-semibold">일관성</th>
                        <th className="text-right py-3 px-4 font-semibold">중복</th>
                        <th className="text-left py-3 px-4 font-semibold">업데이트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataProfilingResults.map((result) => (
                        <tr key={result.datasetId} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{result.datasetName}</div>
                            <div className="text-xs text-muted-foreground">{result.datasetId}</div>
                          </td>
                          <td className="text-right py-3 px-4 font-medium">{(result.totalRecords / 1000000).toFixed(2)}M</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="outline" className="bg-green-500/10 text-green-700">
                              {result.completeness.toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-700">
                              {result.consistency.toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">{result.duplicates}</td>
                          <td className="py-3 px-4 text-muted-foreground">{result.lastUpdated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Anomaly Detection */}
          <TabsContent value="anomaly" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>이상 데이터 탐지 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anomalyDetectionSummary.map((anomaly, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{anomaly.type}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{anomaly.description}</p>
                        </div>
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity === 'low' ? '낮음' : anomaly.severity === 'medium' ? '중간' : '높음'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <span className="text-sm text-muted-foreground">발견 건수</span>
                          <div className="text-xl font-bold">{anomaly.count.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">비율</span>
                          <div className="text-xl font-bold">{anomaly.percentage.toFixed(3)}%</div>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${Math.min(anomaly.percentage * 10, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Bias Detection */}
          <TabsContent value="bias" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>편향 감지 보고서</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {['성별 (Gender)', '연령대 (Age Group)', '지역 (Region)'].map((category) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-4">{category}</h4>
                      <div className="space-y-3">
                        {biasDetectionReport
                          .filter(item => item.category === category)
                          .map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">{item.group}</span>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status === 'balanced' ? '균형' : '불균형'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-6">
                                <div>
                                  <span className="text-sm text-muted-foreground">표현도</span>
                                  <div className="text-lg font-semibold">{item.representationRate.toFixed(1)}%</div>
                                </div>
                                <div className="flex-1">
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                      style={{ width: `${item.representationRate}%` }}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">불균형 지수</span>
                                  <div className="text-lg font-semibold">{item.disparityIndex.toFixed(2)}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Checklist */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>TTA 2023 준수 체크리스트</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{dataQualityChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataQualityChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all ${
                        item.completed
                          ? 'bg-green-50/50 border-green-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{item.item}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <div>
                          <Badge className={item.completed ? 'bg-green-600' : 'bg-amber-600'}>
                            {item.completed ? '완료' : '진행 중'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Tab: Process */}
          <TabsContent value="process" className="mt-0 space-y-6">
            {/* Process Overview Banner */}
            <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white border-0">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                      <Workflow className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">데이터 품질 검증 프로세스</h3>
                      <p className="text-sm text-white/80">
                        TTA 2023 요구사항 04/05/06 기반 6단계 체계적 품질 검증 프로세스
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-xs text-white/70">단계</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">6</p>
                      <p className="text-xs text-white/70">게이트</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">32</p>
                      <p className="text-xs text-white/70">세부 활동</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {Math.round(dqProcessStages.reduce((sum, s) => sum + s.progress, 0) / dqProcessStages.length)}%
                      </p>
                      <p className="text-xs text-white/70">진행률</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Process Flow Timeline */}
            <div className="space-y-0">
              {dqProcessStages.map((stage, idx) => {
                const StageIcon = stage.icon;
                const isExpanded = expandedStage === stage.id;
                const isCompleted = stage.status === "completed";
                const isInProgress = stage.status === "in-progress";

                return (
                  <React.Fragment key={stage.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative flex items-stretch gap-4"
                    >
                      {/* Timeline */}
                      <div className="flex flex-col items-center w-10 shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                          isCompleted ? "bg-green-500 border-green-500 text-white" :
                          isInProgress ? "bg-amber-500 border-amber-500 text-white animate-pulse" :
                          "bg-gray-100 border-gray-300 text-gray-400"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isInProgress ? (
                            <CircleDot className="w-5 h-5" />
                          ) : (
                            <StageIcon className="w-5 h-5" />
                          )}
                        </div>
                        {idx < dqProcessStages.length - 1 && (
                          <div className={`w-0.5 flex-1 min-h-[24px] ${isCompleted ? "bg-green-400" : "bg-gray-200"}`} />
                        )}
                      </div>

                      {/* Stage Card */}
                      <div className={`flex-1 mb-3 rounded-lg border transition-all cursor-pointer ${
                        isExpanded ? `${stage.bgColor} ${stage.borderColor} shadow-md` : "hover:bg-muted/30"
                      } ${isInProgress ? "ring-2 ring-amber-300" : ""}`}
                        onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stage.bgColor}`}>
                                <StageIcon className={`w-4 h-4 ${stage.color}`} />
                              </div>
                              <h3 className="font-semibold text-sm">{stage.name}</h3>
                              <Badge className={`text-[10px] ${
                                isCompleted ? "bg-green-100 text-green-700" :
                                isInProgress ? "bg-amber-100 text-amber-700" :
                                "bg-gray-100 text-gray-500"
                              }`}>
                                {isCompleted ? "완료" : isInProgress ? "진행 중" : "대기"}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-medium">{stage.progress}%</span>
                              {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground ml-10">{stage.description}</p>

                          {/* Progress Bar */}
                          <div className="ml-10 mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-gray-200/60 rounded-full h-1.5">
                              <motion.div
                                className={`h-full rounded-full ${
                                  stage.progress === 100 ? "bg-green-500" : stage.progress > 0 ? "bg-amber-500" : "bg-gray-300"
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${stage.progress}%` }}
                                transition={{ duration: 0.8 }}
                              />
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
                                <div className="mt-4 ml-10 space-y-4">
                                  {/* Sub-processes */}
                                  <div className="space-y-2">
                                    {stage.subProcesses.map((sub, subIdx) => (
                                      <motion.div
                                        key={subIdx}
                                        className="flex items-start gap-3 p-3 rounded-lg bg-white/60 hover:bg-white/80 transition-colors"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: subIdx * 0.05 }}
                                      >
                                        <div className="mt-0.5">
                                          {sub.status === "completed" ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                          ) : sub.status === "in-progress" ? (
                                            <CircleDot className="w-4 h-4 text-amber-500 animate-pulse" />
                                          ) : (
                                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                          )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-medium">{sub.name}</p>
                                          <p className="text-[11px] text-muted-foreground mt-0.5">{sub.detail}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="text-[10px] text-muted-foreground">{sub.owner}</span>
                                          <Badge variant="outline" className={`text-[9px] ${
                                            sub.status === "completed" ? "border-green-300 text-green-600" :
                                            sub.status === "in-progress" ? "border-amber-300 text-amber-600" :
                                            "border-gray-300 text-gray-500"
                                          }`}>
                                            {sub.status === "completed" ? "완료" : sub.status === "in-progress" ? "진행 중" : "대기"}
                                          </Badge>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>

                                  {/* Deliverables */}
                                  <div>
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">산출물</p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {stage.deliverables.map((d, dIdx) => (
                                        <Badge key={dIdx} variant="outline" className="text-[10px] bg-white/60">
                                          <FileText className="w-2.5 h-2.5 mr-1" />
                                          {d}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>

                    {/* Gate */}
                    {idx < dqProcessStages.length - 1 && (
                      <div className="flex items-center gap-4 ml-[11px] mb-1">
                        <div className="w-[18px]" />
                        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded border border-dashed border-orange-300 bg-orange-50/50">
                          <Shield className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-semibold text-orange-700">{stage.gate}</p>
                            <p className="text-[9px] text-orange-600/80 truncate">{stage.gateDesc}</p>
                          </div>
                          {stage.gateStatus === "passed" ? (
                            <Badge className="text-[9px] bg-green-100 text-green-700 border-green-300">통과</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] border-orange-300 text-orange-600">대기</Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* RACI Matrix */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                  데이터 품질 검증 RACI 매트릭스
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">역할 / 단계</th>
                        <th className="p-2 text-center font-semibold">계획</th>
                        <th className="p-2 text-center font-semibold">프로파일링</th>
                        <th className="p-2 text-center font-semibold">이상 탐지</th>
                        <th className="p-2 text-center font-semibold bg-purple-50">편향 검증</th>
                        <th className="p-2 text-center font-semibold">최종 승인</th>
                        <th className="p-2 text-center font-semibold">모니터링</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dqRaciData.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b hover:bg-muted/30">
                          <td className="p-2 font-medium">{row.role}</td>
                          {row.values.map((v, vIdx) => (
                            <td key={vIdx} className={`p-2 text-center ${vIdx === 3 ? "bg-purple-50/50" : ""}`}>
                              <Badge className={`text-[10px] w-6 h-6 rounded-full p-0 flex items-center justify-center mx-auto ${
                                v === "R" ? "bg-blue-100 text-blue-700 border-blue-300" :
                                v === "A" ? "bg-red-100 text-red-700 border-red-300" :
                                v === "C" ? "bg-green-100 text-green-700 border-green-300" :
                                "bg-gray-100 text-gray-500 border-gray-300"
                              }`}>
                                {v}
                              </Badge>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Badge className="bg-red-100 text-red-700 text-[9px] px-1">A</Badge> Accountable</span>
                    <span className="flex items-center gap-1"><Badge className="bg-blue-100 text-blue-700 text-[9px] px-1">R</Badge> Responsible</span>
                    <span className="flex items-center gap-1"><Badge className="bg-green-100 text-green-700 text-[9px] px-1">C</Badge> Consulted</span>
                    <span className="flex items-center gap-1"><Badge className="bg-gray-100 text-gray-500 text-[9px] px-1">I</Badge> Informed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PDCA Cycle */}
            <Card className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 border-emerald-200/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-600" />
                  데이터 품질 지속 개선 사이클 (PDCA)
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
                      items: ["품질 KPI 목표 재설정", "신규 데이터 소스 품질 요건 정의", "검증 규칙 업데이트 계획"]
                    },
                    {
                      title: "Do (실행)",
                      icon: Play,
                      color: "text-green-600",
                      bg: "bg-green-100",
                      items: ["자동화 품질 검증 실행", "이상 데이터 처리 수행", "편향성 완화 기법 적용"]
                    },
                    {
                      title: "Check (점검)",
                      icon: Search,
                      color: "text-amber-600",
                      bg: "bg-amber-100",
                      items: ["품질 지표 달성률 확인", "드리프트 감지 결과 분석", "잔여 이상/편향 현황 검토"]
                    },
                    {
                      title: "Act (조치)",
                      icon: Zap,
                      color: "text-red-600",
                      bg: "bg-red-100",
                      items: ["품질 규칙 보완/추가", "처리 로직 최적화", "근본 원인 분석(RCA) 수행"]
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
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${item.bg}`}>
                          <ItemIcon className={`w-4 h-4 ${item.color}`} />
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

            {/* Key Quality Standards */}
            <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border-blue-200/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  데이터 품질 검증 기준 (TTA 2023 기반)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-100 text-blue-700 text-xs">요구사항 04</Badge>
                      <h4 className="font-semibold text-sm">데이터 정보 관리</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>데이터 출처/수집 방법 문서화</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>메타데이터 체계적 관리</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                        <span>데이터 버전 관리 (DVC)</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-amber-100 text-amber-700 text-xs">요구사항 05</Badge>
                      <h4 className="font-semibold text-sm">이상 데이터 감시</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
                        <span>이상 데이터 자동 탐지 체계</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
                        <span>결측치/극값/중복 처리 절차</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-amber-400 shrink-0" />
                        <span>처리 결과 검토 및 이력 관리</span>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-purple-100 text-purple-700 text-xs">요구사항 06</Badge>
                      <h4 className="font-semibold text-sm">편향성 관리</h4>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-purple-400 shrink-0" />
                        <span>보호 속성별 편향성 평가</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-purple-400 shrink-0" />
                        <span>편향 완화 기법 적용</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-purple-400 shrink-0" />
                        <span>지속적 편향 모니터링 체계</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Guidelines Section */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              데이터 품질 가이드라인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>정규성 검사:</strong> 데이터가 정의된 스키마와 포맷을 준수하는지 확인</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>완전성 평가:</strong> 필수 필드의 값이 모두 채워져 있는지 검증</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>일관성 유지:</strong> 데이터 타입, 단위, 범위가 일관되게 유지되도록 관리</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>신선도 관리:</strong> 데이터가 최신 상태로 유지되도록 정기 업데이트</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>편향 모니터링:</strong> 특정 집단이 과대/과소 표현되지 않도록 지속 감시</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="dataQuality"
        title="데이터 품질 검증 AI 어시스턴트"
        contextData={JSON.stringify({
          overallQuality: '97.9%',
          completeness: '98.5%',
          consistency: '99.1%',
          anomaliesDetected: 16960,
          datasets: dataProfilingResults.length,
          checklistCompletion: completedPercentage,
          biasStatus: 'monitoring',
        })}
      />
    </Layout>
  );
};

export default DataQualityReview;
