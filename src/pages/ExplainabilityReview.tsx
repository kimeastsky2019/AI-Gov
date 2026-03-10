import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface XAIMethod {
  name: string;
  description: string;
  applicability: number;
  interpretability: number;
  complexity: number;
  status: 'implemented' | 'planned' | 'notApplicable';
}

interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  category: string;
  direction: 'positive' | 'negative';
}

interface ComprehensionTest {
  testId: string;
  description: string;
  totalParticipants: number;
  correctAnswers: number;
  comprehensionRate: number;
  avgTimeSeconds: number;
}

interface ExplainabilityMetric {
  name: string;
  value: number;
  target: number;
  description: string;
}

const ExplainabilityReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("methods");

  // TTA 요구사항 07, 09, 11 및 금융 AI 나-3, 다-3 기반 체크리스트
  const explainabilityChecklist = useMemo(() => [
    {
      id: "tta07-01",
      category: t('tech.explain.checklist.category.decision'),
      item: t('tech.explain.checklist.item.reasoning'),
      completed: true,
      description: t('tech.explain.checklist.desc.reasoning')
    },
    {
      id: "tta07-02",
      category: t('tech.explain.checklist.category.decision'),
      item: t('tech.explain.checklist.item.level'),
      completed: true,
      description: t('tech.explain.checklist.desc.level')
    },
    {
      id: "tta09-01",
      category: t('tech.explain.checklist.category.quality'),
      item: t('tech.explain.checklist.item.accuracy'),
      completed: true,
      description: t('tech.explain.checklist.desc.accuracy')
    },
    {
      id: "tta09-02",
      category: t('tech.explain.checklist.category.quality'),
      item: t('tech.explain.checklist.item.consistency'),
      completed: true,
      description: t('tech.explain.checklist.desc.consistency')
    },
    {
      id: "tta11-01",
      category: t('tech.explain.checklist.category.customization'),
      item: t('tech.explain.checklist.item.customized'),
      completed: false,
      description: t('tech.explain.checklist.desc.customized')
    },
    {
      id: "finance-na3",
      category: t('tech.explain.checklist.category.finance'),
      item: t('tech.explain.checklist.item.decision'),
      completed: true,
      description: t('tech.explain.checklist.desc.decision')
    },
    {
      id: "finance-da3",
      category: t('tech.explain.checklist.category.verification'),
      item: t('tech.explain.checklist.item.peerReview'),
      completed: true,
      description: t('tech.explain.checklist.desc.peerReview')
    },
    {
      id: "finance-da4",
      category: t('tech.explain.checklist.category.verification'),
      item: t('tech.explain.checklist.item.customer'),
      completed: true,
      description: t('tech.explain.checklist.desc.customer')
    },
  ], [t]);

  // XAI 기술 평가
  const xaiMethods = useMemo((): XAIMethod[] => [
    {
      name: "SHAP (SHapley Additive exPlanations)",
      description: "게임 이론 기반으로 각 특성의 기여도 계산",
      applicability: 0.95,
      interpretability: 0.92,
      complexity: 0.75,
      status: 'implemented'
    },
    {
      name: "LIME (Local Interpretable Model-agnostic Explanations)",
      description: "국소 선형 모델로 예측 근처에서 설명 생성",
      applicability: 0.90,
      interpretability: 0.88,
      complexity: 0.50,
      status: 'implemented'
    },
    {
      name: "Feature Importance",
      description: "트리 기반 모델에서 특성의 중요도 측정",
      applicability: 0.85,
      interpretability: 0.90,
      complexity: 0.30,
      status: 'implemented'
    },
    {
      name: "Attention Mechanism",
      description: "딥러닝 모델의 주의 메커니즘 시각화",
      applicability: 0.70,
      interpretability: 0.75,
      complexity: 0.85,
      status: 'planned'
    },
    {
      name: "Counterfactual Explanation",
      description: "결과를 바꾸기 위한 필요한 입력 변화 설명",
      applicability: 0.80,
      interpretability: 0.85,
      complexity: 0.70,
      status: 'planned'
    },
  ], []);

  // 특성 중요도 분석
  const featureImportance = useMemo((): FeatureImportance[] => [
    {
      feature: "연체 이력",
      importance: 0.248,
      rank: 1,
      category: "신용력",
      direction: 'negative'
    },
    {
      feature: "신용도",
      importance: 0.195,
      rank: 2,
      category: "신용력",
      direction: 'positive'
    },
    {
      feature: "연간 소득",
      importance: 0.156,
      rank: 3,
      category: "소득",
      direction: 'positive'
    },
    {
      feature: "직업 안정성",
      importance: 0.128,
      rank: 4,
      category: "고용",
      direction: 'positive'
    },
    {
      feature: "기존 대출 잔액",
      importance: 0.112,
      rank: 5,
      category: "채무",
      direction: 'negative'
    },
    {
      feature: "고용 기간",
      importance: 0.088,
      rank: 6,
      category: "고용",
      direction: 'positive'
    },
    {
      feature: "신청 금액",
      importance: 0.073,
      rank: 7,
      category: "대출",
      direction: 'negative'
    },
  ], []);

  // 설명 이해도 테스트 결과
  const comprehensionTests = useMemo((): ComprehensionTest[] => [
    {
      testId: "TEST-001",
      description: "SHAP 기반 설명 이해도 검사",
      totalParticipants: 45,
      correctAnswers: 40,
      comprehensionRate: 0.889,
      avgTimeSeconds: 45.2
    },
    {
      testId: "TEST-002",
      description: "LIME 기반 설명 이해도 검사",
      totalParticipants: 45,
      correctAnswers: 38,
      comprehensionRate: 0.844,
      avgTimeSeconds: 52.3
    },
    {
      testId: "TEST-003",
      description: "Feature Importance 설명 이해도",
      totalParticipants: 45,
      correctAnswers: 42,
      comprehensionRate: 0.933,
      avgTimeSeconds: 38.1
    },
    {
      testId: "TEST-004",
      description: "의사결정 근거 명확성 평가",
      totalParticipants: 45,
      correctAnswers: 41,
      comprehensionRate: 0.911,
      avgTimeSeconds: 41.5
    },
  ], []);

  // 설명가능성 지표
  const explainabilityMetrics = useMemo((): ExplainabilityMetric[] => [
    {
      name: "설명 정확성",
      value: 94.2,
      target: 90.0,
      description: "설명이 실제 모델 동작을 정확히 반영하는 정도"
    },
    {
      name: "설명 일관성",
      value: 96.8,
      target: 95.0,
      description: "동일 입력에 대해 설명이 일관되는 정도"
    },
    {
      name: "사용자 이해도",
      value: 89.4,
      target: 85.0,
      description: "사용자가 제공된 설명을 이해하는 정도"
    },
    {
      name: "설명 완전성",
      value: 91.6,
      target: 90.0,
      description: "설명이 의사결정의 모든 중요 요소를 포함하는 정도"
    },
  ], []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'planned':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'notApplicable':
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'implemented': return t('tech.explain.status.implemented');
      case 'planned': return t('tech.explain.status.planned');
      case 'notApplicable': return t('tech.explain.status.notApplicable');
      default: return status;
    }
  };

  const completedCount = explainabilityChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / explainabilityChecklist.length) * 100);

  const averageComprehension = comprehensionTests.reduce((sum, test) => sum + test.comprehensionRate, 0) / comprehensionTests.length;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('tech.explain.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('tech.explain.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('tech.explain.btnDownloadReport')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              {t('tech.explain.btnSettings')}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('tech.explain.metricAccuracy')}
            value="94.2%"
            change="+0.8%"
            trend="up"
          />
          <MetricCard
            title={t('tech.explain.metricComprehension')}
            value="89.4%"
            change="+2.1%"
            trend="up"
          />
          <MetricCard
            title={t('tech.explain.metricXAI')}
            value="3개"
            change="+0"
            trend="up"
          />
          <MetricCard
            title={t('tech.explain.metricCompleteness')}
            value="91.6%"
            change="+1.5%"
            trend="up"
          />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="methods" className="data-[state=active]:bg-background">
                {t('tech.explain.tabMethods')}
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-background">
                {t('tech.explain.tabFeatures')}
              </TabsTrigger>
              <TabsTrigger value="comprehension" className="data-[state=active]:bg-background">
                {t('tech.explain.tabComprehension')}
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                {t('tech.explain.tabChecklist')}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tech.explain.search')}
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

          {/* Tab: XAI Methods */}
          <TabsContent value="methods" className="mt-0 space-y-6">
            <div className="space-y-4">
              {xaiMethods.map((method, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{method.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{method.description}</p>
                      </div>
                      <Badge className={getStatusColor(method.status)}>
                        {getStatusText(method.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t('tech.explain.xai.applicability')}</span>
                          <span className="text-sm font-bold">{(method.applicability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${method.applicability * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t('tech.explain.xai.interpretability')}</span>
                          <span className="text-sm font-bold">{(method.interpretability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                            style={{ width: `${method.interpretability * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{t('tech.explain.xai.complexity')}</span>
                          <span className="text-sm font-bold">{(method.complexity * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                            style={{ width: `${method.complexity * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metrics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {explainabilityMetrics.map((metric, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{t('tech.explain.metric.current')}</span>
                          <span className="text-2xl font-bold">{metric.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              metric.value >= metric.target
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            }`}
                            style={{ width: `${Math.min(metric.value, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tech.explain.metric.target')}</span>
                        <span className="font-medium">{metric.target.toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Feature Importance */}
          <TabsContent value="features" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.explain.feature.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featureImportance.map((feature, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">#{feature.rank}</span>
                            <h4 className="font-semibold">{feature.feature}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {feature.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{(feature.importance * 100).toFixed(1)}%</div>
                          <p className={`text-xs font-medium ${feature.direction === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                            {feature.direction === 'positive' ? t('tech.explain.feature.positive') : t('tech.explain.feature.negative')}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all ${
                            feature.direction === 'positive'
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-red-500 to-orange-500'
                          }`}
                          style={{ width: `${feature.importance * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50/30 border border-blue-200/50 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">{t('tech.explain.feature.topThree')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {featureImportance.slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="font-bold text-foreground">#{idx + 1}</span>
                    <span>{feature.feature}</span>
                    <span className="font-bold text-foreground ml-auto">{(feature.importance * 100).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Tab: Comprehension Tests */}
          <TabsContent value="comprehension" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('tech.explain.comprehension.title')}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{(averageComprehension * 100).toFixed(1)}%</div>
                    <p className="text-sm text-muted-foreground">{t('tech.explain.comprehension.avg')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comprehensionTests.map((test, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{test.description}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{test.testId}</p>
                        </div>
                        <Badge className={`${test.comprehensionRate >= 0.9 ? 'bg-green-600' : test.comprehensionRate >= 0.85 ? 'bg-blue-600' : 'bg-amber-600'}`}>
                          {(test.comprehensionRate * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t('tech.explain.comprehension.participants')}</span>
                          <div className="text-lg font-bold">{test.totalParticipants}명</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('tech.explain.comprehension.correct')}</span>
                          <div className="text-lg font-bold">{test.correctAnswers}명</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('tech.explain.comprehension.avgTime')}</span>
                          <div className="text-lg font-bold">{test.avgTimeSeconds}초</div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
                          style={{ width: `${test.comprehensionRate * 100}%` }}
                        />
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
                  <CardTitle>{t('tech.explain.checklist.title')}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{explainabilityChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {explainabilityChecklist.map((item) => (
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
                            {item.completed ? t('tech.explain.checklist.completed') : t('tech.explain.checklist.inProgress')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Explainability Guidelines */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              {t('tech.explain.guideline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>다양한 XAI 기법 활용:</strong> SHAP, LIME, Feature Importance 등 모델 특성에 맞는 여러 기법 적용</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>설명의 정확성:</strong> 제공되는 설명이 실제 모델의 의사결정 과정을 정확히 반영하는지 검증</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>사용자 이해도 평가:</strong> 설명이 대상 사용자 수준에서 이해 가능한지 테스트</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>의사결정 근거 제시:</strong> 신용승인 등 중요 의사결정에서는 명확한 근거 제공 필수</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>규제 준수:</strong> 금융감독 기준에 따른 설명가능성 요구사항 충족</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="explainabilityReview"
        title={t('tech.explain.ai.title')}
        contextData={JSON.stringify({
          explanationAccuracy: '94.2%',
          averageComprehension: (averageComprehension * 100).toFixed(1),
          implementedMethods: xaiMethods.filter(m => m.status === 'implemented').length,
          totalMethods: xaiMethods.length,
          topFeature: featureImportance[0].feature,
          topFeatureImportance: (featureImportance[0].importance * 100).toFixed(1),
          checklistCompletion: completedPercentage,
        })}
      />
    </Layout>
  );
};

export default ExplainabilityReview;
