import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  FileText,
  Users,
  Zap,
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { ROUTE_PATHS } from "@/lib/index";
import { cn } from "@/lib/utils";

interface GovernanceItem {
  id: string;
  title: string;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING";
  date: string;
  riskLevel?: "HIGH" | "MEDIUM" | "LOW";
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const GovernanceDashboard: React.FC = () => {
  const { t } = useI18n();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock governance data
  const mockRecentActivities = useMemo((): GovernanceItem[] => [
    {
      id: "GA001",
      title: t('gov.action.services') || "금융권 AI 서비스 A 위험등급 평가",
      status: "COMPLETED",
      date: "2026-03-09",
      riskLevel: "MEDIUM"
    },
    {
      id: "GA002",
      title: t('gov.info.personalInfo') || "개인정보보호 자율점검표 검토",
      status: "IN_PROGRESS",
      date: "2026-03-08",
      riskLevel: "LOW"
    },
    {
      id: "GA003",
      title: "TTA 요구사항 01 점검 및 보고",
      status: "COMPLETED",
      date: "2026-03-07",
      riskLevel: "LOW"
    },
    {
      id: "GA004",
      title: t('gov.raci.matrix') || "거버넌스 위원회 승인",
      status: "IN_PROGRESS",
      date: "2026-03-06",
      riskLevel: "HIGH"
    },
    {
      id: "GA005",
      title: t('gov.raciTask.service') || "AI 서비스 등록 및 분류",
      status: "PENDING",
      date: "2026-03-05",
      riskLevel: "MEDIUM"
    },
  ], [t]);

  const riskDistribution = [
    { level: "UNACCEPTABLE", count: 2, percentage: 8 },
    { level: "HIGH", count: 8, percentage: 32 },
    { level: "MEDIUM", count: 10, percentage: 40 },
    { level: "LOW", count: 5, percentage: 20 },
  ];

  const complianceStatus = [
    { framework: "TTA 2023", completion: 92, color: "bg-blue-500" },
    { framework: "금융분야 AI", completion: 85, color: "bg-purple-500" },
    { framework: "개인정보보호", completion: 78, color: "bg-amber-500" },
  ];

  return (
    <Layout>
      <motion.div
        className="space-y-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={staggerItem}>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('gov.dashboard.title') || 'AI 거버넌스 대시보드'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('gov.dashboard.subtitle') || '조직의 AI 거버넌스 현황을 한눈에 파악하고 규제 준수를 관리하세요'}
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('gov.metric.totalServices') || '총 AI 서비스 수'}
              value={25}
              change={"+3"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('gov.metric.highRisk') || '고위험 서비스'}
              value={8}
              change={"-1"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('gov.metric.compliance') || '규제 준수율'}
              value="88%"
              change={"+5%"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('gov.metric.completed') || '점검 완료율'}
              value="82%"
              change={"+2%"}
              trend="up"
            />
          </motion.div>
        </motion.div>

        {/* Risk Level Distribution */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                {t('gov.riskDistribution.title') || '위험 등급 분포'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskDistribution.map((item) => (
                  <div key={item.level} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">
                        {item.level === 'UNACCEPTABLE' ? t('gov.riskDistribution.unacceptable') :
                         item.level === 'HIGH' ? t('gov.riskDistribution.high') :
                         item.level === 'MEDIUM' ? t('gov.riskDistribution.medium') : t('gov.riskDistribution.low')}
                      </span>
                      <span className="text-muted-foreground">{item.count}개 ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          item.level === 'UNACCEPTABLE' ? 'bg-red-500' :
                          item.level === 'HIGH' ? 'bg-orange-500' :
                          item.level === 'MEDIUM' ? 'bg-yellow-500' : 'bg-green-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Compliance Overview */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  {t('gov.compliance.title') || '규제 준수 현황'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {complianceStatus.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">{item.framework}</span>
                      <Badge variant="secondary">{item.completion}%</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", item.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.completion}%` }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.completion >= 90 ? t('gov.compliance.excellent') :
                       item.completion >= 75 ? t('gov.compliance.improving') : t('gov.compliance.recommended')}
                    </p>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  상세 보기 <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  {t('gov.quickActions.title') || '빠른 작업'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <a href={ROUTE_PATHS.RISK_MANAGEMENT}>
                      <AlertTriangle className="w-4 h-4 mr-3 flex-shrink-0 text-red-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('gov.action.riskManagement')}</div>
                        <div className="text-xs text-muted-foreground">{t('gov.action.riskManagementDesc')}</div>
                      </div>
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <a href={ROUTE_PATHS.ORGANIZATION}>
                      <Users className="w-4 h-4 mr-3 flex-shrink-0 text-blue-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('gov.action.organization')}</div>
                        <div className="text-xs text-muted-foreground">{t('gov.action.organizationDesc')}</div>
                      </div>
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <a href={ROUTE_PATHS.SERVICE_MANAGEMENT}>
                      <Activity className="w-4 h-4 mr-3 flex-shrink-0 text-purple-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('gov.action.services')}</div>
                        <div className="text-xs text-muted-foreground">{t('gov.action.servicesDesc')}</div>
                      </div>
                    </a>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    asChild
                  >
                    <a href={ROUTE_PATHS.GOVERNANCE_REPORTS}>
                      <FileText className="w-4 h-4 mr-3 flex-shrink-0 text-emerald-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{t('gov.action.reports')}</div>
                        <div className="text-xs text-muted-foreground">{t('gov.action.reportsDesc')}</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-500" />
                {t('gov.recent.title') || '최근 활동'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivities.map((activity, idx) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                  >
                    <div className="flex-shrink-0">
                      {activity.status === 'COMPLETED' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : activity.status === 'IN_PROGRESS' ? (
                        <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                    {activity.riskLevel && (
                      <Badge variant="outline" className={cn(
                        "flex-shrink-0",
                        activity.riskLevel === 'HIGH' && "bg-red-50 text-red-700",
                        activity.riskLevel === 'MEDIUM' && "bg-yellow-50 text-yellow-700",
                        activity.riskLevel === 'LOW' && "bg-green-50 text-green-700"
                      )}>
                        {activity.riskLevel}
                      </Badge>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">
                {t('gov.recent.viewAll') || t('common.viewAll')} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Information Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20 border-blue-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.info.tta2023')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('gov.info.tta2023Desc')}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  {t('gov.info.tta2023Rate')}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-purple-50/50 to-purple-50/20 border-purple-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.info.financeAI')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('gov.info.financeAIDesc')}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-purple-600 font-medium">
                  <TrendingDown className="w-3 h-3" />
                  {t('gov.info.financeAIServices')}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-amber-50/50 to-amber-50/20 border-amber-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.info.personalInfo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('gov.info.personalInfoDesc')}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('gov.info.personalInfoRate')}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default GovernanceDashboard;
