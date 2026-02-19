import React, { useState } from 'react';
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
  Archive
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { MetricCard, ComplianceCard } from '@/components/Cards';
import { mockComplianceReports } from '@/data/index';
import {
  COMPLIANCE_STATUS,
} from '@/lib/index';
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

const submissionHistory = [
  {
    id: 'SUB-2026-001',
    agency: '금융감독원',
    reportType: 'AI 알고리즘 투명성 보고서',
    status: 'ACCEPTED',
    submittedAt: '2026-02-10',
    version: 'v1.2'
  },
  {
    id: 'SUB-2026-002',
    agency: 'KISA',
    reportType: '개인정보 영향평가 결과',
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
];

const Reports: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('보고서 생성이 완료되었습니다.');
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-chart-4 text-white">승인됨</Badge>;
      case 'REVIEWING':
        return <Badge className="bg-chart-3 text-white">검토 중</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">대기 중</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">보고서 및 규제 대응</h1>
            <p className="text-muted-foreground mt-1">
              자동 생성된 컴플라이언스 보고서를 관리하고 규제 기관에 제출합니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Archive className="h-4 w-4" />
              아카이브
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGenerating} className="gap-2 bg-primary">
              {isGenerating ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <FilePlus className="h-4 w-4" />
              )}
              새 보고서 생성
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="전체 보고서" value="48" change="+4" trend="up" />
          <MetricCard title="미제출 항목" value="3" change="-1" trend="down" />
          <MetricCard title="평균 준수 점수" value="82점" change="+5" trend="up" />
          <MetricCard title="최근 7일 생성" value="12" change="+2" trend="up" />
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              준수 보고서
            </TabsTrigger>
            <TabsTrigger value="submissions" className="gap-2">
              <Send className="h-4 w-4" />
              규제 제출
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="보고서 제목 검색..." className="pl-10" />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 유형</SelectItem>
                    <SelectItem value="internal">내부 점검</SelectItem>
                    <SelectItem value="regulatory">규제 대응</SelectItem>
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
                      <Download className="h-3 w-3" /> 다운로드
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 text-primary">
                      <Send className="h-3 w-3" /> 제출하기
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle>대외 기관 제출 현황</CardTitle>
                <CardDescription>
                  규제 당국 및 외부 감사 기관에 제출된 보고서의 처리 상태를 추적합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>제출 ID</TableHead>
                      <TableHead>제출 기관</TableHead>
                      <TableHead>보고서 유형</TableHead>
                      <TableHead>버전</TableHead>
                      <TableHead>제출일</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">액션</TableHead>
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
                          <Button variant="ghost" size="icon" title="상세 보기">
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
                    다음 규제 기한
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">개인정보보호위원회 자율점검</span>
                      <Badge variant="outline" className="text-chart-1 border-chart-1">D-12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">금융위원회 AI 운영 가이드라인</span>
                      <Badge variant="outline">D-45</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 variant-outline gap-2" variant="outline">
                    일정 확인하기 <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-chart-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-chart-4" />
                    제출 준비 완료
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    최근 생성된 2개의 보고서가 내부 검토를 통과하여 즉시 제출 가능합니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-chart-4" />
                      <span>EU AI Act 정기 보고서 v1.2</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-chart-4" />
                      <span>내부 윤리위원회 분기 보고서</span>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-primary text-white gap-2">
                    일괄 제출 프로세스 시작 <Send className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;