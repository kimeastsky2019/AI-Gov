import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Settings,
  BarChart3,
  PieChart,
  TrendingDown,
  Brain,
  Sparkles,
  Bot,
  Wand2,
  ChevronRight,
  Shield,
  Loader2,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Activity,
  Scale,
  FileText,
  RefreshCw,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface FairnessMetric {
  name: string;
  description: string;
  value: number;
  threshold: number;
  status: 'compliant' | 'warning' | 'critical';
  formula: string;
}

interface BiasCheckItem {
  group: string;
  category: string;
  positiveRate: number;
  targetRate: number;
  disparity: number;
  status: 'balanced' | 'imbalanced';
}

interface DemographicAnalysis {
  attribute: string;
  totalSamples: number;
  acceptanceRates: {
    group: string;
    count: number;
    rate: number;
    expectedRate: number;
  }[];
}

const FairnessReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("metrics");

  // TTA 요구사항 06, 08, 10 및 금융 AI 다-2 기반 체크리스트
  const fairnessChecklist = useMemo(() => [
    {
      id: "tta06-01",
      category: t('tech.fairness.checklist.category.bias'),
      item: t('tech.fairness.checklist.item.definition'),
      completed: true,
      description: t('tech.fairness.checklist.desc.definition')
    },
    {
      id: "tta06-02",
      category: t('tech.fairness.checklist.category.bias'),
      item: t('tech.fairness.checklist.item.dataAnalysis'),
      completed: true,
      description: t('tech.fairness.checklist.desc.dataAnalysis')
    },
    {
      id: "tta08-01",
      category: t('tech.fairness.checklist.category.fairness'),
      item: t('tech.fairness.checklist.item.technique'),
      completed: true,
      description: t('tech.fairness.checklist.desc.technique')
    },
    {
      id: "tta08-02",
      category: t('tech.fairness.checklist.category.fairness'),
      item: t('tech.fairness.checklist.item.test'),
      completed: true,
      description: t('tech.fairness.checklist.desc.test')
    },
    {
      id: "tta10-01",
      category: t('tech.fairness.checklist.category.monitoring'),
      item: t('tech.fairness.checklist.item.production'),
      completed: true,
      description: t('tech.fairness.checklist.desc.production')
    },
    {
      id: "tta10-02",
      category: t('tech.fairness.checklist.category.monitoring'),
      item: t('tech.fairness.checklist.item.report'),
      completed: true,
      description: t('tech.fairness.checklist.desc.report')
    },
    {
      id: "finance-da2",
      category: t('tech.fairness.checklist.category.finance'),
      item: t('tech.fairness.checklist.item.assessment'),
      completed: true,
      description: t('tech.fairness.checklist.desc.assessment')
    },
    {
      id: "finance-da3",
      category: t('tech.fairness.checklist.category.finance'),
      item: t('tech.fairness.checklist.item.goal'),
      completed: false,
      description: t('tech.fairness.checklist.desc.goal')
    },
    {
      id: "finance-da4",
      category: t('tech.fairness.checklist.category.finance'),
      item: t('tech.fairness.checklist.item.reevaluation'),
      completed: true,
      description: t('tech.fairness.checklist.desc.reevaluation')
    },
  ], [t]);

  // 공정성 메트릭
  const fairnessMetrics = useMemo((): FairnessMetric[] => [
    {
      name: t('tech.fairness.metric.parity'),
      description: t('tech.fairness.metric.parity.desc'),
      value: 0.94,
      threshold: 0.80,
      status: 'compliant',
      formula: "P(ŷ=+|A=0) ≈ P(ŷ=+|A=1)"
    },
    {
      name: t('tech.fairness.metric.opportunity'),
      description: t('tech.fairness.metric.opportunity.desc'),
      value: 0.97,
      threshold: 0.85,
      status: 'compliant',
      formula: "P(ŷ=+|Y=+,A=0) ≈ P(ŷ=+|Y=+,A=1)"
    },
    {
      name: t('tech.fairness.metric.predictive'),
      description: t('tech.fairness.metric.predictive.desc'),
      value: 0.92,
      threshold: 0.80,
      status: 'compliant',
      formula: "P(Y=+|ŷ=+,A=0) ≈ P(Y=+|ŷ=+,A=1)"
    },
    {
      name: t('tech.fairness.metric.calibration'),
      description: t('tech.fairness.metric.calibration.desc'),
      value: 0.96,
      threshold: 0.90,
      status: 'compliant',
      formula: "E[Y|ŷ=p,A=a] ≈ p for all p, a"
    },
  ], [t]);

  // 편향 탐지 체크리스트 - 집단별 분석
  const biasDetectionByGroup = useMemo((): BiasCheckItem[] => [
    {
      group: t('tech.data.bias.group.male'),
      category: t('tech.fairness.bias.category.gender'),
      positiveRate: 0.627,
      targetRate: 0.60,
      disparity: 1.045,
      status: 'imbalanced'
    },
    {
      group: t('tech.data.bias.group.female'),
      category: t('tech.fairness.bias.category.gender'),
      positiveRate: 0.580,
      targetRate: 0.60,
      disparity: 0.967,
      status: 'imbalanced'
    },
    {
      group: t('tech.data.bias.group.young'),
      category: t('tech.fairness.bias.category.age'),
      positiveRate: 0.598,
      targetRate: 0.60,
      disparity: 0.997,
      status: 'balanced'
    },
    {
      group: t('tech.data.bias.group.middle'),
      category: t('tech.fairness.bias.category.age'),
      positiveRate: 0.621,
      targetRate: 0.60,
      disparity: 1.035,
      status: 'balanced'
    },
    {
      group: t('tech.data.bias.group.senior'),
      category: t('tech.fairness.bias.category.age'),
      positiveRate: 0.548,
      targetRate: 0.60,
      disparity: 0.913,
      status: 'balanced'
    },
    {
      group: t('tech.data.bias.group.capital'),
      category: t('tech.fairness.bias.category.region'),
      positiveRate: 0.609,
      targetRate: 0.60,
      disparity: 1.015,
      status: 'balanced'
    },
    {
      group: t('tech.data.bias.group.provincial'),
      category: t('tech.fairness.bias.category.region'),
      positiveRate: 0.590,
      targetRate: 0.60,
      disparity: 0.983,
      status: 'balanced'
    },
  ], [t]);

  // 인구통계 분석
  const demographicAnalysis = useMemo((): DemographicAnalysis[] => [
    {
      attribute: t('tech.data.bias.category.gender'),
      totalSamples: 50000,
      acceptanceRates: [
        { group: t('tech.data.bias.group.male'), count: 15750, rate: 62.7, expectedRate: 60.0 },
        { group: t('tech.data.bias.group.female'), count: 14500, rate: 58.0, expectedRate: 60.0 },
      ]
    },
    {
      attribute: t('tech.data.bias.category.age'),
      totalSamples: 50000,
      acceptanceRates: [
        { group: t('tech.data.bias.group.young'), count: 8960, rate: 59.8, expectedRate: 60.0 },
        { group: t('tech.data.bias.group.middle'), count: 11200, rate: 62.1, expectedRate: 60.0 },
        { group: t('tech.data.bias.group.senior'), count: 4380, rate: 54.8, expectedRate: 60.0 },
      ]
    },
    {
      attribute: t('tech.data.bias.category.region'),
      totalSamples: 50000,
      acceptanceRates: [
        { group: t('tech.data.bias.group.capital'), count: 18270, rate: 60.9, expectedRate: 60.0 },
        { group: t('tech.data.bias.group.provincial'), count: 17700, rate: 59.0, expectedRate: 60.0 },
      ]
    },
  ], [t]);

  // AI 검증 상태
  const [aiAuditRunning, setAiAuditRunning] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<any>(null);
  const [aiChatHistory, setAiChatHistory] = useState<{role:'user'|'ai'; message:string}[]>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [groupAnalysis, setGroupAnalysis] = useState<Record<string, any>>({});
  const [analyzingGroup, setAnalyzingGroup] = useState<string | null>(null);

  const handleRunAiAudit = () => {
    setAiAuditRunning(true);
    setTimeout(() => {
      setAiAuditResult({
        overallScore: 87,
        grade: "B+",
        summary: "전반적 공정성 수준은 양호하나, 성별 카테고리에서 DI(Disparate Impact) 0.925로 주의 필요. 4/5 규칙(≥0.80)은 충족하지만 EU AI Act 권장 기준(≥0.90)에 근접해 있어 선제적 완화 조치를 권장합니다.",
        findings: [
          { severity: "warning", area: "성별 편향", detail: "남성 승인율(62.7%) vs 여성 승인율(58.0%) → DI=0.925, SPD=-4.7%p. SMOTE 오버샘플링 또는 공정성 제약 학습 적용 권장" },
          { severity: "info", area: "연령대 편향", detail: "60대 이상 승인율(54.8%)이 기대값(60%) 대비 -5.2%p 낮음. 통계적 유의성 검정(p=0.032)에서 유의미한 차이 감지" },
          { severity: "pass", area: "지역 편향", detail: "수도권(60.9%) vs 지방(59.0%) → DI=0.969, 공정성 기준 충족" },
          { severity: "warning", area: "교차 편향", detail: "여성+60대 이상 교차 그룹에서 승인율 51.2%로 가장 낮음. 교차 편향(Intersectional Bias) 완화 필요" },
        ],
        regulations: ["EU AI Act Article 10 (Data Governance)", "TTA-2023 요구사항 06/08", "금융감독원 AI 가이드라인 다-2", "개인정보보호법 제3조"],
        mitigations: [
          "성별 편향: Fairness Constraints 기반 재학습 (Equalized Odds 목표)",
          "연령 편향: 60대 이상 데이터 증강 + 가중치 조정",
          "교차 편향: 교차 속성별 별도 임계값 설정",
          "지속적 모니터링: 주간 DI/SPD 자동 산출 및 알림 설정",
        ],
      });
      setAiAuditRunning(false);
    }, 3000);
  };

  const handleAnalyzeGroup = (groupName: string) => {
    setAnalyzingGroup(groupName);
    const item = biasDetectionByGroup.find(b => b.group === groupName);
    setTimeout(() => {
      setGroupAnalysis(prev => ({
        ...prev,
        [groupName]: {
          diagnosis: item && item.status === 'imbalanced'
            ? `'${groupName}' 그룹의 승인율(${(item.positiveRate*100).toFixed(1)}%)이 기대값(${(item.targetRate*100).toFixed(1)}%) 대비 ${((item.positiveRate - item.targetRate)*100).toFixed(1)}%p 차이. DI=${item.disparity.toFixed(3)}로 ${item.disparity > 1.05 ? '과대 표현' : item.disparity < 0.95 ? '과소 표현' : '정상 범위'}입니다.`
            : `'${groupName}' 그룹은 공정성 기준을 충족합니다. DI=${item?.disparity.toFixed(3)}로 정상 범위(0.95~1.05) 내에 있습니다.`,
          recommendation: item && item.status === 'imbalanced'
            ? "리샘플링(SMOTE) 또는 공정성 제약 학습을 적용하여 승인율 격차를 줄이는 것을 권장합니다."
            : "현재 수준을 유지하면서 분기별 정기 모니터링을 지속하세요.",
          relatedRegulation: "TTA-2023 요구사항 08 (공정성 확보 기술), EU AI Act Article 10",
        },
      }));
      setAnalyzingGroup(null);
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
      if (lower.includes("성별") || lower.includes("gender")) {
        response = "성별 공정성 분석 결과:\n- 남성 승인율: 62.7% (DI=1.045)\n- 여성 승인율: 58.0% (DI=0.925)\n- SPD(Statistical Parity Difference): -4.7%p\n- 4/5 규칙: 충족 (DI > 0.80)\n\n다만 EU AI Act 권장 기준(DI ≥ 0.90)에 근접하므로, 선제적 완화 조치로 Equalized Odds 제약 학습을 권장합니다.";
      } else if (lower.includes("연령") || lower.includes("age") || lower.includes("60대")) {
        response = "연령대별 분석 결과:\n- 20-30대: 59.8% (DI=0.997) - 양호\n- 40-50대: 62.1% (DI=1.035) - 양호\n- 60대 이상: 54.8% (DI=0.913) - 주의\n\n60대 이상 그룹이 기대값 대비 -5.2%p 낮습니다. 해당 그룹의 데이터 수(4,380건)가 상대적으로 적어 데이터 증강을 통한 표현도 개선을 권장합니다.";
      } else if (lower.includes("개선") || lower.includes("완화") || lower.includes("mitigat")) {
        response = "공정성 개선을 위한 단계별 권장사항:\n\n1. **Pre-processing**: 데이터 리샘플링 (SMOTE), 가중치 재조정\n2. **In-processing**: Fairness Constraints 학습 (Equalized Odds, Demographic Parity)\n3. **Post-processing**: 임계값 그룹별 최적화 (ROC 기반)\n4. **모니터링**: 주간 자동 DI/SPD 산출, 임계값(0.90) 미만 시 알림\n\n예상 효과: 성별 DI 0.925 → 0.96 (+3.5%p) 개선 가능";
      } else if (lower.includes("규제") || lower.includes("법") || lower.includes("regulation")) {
        response = "현재 적용 가능한 공정성 관련 규제:\n\n1. **EU AI Act Article 10** - 학습 데이터 편향 관리 의무\n2. **TTA-2023 요구사항 06** - 편향성 평가\n3. **TTA-2023 요구사항 08** - 공정성 확보 기술\n4. **금융감독원 AI 가이드라인 다-2** - 금융 AI 공정성\n5. **개인정보보호법 제3조** - 프로파일링 기반 차별 금지\n\n현재 4/5 규칙(DI ≥ 0.80)은 충족하고 있으나, EU AI Act의 더 엄격한 기준(DI ≥ 0.90)도 대비하는 것을 권장합니다.";
      } else {
        response = `"${msg}"에 대한 분석입니다.\n\n현재 공정성 종합 점수는 94.8%이며, 7개 분석 그룹 중 5개가 균형 상태입니다. 성별 카테고리에서 경미한 불균형이 감지되었고, 교차 분석(여성+고령)에서 추가 주의가 필요합니다. 구체적인 분석을 원하시면 "성별 편향 분석", "개선 방안", "규제 현황" 등을 질문해 주세요.`;
      }
      setAiChatHistory(prev => [...prev, { role: 'ai', message: response }]);
      setIsChatting(false);
    }, 1800);
  };

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

  const completedCount = fairnessChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / fairnessChecklist.length) * 100);

  const balancedCount = biasDetectionByGroup.filter(item => item.status === 'balanced').length;
  const imbalancedCount = biasDetectionByGroup.length - balancedCount;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('tech.fairness.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('tech.fairness.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('tech.fairness.btnDownloadReport')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              {t('tech.fairness.btnSettings')}
            </Button>
          </div>
        </div>

        {/* AI Fairness Solution Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Scale className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">AI 공정성 검증 솔루션</h3>
                    <p className="text-sm text-white/80">
                      AI가 편향성을 자동 진단하고, 규제 준수 여부를 검증하며, 완화 방안을 제시합니다
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="bg-white/15 border-white/30 text-white hover:bg-white/25 gap-2 border"
                    onClick={handleRunAiAudit}
                    disabled={aiAuditRunning}
                  >
                    {aiAuditRunning ? <><Loader2 className="w-4 h-4 animate-spin" />감사 중...</> : <><Shield className="w-4 h-4" />AI 공정성 감사</>}
                  </Button>
                  <Button
                    className="bg-white text-rose-700 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => setActiveTab("ai-verify")}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI 검증 채팅
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Audit Result */}
        <AnimatePresence>
          {aiAuditResult && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Card className="border-0 shadow-xl ring-1 ring-rose-200/50 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-purple-50 border-b border-rose-200/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-purple-600 text-white shadow-lg">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">AI 공정성 감사 결과</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">자동화된 편향성 종합 진단</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className={cn("text-3xl font-black", aiAuditResult.overallScore >= 90 ? "text-green-600" : aiAuditResult.overallScore >= 80 ? "text-amber-600" : "text-red-600")}>
                          {aiAuditResult.grade}
                        </div>
                        <p className="text-[10px] text-muted-foreground">{aiAuditResult.overallScore}/100</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs" onClick={() => setAiAuditResult(null)}>닫기</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-5 space-y-5">
                  {/* Summary */}
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                    <p className="text-sm leading-relaxed"><Sparkles className="w-4 h-4 inline mr-1.5 text-rose-500" />{aiAuditResult.summary}</p>
                  </div>

                  {/* Findings */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">발견 사항</h4>
                    <div className="space-y-2">
                      {aiAuditResult.findings.map((f: any, i: number) => (
                        <div key={i} className={cn("p-3 rounded-lg border text-sm flex items-start gap-3",
                          f.severity === "pass" ? "bg-green-50/50 border-green-200" :
                          f.severity === "warning" ? "bg-amber-50/50 border-amber-200" :
                          "bg-blue-50/50 border-blue-200"
                        )}>
                          {f.severity === "pass" ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> :
                           f.severity === "warning" ? <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> :
                           <Eye className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />}
                          <div>
                            <p className="font-semibold text-xs">{f.area}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{f.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mitigations & Regulations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> AI 권장 완화 조치
                      </h4>
                      <ul className="space-y-1.5">
                        {aiAuditResult.mitigations.map((m: string, i: number) => (
                          <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5 p-2 bg-amber-50/50 rounded-lg">
                            <Zap className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />{m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-500" /> 관련 규제
                      </h4>
                      <ul className="space-y-1.5">
                        {aiAuditResult.regulations.map((r: string, i: number) => (
                          <li key={i} className="text-xs text-foreground/70 flex items-center gap-1.5 p-2 bg-blue-50/50 rounded-lg">
                            <Shield className="w-3 h-3 text-blue-500 shrink-0" />{r}
                          </li>
                        ))}
                      </ul>
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
            title={t('tech.fairness.metricScore')}
            value="94.8%"
            change="+1.2%"
            trend="up"
          />
          <MetricCard
            title={t('tech.fairness.metricBalanced')}
            value={`${balancedCount}/${biasDetectionByGroup.length}`}
            change="+1"
            trend="up"
          />
          <MetricCard
            title={t('tech.fairness.metricParity')}
            value="94.0%"
            change="+0.5%"
            trend="up"
          />
          <MetricCard
            title={t('tech.fairness.metricOpportunity')}
            value="97.0%"
            change="+0.3%"
            trend="up"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="metrics" className="data-[state=active]:bg-background">
                {t('tech.fairness.tabMetrics')}
              </TabsTrigger>
              <TabsTrigger value="bias" className="data-[state=active]:bg-background">
                {t('tech.fairness.tabBias')}
              </TabsTrigger>
              <TabsTrigger value="demographic" className="data-[state=active]:bg-background">
                {t('tech.fairness.tabDemographic')}
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                {t('tech.fairness.tabChecklist')}
              </TabsTrigger>
              <TabsTrigger value="ai-verify" className="data-[state=active]:bg-background">
                <Brain className="w-4 h-4 mr-1.5" />
                AI 검증
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tech.fairness.search')}
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

          {/* Tab: Fairness Metrics */}
          <TabsContent value="metrics" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fairnessMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{metric.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                      </div>
                      <Badge className={getStatusColor('compliant')}>
                        {t('tech.fairness.status.compliant')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{t('tech.fairness.label.current')}</span>
                          <span className="text-2xl font-bold">{(metric.value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all"
                            style={{ width: `${metric.value * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tech.fairness.label.minimum')}</span>
                        <span className="font-medium">{(metric.threshold * 100).toFixed(1)}%</span>
                      </div>
                      <div className="pt-3 border-t text-xs text-muted-foreground font-mono">
                        <span className="block text-foreground font-semibold mb-1">{t('tech.fairness.formula')}:</span>
                        {metric.formula}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Bias Detection */}
          <TabsContent value="bias" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.fairness.bias.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[t('tech.fairness.bias.category.gender'), t('tech.fairness.bias.category.age'), t('tech.fairness.bias.category.region')].map((category) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-4">{category}</h4>
                      <div className="space-y-3">
                        {biasDetectionByGroup
                          .filter(item => item.category.includes(category))
                          .map((item, idx) => (
                            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-medium">{item.group}</span>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status === 'balanced' ? t('tech.fairness.bias.status.balanced') : t('tech.fairness.bias.status.imbalanced')}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">{t('tech.fairness.bias.label.approvalRate')}</span>
                                  <div className="text-lg font-bold">{(item.positiveRate * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">{t('tech.fairness.bias.label.target')}</span>
                                  <div className="text-lg font-bold">{(item.targetRate * 100).toFixed(1)}%</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">{t('tech.fairness.bias.label.disparity')}</span>
                                  <div className={`text-lg font-bold ${item.disparity > 1.05 || item.disparity < 0.95 ? 'text-amber-600' : 'text-green-600'}`}>
                                    {item.disparity.toFixed(3)}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      item.disparity <= 1.05 && item.disparity >= 0.95
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    }`}
                                    style={{ width: `${(item.positiveRate / 0.7) * 100}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {item.disparity > 1.05 ? t('tech.fairness.bias.range.higher') : item.disparity < 0.95 ? t('tech.fairness.bias.range.lower') : t('tech.fairness.bias.range.within')}
                                </p>
                              </div>

                              {/* AI Analysis Button */}
                              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                                <Button
                                  variant="ghost" size="sm"
                                  className="gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                  onClick={() => handleAnalyzeGroup(item.group)}
                                  disabled={analyzingGroup === item.group}
                                >
                                  {analyzingGroup === item.group ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />분석중</> :
                                   groupAnalysis[item.group] ? <><Eye className="w-3.5 h-3.5" />결과보기</> :
                                   <><Brain className="w-3.5 h-3.5" />AI 진단</>}
                                </Button>
                              </div>

                              {/* Inline AI Result */}
                              <AnimatePresence>
                                {groupAnalysis[item.group] && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 p-3 bg-gradient-to-br from-rose-50/50 to-purple-50/50 rounded-xl border border-rose-200/50 space-y-2 overflow-hidden">
                                    <div className="flex items-start gap-2">
                                      <Bot className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                      <p className="text-xs leading-relaxed">{groupAnalysis[item.group].diagnosis}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                      <p className="text-xs leading-relaxed">{groupAnalysis[item.group].recommendation}</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                      <p className="text-[10px] text-muted-foreground">{groupAnalysis[item.group].relatedRegulation}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Demographic Analysis */}
          <TabsContent value="demographic" className="mt-0 space-y-6">
            {demographicAnalysis.map((analysis, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{analysis.attribute}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.acceptanceRates.map((rate, rateIdx) => (
                      <div key={rateIdx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{rate.group}</h4>
                            <p className="text-xs text-muted-foreground">
                              {t('tech.fairness.demographic.samples')}: {rate.count.toLocaleString()} / {analysis.totalSamples.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{rate.rate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">{t('tech.fairness.bias.label.approvalRate')}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{t('tech.fairness.demographic.actual')}</span>
                            <span className="font-medium">{rate.rate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: `${rate.rate}%` }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>{t('tech.fairness.demographic.expected')}</span>
                            <span className="font-medium">{rate.expectedRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ width: `${rate.expectedRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {t('tech.fairness.demographic.diff')}: {((rate.rate - rate.expectedRate) > 0 ? '+' : '')}{(rate.rate - rate.expectedRate).toFixed(2)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Tab: Checklist */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('tech.fairness.checklist.title')}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{fairnessChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fairnessChecklist.map((item) => (
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
                            {item.completed ? t('tech.fairness.checklist.completed') : t('tech.fairness.checklist.inProgress')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Tab: AI Verification Chat */}
          <TabsContent value="ai-verify" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Chat */}
              <div className="xl:col-span-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-rose-50 to-purple-50 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bot className="w-5 h-5 text-rose-600" />
                      AI 공정성 검증 컨설턴트
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">편향성 분석, 규제 준수, 완화 방안 등 자유롭게 질문하세요</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                      {aiChatHistory.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-white flex items-center justify-center shadow-lg border border-rose-200">
                              <Scale className="w-8 h-8 text-rose-600" />
                            </div>
                          </div>
                          <p className="font-semibold">공정성에 대해 무엇을 확인할까요?</p>
                          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                            {["성별 편향 분석해줘", "연령대별 공정성 현황", "개선 방안 알려줘", "관련 규제 알려줘"].map(s => (
                              <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-rose-50 hover:border-rose-300"
                                onClick={() => setAiChatInput(s)}>{s}</Button>
                            ))}
                          </div>
                        </div>
                      )}
                      {aiChatHistory.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user' ? 'bg-rose-600 text-white rounded-br-md' : 'bg-muted/50 border rounded-bl-md'
                          }`}>{msg.message}</div>
                        </motion.div>
                      ))}
                      {isChatting && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                          <div className="bg-muted/50 border rounded-2xl rounded-bl-md px-4 py-3"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />분석 중...</div></div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                      <Input placeholder="공정성에 대해 질문하세요..." value={aiChatInput} onChange={(e) => setAiChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAiChat()} className="flex-1 rounded-full border-rose-200 focus:border-rose-400" />
                      <Button onClick={handleAiChat} disabled={!aiChatInput.trim() || isChatting} className="rounded-full bg-rose-600 hover:bg-rose-700 px-6">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-4 space-y-4">
                {/* Quick Group Analysis */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Activity className="w-4 h-4 text-rose-500" /> 그룹별 빠른 진단</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {biasDetectionByGroup.map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors group flex items-center justify-between"
                        onClick={() => handleAnalyzeGroup(item.group)}>
                        <div>
                          <p className="text-xs font-medium">{item.group}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">DI: {item.disparity.toFixed(3)}</span>
                            <Badge className={cn("text-[9px]", item.status === 'balanced' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                              {item.status === 'balanced' ? '균형' : '불균형'}
                            </Badge>
                          </div>
                        </div>
                        {analyzingGroup === item.group ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" /> :
                         <Brain className="w-3.5 h-3.5 text-muted-foreground group-hover:text-rose-500 transition-colors" />}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Capabilities */}
                <Card className="bg-gradient-to-br from-rose-50/50 to-purple-50/50">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider">AI 검증 기능</p>
                    {[
                      { icon: Shield, label: "공정성 종합 감사", desc: "DI/SPD/EOD 자동 산출" },
                      { icon: Users, label: "그룹별 편향 진단", desc: "보호 속성별 분석" },
                      { icon: Scale, label: "교차 편향 분석", desc: "다중 속성 교차 검증" },
                      { icon: Lightbulb, label: "완화 방안 제시", desc: "규제별 권장 조치" },
                      { icon: RefreshCw, label: "지속 모니터링", desc: "드리프트 감지 연동" },
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors">
                          <Icon className="w-4 h-4 text-rose-500 shrink-0" />
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

        {/* Fairness Guidelines */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {t('tech.fairness.guideline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('tech.fairness.guideline.metrics').replace(/:/g, ':</strong>').replace(/^/, '<strong>') }} />
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('tech.fairness.guideline.balance').replace(/:/g, ':</strong>').replace(/^/, '<strong>') }} />
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('tech.fairness.guideline.minority').replace(/:/g, ':</strong>').replace(/^/, '<strong>') }} />
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('tech.fairness.guideline.compliance').replace(/:/g, ':</strong>').replace(/^/, '<strong>') }} />
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: t('tech.fairness.guideline.monitoring').replace(/:/g, ':</strong>').replace(/^/, '<strong>') }} />
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="fairnessReview"
        title={t('tech.fairness.ai.title')}
        contextData={JSON.stringify({
          averageFairnessScore: '94.8%',
          demographicParity: '94.0%',
          equalOpportunity: '97.0%',
          balancedGroups: balancedCount,
          totalGroups: biasDetectionByGroup.length,
          imbalancedGroups: imbalancedCount,
          checklistCompletion: completedPercentage,
        })}
      />
    </Layout>
  );
};

export default FairnessReview;
