import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  TrendingUp,
  BarChart3
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

interface AIService {
  id: string;
  name: string;
  category: string;
  riskLevel: "UNACCEPTABLE" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED" | "IN_DEVELOPMENT";
  createdDate: string;
  lastAuditDate: string;
  complianceScore: number;
  owner: string;
  dataSource: string;
  impactArea: string;
}

interface FinanceAIService {
  id: string;
  name: string;
  description: string;
  complianceItems: number;
  completedItems: number;
  checklist: string[];
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

const AIServiceManagement: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mockServices = useMemo((): AIService[] => [
    {
      id: "SVC-001",
      name: t('gov.service.creditRisk') || "신용 위험도 평가 AI",
      category: t('gov.service.creditRiskCategory') || "신용평가",
      riskLevel: "HIGH",
      status: "ACTIVE",
      createdDate: "2024-01-15",
      lastAuditDate: "2026-02-28",
      complianceScore: 92,
      owner: t('gov.service.creditRiskOwner') || "금융팀",
      dataSource: t('gov.service.creditRiskDataSource') || "고객 신용정보",
      impactArea: t('gov.service.creditRiskImpact') || "금융거래"
    },
    {
      id: "SVC-002",
      name: t('gov.service.fraudDetection') || "부정거래 탐지 시스템",
      category: t('gov.service.fraudDetectionCategory') || "사기탐지",
      riskLevel: "MEDIUM",
      status: "ACTIVE",
      createdDate: "2023-08-20",
      lastAuditDate: "2026-03-05",
      complianceScore: 88,
      owner: t('gov.service.fraudDetectionOwner') || "보안팀",
      dataSource: t('gov.service.fraudDetectionDataSource') || "거래 데이터",
      impactArea: t('gov.service.fraudDetectionImpact') || "거래감시"
    },
    {
      id: "SVC-003",
      name: t('gov.service.churn') || "고객 이탈 예측 모델",
      category: t('gov.service.churnCategory') || "고객분석",
      riskLevel: "LOW",
      status: "ACTIVE",
      createdDate: "2024-06-10",
      lastAuditDate: "2026-01-15",
      complianceScore: 85,
      owner: t('gov.service.churnOwner') || "마케팅팀",
      dataSource: t('gov.service.churnDataSource') || "거래이력",
      impactArea: t('gov.service.churnImpact') || "마케팅"
    },
    {
      id: "SVC-004",
      name: t('gov.service.assetMgmt') || "자산운용 추천 알고리즘",
      category: t('gov.service.assetMgmtCategory') || "자산운용",
      riskLevel: "HIGH",
      status: "IN_DEVELOPMENT",
      createdDate: "2025-11-01",
      lastAuditDate: "2026-02-20",
      complianceScore: 76,
      owner: t('gov.service.assetMgmtOwner') || "운용팀",
      dataSource: t('gov.service.assetMgmtDataSource') || "시장데이터",
      impactArea: t('gov.service.assetMgmtImpact') || "투자조언"
    },
    {
      id: "SVC-005",
      name: t('gov.service.hrEval') || "직원 성과 평가 AI",
      category: t('gov.service.hrEvalCategory') || "인사관리",
      riskLevel: "MEDIUM",
      status: "ACTIVE",
      createdDate: "2024-03-15",
      lastAuditDate: "2026-02-10",
      complianceScore: 81,
      owner: t('gov.service.hrEvalOwner') || "인사팀",
      dataSource: t('gov.service.hrEvalDataSource') || "직원정보",
      impactArea: t('gov.service.hrEvalImpact') || "인사관리"
    }
  ], [t]);

  const financeAIServices = useMemo(() => [
    {
      id: "FIN-001",
      name: t('gov.finance.service1') || "1. 신용평가 AI",
      description: t('gov.finance.service1Desc') || "개인/기업 신용도를 평가하는 AI 시스템",
      complianceItems: 8,
      completedItems: 7,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-002",
      name: t('gov.finance.service2') || "2. 거래 감시 AI",
      description: t('gov.finance.service2Desc') || "부정거래 탐지 및 돈세탁 감시 시스템",
      complianceItems: 8,
      completedItems: 8,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-003",
      name: t('gov.finance.service3') || "3. 투자조언 AI",
      description: t('gov.finance.service3Desc') || "고객 맞춤형 투자상품 추천 시스템",
      complianceItems: 8,
      completedItems: 6,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-004",
      name: t('gov.finance.service4') || "4. 고객분류 AI",
      description: t('gov.finance.service4Desc') || "고객 세분화 및 위험도 분류 시스템",
      complianceItems: 8,
      completedItems: 7,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    },
    {
      id: "FIN-005",
      name: t('gov.finance.service5') || "5. 위험도 평가 AI",
      description: t('gov.finance.service5Desc') || "포트폴리오 및 상품 위험도 평가 시스템",
      complianceItems: 8,
      completedItems: 5,
      checklist: [
        t('gov.finance.checklist.explainability') || "설명가능성 검증",
        t('gov.finance.checklist.bias') || "편향성 검사",
        t('gov.finance.checklist.dataQuality') || "데이터 품질 관리",
        t('gov.finance.checklist.monitoring') || "모니터링 체계",
        t('gov.finance.checklist.privacy') || "개인정보보호 준수",
        t('gov.finance.checklist.surveillance') || "감시 및 감독",
        t('gov.finance.checklist.userRights') || "이용자 권리 보호",
        t('gov.finance.checklist.changeLog') || "변경이력 관리"
      ]
    }
  ], [t]);

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === "all" || service.riskLevel === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getRiskColor = (level: AIService['riskLevel']) => {
    const colors = {
      UNACCEPTABLE: "bg-red-500",
      HIGH: "bg-orange-500",
      MEDIUM: "bg-yellow-500",
      LOW: "bg-green-500",
    };
    return colors[level];
  };

  const getStatusBadgeColor = (status: AIService['status']) => {
    const colors = {
      ACTIVE: "bg-green-50 text-green-700 border-green-200",
      INACTIVE: "bg-gray-50 text-gray-700 border-gray-200",
      DEPRECATED: "bg-red-50 text-red-700 border-red-200",
      IN_DEVELOPMENT: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return colors[status];
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
              {t('governance.services.title') || 'AI 서비스 관리'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('governance.services.subtitle') || '조직의 모든 AI 서비스를 일관되게 관리하고 금융 5대 AI 체크리스트 준수'}
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
              title={t('governance.metric.totalServices') || '총 서비스'}
              value={mockServices.length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.activeServices') || '운영 중'}
              value={mockServices.filter(s => s.status === "ACTIVE").length}
              change={"+0"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.avgCompliance') || '평균 준수율'}
              value="85%"
              change={"+3%"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.highRisk') || '고위험 서비스'}
              value={mockServices.filter(s => s.riskLevel === "HIGH").length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="w-full space-y-6">
          <TabsList className="bg-transparent gap-6 border-b pb-0 h-auto w-full justify-start rounded-none">
            <TabsTrigger
              value="services"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <Cpu className="w-4 h-4 mr-2" />
              {t('gov.serviceTab.title')}
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              {t('gov.financeTab.title')}
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.serviceRegistry.title')}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('gov.serviceRegistry.addNew')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{t('gov.serviceRegistry.addNew')}</DialogTitle>
                        <DialogDescription>
                          {t('gov.serviceRegistry.addNewDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">서비스명</label>
                          <Input placeholder="서비스 이름을 입력하세요" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">카테고리</label>
                          <Input placeholder="예: 신용평가, 사기탐지, 거래감시" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">담당팀</label>
                          <Input placeholder="담당 팀을 입력하세요" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">데이터 소스</label>
                          <Input placeholder="학습 데이터 소스를 설명하세요" />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">취소</Button>
                          <Button className="flex-1">등록</Button>
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
                      placeholder="서비스명 또는 ID로 검색..."
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
                      전체
                    </Button>
                    <Button
                      variant={filterLevel === "HIGH" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("HIGH")}
                    >
                      고위험
                    </Button>
                    <Button
                      variant={filterLevel === "MEDIUM" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("MEDIUM")}
                    >
                      중위험
                    </Button>
                  </div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{service.name}</h4>
                              <Badge variant="outline" className="font-mono text-xs">
                                {service.id}
                              </Badge>
                              <Badge className={cn(
                                "text-white",
                                getRiskColor(service.riskLevel)
                              )}>
                                {service.riskLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{service.category}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                          <div>
                            <p className="text-muted-foreground mb-1">상태</p>
                            <Badge variant="outline" className={cn(
                              "text-xs border",
                              getStatusBadgeColor(service.status)
                            )}>
                              {service.status === "ACTIVE" && "운영 중"}
                              {service.status === "INACTIVE" && "비활성"}
                              {service.status === "DEPRECATED" && "폐기됨"}
                              {service.status === "IN_DEVELOPMENT" && "개발 중"}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">담당팀</p>
                            <p className="font-medium">{service.owner}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">생성일</p>
                            <p className="font-medium">{service.createdDate}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">마지막 감사</p>
                            <p className="font-medium">{service.lastAuditDate}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-medium">준수율</span>
                              <span className="font-bold">{service.complianceScore}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                className={cn(
                                  "h-full rounded-full",
                                  service.complianceScore >= 85 && "bg-green-500",
                                  service.complianceScore >= 70 && service.complianceScore < 85 && "bg-yellow-500",
                                  service.complianceScore < 70 && "bg-red-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${service.complianceScore}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                          <div className="text-xs">
                            <p className="text-muted-foreground mb-1">영향 범위</p>
                            <p className="font-medium">{service.impactArea}</p>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">데이터 소스:</span> {service.dataSource}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance AI Tab */}
          <TabsContent value="finance" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {financeAIServices.map((finService, idx) => {
                const completionPercent = Math.round((finService.completedItems / finService.complianceItems) * 100);
                return (
                  <motion.div
                    key={finService.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="border-b">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{finService.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">{finService.description}</p>
                          </div>
                          <Badge className={cn(
                            "text-white",
                            completionPercent === 100 && "bg-green-500",
                            completionPercent >= 75 && completionPercent < 100 && "bg-blue-500",
                            completionPercent >= 50 && completionPercent < 75 && "bg-yellow-500",
                            completionPercent < 50 && "bg-red-500"
                          )}>
                            {completionPercent}%
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="mb-6">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium">체크리스트 진행률</span>
                            <span className="text-muted-foreground">
                              {finService.completedItems} / {finService.complianceItems}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                            <motion.div
                              className="h-full bg-primary rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${completionPercent}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm mb-3">필수 점검 항목</h4>
                          {finService.checklist.map((item, i) => {
                            const isCompleted = i < finService.completedItems;
                            return (
                              <motion.div
                                key={i}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.05 }}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                                )}
                                <span className={cn(
                                  "text-sm",
                                  isCompleted && "text-muted-foreground line-through"
                                )}>
                                  {item}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/30 border-t">
                        <Button variant="outline" className="w-full gap-2">
                          <BarChart3 className="w-4 h-4" />
                          상세 점검 보고서 보기
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Finance AI Info Card */}
            <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20 border-blue-200/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">금융분야 AI 안내서</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  금융감독청의 AI 리스크 관리 권고사항에 따른 5대 금융 AI 서비스별 필수 체크리스트
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>신용평가, 거래감시, 투자조언, 고객분류, 위험도평가</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>각 서비스별 8가지 필수 체크리스트 점검</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>정기적 재평가 및 모니터링 체계 구축</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Service Lifecycle */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                AI 서비스 생애주기 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { phase: "1. 기획", desc: "서비스 개념 정의 및 위험 식별", icon: "📋" },
                  { phase: "2. 개발", desc: "모델 개발 및 기술 검증", icon: "🛠️" },
                  { phase: "3. 검증", desc: "거버넌스 검토 및 승인", icon: "✓" },
                  { phase: "4. 배포", desc: "운영 환경 배포 및 모니터링", icon: "🚀" },
                  { phase: "5. 운영", desc: "정기 감시 및 재평가", icon: "📊" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-semibold text-sm">{item.phase}</h4>
                    <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default AIServiceManagement;
