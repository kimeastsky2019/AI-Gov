import React, { useState, useMemo } from "react";
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
  Target
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
                      </tr>
                    </thead>
                    <tbody>
                      {modelRegistry.map((model) => (
                        <tr key={model.modelId} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{model.modelName}</div>
                            <div className="text-xs text-muted-foreground">{model.modelId}</div>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
