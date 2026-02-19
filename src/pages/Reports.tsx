import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Send,
  FilePlus,
  History,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  ArrowUpRight,
  Archive,
  Brain
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { MetricCard, ComplianceCard } from '@/components/Cards';
import { createMockComplianceReports } from '@/data/index';
import {
  COMPLIANCE_STATUS,
} from '@/lib/index';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { AIAssistantInline } from '@/components/AIAssistantInline';

const Reports: React.FC = () => {
  const { t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);

  const mockComplianceReports = useMemo(() => createMockComplianceReports(t), [t]);

  const submissionHistory = useMemo(() => [
    {
      id: 'SUB-2026-001',
      agency: t('reports.agency.fss'),
      reportType: t('reports.type.transparency'),
      status: 'ACCEPTED',
      submittedAt: '2026-02-10',
      version: 'v1.2'
    },
    {
      id: 'SUB-2026-002',
      agency: t('reports.agency.kisa'),
      reportType: t('reports.type.pia'),
      status: 'REVIEWING',
      submittedAt: '2026-02-14',
      version: 'v1.0'
    },
    {
      id: 'SUB-2026-003',
      agency: 'EU Commission',
      reportType: 'AI Act Compliance Declaration',
      status: 'PENDING',
      submittedAt: '-',
      version: 'v2.1'
    }
  ], [t]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success(t('reports.toast.generated'));
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-chart-4 text-white">{t('reports.status.accepted')}</Badge>;
      case 'REVIEWING':
        return <Badge className="bg-chart-3 text-white">{t('reports.status.reviewing')}</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">{t('reports.status.pending')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('reports.pageTitle')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('reports.pageDesc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Archive className="h-4 w-4" />
              {t('reports.archive')}
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2 bg-primary">
              {isGenerating ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <FilePlus className="h-4 w-4" />
              )}
              {t('reports.newReport')}
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title={t('reports.metric.total')} value="48" change="+4" trend="up" />
          <MetricCard title={t('reports.metric.pending')} value="3" change="-1" trend="down" />
          <MetricCard title={t('reports.metric.avgScore')} value="82점" change="+5" trend="up" />
          <MetricCard title={t('reports.metric.recent7days')} value="12" change="+2" trend="up" />
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full max-w-[500px] grid-cols-3">
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              {t('reports.tab.reports')}
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Send className="h-4 w-4" />
              {t('reports.tab.submissions')}
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="gap-2">
              <Brain className="h-4 w-4" />
              {t('reports.tab.aiAssistant')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('reports.search.placeholder')} className="pl-10" />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder={t('reports.typeAll')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('reports.typeAll')}</SelectItem>
                    <SelectItem value="internal">{t('reports.typeInternal')}</SelectItem>
                    <SelectItem value="regulatory">{t('reports.typeRegulatory')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockComplianceReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ComplianceCard report={report} />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                      <Download className="h-3 w-3" /> {t('reports.download')}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary">
                      <Send className="h-3 w-3" /> {t('reports.submit')}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>{t('reports.submission.title')}</CardTitle>
                <CardDescription>
                  {t('reports.submission.desc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('reports.submission.id')}</TableHead>
                      <TableHead>{t('reports.submission.agency')}</TableHead>
                      <TableHead>{t('reports.submission.reportType')}</TableHead>
                      <TableHead>{t('reports.submission.version')}</TableHead>
                      <TableHead>{t('reports.submission.date')}</TableHead>
                      <TableHead>{t('reports.submission.status')}</TableHead>
                      <TableHead className="text-right">{t('reports.submission.action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissionHistory.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-mono text-xs">{sub.id}</TableCell>
                        <TableCell className="font-medium">{sub.agency}</TableCell>
                        <TableCell>{sub.reportType}</TableCell>
                        <TableCell>{sub.version}</TableCell>
                        <TableCell>{sub.submittedAt}</TableCell>
                        <TableCell>{getStatusBadge(sub.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="border-l-4 border-l-chart-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-chart-2" />
                    {t('reports.deadline.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('reports.deadline.privacy')}</span>
                      <Badge variant="outline" className="text-chart-1 border-chart-1">D-12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{t('reports.deadline.finance')}</span>
                      <Badge variant="outline">D-45</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 variant-outline gap-2" variant="outline">
                    {t('reports.deadline.viewSchedule')} <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-chart-4" />
                    {t('reports.ready.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('reports.ready.desc')}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-chart-4" />
                      <span>{t('reports.ready.report1')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-chart-4" />
                      <span>{t('reports.ready.report2')}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-primary text-white gap-2">
                    {t('reports.ready.batchSubmit')} <Send className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-6">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <AIAssistantInline
                  context="reports"
                  title={t('reports.aiAssistant.title')}
                  description={t('reports.aiAssistant.desc')}
                  contextData={JSON.stringify({
                    totalReports: 48,
                    pendingSubmissions: 3,
                    avgScore: 82,
                    recentGenerated: 12,
                    submissions: submissionHistory,
                    upcomingDeadlines: [
                      { agency: t('reports.deadline.privacy'), type: t('reports.deadline.privacy'), dDay: 'D-12' },
                      { agency: t('reports.deadline.finance'), type: t('reports.deadline.finance'), dDay: 'D-45' },
                    ],
                  })}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant (Floating) */}
      <AIAssistantPanel
        context="reports"
        title={t('reports.aiAssistant.title')}
        contextData={JSON.stringify({
          totalReports: 48,
          pendingSubmissions: 3,
          avgScore: 82,
          recentGenerated: 12,
          submissions: submissionHistory,
          upcomingDeadlines: [
            { agency: t('reports.deadline.privacy'), type: t('reports.deadline.privacy'), dDay: 'D-12' },
            { agency: t('reports.deadline.finance'), type: t('reports.deadline.finance'), dDay: 'D-45' },
          ],
        })}
      />
    </Layout>
  );
};

export default Reports;
