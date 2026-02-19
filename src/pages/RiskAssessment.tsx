import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  AlertTriangle,
  Filter,
  Search,
  BarChart3,
  LayoutGrid,
  List as ListIcon,
  Brain
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { RiskCard, MetricCard } from "@/components/Cards";
import { RiskAssessmentForm } from "@/components/Forms";
import { createMockRiskAssessments } from "@/data/index";
import { RISK_LEVELS, RiskAssessment } from "@/lib/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

const RiskAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const mockRiskAssessments = useMemo(() => createMockRiskAssessments(t), [t]);

  const filteredAssessments = mockRiskAssessments.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormSubmit = (data: any) => {
    console.log("Assessment Submitted:", data);
    setIsFormOpen(false);
  };

  const guidelines = useMemo(() => [
    t('risk.guideline1'),
    t('risk.guideline2'),
    t('risk.guideline3'),
  ], [t]);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('risk.pageTitle')}</h1>
            <p className="text-muted-foreground">
              {t('risk.pageDesc')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/risk-assessment/wizard')}
              className="bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              <Brain className="mr-2 h-4 w-4" />
              {t('risk.wizardGuide')}
            </Button>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('risk.quickAssess')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('risk.quickAssessTitle')}</DialogTitle>
                  <DialogDescription>
                    {t('risk.quickAssessDesc')}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <RiskAssessmentForm onSubmit={handleFormSubmit} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('risk.metric.completed')}
            value={mockRiskAssessments.filter(a => a.status === "COMPLETED").length}
            change="+2"
            trend="up"
          />
          <MetricCard
            title={t('risk.metric.inProgress')}
            value={mockRiskAssessments.filter(a => a.status === "IN_PROGRESS").length}
            change="-1"
            trend="down"
          />
          <MetricCard
            title={t('risk.metric.highRisk')}
            value={mockRiskAssessments.filter(a => a.riskLevel === "HIGH").length}
            change="+1"
            trend="up"
          />
          <MetricCard
            title={t('risk.metric.avgIndex')}
            value="42.5"
            change="-5.2%"
            trend="down"
          />
        </div>

        {/* Main Content Area */}
        <Tabs defaultValue="assessments" className="w-full space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-px">
            <TabsList className="bg-transparent gap-6">
              <TabsTrigger
                value="assessments"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 bg-transparent shadow-none"
              >
                {t('risk.tab.assessments')}
              </TabsTrigger>
              <TabsTrigger
                value="matrix"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 bg-transparent shadow-none"
              >
                {t('risk.tab.matrix')}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('risk.search.placeholder')}
                  className="pl-9 w-[200px] lg:w-[300px] h-9 bg-card border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-muted rounded-md p-1 border border-border">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="assessments" className="mt-0">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
              }
            >
              {filteredAssessments.map((assessment) => (
                <motion.div key={assessment.id} variants={staggerItem}>
                  <RiskCard risk={assessment} />
                </motion.div>
              ))}

              {filteredAssessments.length === 0 && (
                <div className="col-span-full py-20 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">{t('risk.noResults')}</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="matrix" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Matrix Visualization */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={springPresets.gentle}
                className="lg:col-span-2 bg-card border border-border rounded-xl p-8 shadow-sm"
              >
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t('risk.matrix.title')}
                </h3>

                <div className="aspect-square w-full max-w-[500px] mx-auto relative">
                  {/* Y-axis Label */}
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    {t('risk.matrix.yAxis')}
                  </div>
                  {/* X-axis Label */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground uppercase tracking-widest">
                    {t('risk.matrix.xAxis')}
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-4 grid-rows-4 w-full h-full border-l-2 border-b-2 border-border">
                    {/* Rows from High Impact to Low Impact */}
                    {[4, 3, 2, 1].map((impact) => (
                      [1, 2, 3, 4].map((likelihood) => {
                        const score = impact * likelihood;
                        let bgColor = "bg-muted/30";
                        if (score >= 12) bgColor = "bg-chart-1/20";
                        else if (score >= 8) bgColor = "bg-chart-2/20";
                        else if (score >= 4) bgColor = "bg-chart-3/20";
                        else bgColor = "bg-chart-4/20";

                        return (
                          <div
                            key={`${impact}-${likelihood}`}
                            className={`border border-border/50 ${bgColor} relative group transition-colors hover:bg-opacity-40 flex items-center justify-center`}
                          >
                            {/* Mock dots for assessments */}
                            {score === 16 && <div className="w-3 h-3 rounded-full bg-chart-1 shadow-lg" />}
                            {score === 9 && <div className="w-3 h-3 rounded-full bg-chart-2 shadow-lg" />}
                            {score === 4 && <div className="w-3 h-3 rounded-full bg-chart-4 shadow-lg" />}

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-background/80 transition-opacity">
                              <span className="text-[10px] font-mono font-bold">{score}pts</span>
                            </div>
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Risk Level Legend */}
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-base font-semibold mb-4">{t('risk.matrix.legend')}</h3>
                  <div className="space-y-4">
                    {Object.entries(RISK_LEVELS).map(([key, level]) => (
                      <div key={key} className="flex gap-4">
                        <div
                          className="w-1.5 h-auto rounded-full shrink-0"
                          style={{ backgroundColor: level.color }}
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold">{level.label}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {level.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-primary mb-2">{t('risk.guidelines')}</h4>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    {guidelines.map((guideline, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-primary">•</span>
                        {guideline}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default RiskAssessmentPage;
