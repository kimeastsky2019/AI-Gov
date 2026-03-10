import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Lock,
  Users,
  FileText,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Settings,
  Brain,
  Database,
  Eye,
  UserCheck,
  TrendingUp
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
import { AIAssistantInline } from "@/components/AIAssistantInline";
import { useI18n } from "@/lib/i18n";

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  lastReview?: string;
}

const PrivacyReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("section1");
  const [checklistItems] = useState<ChecklistItem[]>([
    { id: "s1-01", category: t('reg.privacy.category1'), title: t('reg.privacy.item_s1_01_title'), description: t('reg.privacy.item_s1_01_desc'), completed: true, required: true, lastReview: "2024-02-15" },
    { id: "s1-02", category: t('reg.privacy.category1'), title: t('reg.privacy.item_s1_02_title'), description: t('reg.privacy.item_s1_02_desc'), completed: true, required: true, lastReview: "2024-02-15" },
    { id: "s1-03", category: t('reg.privacy.category1'), title: t('reg.privacy.item_s1_03_title'), description: t('reg.privacy.item_s1_03_desc'), completed: true, required: true, lastReview: "2024-01-30" },
    { id: "s1-04", category: t('reg.privacy.category1'), title: t('reg.privacy.item_s1_04_title'), description: t('reg.privacy.item_s1_04_desc'), completed: false, required: true, lastReview: "2024-01-15" },
    { id: "s2-01", category: t('reg.privacy.category2'), title: t('reg.privacy.item_s2_01_title'), description: t('reg.privacy.item_s2_01_desc'), completed: true, required: true, lastReview: "2024-02-10" },
    { id: "s2-02", category: t('reg.privacy.category2'), title: t('reg.privacy.item_s2_02_title'), description: t('reg.privacy.item_s2_02_desc'), completed: true, required: true, lastReview: "2024-02-10" },
    { id: "s2-03", category: t('reg.privacy.category2'), title: t('reg.privacy.item_s2_03_title'), description: t('reg.privacy.item_s2_03_desc'), completed: false, required: false, lastReview: "2024-02-01" },
    { id: "s2-04", category: t('reg.privacy.category2'), title: t('reg.privacy.item_s2_04_title'), description: t('reg.privacy.item_s2_04_desc'), completed: true, required: false, lastReview: "2024-01-20" },
    { id: "s3-01", category: t('reg.privacy.category3'), title: t('reg.privacy.item_s3_01_title'), description: t('reg.privacy.item_s3_01_desc'), completed: true, required: true, lastReview: "2024-02-12" },
    { id: "s3-02", category: t('reg.privacy.category3'), title: t('reg.privacy.item_s3_02_title'), description: t('reg.privacy.item_s3_02_desc'), completed: true, required: true, lastReview: "2024-02-12" },
    { id: "s3-03", category: t('reg.privacy.category3'), title: t('reg.privacy.item_s3_03_title'), description: t('reg.privacy.item_s3_03_desc'), completed: false, required: true, lastReview: "2024-01-30" },
    { id: "s4-01", category: t('reg.privacy.category4'), title: t('reg.privacy.item_s4_01_title'), description: t('reg.privacy.item_s4_01_desc'), completed: true, required: true, lastReview: "2024-02-15" },
    { id: "s4-02", category: t('reg.privacy.category4'), title: t('reg.privacy.item_s4_02_title'), description: t('reg.privacy.item_s4_02_desc'), completed: true, required: true, lastReview: "2024-02-15" },
    { id: "s4-03", category: t('reg.privacy.category4'), title: t('reg.privacy.item_s4_03_title'), description: t('reg.privacy.item_s4_03_desc'), completed: true, required: true, lastReview: "2024-02-10" },
    { id: "s4-04", category: t('reg.privacy.category4'), title: t('reg.privacy.item_s4_04_title'), description: t('reg.privacy.item_s4_04_desc'), completed: false, required: true, lastReview: "2024-01-20" },
    { id: "s5-01", category: t('reg.privacy.category5'), title: t('reg.privacy.item_s5_01_title'), description: t('reg.privacy.item_s5_01_desc'), completed: true, required: true, lastReview: "2024-02-01" },
    { id: "s5-02", category: t('reg.privacy.category5'), title: t('reg.privacy.item_s5_02_title'), description: t('reg.privacy.item_s5_02_desc'), completed: true, required: true, lastReview: "2024-02-01" },
    { id: "s5-03", category: t('reg.privacy.category5'), title: t('reg.privacy.item_s5_03_title'), description: t('reg.privacy.item_s5_03_desc'), completed: true, required: true, lastReview: "2024-02-05" },
    { id: "s6-01", category: t('reg.privacy.category6'), title: t('reg.privacy.item_s6_01_title'), description: t('reg.privacy.item_s6_01_desc'), completed: true, required: true, lastReview: "2024-02-10" },
    { id: "s6-02", category: t('reg.privacy.category6'), title: t('reg.privacy.item_s6_02_title'), description: t('reg.privacy.item_s6_02_desc'), completed: true, required: true, lastReview: "2024-02-10" },
    { id: "s6-03", category: t('reg.privacy.category6'), title: t('reg.privacy.item_s6_03_title'), description: t('reg.privacy.item_s6_03_desc'), completed: false, required: false, lastReview: "2024-01-25" },
    { id: "s7-01", category: t('reg.privacy.category7'), title: t('reg.privacy.item_s7_01_title'), description: t('reg.privacy.item_s7_01_desc'), completed: true, required: true, lastReview: "2024-01-15" },
    { id: "s7-02", category: t('reg.privacy.category7'), title: t('reg.privacy.item_s7_02_title'), description: t('reg.privacy.item_s7_02_desc'), completed: true, required: true, lastReview: "2024-02-01" },
    { id: "s8-01", category: t('reg.privacy.category8'), title: t('reg.privacy.item_s8_01_title'), description: t('reg.privacy.item_s8_01_desc'), completed: true, required: true, lastReview: "2024-02-12" },
    { id: "s8-02", category: t('reg.privacy.category8'), title: t('reg.privacy.item_s8_02_title'), description: t('reg.privacy.item_s8_02_desc'), completed: true, required: true, lastReview: "2024-02-12" },
    { id: "s8-03", category: t('reg.privacy.category8'), title: t('reg.privacy.item_s8_03_title'), description: t('reg.privacy.item_s8_03_desc'), completed: false, required: true, lastReview: "2024-01-30" },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const sectionMap = useMemo(() => ({
    section1: t('reg.privacy.category1'),
    section2: t('reg.privacy.category2'),
    section3: t('reg.privacy.category3'),
    section4: t('reg.privacy.category4'),
    section5: t('reg.privacy.category5'),
    section6: t('reg.privacy.category6'),
    section7: t('reg.privacy.category7'),
    section8: t('reg.privacy.category8'),
  }), [t]);

  const getSectionItems = (sectionId: string): ChecklistItem[] => {
    return checklistItems.filter(item => item.category === sectionMap[sectionId as keyof typeof sectionMap]);
  };

  const getCompletionStats = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter(item => item.completed).length;
    const required = checklistItems.filter(item => item.required).length;
    const requiredCompleted = checklistItems.filter(item => item.required && item.completed).length;
    return { total, completed, required, requiredCompleted };
  };

  const stats = useMemo(() => getCompletionStats(), [checklistItems]);
  const completionRate = Math.round((stats.completed / stats.total) * 100);
  const requiredCompletionRate = Math.round((stats.requiredCompleted / stats.required) * 100);

  const renderChecklistSection = (sectionId: string, sectionTitle: string) => {
    const items = getSectionItems(sectionId);
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{sectionTitle}</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {items.length}{t('reg.privacy.of')} {items.filter(i => i.completed).length}{t('reg.privacy.completed_of')}
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
                  onCheckedChange={() => toggleChecklistItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <div className="flex items-center gap-2">
                      {item.required && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {t('reg.privacy.required')}
                        </Badge>
                      )}
                      {item.completed && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.lastReview && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('reg.privacy.lastCheckup')} {item.lastReview}
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
              {t('reg.privacy.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('reg.privacy.subtitle')}
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:opacity-90 transition-all">
            <Download className="mr-2 h-4 w-4" />
            {t('reg.privacy.downloadReport')}
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('reg.privacy.overallCompletionRate')}
            value={`${completionRate}%`}
            change={`${stats.completed}/${stats.total}`}
            trend="up"
          />
          <MetricCard
            title={t('reg.privacy.requiredCompletionRate')}
            value={`${requiredCompletionRate}%`}
            change={`${stats.requiredCompleted}/${stats.required}`}
            trend={requiredCompletionRate === 100 ? "up" : "down"}
          />
          <MetricCard
            title={t('reg.privacy.incompleteItems')}
            value={`${stats.total - stats.completed}개`}
            change={`${Math.round(((stats.total - stats.completed) / stats.total) * 100)}%`}
            trend="down"
          />
          <MetricCard
            title={t('reg.privacy.lastReview')}
            value="2024-02-15"
            change={t('reg.privacy.latest')}
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="section1" className="w-full space-y-6">
          <div className="border-b pb-1">
            <TabsList className="bg-muted/50 w-full justify-start overflow-x-auto">
              <TabsTrigger value="section1" className="data-[state=active]:bg-background">
                {t('reg.privacy.section1')}
              </TabsTrigger>
              <TabsTrigger value="section2" className="data-[state=active]:bg-background">
                {t('reg.privacy.section2')}
              </TabsTrigger>
              <TabsTrigger value="section3" className="data-[state=active]:bg-background">
                {t('reg.privacy.section3')}
              </TabsTrigger>
              <TabsTrigger value="section4" className="data-[state=active]:bg-background">
                {t('reg.privacy.section4')}
              </TabsTrigger>
              <TabsTrigger value="section5" className="data-[state=active]:bg-background">
                {t('reg.privacy.section5')}
              </TabsTrigger>
              <TabsTrigger value="section6" className="data-[state=active]:bg-background">
                {t('reg.privacy.section6')}
              </TabsTrigger>
              <TabsTrigger value="section7" className="data-[state=active]:bg-background">
                {t('reg.privacy.section7')}
              </TabsTrigger>
              <TabsTrigger value="section8" className="data-[state=active]:bg-background">
                {t('reg.privacy.section8')}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="section1" className="mt-0 space-y-6">
            {renderChecklistSection("section1", t('reg.privacy.section1Full'))}
          </TabsContent>

          <TabsContent value="section2" className="mt-0 space-y-6">
            {renderChecklistSection("section2", t('reg.privacy.section2Full'))}
          </TabsContent>

          <TabsContent value="section3" className="mt-0 space-y-6">
            {renderChecklistSection("section3", t('reg.privacy.section3Full'))}
          </TabsContent>

          <TabsContent value="section4" className="mt-0 space-y-6">
            {renderChecklistSection("section4", t('reg.privacy.section4Full'))}
          </TabsContent>

          <TabsContent value="section5" className="mt-0 space-y-6">
            {renderChecklistSection("section5", t('reg.privacy.section5Full'))}
          </TabsContent>

          <TabsContent value="section6" className="mt-0 space-y-6">
            {renderChecklistSection("section6", t('reg.privacy.section6Full'))}
          </TabsContent>

          <TabsContent value="section7" className="mt-0 space-y-6">
            {renderChecklistSection("section7", t('reg.privacy.section7Full'))}
          </TabsContent>

          <TabsContent value="section8" className="mt-0 space-y-6">
            {renderChecklistSection("section8", t('reg.privacy.section8Full'))}
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {t('reg.privacy.summaryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-muted-foreground">{t('reg.privacy.totalItems')}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-xs text-muted-foreground">{t('reg.privacy.completedItems')}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{stats.required}</p>
                <p className="text-xs text-muted-foreground">{t('reg.privacy.requiredItems')}</p>
              </div>
              <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{requiredCompletionRate}%</p>
                <p className="text-xs text-muted-foreground">{t('reg.privacy.requiredCompletionPercent')}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('reg.privacy.summaryDesc')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="privacy"
        title={t('reg.privacy.aiAssistantTitle')}
        contextData={JSON.stringify({
          completionRate: `${completionRate}%`,
          requiredCompletionRate: `${requiredCompletionRate}%`,
          totalItems: stats.total,
          completedItems: stats.completed,
          requiredItems: stats.required,
          sections: 8,
        })}
      />
    </Layout>
  );
};

export default PrivacyReview;
