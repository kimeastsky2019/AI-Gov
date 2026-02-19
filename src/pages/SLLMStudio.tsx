/**
 * sLLM Studio - 프롬프트 엔지니어링 & 파인튜닝 관리 페이지
 * AI 거버넌스 서비스 구축 데이터 플로우 연동
 * 에너지·금융 부문 4개 섹터별 프로세스·위험평가·RMF 통합
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/Layout';
import { sllmAPI } from '@/api/client';
import { toast } from 'sonner';
import {
  Brain, Sparkles, Play, Save, Trash2, Plus, Database, Settings2,
  Loader2, Copy, Check, RefreshCw, Zap, FileText, ChevronDown,
  ChevronRight, Eye, Wand2, BarChart3, Clock, CheckCircle2,
  Shield, AlertTriangle, Lock, Cpu, Activity, ArrowRight,
  Building2, Factory, Landmark, ShieldCheck, Workflow, Layers, Server,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { MetricCard } from '@/components/Cards';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

type SectorId = 'smart' | 'renew' | 'bank' | 'insur';

// =============================================
// 총괄현황 & 서비스 구축 플로우 탭
// =============================================
function GovernanceOverview({ activeSector, setActiveSector, SECTORS, PROCESS_STEPS, RMF_PRINCIPLES, PHASE_COLORS }: {
  activeSector: SectorId;
  setActiveSector: (s: SectorId) => void;
  SECTORS: { id: string; name: string; sub: string; color: string; icon: string; iconComponent: any }[];
  PROCESS_STEPS: Record<SectorId, { phase: string; steps: { name: string; input: string; output: string; owner: string; sla: string }[] }[]>;
  RMF_PRINCIPLES: { name: string; items: number; score: number; desc: string; color: string }[];
  PHASE_COLORS: Record<string, string>;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      {/* Sector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTORS.map(s => {
          const Icon = s.iconComponent;
          const totalSteps = PROCESS_STEPS[s.id as SectorId].reduce((a, p) => a + p.steps.length, 0);
          return (
            <motion.div key={s.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={cn("cursor-pointer transition-all border-l-4", activeSector === s.id ? "ring-2 ring-offset-1" : "")}
                style={{ borderLeftColor: s.color, ...(activeSector === s.id ? { ringColor: s.color + '60' } : {}) }}
                onClick={() => setActiveSector(s.id as SectorId)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-bold text-sm">{s.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{s.sub}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    <Badge variant="outline" className="text-[10px]" style={{ borderColor: s.color + '40', color: s.color }}>{totalSteps} {t('sllm.steps')}</Badge>
                    <Badge variant="outline" className="text-[10px] border-red-300 text-red-600">R-01~R-18</Badge>
                    <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-600">RMF 32Q</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: t('sllm.overview.sectors'), value: '4', color: '#1B2A4A' },
          { label: t('sllm.overview.riskItems'), value: 'R-01~R-18', color: '#DC2626' },
          { label: t('sllm.overview.rmfQuestions'), value: '32', color: '#D97706' },
          { label: t('sllm.overview.evalScore'), value: '100점', color: '#0D9488' },
          { label: t('sllm.overview.totalSLA'), value: '60~90일', color: '#059669' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RMF 4대 원칙 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> {t('sllm.rmf.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {RMF_PRINCIPLES.map(p => (
              <div key={p.name} className="border rounded-lg p-3" style={{ borderTopWidth: 3, borderTopColor: p.color }}>
                <div className="font-bold text-sm" style={{ color: p.color }}>{p.name} {t('sllm.rmf.principle')}</div>
                <div className="text-lg font-extrabold mt-1">{p.items} {t('sllm.rmf.questions')} ({p.score}{t('sllm.rmf.points')})</div>
                <div className="text-[10px] text-muted-foreground mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 위험 점수 공식 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> {t('sllm.risk.formula')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-500/[0.04] border border-red-500/20 rounded-lg p-4 text-center">
            <code className="text-sm font-bold text-red-600">{t('sllm.risk.formulaText')}</code>
            <div className="flex justify-center gap-3 mt-3 flex-wrap">
              {[
                { grade: t('sllm.risk.gradeUnacceptable'), range: '≥75점', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
                { grade: t('sllm.risk.gradeHigh'), range: '50~74점', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
                { grade: t('sllm.risk.gradeMedium'), range: '25~49점', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
                { grade: t('sllm.risk.gradeLow'), range: '0~24점', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
              ].map(g => (
                <Badge key={g.grade} variant="outline" className={cn("text-xs", g.color)}>{g.grade}: {g.range}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================
// 서비스 구축 플로우 탭
// =============================================
function ServiceFlowTab({ activeSector, SECTORS, PROCESS_STEPS, PHASE_COLORS }: {
  activeSector: SectorId;
  SECTORS: { id: string; name: string; sub: string; color: string; icon: string; iconComponent: any }[];
  PROCESS_STEPS: Record<SectorId, { phase: string; steps: { name: string; input: string; output: string; owner: string; sla: string }[] }[]>;
  PHASE_COLORS: Record<string, string>;
}) {
  const { t } = useI18n();
  const sector = SECTORS.find(s => s.id === activeSector)!;
  const process = PROCESS_STEPS[activeSector];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{sector.icon}</span>
        <div>
          <h3 className="font-bold text-lg">{sector.name} {t('sllm.flow.title')}</h3>
          <p className="text-xs text-muted-foreground">{sector.sub}</p>
        </div>
      </div>

      {process.map((phase, pi) => (
        <Card key={pi} className="border-l-4" style={{ borderLeftColor: PHASE_COLORS[phase.phase] }}>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="text-xs text-white border-none" style={{ backgroundColor: PHASE_COLORS[phase.phase] }}>
                {phase.phase}
              </Badge>
              <span className="text-xs text-muted-foreground">{phase.steps.length} {t('sllm.steps')}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {phase.steps.map((step, si) => (
                <div key={si} className="min-w-[200px] flex-shrink-0">
                  <div className="border rounded-lg p-3" style={{ borderTopWidth: 3, borderTopColor: PHASE_COLORS[phase.phase] }}>
                    <div className="font-semibold text-xs mb-2">{step.name}</div>
                    <div className="space-y-1">
                      <div className="text-[10px]"><span className="text-muted-foreground">{t('sllm.flow.input')}:</span> <span>{step.input}</span></div>
                      <div className="text-[10px]"><span className="text-muted-foreground">{t('sllm.flow.output')}:</span> <span style={{ color: sector.color }}>{step.output}</span></div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <Badge variant="outline" className="text-[9px] border-blue-300 text-blue-600">{step.owner}</Badge>
                      <Badge variant="outline" className="text-[9px] border-amber-300 text-amber-600">{step.sla}</Badge>
                    </div>
                  </div>
                  {si < phase.steps.length - 1 && (
                    <div className="flex justify-center text-muted-foreground text-xs mt-1">
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// =============================================
// 위험 평가 연동 탭
// =============================================
function RiskAssessmentTab({ activeSector, SECTORS, RISK_ITEMS }: {
  activeSector: SectorId;
  SECTORS: { id: string; name: string; sub: string; color: string; icon: string; iconComponent: any }[];
  RISK_ITEMS: { id: string; name: string; cat: string; smart: number; renew: number; bank: number; insur: number }[];
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        {t('sllm.arch.safetyDoc')} ({t('sllm.riskMapping')})
      </h3>
      <Card>
        <CardContent className="pt-4 pb-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-2 font-semibold">{t('sllm.overview.riskItems')}</th>
                <th className="text-left p-2 font-semibold">{t('sllm.risk.r01').split('/')[0]}</th>
                <th className="text-left p-2 font-semibold">{t('sllm.risk.cat.malicious').split(' ')[0]}</th>
                {SECTORS.map(s => (
                  <th key={s.id} className="text-center p-2 font-semibold" style={{ color: s.color }}>
                    {s.icon} {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RISK_ITEMS.map((r, ri) => (
                <tr key={ri} className={cn("border-b border-border/50", activeSector && r[activeSector] === 3 ? "bg-primary/[0.03]" : "")}>
                  <td className="p-2 font-bold text-red-600">{r.id}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">
                    <Badge variant="outline" className={cn("text-[10px]", r.cat === t('sllm.risk.cat.malicious') ? 'border-red-300 text-red-600' : 'border-amber-300 text-amber-600')}>
                      {r.cat}
                    </Badge>
                  </td>
                  {(['smart', 'renew', 'bank', 'insur'] as SectorId[]).map(sid => {
                    const sector = SECTORS.find(s => s.id === sid)!;
                    const val = r[sid];
                    return (
                      <td key={sid} className="text-center p-2">
                        <span className={cn(
                          "inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold",
                          val === 3 ? "text-white" : "text-muted-foreground bg-muted"
                        )} style={val === 3 ? { backgroundColor: sector.color } : {}}>
                          {val === 3 ? '●' : '○'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 p-2 bg-red-500/[0.04] border border-red-500/20 rounded-lg text-[10px] text-red-600 font-medium">
            ● {t('sllm.risk.highRelevance')} | ○ {t('sllm.risk.mediumRelevance')} | {t('sllm.risk.formula')}: {t('sllm.risk.formulaText')}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================
// AI RMF 평가 탭
// =============================================
function RMFEvaluationTab({ RMF_PRINCIPLES }: {
  RMF_PRINCIPLES: { name: string; items: number; score: number; desc: string; color: string }[];
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Shield className="w-5 h-5" />
        {t('sllm.rmfEval.title')}
      </h3>

      {/* Principle Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {RMF_PRINCIPLES.map(p => (
          <Card key={p.name} style={{ borderTopWidth: 4, borderTopColor: p.color }}>
            <CardContent className="pt-4 pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold" style={{ color: p.color }}>{p.name} {t('sllm.rmf.principle')}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold" style={{ color: p.color }}>{p.score}</div>
                  <div className="text-[10px] text-muted-foreground">{p.items} {t('sllm.rmf.questions')}</div>
                </div>
              </div>
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.score}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: p.color }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Evaluation Process */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t('sllm.rmfEval.process')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {[
              { step: t('sllm.rmfEval.step1'), detail: '부문별 플레이북 선정', color: '#1B2A4A' },
              { step: t('sllm.rmfEval.step2'), detail: '32개 질문 예/아니오 판단', color: '#DC2626' },
              { step: t('sllm.rmfEval.step3'), detail: '4대 원칙 점수 100점 환산', color: '#D97706' },
              { step: t('sllm.rmfEval.step4'), detail: '등급별 완화 계획', color: '#059669' },
              { step: t('sllm.rmfEval.step5'), detail: '거버넌스 위원회 최종 승인', color: '#0D9488' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-white rounded-lg p-2.5 font-bold text-xs mb-2" style={{ backgroundColor: s.color }}>
                  {i + 1}. {s.step}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grade Levels */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { grade: t('sllm.risk.gradeUnacceptable'), range: '≥75점', color: '#DC2626', action: t('sllm.risk.actionStop') },
          { grade: t('sllm.risk.gradeHigh'), range: '50~74점', color: '#E87722', action: t('sllm.risk.action1Month') },
          { grade: t('sllm.risk.gradeMedium'), range: '25~49점', color: '#D97706', action: t('sllm.risk.action3Month') },
          { grade: t('sllm.risk.gradeLow'), range: '0~24점', color: '#059669', action: t('sllm.risk.actionMonitor') },
        ].map(g => (
          <Card key={g.grade} style={{ borderTopWidth: 4, borderTopColor: g.color }}>
            <CardContent className="pt-4 pb-3 text-center">
              <div className="text-base font-extrabold" style={{ color: g.color }}>{g.grade}</div>
              <div className="text-xl font-extrabold mt-1">{g.range}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{g.action}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =============================================
// 통합 아키텍처 탭
// =============================================
function ArchitectureTab({ activeSector, setActiveSector, SECTORS }: {
  activeSector: SectorId;
  setActiveSector: (s: SectorId) => void;
  SECTORS: { id: string; name: string; sub: string; color: string; icon: string; iconComponent: any }[];
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Layers className="w-5 h-5" />
        {t('sllm.arch.title')}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 서비스 계층 */}
        <Card style={{ borderTopWidth: 4, borderTopColor: '#1B2A4A' }}>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sllm.arch.serviceLayer')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {SECTORS.map(s => (
              <div
                key={s.id}
                onClick={() => setActiveSector(s.id as SectorId)}
                className={cn(
                  "border rounded-lg p-2.5 cursor-pointer transition-colors border-l-4",
                  activeSector === s.id ? "bg-primary/[0.03]" : "hover:bg-muted/50"
                )}
                style={{ borderLeftColor: s.color }}
              >
                <div className="font-semibold text-xs">{s.icon} {s.name}</div>
                <div className="text-[10px] text-muted-foreground">{s.sub}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 거버넌스 계층 */}
        <Card style={{ borderTopWidth: 4, borderTopColor: '#E87722' }}>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sllm.arch.governanceLayer')}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-lg p-2.5 border-orange-300">
              <div className="font-semibold text-xs text-orange-600">{t('sllm.arch.itsm')}</div>
              <div className="text-[10px] text-muted-foreground">{t('sllm.arch.itsmFlow')}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="border rounded-lg p-2 border-red-300" style={{ borderTopWidth: 3, borderTopColor: '#DC2626' }}>
                <div className="font-semibold text-[10px] text-red-600">{t('sllm.arch.safetyDoc')}</div>
                <div className="text-[9px] text-muted-foreground">R-01~R-18</div>
              </div>
              <div className="border rounded-lg p-2 border-amber-300" style={{ borderTopWidth: 3, borderTopColor: '#D97706' }}>
                <div className="font-semibold text-[10px] text-amber-600">{t('sllm.arch.riskDoc')}</div>
                <div className="text-[9px] text-muted-foreground">AI RMF 32 {t('sllm.rmf.questions')}</div>
              </div>
            </div>
            <div className="border rounded-lg p-2.5 border-blue-300">
              <div className="font-semibold text-xs text-blue-600">{t('sllm.arch.riskMgmt')}</div>
              <div className="flex gap-1 mt-1.5">
                {[t('sllm.arch.planEstablish'), t('sllm.arch.gradeVerify'), t('sllm.arch.implement')].map(s => (
                  <Badge key={s} variant="outline" className="text-[9px] border-blue-300 text-blue-600">{s}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 의사결정 계층 */}
        <Card style={{ borderTopWidth: 4, borderTopColor: '#059669' }}>
          <CardHeader className="pb-2"><CardTitle className="text-sm">{t('sllm.arch.decisionLayer')}</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: t('sllm.arch.committeeReport'), desc: '최종 위험 등급 판정', color: '#E87722' },
              { label: t('sllm.arch.operationApproval'), desc: '승인/조건부/보류', color: '#059669' },
              { label: t('sllm.arch.annualReeval'), desc: '성능·드리프트 탐지', color: '#0D9488' },
              { label: t('sllm.arch.serviceStop'), desc: '위험 초과시 중단', color: '#DC2626' },
            ].map((d, i) => (
              <div key={i} className="border rounded-lg p-2.5 border-l-4" style={{ borderLeftColor: d.color, backgroundColor: d.color + '08' }}>
                <div className="font-semibold text-xs">{d.label}</div>
                <div className="text-[10px] text-muted-foreground">{d.desc}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Data Infrastructure */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Server className="w-4 h-4" /> {t('sllm.arch.dataInfra')}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { name: t('sllm.arch.infra1.name'), desc: t('sllm.arch.infra1.desc'), color: '#059669' },
              { name: t('sllm.arch.infra2.name'), desc: t('sllm.arch.infra2.desc'), color: '#2563EB' },
              { name: t('sllm.arch.infra3.name'), desc: t('sllm.arch.infra3.desc'), color: '#0D9488' },
              { name: t('sllm.arch.infra4.name'), desc: t('sllm.arch.infra4.desc'), color: '#D97706' },
              { name: t('sllm.arch.infra5.name'), desc: t('sllm.arch.infra5.desc'), color: '#DC2626' },
            ].map(inf => (
              <div key={inf.name} className="border rounded-lg p-3 text-center" style={{ borderTopWidth: 3, borderTopColor: inf.color }}>
                <div className="font-semibold text-xs">{inf.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{inf.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================================
// 프롬프트 에디터 (기존 유지)
// =============================================
const PromptEditor: React.FC = () => {
  const { t } = useI18n();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [evalResult, setEvalResult] = useState<any>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('general');
  const [genPurpose, setGenPurpose] = useState('');
  const [genLoading, setGenLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadTemplates(); }, []);

  const loadTemplates = async () => {
    try { setLoading(true); const res = await sllmAPI.getTemplates(); setTemplates(res.data.templates || []); }
    catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleTest = async () => {
    if (!systemPrompt.trim() || !userMessage.trim()) { toast.error('시스템 프롬프트와 사용자 메시지를 입력하세요.'); return; }
    setTestLoading(true); setTestResult(null);
    try { const res = await sllmAPI.testPrompt({ system_prompt: systemPrompt, user_message: userMessage, temperature, max_tokens: maxTokens }); setTestResult(res.data); toast.success(`테스트 완료 (${res.data.latency_ms}ms)`); }
    catch (err: any) { toast.error(err.response?.data?.error || '테스트 실패'); }
    finally { setTestLoading(false); }
  };

  const handleEvaluate = async () => {
    if (!testResult) { toast.error('먼저 프롬프트를 테스트하세요.'); return; }
    setEvalLoading(true);
    try { const res = await sllmAPI.evaluatePrompt({ system_prompt: systemPrompt, user_prompt_template: '', test_input: userMessage, test_output: testResult.response }); setEvalResult(res.data.evaluation); toast.success('평가 완료'); }
    catch (err: any) { toast.error(err.response?.data?.error || '평가 실패'); }
    finally { setEvalLoading(false); }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !systemPrompt.trim()) { toast.error('템플릿 이름과 시스템 프롬프트를 입력하세요.'); return; }
    try { await sllmAPI.createTemplate({ name: templateName, system_prompt: systemPrompt, user_prompt_template: userMessage, category: templateCategory }); toast.success('프롬프트 템플릿이 저장되었습니다.'); loadTemplates(); setTemplateName(''); }
    catch (err: any) { toast.error(err.response?.data?.error || '저장 실패'); }
  };

  const handleGenerate = async () => {
    if (!genPurpose.trim()) { toast.error('프롬프트 목적을 입력하세요.'); return; }
    setGenLoading(true);
    try { const res = await sllmAPI.generatePrompt({ purpose: genPurpose }); const gen = res.data.generated; if (gen.system_prompt) setSystemPrompt(gen.system_prompt); if (gen.user_prompt_template) setUserMessage(gen.user_prompt_template); toast.success('AI가 프롬프트를 생성했습니다.'); }
    catch (err: any) { toast.error(err.response?.data?.error || '생성 실패'); }
    finally { setGenLoading(false); }
  };

  const loadTemplate = (tpl: any) => { setSystemPrompt(tpl.system_prompt); setUserMessage(tpl.user_prompt_template || ''); setTemplateName(tpl.name); setTemplateCategory(tpl.category || 'general'); toast.success(`"${tpl.name}" 템플릿을 로드했습니다.`); };
  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleDeleteTemplate = async (id: string) => { try { await sllmAPI.deleteTemplate(id); toast.success('삭제 완료'); loadTemplates(); } catch { toast.error('삭제 실패'); } };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/30 dark:bg-purple-900/10">
        <CardContent className="pt-5">
          <div className="flex items-center gap-2 mb-3"><Wand2 className="w-5 h-5 text-purple-600" /><span className="font-semibold text-sm">{t('sllm.prompt.autoGenTitle')}</span></div>
          <div className="flex gap-2">
            <Input value={genPurpose} onChange={e => setGenPurpose(e.target.value)} placeholder={t('sllm.prompt.purpose')} className="flex-1" />
            <Button onClick={handleGenerate} disabled={genLoading} className="bg-purple-600 hover:bg-purple-700 gap-1.5">
              {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} {t('sllm.prompt.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Settings2 className="w-4 h-4" /> {t('sllm.prompt.systemPrompt')}</CardTitle></CardHeader><CardContent><Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)} placeholder={t('sllm.prompt.systemPromptPlaceholder')} className="min-h-[180px] font-mono text-sm" /></CardContent></Card>
          <Card><CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><FileText className="w-4 h-4" /> {t('sllm.prompt.userMessage')}</CardTitle></CardHeader><CardContent><Textarea value={userMessage} onChange={e => setUserMessage(e.target.value)} placeholder={t('sllm.prompt.userMessagePlaceholder')} className="min-h-[100px] text-sm" /></CardContent></Card>

          <Card><CardContent className="pt-5"><div className="grid grid-cols-2 gap-6">
            <div><label className="text-xs font-medium text-muted-foreground mb-2 block">{t('sllm.prompt.temperature')}: {temperature}</label><Slider value={[temperature]} onValueChange={([v]) => setTemperature(v)} min={0} max={2} step={0.1} /></div>
            <div><label className="text-xs font-medium text-muted-foreground mb-2 block">{t('sllm.prompt.maxTokens')}: {maxTokens}</label><Slider value={[maxTokens]} onValueChange={([v]) => setMaxTokens(v)} min={256} max={8192} step={256} /></div>
          </div></CardContent></Card>

          <div className="flex gap-3">
            <Button onClick={handleTest} disabled={testLoading} className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700">{testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />} {t('sllm.prompt.testRun')}</Button>
            <Button onClick={handleEvaluate} disabled={evalLoading || !testResult} variant="outline" className="flex-1 gap-2">{evalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />} {t('sllm.prompt.aiEval')}</Button>
          </div>

          {testResult && (
            <Card className="border-blue-200 dark:border-blue-800"><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base text-blue-700 dark:text-blue-300">{t('sllm.prompt.testResult')}</CardTitle><div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{testResult.latency_ms}ms</Badge><button onClick={() => handleCopy(testResult.response)}>{copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}</button></div></div></CardHeader><CardContent><pre className="text-sm whitespace-pre-wrap bg-muted/30 p-4 rounded-lg max-h-[300px] overflow-y-auto">{testResult.response}</pre></CardContent></Card>
          )}

          {evalResult && (
            <Card className="border-green-200 dark:border-green-800"><CardHeader className="pb-3"><CardTitle className="text-base text-green-700 dark:text-green-300">{t('sllm.prompt.aiEval')}</CardTitle></CardHeader><CardContent>
              {evalResult.scores ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-3">{Object.entries(evalResult.scores).map(([key, val]: [string, any]) => (<div key={key} className="text-center p-3 bg-muted/30 rounded-lg"><div className="text-xl font-bold">{val}/10</div><div className="text-xs text-muted-foreground mt-1">{key === 'clarity' ? t('sllm.prompt.evalClarity') : key === 'completeness' ? t('sllm.prompt.evalCompleteness') : key === 'response_quality' ? t('sllm.prompt.evalQuality') : key === 'efficiency' ? t('sllm.prompt.evalEfficiency') : t('sllm.prompt.evalSafety')}</div></div>))}</div>
                  {evalResult.overall && (<div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"><div className="text-3xl font-bold text-green-700 dark:text-green-300">{evalResult.overall}/10</div><div className="text-sm text-muted-foreground">{t('sllm.prompt.evalOverall')}</div></div>)}
                  {evalResult.suggestions?.length > 0 && (<div><h4 className="text-sm font-medium mb-2">{t('sllm.prompt.suggestions')}:</h4><ul className="space-y-1">{evalResult.suggestions.map((s: string, i: number) => (<li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> {s}</li>))}</ul></div>)}
                  {evalResult.improved_prompt && (<div><div className="flex items-center justify-between mb-2"><h4 className="text-sm font-medium">{t('sllm.prompt.improvedPrompt')}:</h4><Button variant="ghost" size="sm" onClick={() => setSystemPrompt(evalResult.improved_prompt)} className="text-xs gap-1"><Zap className="w-3 h-3" /> {t('sllm.prompt.apply')}</Button></div><pre className="text-xs whitespace-pre-wrap bg-muted/30 p-3 rounded-lg max-h-[200px] overflow-y-auto">{evalResult.improved_prompt}</pre></div>)}
                </div>
              ) : (<pre className="text-sm whitespace-pre-wrap">{evalResult.raw || JSON.stringify(evalResult, null, 2)}</pre>)}
            </CardContent></Card>
          )}

          <Card><CardContent className="pt-5"><div className="flex gap-3">
            <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder={t('sllm.prompt.templateName')} className="flex-1" />
            <Select value={templateCategory} onValueChange={setTemplateCategory}><SelectTrigger className="w-40"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="general">{t('sllm.prompt.cat.general')}</SelectItem><SelectItem value="compliance">{t('sllm.prompt.cat.compliance')}</SelectItem><SelectItem value="risk">{t('sllm.prompt.cat.risk')}</SelectItem><SelectItem value="report">{t('sllm.prompt.cat.report')}</SelectItem><SelectItem value="analysis">{t('sllm.prompt.cat.analysis')}</SelectItem></SelectContent></Select>
            <Button onClick={handleSaveTemplate} className="gap-1.5"><Save className="w-4 h-4" /> {t('sllm.prompt.save')}</Button>
          </div></CardContent></Card>
        </div>

        <div className="space-y-4">
          <Card><CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-base">{t('sllm.prompt.savedTemplates')}</CardTitle><Button variant="ghost" size="sm" onClick={loadTemplates}><RefreshCw className="w-3.5 h-3.5" /></Button></div></CardHeader><CardContent>
            {templates.length === 0 ? (<div className="text-center py-8 text-muted-foreground text-sm"><FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />{t('sllm.prompt.noTemplates')}</div>) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">{templates.map(tpl => (<div key={tpl.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group" onClick={() => loadTemplate(tpl)}><div className="flex items-center justify-between"><span className="font-medium text-sm truncate">{tpl.name}</span><button onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(tpl.id); }} className="opacity-0 group-hover:opacity-100 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button></div><div className="flex items-center gap-2 mt-1"><Badge variant="secondary" className="text-[10px]">{tpl.category}</Badge><span className="text-[10px] text-muted-foreground">{tpl.status}</span></div><p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tpl.system_prompt?.substring(0, 80)}...</p></div>))}</div>
            )}
          </CardContent></Card>

          <Card><CardHeader className="pb-3"><CardTitle className="text-base">{t('sllm.prompt.library')}</CardTitle></CardHeader><CardContent><div className="space-y-2">
            {[
              { name: t('sllm.prompt.lib.compliance'), prompt: '당신은 GnG International AI 거버넌스 플랫폼의 컴플라이언스 전문 AI 어시스턴트입니다. 금융분야 AI 규제(AI기본법, 금융분야 AI RMF, EU AI Act, ISO/IEC 42001 등)에 정통하며, 조직의 AI 시스템 컴플라이언스 관리를 지원합니다.' },
              { name: t('sllm.prompt.lib.risk'), prompt: '당신은 AI 시스템의 위험 등급을 평가하는 전문가입니다. 합법성, 신뢰성, 신의성실, 보안성의 4대 원칙에 따라 체계적으로 위험을 식별하고 완화 방안을 제시합니다.' },
              { name: t('sllm.prompt.lib.report'), prompt: '당신은 AI 거버넌스 보고서 작성 전문가입니다. 규제 기관 제출용 보고서를 체계적이고 전문적으로 작성합니다. 한국어로 응답하세요.' },
              { name: t('sllm.prompt.lib.monitoring'), prompt: '당신은 AI 서비스의 성능과 보안을 모니터링하는 전문가입니다. 이상 징후를 감지하고, 최적화 방안을 제안합니다.' },
            ].map((item, i) => (
              <button key={i} onClick={() => { setSystemPrompt(item.prompt); setTemplateName(item.name); toast.success(`"${item.name}" 프롬프트 로드`); }} className="w-full text-left p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                <div className="font-medium text-sm">{item.name}</div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.prompt.substring(0, 60)}...</p>
              </button>
            ))}
          </div></CardContent></Card>
        </div>
      </div>
    </div>
  );
};

// =============================================
// 파인튜닝 패널 (기존 유지)
// =============================================
const FineTuningPanel: React.FC = () => {
  const { t } = useI18n();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetSource, setNewDatasetSource] = useState('risk_assessments');
  const [newDatasetDesc, setNewDatasetDesc] = useState('');
  const [newJobName, setNewJobName] = useState('');
  const [newJobModel, setNewJobModel] = useState('grok-4-latest');
  const [newJobDataset, setNewJobDataset] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try { const [dsRes, jobRes, modelRes] = await Promise.all([sllmAPI.getDatasets(), sllmAPI.getJobs(), sllmAPI.getModels()]); setDatasets(dsRes.data.datasets || []); setJobs(jobRes.data.jobs || []); setModels(modelRes.data.models || []); }
    catch { /* ignore */ } finally { setLoading(false); }
  };

  const handleCreateDataset = async () => {
    if (!newDatasetName.trim()) { toast.error('데이터셋 이름을 입력하세요.'); return; }
    try { const res = await sllmAPI.createDataset({ name: newDatasetName, description: newDatasetDesc, source_type: newDatasetSource }); toast.success(res.data.message); setNewDatasetName(''); setNewDatasetDesc(''); loadAll(); }
    catch (err: any) { toast.error(err.response?.data?.error || '생성 실패'); }
  };

  const handlePreview = async (id: string) => { try { const res = await sllmAPI.previewDataset(id); setPreviewData(res.data); setPreviewOpen(true); } catch { toast.error('미리보기 실패'); } };

  const handleCreateJob = async () => {
    if (!newJobName.trim() || !newJobDataset) { toast.error('작업 이름과 데이터셋을 선택하세요.'); return; }
    try { const res = await sllmAPI.createJob({ name: newJobName, model_base: newJobModel, dataset_id: newJobDataset }); toast.success(res.data.message); setNewJobName(''); loadAll(); }
    catch (err: any) { toast.error(err.response?.data?.error || '생성 실패'); }
  };

  const handleDeleteDataset = async (id: string) => { try { await sllmAPI.deleteDataset(id); toast.success('삭제 완료'); loadAll(); } catch { toast.error('삭제 실패'); } };

  return (
    <div className="space-y-6">
      <div><h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5" /> {t('sllm.finetune.modelStatus')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{models.map(m => (
          <Card key={m.id} className={m.status === 'active' ? 'border-green-300 dark:border-green-700' : ''}><CardContent className="pt-4"><div className="flex items-center justify-between mb-2"><span className="font-medium text-sm">{m.name}</span><Badge variant={m.status === 'active' ? 'default' : 'secondary'} className={m.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : ''}>{m.status === 'active' ? t('sllm.finetune.active') : m.status === 'training' ? t('sllm.finetune.training') : m.status === 'available' ? t('sllm.finetune.available') : t('sllm.finetune.planned')}</Badge></div><div className="text-xs text-muted-foreground">{m.provider}</div><div className="text-xs text-muted-foreground mt-1">유형: {m.type === 'cloud' ? t('sllm.finetune.cloud') : t('sllm.finetune.local')}</div><div className="flex gap-1 mt-2 flex-wrap">{m.capabilities?.map((c: string) => (<Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>))}</div></CardContent></Card>
        ))}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div><h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Database className="w-5 h-5" /> {t('sllm.finetune.datasets')}</h3>
          <Card><CardContent className="pt-5 space-y-4">
            <div className="space-y-3"><Input value={newDatasetName} onChange={e => setNewDatasetName(e.target.value)} placeholder={t('sllm.finetune.datasetName')} /><Input value={newDatasetDesc} onChange={e => setNewDatasetDesc(e.target.value)} placeholder={t('sllm.finetune.description')} />
              <Select value={newDatasetSource} onValueChange={setNewDatasetSource}><SelectTrigger><SelectValue placeholder={t('sllm.finetune.dataSource')} /></SelectTrigger><SelectContent><SelectItem value="risk_assessments">{t('sllm.finetune.source.risk')}</SelectItem><SelectItem value="compliance_reports">{t('sllm.finetune.source.compliance')}</SelectItem><SelectItem value="ai_services">{t('sllm.finetune.source.aiServices')}</SelectItem><SelectItem value="chat_history">{t('sllm.finetune.source.chatHistory')}</SelectItem></SelectContent></Select>
              <Button onClick={handleCreateDataset} className="w-full gap-1.5"><Plus className="w-4 h-4" /> {t('sllm.finetune.createDataset')}</Button>
            </div>
            <div className="space-y-2 mt-4">{datasets.length === 0 ? (<div className="text-center py-6 text-sm text-muted-foreground">{t('sllm.finetune.noDatasets')}</div>) : datasets.map(ds => (<div key={ds.id} className="p-3 border rounded-lg flex items-center justify-between"><div><div className="font-medium text-sm">{ds.name}</div><div className="text-xs text-muted-foreground mt-0.5">{ds.source_type} · {ds.record_count}건 · {ds.format}</div></div><div className="flex gap-1"><Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handlePreview(ds.id)}><Eye className="w-3.5 h-3.5" /></Button><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteDataset(ds.id)}><Trash2 className="w-3.5 h-3.5" /></Button></div></div>))}</div>
          </CardContent></Card>
        </div>

        <div><h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Zap className="w-5 h-5" /> {t('sllm.finetune.jobs')}</h3>
          <Card><CardContent className="pt-5 space-y-4">
            <div className="space-y-3"><Input value={newJobName} onChange={e => setNewJobName(e.target.value)} placeholder={t('sllm.finetune.jobName')} />
              <Select value={newJobModel} onValueChange={setNewJobModel}><SelectTrigger><SelectValue placeholder={t('sllm.finetune.baseModel')} /></SelectTrigger><SelectContent>{models.map(m => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}</SelectContent></Select>
              <Select value={newJobDataset} onValueChange={setNewJobDataset}><SelectTrigger><SelectValue placeholder={t('sllm.finetune.selectDataset')} /></SelectTrigger><SelectContent>{datasets.map(ds => (<SelectItem key={ds.id} value={ds.id}>{ds.name} ({ds.record_count}건)</SelectItem>))}</SelectContent></Select>
              <Button onClick={handleCreateJob} className="w-full gap-1.5 bg-purple-600 hover:bg-purple-700"><Zap className="w-4 h-4" /> {t('sllm.finetune.startJob')}</Button>
            </div>
            <div className="space-y-2 mt-4">{jobs.length === 0 ? (<div className="text-center py-6 text-sm text-muted-foreground">{t('sllm.finetune.noJobs')}</div>) : jobs.map(job => (<div key={job.id} className="p-3 border rounded-lg"><div className="flex items-center justify-between"><div className="font-medium text-sm">{job.name}</div><Badge variant={job.status === 'completed' ? 'default' : 'secondary'} className={job.status === 'completed' ? 'bg-green-100 text-green-700' : job.status === 'running' ? 'bg-blue-100 text-blue-700' : ''}>{job.status === 'queued' ? t('sllm.finetune.status.queued') : job.status === 'running' ? t('sllm.finetune.status.running') : job.status === 'completed' ? t('sllm.finetune.status.completed') : job.status}</Badge></div><div className="text-xs text-muted-foreground mt-1">모델: {job.model_base} · 데이터셋: {job.dataset_id}</div>{job.status === 'running' && (<Progress value={job.progress} className="h-1.5 mt-2" />)}</div>))}</div>
          </CardContent></Card>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}><DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto"><DialogHeader><DialogTitle>{t('sllm.finetune.previewTitle')}</DialogTitle><DialogDescription>{previewData?.total || 0}{t('sllm.finetune.previewDesc')}</DialogDescription></DialogHeader><div className="space-y-2">{previewData?.preview?.map((item: any, i: number) => (<div key={i} className="p-3 border rounded-lg text-sm"><div className="font-medium text-xs text-muted-foreground mb-1">{t('sllm.finetune.input')}:</div><div className="text-sm mb-2">{item.input}</div><div className="font-medium text-xs text-muted-foreground mb-1">{t('sllm.finetune.output')}:</div><div className="text-sm">{item.output}</div></div>))}</div></DialogContent></Dialog>
    </div>
  );
};

// =============================================
// 메인 페이지
// =============================================
const SLLMStudio: React.FC = () => {
  const { t } = useI18n();
  const [stats, setStats] = useState<any>({});
  const [activeSector, setActiveSector] = useState<SectorId>('smart');

  // =============================================
  // 거버넌스 데이터 플로우 데이터 (i18n)
  // =============================================
  const SECTORS = useMemo(() => [
    { id: 'smart', name: t('sllm.sector.smart.name'), sub: t('sllm.sector.smart.sub'), color: '#059669', icon: '⚡', iconComponent: Zap },
    { id: 'renew', name: t('sllm.sector.renew.name'), sub: t('sllm.sector.renew.sub'), color: '#0D9488', icon: '🌿', iconComponent: Factory },
    { id: 'bank', name: t('sllm.sector.bank.name'), sub: t('sllm.sector.bank.sub'), color: '#2563EB', icon: '🏦', iconComponent: Landmark },
    { id: 'insur', name: t('sllm.sector.insur.name'), sub: t('sllm.sector.insur.sub'), color: '#7C3AED', icon: '🛡', iconComponent: ShieldCheck },
  ], [t]);

  const PROCESS_STEPS: Record<SectorId, { phase: string; steps: { name: string; input: string; output: string; owner: string; sla: string }[] }[]> = useMemo(() => ({
    smart: [
      { phase: t('sllm.phase.planning'), steps: [
        { name: '에너지 서비스 기획 요청', input: '서비스 기획 문서', output: '기획 요청 (승인)', owner: '현업부서', sla: '5일' },
        { name: 'BA 수령 및 승인', input: '기획 요청', output: 'BA 검토 문서', owner: 'BA팀', sla: '2일' },
        { name: 'IT 관리자 수령', input: 'BA 검토 문서', output: 'IT 기술 검토 문서', owner: 'IT팀', sla: '2일' },
        { name: 'PMO 승인', input: 'IT 검토 문서', output: 'PMO 승인 문서', owner: 'PMO', sla: '1일' },
        { name: '스마트그리드 AI 서비스 기획', input: 'AMI 데이터 명세', output: 'AI 기획 문서', owner: 'AI전략팀', sla: '10일' },
      ]},
      { phase: t('sllm.phase.development'), steps: [
        { name: '수요 예측 모델 요구사항 정의', input: 'AI 기획 문서', output: '요구사항 명세', owner: 'AI전략팀', sla: '5일' },
        { name: '수요 예측 AI 모델 개발', input: 'AMI/SCADA 데이터', output: '학습 모델', owner: 'AI개발팀', sla: '30~60일' },
      ]},
      { phase: t('sllm.phase.evaluation'), steps: [
        { name: '위험 식별/평가 (R-01~R-18)', input: 'AI 기획 문서, 모델 정보', output: '위험 평가 문서 (별첨 3-2)', owner: 'AI거버넌스팀', sla: '5일' },
        { name: 'AI RMF 평가 (32개 질문)', input: '위험 평가 문서', output: '위험 등급 평가 문서 (별첨 4)', owner: 'AI거버넌스팀', sla: '3일' },
        { name: '계통 안전 판정', input: '모델 결과', output: '안전 보고서', owner: 'AI거버넌스팀', sla: '3일' },
        { name: '운영 전 백테스팅', input: '테스트 셋', output: '검증 보고서', owner: 'QA팀', sla: '5~10일' },
      ]},
      { phase: t('sllm.phase.deployment'), steps: [
        { name: '위험 관리 계획 수립', input: '위험 평가 결과', output: '위험 관리 계획', owner: '위험관리팀', sla: '3일' },
        { name: '승인/배포', input: '검증 결과', output: '배포 패키지', owner: 'PMO', sla: '2일' },
        { name: '실시간 운영/모니터링', input: '실시간 전력 데이터', output: '예측 결과 + EMS 연동', owner: '운영팀', sla: '지속' },
      ]},
    ],
    renew: [
      { phase: t('sllm.phase.planning'), steps: [
        { name: '신재생에너지 서비스 기획 요청', input: '서비스 기획 문서', output: '기획 요청 (승인)', owner: '현업부서', sla: '5일' },
        { name: 'BA/IT 수령 및 승인', input: '요청 문서', output: 'PMO 승인 문서', owner: 'BA/IT/PMO', sla: '5일' },
        { name: '신재생에너지 AI 서비스 기획', input: '발전소 현황', output: 'AI 기획 문서', owner: 'AI전략팀', sla: '10일' },
      ]},
      { phase: t('sllm.phase.development'), steps: [
        { name: '발전량 예측 모델 요구사항', input: 'AI 기획 문서', output: '요구사항 명세', owner: 'AI전략팀', sla: '5일' },
        { name: '발전량 예측·ESS AI 개발', input: '기상/인버터 데이터', output: '학습 모델', owner: 'AI개발팀', sla: '30~60일' },
      ]},
      { phase: t('sllm.phase.evaluation'), steps: [
        { name: '위험 식별/평가 (R-01~R-18)', input: 'AI 기획 문서', output: '위험 평가 문서', owner: 'AI거버넌스팀', sla: '5일' },
        { name: 'AI RMF 평가 (32개 질문)', input: '위험 평가 문서', output: '위험 등급 평가 문서', owner: 'AI거버넌스팀', sla: '3일' },
        { name: '계통 연계 안전 검증', input: '시뮬레이션 데이터', output: '검증 보고서', owner: 'QA팀', sla: '5~10일' },
      ]},
      { phase: t('sllm.phase.deployment'), steps: [
        { name: '위험 관리 계획 수립', input: '위험 평가 결과', output: '위험 관리 계획', owner: '위험관리팀', sla: '3일' },
        { name: '실시간 운영/탄소관리', input: '실시간 발전 데이터', output: '예측 + REC', owner: '운영팀', sla: '지속' },
      ]},
    ],
    bank: [
      { phase: t('sllm.phase.planning'), steps: [
        { name: '은행 서비스 기획 요청', input: '서비스 기획 문서', output: '기획 요청 (승인)', owner: '현업부서', sla: '5일' },
        { name: 'BA/IT/PMO 승인', input: '요청 문서', output: 'PMO 승인 문서', owner: 'BA/IT/PMO', sla: '5일' },
        { name: '신용/AML/FDS AI 기획', input: '사업 현황 문서', output: 'AI 기획 문서', owner: 'AI전략팀', sla: '10일' },
      ]},
      { phase: t('sllm.phase.development'), steps: [
        { name: '신용평가 모델 요구사항', input: 'AI 기획 문서', output: '요구사항 명세', owner: 'AI전략팀', sla: '5일' },
        { name: '신용평가/AML AI 개발', input: 'CBS/거래 DB', output: '학습 모델', owner: 'AI개발팀', sla: '30~60일' },
      ]},
      { phase: t('sllm.phase.evaluation'), steps: [
        { name: '위험 식별/평가 (R-01~R-18)', input: 'AI 기획 문서', output: '위험 평가 문서', owner: 'AI거버넌스팀', sla: '5일' },
        { name: 'AI RMF 평가 (32개 질문)', input: '위험 평가 문서', output: '위험 등급 평가 문서', owner: 'AI거버넌스팀', sla: '3일' },
        { name: '금융소비자보호법 준수/공정성 검증', input: '모델 결과', output: '준수 보고서', owner: '컴플라이언스', sla: '5일' },
        { name: '운영 전 백테스팅', input: '테스트 셋', output: '검증 보고서', owner: 'QA팀', sla: '5~10일' },
      ]},
      { phase: t('sllm.phase.deployment'), steps: [
        { name: '위험 관리 계획 수립', input: '위험 평가 결과', output: '위험 관리 계획', owner: '위험관리팀', sla: '3일' },
        { name: '실시간 운영', input: '실시간 거래', output: '평가/탐지 결과', owner: '운영팀', sla: '지속' },
      ]},
    ],
    insur: [
      { phase: t('sllm.phase.planning'), steps: [
        { name: '보험 서비스 기획 요청', input: '서비스 기획 문서', output: '기획 요청 (승인)', owner: '현업부서', sla: '5일' },
        { name: 'BA/IT/PMO 승인', input: '요청 문서', output: 'PMO 승인 문서', owner: 'BA/IT/PMO', sla: '5일' },
        { name: '인수/부정탐지 AI 기획', input: '사업 현황 문서', output: 'AI 기획 문서', owner: 'AI전략팀', sla: '10일' },
      ]},
      { phase: t('sllm.phase.development'), steps: [
        { name: '인수 모델 요구사항', input: 'AI 기획 문서', output: '요구사항 명세', owner: 'AI전략팀', sla: '5일' },
        { name: '인수/부정탐지 AI 개발', input: '계약/청구 DB', output: '학습 모델', owner: 'AI개발팀', sla: '30~60일' },
      ]},
      { phase: t('sllm.phase.evaluation'), steps: [
        { name: '위험 식별/평가 (R-01~R-18)', input: 'AI 기획 문서', output: '위험 평가 문서', owner: 'AI거버넌스팀', sla: '5일' },
        { name: 'AI RMF 평가 (32개 질문)', input: '위험 평가 문서', output: '위험 등급 평가 문서', owner: 'AI거버넌스팀', sla: '3일' },
        { name: '보험업법 준수 검증', input: '모델 결과', output: '준수 보고서', owner: '컴플라이언스', sla: '5일' },
        { name: '운영 전 백테스팅', input: '테스트 셋', output: '검증 보고서', owner: 'QA팀', sla: '5~10일' },
      ]},
      { phase: t('sllm.phase.deployment'), steps: [
        { name: '위험 관리 계획 수립', input: '위험 평가 결과', output: '위험 관리 계획', owner: '위험관리팀', sla: '3일' },
        { name: '실시간 운영', input: '실시간 청구', output: '인수/부정탐지 결과', owner: '운영팀', sla: '지속' },
      ]},
    ],
  }), [t]);

  const RISK_ITEMS = useMemo(() => [
    { id: 'R-01', name: t('sllm.risk.r01'), cat: t('sllm.risk.cat.malicious'), smart: 3, renew: 3, bank: 3, insur: 3 },
    { id: 'R-02', name: t('sllm.risk.r02'), cat: t('sllm.risk.cat.malicious'), smart: 1, renew: 1, bank: 3, insur: 3 },
    { id: 'R-03', name: t('sllm.risk.r03'), cat: t('sllm.risk.cat.malicious'), smart: 1, renew: 1, bank: 3, insur: 1 },
    { id: 'R-04', name: t('sllm.risk.r04'), cat: t('sllm.risk.cat.malicious'), smart: 1, renew: 1, bank: 3, insur: 3 },
    { id: 'R-05', name: t('sllm.risk.r05'), cat: t('sllm.risk.cat.malicious'), smart: 3, renew: 1, bank: 3, insur: 3 },
    { id: 'R-06', name: t('sllm.risk.r06'), cat: t('sllm.risk.cat.malicious'), smart: 3, renew: 3, bank: 1, insur: 1 },
    { id: 'R-10', name: t('sllm.risk.r10'), cat: t('sllm.risk.cat.malfunction'), smart: 3, renew: 3, bank: 3, insur: 3 },
    { id: 'R-11', name: t('sllm.risk.r11'), cat: t('sllm.risk.cat.malfunction'), smart: 1, renew: 1, bank: 3, insur: 3 },
    { id: 'R-12', name: t('sllm.risk.r12'), cat: t('sllm.risk.cat.malfunction'), smart: 3, renew: 3, bank: 3, insur: 1 },
    { id: 'R-13', name: t('sllm.risk.r13'), cat: t('sllm.risk.cat.malfunction'), smart: 1, renew: 1, bank: 3, insur: 3 },
    { id: 'R-14', name: t('sllm.risk.r14'), cat: t('sllm.risk.cat.malfunction'), smart: 3, renew: 3, bank: 1, insur: 1 },
    { id: 'R-15', name: t('sllm.risk.r15'), cat: t('sllm.risk.cat.malfunction'), smart: 3, renew: 3, bank: 3, insur: 3 },
    { id: 'R-16', name: t('sllm.risk.r16'), cat: t('sllm.risk.cat.malfunction'), smart: 3, renew: 3, bank: 3, insur: 3 },
  ], [t]);

  const RMF_PRINCIPLES = useMemo(() => [
    { name: t('sllm.rmf.legality'), items: 6, score: 20, desc: t('sllm.rmf.legalityDesc'), color: '#2563EB' },
    { name: t('sllm.rmf.reliability'), items: 11, score: 30, desc: t('sllm.rmf.reliabilityDesc'), color: '#0D9488' },
    { name: t('sllm.rmf.goodFaith'), items: 4, score: 20, desc: t('sllm.rmf.goodFaithDesc'), color: '#7C3AED' },
    { name: t('sllm.rmf.security'), items: 11, score: 30, desc: t('sllm.rmf.securityDesc'), color: '#DC2626' },
  ], [t]);

  const PHASE_COLORS: Record<string, string> = useMemo(() => ({
    [t('sllm.phase.planning')]: '#E87722',
    [t('sllm.phase.development')]: '#1B2A4A',
    [t('sllm.phase.evaluation')]: '#0D9488',
    [t('sllm.phase.deployment')]: '#059669',
  }), [t]);

  useEffect(() => {
    sllmAPI.getStats().then(res => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Brain className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('sllm.title')}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('sllm.header.desc')}
                </p>
              </div>
            </div>
          </div>
          {/* Sector Selector (compact) */}
          <div className="flex gap-1.5">
            {SECTORS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSector(s.id as SectorId)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                  activeSector === s.id
                    ? "text-white border-transparent"
                    : "text-muted-foreground border-border hover:border-border/80"
                )}
                style={activeSector === s.id ? { backgroundColor: s.color } : {}}
              >
                {s.icon} {s.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {[
            { title: t('sllm.stat.templates'), value: stats.templates || 0, change: '+0', trend: 'up' as const },
            { title: t('sllm.stat.datasets'), value: stats.datasets || 0, change: '+0', trend: 'up' as const },
            { title: t('sllm.stat.totalJobs'), value: stats.totalJobs || 0, change: '+0', trend: 'up' as const },
            { title: t('sllm.stat.sectors'), value: 4, change: t('sllm.stat.energyFinance'), trend: 'up' as const },
            { title: t('sllm.stat.rmfQuestions'), value: 32, change: t('sllm.stat.fullScore'), trend: 'up' as const },
            { title: t('sllm.stat.riskItems'), value: 13, change: t('sllm.stat.riskRange'), trend: 'up' as const },
          ].map((m, i) => (
            <motion.div key={i} variants={staggerItem}>
              <MetricCard title={m.title} value={m.value} change={m.change} trend={m.trend} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Activity className="h-3.5 w-3.5" /> {t('sllm.overview')}
            </TabsTrigger>
            <TabsTrigger value="flow" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Workflow className="h-3.5 w-3.5" /> {t('sllm.serviceFlow')}
            </TabsTrigger>
            <TabsTrigger value="risk" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <AlertTriangle className="h-3.5 w-3.5" /> {t('sllm.riskMapping')}
            </TabsTrigger>
            <TabsTrigger value="rmf" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Shield className="h-3.5 w-3.5" /> {t('sllm.rmfEval')}
            </TabsTrigger>
            <TabsTrigger value="arch" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Layers className="h-3.5 w-3.5" /> {t('sllm.architecture')}
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5" /> {t('sllm.promptEng')}
            </TabsTrigger>
            <TabsTrigger value="finetuning" className="data-[state=active]:bg-background gap-1.5 text-xs">
              <Zap className="h-3.5 w-3.5" /> {t('sllm.fineTuning')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <GovernanceOverview activeSector={activeSector} setActiveSector={setActiveSector} SECTORS={SECTORS} PROCESS_STEPS={PROCESS_STEPS} RMF_PRINCIPLES={RMF_PRINCIPLES} PHASE_COLORS={PHASE_COLORS} />
          </TabsContent>

          <TabsContent value="flow" className="mt-6">
            <ServiceFlowTab activeSector={activeSector} SECTORS={SECTORS} PROCESS_STEPS={PROCESS_STEPS} PHASE_COLORS={PHASE_COLORS} />
          </TabsContent>

          <TabsContent value="risk" className="mt-6">
            <RiskAssessmentTab activeSector={activeSector} SECTORS={SECTORS} RISK_ITEMS={RISK_ITEMS} />
          </TabsContent>

          <TabsContent value="rmf" className="mt-6">
            <RMFEvaluationTab RMF_PRINCIPLES={RMF_PRINCIPLES} />
          </TabsContent>

          <TabsContent value="arch" className="mt-6">
            <ArchitectureTab activeSector={activeSector} setActiveSector={setActiveSector} SECTORS={SECTORS} />
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
            <PromptEditor />
          </TabsContent>

          <TabsContent value="finetuning" className="mt-6">
            <FineTuningPanel />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-[11px] text-muted-foreground border-t pt-4">
          {t('sllm.footer')}
        </div>
      </div>
    </Layout>
  );
};

export default SLLMStudio;
