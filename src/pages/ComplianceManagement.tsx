import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
  Users,
  Sparkles,
  ChevronRight,
  Lightbulb,
  Scale,
  FileText,
  Shield,
  Loader2,
  Bot,
  Search
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
      id: "korea-ai-basic",
      name: "인공지능 기본법 (AI 기본법)",
      region: "Korea",
      type: "korea",
      implementationStatus: "in_progress",
      effectiveDate: "2026-01-21",
      coverage: 62,
      riskLevel: "high",
      requirements: [
        "고위험 AI 영향평가 의무",
        "AI 윤리원칙 준수",
        "투명성·설명가능성 확보",
        "인공지능위원회 거버넌스",
        "이용자 권리 보장",
        "초거대 AI 특별 규정"
      ],
      lastReview: "2026-03-15"
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
      id: "gap-k1",
      framework: "인공지능 기본법",
      requirement: "고위험 AI 영향평가 실시",
      currentStatus: "평가 체계 설계 중",
      targetStatus: "전 서비스 영향평가 완료",
      priority: "high",
      deadline: "2026-01-21",
      owner: "AI 거버넌스팀"
    },
    {
      id: "gap-k2",
      framework: "인공지능 기본법",
      requirement: "초거대 AI 안전 조치",
      currentStatus: "검토 중",
      targetStatus: "안전 기준 충족 및 신고",
      priority: "high",
      deadline: "2026-07-01",
      owner: "AI CoE"
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

        {/* Solution Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-900 border-0 text-white">
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">AI 규제 준수 관리</h3>
                  <p className="text-sm text-white/60 mt-0.5">한국 AI 기본법 · EU AI Act · 금융 AI 가이드라인 통합 규제 검토 및 준수 전략</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30 gap-2 border">
                    <Scale className="w-4 h-4" /> AI 규제 소개
                  </Button>
                  <Button className="bg-white text-gray-900 hover:bg-white/90 gap-2 font-semibold">
                    <Shield className="w-4 h-4" /> 검토 전략
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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
              <TabsTrigger value="regulation-intro" className="data-[state=active]:bg-background">
                <Scale className="w-4 h-4 mr-1" />
                AI 규제 소개
              </TabsTrigger>
              <TabsTrigger value="review-strategy" className="data-[state=active]:bg-background">
                <Shield className="w-4 h-4 mr-1" />
                검토 전략
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
          {/* Tab: AI 규제 소개 */}
          <TabsContent value="regulation-intro" className="mt-0 space-y-6">
            {/* 한국 AI 기본법 */}
            <Card className="border-l-4 border-l-blue-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-xl">🇰🇷</span> 인공지능 기본법 (AI 기본법)
                    </CardTitle>
                    <CardDescription className="mt-1">2026년 1월 21일 시행 | 대한민국 최초의 AI 포괄 규제법</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">시행 중</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
                  <p className="text-sm leading-relaxed">
                    인공지능 기본법은 AI 기술의 발전과 산업 진흥을 지원하면서도, 고위험 AI로 인한 사회적 위험을 관리하기 위한
                    대한민국 최초의 AI 전담 법률입니다. EU AI Act와 함께 전 세계에서 가장 체계적인 AI 규제 프레임워크 중 하나입니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">핵심 조항</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { article: "제2조", title: "정의", desc: "인공지능, 고위험 AI, 초거대 AI, AI 사업자 등 핵심 용어 정의", tag: "기본" },
                      { article: "제8조", title: "인공지능위원회", desc: "국무총리 소속 인공지능위원회 설치, AI 정책 최고 의사결정 기구", tag: "거버넌스" },
                      { article: "제18조", title: "고위험 AI 영향평가", desc: "생명·안전·기본권에 영향을 미치는 고위험 AI에 대한 영향평가 의무", tag: "핵심" },
                      { article: "제22조", title: "투명성 확보", desc: "AI 이용 사실 고지, 의사결정 과정 설명 의무", tag: "투명성" },
                      { article: "제27조", title: "이용자 권리", desc: "AI 의사결정에 대한 설명 요구권, 이의제기권, 인적 개입 요구권", tag: "권리" },
                      { article: "제30조", title: "초거대 AI 특례", desc: "초거대 AI 개발·운영자의 안전 조치 및 신고 의무", tag: "특별" },
                      { article: "제34조", title: "AI 윤리", desc: "인간 존엄성, 사회 공공선, 기술 합목적성 3대 윤리원칙", tag: "윤리" },
                      { article: "제38조", title: "과징금/벌칙", desc: "고위험 AI 영향평가 미실시 시 매출액 3% 이하 과징금", tag: "제재" },
                    ].map((item) => (
                      <div key={item.article} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] font-mono">{item.article}</Badge>
                          <span className="text-sm font-semibold">{item.title}</span>
                          <Badge className={cn("text-[9px]",
                            item.tag === "핵심" ? "bg-red-100 text-red-700" :
                            item.tag === "거버넌스" ? "bg-purple-100 text-purple-700" :
                            item.tag === "특별" ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-600"
                          )}>{item.tag}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">고위험 AI 분류 기준 (제17조)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { category: "생명·신체 안전", examples: "의료 진단 AI, 자율주행, 산업 안전", level: "최고위험" },
                      { category: "기본권·자유", examples: "채용 AI, 신용평가, 사법 판단", level: "고위험" },
                      { category: "사회적 영향", examples: "교육 평가, 공공서비스 배분, 선거", level: "고위험" },
                    ].map((cat) => (
                      <div key={cat.category} className="p-3 rounded-lg border border-red-200/50 bg-red-50/30">
                        <p className="text-xs font-bold text-red-700 mb-1">{cat.level}</p>
                        <p className="text-sm font-semibold">{cat.category}</p>
                        <p className="text-xs text-muted-foreground mt-1">{cat.examples}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* EU AI Act */}
            <Card className="border-l-4 border-l-indigo-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-xl">🇪🇺</span> EU AI Act (인공지능법)
                    </CardTitle>
                    <CardDescription className="mt-1">2024년 8월 발효 | 단계적 시행 (2025~2027) | 세계 최초 포괄적 AI 규제법</CardDescription>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300">단계적 시행</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200/50">
                  <p className="text-sm leading-relaxed">
                    EU AI Act는 AI 시스템을 위험 수준에 따라 4단계(금지/고위험/제한/최소)로 분류하고,
                    각 등급별 차등적 의무를 부과하는 세계 최초의 포괄적 AI 규제법입니다.
                    역외 적용되어 EU 시장에 서비스하는 모든 AI 제공자에게 적용됩니다.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">4단계 위험 분류 체계</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                      { level: "금지 (Unacceptable)", color: "bg-red-500", textColor: "text-white", desc: "사회적 점수 부여, 실시간 원격 생체인식, 취약계층 대상 조작적 AI", timeline: "2025.2" },
                      { level: "고위험 (High-risk)", color: "bg-orange-500", textColor: "text-white", desc: "채용, 신용평가, 사법, 교육, 의료기기, 핵심 인프라", timeline: "2026.8" },
                      { level: "제한 (Limited)", color: "bg-amber-500", textColor: "text-white", desc: "챗봇, 딥페이크, 감정인식 등 투명성 의무 대상", timeline: "2025.8" },
                      { level: "최소 (Minimal)", color: "bg-green-500", textColor: "text-white", desc: "스팸 필터, 게임 AI 등 자율 규제", timeline: "즉시" },
                    ].map((item) => (
                      <div key={item.level} className="rounded-xl overflow-hidden border">
                        <div className={cn("p-3 text-center", item.color, item.textColor)}>
                          <p className="text-xs font-bold">{item.level}</p>
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                          <p className="text-[10px] font-semibold mt-2">시행: {item.timeline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">고위험 AI 의무사항 (Article 6~51)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { article: "Art.9", title: "위험관리 시스템", desc: "생애주기 전반의 위험 식별·평가·완화 시스템 구축" },
                      { article: "Art.10", title: "데이터 거버넌스", desc: "학습 데이터의 품질, 대표성, 편향성 관리 의무" },
                      { article: "Art.11", title: "기술 문서", desc: "적합성 평가를 위한 상세 기술 문서 작성·유지" },
                      { article: "Art.13", title: "투명성", desc: "사용자가 AI 출력을 해석하고 적절히 사용할 수 있는 정보 제공" },
                      { article: "Art.14", title: "인간 감독", desc: "인간이 AI 시스템을 효과적으로 감독할 수 있는 체계" },
                      { article: "Art.15", title: "정확성·견고성·보안", desc: "적절한 수준의 정확성, 견고성, 사이버 보안 확보" },
                    ].map((item) => (
                      <div key={item.article} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] font-mono">{item.article}</Badge>
                          <span className="text-sm font-semibold">{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold mb-3">시행 일정</h4>
                  <div className="flex gap-0 overflow-x-auto">
                    {[
                      { date: "2024.8", event: "법률 발효", done: true },
                      { date: "2025.2", event: "금지 AI 규정 시행", done: true },
                      { date: "2025.8", event: "GPAI 규정 시행", done: false },
                      { date: "2026.8", event: "고위험 AI 의무 시행", done: false },
                      { date: "2027.8", event: "완전 시행", done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex-1 min-w-[120px] text-center relative">
                        <div className={cn("w-3 h-3 rounded-full mx-auto mb-1.5", item.done ? "bg-green-500" : "bg-gray-300")} />
                        {i < 4 && <div className="absolute top-1.5 left-1/2 w-full h-0.5 bg-gray-200" />}
                        <p className="text-[10px] font-bold">{item.date}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{item.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 비교표 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">한국 AI 기본법 vs EU AI Act 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2.5 px-3 font-semibold">항목</th>
                        <th className="py-2.5 px-3 font-semibold text-center bg-blue-50">🇰🇷 AI 기본법</th>
                        <th className="py-2.5 px-3 font-semibold text-center bg-indigo-50">🇪🇺 EU AI Act</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: "시행일", kr: "2026.01.21", eu: "2024.08 (단계적)" },
                        { item: "규제 방식", kr: "고위험 AI 영향평가 중심", eu: "4단계 위험 분류 체계" },
                        { item: "고위험 AI 정의", kr: "생명·안전·기본권 영향 AI", eu: "Annex III 목록 + 분류 기준" },
                        { item: "핵심 의무", kr: "영향평가, 투명성, 이용자 권리", eu: "적합성 평가, 기술 문서, CE 마킹" },
                        { item: "초거대 AI", kr: "별도 안전 조치 + 신고", eu: "GPAI 모델 별도 규정" },
                        { item: "제재", kr: "매출액 3% 이하 과징금", eu: "매출액 7% 이하 과징금 (최대 3,500만€)" },
                        { item: "거버넌스", kr: "인공지능위원회 (국무총리 소속)", eu: "AI Office (유럽위원회)" },
                        { item: "역외 적용", kr: "국내 이용자 대상 서비스", eu: "EU 시장 서비스 전체" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2.5 px-3 font-medium">{row.item}</td>
                          <td className="py-2.5 px-3 text-center bg-blue-50/30">{row.kr}</td>
                          <td className="py-2.5 px-3 text-center bg-indigo-50/30">{row.eu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: 검토 전략 */}
          <TabsContent value="review-strategy" className="mt-0 space-y-6">
            {/* 통합 검토 전략 */}
            <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> AI 규제 통합 검토 전략
                </CardTitle>
                <CardDescription>한국 AI 기본법과 EU AI Act를 동시에 준수하기 위한 단계별 전략</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      phase: "1단계: AI 시스템 분류 및 위험 등급 판정",
                      timeline: "착수 즉시",
                      tasks: [
                        "운영 중인 모든 AI 서비스 인벤토리 작성",
                        "한국 AI 기본법 제17조 기준 고위험 AI 해당 여부 판단",
                        "EU AI Act Annex III 기준 위험 등급 분류",
                        "양 법률 모두 고위험에 해당하는 서비스 우선 대응",
                      ],
                      status: "진행 중",
                      statusColor: "bg-blue-100 text-blue-700",
                    },
                    {
                      phase: "2단계: 영향평가 및 적합성 평가 체계 구축",
                      timeline: "1~3개월",
                      tasks: [
                        "AI 기본법 제18조 영향평가 프레임워크 설계 (한국)",
                        "EU AI Act Art.43 적합성 평가 절차 매핑",
                        "공통 평가 항목 통합 (투명성, 공정성, 보안, 설명가능성)",
                        "평가 결과를 양 법률 요구사항에 동시 매핑하는 매트릭스 구축",
                      ],
                      status: "계획",
                      statusColor: "bg-amber-100 text-amber-700",
                    },
                    {
                      phase: "3단계: 기술적 조치 이행",
                      timeline: "3~6개월",
                      tasks: [
                        "데이터 거버넌스 강화 (Art.10 / 제18조 공통)",
                        "설명가능성(XAI) 모듈 통합 (Art.13 / 제22조 공통)",
                        "편향성 모니터링 체계 구축 (Art.10 / 제18조 공통)",
                        "인간 감독 체계 설계 (Art.14 / 제22조 공통)",
                        "기술 문서 자동 생성 파이프라인 구축",
                      ],
                      status: "계획",
                      statusColor: "bg-gray-100 text-gray-600",
                    },
                    {
                      phase: "4단계: 거버넌스 및 조직 체계 정비",
                      timeline: "3~6개월",
                      tasks: [
                        "AI 거버넌스 위원회 구성 및 운영 규정 수립",
                        "AI 기본법 인공지능위원회 대응 체계 마련",
                        "EU AI Act AI Office 소통 채널 확보",
                        "내부 교육 프로그램 운영 (연 2회 이상)",
                        "이용자 권리 처리 절차 마련 (설명 요구, 이의제기, 인적 개입)",
                      ],
                      status: "계획",
                      statusColor: "bg-gray-100 text-gray-600",
                    },
                    {
                      phase: "5단계: 지속적 모니터링 및 업데이트",
                      timeline: "지속",
                      tasks: [
                        "규제 변경 사항 실시간 추적 (AI 기본법 시행령, EU AI Act 가이드라인)",
                        "정기 재평가 (분기 1회) 및 보고 체계",
                        "AI Intelligence 모듈과 연동하여 규제 동향 자동 분석",
                        "연간 종합 준수 보고서 발행",
                      ],
                      status: "계획",
                      statusColor: "bg-gray-100 text-gray-600",
                    },
                  ].map((phase, idx) => (
                    <div key={idx} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-black text-blue-700">{idx + 1}</div>
                          <div>
                            <h4 className="font-semibold text-sm">{phase.phase}</h4>
                            <p className="text-[10px] text-muted-foreground">일정: {phase.timeline}</p>
                          </div>
                        </div>
                        <Badge className={cn("text-[10px]", phase.statusColor)}>{phase.status}</Badge>
                      </div>
                      <ul className="space-y-1.5 ml-11">
                        {phase.tasks.map((task, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 mt-0.5 text-blue-400 shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 법률별 검토 매트릭스 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">규제 요구사항 × 솔루션 기능 매핑</CardTitle>
                <CardDescription>각 규제 요구사항이 솔루션의 어떤 기능으로 충족되는지 매핑합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-semibold">규제 요구사항</th>
                        <th className="text-center py-2 px-2 font-semibold bg-blue-50">AI 기본법</th>
                        <th className="text-center py-2 px-2 font-semibold bg-indigo-50">EU AI Act</th>
                        <th className="text-left py-2 px-2 font-semibold">솔루션 기능</th>
                        <th className="text-center py-2 px-2 font-semibold">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { req: "위험 평가/영향평가", kr: "제18조", eu: "Art.9", feature: "거버넌스 > 위험관리", status: "운영" },
                        { req: "데이터 품질 관리", kr: "제18조②", eu: "Art.10", feature: "기술 검토 > 데이터 품질", status: "운영" },
                        { req: "모델 성능 검증", kr: "제22조", eu: "Art.15", feature: "기술 검토 > 모델 성능", status: "운영" },
                        { req: "공정성/편향성 검증", kr: "제18조②", eu: "Art.10", feature: "기술 검토 > 공정성", status: "운영" },
                        { req: "설명가능성/투명성", kr: "제22조", eu: "Art.13", feature: "기술 검토 > 신뢰성 평가", status: "운영" },
                        { req: "보안/견고성", kr: "제30조", eu: "Art.15", feature: "기술 검토 > 보안 검토", status: "운영" },
                        { req: "인간 감독 체계", kr: "제22조②", eu: "Art.14", feature: "거버넌스 > 조직관리", status: "운영" },
                        { req: "기술 문서 관리", kr: "제18조③", eu: "Art.11", feature: "거버넌스 > 보고서", status: "운영" },
                        { req: "이용자 권리 보장", kr: "제27조", eu: "Art.86", feature: "규제 검토 > 소비자 보호", status: "운영" },
                        { req: "사후 모니터링", kr: "제18조④", eu: "Art.72", feature: "거버넌스 > 대시보드", status: "운영" },
                        { req: "적합성 평가/CE", kr: "-", eu: "Art.43", feature: "거버넌스 > 서비스 플로우", status: "계획" },
                        { req: "초거대 AI 신고", kr: "제30조", eu: "Art.53", feature: "미구현", status: "계획" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b hover:bg-muted/30">
                          <td className="py-2 px-2 font-medium">{row.req}</td>
                          <td className="py-2 px-2 text-center bg-blue-50/30 font-mono">{row.kr}</td>
                          <td className="py-2 px-2 text-center bg-indigo-50/30 font-mono">{row.eu}</td>
                          <td className="py-2 px-2">{row.feature}</td>
                          <td className="py-2 px-2 text-center">
                            <Badge className={cn("text-[9px]", row.status === "운영" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>{row.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 주요 리스크 및 대응 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-red-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" /> 주요 규제 리스크
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { risk: "고위험 AI 영향평가 미실시", impact: "과징금 매출액 3% (AI 기본법)", level: "Critical" },
                    { risk: "EU AI Act 적합성 평가 미비", impact: "EU 시장 진출 불가 + 과징금 7%", level: "Critical" },
                    { risk: "이용자 설명 요구 미대응", impact: "행정 제재 + 신뢰 저하", level: "High" },
                    { risk: "초거대 AI 신고 누락", impact: "시정명령 + 과태료", level: "High" },
                    { risk: "데이터 편향성 미관리", impact: "양 법률 동시 위반 가능", level: "Medium" },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-red-100 bg-red-50/30 flex items-start gap-2">
                      <Badge className={cn("text-[8px] shrink-0 mt-0.5",
                        item.level === "Critical" ? "bg-red-600" : item.level === "High" ? "bg-orange-600" : "bg-amber-600"
                      )}>{item.level}</Badge>
                      <div>
                        <p className="text-xs font-medium">{item.risk}</p>
                        <p className="text-[10px] text-muted-foreground">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-green-200/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-green-500" /> 솔루션 대응 현황
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { feature: "거버넌스 플로우 (19단계)", desc: "영향평가 + 적합성 평가 통합 프로세스", coverage: "90%" },
                    { feature: "기술 검토 5대 모듈", desc: "데이터 품질/성능/공정성/신뢰성/보안", coverage: "95%" },
                    { feature: "AI 컨설팅 챗봇", desc: "규제 조항 자동 검색 및 해석", coverage: "85%" },
                    { feature: "sLLM 파인튜닝", desc: "규제 특화 LLM으로 자동화 검토", coverage: "80%" },
                    { feature: "온톨로지 기반 RAG", desc: "규제 문서 검색 및 근거 제시", coverage: "75%" },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-green-100 bg-green-50/30">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium">{item.feature}</p>
                        <span className="text-[10px] font-bold text-green-600">{item.coverage}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
