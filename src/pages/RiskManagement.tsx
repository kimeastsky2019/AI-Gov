import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertCircle,
  CheckCircle2,
  Plus,
  Zap,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Trash2,
  Edit,
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

interface RiskItem {
  id: string;
  title: string;
  description: string;
  level: "UNACCEPTABLE" | "HIGH" | "MEDIUM" | "LOW";
  status: "IDENTIFIED" | "ANALYZED" | "EVALUATED" | "MITIGATED";
  likelihood: number;
  impact: number;
  mitigation: string;
  dueDate: string;
  owner: string;
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

const RiskManagement: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [activeStep, setActiveStep] = useState(0);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const mockRisks = useMemo((): RiskItem[] => [
    {
      id: "RISK-001",
      title: t('gov.riskDetail.likelihood') || "학습 데이터의 대표성 부족",
      description: t('gov.riskDetail.representation') || "특정 인구 집단이 충분히 대표되지 않아 편향된 결과 초래 가능",
      level: "HIGH",
      status: "ANALYZED",
      likelihood: 8,
      impact: 9,
      mitigation: t('gov.riskMitigation.diversity') || "데이터 수집 단계에서 다양성 확보 및 정기적 편향성 검증",
      dueDate: "2026-04-15",
      owner: "데이터팀"
    },
    {
      id: "RISK-002",
      title: t('gov.riskDetail.explainability') || "모델의 설명가능성 부족",
      description: t('gov.riskDetail.explainabilityDesc') || "의사결정 과정이 불명확하여 규제 준수 곤란",
      level: "MEDIUM",
      status: "IDENTIFIED",
      likelihood: 6,
      impact: 8,
      mitigation: t('gov.riskMitigation.explainability') || "SHAP, LIME 등 설명가능성 도구 도입",
      dueDate: "2026-05-01",
      owner: "AI팀"
    },
    {
      id: "RISK-003",
      title: t('gov.riskDetail.dataLeakage') || "개인정보 유출 위험",
      description: t('gov.riskDetail.dataLeakageDesc') || "학습 데이터에서 민감한 개인정보 재식별 가능성",
      level: "UNACCEPTABLE",
      status: "EVALUATED",
      likelihood: 3,
      impact: 10,
      mitigation: t('gov.riskMitigation.privacy') || "차등 프라이버시 기법 적용, 접근 제어 강화",
      dueDate: "2026-03-31",
      owner: "보안팀"
    },
    {
      id: "RISK-004",
      title: t('gov.riskDetail.modelDegradation') || "모델 성능 저하",
      description: t('gov.riskDetail.modelDegradationDesc') || "배포 후 실제 환경에서 예측 성능 저하 관찰",
      level: "MEDIUM",
      status: "MITIGATED",
      likelihood: 7,
      impact: 6,
      mitigation: t('gov.riskMitigation.monitoring') || "모니터링 대시보드 구축, 자동 리트레이닝 프로세스",
      dueDate: "2026-03-20",
      owner: "ML옵스팀"
    },
    {
      id: "RISK-005",
      title: t('gov.riskDetail.fairness') || "공정성 요구사항 미충족",
      description: t('gov.riskDetail.fairnessDesc') || "특정 그룹에 대한 차별적 의사결정 가능성",
      level: "HIGH",
      status: "ANALYZED",
      likelihood: 5,
      impact: 9,
      mitigation: t('gov.riskMitigation.fairnessMetrics') || "공정성 메트릭 정의 및 정기적 모니터링",
      dueDate: "2026-04-30",
      owner: "거버넌스팀"
    }
  ], [t]);

  const filteredRisks = mockRisks.filter(risk => {
    const matchesSearch = risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         risk.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === "all" || risk.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const riskMetrics = {
    total: mockRisks.length,
    unacceptable: mockRisks.filter(r => r.level === "UNACCEPTABLE").length,
    high: mockRisks.filter(r => r.level === "HIGH").length,
    medium: mockRisks.filter(r => r.level === "MEDIUM").length,
    mitigated: mockRisks.filter(r => r.status === "MITIGATED").length,
  };

  const getStatusColor = (status: RiskItem['status']) => {
    const colors = {
      IDENTIFIED: "bg-blue-50 text-blue-700 border-blue-200",
      ANALYZED: "bg-purple-50 text-purple-700 border-purple-200",
      EVALUATED: "bg-amber-50 text-amber-700 border-amber-200",
      MITIGATED: "bg-green-50 text-green-700 border-green-200",
    };
    return colors[status];
  };

  const getRiskColor = (level: RiskItem['level']) => {
    const colors = {
      UNACCEPTABLE: "bg-red-500",
      HIGH: "bg-orange-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    };
    return colors[level];
  };

  const riskFramework = useMemo(() => [
    {
      step: 1,
      title: t('gov.riskFramework.step1') || "위험 인식 (Risk Identification)",
      subtitle: t('gov.riskFramework.step1Subtitle') || "잠재적 위험 요소 식별",
      description: t('gov.riskFramework.step1Desc') || "AI 서비스 기획 단계에서 가능한 위험을 체계적으로 파악합니다. TTA 요구사항 01의 첫 단계입니다.",
      checklist: [
        t('gov.riskFramework.step1Item1') || "AI 애플리케이션의 특성 파악 (용도, 대상층, 영향범위)",
        t('gov.riskFramework.step1Item2') || "규제 환경 분석 (금융/개인정보보호 등)",
        t('gov.riskFramework.step1Item3') || "기술적 위험 식별 (편향성, 견고성, 설명가능성)",
        t('gov.riskFramework.step1Item4') || "사회적 위험 식별 (공정성, 투명성, 책임성)",
      ]
    },
    {
      step: 2,
      title: t('gov.riskFramework.step2') || "위험 분석 (Risk Analysis)",
      subtitle: t('gov.riskFramework.step2Subtitle') || "위험도 정량화",
      description: t('gov.riskFramework.step2Desc') || "식별된 위험에 대해 발생 가능성(Likelihood)과 영향도(Impact)를 분석합니다.",
      checklist: [
        t('gov.riskFramework.step2Item1') || "발생 가능성 평가 (1-10)",
        t('gov.riskFramework.step2Item2') || "영향도 평가 (1-10)",
        t('gov.riskFramework.step2Item3') || "위험도 = 가능성 × 영향도 계산",
        t('gov.riskFramework.step2Item4') || "위험등급 결정 (허용불가/고위험/중위험/저위험)",
      ]
    },
    {
      step: 3,
      title: t('gov.riskFramework.step3') || "위험 평가 (Risk Evaluation)",
      subtitle: t('gov.riskFramework.step3Subtitle') || "수용 가능한 수준 판정",
      description: t('gov.riskFramework.step3Desc') || "조직의 위험 허용도(Risk Appetite)와 비교하여 수용 가능 여부를 평가합니다.",
      checklist: [
        t('gov.riskFramework.step3Item1') || "조직 위험 수용도 기준 설정",
        t('gov.riskFramework.step3Item2') || "위험 우선순위 결정",
        t('gov.riskFramework.step3Item3') || "거버넌스 위원회 검토",
        t('gov.riskFramework.step3Item4') || "최종 승인/거부 판정",
      ]
    },
    {
      step: 4,
      title: t('gov.riskFramework.step4') || "위험 대응 (Risk Response)",
      subtitle: t('gov.riskFramework.step4Subtitle') || "대응 전략 수립 및 실행",
      description: t('gov.riskFramework.step4Desc') || "수용 불가능한 위험에 대해 회피, 완화, 이전, 수용 등의 전략을 수립하고 실행합니다.",
      checklist: [
        t('gov.riskFramework.step4Item1') || "완화 조치 계획 (Mitigation Plan)",
        t('gov.riskFramework.step4Item2') || "책임자 및 일정 결정",
        t('gov.riskFramework.step4Item3') || "효과성 모니터링",
        t('gov.riskFramework.step4Item4') || "정기적 재평가 및 개선",
      ]
    },
  ], [t]);

  const wizardSteps = useMemo(() => [
    {
      title: t('gov.riskWizard.step1') || "1단계: 기본 정보",
      description: t('gov.riskWizard.step1Desc') || "위험 항목의 기본 정보를 입력하세요"
    },
    {
      title: t('gov.riskWizard.step2') || "2단계: 위험도 평가",
      description: t('gov.riskWizard.step2Desc') || "발생 가능성과 영향도를 평가하세요"
    },
    {
      title: t('gov.riskWizard.step3') || "3단계: 완화 전략",
      description: t('gov.riskWizard.step3Desc') || "위험 대응 방안을 수립하세요"
    },
    {
      title: t('gov.riskWizard.step4') || "4단계: 검토",
      description: t('gov.riskWizard.step4Desc') || "입력 정보를 검토하고 제출하세요"
    }
  ], [t]);

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
              {t('governance.risk.title') || 'AI 위험 관리'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('governance.risk.subtitle') || 'ISO 31000 기반 위험 관리 프레임워크로 AI 서비스의 위험을 체계적으로 관리하세요'}
            </p>
          </div>
        </motion.div>

        {/* Metrics */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.totalRisks') || '전체 위험'}
              value={riskMetrics.total}
              change={"+2"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.unacceptable') || '허용불가'}
              value={riskMetrics.unacceptable}
              change={"+0"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.high') || '고위험'}
              value={riskMetrics.high}
              change={"-1"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.medium') || '중위험'}
              value={riskMetrics.medium}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.mitigated') || '완화됨'}
              value={riskMetrics.mitigated}
              change={"+1"}
              trend="up"
            />
          </motion.div>
        </motion.div>

        {/* Risk Framework Overview */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                ISO 31000 위험 관리 프레임워크
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {riskFramework.map((item, idx) => (
                  <motion.div
                    key={item.step}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5 hover:border-primary/60 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                          {item.step}
                        </div>
                        <h4 className="font-semibold text-sm">{item.title}</h4>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                      {idx < 3 && (
                        <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2">
                          <ChevronRight className="w-5 h-5 text-primary/40" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Framework Steps */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          {riskFramework.map((framework, idx) => (
            <motion.div key={framework.step} variants={staggerItem} className="mb-6">
              <Card>
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-white text-lg font-bold">
                        {framework.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle>{framework.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{framework.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">체크리스트:</h4>
                    <ul className="space-y-2">
                      {framework.checklist.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Risk Register */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  위험 등록부 (Risk Register)
                </CardTitle>
                <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      {t('gov.riskRegister.addNew')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{t('gov.riskWizard.title')}</DialogTitle>
                      <DialogDescription>
                        {t('gov.riskWizard.description')}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      {/* Wizard Steps */}
                      <div className="space-y-4">
                        {wizardSteps.map((step, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "p-4 rounded-lg border-2 cursor-pointer transition-all",
                              activeStep === idx
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            )}
                            onClick={() => setActiveStep(idx)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                                activeStep === idx
                                  ? "bg-primary text-white"
                                  : "bg-muted text-muted-foreground"
                              )}>
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm">{step.title}</p>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1">{t('gov.riskWizard.cancel')}</Button>
                        <Button className="flex-1">{t('gov.riskWizard.submit')}</Button>
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
                    placeholder={t('gov.riskTable.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterLevel === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterLevel("all")}
                  >
                    {t('gov.riskTable.all')}
                  </Button>
                  <Button
                    variant={filterLevel === "UNACCEPTABLE" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterLevel("UNACCEPTABLE")}
                    className="text-red-600"
                  >
                    {t('gov.riskTable.unacceptable')}
                  </Button>
                  <Button
                    variant={filterLevel === "HIGH" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterLevel("HIGH")}
                  >
                    {t('gov.riskTable.high')}
                  </Button>
                </div>
              </div>

              {/* Risk Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.id')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.title')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.level')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.likelihood')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.impact')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.status')}</th>
                      <th className="text-left py-3 px-2 font-semibold">{t('gov.riskTable.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredRisks.map((risk) => (
                        <motion.tr
                          key={risk.id}
                          className="border-b hover:bg-muted/30 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{risk.id}</td>
                          <td className="py-3 px-2">
                            <div>
                              <p className="font-medium">{risk.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{risk.description}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge className={cn(
                              "text-white",
                              risk.level === "UNACCEPTABLE" && "bg-red-500",
                              risk.level === "HIGH" && "bg-orange-500",
                              risk.level === "MEDIUM" && "bg-yellow-500",
                              risk.level === "LOW" && "bg-green-500"
                            )}>
                              {risk.level}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${risk.likelihood * 10}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold">{risk.likelihood}/10</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${risk.impact * 10}%` }}
                                />
                              </div>
                              <span className="text-xs font-semibold">{risk.impact}/10</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className={cn(
                              "text-xs border",
                              getStatusColor(risk.status)
                            )}>
                              {risk.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Eye className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reference Information */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.riskInfo.tta01')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  {t('gov.riskInfo.tta01Desc')}
                </p>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-start gap-2">
                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>{t('gov.riskInfo.tta01Item1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>{t('gov.riskInfo.tta01Item2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>{t('gov.riskInfo.tta01Item3')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-purple-50/50 to-purple-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.riskInfo.classification')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getRiskColor("UNACCEPTABLE"))} />
                    <span>{t('gov.riskInfo.classificationUnacceptable')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getRiskColor("HIGH"))} />
                    <span>{t('gov.riskInfo.classificationHigh')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getRiskColor("MEDIUM"))} />
                    <span>{t('gov.riskInfo.classificationMedium')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", getRiskColor("LOW"))} />
                    <span>{t('gov.riskInfo.classificationLow')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="bg-gradient-to-br from-amber-50/50 to-amber-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t('gov.riskInfo.metrics')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">{t('gov.riskInfo.metricsLikelihood')}</p>
                    <p className="text-muted-foreground">{t('gov.riskInfo.metricsLikelihoodDesc')}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 mb-1">{t('gov.riskInfo.metricsImpact')}</p>
                    <p className="text-muted-foreground">{t('gov.riskInfo.metricsImpactDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default RiskManagement;
