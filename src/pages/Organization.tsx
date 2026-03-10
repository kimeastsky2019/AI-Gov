import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Award,
  BookOpen,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search
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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  joinDate: string;
  trainings: number;
  status: "ACTIVE" | "INACTIVE";
}

interface RACIMatrix {
  task: string;
  responsible: string;
  accountable: string;
  consulted: string;
  informed: string;
}

interface TrainingProgram {
  id: string;
  title: string;
  target: string;
  duration: string;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED";
  completionDate?: string;
  participants: number;
  passRate?: number;
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

const Organization: React.FC = () => {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const mockTeam = useMemo((): TeamMember[] => [
    {
      id: "TM001",
      name: t('gov.team.member1Name') || "김AI거버넌스",
      role: t('gov.team.member1Role') || "AI 거버넌스 담당자",
      department: t('gov.team.member1Dept') || "거버넌스팀",
      email: "kg001@company.com",
      joinDate: "2024-01-15",
      trainings: 5,
      status: "ACTIVE"
    },
    {
      id: "TM002",
      name: t('gov.team.member2Name') || "이위험관리",
      role: t('gov.team.member2Role') || "위험 관리자",
      department: t('gov.team.member2Dept') || "거버넌스팀",
      email: "lrm002@company.com",
      joinDate: "2023-06-20",
      trainings: 4,
      status: "ACTIVE"
    },
    {
      id: "TM003",
      name: t('gov.team.member3Name') || "박개인정보",
      role: t('gov.team.member3Role') || "개인정보보호담당자",
      department: t('gov.team.member3Dept') || "규제준수팀",
      email: "ppp003@company.com",
      joinDate: "2023-09-10",
      trainings: 6,
      status: "ACTIVE"
    },
    {
      id: "TM004",
      name: t('gov.team.member4Name') || "최기술검증",
      role: t('gov.team.member4Role') || "기술 검증 전담자",
      department: t('gov.team.member4Dept') || "AI팀",
      email: "cjv004@company.com",
      joinDate: "2024-02-01",
      trainings: 3,
      status: "ACTIVE"
    },
    {
      id: "TM005",
      name: t('gov.team.member5Name') || "정데이터품질",
      role: t('gov.team.member5Role') || "데이터 품질 검증자",
      department: t('gov.team.member5Dept') || "데이터팀",
      email: "jdq005@company.com",
      joinDate: "2023-11-15",
      trainings: 2,
      status: "INACTIVE"
    }
  ], [t]);

  const raciMatrix: RACIMatrix[] = [
    {
      task: "AI 서비스 등록 및 분류",
      responsible: "AI팀",
      accountable: "거버넌스팀장",
      consulted: "법무팀, 보안팀",
      informed: "임원진, 감시위원회"
    },
    {
      task: "위험 평가 및 등급 결정",
      responsible: "위험관리팀",
      accountable: "거버넌스위원회",
      consulted: "기술팀, 규제팀",
      informed: "서비스 담당부서"
    },
    {
      task: "개인정보보호 점검",
      responsible: "규제준수팀",
      accountable: "CPPO",
      consulted: "법무팀",
      informed: "전사"
    },
    {
      task: "기술 검증 및 모니터링",
      responsible: "기술검증팀",
      accountable: "CTO",
      consulted: "데이터팀, 보안팀",
      informed: "AI팀, 서비스팀"
    },
    {
      task: "거버넌스 보고 및 문서화",
      responsible: "거버넌스팀",
      accountable: "CEO",
      consulted: "모든 부서",
      informed: "감시위원회, 규제당국"
    }
  ];

  const trainingPrograms = useMemo((): TrainingProgram[] => [
    {
      id: "TP001",
      title: t('gov.trainingProgram.ethics') || "AI 윤리 및 거버넌스 기초",
      target: t('gov.trainingProgram.ethicsTarget') || "전사 임직원",
      duration: t('gov.trainingProgram.ethicsDuration') || "4시간",
      status: "COMPLETED",
      completionDate: "2026-02-28",
      participants: parseInt(t('gov.trainingProgram.ethicsParticipants') || "450", 10),
      passRate: parseInt(t('gov.trainingProgram.ethicsPassRate') || "95", 10)
    },
    {
      id: "TP002",
      title: t('gov.trainingProgram.tta') || "TTA 2023 요구사항 심화",
      target: t('gov.trainingProgram.ttaTarget') || "거버넌스/기술팀",
      duration: t('gov.trainingProgram.ttaDuration') || "8시간",
      status: "ONGOING",
      participants: parseInt(t('gov.trainingProgram.ttaParticipants') || "85", 10),
      passRate: undefined
    },
    {
      id: "TP003",
      title: t('gov.trainingProgram.privacy') || "개인정보보호 자율점검",
      target: t('gov.trainingProgram.privacyTarget') || "규제준수팀",
      duration: t('gov.trainingProgram.privacyDuration') || "6시간",
      status: "SCHEDULED",
      participants: 0,
      passRate: undefined
    },
    {
      id: "TP004",
      title: t('gov.trainingProgram.fairness') || "AI 공정성 및 편향성 검증",
      target: t('gov.trainingProgram.fairnessTarget') || "데이터/AI팀",
      duration: t('gov.trainingProgram.fairnessDuration') || "6시간",
      status: "COMPLETED",
      completionDate: "2026-03-05",
      participants: parseInt(t('gov.trainingProgram.fairnessParticipants') || "120", 10),
      passRate: parseInt(t('gov.trainingProgram.fairnessPassRate') || "92", 10)
    },
    {
      id: "TP005",
      title: t('gov.trainingProgram.risk') || "위험 관리 실전 연습",
      target: t('gov.trainingProgram.riskTarget') || "거버넌스/위험관리팀",
      duration: t('gov.trainingProgram.riskDuration') || "4시간",
      status: "SCHEDULED",
      participants: 0,
      passRate: undefined
    }
  ], [t]);

  const filteredTeam = mockTeam.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const organizationStructure = useMemo(() => [
    {
      level: 1,
      title: t('gov.orgStructure.level1') || "CEO / 최고경영진",
      description: t('gov.orgStructure.level1Desc') || "AI 거버넌스 전략 승인",
      icon: Users
    },
    {
      level: 2,
      title: t('gov.orgStructure.level2') || "거버넌스 위원회",
      description: t('gov.orgStructure.level2Desc') || "위험 평가 최종 승인, 정책 결정",
      icon: Award
    },
    {
      level: 3,
      title: t('gov.orgStructure.level3') || "거버넌스팀 / AI팀 / 규제준수팀 / 기술검증팀",
      description: t('gov.orgStructure.level3Desc') || "일일 운영 및 점검 업무",
      icon: Users
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
              {t('governance.organization.title') || '조직·인력 관리'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('governance.organization.subtitle') || 'TTA 요구사항 02에 기반한 AI 거버넌스 조직 구조 및 인력 관리'}
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
              title={t('governance.metric.teamMembers') || '팀 인원'}
              value={mockTeam.length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.active') || '활성 인원'}
              value={mockTeam.filter(m => m.status === "ACTIVE").length}
              change={"+0"}
              trend="down"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.trained') || '교육 이수'}
              value={mockTeam.filter(m => m.trainings >= 3).length}
              change={"+2"}
              trend="up"
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <MetricCard
              title={t('governance.metric.programs') || '교육 프로그램'}
              value={trainingPrograms.length}
              change={"+1"}
              trend="up"
            />
          </motion.div>
        </motion.div>

        {/* Organization Structure */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                {t('gov.orgStructure.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {organizationStructure.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                    >
                      <div className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          {idx < organizationStructure.length - 1 && (
                            <div className="w-1 h-12 bg-primary/20 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <h4 className="font-semibold text-base">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="team" className="w-full space-y-6">
          <TabsList className="bg-transparent gap-6 border-b pb-0 h-auto w-full justify-start rounded-none">
            <TabsTrigger
              value="team"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <Users className="w-4 h-4 mr-2" />
              {t('gov.team.title')}
            </TabsTrigger>
            <TabsTrigger
              value="raci"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              {t('gov.raci.title')}
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 pb-3"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {t('gov.training.title')}
            </TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.team.members')}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        {t('gov.team.addNew')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('gov.team.addNew')}</DialogTitle>
                        <DialogDescription>
                          {t('gov.team.addNewDesc')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.team.nameLabel')}</label>
                          <Input placeholder={t('gov.team.namePlaceholder')} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.team.roleLabel')}</label>
                          <Input placeholder={t('gov.team.rolePlaceholder')} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">{t('gov.team.deptLabel')}</label>
                          <Input placeholder={t('gov.team.deptPlaceholder')} />
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1">{t('gov.team.cancel')}</Button>
                          <Button className="flex-1">{t('gov.team.add')}</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex-1 relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder={t('gov.team.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4">
                  {filteredTeam.map((member) => (
                    <motion.div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{member.name}</h4>
                          <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>
                            {member.status === "ACTIVE" ? t('gov.team.active') : t('gov.team.inactive')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{member.department}</span>
                          <span>{member.email}</span>
                          <span>{t('gov.team.joinedDate')}: {member.joinDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-center">
                          <Award className="w-4 h-4 text-amber-500 mx-auto" />
                          <p className="text-sm font-semibold mt-1">{member.trainings}</p>
                          <p className="text-xs text-muted-foreground">{t('gov.training.title')}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RACI Tab */}
          <TabsContent value="raci" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-500" />
                  {t('gov.raci.matrix')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left py-3 px-3 font-semibold w-32">{t('gov.raci.task')}</th>
                        <th className="text-left py-3 px-3 font-semibold">Responsible<br/><span className="text-xs font-normal text-muted-foreground">{t('gov.raci.responsibleDesc')}</span></th>
                        <th className="text-left py-3 px-3 font-semibold">Accountable<br/><span className="text-xs font-normal text-muted-foreground">{t('gov.raci.accountableDesc')}</span></th>
                        <th className="text-left py-3 px-3 font-semibold">Consulted<br/><span className="text-xs font-normal text-muted-foreground">{t('gov.raci.consultedDesc')}</span></th>
                        <th className="text-left py-3 px-3 font-semibold">Informed<br/><span className="text-xs font-normal text-muted-foreground">{t('gov.raci.informedDesc')}</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      {raciMatrix.map((item, idx) => (
                        <motion.tr
                          key={idx}
                          className="border-b hover:bg-muted/20 transition-colors"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <td className="py-3 px-3 font-medium text-xs">{item.task}</td>
                          <td className="py-3 px-3 text-xs">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {item.responsible}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {item.accountable}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {item.consulted}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-xs">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {item.informed}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* RACI Legend */}
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Responsible
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('gov.raciLegend.responsibleDesc')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Accountable
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('gov.raciLegend.accountableDesc')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500" />
                      Consulted
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('gov.raciLegend.consultedDesc')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Informed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('gov.raciLegend.informedDesc')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>{t('gov.training.management')}</CardTitle>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    {t('gov.training.addNew')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {trainingPrograms.map((program) => (
                    <motion.div
                      key={program.id}
                      className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{program.title}</h4>
                            <Badge className={cn(
                              program.status === "SCHEDULED" && "bg-blue-100 text-blue-800",
                              program.status === "ONGOING" && "bg-amber-100 text-amber-800",
                              program.status === "COMPLETED" && "bg-green-100 text-green-800"
                            )}>
                              {program.status === "SCHEDULED" ? t('gov.training.status.scheduled') :
                               program.status === "ONGOING" ? t('gov.training.status.ongoing') : t('gov.training.status.completed')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {t('gov.training.target')}: {program.target} | {t('gov.training.duration')}: {program.duration}
                          </p>
                          {program.passRate && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>{t('gov.training.passRate')}</span>
                                <span className="font-semibold">{program.passRate}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <motion.div
                                  className="h-full bg-green-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${program.passRate}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold">{program.participants}</p>
                          <p className="text-xs text-muted-foreground">{t('gov.training.participants')}</p>
                          {program.completionDate && (
                            <p className="text-xs text-muted-foreground mt-2">{program.completionDate}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* TTA Requirement Info */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-blue-50/50 to-blue-50/20 border-blue-200/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('gov.ttaReq02.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {t('gov.ttaReq02.desc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{t('gov.ttaReq02Item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{t('gov.ttaReq02Item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  <span>{t('gov.ttaReq02Item3')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50/50 to-purple-50/20 border-purple-200/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t('gov.orgStructureRecommended.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                {t('gov.orgStructureRecommended.desc')}
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>{t('gov.orgStructureRecommended.item1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>{t('gov.orgStructureRecommended.item2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                  <span>{t('gov.orgStructureRecommended.item3')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
};

export default Organization;
