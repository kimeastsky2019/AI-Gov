import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  Download,
  Settings,
  Brain,
  TrendingUp,
  AlertTriangle,
  Globe,
  BookOpen,
  Target,
  Users
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
import { Progress } from "@/components/ui/progress";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { AIAssistantInline } from "@/components/AIAssistantInline";
import { useI18n } from "@/lib/i18n";

interface RegulatoryFramework {
  id: string;
  name: string;
  region: string;
  type: "eu" | "international" | "korea";
  implementationStatus: "not_started" | "in_progress" | "partial" | "compliant";
  effectiveDate: string;
  coverage: number;
  riskLevel: "low" | "medium" | "high";
  requirements: string[];
  lastReview: string;
}

interface ComplianceGap {
  id: string;
  framework: string;
  requirement: string;
  currentStatus: string;
  targetStatus: string;
  priority: "low" | "medium" | "high";
  deadline: string;
  owner: string;
}

const ComplianceManagement = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [frameworks] = useState<RegulatoryFramework[]>([
    {
      id: "eu-ai-act",
      name: "EU AI Act",
      region: "EU",
      type: "eu",
      implementationStatus: "in_progress",
      effectiveDate: "2025-02-02",
      coverage: 85,
      riskLevel: "high",
      requirements: [
        "High-risk AI systems registration",
        "Transparency and documentation",
        "Human oversight mechanisms",
        "Data governance requirements",
        "Post-market monitoring"
      ],
      lastReview: "2024-02-10"
    },
    {
      id: "oecd-ai",
      name: "OECD AI Principles",
      region: "International",
      type: "international",
      implementationStatus: "partial",
      effectiveDate: "2019-05-22",
      coverage: 72,
      riskLevel: "medium",
      requirements: [
        "Human-centric values and fairness",
        "Transparency and explainability",
        "Accountability",
        "Robustness, security and safety",
        "Privacy protection"
      ],
      lastReview: "2024-01-28"
    },
    {
      id: "nist-rmf",
      name: "NIST AI Risk Management Framework",
      region: "USA",
      type: "international",
      implementationStatus: "not_started",
      effectiveDate: "2023-01-26",
      coverage: 35,
      riskLevel: "medium",
      requirements: [
        "Map AI risk in context",
        "Measure AI system performance",
        "Manage AI risks through governance",
        "Monitor AI system performance",
        "Continuous improvement"
      ],
      lastReview: "2024-01-20"
    },
    {
      id: "kisa-ethics",
      name: "KISA AI 윤리 가이드라인",
      region: "Korea",
      type: "korea",
      implementationStatus: "compliant",
      effectiveDate: "2020-12-23",
      coverage: 100,
      riskLevel: "low",
      requirements: [
        "인간 존엄성 보호",
        "개인정보 보호",
        "공정성 및 비차별",
        "투명성 및 설명가능성",
        "책임성 및 감시"
      ],
      lastReview: "2024-02-15"
    },
    {
      id: "korea-data-protection",
      name: "개인정보보호법",
      region: "Korea",
      type: "korea",
      implementationStatus: "compliant",
      effectiveDate: "2020-08-05",
      coverage: 100,
      riskLevel: "low",
      requirements: [
        "개인정보 수집·이용 제한",
        "동의 관리",
        "보안 조치",
        "정보 공시",
        "이용자 권리 보호"
      ],
      lastReview: "2024-02-12"
    },
    {
      id: "financial-ai",
      name: "금융분야 AI 안내서",
      region: "Korea",
      type: "korea",
      implementationStatus: "partial",
      effectiveDate: "2021-12-31",
      coverage: 78,
      riskLevel: "high",
      requirements: [
        "윤리원칙 부합 검토",
        "인간 의사결정 감독·통제",
        "기본원칙 준수",
        "소비자 보호",
        "위험 관리"
      ],
      lastReview: "2024-02-08"
    },
  ]);

  const [gapAnalysis] = useState<ComplianceGap[]>([
    {
      id: "gap-01",
      framework: "EU AI Act",
      requirement: "High-risk AI systems registry",
      currentStatus: "Partial documentation",
      targetStatus: "Full compliance",
      priority: "high",
      deadline: "2025-02-02",
      owner: "Legal & Compliance"
    },
    {
      id: "gap-02",
      framework: "EU AI Act",
      requirement: "Conformity assessment procedures",
      currentStatus: "In review",
      targetStatus: "Documented procedures",
      priority: "high",
      deadline: "2025-01-31",
      owner: "Product Team"
    },
    {
      id: "gap-03",
      framework: "NIST AI RMF",
      requirement: "AI risk mapping and context",
      currentStatus: "Not started",
      targetStatus: "Comprehensive documentation",
      priority: "medium",
      deadline: "2024-06-30",
      owner: "Risk Management"
    },
    {
      id: "gap-04",
      framework: "금융분야 AI 안내서",
      requirement: "모니터링 체계 강화",
      currentStatus: "기본 체계 구축",
      targetStatus: "실시간 모니터링 시스템",
      priority: "medium",
      deadline: "2024-05-31",
      owner: "AI Operations"
    },
    {
      id: "gap-05",
      framework: "OECD AI Principles",
      requirement: "Post-implementation monitoring",
      currentStatus: "Quarterly review",
      targetStatus: "Real-time monitoring",
      priority: "low",
      deadline: "2024-07-31",
      owner: "Governance"
    },
  ]);

  const getFrameworksByType = (type: "eu" | "international" | "korea") => {
    return frameworks.filter(f => f.type === type);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
      case "complete":
        return "bg-green-50 text-green-700 border-green-200";
      case "partial":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "compliant":
        return t('reg.compliance.compliant');
      case "partial":
        return t('reg.compliance.partial');
      case "in_progress":
        return t('reg.compliance.inProgress');
      case "not_started":
        return t('reg.compliance.notStarted');
      default:
        return status;
    }
  };

  const overallCompliance = useMemo(() => {
    const total = frameworks.length;
    const compliant = frameworks.filter(f => f.implementationStatus === "compliant").length;
    const partial = frameworks.filter(f => f.implementationStatus === "partial").length;
    const inProgress = frameworks.filter(f => f.implementationStatus === "in_progress").length;
    const avgCoverage = Math.round(frameworks.reduce((sum, f) => sum + f.coverage, 0) / frameworks.length);
    return { total, compliant, partial, inProgress, avgCoverage };
  }, [frameworks]);

  const highRiskFrameworks = frameworks.filter(f => f.riskLevel === "high");
  const mediumRiskFrameworks = frameworks.filter(f => f.riskLevel === "medium");

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('reg.compliance.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('reg.compliance.subtitle')}
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Download className="mr-2 h-4 w-4" />
            {t('reg.compliance.downloadReport')}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('reg.compliance.frameworks')}
            value={`${overallCompliance.total}개`}
            change={`${overallCompliance.compliant} ${t('reg.compliance.complied')}`}
            trend="up"
          />
          <MetricCard
            title={t('reg.compliance.avgCoverage')}
            value={`${overallCompliance.avgCoverage}%`}
            change="+5%"
            trend="up"
          />
          <MetricCard
            title={t('reg.compliance.highRiskFrameworks')}
            value={`${highRiskFrameworks.length}개`}
            change={t('reg.compliance.needsImmediate')}
            trend="down"
          />
          <MetricCard
            title={t('reg.compliance.unresolvedGaps')}
            value={`${gapAnalysis.length}개`}
            change={t('reg.compliance.urgent')}
            trend="down"
          />
        </div>

        {/* Risk Overview */}
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {t('reg.compliance.riskFrameworksTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskFrameworks.map((fw) => (
                <div key={fw.id} className="flex items-start justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-100 dark:border-amber-800">
                  <div className="flex-1">
                    <h4 className="font-semibold">{fw.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      발효 예정: {fw.effectiveDate}
                    </p>
                  </div>
                  <Badge variant="destructive" className="ml-2">
                    {getStatusLabel(fw.implementationStatus)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="frameworks" className="w-full space-y-6">
          <div className="border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="frameworks" className="data-[state=active]:bg-background">
                {t('reg.compliance.tab_frameworks')}
              </TabsTrigger>
              <TabsTrigger value="gap-analysis" className="data-[state=active]:bg-background">
                {t('reg.compliance.tab_gapAnalysis')}
              </TabsTrigger>
              <TabsTrigger value="regional" className="data-[state=active]:bg-background">
                {t('reg.compliance.tab_regional')}
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-background">
                {t('reg.compliance.tab_timeline')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="frameworks" className="mt-0 space-y-4">
            {frameworks.map((fw) => (
              <Card key={fw.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{fw.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            fw.type === "eu"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : fw.type === "international"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {fw.type === "eu" ? t('reg.compliance.type_eu') : fw.type === "international" ? t('reg.compliance.type_international') : t('reg.compliance.type_korea')}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            fw.riskLevel === "high"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : fw.riskLevel === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-green-50 text-green-700 border-green-200"
                          }
                        >
                          {fw.riskLevel === "high" ? t('reg.compliance.riskLevel_high') : fw.riskLevel === "medium" ? t('reg.compliance.riskLevel_medium') : t('reg.compliance.riskLevel_low')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{t('reg.compliance.effectiveDateLabel')} {fw.effectiveDate}</p>
                    </div>
                    <Badge className={getStatusColor(fw.implementationStatus)}>
                      {getStatusLabel(fw.implementationStatus)}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{t('reg.compliance.complianceProgress')}</span>
                        <span className="text-sm text-muted-foreground">{fw.coverage}%</span>
                      </div>
                      <Progress value={fw.coverage} className="h-2" />
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-2 font-semibold">{t('reg.compliance.mainRequirements')}</p>
                      <div className="flex flex-wrap gap-2">
                        {fw.requirements.slice(0, 3).map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {fw.requirements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            {t('reg.compliance.more')}{fw.requirements.length - 3}개
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {t('reg.compliance.lastReview')} {fw.lastReview}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="gap-analysis" className="mt-0 space-y-4">
            {gapAnalysis.map((gap) => (
              <Card key={gap.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div>
                          <h4 className="font-semibold">{gap.requirement}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{gap.framework}</p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        gap.priority === "high"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : gap.priority === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-green-50 text-green-700 border-green-200"
                      }
                    >
                      {gap.priority === "high" ? "긴급" : gap.priority === "medium" ? "높음" : "보통"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('reg.compliance.currentStatus')}</p>
                      <p className="text-sm font-medium">{gap.currentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{t('reg.compliance.targetStatus')}</p>
                      <p className="text-sm font-medium text-green-600">{gap.targetStatus}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
                    <span>{t('reg.compliance.owner')} {gap.owner}</span>
                    <span>{t('reg.compliance.deadline')} {gap.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="regional" className="mt-0 space-y-6">
            {/* EU Frameworks */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">{t('reg.compliance.eu_regulations')}</h3>
              </div>
              <div className="space-y-3">
                {getFrameworksByType("eu").map((fw) => (
                  <Card key={fw.id}>
                    <CardContent className="pt-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{fw.name}</h4>
                        <p className="text-sm text-muted-foreground">{t('reg.compliance.effective')} {fw.effectiveDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{fw.coverage}%</p>
                        <Badge className={getStatusColor(fw.implementationStatus)}>
                          {getStatusLabel(fw.implementationStatus)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* International Frameworks */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">{t('reg.compliance.international_standards')}</h3>
              </div>
              <div className="space-y-3">
                {getFrameworksByType("international").map((fw) => (
                  <Card key={fw.id}>
                    <CardContent className="pt-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{fw.name}</h4>
                        <p className="text-sm text-muted-foreground">{t('reg.compliance.effective')} {fw.effectiveDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{fw.coverage}%</p>
                        <Badge className={getStatusColor(fw.implementationStatus)}>
                          {getStatusLabel(fw.implementationStatus)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Korea Frameworks */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">{t('reg.compliance.korea_regulations')}</h3>
              </div>
              <div className="space-y-3">
                {getFrameworksByType("korea").map((fw) => (
                  <Card key={fw.id}>
                    <CardContent className="pt-6 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{fw.name}</h4>
                        <p className="text-sm text-muted-foreground">{t('reg.compliance.effective')} {fw.effectiveDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">{fw.coverage}%</p>
                        <Badge className={getStatusColor(fw.implementationStatus)}>
                          {getStatusLabel(fw.implementationStatus)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t('reg.compliance.timeline_title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {frameworks
                  .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime())
                  .map((fw, idx) => (
                    <div key={fw.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          fw.riskLevel === "high"
                            ? "bg-red-100 text-red-700"
                            : fw.riskLevel === "medium"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                        }`}>
                          {idx + 1}
                        </div>
                        {idx < frameworks.length - 1 && (
                          <div className="w-0.5 h-12 bg-border mt-2" />
                        )}
                      </div>
                      <div className="pb-8 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{fw.name}</h4>
                          <span className="text-xs font-medium text-muted-foreground">{fw.effectiveDate}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{fw.region}</p>
                        <Badge className={getStatusColor(fw.implementationStatus)}>
                          {getStatusLabel(fw.implementationStatus)}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Compliance Summary */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              {t('reg.compliance.summaryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-2xl font-bold text-green-600">{overallCompliance.compliant}</p>
                <p className="text-xs text-muted-foreground">{t('reg.compliance.compliantCount')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-amber-100 dark:border-amber-800">
                <p className="text-2xl font-bold text-amber-600">{overallCompliance.partial}</p>
                <p className="text-xs text-muted-foreground">{t('reg.compliance.partialCount')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-2xl font-bold text-blue-600">{overallCompliance.inProgress}</p>
                <p className="text-xs text-muted-foreground">{t('reg.compliance.inProgressCount')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg border border-purple-100 dark:border-purple-800">
                <p className="text-2xl font-bold text-purple-600">{overallCompliance.avgCoverage}%</p>
                <p className="text-xs text-muted-foreground">{t('reg.compliance.avgCoveragePercent')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('reg.compliance.summaryDesc')} {overallCompliance.total}{t('reg.compliance.summaryDesc2')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <AIAssistantPanel
        context="compliance"
        title={t('reg.compliance.aiAssistantTitle')}
        contextData={JSON.stringify({
          totalFrameworks: overallCompliance.total,
          compliantFrameworks: overallCompliance.compliant,
          partialFrameworks: overallCompliance.partial,
          inProgressFrameworks: overallCompliance.inProgress,
          avgCoverage: `${overallCompliance.avgCoverage}%`,
          highRiskCount: highRiskFrameworks.length,
          gapCount: gapAnalysis.length,
        })}
      />
    </Layout>
  );
};

export default ComplianceManagement;
