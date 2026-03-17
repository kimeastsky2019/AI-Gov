import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Settings,
  Lock,
  Key,
  Zap,
  AlertCircle,
  Brain,
  Sparkles,
  Bot,
  Loader2,
  Lightbulb,
  ChevronRight,
  Eye,
  FileText,
  Activity,
  RefreshCw,
  Scan
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'fixed' | 'mitigated' | 'open';
  discoveryDate: string;
  description: string;
}

interface AdversarialTest {
  testId: string;
  attackType: string;
  successRate: number;
  robustness: number;
  mitigationStatus: string;
}

interface AccessControlAudit {
  system: string;
  totalAccounts: number;
  authorizedAccess: number;
  unauthorizedAttempts: number;
  complianceRate: number;
  lastAudit: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  target: number;
  description: string;
  status: 'compliant' | 'warning' | 'critical';
}

const SecurityReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vulnerabilities");

  // TTA 요구사항 07 및 금융 AI 라-3 기반 체크리스트
  const securityChecklist = useMemo(() => [
    {
      id: "tta07-sec-01",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.paramProtect'),
      completed: true,
      description: t('tech.security.checklist.desc.paramProtect')
    },
    {
      id: "tta07-sec-02",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.encryption'),
      completed: true,
      description: t('tech.security.checklist.desc.encryption')
    },
    {
      id: "tta07-sec-03",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.integrity'),
      completed: true,
      description: t('tech.security.checklist.desc.integrity')
    },
    {
      id: "tta07-sec-04",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.reverseEng'),
      completed: false,
      description: t('tech.security.checklist.desc.reverseEng')
    },
    {
      id: "finance-ra3-01",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.accessControl'),
      completed: true,
      description: t('tech.security.checklist.desc.accessControl')
    },
    {
      id: "finance-ra3-02",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.logging'),
      completed: true,
      description: t('tech.security.checklist.desc.logging')
    },
    {
      id: "finance-ra3-03",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.adversarial'),
      completed: true,
      description: t('tech.security.checklist.desc.adversarial')
    },
    {
      id: "finance-ra3-04",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.audit'),
      completed: true,
      description: t('tech.security.checklist.desc.audit')
    },
    {
      id: "finance-ra3-05",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.incident'),
      completed: true,
      description: t('tech.security.checklist.desc.incident')
    },
  ], [t]);

  // 보안 취약점
  const vulnerabilities = useMemo((): Vulnerability[] => [
    {
      id: "CVE-2024-001",
      name: "모델 파라미터 추출 가능성",
      severity: 'high',
      category: "역공학 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-15",
      description: "쿼리 기반 공격으로 모델 파라미터 부분 추출 가능성 발견 및 완화됨"
    },
    {
      id: "CVE-2024-002",
      name: "멤버십 추론 공격 취약점",
      severity: 'medium',
      category: "프라이버시 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-20",
      description: "학습 데이터 포함 여부 추론 가능 - 차등 프라이버시 기법으로 완화"
    },
    {
      id: "CVE-2024-003",
      name: "데이터 중독 공격 위험",
      severity: 'high',
      category: "데이터 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-10",
      description: "학습 데이터 조작을 통한 모델 왜곡 공격 가능성 - 입력 검증 강화"
    },
    {
      id: "CVE-2024-004",
      name: "API 엔드포인트 인증 부족",
      severity: 'critical',
      category: "접근 제어",
      status: 'fixed',
      discoveryDate: "2024-01-30",
      description: "API 인증 메커니즘 개선으로 해결됨"
    },
    {
      id: "CVE-2024-005",
      name: "적대적 입력에 대한 취약성",
      severity: 'medium',
      category: "견고성 공격",
      status: 'mitigated',
      discoveryDate: "2024-03-01",
      description: "적대적 예제 공격에 대한 방어 강화 중"
    },
  ], []);

  // 적대적 공격 테스트 결과
  const adversarialTests = useMemo((): AdversarialTest[] => [
    {
      testId: "ADV-001",
      attackType: "FGSM (Fast Gradient Sign Method)",
      successRate: 0.15,
      robustness: 0.85,
      mitigationStatus: "적극적 방어"
    },
    {
      testId: "ADV-002",
      attackType: "PGD (Projected Gradient Descent)",
      successRate: 0.22,
      robustness: 0.78,
      mitigationStatus: "강화 필요"
    },
    {
      testId: "ADV-003",
      attackType: "JSMA (Jacobian-based Saliency Map Attack)",
      successRate: 0.18,
      robustness: 0.82,
      mitigationStatus: "적극적 방어"
    },
    {
      testId: "ADV-004",
      attackType: "DeepFool Attack",
      successRate: 0.25,
      robustness: 0.75,
      mitigationStatus: "강화 필요"
    },
    {
      testId: "ADV-005",
      attackType: "Carlini & Wagner (C&W) Attack",
      successRate: 0.28,
      robustness: 0.72,
      mitigationStatus: "강화 필요"
    },
  ], []);

  // 접근 제어 감시
  const accessControlAudits = useMemo((): AccessControlAudit[] => [
    {
      system: "모델 개발 시스템",
      totalAccounts: 28,
      authorizedAccess: 28,
      unauthorizedAttempts: 0,
      complianceRate: 100.0,
      lastAudit: "2024-03-08"
    },
    {
      system: "API 프로덕션 서버",
      totalAccounts: 45,
      authorizedAccess: 45,
      unauthorizedAttempts: 3,
      complianceRate: 99.3,
      lastAudit: "2024-03-09"
    },
    {
      system: "데이터베이스 서버",
      totalAccounts: 12,
      authorizedAccess: 12,
      unauthorizedAttempts: 0,
      complianceRate: 100.0,
      lastAudit: "2024-03-07"
    },
    {
      system: "로그 및 모니터링 시스템",
      totalAccounts: 8,
      authorizedAccess: 8,
      unauthorizedAttempts: 1,
      complianceRate: 98.7,
      lastAudit: "2024-03-06"
    },
  ], []);

  // 보안 지표
  const securityMetrics = useMemo((): SecurityMetric[] => [
    {
      name: t('tech.security.metrics.fixRate'),
      value: 94.4,
      target: 90.0,
      description: t('tech.security.metrics.fixRate.desc'),
      status: 'compliant'
    },
    {
      name: t('tech.security.metrics.access'),
      value: 99.5,
      target: 99.0,
      description: t('tech.security.metrics.access.desc'),
      status: 'compliant'
    },
    {
      name: t('tech.security.metrics.robustness'),
      value: 78.4,
      target: 85.0,
      description: t('tech.security.metrics.robustness.desc'),
      status: 'warning'
    },
    {
      name: t('tech.security.metrics.logging'),
      value: 99.8,
      target: 99.0,
      description: t('tech.security.metrics.logging.desc'),
      status: 'compliant'
    },
  ], [t]);

  // AI 보안 검토 상태
  const [aiScanRunning, setAiScanRunning] = useState(false);
  const [aiScanResult, setAiScanResult] = useState<any>(null);
  const [vulnAnalysis, setVulnAnalysis] = useState<Record<string, any>>({});
  const [analyzingVuln, setAnalyzingVuln] = useState<string | null>(null);
  const [aiChatHistory, setAiChatHistory] = useState<{role:'user'|'ai'; message:string}[]>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const handleAiSecurityScan = () => {
    setAiScanRunning(true);
    setTimeout(() => {
      setAiScanResult({
        score: 82,
        grade: "B+",
        summary: "전반적 보안 수준은 양호하나, 적대적 공격 견고성(78.4%)이 목표(85%) 미달. C&W 공격 방어율 72%로 가장 취약하며, 역공학 방지 대책 미완료 상태입니다.",
        critical: [
          { area: "적대적 견고성", detail: "PGD/DeepFool/C&W 공격 방어율 72~78%로 목표(85%) 미달. Adversarial Training 및 입력 정제(Input Sanitization) 강화 필요", severity: "high" },
          { area: "역공학 방지", detail: "모델 파라미터 추출 방지 대책 미완료(체크리스트 미충족). API 응답 제한 및 워터마킹 적용 권장", severity: "high" },
          { area: "멤버십 추론", detail: "차등 프라이버시(DP) 적용으로 완화되었으나, epsilon=1.0으로 프라이버시 예산 재검토 필요", severity: "medium" },
        ],
        passed: [
          "API 인증/인가 체계 (OAuth2 + mTLS) 정상",
          "접근 제어 준수율 99.5% 달성",
          "감사 로그 99.8% 기록 달성",
          "데이터 암호화 (AES-256 + TLS 1.3) 정상",
        ],
        recommendations: [
          "C&W 공격 대응: Adversarial Training with PGD-AT 적용 (예상 방어율 +15%p)",
          "역공학 방지: Model Watermarking + API Rate Limiting (분당 100회 제한)",
          "정기 펜테스트: 분기별 Red Team 모의 공격 훈련 실시",
          "제로데이 대응: NIST AI RMF 기반 보안 프레임워크 도입",
        ],
      });
      setAiScanRunning(false);
    }, 3000);
  };

  const handleAnalyzeVuln = (vulnId: string) => {
    setAnalyzingVuln(vulnId);
    const vuln = vulnerabilities.find(v => v.id === vulnId);
    setTimeout(() => {
      setVulnAnalysis(prev => ({
        ...prev,
        [vulnId]: {
          riskScore: vuln?.severity === 'critical' ? 9.2 : vuln?.severity === 'high' ? 7.5 : 5.3,
          exploitability: vuln?.severity === 'critical' ? "높음 - 공개 익스플로잇 존재" : "중간 - 전문 지식 필요",
          impact: vuln?.category === "접근 제어" ? "데이터 유출, 무단 모델 접근" : vuln?.category === "역공학 공격" ? "모델 IP 유출, 경쟁사 복제 위험" : "학습 데이터 프라이버시 침해",
          mitigation: vuln?.status === 'fixed' ? "완료 - 추가 조치 불필요" : vuln?.status === 'mitigated' ? "부분 완화 - 추가 강화 권장" : "미조치 - 즉시 대응 필요",
          aiRecommendation: vuln?.category === "역공학 공격" ? "API 응답에서 확률값 소수점 3자리로 제한 + 요청 빈도 제한(Rate Limiting) 적용" :
            vuln?.category === "프라이버시 공격" ? "Differential Privacy epsilon 값을 0.5로 하향 조정하여 프라이버시 보호 강화" :
            vuln?.category === "데이터 공격" ? "학습 데이터 무결성 해시 검증 + 이상 데이터 자동 격리 파이프라인 구축" :
            "정기 보안 감사 및 침투 테스트 수행 권장",
          cveRef: vuln?.severity === 'critical' ? "NIST AI 600-1, OWASP ML Top 10 - ML06" : "MITRE ATLAS - AML.T0024",
        },
      }));
      setAnalyzingVuln(null);
    }, 1500);
  };

  const handleAiChat = () => {
    if (!aiChatInput.trim()) return;
    const msg = aiChatInput;
    setAiChatHistory(prev => [...prev, { role: 'user', message: msg }]);
    setAiChatInput("");
    setIsChatting(true);
    setTimeout(() => {
      let response = "";
      const lower = msg.toLowerCase();
      if (lower.includes("취약") || lower.includes("vulnerab")) {
        response = "현재 5건의 취약점이 등록되어 있습니다:\n- Critical: 1건 (API 인증 - 수정완료)\n- High: 2건 (모델 추출, 데이터 중독 - 완화됨)\n- Medium: 2건 (멤버십 추론, 적대적 입력 - 완화 중)\n\n가장 시급한 조치: 역공학 방지 대책 수립 (체크리스트 미충족)";
      } else if (lower.includes("적대") || lower.includes("adversar") || lower.includes("공격")) {
        response = "적대적 공격 테스트 결과 분석:\n\n| 공격 유형 | 방어율 | 상태 |\n|----------|--------|------|\n| FGSM | 85% | 양호 |\n| PGD | 78% | 강화 필요 |\n| JSMA | 82% | 양호 |\n| DeepFool | 75% | 강화 필요 |\n| C&W | 72% | 강화 필요 |\n\n평균 방어율 78.4%로 목표(85%) 미달.\n권장: PGD-AT(Adversarial Training) 적용 → 예상 개선 +12~15%p";
      } else if (lower.includes("접근") || lower.includes("access")) {
        response = "접근 제어 현황:\n- 전체 준수율: 99.5%\n- 비인가 접근 시도: 4건 (API 서버 3건, 모니터링 1건)\n- 모든 시도 차단 완료\n\n권장 조치:\n1. API 서버 비인가 시도 3건의 출처 IP 분석\n2. 비정상 접근 패턴 자동 감지 규칙 강화\n3. 분기별 접근 권한 재검토 수행";
      } else if (lower.includes("개선") || lower.includes("권장")) {
        response = "보안 강화 우선순위:\n\n1. **[긴급] 적대적 견고성 강화**\n   - PGD-AT 적용 (2주 소요)\n   - 입력 정제(Denoising) 레이어 추가\n\n2. **[높음] 역공학 방지**\n   - API Rate Limiting 적용\n   - Model Watermarking 도입\n\n3. **[중간] 프라이버시 강화**\n   - DP epsilon 0.5로 조정\n   - Federated Learning 검토\n\n4. **[정기] 보안 거버넌스**\n   - 분기별 Red Team 훈련\n   - NIST AI RMF 프레임워크 도입";
      } else {
        response = `"${msg}"에 대한 보안 분석입니다.\n\n현재 보안 점수 82/100(B+등급). 취약점 수정률 94.4%, 접근 제어 99.5%로 기본 보안은 양호하나, 적대적 공격 방어율(78.4%)과 역공학 방지 미완료가 주요 개선 과제입니다. 구체적 영역에 대해 질문해 주세요.`;
      }
      setAiChatHistory(prev => [...prev, { role: 'ai', message: response }]);
      setIsChatting(false);
    }, 1800);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50/30';
      case 'high':
        return 'border-orange-300 bg-orange-50/30';
      case 'medium':
        return 'border-amber-300 bg-amber-50/30';
      case 'low':
        return 'border-yellow-300 bg-yellow-50/30';
      default:
        return 'border-gray-300 bg-gray-50/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed':
        return 'bg-green-600';
      case 'mitigated':
        return 'bg-blue-600';
      case 'open':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const completedCount = securityChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / securityChecklist.length) * 100);

  const criticalVulnerabilities = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highVulnerabilities = vulnerabilities.filter(v => v.severity === 'high').length;
  const fixedVulnerabilities = vulnerabilities.filter(v => v.status === 'fixed').length;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('tech.security.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('tech.security.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('tech.security.btnDownloadReport')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              {t('tech.security.btnSettings')}
            </Button>
          </div>
        </div>

        {/* AI Security Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-slate-700 via-gray-800 to-slate-900 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                    <Shield className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">AI 보안 검토 솔루션</h3>
                    <p className="text-sm text-white/70">
                      AI가 취약점을 자동 진단하고, 적대적 공격 방어 전략을 제시하며, 보안 규제 준수를 검증합니다
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-green-500/20 border-green-400/30 text-green-300 hover:bg-green-500/30 gap-2 border"
                    onClick={handleAiSecurityScan} disabled={aiScanRunning}>
                    {aiScanRunning ? <><Loader2 className="w-4 h-4 animate-spin" />스캔 중...</> : <><Scan className="w-4 h-4" />AI 보안 스캔</>}
                  </Button>
                  <Button className="bg-white text-gray-800 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => setActiveTab("ai-review")}>
                    <Brain className="w-4 h-4" />AI 보안 검토
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Scan Result */}
        <AnimatePresence>
          {aiScanResult && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="border-0 shadow-xl ring-1 ring-gray-200/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-slate-700 to-gray-900 text-white shadow-lg">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">AI 보안 스캔 결과</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">자동화 보안 진단 보고서</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className={cn("text-3xl font-black", aiScanResult.score >= 90 ? "text-green-600" : aiScanResult.score >= 80 ? "text-blue-600" : "text-amber-600")}>
                          {aiScanResult.grade}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{aiScanResult.score}/100</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setAiScanResult(null)}>닫기</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  <div className="p-3 bg-slate-50 rounded-xl border">
                    <p className="text-sm leading-relaxed"><Sparkles className="w-4 h-4 inline mr-1.5 text-slate-500" />{aiScanResult.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> 주요 발견 사항
                      </h4>
                      {aiScanResult.critical.map((c: any, i: number) => (
                        <div key={i} className={cn("p-2.5 rounded-lg border mb-1.5 text-xs",
                          c.severity === "high" ? "bg-red-50/50 border-red-200" : "bg-amber-50/50 border-amber-200")}>
                          <p className="font-semibold">{c.area}</p>
                          <p className="text-muted-foreground mt-0.5">{c.detail}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 통과 항목
                      </h4>
                      {aiScanResult.passed.map((p: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 p-2 text-xs text-foreground/70">
                          <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />{p}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> AI 권장 조치
                    </h4>
                    <div className="space-y-1.5">
                      {aiScanResult.recommendations.map((r: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg text-xs">
                          <Zap className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />{r}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('tech.security.metricFixRate')}
            value="94.4%"
            change="+5.2%"
            trend="up"
          />
          <MetricCard
            title={t('tech.security.metricVulnerabilities')}
            value="5건"
            change="-1"
            trend="down"
          />
          <MetricCard
            title={t('tech.security.metricAccess')}
            value="99.5%"
            change="±0.0%"
            trend="up"
          />
          <MetricCard
            title={t('tech.security.metricLogging')}
            value="99.8%"
            change="+0.2%"
            trend="up"
          />
        </div>

        {/* Alert for Critical Issues */}
        {criticalVulnerabilities > 0 && (
          <div className="bg-red-50/50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">{t('tech.security.alert.title')}</h3>
              <p className="text-sm text-red-800 mt-1">
                {criticalVulnerabilities}{t('tech.security.alert.msg')}
              </p>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-background">
                {t('tech.security.tabVulnerabilities')}
              </TabsTrigger>
              <TabsTrigger value="adversarial" className="data-[state=active]:bg-background">
                {t('tech.security.tabAdversarial')}
              </TabsTrigger>
              <TabsTrigger value="access" className="data-[state=active]:bg-background">
                {t('tech.security.tabAccess')}
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                {t('tech.security.tabChecklist')}
              </TabsTrigger>
              <TabsTrigger value="ai-review" className="data-[state=active]:bg-background">
                <Brain className="w-4 h-4 mr-1.5" />AI 보안 검토
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tech.security.search')}
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

          {/* Tab: Vulnerabilities */}
          <TabsContent value="vulnerabilities" className="mt-0 space-y-6">
            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityMetrics.map((metric, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                      <Badge className={metric.status === 'compliant' ? 'bg-green-600' : 'bg-amber-600'}>
                        {metric.status === 'compliant' ? t('tech.security.status.compliant') : t('tech.security.status.warning')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{t('tech.security.label.current')}</span>
                          <span className="text-2xl font-bold">{metric.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              metric.value >= metric.target
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tech.security.label.target')}</span>
                        <span className="font-medium">{metric.target.toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Vulnerabilities List */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.vulner.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilities.map((vuln, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 transition-all ${getSeverityBorder(vuln.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{vuln.name}</h4>
                              <Badge className={getSeverityColor(vuln.severity)}>
                                {vuln.severity === 'critical' ? t('tech.security.vulner.severity.critical') : vuln.severity === 'high' ? t('tech.security.vulner.severity.high') : vuln.severity === 'medium' ? t('tech.security.vulner.severity.medium') : t('tech.security.vulner.severity.low')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{vuln.category}</span>
                              <span>•</span>
                              <span>{vuln.id}</span>
                              <span>•</span>
                              <span>{vuln.discoveryDate}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(vuln.status)}>
                          {vuln.status === 'fixed' ? t('tech.security.vulner.status.fixed') : vuln.status === 'mitigated' ? t('tech.security.vulner.status.mitigated') : t('tech.security.vulner.status.open')}
                        </Badge>
                      </div>
                      {/* AI Analysis */}
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-slate-600 hover:bg-slate-50"
                          onClick={() => handleAnalyzeVuln(vuln.id)} disabled={analyzingVuln === vuln.id}>
                          {analyzingVuln === vuln.id ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />분석중</> :
                           vulnAnalysis[vuln.id] ? <><Eye className="w-3.5 h-3.5" />결과보기</> :
                           <><Brain className="w-3.5 h-3.5" />AI 위험 분석</>}
                        </Button>
                      </div>
                      <AnimatePresence>
                        {vulnAnalysis[vuln.id] && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border space-y-2 overflow-hidden">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="p-2 bg-white rounded-lg border">
                                <p className="text-muted-foreground">CVSS 점수</p>
                                <p className={cn("font-bold text-lg", vulnAnalysis[vuln.id].riskScore >= 7 ? "text-red-600" : "text-amber-600")}>{vulnAnalysis[vuln.id].riskScore}</p>
                              </div>
                              <div className="p-2 bg-white rounded-lg border">
                                <p className="text-muted-foreground">악용 가능성</p>
                                <p className="font-medium text-[11px]">{vulnAnalysis[vuln.id].exploitability}</p>
                              </div>
                              <div className="p-2 bg-white rounded-lg border">
                                <p className="text-muted-foreground">영향 범위</p>
                                <p className="font-medium text-[11px]">{vulnAnalysis[vuln.id].impact}</p>
                              </div>
                              <div className="p-2 bg-white rounded-lg border">
                                <p className="text-muted-foreground">완화 상태</p>
                                <p className="font-medium text-[11px]">{vulnAnalysis[vuln.id].mitigation}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                              <Lightbulb className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                              <p className="text-[11px]"><span className="font-semibold">AI 권장:</span> {vulnAnalysis[vuln.id].aiRecommendation}</p>
                            </div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <FileText className="w-3 h-3" /> 참고: {vulnAnalysis[vuln.id].cveRef}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Adversarial Tests */}
          <TabsContent value="adversarial" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.adversarial.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adversarialTests.map((test, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{test.attackType}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{test.testId}</p>
                        </div>
                        <Badge className={test.robustness >= 0.80 ? 'bg-green-600' : test.robustness >= 0.70 ? 'bg-amber-600' : 'bg-red-600'}>
                          {test.mitigationStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">{t('tech.security.adversarial.label.successRate')}</span>
                          <div className="text-xl font-bold">{(test.successRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">{t('tech.security.adversarial.label.robustness')}</span>
                          <div className="text-xl font-bold">{(test.robustness * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t('tech.security.adversarial.label.successRate')}</span>
                            <span className="font-medium">{(test.successRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${test.successRate * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t('tech.security.adversarial.label.robustness')}</span>
                            <span className="font-medium">{(test.robustness * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                test.robustness >= 0.80
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : test.robustness >= 0.70
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                              }`}
                              style={{ width: `${test.robustness * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50/50 border border-amber-300 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">{t('tech.security.adversarial.recommendation')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec3')}</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* Tab: Access Control */}
          <TabsContent value="access" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.access.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">{t('tech.security.access.colSystem')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colTotal')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colAuthorized')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colUnauthorized')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colCompliance')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('tech.security.access.colAudit')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessControlAudits.map((audit, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{audit.system}</td>
                          <td className="text-center py-3 px-4">{audit.totalAccounts}</td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" className="bg-green-500/10 text-green-700">
                              {audit.authorizedAccess}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={audit.unauthorizedAttempts === 0 ? 'bg-green-600' : 'bg-amber-600'}>
                              {audit.unauthorizedAttempts}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4 font-medium">{audit.complianceRate.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{audit.lastAudit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Checklist */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('tech.security.checklist.title')}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{securityChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityChecklist.map((item) => (
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
                            {item.completed ? t('tech.security.checklist.completed') : t('tech.security.checklist.inProgress')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Tab: AI Security Review */}
          <TabsContent value="ai-review" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-base"><Bot className="w-5 h-5 text-slate-700" /> AI 보안 컨설턴트</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">취약점, 적대적 공격, 접근 제어, 보안 강화 방안 등 자유롭게 질문하세요</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                      {aiChatHistory.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-slate-500/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-white flex items-center justify-center shadow-lg border border-slate-200">
                              <Shield className="w-8 h-8 text-slate-700" />
                            </div>
                          </div>
                          <p className="font-semibold">보안에 대해 무엇을 확인할까요?</p>
                          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                            {["취약점 현황 분석", "적대적 공격 방어 현황", "접근 제어 분석", "보안 강화 권장사항"].map(s => (
                              <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-slate-50"
                                onClick={() => setAiChatInput(s)}>{s}</Button>
                            ))}
                          </div>
                        </div>
                      )}
                      {aiChatHistory.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-gray-900 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-700 text-white rounded-br-md' : 'bg-muted/50 border rounded-bl-md'}`}>{msg.message}</div>
                        </motion.div>
                      ))}
                      {isChatting && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-gray-900 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div><div className="bg-muted/50 border rounded-2xl rounded-bl-md px-4 py-3"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />분석 중...</div></div></div>}
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                      <Input placeholder="보안에 대해 질문하세요..." value={aiChatInput} onChange={e => setAiChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiChat()} className="flex-1 rounded-full border-slate-300 focus:border-slate-500" />
                      <Button onClick={handleAiChat} disabled={!aiChatInput.trim() || isChatting} className="rounded-full bg-slate-700 hover:bg-slate-800 px-6">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="xl:col-span-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> 빠른 취약점 진단</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {vulnerabilities.map(vuln => (
                      <div key={vuln.id} className="p-2.5 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors group flex items-center justify-between"
                        onClick={() => handleAnalyzeVuln(vuln.id)}>
                        <div>
                          <p className="text-xs font-medium">{vuln.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge className={cn("text-[9px]", getSeverityColor(vuln.severity))}>{vuln.severity}</Badge>
                            <Badge className={cn("text-[9px]", getStatusColor(vuln.status))}>{vuln.status}</Badge>
                          </div>
                        </div>
                        {analyzingVuln === vuln.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Brain className="w-3.5 h-3.5 text-muted-foreground group-hover:text-slate-700" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">AI 보안 검토 기능</p>
                    {[
                      { icon: Scan, label: "자동 보안 스캔", desc: "취약점 종합 진단" },
                      { icon: Shield, label: "취약점 위험 분석", desc: "CVSS 기반 평가" },
                      { icon: Zap, label: "적대적 공격 분석", desc: "방어 전략 제시" },
                      { icon: Lock, label: "접근 제어 감사", desc: "비인가 접근 분석" },
                      { icon: RefreshCw, label: "보안 모니터링", desc: "실시간 위협 감지" },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60">
                          <Icon className="w-4 h-4 text-slate-600 shrink-0" />
                          <div><p className="text-xs font-medium">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Security Guidelines */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              {t('tech.security.guideline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.parameters')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.adversarial')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.rbac')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.auditLog')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.regularAudit')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="securityReview"
        title={t('tech.security.ai.title')}
        contextData={JSON.stringify({
          vulnerabilityFixRate: '94.4%',
          criticalVulnerabilities: criticalVulnerabilities,
          highVulnerabilities: highVulnerabilities,
          fixedVulnerabilities: fixedVulnerabilities,
          accessControlCompliance: '99.5%',
          averageAdversarialRobustness: (adversarialTests.reduce((sum, test) => sum + test.robustness, 0) / adversarialTests.length * 100).toFixed(1),
          checklistCompletion: completedPercentage,
        })}
      />
    </Layout>
  );
};

export default SecurityReview;
