import React, { useState, useMemo } from "react";
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
  PieChart
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

const DataQualityReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("metrics");

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
