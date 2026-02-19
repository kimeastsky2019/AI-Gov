import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ShieldAlert,
  Activity,
  ChevronRight
} from "lucide-react";
import {
  RiskAssessment,
  ComplianceReport,
  RISK_LEVELS,
  COMPLIANCE_STATUS
} from "@/lib/index";
import { useI18n } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RiskCardProps {
  risk: RiskAssessment;
}

export function RiskCard({ risk }: RiskCardProps) {
  const { t } = useI18n();
  const config = RISK_LEVELS[risk.riskLevel];

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Card className="overflow-hidden border-l-4 h-full" style={{ borderLeftColor: config.color }}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2 font-mono text-[10px] tracking-tighter">
              {risk.id}
            </Badge>
            <Badge
              style={{ backgroundColor: config.color, color: 'white' }}
              className="border-none"
            >
              {t(config.label)}
            </Badge>
          </div>
          <CardTitle className="text-lg line-clamp-1">{risk.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{risk.category}</p>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
            {risk.description}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{risk.updatedAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>{risk.status === 'COMPLETED' ? t('cards.assessed') : t('cards.inProgress')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="w-full flex justify-between items-center text-xs font-medium">
            <span className="text-muted-foreground">{t('cards.assessor')}: {risk.assessor}</span>
            <div className="flex items-center text-primary cursor-pointer hover:underline">
              {t('cards.viewDetail')} <ChevronRight className="w-3 h-3 ml-0.5" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface ComplianceCardProps {
  report: ComplianceReport;
}

export function ComplianceCard({ report }: ComplianceCardProps) {
  const { t } = useI18n();
  const statusConfig = COMPLIANCE_STATUS[report.status];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-mono text-muted-foreground">{report.standard}</span>
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
              style={{ color: statusConfig.color, borderColor: statusConfig.color }}
            >
              {report.status === 'FAILED' ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
              {t(statusConfig.label)}
            </Badge>
          </div>
          <CardTitle className="text-md">{report.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span>{t('cards.complianceScore')}</span>
                <span>{report.score}%</span>
              </div>
              <Progress value={report.score} className="h-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 p-2 rounded-md">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('cards.findings')}</p>
                <p className="text-lg font-bold">{report.findings}</p>
              </div>
              <div className="bg-muted/30 p-2 rounded-md">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('cards.auditDate')}</p>
                <p className="text-sm font-medium mt-1">{report.completionDate}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/5 py-3">
          <button className="w-full text-xs font-semibold flex items-center justify-center gap-2 hover:text-primary transition-colors">
            <FileText className="w-3.5 h-3.5" />
            {t('cards.downloadReport')}
          </button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
}

export function MetricCard({ title, value, change, trend }: MetricCardProps) {
  const isPositive = trend === 'up';

  return (
    <Card className="relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {isPositive ? <ArrowUpRight size={48} /> : <ArrowDownRight size={48} />}
      </div>
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{value}</h2>
          <div className={cn(
            "flex items-center text-xs font-semibold",
            isPositive ? "text-chart-4" : "text-chart-1"
          )}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProcessCardProps {
  title: string;
  description: string;
  status: string;
  icon: React.ReactNode;
}

export function ProcessCard({ title, description, status, icon }: ProcessCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm relative overflow-hidden group hover:border-primary/50 transition-all">
      <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm">{title}</h4>
          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold text-muted-foreground uppercase">
            {status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
}
