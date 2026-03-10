import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Heart,
  Brain,
  Scale,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  Search
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { useI18n } from "@/lib/i18n";

interface EthicsChecklistItem {
  id: string;
  requirement: string;
  category: string;
  title: string;
  description: string;
  completed: boolean;
  score: number;
  maxScore: number;
}

interface DiscriminationCheck {
  attribute: string;
  groups: Array<{
    name: string;
    decisionRate: number;
    expectedRate: number;
    disparity: number;
    status: "compliant" | "warning" | "critical";
  }>;
}

const EthicsReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [ethicsItems, setEthicsItems] = useState<EthicsChecklistItem[]>([
    // 윤리원칙 (금융 AI 가-1)
    {
      id: "ethics-01",
      requirement: "금융 AI 가-1",
      category: "윤리원칙 부합 검토",
      title: "인간 중심 원칙 준수",
      description: "AI 시스템이 인간의 권리와 존엄성을 존중하는가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    {
      id: "ethics-02",
      requirement: "금융 AI 가-1",
      category: "윤리원칙 부합 검토",
      title: "투명성 및 설명가능성",
      description: "AI의 의사결정 근거가 명확히 설명가능한가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "ethics-03",
      requirement: "금융 AI 가-1",
      category: "윤리원칙 부합 검토",
      title: "공정성 및 비차별",
      description: "AI가 특정 집단에 차별적이지 않은가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    {
      id: "ethics-04",
      requirement: "금융 AI 가-1",
      category: "윤리원칙 부합 검토",
      title: "책임성 및 감시",
      description: "AI의 부정적 영향에 대한 책임 체계가 구축되어 있는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "ethics-05",
      requirement: "금융 AI 가-1",
      category: "윤리원칙 부합 검토",
      title: "보안 및 안정성",
      description: "AI 시스템의 보안과 안정성이 충분히 확보되어 있는가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    // 인간 의사결정 감독·통제 (금융 AI 가-2)
    {
      id: "human-01",
      requirement: "금융 AI 가-2",
      category: "인간 의사결정 감독·통제",
      title: "인간 개입 메커니즘",
      description: "중요 의사결정 시 인간이 개입할 수 있는 체계가 있는가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    {
      id: "human-02",
      requirement: "금융 AI 가-2",
      category: "인간 의사결정 감독·통제",
      title: "의사결정 검토 프로세스",
      description: "AI의 의사결정이 정기적으로 검토되고 감시되는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "human-03",
      requirement: "금융 AI 가-2",
      category: "인간 의사결정 감독·통제",
      title: "이상 탐지 시스템",
      description: "AI가 비정상적으로 작동할 때 자동 감지 및 중단이 가능한가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "human-04",
      requirement: "금융 AI 가-2",
      category: "인간 의사결정 감독·통제",
      title: "책임자 지정",
      description: "AI 시스템의 최종 책임자가 명확히 지정되어 있는가",
      completed: true,
      score: 10,
      maxScore: 10
    },
    {
      id: "human-05",
      requirement: "금융 AI 가-2",
      category: "인간 의사결정 감독·통제",
      title: "모니터링 체계",
      description: "AI의 성능, 편향성, 공정성이 지속적으로 모니터링되는가",
      completed: false,
      score: 6,
      maxScore: 10
    },
    // 10대 핵심요건
    {
      id: "core-01",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "인간 존엄성 보호",
      description: "AI가 인간의 존엄성을 침해하지 않는가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    {
      id: "core-02",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "개인정보 보호",
      description: "개인정보가 적절히 보호되는가",
      completed: true,
      score: 9,
      maxScore: 10
    },
    {
      id: "core-03",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "공정성과 비차별",
      description: "모든 사용자가 공정하게 대우받는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "core-04",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "안전성과 견고성",
      description: "AI가 안전하고 견고하게 작동하는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "core-05",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "투명성과 설명가능성",
      description: "AI의 의사결정이 설명가능한가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "core-06",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "책임성과 감시",
      description: "AI의 영향에 대한 책임 체계가 있는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "core-07",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "데이터 품질 관리",
      description: "학습 데이터의 품질이 적절히 관리되는가",
      completed: true,
      score: 7,
      maxScore: 10
    },
    {
      id: "core-08",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "인간 중심 설계",
      description: "AI 시스템이 인간 중심으로 설계되었는가",
      completed: true,
      score: 8,
      maxScore: 10
    },
    {
      id: "core-09",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "사회적 가치 고려",
      description: "AI가 사회 전체의 가치를 고려하는가",
      completed: false,
      score: 6,
      maxScore: 10
    },
    {
      id: "core-10",
      requirement: "10대 핵심요건",
      category: "인공지능 윤리 기준",
      title: "지속가능성",
      description: "AI 시스템의 운영이 지속가능한가",
      completed: true,
      score: 7,
      maxScore: 10
    },
  ]);

  const [discriminationChecks] = useState<DiscriminationCheck[]>([
    {
      attribute: "성별",
      groups: [
        {
          name: "남성",
          decisionRate: 0.72,
          expectedRate: 0.70,
          disparity: 0.02,
          status: "compliant"
        },
        {
          name: "여성",
          decisionRate: 0.70,
          expectedRate: 0.70,
          disparity: 0.00,
          status: "compliant"
        }
      ]
    },
    {
      attribute: "연령대",
      groups: [
        {
          name: "20-30대",
          decisionRate: 0.75,
          expectedRate: 0.70,
          disparity: 0.05,
          status: "warning"
        },
        {
          name: "40-50대",
          decisionRate: 0.68,
          expectedRate: 0.70,
          disparity: -0.02,
          status: "compliant"
        },
        {
          name: "60대 이상",
          decisionRate: 0.65,
          expectedRate: 0.70,
          disparity: -0.05,
          status: "warning"
        }
      ]
    },
    {
      attribute: "지역",
      groups: [
        {
          name: "수도권",
          decisionRate: 0.72,
          expectedRate: 0.70,
          disparity: 0.02,
          status: "compliant"
        },
        {
          name: "광역지역",
          decisionRate: 0.70,
          expectedRate: 0.70,
          disparity: 0.00,
          status: "compliant"
        },
        {
          name: "기타 지역",
          decisionRate: 0.71,
          expectedRate: 0.70,
          disparity: 0.01,
          status: "compliant"
        }
      ]
    }
  ]);

  const toggleEthicsItem = (id: string) => {
    setEthicsItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getCompletionStats = () => {
    const total = ethicsItems.length;
    const completed = ethicsItems.filter(item => item.completed).length;
    const totalScore = ethicsItems.reduce((sum, item) => sum + item.score, 0);
    const maxTotalScore = ethicsItems.reduce((sum, item) => sum + item.maxScore, 0);
    const overallScore = Math.round((totalScore / maxTotalScore) * 100);
    return { total, completed, overallScore, totalScore, maxTotalScore };
  };

  const stats = useMemo(() => getCompletionStats(), [ethicsItems]);
  const completionRate = Math.round((stats.completed / stats.total) * 100);

  const getItemsByCategory = (category: string) => {
    return ethicsItems.filter(item => item.category === category);
  };

  const renderEthicsCategory = (category: string) => {
    const items = getItemsByCategory(category);
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">{category}</h3>
          <div className="flex justify-between text-sm text-purple-700 dark:text-purple-300">
            <span>{items.filter(i => i.completed).length}/{items.length} 완료</span>
            <span>평균 점수: {Math.round(items.reduce((sum, i) => sum + i.score, 0) / items.length)}/10</span>
          </div>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleEthicsItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.requirement}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-primary">{item.score}/{item.maxScore}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('reg.ethics.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('reg.ethics.subtitle')}
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Download className="mr-2 h-4 w-4" />
            {t('reg.ethics.downloadReport')}
          </Button>
        </div>

        {/* Overall Ethics Score */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${(stats.overallScore / 100) * 282.74} 282.74`}
                      className="text-primary transition-all"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-primary">{stats.overallScore}</p>
                      <p className="text-xs text-muted-foreground">/ 100</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-4">{t('reg.ethics.summaryTitle')}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{t('reg.ethics.completionRate')}</span>
                      <span className="text-sm text-muted-foreground">{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">{t('reg.ethics.performanceScore')}</span>
                      <span className="text-sm text-muted-foreground">{stats.totalScore}/{stats.maxTotalScore}</span>
                    </div>
                    <Progress value={(stats.totalScore / stats.maxTotalScore) * 100} className="h-2" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    AI {t('reg.ethics.overallScore')} {stats.overallScore}점은 {stats.overallScore >= 80 ? t('reg.ethics.excellent') : stats.overallScore >= 60 ? t('reg.ethics.good') : t('reg.ethics.needsImprovement')} {t('reg.ethics.needsImprovement')}.
                    {t('reg.ethics.continuousMonitoring')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('reg.ethics.completionRate')}
            value={`${completionRate}%`}
            change={`${stats.completed}/${stats.total}`}
            trend="up"
          />
          <MetricCard
            title={t('reg.ethics.overallScore')}
            value={`${stats.overallScore}점`}
            change="+5점"
            trend="up"
          />
          <MetricCard
            title={t('reg.ethics.discriminationTest')}
            value={t('reg.ethics.passTest')}
            change={t('reg.ethics.testItems')}
            trend="up"
          />
          <MetricCard
            title={t('reg.ethics.lastReview')}
            value="2024-02-15"
            change={t('reg.ethics.latest')}
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="ethics-checklist" className="w-full space-y-6">
          <div className="border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="ethics-checklist" className="data-[state=active]:bg-background">
                {t('reg.ethics.tab_checklist')}
              </TabsTrigger>
              <TabsTrigger value="discrimination" className="data-[state=active]:bg-background">
                {t('reg.ethics.tab_discrimination')}
              </TabsTrigger>
              <TabsTrigger value="principles" className="data-[state=active]:bg-background">
                {t('reg.ethics.tab_principles')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="ethics-checklist" className="mt-0 space-y-6">
            {renderEthicsCategory(t('reg.ethics.category1'))}
            <div className="mt-8" />
            {renderEthicsCategory(t('reg.ethics.category2'))}
            <div className="mt-8" />
            {renderEthicsCategory(t('reg.ethics.category3'))}
          </TabsContent>

          <TabsContent value="discrimination" className="mt-0 space-y-6">
            <div className="grid gap-6">
              {discriminationChecks.map((check, idx) => {
                const attributeKey = check.attribute === "성별" ? 'reg.ethics.attribute_gender' : check.attribute === "연령대" ? 'reg.ethics.attribute_age' : 'reg.ethics.attribute_region';
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{t(attributeKey)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {check.groups.map((group, gidx) => {
                        let groupKey = '';
                        if (check.attribute === "성별") groupKey = group.name === "남성" ? 'reg.ethics.group_male' : 'reg.ethics.group_female';
                        else if (check.attribute === "연령대") groupKey = group.name === "20-30대" ? 'reg.ethics.group_20_30' : group.name === "40-50대" ? 'reg.ethics.group_40_50' : 'reg.ethics.group_60plus';
                        else groupKey = group.name === "수도권" ? 'reg.ethics.group_seoul' : group.name === "광역지역" ? 'reg.ethics.group_metro' : 'reg.ethics.group_other';
                        return (
                          <div key={gidx} className="pb-4 border-b last:border-b-0 last:pb-0">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{t(groupKey)}</h4>
                              <Badge
                                variant={
                                  group.status === "compliant"
                                    ? "outline"
                                    : group.status === "warning"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  group.status === "compliant"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : group.status === "warning"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : ""
                                }
                              >
                                {group.status === "compliant" ? t('reg.ethics.compliant') : group.status === "warning" ? t('reg.ethics.warning') : t('reg.ethics.critical')}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs mb-1">{t('reg.ethics.decisionRate')}</p>
                                <p className="font-semibold text-lg">{(group.decisionRate * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs mb-1">{t('reg.ethics.expectedRate')}</p>
                                <p className="font-semibold text-lg">{(group.expectedRate * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs mb-1">{t('reg.ethics.difference')}</p>
                                <p className={`font-semibold text-lg ${Math.abs(group.disparity) > 0.03 ? "text-amber-600" : "text-green-600"}`}>
                                  {group.disparity > 0 ? "+" : ""}{(group.disparity * 100).toFixed(1)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="principles" className="mt-0">
            <div className="space-y-6">
              {/* 3대 기본원칙 */}
              <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-lg">{t('reg.ethics.principlesTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <Heart className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{t('reg.ethics.principle1')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('reg.ethics.principle1_desc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-800">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                          <Brain className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{t('reg.ethics.principle2')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('reg.ethics.principle2_desc')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-green-100 dark:border-green-800">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                          <Scale className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{t('reg.ethics.principle3')}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('reg.ethics.principle3_desc')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 핵심요건 설명 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('reg.ethics.coreRequirementsTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('reg.ethics.coreRequirementsDesc')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'reg.ethics.item_core_01_title',
                      'reg.ethics.item_core_02_title',
                      'reg.ethics.item_core_03_title',
                      'reg.ethics.item_core_04_title',
                      'reg.ethics.item_core_05_title',
                      'reg.ethics.item_core_06_title',
                      'reg.ethics.item_core_07_title',
                      'reg.ethics.item_core_08_title',
                      'reg.ethics.item_core_09_title',
                      'reg.ethics.item_core_10_title'
                    ].map((key, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{t(key)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant */}
      <AIAssistantPanel
        context="ethics"
        title={t('reg.ethics.aiAssistantTitle')}
        contextData={JSON.stringify({
          overallScore: stats.overallScore,
          completionRate: `${completionRate}%`,
          totalItems: stats.total,
          completedItems: stats.completed,
          principles: 3,
          coreRequirements: 10,
        })}
      />
    </Layout>
  );
};

export default EthicsReview;
