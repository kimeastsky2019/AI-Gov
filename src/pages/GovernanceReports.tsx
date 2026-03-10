import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Download,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Eye,
  Share2,
  Archive,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  title: string;
  category: "GOVERNANCE" | "AUDIT" | "CHANGE" | "COMPLIANCE";
  generatedDate: string;
  scope: string;
  status: "COMPLETED" | "DRAFT" | "IN_PROGRESS" | "ARCHIVED";
  format: string;
  pages: number;
  author: string;
}

interface ChangeLog {
  id: string;
  date: string;
  requirement: string;
  changeType: "UPDATE" | "NEW" | "DEPRECATION";
  description: string;
  impactLevel: "HIGH" | "MEDIUM" | "LOW";
  version: string;
}

interface AuditHistory {
  id: string;
  type: string;
  date: string;
  scope: string;
  findings: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  auditor: string;
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const GovernanceReports: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mockReports = useMemo((): Report[] => [
    {
      id: "RPT-001",
      title: t('gov.report.q1') || "2026년 Q1 AI 거버넌스 현황 보고서",
      category: "GOVERNANCE",
      generatedDate: "2026-03-09",
      scope: "전사 AI 서비스",
      status: "COMPLETED",
      format: "PDF",
      pages: 45,
      author: "거버넌스팀"
    },
    {
      id: "RPT-002",
      title: t('gov.report.creditRiskAssessment') || "신용평가 AI 위험 평가 보고서",
      category: "AUDIT",
      generatedDate: "2026-02-28",
      scope: "신용평가 서비스",
      status: "COMPLETED",
      format: "PDF",
      pages: 32,
      author: "기술검증팀"
    },
    {
      id: "RPT-003",
      title: t('gov.report.privacyAudit') || "개인정보보호 자율점검 보고서",
      category: "COMPLIANCE",
      generatedDate: "2026-03-05",
      scope: "전사 개인정보 처리",
      status: "COMPLETED",
      format: "PDF",
      pages: 28,
      author: "규제준수팀"
    },
    {
      id: "RPT-004",
      title: t('gov.report.ttaChangelog') || "TTA 2023 변경이력 관리 보고서",
      category: "CHANGE",
      generatedDate: "2026-03-01",
      scope: "TTA 요구사항",
      status: "COMPLETED",
      format: "PDF",
      pages: 18,
      author: "거버넌스팀"
    },
    {
      id: "RPT-005",
      title: t('gov.report.financeCompliance') || "금융분야 AI 콤플라이언스 보고서",
      category: "COMPLIANCE",
      generatedDate: "2026-02-15",
      scope: "금융 5대 AI 서비스",
      status: "COMPLETED",
      format: "PDF",
      pages: 52,
      author: "규제준수팀"
    },
    {
      id: "RPT-006",
      title: t('gov.report.supervisoryBoard') || "2026년 감시위원회 보고서 (초안)",
      category: "GOVERNANCE",
      generatedDate: "2026-03-08",
      scope: "전사 거버넌스",
      status: "DRAFT",
      format: "PDF",
      pages: 0,
      author: "거버넌스팀"
    }
  ], [t]);

  const changeLogs: ChangeLog[] = [
    {
      id: "CL-001",
      date: "2026-01-15",
      requirement: "TTA 요구사항 01: 위험관리 계획 및 수행",
      changeType: "UPDATE",
      description: "위험 평가 기준 강화 및 모니터링 주기 단축 (월간 → 2주간)",
      impactLevel: "HIGH",
      version: "2.1"
    },
    {
      id: "CL-002",
      date: "2026-02-01",
      requirement: "TTA 요구사항 03: 데이터 및 모델 관리",
      changeType: "UPDATE",
      description: "학습 데이터 편향성 검사 항목 추가",
      impactLevel: "MEDIUM",
      version: "2.0"
    },
    {
      id: "CL-003",
      date: "2026-02-20",
      requirement: "금융분야 AI 안내서: 신용평가 AI",
      changeType: "NEW",
      description: "신규 체크리스트 항목 3개 추가 (설명가능성, 편향성, 모니터링)",
      impactLevel: "HIGH",
      version: "3.0"
    },
    {
      id: "CL-004",
      date: "2025-12-01",
      requirement: "개인정보보호 자율점검표",
      changeType: "UPDATE",
      description: "개인정보 최소화 원칙 강화",
      impactLevel: "MEDIUM",
      version: "4.1"
    },
    {
      id: "CL-005",
      date: "2025-10-15",
      requirement: "TTA 요구사항 14: 변경이력 관리",
      changeType: "UPDATE",
      description: "변경 기록 및 버전 관리 프로세스 정립",
      impactLevel: "LOW",
      version: "1.0"
    }
  ];

  const auditHistory: AuditHistory[] = [
    {
      id: "AH-001",
      type: "정기 감시",
      date: "2026-03-05",
      scope: "전체 AI 서비스",
      findings: 3,
      status: "COMPLETED",
      auditor: "거버넌스팀"
    },
    {
      id: "AH-002",
      type: "특정 서비스 감시",
      date: "2026-02-28",
      scope: "신용평가 AI",
      findings: 5,
      status: "COMPLETED",
      auditor: "기술검증팀"
    },
    {
      id: "AH-003",
      type: "개인정보보호 점검",
      date: "2026-02-20",
      scope: "데이터 처리 프로세스",
      findings: 2,
      status: "COMPLETED",
      auditor: "규제준수팀"
    },
    {
      id: "AH-004",
      type: "규제 준수 감시",
      date: "2026-03-08",
      scope: "금융 5대 AI",
      findings: 0,
      status: "IN_PROGRESS",
      auditor: "규제준수팀"
    }
  ];

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCategory === "all" || report.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const getCategoryColor = (category: Report['category']) => {
    const colors = {
      GOVERNANCE: "bg-blue-50 text-blue-700 border-blue-200",
      AUDIT: "bg-purple-50 text-purple-700 border-purple-200",
      CHANGE: "bg-amber-50 text-amber-700 border-amber-200",
      COMPLIANCE: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[category];
  };

  const getCategoryLabel = (category: Report['category']) => {
    const labels = {
      GOVERNANCE: t('gov.reportCategory.governance'),
      AUDIT: t('gov.reportCategory.audit'),
      CHANGE: t('gov.reportCategory.change'),
      COMPLIANCE: t('gov.reportCategory.compliance'),
    };
    return labels[category];
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    const colors = {
      COMPLETED: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      ARCHIVED: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getStatusLabel = (status: Report['status']) => {
    const labels = {
      COMPLETED: t('gov.reportStatus.completed'),
      DRAFT: t('gov.reportStatus.draft'),
      IN_PROGRESS: t('gov.reportStatus.inProgress'),
      ARCHIVED: t('gov.reportStatus.archived'),
    };
    return labels[status];
  };

  return (
    <Layout>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('governance.reports.title') || '보고서·문서화'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('governance.reports.subtitle') || '자동화된 거버넌스 보고서 생성, 점검 이력 관리, TTA 변경이력 추적'}
            </p>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.totalReports') || '총 보고서'}
              value={mockReports.length}
              change={"+2"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.completedReports') || '완료됨'}
              value={mockReports.filter(r => r.status === "COMPLETED").length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.audits') || '감시 이력'}
              value={auditHistory.length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.changes') || '변경사항'}
              value={changeLogs.length}
              change={"+0"}
              trend="down"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="w-full space-y-6">
          <TabsList className="bg-transparent gap-6 border-b pb-0 h-auto w-full justify-start rounded-none">
            <TabsTrigger
              value="reports"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <FileText className="w-4 h-4 mr-2" />
              {t('gov.reportTab.title')}
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {t('gov.auditTab.title')}
            </TabsTrigger>
            <TabsTrigger
              value="changelog"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t('gov.changelog.title')}
            </TabsTrigger>
          </TabsList>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.reports.governance')}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('gov.reports.addNew')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t('gov.reportsDialog.title')}</DialogTitle>
                        <DialogDescription>
                          {t('gov.reportsDialog.desc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.reportsForm.typeLabel')}</label>
                          <select className="w-full px-3 py-2 border rounded-md text-sm">
                            <option>{t('gov.reportsForm.governance')}</option>
                            <option>{t('gov.reportsForm.risk')}</option>
                            <option>{t('gov.reportsForm.audit')}</option>
                            <option>{t('gov.reportsForm.compliance')}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.reportsForm.periodLabel')}</label>
                          <div className="flex gap-2">
                            <Input type="date" placeholder={t('gov.reportsForm.startDate')} />
                            <Input type="date" placeholder={t('gov.reportsForm.endDate')} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.reportsForm.scopeLabel')}</label>
                          <select className="w-full px-3 py-2 border rounded-md text-sm">
                            <option>{t('gov.reportsForm.scopeAll')}</option>
                            <option>{t('gov.reportsForm.scopeFinance')}</option>
                            <option>{t('gov.reportsForm.scopeSpecific')}</option>
                          </select>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">{t('gov.reportsForm.cancel')}</Button>
                          <Button className="flex-1">{t('gov.reportsForm.generate')}</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t('gov.reportsSearch.placeholder')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={filterCategory === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("all")}
                    >
                      {t('gov.reportsFilter.all')}
                    </Button>
                    <Button
                      variant={filterCategory === "GOVERNANCE" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("GOVERNANCE")}
                    >
                      {t('gov.reportsFilter.governance')}
                    </Button>
                    <Button
                      variant={filterCategory === "COMPLIANCE" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterCategory("COMPLIANCE")}
                    >
                      {t('gov.reportsFilter.compliance')}
                    </Button>
                  </div>
                </div>

                {/* Reports List */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredReports.map((report, idx) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-5 h-5 text-amber-500 flex-shrink-0" />
                              <h4 className="font-semibold">{report.title}</h4>
                              <Badge variant="outline" className="font-mono text-xs">
                                {report.id}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                              <Badge variant="outline" className={cn(
                                "text-xs border",
                                getCategoryColor(report.category)
                              )}>
                                {getCategoryLabel(report.category)}
                              </Badge>
                              <Badge className={cn(
                                "text-xs",
                                getStatusBadgeColor(report.status)
                              )}>
                                {getStatusLabel(report.status)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {report.format} · {report.pages} 페이지
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            {report.status === "COMPLETED" && (
                              <>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="보기">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="다운로드">
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="공유">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                          <div>
                            <p className="font-medium mb-1">{t('gov.reportInfo.scope')}</p>
                            <p>{report.scope}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">{t('gov.reportInfo.generatedDate')}</p>
                            <p>{report.generatedDate}</p>
                          </div>
                          <div>
                            <p className="font-medium mb-1">{t('gov.reportInfo.author')}</p>
                            <p>{report.author}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.audit.history')}</CardTitle>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('gov.audit.addNew')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {auditHistory.map((audit, idx) => (
                    <motion.div
                      key={audit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className={cn(
                              "w-5 h-5 flex-shrink-0",
                              audit.status === "COMPLETED" && "text-green-500",
                              audit.status === "IN_PROGRESS" && "text-blue-500",
                              audit.status === "PENDING" && "text-amber-500"
                            )} />
                            <h4 className="font-semibold">{audit.type}</h4>
                            <Badge variant="outline" className="font-mono text-xs">
                              {audit.id}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground mt-2">
                            <div>
                              <p className="font-medium mb-0.5">{t('gov.audit.scope')}</p>
                              <p>{audit.scope}</p>
                            </div>
                            <div>
                              <p className="font-medium mb-0.5">{t('gov.audit.date')}</p>
                              <p>{audit.date}</p>
                            </div>
                            <div>
                              <p className="font-medium mb-0.5">{t('gov.audit.findings')}</p>
                              <p className={cn(
                                "font-semibold",
                                audit.findings > 0 && "text-red-500"
                              )}>
                                {audit.findings}개
                              </p>
                            </div>
                            <div>
                              <p className="font-medium mb-0.5">{t('gov.audit.auditor')}</p>
                              <p>{audit.auditor}</p>
                            </div>
                          </div>
                        </div>
                        <Badge className={cn(
                          audit.status === "COMPLETED" && "bg-green-100 text-green-800",
                          audit.status === "IN_PROGRESS" && "bg-blue-100 text-blue-800",
                          audit.status === "PENDING" && "bg-amber-100 text-amber-800"
                        )}>
                          {audit.status === "COMPLETED" && t('gov.audit.statusCompleted')}
                          {audit.status === "IN_PROGRESS" && t('gov.audit.statusInProgress')}
                          {audit.status === "PENDING" && t('gov.audit.statusPending')}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Change Log Tab */}
          <TabsContent value="changelog" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('gov.changelog.tta')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {changeLogs.map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                            log.changeType === "NEW" && "bg-green-500",
                            log.changeType === "UPDATE" && "bg-blue-500",
                            log.changeType === "DEPRECATION" && "bg-red-500"
                          )}>
                            {log.changeType === "NEW" ? "+" :
                             log.changeType === "UPDATE" ? "~" : "-"}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{log.requirement}</h4>
                            <Badge variant="outline" className="font-mono text-xs">
                              v{log.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{log.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {log.date}
                            </div>
                            <Badge className={cn(
                              "text-xs",
                              log.impactLevel === "HIGH" && "bg-red-100 text-red-800",
                              log.impactLevel === "MEDIUM" && "bg-yellow-100 text-yellow-800",
                              log.impactLevel === "LOW" && "bg-green-100 text-green-800"
                            )}>
                              {log.impactLevel === "HIGH" ? t('gov.changelog.impactHigh') :
                               log.impactLevel === "MEDIUM" ? t('gov.changelog.impactMedium') : t('gov.changelog.impactLow')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Change Log Legend */}
            <Card className="bg-muted/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.changelogLegend.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">+</div>
                    <div>
                      <p className="font-semibold">{t('gov.changelogLegend.new')}</p>
                      <p className="text-xs text-muted-foreground">{t('gov.changelogLegend.newDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">~</div>
                    <div>
                      <p className="font-semibold">{t('gov.changelogLegend.update')}</p>
                      <p className="text-xs text-muted-foreground">{t('gov.changelogLegend.updateDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">-</div>
                    <div>
                      <p className="font-semibold">{t('gov.changelogLegend.deprecation')}</p>
                      <p className="text-xs text-muted-foreground">{t('gov.changelogLegend.deprecationDesc')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Document Management Info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20 border-blue-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.reportInfo.automation')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t('gov.reportInfo.automationDesc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.automationItem1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.automationItem2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.automationItem3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-purple-50/50 to-purple-50/20 border-purple-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.reportInfo.tta14Title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {t('gov.reportInfo.tta14Desc')}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.tta14Item1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.tta14Item2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                    <span>{t('gov.reportInfo.tta14Item3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default GovernanceReports;
