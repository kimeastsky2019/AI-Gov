import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Activity,
  ClipboardCheck,
  LayoutDashboard,
  Zap,
  DollarSign,
  Brain,
  Lock,
  Eye,
  Cpu,
  Wrench,
  Leaf,
  TrendingUp,
  TrendingDown,
  Shield,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Gauge,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, ComposedChart,
} from 'recharts';

import { ROUTE_PATHS } from '@/lib/index';
import { Layout } from '@/components/Layout';
import { MetricCard, RiskCard, ComplianceCard, ProcessCard } from '@/components/Cards';
import { createMockDashboardMetrics, createMockComplianceReports } from '@/data/index';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { dashboardAPI } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

// =============================================
// Finance & Energy Domain Data (static, no Korean)
// =============================================
const transactionData = [
  { time: '09:00', normal: 245, suspicious: 3, blocked: 1 },
  { time: '10:00', normal: 312, suspicious: 5, blocked: 2 },
  { time: '11:00', normal: 389, suspicious: 8, blocked: 3 },
  { time: '12:00', normal: 425, suspicious: 12, blocked: 5 },
  { time: '13:00', normal: 356, suspicious: 7, blocked: 2 },
  { time: '14:00', normal: 478, suspicious: 15, blocked: 6 },
  { time: '15:00', normal: 521, suspicious: 22, blocked: 8 },
  { time: '16:00', normal: 445, suspicious: 18, blocked: 7 },
];

const renewableForecastData = [
  { hour: '06:00', actual: 0.2, predicted: 0.3, upper: 0.5 },
  { hour: '07:00', actual: 1.8, predicted: 2.0, upper: 2.8 },
  { hour: '08:00', actual: 4.5, predicted: 4.2, upper: 5.4 },
  { hour: '09:00', actual: 7.8, predicted: 8.1, upper: 9.7 },
  { hour: '10:00', actual: 11.2, predicted: 10.5, upper: 12.2 },
  { hour: '11:00', actual: 13.5, predicted: 14.0, upper: 16.5 },
  { hour: '12:00', actual: 14.8, predicted: 15.2, upper: 17.6 },
  { hour: '13:00', actual: 14.2, predicted: 14.8, upper: 17.6 },
  { hour: '14:00', actual: 12.5, predicted: 13.0, upper: 15.5 },
  { hour: '15:00', actual: 9.8, predicted: 10.2, upper: 12.4 },
  { hour: '16:00', actual: 6.2, predicted: 6.5, upper: 8.2 },
  { hour: '17:00', actual: 3.1, predicted: 3.5, upper: 4.8 },
  { hour: '18:00', actual: 0.8, predicted: 1.0, upper: 1.7 },
];

const behaviorData = [
  { time: '00:00', hvac: 1.2, appliances: 0.3, ev: 0.0, occupancy: 5 },
  { time: '06:00', hvac: 2.5, appliances: 1.5, ev: 0.0, occupancy: 80 },
  { time: '09:00', hvac: 4.2, appliances: 2.8, ev: 0.0, occupancy: 95 },
  { time: '12:00', hvac: 5.8, appliances: 3.2, ev: 0.0, occupancy: 60 },
  { time: '15:00', hvac: 5.2, appliances: 2.5, ev: 7.2, occupancy: 90 },
  { time: '18:00', hvac: 4.5, appliances: 3.8, ev: 5.0, occupancy: 70 },
  { time: '21:00', hvac: 2.8, appliances: 2.0, ev: 2.0, occupancy: 30 },
];

// =============================================
// Custom Recharts Tooltip
// =============================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border rounded-lg p-3 shadow-xl text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// =============================================
// Finance Section
// =============================================
function FinanceDashboard() {
  const { t } = useI18n();
  const [finTab, setFinTab] = useState('overview');
  const [expandedAlert, setExpandedAlert] = useState<number | null>(null);

  const fraudCategories = useMemo(() => [
    { name: t('dashboard.finance.fraud.accountTakeover'), value: 35, color: '#ef4444' },
    { name: t('dashboard.finance.fraud.cardClone'), value: 25, color: '#f97316' },
    { name: t('dashboard.finance.fraud.phishing'), value: 20, color: '#eab308' },
    { name: t('dashboard.finance.fraud.insider'), value: 12, color: '#3b82f6' },
    { name: t('dashboard.finance.fraud.other'), value: 8, color: '#6b7280' },
  ], [t]);

  const anomalyAlerts = useMemo(() => [
    { id: 1, type: 'critical', msg: t('dashboard.finance.alert1.msg'), time: '2분 전', score: 97, xai: t('dashboard.finance.alert1.xai') },
    { id: 2, type: 'warning', msg: t('dashboard.finance.alert2.msg'), time: '8분 전', score: 85, xai: t('dashboard.finance.alert2.xai') },
    { id: 3, type: 'warning', msg: t('dashboard.finance.alert3.msg'), time: '15분 전', score: 79, xai: t('dashboard.finance.alert3.xai') },
  ], [t]);

  const featureImportance = useMemo(() => [
    { f: t('dashboard.finance.feature.txAmount'), v: 92 },
    { f: t('dashboard.finance.feature.accessTime'), v: 87 },
    { f: t('dashboard.finance.feature.deviceFp'), v: 78 },
    { f: t('dashboard.finance.feature.txFrequency'), v: 71 },
    { f: t('dashboard.finance.feature.locationAnomaly'), v: 65 },
    { f: t('dashboard.finance.feature.accountBehavior'), v: 58 },
  ], [t]);

  const financeKpis = useMemo(() => [
    { label: t('dashboard.finance.todayTx'), value: '3,171', change: '+12.3%', up: true },
    { label: t('dashboard.finance.detected'), value: '90건', change: '-8.5%', up: false },
    { label: t('dashboard.finance.blocked'), value: '34건', change: '+15.2%', up: true },
    { label: t('dashboard.finance.accuracy'), value: '99.7%', change: '+0.2%', up: true },
  ], [t]);

  const aiProcessSteps = useMemo(() => [
    { s: 1, t: t('dashboard.finance.step1.title'), d: t('dashboard.finance.step1.desc') },
    { s: 2, t: t('dashboard.finance.step2.title'), d: t('dashboard.finance.step2.desc') },
    { s: 3, t: t('dashboard.finance.step3.title'), d: t('dashboard.finance.step3.desc') },
    { s: 4, t: t('dashboard.finance.step4.title'), d: t('dashboard.finance.step4.desc') },
    { s: 5, t: t('dashboard.finance.step5.title'), d: t('dashboard.finance.step5.desc') },
  ], [t]);

  return (
    <div className="space-y-6">
      {/* Finance Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI sLLM Finance</h2>
            <p className="text-xs text-blue-400 font-medium">with Cyber Security Focus</p>
          </div>
        </div>
        <Badge variant="outline" className="border-green-500/30 text-green-400 gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          {t('dashboard.finance.monitoring')}
        </Badge>
      </div>

      {/* Finance Tabs */}
      <Tabs value={finTab} onValueChange={setFinTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-1.5"><Activity className="w-3.5 h-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="anomaly" className="gap-1.5"><Shield className="w-3.5 h-3.5" /> Anomaly Detection</TabsTrigger>
          <TabsTrigger value="xai" className="gap-1.5"><Eye className="w-3.5 h-3.5" /> Explainable AI</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {financeKpis.map(({ label, value, change, up }) => (
              <Card key={label} className="border-blue-500/10 bg-blue-500/[0.02]">
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-2">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className={cn("text-xs mt-1 flex items-center gap-1", up ? "text-green-400" : "text-red-400")}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400">{t('dashboard.finance.realtimeChart')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={transactionData}>
                    <defs>
                      <linearGradient id="finNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="finSuspicious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" className="text-xs" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="normal" stroke="#3b82f6" fill="url(#finNormal)" name={t('dashboard.finance.normal')} strokeWidth={2} />
                    <Area type="monotone" dataKey="suspicious" stroke="#f97316" fill="url(#finSuspicious)" name={t('dashboard.finance.suspicious')} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('dashboard.finance.fraudType')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={fraudCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {fraudCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {fraudCategories.map(({ name, value, color }) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {name}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Anomaly Detection */}
        <TabsContent value="anomaly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.finance.anomalyTitle')}</CardTitle>
              <p className="text-xs text-muted-foreground">{t('dashboard.finance.anomalyDesc')}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {anomalyAlerts.map(a => (
                <motion.div
                  key={a.id}
                  onClick={() => setExpandedAlert(expandedAlert === a.id ? null : a.id)}
                  className={cn(
                    "rounded-lg border p-4 cursor-pointer transition-colors",
                    a.type === 'critical'
                      ? "border-red-500/30 bg-red-500/[0.03] hover:bg-red-500/[0.06]"
                      : "border-yellow-500/30 bg-yellow-500/[0.03] hover:bg-yellow-500/[0.06]"
                  )}
                  layout
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{a.msg}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                    </div>
                    <Badge className={cn(
                      "ml-3 font-mono",
                      a.score >= 90 ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    )}>
                      {a.score}
                    </Badge>
                  </div>
                  <AnimatePresence>
                    {expandedAlert === a.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-blue-400">{t('dashboard.finance.xaiBasis')}</span>
                          </div>
                          <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg leading-relaxed">{a.xai}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Explainable AI */}
        <TabsContent value="xai" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" /> {t('dashboard.finance.xaiTitle')}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{t('dashboard.finance.xaiDesc')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Feature Importance */}
                <div>
                  <h4 className="text-sm font-medium mb-4">{t('dashboard.finance.featureTitle')}</h4>
                  <div className="space-y-3">
                    {featureImportance.map(({ f, v }) => (
                      <div key={f}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{f}</span>
                          <span className="text-blue-400 font-mono">{v}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${v}%` }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Decision Process */}
                <div>
                  <h4 className="text-sm font-medium mb-4">{t('dashboard.finance.aiProcessTitle')}</h4>
                  <div className="space-y-4">
                    {aiProcessSteps.map(({ s, t: title, d }) => (
                      <div key={s} className="flex gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                          s < 5 ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"
                        )}>{s}</div>
                        <div>
                          <p className="text-sm font-medium">{title}</p>
                          <p className="text-xs text-muted-foreground">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/[0.04] border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-400">Federated Learning</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t('dashboard.finance.federatedDesc')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =============================================
// Energy Section
// =============================================
function EnergyDashboard() {
  const { t } = useI18n();
  const [enTab, setEnTab] = useState('overview');
  const [expandedMaint, setExpandedMaint] = useState<number | null>(null);

  const energySourceMix = useMemo(() => [
    { name: t('dashboard.energy.source.solar'), value: 42, color: '#f59e0b' },
    { name: t('dashboard.energy.source.wind'), value: 18, color: '#06b6d4' },
    { name: t('dashboard.energy.source.battery'), value: 15, color: '#8b5cf6' },
    { name: t('dashboard.energy.source.grid'), value: 25, color: '#6b7280' },
  ], [t]);

  const forecastErrorData = useMemo(() => [
    { method: 'NanoGrid-AI', mae: 3.2, rmse: 4.1 },
    { method: 'LSTM', mae: 7.8, rmse: 10.2 },
    { method: 'Persistence', mae: 12.5, rmse: 15.8 },
    { method: t('dashboard.energy.weather'), mae: 9.1, rmse: 12.3 },
  ], [t]);

  const maintenancePredictions = useMemo(() => [
    { id: 1, equipment: t('dashboard.energy.maint1.equipment'), risk: 87, nextService: '3일 후', status: 'critical', prediction: t('dashboard.energy.maint1.prediction'), xai: 'SHAP: 진동 주파수(42%), 전류 불균형(28%), 운전시간 초과(18%), 외기온도(12%)', halluCheck: { passed: true, confidence: 91, sources: 47 } },
    { id: 2, equipment: t('dashboard.energy.maint2.equipment'), risk: 64, nextService: '14일 후', status: 'warning', prediction: t('dashboard.energy.maint2.prediction'), xai: 'SHAP: 발전 효율 편차(55%), 온도 계수(25%), 운영 기간(20%)', halluCheck: { passed: true, confidence: 84, sources: 23 } },
    { id: 3, equipment: t('dashboard.energy.maint3.equipment'), risk: 52, nextService: '28일 후', status: 'warning', prediction: t('dashboard.energy.maint3.prediction'), xai: 'SHAP: 오일 온도(48%), 진동 스펙트럼(32%), 풍속 편차(20%)', halluCheck: { passed: false, confidence: 62, sources: 8 } },
  ], [t]);

  const energyKpis = useMemo(() => [
    { label: t('dashboard.energy.todayGen'), value: '142.8 kWh', change: '+18.3%' },
    { label: t('dashboard.energy.efficiency'), value: '87.3/100', change: '+2.1' },
    { label: t('dashboard.energy.forecastError'), value: '3.2%', change: '-1.8%' },
    { label: t('dashboard.energy.co2'), value: '156.7 t', change: '+23.5%' },
  ], [t]);

  const energyFeatureImportance = useMemo(() => [
    { f: t('dashboard.energy.feature.ghi'), v: 89 },
    { f: t('dashboard.energy.feature.pastGen'), v: 82 },
    { f: t('dashboard.energy.feature.clouds'), v: 76 },
    { f: t('dashboard.energy.feature.temperature'), v: 62 },
    { f: t('dashboard.energy.feature.windSpeed'), v: 45 },
    { f: t('dashboard.energy.feature.humidity'), v: 28 },
  ], [t]);

  const pipelineSteps = useMemo(() => [
    { s: 1, t: t('dashboard.energy.pipeline1.title'), d: t('dashboard.energy.pipeline1.desc') },
    { s: 2, t: t('dashboard.energy.pipeline2.title'), d: t('dashboard.energy.pipeline2.desc') },
    { s: 3, t: t('dashboard.energy.pipeline3.title'), d: t('dashboard.energy.pipeline3.desc') },
    { s: 4, t: t('dashboard.energy.pipeline4.title'), d: t('dashboard.energy.pipeline4.desc') },
    { s: 5, t: t('dashboard.energy.pipeline5.title'), d: t('dashboard.energy.pipeline5.desc') },
  ], [t]);

  const hallu3Steps = useMemo(() => [
    { l: 'L1: Source Grounding', d: t('dashboard.energy.l1.desc'), m: t('dashboard.energy.l1.metric') },
    { l: 'L2: Cross-Validation', d: t('dashboard.energy.l2.desc'), m: t('dashboard.energy.l2.metric') },
    { l: 'L3: Confidence Scoring', d: t('dashboard.energy.l3.desc'), m: t('dashboard.energy.l3.metric') },
  ], [t]);

  const securityDesignItems = useMemo(() => [
    { t: 'Federated Learning', d: t('dashboard.energy.federated.desc') },
    { t: 'Edge Computing', d: t('dashboard.energy.edge.desc') },
    { t: 'Blockchain', d: t('dashboard.energy.blockchain.desc') },
  ], [t]);

  return (
    <div className="space-y-6">
      {/* Energy Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI sLLM Energy</h2>
            <p className="text-xs text-emerald-400 font-medium">NanoGrid-AI · Cyber Security Focus</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('dashboard.energy.edgeRunning')}
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">Dhaka Pilot</Badge>
        </div>
      </div>

      {/* Energy Tabs */}
      <Tabs value={enTab} onValueChange={setEnTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-1.5"><Activity className="w-3.5 h-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="forecast" className="gap-1.5"><Zap className="w-3.5 h-3.5" /> {t('dashboard.energy.supplyForecast')}</TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-1.5"><Wrench className="w-3.5 h-3.5" /> {t('dashboard.energy.maintenance')}</TabsTrigger>
          <TabsTrigger value="xai" className="gap-1.5"><Eye className="w-3.5 h-3.5" /> Explainable AI</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {energyKpis.map(({ label, value, change }) => (
              <Card key={label} className="border-emerald-500/10 bg-emerald-500/[0.02]">
                <CardContent className="pt-5 pb-4">
                  <p className="text-xs text-muted-foreground mb-2">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />{change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('dashboard.energy.behaviorTitle')}</CardTitle>
                <p className="text-xs text-muted-foreground">{t('dashboard.energy.behaviorDesc')}</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={behaviorData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="l" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="l" type="monotone" dataKey="hvac" stroke="#ef4444" fill="rgba(239,68,68,0.1)" name="HVAC" />
                    <Bar yAxisId="l" dataKey="appliances" fill="#3b82f6" opacity={0.7} name={t('dashboard.energy.appliance')} />
                    <Bar yAxisId="l" dataKey="ev" fill="#8b5cf6" opacity={0.7} name="EV" />
                    <Line yAxisId="r" type="monotone" dataKey="occupancy" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name={t('dashboard.energy.occupancy')} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('dashboard.energy.sourceTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={energySourceMix} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                      {energySourceMix.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {energySourceMix.map(({ name, value, color }) => (
                    <div key={name} className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {name}
                      </span>
                      <span className="font-medium">{value}%</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20">
                  <p className="text-xs text-emerald-400 font-medium">{t('dashboard.energy.selfSupply')}</p>
                  <p className="text-xl font-bold">75%</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forecast */}
        <TabsContent value="forecast" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" /> {t('dashboard.energy.forecastTitle')}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{t('dashboard.energy.forecastDesc')}</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={renewableForecastData}>
                  <defs>
                    <linearGradient id="enConf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="upper" stroke="none" fill="url(#enConf)" name={t('dashboard.energy.confidenceInterval')} />
                  <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} dot={false} name={t('dashboard.energy.aiPrediction')} />
                  <Line type="monotone" dataKey="actual" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} name={t('dashboard.energy.actual')} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('dashboard.energy.errorCompare')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={forecastErrorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="method" stroke="hsl(var(--muted-foreground))" fontSize={11} width={85} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="mae" fill="#10b981" name="MAE%" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="rmse" fill="#3b82f6" name="RMSE%" opacity={0.6} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xs text-muted-foreground mt-2">{t('dashboard.energy.errorReduction')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('dashboard.energy.factors')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {energyFeatureImportance.map(({ f, v }) => (
                  <div key={f}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{f}</span>
                      <span className="text-emerald-400 font-mono">{v}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.energy.maintTitle')}</CardTitle>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/[0.04] border border-yellow-500/20 mt-2">
                <Shield className="w-4 h-4 text-yellow-400 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  <span className="text-yellow-400 font-medium">{t('dashboard.energy.halluPrevention')}:</span> {t('dashboard.energy.halluPreventionDesc')}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {maintenancePredictions.map(m => (
                <motion.div
                  key={m.id}
                  onClick={() => setExpandedMaint(expandedMaint === m.id ? null : m.id)}
                  className={cn(
                    "rounded-lg border p-4 cursor-pointer transition-colors",
                    m.status === 'critical'
                      ? "border-red-500/30 bg-red-500/[0.03] hover:bg-red-500/[0.06]"
                      : "border-yellow-500/30 bg-yellow-500/[0.03] hover:bg-yellow-500/[0.06]"
                  )}
                  layout
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{m.equipment}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.prediction}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">{t('dashboard.energy.nextService')}: {m.nextService}</p>
                    </div>
                    <Badge className={cn(
                      "ml-3 font-mono",
                      m.risk >= 80 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                      m.risk >= 50 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-green-500/20 text-green-400 border-green-500/30"
                    )}>
                      {t('dashboard.energy.riskLevel')} {m.risk}%
                    </Badge>
                  </div>
                  <AnimatePresence>
                    {expandedMaint === m.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Eye className="w-4 h-4 text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-400">{t('dashboard.energy.xaiBasis')}</span>
                            </div>
                            <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg leading-relaxed">{m.xai}</p>
                          </div>
                          <div className={cn(
                            "p-3 rounded-lg border",
                            m.halluCheck.passed
                              ? "bg-emerald-500/[0.03] border-emerald-500/20"
                              : "bg-red-500/[0.03] border-red-500/20"
                          )}>
                            <div className="flex justify-between items-center mb-1">
                              <span className={cn("text-xs font-medium flex items-center gap-1.5", m.halluCheck.passed ? "text-emerald-400" : "text-red-400")}>
                                <Shield className="w-3 h-3" /> {t('dashboard.energy.halluVerify')}: {m.halluCheck.passed ? 'PASSED' : 'WARNING'}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{t('dashboard.energy.confidence')}: {m.halluCheck.confidence}% · {t('dashboard.energy.sources')}: {m.halluCheck.sources}건</span>
                            </div>
                            {!m.halluCheck.passed && <p className="text-xs text-red-400 mt-1">⚠ {t('dashboard.energy.sensorWarning')}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* XAI */}
        <TabsContent value="xai" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" /> {t('dashboard.energy.xaiTitle')}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{t('dashboard.energy.xaiDesc')}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AI Decision Pipeline */}
                <div>
                  <h4 className="text-sm font-medium mb-4">{t('dashboard.energy.pipelineTitle')}</h4>
                  <div className="space-y-4">
                    {pipelineSteps.map(({ s, t: title, d }) => (
                      <div key={s} className="flex gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">{s}</div>
                        <div>
                          <p className="text-sm font-medium">{title}</p>
                          <p className="text-xs text-muted-foreground">{d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Anti-Hallucination */}
                <div>
                  <h4 className="text-sm font-medium mb-4">{t('dashboard.energy.hallu3Steps')}</h4>
                  <div className="space-y-2">
                    {hallu3Steps.map(({ l, d, m }) => (
                      <div key={l} className="bg-muted/40 rounded-lg p-3">
                        <p className="text-xs font-medium text-yellow-400 mb-1">{l}</p>
                        <p className="text-xs text-muted-foreground">{d}</p>
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-1">{m}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Security-by-Design</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {securityDesignItems.map(({ t: title, d }) => (
                        <p key={title}><span className="text-emerald-400 font-medium">{title}:</span>{' '}<span className="text-muted-foreground">{d}</span></p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// =============================================
// Architecture Section
// =============================================
function ArchitectureSection() {
  const { t } = useI18n();

  const archItems = useMemo(() => [
    { icon: Lock, title: 'Federated Learning', desc: t('dashboard.arch.federated.desc'), color: 'text-blue-400' },
    { icon: Cpu, title: 'Edge Computing', desc: t('dashboard.arch.edge.desc'), color: 'text-emerald-400' },
    { icon: Brain, title: 'sLLM-RAG', desc: t('dashboard.arch.sllmRag.desc'), color: 'text-purple-400' },
    { icon: Eye, title: 'Explainable AI', desc: t('dashboard.arch.xai.desc'), color: 'text-yellow-400' },
  ], [t]);

  return (
    <Card className="border-dashed">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-base">{t('dashboard.arch.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {archItems.map(({ icon: Icon, title, desc, color }) => (
            <div key={title}>
              <div className={cn("w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-3", color)}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium mb-1">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================
// Main Dashboard
// =============================================
export default function Dashboard() {
  const { t } = useI18n();
  const { assessments, isLoading, riskSummary } = useRiskAssessment();
  const [dashMetrics, setDashMetrics] = useState(() => createMockDashboardMetrics(t));
  const [complianceReports, setComplianceReports] = useState(() => createMockComplianceReports(t));
  const [activeSection, setActiveSection] = useState<'governance' | 'finance' | 'energy'>('governance');

  useEffect(() => {
    dashboardAPI.getOverview().then(res => {
      if (res.data?.metrics) setDashMetrics(res.data.metrics);
      if (res.data?.recentCompliance) {
        const mapped = res.data.recentCompliance.map((r: any) => ({
          id: r.id, title: r.title, standard: r.standard,
          status: r.status, completionDate: r.completion_date || '-',
          score: r.score, findings: r.findings,
        }));
        setComplianceReports(mapped);
      }
    }).catch(() => { /* silent fallback to mock */ });
  }, []);

  const recentAssessments = assessments.slice(0, 3);
  const recentReports = complianceReports.slice(0, 3);

  const domainSelectors = useMemo(() => [
    {
      key: 'governance' as const,
      title: t('dashboard.section.governance'),
      desc: t('dashboard.section.governance.desc'),
      icon: ShieldCheck,
      gradient: 'from-primary to-primary/80',
      borderActive: 'border-primary/50 bg-primary/[0.04]',
    },
    {
      key: 'finance' as const,
      title: 'Finance',
      desc: t('dashboard.section.finance.desc'),
      icon: DollarSign,
      gradient: 'from-blue-500 to-cyan-500',
      borderActive: 'border-blue-500/50 bg-blue-500/[0.04]',
    },
    {
      key: 'energy' as const,
      title: 'Energy',
      desc: t('dashboard.section.energy.desc'),
      icon: Zap,
      gradient: 'from-emerald-500 to-teal-500',
      borderActive: 'border-emerald-500/50 bg-emerald-500/[0.04]',
    },
  ], [t]);

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.header.title')}</h1>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                AI Sentinel sLLM
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.header.desc')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden sm:flex">
              <FileText className="mr-2 h-4 w-4" />
              {t('dashboard.export')}
            </Button>
            <Link to={ROUTE_PATHS.RISK_ASSESSMENT}>
              <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" />
                {t('dashboard.newAssessment')}
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Domain Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.gentle, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {domainSelectors.map(({ key, title, desc, icon: Icon, gradient, borderActive }) => (
            <motion.button
              key={key}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(key)}
              className={cn(
                "relative text-left p-5 rounded-xl border-2 transition-all duration-200 overflow-hidden",
                activeSection === key ? borderActive : "border-border hover:border-border/80"
              )}
            >
              {activeSection === key && (
                <motion.div
                  layoutId="domain-indicator"
                  className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", gradient)}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  activeSection === key
                    ? `bg-gradient-to-br ${gradient} text-white shadow-lg`
                    : "bg-muted text-muted-foreground"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Active Section Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'governance' && (
            <motion.div
              key="governance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springPresets.gentle}
            >
              {/* Governance Metrics */}
              <div className="space-y-8">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {dashMetrics.map((metric, index) => (
                    <motion.div key={index} variants={staggerItem}>
                      <MetricCard
                        title={metric.title}
                        value={metric.value}
                        change={metric.change}
                        trend={metric.trend === 'neutral' ? 'up' : metric.trend}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  {/* Left Column: Risk Assessments */}
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="xl:col-span-2 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-chart-2/10 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-chart-2" />
                        </div>
                        <h2 className="text-xl font-semibold">{t('dashboard.recentRisk')}</h2>
                      </div>
                      <Link
                        to={ROUTE_PATHS.RISK_ASSESSMENT}
                        className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
                      >
                        {t('dashboard.viewAll')} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="space-y-4">
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <div key={i} className="h-32 w-full bg-muted animate-pulse rounded-xl border border-border" />
                        ))
                      ) : (
                        recentAssessments.map((risk) => (
                          <RiskCard key={risk.id} risk={risk} />
                        ))
                      )}
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t('dashboard.unacceptableLevel')}</p>
                        <p className="text-2xl font-bold text-chart-1">{riskSummary.unacceptable}</p>
                      </div>
                      <div className="h-10 w-px bg-border hidden md:block" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t('dashboard.highRiskSystems')}</p>
                        <p className="text-2xl font-bold text-chart-2">{riskSummary.high}</p>
                      </div>
                      <div className="h-10 w-px bg-border hidden md:block" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">{t('dashboard.reviewRate')}</p>
                        <p className="text-2xl font-bold text-chart-4">
                          {riskSummary.total > 0 ? Math.round((riskSummary.completed / riskSummary.total) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column: Compliance & Process */}
                  <div className="space-y-8">
                    <motion.section
                      variants={fadeInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-chart-4/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-chart-4" />
                          </div>
                          <h2 className="text-xl font-semibold">{t('dashboard.complianceStatus')}</h2>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {recentReports.map((report) => (
                          <ComplianceCard key={report.id} report={report} />
                        ))}
                      </div>
                      <Link to={ROUTE_PATHS.COMPLIANCE}>
                        <Button variant="ghost" className="w-full mt-2 text-muted-foreground hover:text-primary">
                          {t('dashboard.moreReports')}
                        </Button>
                      </Link>
                    </motion.section>

                    <motion.section
                      variants={fadeInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        {t('dashboard.governanceWorkflow')}
                      </h2>
                      <div className="grid grid-cols-1 gap-4">
                        <ProcessCard
                          title={t('dashboard.workflow.newService')}
                          description={t('dashboard.workflow.newService.desc')}
                          status={t('dashboard.workflow.newService.status')}
                          icon={<LayoutDashboard className="h-5 w-5" />}
                        />
                        <ProcessCard
                          title={t('dashboard.workflow.periodicRisk')}
                          description={t('dashboard.workflow.periodicRisk.desc')}
                          status={t('dashboard.workflow.periodicRisk.status')}
                          icon={<AlertTriangle className="h-5 w-5" />}
                        />
                        <ProcessCard
                          title={t('dashboard.workflow.compliance')}
                          description={t('dashboard.workflow.compliance.desc')}
                          status={t('dashboard.workflow.compliance.status')}
                          icon={<ClipboardCheck className="h-5 w-5" />}
                        />
                      </div>
                    </motion.section>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'finance' && (
            <motion.div
              key="finance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springPresets.gentle}
            >
              <FinanceDashboard />
            </motion.div>
          )}

          {activeSection === 'energy' && (
            <motion.div
              key="energy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={springPresets.gentle}
            >
              <EnergyDashboard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Architecture Section (always visible) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <ArchitectureSection />
        </motion.div>
      </div>
    </Layout>
  );
}
