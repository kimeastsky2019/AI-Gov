import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Lightbulb, AlertTriangle, CheckCircle2, Search, Download, Settings,
  BarChart3, Brain, Sparkles, Bot, Shield, Loader2, Zap, Eye,
  ChevronRight, ThumbsUp, ThumbsDown, FileText, Activity,
  Star, CircleDot, Info, HelpCircle, RefreshCw, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

// ─── 신뢰성 평가 차원 정의 ───
interface TrustDimension {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  description: string;
  weight: number; // 가중치 (%)
  criteria: { id: string; label: string; description: string; maxScore: number }[];
}

const TRUST_DIMENSIONS: TrustDimension[] = [
  {
    id: "accuracy", name: "정확성 (Accuracy)", icon: Target, color: "text-blue-600", bgColor: "bg-blue-100",
    description: "AI 모델의 예측/판단이 실제 결과와 일치하는 정도",
    weight: 25,
    criteria: [
      { id: "acc-1", label: "모델 정확도 목표 달성 여부", description: "사전 정의된 정확도(Accuracy) 기준 충족", maxScore: 5 },
      { id: "acc-2", label: "정밀도-재현율 균형", description: "Precision/Recall 트레이드오프 최적화", maxScore: 5 },
      { id: "acc-3", label: "엣지케이스 처리 능력", description: "비정형/극단 입력에 대한 안정적 처리", maxScore: 5 },
    ],
  },
  {
    id: "explainability", name: "설명가능성 (Explainability)", icon: Lightbulb, color: "text-amber-600", bgColor: "bg-amber-100",
    description: "AI의 의사결정 과정과 근거를 사람이 이해할 수 있는 수준으로 설명하는 능력",
    weight: 20,
    criteria: [
      { id: "exp-1", label: "의사결정 근거 제시", description: "주요 변수와 기여도를 명확히 설명", maxScore: 5 },
      { id: "exp-2", label: "사용자 이해도", description: "비전문가도 설명을 이해할 수 있는 수준", maxScore: 5 },
      { id: "exp-3", label: "설명 일관성", description: "동일 입력에 대해 일관된 설명 제공", maxScore: 5 },
    ],
  },
  {
    id: "fairness", name: "공정성 (Fairness)", icon: Shield, color: "text-green-600", bgColor: "bg-green-100",
    description: "특정 집단에 대한 차별 없이 공정한 결과를 도출하는 정도",
    weight: 20,
    criteria: [
      { id: "fair-1", label: "집단 간 결과 균형", description: "보호 속성별 승인율/거절율 격차 최소화", maxScore: 5 },
      { id: "fair-2", label: "편향 완화 조치", description: "식별된 편향에 대한 완화 기법 적용", maxScore: 5 },
      { id: "fair-3", label: "교차 공정성", description: "복합 속성(성별×연령 등) 교차 편향 관리", maxScore: 5 },
    ],
  },
  {
    id: "robustness", name: "견고성 (Robustness)", icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100",
    description: "입력 변동, 적대적 공격, 환경 변화에 대한 모델의 안정성",
    weight: 15,
    criteria: [
      { id: "rob-1", label: "입력 변동 안정성", description: "노이즈/결측 입력에도 안정적 예측", maxScore: 5 },
      { id: "rob-2", label: "적대적 공격 방어", description: "Adversarial Attack에 대한 방어력", maxScore: 5 },
      { id: "rob-3", label: "드리프트 대응력", description: "데이터 분포 변화 시 성능 유지", maxScore: 5 },
    ],
  },
  {
    id: "transparency", name: "투명성 (Transparency)", icon: Eye, color: "text-cyan-600", bgColor: "bg-cyan-100",
    description: "모델 개발 과정, 학습 데이터, 한계점 등을 문서화하고 공개하는 정도",
    weight: 10,
    criteria: [
      { id: "trans-1", label: "모델 카드 작성", description: "모델 목적, 한계, 성능 지표 문서화", maxScore: 5 },
      { id: "trans-2", label: "학습 데이터 명세", description: "데이터 출처, 전처리, 편향 정보 공개", maxScore: 5 },
      { id: "trans-3", label: "변경 이력 관리", description: "모델 버전, 변경사항, 영향 범위 추적", maxScore: 5 },
    ],
  },
  {
    id: "accountability", name: "책임성 (Accountability)", icon: FileText, color: "text-rose-600", bgColor: "bg-rose-100",
    description: "AI 시스템의 결과에 대한 책임 소재와 거버넌스 체계",
    weight: 10,
    criteria: [
      { id: "acc-a1", label: "책임 주체 명확화", description: "의사결정 단계별 책임자 지정", maxScore: 5 },
      { id: "acc-a2", label: "감사 추적성", description: "결정 과정의 완전한 감사 로그", maxScore: 5 },
      { id: "acc-a3", label: "이의제기 절차", description: "사용자 이의제기 및 구제 절차 마련", maxScore: 5 },
    ],
  },
];

// ─── 평가 대상 모델 ───
const EVAL_MODELS = [
  { id: "M-2024-001", name: "신용 승인 모델 v3.2", type: "분류", status: "운영 중" },
  { id: "M-2024-002", name: "거래 이상 탐지 모델 v2.1", type: "분류", status: "운영 중" },
  { id: "M-2024-004", name: "대출 부도 예측 모델 v2.3", type: "분류", status: "운영 중" },
  { id: "M-2024-003", name: "고객 이탈 예측 모델 v1.0", type: "분류", status: "테스트" },
];

const ExplainabilityReview = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("evaluate");
  const [selectedModel, setSelectedModel] = useState(EVAL_MODELS[0].id);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [evaluatorComment, setEvaluatorComment] = useState("");
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, { score: number; reason: string }>>({});
  const [savedEvaluations, setSavedEvaluations] = useState<Record<string, { scores: Record<string, number>; totalScore: number; grade: string; date: string }>>({
    "M-2024-001": { scores: {}, totalScore: 88, grade: "A", date: "2026-03-10" },
    "M-2024-002": { scores: {}, totalScore: 92, grade: "A+", date: "2026-03-09" },
  });
  const [aiChatHistory, setAiChatHistory] = useState<{role:'user'|'ai'; message:string}[]>([]);
  const [aiChatInput, setAiChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  // 점수 계산
  const totalMaxScore = TRUST_DIMENSIONS.reduce((sum, d) => sum + d.criteria.length * 5, 0); // 90
  const currentTotalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const scorePercentage = totalMaxScore > 0 ? Math.round((currentTotalScore / totalMaxScore) * 100) : 0;

  const getGrade = (pct: number) => {
    if (pct >= 95) return { grade: "A+", color: "text-green-600", bg: "bg-green-100" };
    if (pct >= 90) return { grade: "A", color: "text-green-600", bg: "bg-green-100" };
    if (pct >= 85) return { grade: "B+", color: "text-blue-600", bg: "bg-blue-100" };
    if (pct >= 80) return { grade: "B", color: "text-blue-600", bg: "bg-blue-100" };
    if (pct >= 70) return { grade: "C", color: "text-amber-600", bg: "bg-amber-100" };
    return { grade: "D", color: "text-red-600", bg: "bg-red-100" };
  };

  const getDimensionScore = (dimId: string) => {
    const dim = TRUST_DIMENSIONS.find(d => d.id === dimId);
    if (!dim) return 0;
    const max = dim.criteria.length * 5;
    const scored = dim.criteria.reduce((sum, c) => sum + (scores[c.id] || 0), 0);
    return max > 0 ? Math.round((scored / max) * 100) : 0;
  };

  const handleScore = (criteriaId: string, score: number) => {
    setScores(prev => ({ ...prev, [criteriaId]: score }));
  };

  const handleAiEvaluate = () => {
    setIsAiEvaluating(true);
    setTimeout(() => {
      const suggestions: Record<string, { score: number; reason: string }> = {};
      TRUST_DIMENSIONS.forEach(dim => {
        dim.criteria.forEach(c => {
          const base = dim.id === "accuracy" ? 4 : dim.id === "explainability" ? 4 : dim.id === "fairness" ? 3 : dim.id === "robustness" ? 3 : 4;
          const s = Math.min(5, Math.max(2, base + Math.floor(Math.random() * 2)));
          const reasons: Record<string, string[]> = {
            "acc-1": ["정확도 94.5%로 목표(94%) 달성", "목표 달성이나 개선 여지 존재"],
            "acc-2": ["F1-Score 0.94로 균형 양호", "정밀도-재현율 트레이드오프 적절"],
            "acc-3": ["엣지케이스 테스트 커버리지 87%", "극단값 처리 로직 추가 필요"],
            "exp-1": ["SHAP 기반 피처 기여도 제공 중", "Top-3 변수 기여도 명확히 표시"],
            "exp-2": ["이해도 테스트 89.4% 달성", "비전문가 대상 설명 수준 양호"],
            "exp-3": ["동일 입력 설명 일관성 96.8%", "일관성 기준 충족"],
            "fair-1": ["성별 DI=0.925, 4/5 규칙 충족", "연령대 DI=0.913으로 주의 필요"],
            "fair-2": ["SMOTE 적용 계획 수립됨", "완화 기법 적용 진행 중"],
            "fair-3": ["교차 분석 미실시", "여성+고령 교차 그룹 추가 분석 필요"],
            "rob-1": ["노이즈 테스트 통과율 91%", "결측값 5% 이하 안정적 처리"],
            "rob-2": ["적대적 공격 테스트 미수행", "FGSM/PGD 방어 테스트 권장"],
            "rob-3": ["PSI=0.03으로 안정적", "월간 드리프트 모니터링 운영 중"],
            "trans-1": ["모델 카드 작성 완료", "한계점 및 사용 범위 명시"],
            "trans-2": ["데이터 출처 문서화 완료", "전처리 파이프라인 기록"],
            "trans-3": ["MLflow 기반 버전 관리", "변경 이력 자동 추적"],
            "acc-a1": ["서비스 오너 지정 완료", "RACI 매트릭스 수립"],
            "acc-a2": ["감사 로그 100% 기록", "결정 과정 추적 가능"],
            "acc-a3": ["이의제기 절차 마련", "고객 민원 처리 프로세스 운영"],
          };
          suggestions[c.id] = { score: s, reason: (reasons[c.id] || ["AI 자동 평가 결과"])[s >= 4 ? 0 : 1] || "평가 완료" };
        });
      });
      setAiSuggestions(suggestions);
      // Auto-fill empty scores
      const newScores = { ...scores };
      Object.entries(suggestions).forEach(([id, { score }]) => {
        if (!newScores[id]) newScores[id] = score;
      });
      setScores(newScores);
      setIsAiEvaluating(false);
    }, 2500);
  };

  const handleSaveEvaluation = () => {
    const pct = scorePercentage;
    const g = getGrade(pct);
    setSavedEvaluations(prev => ({
      ...prev,
      [selectedModel]: { scores: { ...scores }, totalScore: pct, grade: g.grade, date: new Date().toISOString().split('T')[0] },
    }));
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
      if (lower.includes("신뢰") || lower.includes("trust")) {
        response = "현재 신용 승인 모델 v3.2의 신뢰성 종합 점수는 88/100(A등급)입니다.\n\n차원별 현황:\n- 정확성: 93% (양호)\n- 설명가능성: 89% (양호, SHAP/LIME 적용)\n- 공정성: 78% (주의, 성별 DI=0.925)\n- 견고성: 82% (보통, 적대적 테스트 미수행)\n- 투명성: 93% (양호)\n- 책임성: 90% (양호)\n\n공정성과 견고성 차원의 개선이 우선 과제입니다.";
      } else if (lower.includes("개선") || lower.includes("improve")) {
        response = "신뢰성 향상을 위한 우선순위 권장사항:\n\n1. **공정성 강화** (현재 78%)\n   - 성별 편향 완화: Equalized Odds 제약 학습\n   - 교차 편향 분석 수행 (여성+60대)\n\n2. **견고성 강화** (현재 82%)\n   - 적대적 공격 방어 테스트 (FGSM, PGD)\n   - 입력 변동 허용 범위 확대\n\n3. **설명가능성 향상** (현재 89%)\n   - 사용자 맞춤형 설명 수준 제공\n   - Counterfactual Explanation 추가 적용";
      } else if (lower.includes("규제") || lower.includes("기준")) {
        response = "AI 신뢰성 관련 주요 규제/기준:\n\n1. **EU AI Act** - 고위험 AI 신뢰성 요구사항\n2. **TTA-2023** - 요구사항 07(설명), 09(품질), 11(맞춤화)\n3. **OECD AI Principles** - 5대 원칙(투명성, 공정성, 책임성 등)\n4. **ISO/IEC 42001** - AI 경영시스템\n5. **금융감독원** - 나-3(설명 의무), 다-3(검증)\n\n현재 대부분 기준을 충족하나, EU AI Act의 견고성 요구사항 보완이 필요합니다.";
      } else {
        response = `"${msg}"에 대한 분석입니다.\n\n신뢰성 평가는 6개 차원(정확성, 설명가능성, 공정성, 견고성, 투명성, 책임성)으로 구성되며, 각 차원별 3개 세부 기준(총 18개)으로 평가합니다. 구체적인 차원에 대해 질문해 주세요.`;
      }
      setAiChatHistory(prev => [...prev, { role: 'ai', message: response }]);
      setIsChatting(false);
    }, 1800);
  };

  const gradeInfo = getGrade(scorePercentage);
  const scoredCount = Object.keys(scores).length;
  const totalCriteria = TRUST_DIMENSIONS.reduce((sum, d) => sum + d.criteria.length, 0);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI 신뢰성 평가</h1>
            <p className="text-muted-foreground mt-1">6대 신뢰성 평가지표 기반 AI 모델 종합 신뢰도 평가 (TTA 07/09/11, EU AI Act)</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />보고서 다운로드</Button>
            <Button variant="outline" size="sm"><Settings className="mr-2 h-4 w-4" />설정</Button>
          </div>
        </div>

        {/* AI Solution Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
            <CardContent className="relative py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">AI 신뢰성 평가 솔루션</h3>
                    <p className="text-sm text-white/80">
                      6대 지표(정확성/설명가능성/공정성/견고성/투명성/책임성) × 18개 세부 기준으로 간편 평가
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white/15 border-white/30 text-white hover:bg-white/25 gap-2 border"
                    onClick={handleAiEvaluate} disabled={isAiEvaluating}>
                    {isAiEvaluating ? <><Loader2 className="w-4 h-4 animate-spin" />AI 평가 중...</> : <><Brain className="w-4 h-4" />AI 자동 평가</>}
                  </Button>
                  <Button className="bg-white text-orange-700 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => setActiveTab("ai-consult")}>
                    <Sparkles className="w-4 h-4" />AI 컨설팅
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="pt-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">종합 신뢰도 등급</p>
              <div className={cn("text-5xl font-black", scoredCount > 0 ? gradeInfo.color : "text-gray-300")}>
                {scoredCount > 0 ? gradeInfo.grade : "-"}
              </div>
              <p className="text-sm font-semibold mt-1">{scoredCount > 0 ? `${scorePercentage}점 / 100점` : "미평가"}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{scoredCount}/{totalCriteria} 항목 평가 완료</p>
            </CardContent>
          </Card>
          {TRUST_DIMENSIONS.slice(0, 3).map(dim => {
            const dimScore = getDimensionScore(dim.id);
            const DimIcon = dim.icon;
            return (
              <Card key={dim.id}>
                <CardContent className="pt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", dim.bgColor)}>
                      <DimIcon className={cn("w-4 h-4", dim.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{dim.name}</p>
                      <p className={cn("text-2xl font-bold", dimScore > 0 ? dim.color : "text-gray-300")}>{dimScore > 0 ? `${dimScore}%` : "-"}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={cn("h-full rounded-full transition-all", dimScore >= 80 ? "bg-green-500" : dimScore >= 60 ? "bg-amber-500" : dimScore > 0 ? "bg-red-500" : "bg-gray-200")}
                      style={{ width: `${dimScore}%` }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Model Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold shrink-0">평가 대상 모델:</label>
          <Select value={selectedModel} onValueChange={(v) => { setSelectedModel(v); setScores({}); setAiSuggestions({}); }}>
            <SelectTrigger className="w-80"><SelectValue /></SelectTrigger>
            <SelectContent>
              {EVAL_MODELS.map(m => (
                <SelectItem key={m.id} value={m.id}>
                  <span className="font-medium">{m.name}</span>
                  <Badge className="ml-2 text-[9px]" variant="secondary">{m.status}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {savedEvaluations[selectedModel] && (
            <Badge className="bg-green-100 text-green-700 text-xs gap-1">
              <CheckCircle2 className="w-3 h-3" />
              이전 평가: {savedEvaluations[selectedModel].grade} ({savedEvaluations[selectedModel].date})
            </Badge>
          )}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="evaluate" className="data-[state=active]:bg-background">
              <Star className="w-4 h-4 mr-1.5" />평가 수행
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-background">
              <BarChart3 className="w-4 h-4 mr-1.5" />평가 결과
            </TabsTrigger>
            <TabsTrigger value="ai-consult" className="data-[state=active]:bg-background">
              <Brain className="w-4 h-4 mr-1.5" />AI 컨설팅
            </TabsTrigger>
          </TabsList>

          {/* Tab: Evaluate */}
          <TabsContent value="evaluate" className="mt-0 space-y-6">
            {TRUST_DIMENSIONS.map((dim, dimIdx) => {
              const DimIcon = dim.icon;
              const dimScore = getDimensionScore(dim.id);
              return (
                <motion.div key={dim.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dimIdx * 0.08 }}>
                  <Card className={cn("overflow-hidden transition-all", dimScore > 0 && dimScore >= 80 && "ring-1 ring-green-200")}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", dim.bgColor)}>
                            <DimIcon className={cn("w-5 h-5", dim.color)} />
                          </div>
                          <div>
                            <CardTitle className="text-base">{dim.name}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-0.5">{dim.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-xs">가중치 {dim.weight}%</Badge>
                          <div className={cn("text-xl font-bold", dimScore >= 80 ? "text-green-600" : dimScore >= 60 ? "text-amber-600" : dimScore > 0 ? "text-red-600" : "text-gray-300")}>
                            {dimScore > 0 ? `${dimScore}%` : "-"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dim.criteria.map((criterion) => {
                        const currentScore = scores[criterion.id] || 0;
                        const suggestion = aiSuggestions[criterion.id];
                        return (
                          <div key={criterion.id} className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <p className="text-sm font-semibold">{criterion.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{criterion.description}</p>
                                {suggestion && (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="mt-2 flex items-start gap-1.5 text-[11px] text-purple-600 bg-purple-50 p-2 rounded-lg">
                                    <Bot className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    <span>AI 권장 {suggestion.score}점: {suggestion.reason}</span>
                                  </motion.div>
                                )}
                              </div>
                              {/* Score Buttons */}
                              <div className="flex items-center gap-1 shrink-0">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <button key={s} onClick={() => handleScore(criterion.id, s)}
                                    className={cn(
                                      "w-9 h-9 rounded-lg text-sm font-bold transition-all border",
                                      currentScore === s
                                        ? s >= 4 ? "bg-green-500 text-white border-green-600 shadow-md scale-110" :
                                          s === 3 ? "bg-amber-500 text-white border-amber-600 shadow-md scale-110" :
                                          "bg-red-500 text-white border-red-600 shadow-md scale-110"
                                        : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
                                    )}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Save & Comment */}
            <Card>
              <CardContent className="pt-5 space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">평가자 의견 (선택)</label>
                  <Textarea placeholder="평가 소견, 특이사항, 개선 필요 사항을 기록하세요..." value={evaluatorComment}
                    onChange={e => setEvaluatorComment(e.target.value)} className="min-h-[80px]" />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{scoredCount}/{totalCriteria} 항목 평가 완료</p>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => { setScores({}); setAiSuggestions({}); }}>초기화</Button>
                    <Button onClick={handleSaveEvaluation} disabled={scoredCount === 0}
                      className="gap-2 bg-orange-600 hover:bg-orange-700">
                      <CheckCircle2 className="w-4 h-4" /> 평가 저장
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Results */}
          <TabsContent value="results" className="mt-0 space-y-6">
            {/* All Models Summary */}
            <Card>
              <CardHeader><CardTitle>모델별 신뢰성 평가 현황</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {EVAL_MODELS.map(model => {
                    const ev = savedEvaluations[model.id];
                    return (
                      <div key={model.id} className="p-4 rounded-xl border hover:bg-muted/30 transition-colors flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">{model.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px]">{model.status}</Badge>
                            {ev && <span className="text-xs text-muted-foreground">평가일: {ev.date}</span>}
                          </div>
                        </div>
                        {ev ? (
                          <div className="flex items-center gap-4">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className={cn("h-full rounded-full", ev.totalScore >= 90 ? "bg-green-500" : ev.totalScore >= 80 ? "bg-blue-500" : "bg-amber-500")}
                                style={{ width: `${ev.totalScore}%` }} />
                            </div>
                            <span className="text-sm font-medium w-10 text-right">{ev.totalScore}%</span>
                            <Badge className={cn("text-sm font-bold w-10 justify-center",
                              ev.grade.startsWith("A") ? "bg-green-100 text-green-700" : ev.grade.startsWith("B") ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                            )}>{ev.grade}</Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">미평가</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Dimension Breakdown */}
            {scoredCount > 0 && (
              <Card>
                <CardHeader><CardTitle>현재 모델 차원별 점수</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {TRUST_DIMENSIONS.map(dim => {
                      const DimIcon = dim.icon;
                      const ds = getDimensionScore(dim.id);
                      return (
                        <div key={dim.id} className="p-4 rounded-xl border text-center">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2", dim.bgColor)}>
                            <DimIcon className={cn("w-5 h-5", dim.color)} />
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">{dim.name.split(" (")[0]}</p>
                          <p className={cn("text-2xl font-bold mt-1", ds >= 80 ? "text-green-600" : ds >= 60 ? "text-amber-600" : ds > 0 ? "text-red-600" : "text-gray-300")}>
                            {ds > 0 ? `${ds}%` : "-"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">가중치 {dim.weight}%</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: AI Consult */}
          <TabsContent value="ai-consult" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Bot className="w-5 h-5 text-orange-600" /> AI 신뢰성 컨설턴트
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">신뢰성 평가, 개선 방안, 규제 대응 등 자유롭게 질문하세요</p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                      {aiChatHistory.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-white flex items-center justify-center shadow-lg border border-orange-200">
                              <Star className="w-8 h-8 text-orange-600" />
                            </div>
                          </div>
                          <p className="font-semibold">신뢰성에 대해 무엇을 확인할까요?</p>
                          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                            {["현재 신뢰도 종합 분석", "개선 우선순위 알려줘", "관련 규제 기준 알려줘"].map(s => (
                              <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-orange-50 hover:border-orange-300"
                                onClick={() => setAiChatInput(s)}>{s}</Button>
                            ))}
                          </div>
                        </div>
                      )}
                      {aiChatHistory.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-orange-600 text-white rounded-br-md' : 'bg-muted/50 border rounded-bl-md'}`}>{msg.message}</div>
                        </motion.div>
                      ))}
                      {isChatting && <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div><div className="bg-muted/50 border rounded-2xl rounded-bl-md px-4 py-3"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" />분석 중...</div></div></div>}
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                      <Input placeholder="신뢰성에 대해 질문하세요..." value={aiChatInput} onChange={e => setAiChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAiChat()} className="flex-1 rounded-full border-orange-200 focus:border-orange-400" />
                      <Button onClick={handleAiChat} disabled={!aiChatInput.trim() || isChatting} className="rounded-full bg-orange-600 hover:bg-orange-700 px-6">
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="xl:col-span-4 space-y-4">
                <Card className="bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">6대 신뢰성 지표</p>
                    {TRUST_DIMENSIONS.map(dim => {
                      const DimIcon = dim.icon;
                      const ds = getDimensionScore(dim.id);
                      return (
                        <div key={dim.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors">
                          <DimIcon className={cn("w-4 h-4 shrink-0", dim.color)} />
                          <div className="flex-1">
                            <p className="text-xs font-medium">{dim.name.split(" (")[0]}</p>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div className={cn("h-full rounded-full", ds >= 80 ? "bg-green-500" : ds >= 60 ? "bg-amber-500" : ds > 0 ? "bg-red-500" : "bg-gray-200")}
                                style={{ width: `${ds}%` }} />
                            </div>
                          </div>
                          <span className="text-xs font-bold w-8 text-right">{ds > 0 ? `${ds}%` : "-"}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ExplainabilityReview;
