import React, { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Settings,
  Lock,
  Key,
  Zap,
  AlertCircle
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";
import { useI18n } from "@/lib/i18n";

interface Vulnerability {
  id: string;
  name: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  status: 'fixed' | 'mitigated' | 'open';
  discoveryDate: string;
  description: string;
}

interface AdversarialTest {
  testId: string;
  attackType: string;
  successRate: number;
  robustness: number;
  mitigationStatus: string;
}

interface AccessControlAudit {
  system: string;
  totalAccounts: number;
  authorizedAccess: number;
  unauthorizedAttempts: number;
  complianceRate: number;
  lastAudit: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  target: number;
  description: string;
  status: 'compliant' | 'warning' | 'critical';
}

const SecurityReview = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("vulnerabilities");

  // TTA 요구사항 07 및 금융 AI 라-3 기반 체크리스트
  const securityChecklist = useMemo(() => [
    {
      id: "tta07-sec-01",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.paramProtect'),
      completed: true,
      description: t('tech.security.checklist.desc.paramProtect')
    },
    {
      id: "tta07-sec-02",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.encryption'),
      completed: true,
      description: t('tech.security.checklist.desc.encryption')
    },
    {
      id: "tta07-sec-03",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.integrity'),
      completed: true,
      description: t('tech.security.checklist.desc.integrity')
    },
    {
      id: "tta07-sec-04",
      category: t('tech.security.checklist.category.protection'),
      item: t('tech.security.checklist.item.reverseEng'),
      completed: false,
      description: t('tech.security.checklist.desc.reverseEng')
    },
    {
      id: "finance-ra3-01",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.accessControl'),
      completed: true,
      description: t('tech.security.checklist.desc.accessControl')
    },
    {
      id: "finance-ra3-02",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.logging'),
      completed: true,
      description: t('tech.security.checklist.desc.logging')
    },
    {
      id: "finance-ra3-03",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.adversarial'),
      completed: true,
      description: t('tech.security.checklist.desc.adversarial')
    },
    {
      id: "finance-ra3-04",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.audit'),
      completed: true,
      description: t('tech.security.checklist.desc.audit')
    },
    {
      id: "finance-ra3-05",
      category: t('tech.security.checklist.category.system'),
      item: t('tech.security.checklist.item.incident'),
      completed: true,
      description: t('tech.security.checklist.desc.incident')
    },
  ], [t]);

  // 보안 취약점
  const vulnerabilities = useMemo((): Vulnerability[] => [
    {
      id: "CVE-2024-001",
      name: "모델 파라미터 추출 가능성",
      severity: 'high',
      category: "역공학 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-15",
      description: "쿼리 기반 공격으로 모델 파라미터 부분 추출 가능성 발견 및 완화됨"
    },
    {
      id: "CVE-2024-002",
      name: "멤버십 추론 공격 취약점",
      severity: 'medium',
      category: "프라이버시 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-20",
      description: "학습 데이터 포함 여부 추론 가능 - 차등 프라이버시 기법으로 완화"
    },
    {
      id: "CVE-2024-003",
      name: "데이터 중독 공격 위험",
      severity: 'high',
      category: "데이터 공격",
      status: 'mitigated',
      discoveryDate: "2024-02-10",
      description: "학습 데이터 조작을 통한 모델 왜곡 공격 가능성 - 입력 검증 강화"
    },
    {
      id: "CVE-2024-004",
      name: "API 엔드포인트 인증 부족",
      severity: 'critical',
      category: "접근 제어",
      status: 'fixed',
      discoveryDate: "2024-01-30",
      description: "API 인증 메커니즘 개선으로 해결됨"
    },
    {
      id: "CVE-2024-005",
      name: "적대적 입력에 대한 취약성",
      severity: 'medium',
      category: "견고성 공격",
      status: 'mitigated',
      discoveryDate: "2024-03-01",
      description: "적대적 예제 공격에 대한 방어 강화 중"
    },
  ], []);

  // 적대적 공격 테스트 결과
  const adversarialTests = useMemo((): AdversarialTest[] => [
    {
      testId: "ADV-001",
      attackType: "FGSM (Fast Gradient Sign Method)",
      successRate: 0.15,
      robustness: 0.85,
      mitigationStatus: "적극적 방어"
    },
    {
      testId: "ADV-002",
      attackType: "PGD (Projected Gradient Descent)",
      successRate: 0.22,
      robustness: 0.78,
      mitigationStatus: "강화 필요"
    },
    {
      testId: "ADV-003",
      attackType: "JSMA (Jacobian-based Saliency Map Attack)",
      successRate: 0.18,
      robustness: 0.82,
      mitigationStatus: "적극적 방어"
    },
    {
      testId: "ADV-004",
      attackType: "DeepFool Attack",
      successRate: 0.25,
      robustness: 0.75,
      mitigationStatus: "강화 필요"
    },
    {
      testId: "ADV-005",
      attackType: "Carlini & Wagner (C&W) Attack",
      successRate: 0.28,
      robustness: 0.72,
      mitigationStatus: "강화 필요"
    },
  ], []);

  // 접근 제어 감시
  const accessControlAudits = useMemo((): AccessControlAudit[] => [
    {
      system: "모델 개발 시스템",
      totalAccounts: 28,
      authorizedAccess: 28,
      unauthorizedAttempts: 0,
      complianceRate: 100.0,
      lastAudit: "2024-03-08"
    },
    {
      system: "API 프로덕션 서버",
      totalAccounts: 45,
      authorizedAccess: 45,
      unauthorizedAttempts: 3,
      complianceRate: 99.3,
      lastAudit: "2024-03-09"
    },
    {
      system: "데이터베이스 서버",
      totalAccounts: 12,
      authorizedAccess: 12,
      unauthorizedAttempts: 0,
      complianceRate: 100.0,
      lastAudit: "2024-03-07"
    },
    {
      system: "로그 및 모니터링 시스템",
      totalAccounts: 8,
      authorizedAccess: 8,
      unauthorizedAttempts: 1,
      complianceRate: 98.7,
      lastAudit: "2024-03-06"
    },
  ], []);

  // 보안 지표
  const securityMetrics = useMemo((): SecurityMetric[] => [
    {
      name: t('tech.security.metrics.fixRate'),
      value: 94.4,
      target: 90.0,
      description: t('tech.security.metrics.fixRate.desc'),
      status: 'compliant'
    },
    {
      name: t('tech.security.metrics.access'),
      value: 99.5,
      target: 99.0,
      description: t('tech.security.metrics.access.desc'),
      status: 'compliant'
    },
    {
      name: t('tech.security.metrics.robustness'),
      value: 78.4,
      target: 85.0,
      description: t('tech.security.metrics.robustness.desc'),
      status: 'warning'
    },
    {
      name: t('tech.security.metrics.logging'),
      value: 99.8,
      target: 99.0,
      description: t('tech.security.metrics.logging.desc'),
      status: 'compliant'
    },
  ], [t]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-300 bg-red-50/30';
      case 'high':
        return 'border-orange-300 bg-orange-50/30';
      case 'medium':
        return 'border-amber-300 bg-amber-50/30';
      case 'low':
        return 'border-yellow-300 bg-yellow-50/30';
      default:
        return 'border-gray-300 bg-gray-50/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed':
        return 'bg-green-600';
      case 'mitigated':
        return 'bg-blue-600';
      case 'open':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const completedCount = securityChecklist.filter(item => item.completed).length;
  const completedPercentage = Math.round((completedCount / securityChecklist.length) * 100);

  const criticalVulnerabilities = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highVulnerabilities = vulnerabilities.filter(v => v.severity === 'high').length;
  const fixedVulnerabilities = vulnerabilities.filter(v => v.status === 'fixed').length;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t('tech.security.title')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('tech.security.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('tech.security.btnDownloadReport')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              {t('tech.security.btnSettings')}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('tech.security.metricFixRate')}
            value="94.4%"
            change="+5.2%"
            trend="up"
          />
          <MetricCard
            title={t('tech.security.metricVulnerabilities')}
            value="5건"
            change="-1"
            trend="down"
          />
          <MetricCard
            title={t('tech.security.metricAccess')}
            value="99.5%"
            change="±0.0%"
            trend="up"
          />
          <MetricCard
            title={t('tech.security.metricLogging')}
            value="99.8%"
            change="+0.2%"
            trend="up"
          />
        </div>

        {/* Alert for Critical Issues */}
        {criticalVulnerabilities > 0 && (
          <div className="bg-red-50/50 border border-red-300 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900">{t('tech.security.alert.title')}</h3>
              <p className="text-sm text-red-800 mt-1">
                {criticalVulnerabilities}{t('tech.security.alert.msg')}
              </p>
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-1">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="vulnerabilities" className="data-[state=active]:bg-background">
                {t('tech.security.tabVulnerabilities')}
              </TabsTrigger>
              <TabsTrigger value="adversarial" className="data-[state=active]:bg-background">
                {t('tech.security.tabAdversarial')}
              </TabsTrigger>
              <TabsTrigger value="access" className="data-[state=active]:bg-background">
                {t('tech.security.tabAccess')}
              </TabsTrigger>
              <TabsTrigger value="checklist" className="data-[state=active]:bg-background">
                {t('tech.security.tabChecklist')}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('tech.security.search')}
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

          {/* Tab: Vulnerabilities */}
          <TabsContent value="vulnerabilities" className="mt-0 space-y-6">
            {/* Security Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityMetrics.map((metric, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                      <Badge className={metric.status === 'compliant' ? 'bg-green-600' : 'bg-amber-600'}>
                        {metric.status === 'compliant' ? t('tech.security.status.compliant') : t('tech.security.status.warning')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{t('tech.security.label.current')}</span>
                          <span className="text-2xl font-bold">{metric.value.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              metric.value >= metric.target
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('tech.security.label.target')}</span>
                        <span className="font-medium">{metric.target.toFixed(1)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-2">{metric.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Vulnerabilities List */}
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.vulner.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilities.map((vuln, idx) => (
                    <div
                      key={idx}
                      className={`border rounded-lg p-4 transition-all ${getSeverityBorder(vuln.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{vuln.name}</h4>
                              <Badge className={getSeverityColor(vuln.severity)}>
                                {vuln.severity === 'critical' ? t('tech.security.vulner.severity.critical') : vuln.severity === 'high' ? t('tech.security.vulner.severity.high') : vuln.severity === 'medium' ? t('tech.security.vulner.severity.medium') : t('tech.security.vulner.severity.low')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{vuln.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{vuln.category}</span>
                              <span>•</span>
                              <span>{vuln.id}</span>
                              <span>•</span>
                              <span>{vuln.discoveryDate}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(vuln.status)}>
                          {vuln.status === 'fixed' ? t('tech.security.vulner.status.fixed') : vuln.status === 'mitigated' ? t('tech.security.vulner.status.mitigated') : t('tech.security.vulner.status.open')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Adversarial Tests */}
          <TabsContent value="adversarial" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.adversarial.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adversarialTests.map((test, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{test.attackType}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{test.testId}</p>
                        </div>
                        <Badge className={test.robustness >= 0.80 ? 'bg-green-600' : test.robustness >= 0.70 ? 'bg-amber-600' : 'bg-red-600'}>
                          {test.mitigationStatus}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">{t('tech.security.adversarial.label.successRate')}</span>
                          <div className="text-xl font-bold">{(test.successRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">{t('tech.security.adversarial.label.robustness')}</span>
                          <div className="text-xl font-bold">{(test.robustness * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t('tech.security.adversarial.label.successRate')}</span>
                            <span className="font-medium">{(test.successRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                              style={{ width: `${test.successRate * 100}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{t('tech.security.adversarial.label.robustness')}</span>
                            <span className="font-medium">{(test.robustness * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                test.robustness >= 0.80
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : test.robustness >= 0.70
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'bg-gradient-to-r from-red-500 to-orange-500'
                              }`}
                              style={{ width: `${test.robustness * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50/50 border border-amber-300 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">{t('tech.security.adversarial.recommendation')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec2')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{t('tech.security.adversarial.rec3')}</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          {/* Tab: Access Control */}
          <TabsContent value="access" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tech.security.access.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">{t('tech.security.access.colSystem')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colTotal')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colAuthorized')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colUnauthorized')}</th>
                        <th className="text-center py-3 px-4 font-semibold">{t('tech.security.access.colCompliance')}</th>
                        <th className="text-left py-3 px-4 font-semibold">{t('tech.security.access.colAudit')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessControlAudits.map((audit, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{audit.system}</td>
                          <td className="text-center py-3 px-4">{audit.totalAccounts}</td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" className="bg-green-500/10 text-green-700">
                              {audit.authorizedAccess}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge className={audit.unauthorizedAttempts === 0 ? 'bg-green-600' : 'bg-amber-600'}>
                              {audit.unauthorizedAttempts}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4 font-medium">{audit.complianceRate.toFixed(1)}%</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{audit.lastAudit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Checklist */}
          <TabsContent value="checklist" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('tech.security.checklist.title')}</CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{completedPercentage}%</div>
                    <p className="text-sm text-muted-foreground">{completedCount}/{securityChecklist.length}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityChecklist.map((item) => (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-4 transition-all ${
                        item.completed
                          ? 'bg-green-50/50 border-green-200'
                          : 'bg-amber-50/50 border-amber-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{item.item}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                        <div>
                          <Badge className={item.completed ? 'bg-green-600' : 'bg-amber-600'}>
                            {item.completed ? t('tech.security.checklist.completed') : t('tech.security.checklist.inProgress')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Security Guidelines */}
        <Card className="border-blue-200/50 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              {t('tech.security.guideline.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.parameters')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.adversarial')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.rbac')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.auditLog')}</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>{t('tech.security.guideline.regularAudit')}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="securityReview"
        title={t('tech.security.ai.title')}
        contextData={JSON.stringify({
          vulnerabilityFixRate: '94.4%',
          criticalVulnerabilities: criticalVulnerabilities,
          highVulnerabilities: highVulnerabilities,
          fixedVulnerabilities: fixedVulnerabilities,
          accessControlCompliance: '99.5%',
          averageAdversarialRobustness: (adversarialTests.reduce((sum, test) => sum + test.robustness, 0) / adversarialTests.length * 100).toFixed(1),
          checklistCompletion: completedPercentage,
        })}
      />
    </Layout>
  );
};

export default SecurityReview;
