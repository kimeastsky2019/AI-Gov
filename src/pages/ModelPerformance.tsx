import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Download,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  Target,
  Brain,
  Sparkles,
  Bot,
  Wand2,
  ChevronRight,
  Activity,
  Cpu,
  Zap,
  RefreshCw,
  MessageSquare,
  FileText,
  Shield,
  Loader2,
  ArrowUpDown,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface ModelMetric {
  modelId: string;
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  rmse?: number;
  deploymentDate: string;
  status: 'active' | 'deprecated' | 'testing';
}

interface PerformanceGoal {
  metric: string;
  target: number;
  actual: number;
  status: 'achieved' | 'inProgress' | 'atRisk';
  domain: string;
}

interface MonitoringMetric {
  timestamp: string;
  accuracy: number;
  precision: number;
  recall: number;
  dataQuality: number;
  predictionLatency: number;
}

const ModelPerformance = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("registry");
  const [selectedModelForAI, setSelectedModelForAI] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<Record<string, any>>({});
  const [analyzingModel, setAnalyzingModel] = useState<string | null>(null);
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatHistory, setAiChatHistory] = useState<{ role: 'user' | 'ai'; message: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareModels, setCompareModels] = useState<string[]>([]);
  const [compareResult, setCompareResult] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // TTA 요구사항 03, 금융 다-1, 라-2 기반 체크리스트
  const performanceChecklist = useMemo(() => [
    {
      id: "tta03-01",
      category: t('tech.model.checklist.category.reliability'),
      item: t('tech.model.checklist.item.benchmark'),
      completed: true,
      description: t('tech.model.checklist.desc.benchmark')
    },
    {
      id: "tta03-02",
      category: t('tech.model.checklist.category.reliability'),
      item: t('tech.model.checklist.item.errorAnalysis'),
      completed: true,
      description: t('tech.model.checklist.desc.errorAnalysis')
    },
    {
      id: "tta03-03",
      category: t('tech.model.checklist.category.reliability'),
      item: t('tech.model.checklist.item.edgeCase'),
      completed: true,
      description: t('tech.model.checklist.desc.edgeCase')
    },
    {
      id: "finance-da1",
      category: t('tech.model.checklist.category.goal'),
      item: t('tech.model.checklist.item.goalSet'),
      completed: true,
      description: t('tech.model.checklist.desc.goalSet')
    },
    {
      id: "finance-da2",
      category: t('tech.model.checklist.category.goal'),
      item: t('tech.model.checklist.item.goalTracking'),
      completed: true,
      description: t('tech.model.checklist.desc.goalTracking')
    },
    {
      id: "finance-ra2",
      category: t('tech.model.checklist.category.monitoring'),
      item: t('tech.model.checklist.item.realTimeMonitoring'),
      completed: true,
      description: t('tech.model.checklist.desc.realTimeMonitoring')
    },
    {
      id: "finance-ra3",
      category: t('tech.model.checklist.category.monitoring'),
      item: t('tech.model.checklist.item.alert'),
      completed: false,
      description: t('tech.model.checklist.desc.alert')
    },
    {
      id: "finance-ra4",
      category: t('tech.model.checklist.category.monitoring'),
      item: t('tech.model.checklist.item.history'),
      completed: true,
      description: t('tech.model.checklist.desc.history')
    },
  ], [t]);

  // 모델 레지스트리 - 성능 메트릭
  const modelRegistry = useMemo((): ModelMetric[] => [
    {
      modelId: "M-2024-001",
      modelName: "신용 승인 모델 v3.2",
      accuracy: 0.945,
      precision: 0.938,
      recall: 0.951,
      f1Score: 0.9445,
      auc: 0.978,
      deploymentDate: "2024-01-15",
      status: 'active'
    },
    {
      modelId: "M-2024-002",
      modelName: "거래 이상 탐지 모델 v2.1",
      accuracy: 0.987,
      precision: 0.982,
      recall: 0.991,
      f1Score: 0.9865,
      auc: 0.995,
      deploymentDate: "2024-02-01",
      status: 'active'
    },
    {
      modelId: "M-2023-015",
      modelName: "신용 승인 모델 v3.0",
      accuracy: 0.932,
      precision: 0.925,
      recall: 0.938,
      f1Score: 0.9315,
      auc: 0.971,
      deploymentDate: "2023-11-20",
      status: 'deprecated'
    },
    {
      modelId: "M-2024-003",
      modelName: "고객 이탈 예측 모델 v1.0",
      accuracy: 0.856,
      precision: 0.842,
      recall: 0.871,
      f1Score: 0.8563,
      auc: 0.912,
      deploymentDate: "2024-02-28",
      status: 'testing'
    },
    {
      modelId: "M-2024-004",
      modelName: "대출 부도 예측 모델 v2.3",
      accuracy: 0.923,
      precision: 0.931,
      recall: 0.915,
      f1Score: 0.923,
      auc: 0.964,
      deploymentDate: "2024-01-25",
      status: 'active'
    },
  ], [t]);

  // 성능 목표 관리
  const performanceGoals = useMemo((): PerformanceGoal[] => [
    {
      metric: "신용 승인 모델 정확도",
      target: 94.0,
      actual: 94.5,
      status: 'achieved',
      domain: "신용 평가"
    },
    {
      metric: "이상 탐지 모델 F1-Score",
      target: 98.0,
      actual: 98.65,
      status: 'achieved',
      domain: "위험 관리"
    },
    {
      metric: "이탈 예측 모델 AUC",
      target: 93.0,
      actual: 91.2,
      status: 'atRisk',
      domain: "고객 관리"
    },
    {
      metric: "부도 예측 모델 회수율",
      target: 92.0,
      actual: 91.5,
      status: 'inProgress',
      domain: "신용 평가"
    },
    {
      metric: "예측 응답 시간",
      target: 200,
      actual: 156,
      status: 'achieved',
      domain: "운영"
    },
    {
      metric: "모델 가용성",
      target: 99.5,
      actual: 99.85,
      status: 'achieved',
      domain: "운영"
    },
  ], [t]);

  // 모니터링 대시보드 - 시계열 데이터
  const monitoringData = useMemo((): MonitoringMetric[] => [
    { timestamp: "2024-03-09 00:00", accuracy: 0.944, precision: 0.937, recall: 0.950, dataQuality: 97.8, predictionLatency: 142 },
    { timestamp: "2024-03-09 06:00", accuracy: 0.945, precision: 0.938, recall: 0.951, dataQuality: 98.1, predictionLatency: 148 },
    { timestamp: "2024-03-09 12:00", accuracy: 0.946, precision: 0.939, recall: 0.952, dataQuality: 98.4, predictionLatency: 156 },
    { timestamp: "2024-03-09 18:00", accuracy: 0.945, precision: 0.938, recall: 0.950, dataQuality: 98.2, predictionLatency: 151 },
    { timestamp: "2024-03-10 00:00", accuracy: 0.945, precision: 0.937, recall: 0.951, dataQuality: 98.0, predictionLatency: 145 },
  ], [t]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'deprecated':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      case 'testing':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'achieved':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'inProgress':
        return 'bg-amber-500/10 text-amber-700 border-amber-200';
      case 'atRisk':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('tech.model.status.active');
      case 'deprecated': return t('tech.model.status.deprecated');
      case 'testing': return t('tech.model.status.testing');
      case 'achieved': return t('tech.model.status.achieved');
      case 'inProgress': return t('tech.model.status.inProgress');
      case 'atRisk': return t('tech.model.status.atRisk');
      default: return status;
    }
  };

  // AI Analysis Functions
  const handleAnalyzeModel = (modelId: string) => {
    setAnalyzingModel(modelId);
    const model = modelRegistry.find(m => m.modelId === modelId);
    if (!model) return;

    setTimeout(() => {
      setAiAnalysisResult(prev => ({
        ...prev,
        [modelId]: {
          summary: `${model.modelName}의 종합 성능은 양호합니다. F1-Score ${(model.f1Score * 100).toFixed(2)}%, AUC ${(model.auc * 100).toFixed(2)}%로 기준치를 충족합니다.`,
          strengths: [
            `높은 AUC(${(model.auc * 100).toFixed(1)}%)로 양성/음성 분류 능력 우수`,
            model.recall > 0.94 ? `회수율(${(model.recall * 100).toFixed(1)}%)이 높아 위험 사례 누락 최소화` : `정밀도(${(model.precision * 100).toFixed(1)}%)가 높아 오탐율 최소화`,
            model.accuracy > 0.93 ? "전반적 정확도가 업계 기준 상회" : "안정적인 성능 추이 유지",
          ],
          risks: [
            model.f1Score < 0.90 ? "F1-Score가 90% 미만으로 개선 필요" : "특정 엣지 케이스에서 성능 저하 가능성",
            model.recall < model.precision ? "회수율이 정밀도 대비 낮아 위험 사례 누락 우려" : "정밀도가 회수율 대비 낮아 오탐율 관리 필요",
            "데이터 드리프트 발생 시 성능 급락 위험",
          ],
          recommendations: [
            model.f1Score < 0.90 ? "하이퍼파라미터 튜닝 및 피처 엔지니어링 강화 권장" : "정기적 모델 성능 벤치마크 지속",
            "SHAP/LIME 기반 설명가능성 분석 추가 수행 권장",
            "A/B 테스트를 통한 챔피언-챌린저 비교 검증 권장",
            model.status === 'testing' ? "테스트 환경에서 충분한 검증 후 배포 결정" : "월간 드리프트 모니터링 강화",
          ],
          fairness: {
            dpd: (Math.random() * 0.08 + 0.01).toFixed(3),
            eod: (Math.random() * 0.06 + 0.01).toFixed(3),
            status: model.f1Score > 0.92 ? "양호" : "주의",
          },
        },
      }));
      setAnalyzingModel(null);
      setSelectedModelForAI(modelId);
    }, 2000);
  };

  const handleAiChat = () => {
    if (!aiChatInput.trim()) return;
    const userMsg = aiChatInput;
    setAiChatHistory(prev => [...prev, { role: 'user', message: userMsg }]);
    setAiChatInput("");
    setIsChatting(true);

    setTimeout(() => {
      let aiResponse = "";
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes("정확도") || lowerMsg.includes("accuracy")) {
        aiResponse = "현재 활성 모델의 평균 정확도는 94.5%입니다. 신용 승인 모델 v3.2가 94.5%로 가장 높고, 거래 이상 탐지 모델이 98.7%로 최고 성능을 보이고 있습니다. TTA-2023 요구사항 03 기준(90% 이상)을 모든 활성 모델이 충족합니다.";
      } else if (lowerMsg.includes("비교") || lowerMsg.includes("compare")) {
        aiResponse = "신용 승인 모델 v3.2 vs v3.0 비교: 정확도 +1.3%p, F1-Score +1.3%p, AUC +0.7%p 개선. 주요 개선 요인은 피처 엔지니어링 강화와 하이퍼파라미터 최적화입니다. v3.0은 Deprecated 처리를 권장합니다.";
      } else if (lowerMsg.includes("드리프트") || lowerMsg.includes("drift")) {
        aiResponse = "최근 24시간 모니터링 결과, 모델 드리프트 징후는 감지되지 않았습니다. 정확도 변동폭 ±0.2%p로 안정적입니다. PSI(Population Stability Index) = 0.03으로 임계값(0.1) 이하입니다. 다만, 주간 추이에서 데이터 품질이 97.8%까지 하락한 시점이 있어 모니터링 강화를 권장합니다.";
      } else if (lowerMsg.includes("개선") || lowerMsg.includes("향상") || lowerMsg.includes("improve")) {
        aiResponse = "고객 이탈 예측 모델(AUC 91.2%)의 성능 향상을 위해 다음을 권장합니다:\n1. 시계열 피처 추가 (최근 3개월 거래 패턴)\n2. 앙상블 방법 적용 (XGBoost + LightGBM)\n3. 클래스 불균형 해소 (SMOTE 오버샘플링)\n4. 하이퍼파라미터 베이지안 최적화\n예상 AUC 개선: 91.2% → 94.5% (+3.3%p)";
      } else if (lowerMsg.includes("배포") || lowerMsg.includes("deploy")) {
        aiResponse = "고객 이탈 예측 모델 v1.0은 현재 테스트 상태입니다. 배포 전 다음 항목을 확인하세요:\n- AUC 목표(93%) 미달 (현재 91.2%) → 모델 개선 필요\n- 편향성 검증 미완료\n- 부하 테스트 미수행\n배포 권장 시점: 모델 개선 후 2주간 A/B 테스트 완료 후";
      } else {
        aiResponse = `"${userMsg}"에 대한 분석 결과입니다.\n\n현재 등록된 5개 모델 중 3개가 활성 운영 중이며, 전반적인 성능은 안정적입니다. 성능 목표 달성률 83.3%(5/6 달성)로 양호하나, 이탈 예측 모델의 AUC가 목표 대비 1.8%p 미달입니다. 추가 질문이 있으시면 알려주세요.`;
      }
      setAiChatHistory(prev => [...prev, { role: 'ai', message: aiResponse }]);
      setIsChatting(false);
    }, 1800);
  };

  const handleCompareModels = () => {
    if (compareModels.length < 2) return;
    setIsComparing(true);
    const models = compareModels.map(id => modelRegistry.find(m => m.modelId === id)).filter(Boolean);
    setTimeout(() => {
      const m1 = models[0]!, m2 = models[1]!;
      setCompareResult(
        `## ${m1.modelName} vs ${m2.modelName} 비교 분석\n\n` +
        `| 지표 | ${m1.modelName} | ${m2.modelName} | 차이 |\n` +
        `|------|-------|-------|------|\n` +
        `| 정확도 | ${(m1.accuracy*100).toFixed(2)}% | ${(m2.accuracy*100).toFixed(2)}% | ${((m1.accuracy-m2.accuracy)*100).toFixed(2)}%p |\n` +
        `| F1-Score | ${(m1.f1Score*100).toFixed(2)}% | ${(m2.f1Score*100).toFixed(2)}% | ${((m1.f1Score-m2.f1Score)*100).toFixed(2)}%p |\n` +
        `| AUC | ${(m1.auc*100).toFixed(2)}% | ${(m2.auc*100).toFixed(2)}% | ${((m1.auc-m2.auc)*100).toFixed(2)}%p |\n\n` +
        `**AI 권장사항:** ${m1.f1Score > m2.f1Score ? m1.modelName : m2.modelName}이(가) 전반적으로 우수한 성능을 보입니다. ` +
        `${m1.status === 'deprecated' || m2.status === 'deprecated' ? 'Deprecated 모델은 단계적 폐기를 권장합니다.' : '두 모델 모두 운영 기준을 충족합니다.'}`
      );
      setIsComparing(false);
    }, 2000);
  };

  const toggleCompareModel = (modelId: string) => {
    setCompareModels(prev =>
      prev.includes(modelId) ? prev.filter(id => id !== modelId) : prev.length < 2 ? [...prev, modelId] : prev
    );
    setCompareResult(null);
  };

  const completedCount = performanceChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / performanceChecklist.length) * 100);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              모델 성능 평가
            </h1>
            <p className="text-muted-foreground mt-1">
              AI 모델의 성능 지표 관리 및 모니터링 (TTA 03, 금융 AI 다-1, 라-2)
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

        {/* AI Solution Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">AI 모델 성능 분석 솔루션</h3>
                    <p className="text-sm text-white/80">
                      AI가 모델 성능을 진단하고 개선 방안을 제시합니다. 모델 비교, 드리프트 예측, 최적화 권장사항 제공
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    className={`gap-2 border ${compareMode ? 'bg-white text-purple-700 hover:bg-white/90' : 'bg-white/15 border-white/30 text-white hover:bg-white/25'}`}
                    onClick={() => { setCompareMode(!compareMode); setCompareModels([]); setCompareResult(null); }}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {compareMode ? "비교 모드 해제" : "모델 비교"}
                  </Button>
                  <Button
                    className="bg-white text-purple-700 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => setActiveTab("ai-analysis")}
                  >
                    <Sparkles className="w-4 h-4" />
                    AI 분석 채팅
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="평균 정확도"
            value="94.5%"
            change="+0.5%"
            trend="up"
          />
          <MetricCard
            title="활성 모델"
            value="3개"
            change="+1"
            trend="up"
          />
          <MetricCard
            title="성능 목표 달성률"
            value="83.3%"
            change="+6.7%"
            trend="up"
          />
          <MetricCard
            title="평균 응답시간"
            value="150.4ms"
            change="-12ms"
            trend="down"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="registry" className="data-[state=active]:bg-background">
                모델 레지스트리
              </TabsTrigger>
              <TabsTrigger value="goals" className="data-[state=active]:bg-background">
                성능 목표
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="data-[state=active]:bg-background">
                실시간 모니터링
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                체크리스트
              </TabsTrigger>
              <TabsTrigger value="ai-analysis" className="data-[state=active]:bg-background">
                <Brain className="w-4 h-4 mr-1.5" />
                AI 분석
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="모델 검색..."
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

          {/* Tab: Model Registry */}
          <TabsContent value="registry" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>등록된 모델 및 성능 메트릭</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">모델명</th>
                        <th className="text-center py-3 px-4 font-semibold">정확도</th>
                        <th className="text-center py-3 px-4 font-semibold">정밀도</th>
                        <th className="text-center py-3 px-4 font-semibold">회수율</th>
                        <th className="text-center py-3 px-4 font-semibold">F1-Score</th>
                        <th className="text-center py-3 px-4 font-semibold">AUC</th>
                        <th className="text-center py-3 px-4 font-semibold">상태</th>
                        <th className="text-left py-3 px-4 font-semibold">배포일</th>
                        <th className="text-center py-3 px-4 font-semibold">AI 분석</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelRegistry.map((model) => (
                        <tr key={model.modelId} className={`border-b hover:bg-muted/50 transition-colors ${compareModels.includes(model.modelId) ? 'bg-purple-50/50 ring-1 ring-purple-200' : ''}`}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {compareMode && (
                                <input
                                  type="checkbox"
                                  checked={compareModels.includes(model.modelId)}
                                  onChange={() => toggleCompareModel(model.modelId)}
                                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                              )}
                              <div>
                                <div className="font-medium">{model.modelName}</div>
                                <div className="text-xs text-muted-foreground">{model.modelId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" className="bg-green-500/10 text-green-700">
                              {(model.accuracy * 100).toFixed(2)}%
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4 font-medium">
                            {(model.precision * 100).toFixed(2)}%
                          </td>
                          <td className="text-center py-3 px-4 font-medium">
                            {(model.recall * 100).toFixed(2)}%
                          </td>
                          <td className="text-center py-3 px-4 font-medium">
                            {(model.f1Score * 100).toFixed(2)}%
                          </td>
                          <td className="text-center py-3 px-4 font-medium">
                            {(model.auc * 100).toFixed(2)}%
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={getStatusColor(model.status)}>
                              {getStatusText(model.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">
                            {model.deploymentDate}
                          </td>
                          <td className="text-center py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              onClick={() => handleAnalyzeModel(model.modelId)}
                              disabled={analyzingModel === model.modelId}
                            >
                              {analyzingModel === model.modelId ? (
                                <><Loader2 className="w-3.5 h-3.5 animate-spin" />분석중</>
                              ) : aiAnalysisResult[model.modelId] ? (
                                <><Eye className="w-3.5 h-3.5" />결과보기</>
                              ) : (
                                <><Brain className="w-3.5 h-3.5" />AI 진단</>
                              )}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            {/* Compare Bar */}
            {compareMode && compareModels.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ArrowUpDown className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">
                          {compareModels.length}개 모델 선택됨
                          {compareModels.length < 2 && " (2개를 선택하세요)"}
                        </span>
                        <div className="flex gap-1.5">
                          {compareModels.map(id => {
                            const m = modelRegistry.find(mm => mm.modelId === id);
                            return m && <Badge key={id} className="bg-purple-100 text-purple-700 text-xs">{m.modelName}</Badge>;
                          })}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        disabled={compareModels.length < 2 || isComparing}
                        onClick={handleCompareModels}
                        className="gap-1.5 bg-purple-600 hover:bg-purple-700"
                      >
                        {isComparing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />비교 중...</> : <><Sparkles className="w-3.5 h-3.5" />AI 비교 분석</>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Compare Result */}
            <AnimatePresence>
              {compareResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="border-purple-200 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 pb-3 border-b">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        AI 모델 비교 분석 결과
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-sm whitespace-pre-wrap leading-relaxed font-mono bg-muted/30 p-4 rounded-xl">
                        {compareResult}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Analysis Result (inline) */}
            <AnimatePresence>
              {selectedModelForAI && aiAnalysisResult[selectedModelForAI] && (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <Card className="border-0 shadow-xl overflow-hidden ring-1 ring-purple-200/50">
                    <CardHeader className="bg-gradient-to-r from-purple-100/60 to-indigo-100/60 border-b border-purple-200/30 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg">
                            <Bot className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">AI 성능 진단 결과</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {modelRegistry.find(m => m.modelId === selectedModelForAI)?.modelName}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedModelForAI(null)} className="text-xs">닫기</Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-5">
                      {/* Summary */}
                      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          <Sparkles className="w-4 h-4 inline mr-1.5 text-purple-500" />
                          {aiAnalysisResult[selectedModelForAI].summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Strengths */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" /> 강점
                          </h4>
                          <ul className="space-y-1.5">
                            {aiAnalysisResult[selectedModelForAI].strengths.map((s: string, i: number) => (
                              <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5 p-2 bg-green-50/50 rounded-lg">
                                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />{s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Risks */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> 위험 요소
                          </h4>
                          <ul className="space-y-1.5">
                            {aiAnalysisResult[selectedModelForAI].risks.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5 p-2 bg-amber-50/50 rounded-lg">
                                <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />{r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {/* Recommendations */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5" /> AI 권장사항
                          </h4>
                          <ul className="space-y-1.5">
                            {aiAnalysisResult[selectedModelForAI].recommendations.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-foreground/70 flex items-start gap-1.5 p-2 bg-blue-50/50 rounded-lg">
                                <Zap className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />{r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Fairness Quick Check */}
                      <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl">
                        <Shield className="w-5 h-5 text-purple-500 shrink-0" />
                        <div className="flex-1 text-xs">
                          <span className="font-semibold">공정성 요약: </span>
                          DPD={aiAnalysisResult[selectedModelForAI].fairness.dpd}, EOD={aiAnalysisResult[selectedModelForAI].fairness.eod}
                        </div>
                        <Badge className={aiAnalysisResult[selectedModelForAI].fairness.status === "양호" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                          {aiAnalysisResult[selectedModelForAI].fairness.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Tab: Performance Goals */}
          <TabsContent value="goals" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>성능 목표 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceGoals.map((goal, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{goal.metric}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {goal.domain}
                            </Badge>
                            <Badge className={getStatusColor(goal.status)}>
                              {getStatusText(goal.status)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">목표</span>
                          <div className="text-xl font-bold">{goal.target}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">현황</span>
                          <div className="text-xl font-bold text-blue-600">{goal.actual}</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">차이</span>
                          <div className={`text-xl font-bold ${goal.actual >= goal.target ? 'text-green-600' : 'text-red-600'}`}>
                            {goal.status === 'achieved' ? '+' : ''}{(goal.actual - goal.target).toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              goal.status === 'achieved'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : goal.status === 'inProgress'
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                  : 'bg-gradient-to-r from-red-500 to-orange-500'
                            }`}
                            style={{ width: `${Math.min((goal.actual / goal.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Real-time Monitoring */}
          <TabsContent value="monitoring" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChartIcon className="h-5 w-5 text-blue-500" />
                    정확도 추이 (24시간)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monitoringData.map((data, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{data.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="font-semibold">{(data.accuracy * 100).toFixed(2)}%</span>
                          </div>
                          {idx > 0 && (
                            <span className={monitoringData[idx].accuracy > monitoringData[idx - 1].accuracy ? 'text-green-600' : 'text-red-600'}>
                              {monitoringData[idx].accuracy > monitoringData[idx - 1].accuracy ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-500" />
                    데이터 품질 추이 (24시간)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monitoringData.map((data, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{data.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                                style={{ width: `${data.dataQuality}%` }}
                              />
                            </div>
                          </div>
                          <span className="font-semibold w-12 text-right">{data.dataQuality.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    정밀도 & 회수율
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">정밀도 (Precision)</span>
                        <span className="text-sm font-semibold">{(monitoringData[monitoringData.length - 1].precision * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: `${monitoringData[monitoringData.length - 1].precision * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">회수율 (Recall)</span>
                        <span className="text-sm font-semibold">{(monitoringData[monitoringData.length - 1].recall * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full"
                          style={{ width: `${monitoringData[monitoringData.length - 1].recall * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    응답 시간 (24시간)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monitoringData.map((data, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{data.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${Math.min(data.predictionLatency / 2, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold w-16 text-right">{data.predictionLatency}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab: Checklist */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>TTA & 금융 AI 가이드라인 준수 체크리스트</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{performanceChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceChecklist.map((item) => (
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
          {/* Tab: AI Analysis Chat */}
          <TabsContent value="ai-analysis" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Chat Area */}
              <div className="xl:col-span-8 space-y-4">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bot className="w-5 h-5 text-purple-600" />
                      AI 모델 성능 컨설턴트
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      모델 성능, 비교, 개선 방안, 드리프트 분석 등 자유롭게 질문하세요
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {/* Chat History */}
                    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                      {aiChatHistory.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center shadow-lg border border-purple-200">
                              <Brain className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">무엇을 도와드릴까요?</p>
                            <p className="text-sm text-muted-foreground mt-1">모델 성능에 관한 질문을 입력하세요</p>
                          </div>
                          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                            {[
                              "모델 정확도 현황 분석해줘",
                              "신용 모델 v3.2 vs v3.0 비교",
                              "드리프트 현황 알려줘",
                              "이탈 예측 모델 개선 방안",
                              "배포 준비 상태 확인",
                            ].map((suggestion) => (
                              <Button
                                key={suggestion}
                                variant="outline"
                                size="sm"
                                className="text-xs rounded-full hover:bg-purple-50 hover:border-purple-300"
                                onClick={() => { setAiChatInput(suggestion); }}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {aiChatHistory.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                        >
                          {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === 'user'
                              ? 'bg-purple-600 text-white rounded-br-md'
                              : 'bg-muted/50 border rounded-bl-md'
                          }`}>
                            {msg.message}
                          </div>
                        </motion.div>
                      ))}

                      {isChatting && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-muted/50 border rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              분석 중...
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="flex gap-2 border-t pt-4">
                      <Input
                        placeholder="모델 성능에 대해 질문하세요..."
                        value={aiChatInput}
                        onChange={(e) => setAiChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAiChat()}
                        className="flex-1 rounded-full border-purple-200 focus:border-purple-400"
                      />
                      <Button
                        onClick={handleAiChat}
                        disabled={!aiChatInput.trim() || isChatting}
                        className="rounded-full bg-purple-600 hover:bg-purple-700 px-6"
                      >
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Analysis Sidebar */}
              <div className="xl:col-span-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      빠른 AI 진단
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {modelRegistry.filter(m => m.status === 'active' || m.status === 'testing').map((model) => (
                      <div
                        key={model.modelId}
                        className="p-3 rounded-xl border hover:bg-muted/30 transition-colors cursor-pointer group"
                        onClick={() => handleAnalyzeModel(model.modelId)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{model.modelName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">F1: {(model.f1Score*100).toFixed(1)}%</span>
                              <Badge className={`text-[9px] ${getStatusColor(model.status)}`}>{getStatusText(model.status)}</Badge>
                            </div>
                          </div>
                          {analyzingModel === model.modelId ? (
                            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                          ) : (
                            <Brain className="w-4 h-4 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                          )}
                        </div>

                        {/* Inline result preview */}
                        {aiAnalysisResult[model.modelId] && selectedModelForAI !== model.modelId && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-[11px] text-muted-foreground line-clamp-2">{aiAnalysisResult[model.modelId].summary}</p>
                            <Button variant="ghost" size="sm" className="mt-1 h-6 text-[10px] text-purple-600 p-0" onClick={(e) => { e.stopPropagation(); setSelectedModelForAI(model.modelId); setActiveTab("registry"); }}>
                              상세 보기 <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* AI Capabilities */}
                <Card className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">AI 분석 기능</p>
                    {[
                      { icon: Brain, label: "모델별 성능 진단", desc: "강점/위험/권장사항" },
                      { icon: ArrowUpDown, label: "모델 비교 분석", desc: "A/B 성능 비교" },
                      { icon: Activity, label: "드리프트 예측", desc: "PSI/KL 기반 분석" },
                      { icon: Shield, label: "공정성 검증", desc: "DPD/EOD 자동 산출" },
                      { icon: Lightbulb, label: "최적화 권장", desc: "하이퍼파라미터 튜닝" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors">
                          <Icon className="w-4 h-4 text-purple-500 shrink-0" />
                          <div>
                            <p className="text-xs font-medium">{item.label}</p>
                            <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Performance Guidelines */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              성능 평가 및 모니터링 가이드라인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>다양한 메트릭 사용:</strong> 정확도만으로는 부족하며 정밀도, 회수율, F1-Score 등 다양한 지표를 통합 평가</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>기준선 설정:</strong> 비즈니스 요구사항에 맞는 구체적 성능 목표 설정 및 정기 검토</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>지속 모니터링:</strong> 프로덕션 환경에서 실시간으로 성능 지표 수집 및 추적</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>비정상 알림:</strong> 성능 저하 감지 시 신속한 알림 및 대응 체계 구축</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>정기 재교육:</strong> 성능 저하 시 재학습 또는 모델 업데이트 일정 수립</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="modelPerformance"
        title="모델 성능 평가 AI 어시스턴트"
        contextData={JSON.stringify({
          averageAccuracy: '94.5%',
          activeModels: 3,
          testingModels: 1,
          deprecatedModels: 1,
          goalsAchievementRate: '83.3%',
          averageResponseTime: '150.4ms',
          latestMonitoring: monitoringData[monitoringData.length - 1],
          checklistCompletion: completedPercentage,
        })}
      />
    </Layout>
  );
};

export default ModelPerformance;
