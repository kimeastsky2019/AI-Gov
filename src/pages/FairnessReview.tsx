import React, { useState, useMemo } from "react";
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
  TrendingDown
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
