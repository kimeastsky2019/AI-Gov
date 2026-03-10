import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Users,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Download,
  Plus,
  TrendingDown,
  Clock,
  Award
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
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { useI18n } from "@/lib/i18n";

interface ProtectionChecklistItem {
  id: string;
  section: string;
  title: string;
  description: string;
  completed: boolean;
  critical: boolean;
  lastUpdated?: string;
}

interface ComplaintChannel {
  id: string;
  name: string;
  type: "phone" | "email" | "online" | "offline";
  contact: string;
  availableHours: string;
  responseTime: string;
  active: boolean;
}

const ConsumerProtection = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [protectionItems] = useState<ProtectionChecklistItem[]>([
    { id: "prevent-01", section: t('reg.consumer.section1'), title: t('reg.consumer.item_prevent_01_title'), description: t('reg.consumer.item_prevent_01_desc'), completed: true, critical: true, lastUpdated: "2024-02-10" },
    { id: "prevent-02", section: t('reg.consumer.section1'), title: t('reg.consumer.item_prevent_02_title'), description: t('reg.consumer.item_prevent_02_desc'), completed: true, critical: true, lastUpdated: "2024-02-12" },
    { id: "prevent-03", section: t('reg.consumer.section1'), title: t('reg.consumer.item_prevent_03_title'), description: t('reg.consumer.item_prevent_03_desc'), completed: true, critical: true, lastUpdated: "2024-02-08" },
    { id: "prevent-04", section: t('reg.consumer.section1'), title: t('reg.consumer.item_prevent_04_title'), description: t('reg.consumer.item_prevent_04_desc'), completed: false, critical: true, lastUpdated: "2024-01-25" },
    { id: "remedy-01", section: t('reg.consumer.section2'), title: t('reg.consumer.item_remedy_01_title'), description: t('reg.consumer.item_remedy_01_desc'), completed: true, critical: true, lastUpdated: "2024-02-15" },
    { id: "remedy-02", section: t('reg.consumer.section2'), title: t('reg.consumer.item_remedy_02_title'), description: t('reg.consumer.item_remedy_02_desc'), completed: true, critical: true, lastUpdated: "2024-02-12" },
    { id: "remedy-03", section: t('reg.consumer.section2'), title: t('reg.consumer.item_remedy_03_title'), description: t('reg.consumer.item_remedy_03_desc'), completed: true, critical: true, lastUpdated: "2024-02-10" },
    { id: "remedy-04", section: t('reg.consumer.section2'), title: t('reg.consumer.item_remedy_04_title'), description: t('reg.consumer.item_remedy_04_desc'), completed: false, critical: false, lastUpdated: "2024-01-30" },
    { id: "complaint-01", section: t('reg.consumer.section3'), title: t('reg.consumer.item_complaint_01_title'), description: t('reg.consumer.item_complaint_01_desc'), completed: true, critical: true, lastUpdated: "2024-02-15" },
    { id: "complaint-02", section: t('reg.consumer.section3'), title: t('reg.consumer.item_complaint_02_title'), description: t('reg.consumer.item_complaint_02_desc'), completed: true, critical: false, lastUpdated: "2024-02-12" },
    { id: "complaint-03", section: t('reg.consumer.section3'), title: t('reg.consumer.item_complaint_03_title'), description: t('reg.consumer.item_complaint_03_desc'), completed: true, critical: false, lastUpdated: "2024-02-10" },
    { id: "complaint-04", section: t('reg.consumer.section3'), title: t('reg.consumer.item_complaint_04_title'), description: t('reg.consumer.item_complaint_04_desc'), completed: false, critical: false, lastUpdated: "2024-01-28" },
    { id: "disclosure-01", section: t('reg.consumer.section4'), title: t('reg.consumer.item_disclosure_01_title'), description: t('reg.consumer.item_disclosure_01_desc'), completed: true, critical: true, lastUpdated: "2024-02-15" },
    { id: "disclosure-02", section: t('reg.consumer.section4'), title: t('reg.consumer.item_disclosure_02_title'), description: t('reg.consumer.item_disclosure_02_desc'), completed: true, critical: true, lastUpdated: "2024-02-12" },
    { id: "disclosure-03", section: t('reg.consumer.section4'), title: t('reg.consumer.item_disclosure_03_title'), description: t('reg.consumer.item_disclosure_03_desc'), completed: true, critical: true, lastUpdated: "2024-02-10" },
    { id: "disclosure-04", section: t('reg.consumer.section4'), title: t('reg.consumer.item_disclosure_04_title'), description: t('reg.consumer.item_disclosure_04_desc'), completed: false, critical: false, lastUpdated: "2024-01-25" },
  ]);

  const [complaintChannels] = useState<ComplaintChannel[]>([
    { id: "ch-01", name: t('reg.consumer.channel_phone'), type: "phone", contact: "1588-1234", availableHours: t('reg.consumer.hourly'), responseTime: t('reg.consumer.immediate'), active: true },
    { id: "ch-02", name: t('reg.consumer.channel_email'), type: "email", contact: "complaint@company.com", availableHours: t('reg.consumer.hourly_24'), responseTime: t('reg.consumer.businessDays_1_2'), active: true },
    { id: "ch-03", name: t('reg.consumer.channel_online'), type: "online", contact: "https://complaint.company.com", availableHours: t('reg.consumer.hourly_24'), responseTime: t('reg.consumer.businessDays_1_3'), active: true },
    { id: "ch-04", name: t('reg.consumer.channel_offline'), type: "offline", contact: t('reg.consumer.address'), availableHours: t('reg.consumer.hours_10_17'), responseTime: t('reg.consumer.businessDays_2_3'), active: true },
  ]);

  const toggleProtectionItem = (id: string) => {
    setProtectionItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getSectionItems = (section: string) => {
    return protectionItems.filter(item => item.section === section);
  };

  const getCompletionStats = () => {
    const total = protectionItems.length;
    const completed = protectionItems.filter(item => item.completed).length;
    const critical = protectionItems.filter(item => item.critical).length;
    const criticalCompleted = protectionItems.filter(item => item.critical && item.completed).length;
    return { total, completed, critical, criticalCompleted };
  };

  const stats = useMemo(() => getCompletionStats(), [protectionItems]);
  const completionRate = Math.round((stats.completed / stats.total) * 100);
  const criticalCompletionRate = Math.round((stats.criticalCompleted / stats.critical) * 100);

  const renderProtectionSection = (sectionName: string) => {
    const items = getSectionItems(sectionName);
    return (
      <div className="space-y-4">
        <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">{sectionName}</h3>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            {items.length}{t('reg.consumer.of')} {items.filter(i => i.completed).length}{t('reg.consumer.completed_of')}
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => toggleProtectionItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <div className="flex items-center gap-2">
                      {item.critical && (
                        <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                          {t('reg.consumer.critical')}
                        </Badge>
                      )}
                      {item.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.lastUpdated && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('reg.consumer.lastUpdated')} {item.lastUpdated}
                    </p>
                  )}
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
              {t('reg.consumer.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('reg.consumer.subtitle')}
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Download className="mr-2 h-4 w-4" />
            {t('reg.consumer.downloadReport')}
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('reg.consumer.overallCompletionRate')}
            value={`${completionRate}%`}
            change={`${stats.completed}/${stats.total}`}
            trend="up"
          />
          <MetricCard
            title={t('reg.consumer.criticalCompletionRate')}
            value={`${criticalCompletionRate}%`}
            change={`${stats.criticalCompleted}/${stats.critical}`}
            trend={criticalCompletionRate === 100 ? "up" : "down"}
          />
          <MetricCard
            title={t('reg.consumer.activeComplaintChannels')}
            value={`${complaintChannels.filter(c => c.active).length}개`}
            change={t('reg.consumer.allOperating')}
            trend="up"
          />
          <MetricCard
            title={t('reg.consumer.avgResolutionTime')}
            value="1.8일"
            change="-0.2일"
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="checklist" className="w-full space-y-6">
          <div className="border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                {t('reg.consumer.tab_checklist')}
              </TabsTrigger>
              <TabsTrigger value="channels" className="data-[state=active]:bg-background">
                {t('reg.consumer.tab_channels')}
              </TabsTrigger>
              <TabsTrigger value="procedures" className="data-[state=active]:bg-background">
                {t('reg.consumer.tab_procedures')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="checklist" className="mt-0 space-y-6">
            {renderProtectionSection(t('reg.consumer.section1'))}
            <div className="mt-6" />
            {renderProtectionSection(t('reg.consumer.section2'))}
            <div className="mt-6" />
            {renderProtectionSection(t('reg.consumer.section3'))}
            <div className="mt-6" />
            {renderProtectionSection(t('reg.consumer.section4'))}
          </TabsContent>

          <TabsContent value="channels" className="mt-0">
            <div className="space-y-4">
              {complaintChannels.map((channel) => (
                <Card key={channel.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          {channel.type === "phone" && <Phone className="h-6 w-6 text-primary" />}
                          {channel.type === "email" && <Mail className="h-6 w-6 text-primary" />}
                          {channel.type === "online" && <MessageSquare className="h-6 w-6 text-primary" />}
                          {channel.type === "offline" && <MapPin className="h-6 w-6 text-primary" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{channel.name}</h3>
                          <p className="text-foreground font-mono text-sm mt-1">{channel.contact}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {t('reg.consumer.channel_operating')}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{t('reg.consumer.operatingHours')}</p>
                        <p className="text-sm font-medium">{channel.availableHours}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">{t('reg.consumer.responseTime')}</p>
                        <p className="text-sm font-medium">{channel.responseTime}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="procedures" className="mt-0 space-y-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-blue-600" />
                  {t('reg.consumer.remediationTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="w-0.5 h-16 bg-blue-200 mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold mb-2">{t('reg.consumer.step1_title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('reg.consumer.step1_desc')}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="w-0.5 h-16 bg-blue-200 mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold mb-2">{t('reg.consumer.step2_title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('reg.consumer.step2_desc')}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="w-0.5 h-16 bg-blue-200 mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold mb-2">{t('reg.consumer.step3_title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('reg.consumer.step3_desc')}
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div className="w-0.5 h-16 bg-blue-200 mt-2" />
                  </div>
                  <div className="pb-8">
                    <h4 className="font-semibold mb-2">{t('reg.consumer.step4_title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('reg.consumer.step4_desc')}
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('reg.consumer.step5_title')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('reg.consumer.step5_desc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Escalation Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-600" />
                  {t('reg.consumer.escalationTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    {t('reg.consumer.escalationDesc')}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>{t('reg.consumer.escalationDeadline')}</strong></p>
                  <p><strong>{t('reg.consumer.escalationReviewDeadline')}</strong></p>
                  <p><strong>{t('reg.consumer.escalationFinal')}</strong></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <Card className="border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              {t('reg.consumer.summaryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('reg.consumer.totalItems')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">{t('reg.consumer.completedItems')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">{t('reg.consumer.requiredItems')}</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{criticalCompletionRate}%</p>
                <p className="text-xs text-muted-foreground">{t('reg.consumer.requiredCompletionPercent')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <AIAssistantPanel
        context="consumer"
        title={t('reg.consumer.aiAssistantTitle')}
        contextData={JSON.stringify({
          completionRate: `${completionRate}%`,
          criticalCompletionRate: `${criticalCompletionRate}%`,
          totalItems: stats.total,
          complaintChannels: complaintChannels.length,
          activeChannels: complaintChannels.filter(c => c.active).length,
        })}
      />
    </Layout>
  );
};

export default ConsumerProtection;
