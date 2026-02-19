import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import {
  ComplianceCard,
  MetricCard,
  ProcessCard
} from "@/components/Cards";
import { ComplianceForm } from "@/components/Forms";
import { createMockComplianceReports } from "@/data/index";
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
  Download,
  Settings,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { AIAssistantInline } from "@/components/AIAssistantInline";
import { useI18n } from "@/lib/i18n";

const Compliance = () => {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockComplianceReports = useMemo(() => createMockComplianceReports(t), [t]);

  const filteredReports = mockComplianceReports.filter(report =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.standard.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (data: any) => {
    console.log("New Compliance Audit Requested:", data);
    setIsDialogOpen(false);
  };

  const standards = useMemo(() => [
    { name: "EU AI Act (Proposed)", status: t('compliance.std.ready'), coverage: "95%", risk: "High" },
    { name: "ISO/IEC 42001 (AI Management)", status: t('compliance.std.inProgress'), coverage: "62%", risk: "Medium" },
    { name: "NIST AI Risk Management Framework", status: t('compliance.std.waitingReview'), coverage: "0%", risk: "Low" },
    { name: "KISA 인공지능 윤리 가이드라인", status: t('compliance.std.compliant'), coverage: "100%", risk: "Medium" }
  ], [t]);

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('compliance.pageTitle')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('compliance.pageDesc')}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
                <Plus className="mr-2 h-4 w-4" />
                {t('compliance.newAudit')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{t('compliance.newAuditTitle')}</DialogTitle>
                <DialogDescription>
                  {t('compliance.newAuditDesc')}
                </DialogDescription>
              </DialogHeader>
              <ComplianceForm onSubmit={handleFormSubmit} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('compliance.metric.overallRate')}
            value="92.4%"
            change="+2.1%"
            trend="up"
          />
          <MetricCard
            title={t('compliance.metric.openDefects')}
            value="14건"
            change="-5"
            trend="down"
          />
          <MetricCard
            title={t('compliance.metric.ongoingAudits')}
            value="3건"
            change="0"
            trend="up"
          />
          <MetricCard
            title={t('compliance.metric.nextReview')}
            value="D-12"
            change="정상"
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reports" className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="reports" className="data-[state=active]:bg-background">
                {t('compliance.tab.reports')}
              </TabsTrigger>
              <TabsTrigger value="standards" className="data-[state=active]:bg-background">
                {t('compliance.tab.standards')}
              </TabsTrigger>
              <TabsTrigger value="automation" className="data-[state=active]:bg-background">
                {t('compliance.tab.automation')}
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-background gap-1.5">
                <Brain className="h-4 w-4" />
                {t('compliance.tab.aiAssistant')}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('compliance.search.placeholder')}
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

          <TabsContent value="reports" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => (
                <ComplianceCard key={report.id} report={report} />
              ))}

              {/* Empty State */}
              {filteredReports.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-card rounded-xl border border-dashed">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">{t('compliance.noResults')}</h3>
                  <p className="text-muted-foreground">{t('compliance.noResultsDesc')}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="standards" className="mt-0">
            <div className="grid grid-cols-1 gap-4">
              {standards.map((std, i) => (
                <div key={i} className="bg-card p-6 rounded-xl border border-border flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{std.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{t('compliance.std.coverage')}: {std.coverage}</span>
                        <span className="text-xs text-muted-foreground">|</span>
                        <span className="text-xs text-muted-foreground">{t('compliance.std.riskLevel')}: {std.risk}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={std.status === t('compliance.std.compliant') ? "outline" : "secondary"} className={std.status === t('compliance.std.compliant') ? "bg-chart-4/10 text-chart-4 border-chart-4/20" : ""}>
                      {std.status}
                    </Badge>
                    <Button variant="ghost" size="sm">{t('compliance.std.viewDetails')}</Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="automation" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProcessCard
                title={t('compliance.auto.privacyScan')}
                description={t('compliance.auto.privacyScanDesc')}
                status={t('compliance.auto.privacyScanStatus')}
                icon={<Zap className="h-5 w-5 text-blue-500" />}
              />
              <ProcessCard
                title={t('compliance.auto.biasMonitor')}
                description={t('compliance.auto.biasMonitorDesc')}
                status={t('compliance.auto.biasMonitorStatus')}
                icon={<Clock className="h-5 w-5 text-amber-500" />}
              />
              <ProcessCard
                title={t('compliance.auto.contentFilter')}
                description={t('compliance.auto.contentFilterDesc')}
                status={t('compliance.auto.contentFilterStatus')}
                icon={<ShieldCheck className="h-5 w-5 text-green-500" />}
              />
              <ProcessCard
                title={t('compliance.auto.legalTracker')}
                description={t('compliance.auto.legalTrackerDesc')}
                status={t('compliance.auto.legalTrackerStatus')}
                icon={<AlertCircle className="h-5 w-5 text-red-500" />}
              />
            </div>

            <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{t('compliance.auto.summaryTitle')}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('compliance.auto.summaryDesc')}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      {t('compliance.auto.downloadReport')}
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('compliance.auto.changeSettings')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-0">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <AIAssistantInline
                  context="compliance"
                  title={t('compliance.aiAssistant.title')}
                  description={t('compliance.aiAssistant.desc')}
                  contextData={JSON.stringify({
                    overallRate: '92.4%',
                    openDefects: 14,
                    ongoingAudits: 3,
                    nextReview: 'D-12',
                    standards: [
                      { name: 'EU AI Act', status: t('compliance.std.ready'), coverage: '95%' },
                      { name: 'ISO/IEC 42001', status: t('compliance.std.inProgress'), coverage: '62%' },
                      { name: 'NIST AI RMF', status: t('compliance.std.waitingReview'), coverage: '0%' },
                      { name: 'KISA 가이드라인', status: t('compliance.std.compliant'), coverage: '100%' },
                    ],
                    automationProcesses: [t('compliance.auto.privacyScan'), t('compliance.auto.biasMonitor'), t('compliance.auto.contentFilter'), t('compliance.auto.legalTracker')],
                  })}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="compliance"
        title={t('compliance.aiAssistant.title')}
        contextData={JSON.stringify({
          overallRate: '92.4%',
          openDefects: 14,
          ongoingAudits: 3,
          nextReview: 'D-12',
          standards: [
            { name: 'EU AI Act', status: t('compliance.std.ready'), coverage: '95%' },
            { name: 'ISO/IEC 42001', status: t('compliance.std.inProgress'), coverage: '62%' },
            { name: 'NIST AI RMF', status: t('compliance.std.waitingReview'), coverage: '0%' },
            { name: 'KISA 가이드라인', status: t('compliance.std.compliant'), coverage: '100%' },
          ],
          automationProcesses: [t('compliance.auto.privacyScan'), t('compliance.auto.biasMonitor'), t('compliance.auto.contentFilter'), t('compliance.auto.legalTracker')],
        })}
      />
    </Layout>
  );
};

export default Compliance;
