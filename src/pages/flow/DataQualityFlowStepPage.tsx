import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Brain,
  Sparkles,
  ShieldCheck,
  Zap,
  Bot,
  MessageSquare,
  BookOpen,
  Wand2,
  Search,
  Save,
  Paperclip,
  FileText,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Database,
  BarChart3,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  getDqFlowStepById,
  DQ_FLOW_STEPS,
  DQ_JOURNEY_STEPS,
  getDqJourneyIndex,
} from "@/lib/dq-flow";
import { getDqFlowRequirements } from "@/lib/dq-flow-requirements";

/** Journey Stepper (inline) */
function DqJourneyStepper({ currentStepId }: { currentStepId: string }) {
  const currentIndex = getDqJourneyIndex(currentStepId);
  return (
    <div className="w-full py-6 mb-4">
      <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4">
        <div className="absolute left-6 right-6 top-5 h-1 bg-secondary -z-10 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-700 ease-out"
            style={{ width: `${(currentIndex / (DQ_JOURNEY_STEPS.length - 1)) * 100}%` }}
          />
        </div>
        {DQ_JOURNEY_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10",
                isCompleted ? "bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30" :
                isCurrent ? "bg-background border-cyan-500 text-cyan-600 shadow-xl shadow-cyan-500/20 scale-110" :
                "bg-background border-secondary text-muted-foreground"
              )}>
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-bold">{index + 1}</span>}
              </div>
              <div className={cn(
                "absolute top-12 w-28 text-center transition-all duration-500",
                isCurrent ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
              )}>
                <span className={cn("text-xs font-bold block", isCurrent ? "text-cyan-600" : "text-muted-foreground")}>
                  {step.title}
                </span>
              </div>
              {isCurrent && (
                <div className="absolute top-12 w-28 text-center">
                  <span className="text-xs font-bold block text-cyan-600">{step.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DataQualityFlowStepPage() {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [userInputs, setUserInputs] = useState<Record<string, {
    comment: string; regulation: string; files?: File[];
    selectedOption?: string;
    monitoring?: { indicator: string; threshold: string; period: string };
  }>>({});
  const [isLocked, setIsLocked] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<any>(null);
  const [processingState, setProcessingState] = useState<Record<string, string>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const requirements = stepId ? getDqFlowRequirements(stepId) : [];
  const step = stepId ? getDqFlowStepById(stepId) : undefined;

  useEffect(() => {
    if (!stepId) return;
    const saved = localStorage.getItem(`dq_flow_${stepId}`);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setCheckedItems(p.checkedItems || {});
        setUserInputs(p.userInputs || {});
        setIsLocked(p.isLocked || false);
      } catch { setCheckedItems({}); setUserInputs({}); }
    } else { setCheckedItems({}); setUserInputs({}); setIsLocked(false); }
    setConsultResult(null); setIsConsulting(false); setProcessingState({});
  }, [stepId]);

  if (!stepId || !step) {
    navigate("/tech-review/dq-flow/dq-plan", { replace: true });
    return null;
  }

  const nextPath = step.nextPath;
  const prevPath = step.prevPath;

  const handleSave = () => {
    const d = { checkedItems, userInputs: Object.keys(userInputs).reduce((a, k) => { const { files, ...r } = userInputs[k]; a[k] = r; return a; }, {} as any), isLocked };
    localStorage.setItem(`dq_flow_${stepId}`, JSON.stringify(d));
    toast({ title: "임시 저장 완료", description: "작성 내용이 저장되었습니다." });
  };

  const stepOrder = Object.keys(DQ_FLOW_STEPS).indexOf(stepId);
  const totalSteps = Object.keys(DQ_FLOW_STEPS).length;
  const progress = totalSteps > 0 ? Math.round(((stepOrder + 1) / totalSteps) * 100) : 0;

  const handleCheck = (id: string, c: boolean) => setCheckedItems(p => ({ ...p, [id]: c }));
  const handleInputChange = (id: string, field: "comment" | "regulation", v: string) => setUserInputs(p => ({ ...p, [id]: { ...p[id], [field]: v } }));
  const handleMonitoringChange = (id: string, field: "indicator" | "threshold" | "period", v: string) => setUserInputs(p => ({ ...p, [id]: { ...p[id], monitoring: { ...(p[id]?.monitoring || { indicator: "", threshold: "", period: "" }), [field]: v } } }));
  const handleSelectionChange = (id: string, v: string) => setUserInputs(p => ({ ...p, [id]: { ...p[id], selectedOption: v } }));

  const handleAction = (id: string, action: string) => {
    if (["approve", "confirm", "deploy", "request_approval"].includes(action))
      toast({ title: "알림 발송", description: "담당자에게 시스템 알림이 발송되었습니다." });
    if (action === "request_revision" || action === "reject")
      toast({ title: "보완 요청", description: "보완 요청 알림이 발송되었습니다.", variant: "destructive" });
    if (action === "save") toast({ title: "저장 완료" });
    if (["apply", "confirm", "approve", "deploy", "request_approval"].includes(action)) {
      setIsLocked(true);
      toast({ title: "제출 완료", description: "수정이 제한됩니다." });
    }
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUserInputs(p => ({ ...p, [id]: { ...p[id], files: [...(p[id]?.files || []), ...Array.from(e.target.files!)] } }));
      toast({ title: "파일 첨부 완료" });
    }
  };
  const triggerFileUpload = (id: string) => { if (!isLocked) fileInputRefs.current[id]?.click(); };

  const handleAutoWrite = (id: string, featureName: string) => {
    setProcessingState(p => ({ ...p, [id]: "generating" }));
    setTimeout(() => {
      const mock = `[AI 자동생성] '${featureName}'에 대한 분석 결과입니다.\n\n1. 현재 데이터셋의 해당 지표는 기준치를 충족하고 있습니다.\n2. 일부 컬럼에서 결측률 0.05% 초과가 감지되었으며, 평균 대치를 권장합니다.\n3. 관련 규정: TTA-2023 요구사항 05, ISO 8000-61 참고`;
      handleInputChange(id, "comment", mock);
      setProcessingState(p => ({ ...p, [id]: "" }));
    }, 1500);
  };

  const handleSearchRegulation = (id: string) => {
    setProcessingState(p => ({ ...p, [id]: "searching" }));
    setTimeout(() => {
      handleInputChange(id, "regulation", "TTA-2023 요구사항 04/05/06, ISO 8000-61 (Data Quality), ISO/IEC 25012 (Data Quality Model), 개인정보보호법 제3조");
      setProcessingState(p => ({ ...p, [id]: "" }));
    }, 1500);
  };

  const handleConsult = () => {
    setIsConsulting(true); setConsultResult(null);
    setTimeout(() => {
      setIsConsulting(false);
      setConsultResult({
        quality: `현재 단계 '${step.title}'에 대한 분석: 데이터 완전성 98.5%로 목표(99%) 근접. DS-002(고객정보) 데이터셋의 결측률이 1.0%로 가장 높아 우선 처리를 권장합니다.`,
        anomaly: "이상 탐지 규칙 87개 중 82개 통과(94.3%). 범위 초과(Out of Range) 항목 892건이 가장 높은 심각도로, 금액 필드의 음수값 검증 규칙 추가를 권장합니다.",
        bias: "성별 표현도 불균형(남 58.3% vs 여 41.7%) 감지. DI(Disparate Impact) = 0.72로 4/5 규칙(≥0.80) 미충족. SMOTE 오버샘플링 적용 후 DI 0.89로 개선 가능합니다.",
        recommendation: "TTA-2023 요구사항 06 기반 편향성 완화 조치를 우선 수행하고, 완화 후 교차 분석(성별×연령)을 추가로 수행하는 것을 권장합니다.",
      });
    }, 2500);
  };

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-4 md:px-8">
        {/* Journey Stepper */}
        <DqJourneyStepper currentStepId={stepId} />

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border shadow-2xl bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 min-h-[280px] flex items-center justify-center text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
          <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl px-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 text-xs">{step.phase}</Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">Step {stepOrder + 1} / {totalSteps}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {step.title}
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/80 leading-relaxed break-keep max-w-2xl">
              {step.description}
            </p>
          </div>
        </motion.div>

        {/* Action Bar */}
        <div className="flex justify-end gap-3 pb-2">
          <Button variant="outline" size="lg" onClick={handleSave} disabled={isLocked} className="gap-2 rounded-full border-primary/20 hover:bg-primary/5">
            <Save className="w-4 h-4" /> 임시 저장
          </Button>
          {nextPath && (
            <Button variant="outline" size="lg" onClick={() => navigate(nextPath)} className="gap-2 rounded-full border-cyan-500/50 text-cyan-700 hover:bg-cyan-50">
              다음 단계 <ChevronRight className="w-4 h-4" />
            </Button>
          )}
          <Button size="lg" onClick={handleConsult} disabled={isConsulting || isLocked}
            className="rounded-full bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg border-0">
            {isConsulting ? (<><Brain className="w-5 h-5 mr-2 animate-pulse" />AI 분석 중...</>) : (<><Sparkles className="w-5 h-5 mr-2" />AI 데이터 컨설팅</>)}
          </Button>
        </div>

        {/* Progress */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Content */}
          <motion.div className="xl:col-span-8 space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {requirements.length > 0 ? (
              <div className="grid gap-6">
                {requirements.map((feat, idx) => {
                  const id = `req-${idx}`;
                  const isChecked = !!checkedItems[id];
                  const isGenerating = processingState[id] === "generating";
                  const isSearching = processingState[id] === "searching";
                  const attachedFiles = userInputs[id]?.files || [];

                  return (
                    <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className={cn("group relative rounded-[2rem] border bg-card/60 backdrop-blur-sm p-1 shadow-sm transition-all duration-300 overflow-hidden",
                        isChecked ? "border-green-500/30 bg-green-50/10 shadow-lg shadow-green-500/5 ring-1 ring-green-500/10" : "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
                      )}>
                      <div className="bg-background/80 rounded-[1.8rem] p-6 h-full">
                        {/* Header */}
                        <div className="flex items-start gap-5 mb-6">
                          <div className={cn("mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 cursor-pointer",
                            isChecked ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20" : "border-muted-foreground/30 text-muted-foreground/30 bg-secondary/50"
                          )} onClick={() => !isLocked && handleCheck(id, !isChecked)}>
                            <Checkbox id={id} checked={isChecked} onCheckedChange={(c) => handleCheck(id, c as boolean)} className="opacity-0 absolute w-8 h-8 cursor-pointer" disabled={isLocked} />
                            {isChecked && <CheckCircle2 className="w-5 h-5" />}
                          </div>
                          <div className="space-y-1.5 flex-1">
                            <label htmlFor={id} className={cn("text-xl font-bold cursor-pointer transition-colors block leading-tight",
                              isChecked ? "text-green-700" : "text-foreground group-hover:text-cyan-600"
                            )}>{feat.featureName}</label>
                            <p className="text-sm text-muted-foreground font-medium">{feat.description}</p>
                            <div className="relative mt-3 p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-background border border-border/40 text-sm text-foreground/80 leading-relaxed">
                              <div className="absolute -left-1 top-4 w-1 h-6 bg-cyan-400/50 rounded-r-full" />
                              <span className="font-bold text-cyan-600/80 mr-2 text-xs uppercase tracking-wide">Requirement</span>
                              {feat.requirement}
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Content */}
                        <div className="border-t border-border/40 pt-4 space-y-4">
                          {feat.uiType === "monitoring" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-secondary/20 p-4 rounded-xl">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">지표 (Indicator)</label>
                                <Input placeholder="예: Completeness, Accuracy" value={userInputs[id]?.monitoring?.indicator || ""} onChange={(e) => handleMonitoringChange(id, "indicator", e.target.value)} className="bg-background" disabled={isLocked} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">임계값 (Threshold)</label>
                                <Input placeholder="예: ≥99%, < 0.1%" value={userInputs[id]?.monitoring?.threshold || ""} onChange={(e) => handleMonitoringChange(id, "threshold", e.target.value)} className="bg-background" disabled={isLocked} />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">주기 (Period)</label>
                                <Input placeholder="예: 일간, 주간, 실시간" value={userInputs[id]?.monitoring?.period || ""} onChange={(e) => handleMonitoringChange(id, "period", e.target.value)} className="bg-background" disabled={isLocked} />
                              </div>
                            </div>
                          )}

                          {feat.uiType === "selection" && feat.options && (
                            <div className="mb-4">
                              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">선택 항목</label>
                              <Select onValueChange={(v) => handleSelectionChange(id, v)} value={userInputs[id]?.selectedOption} disabled={isLocked}>
                                <SelectTrigger className="w-full md:w-[400px]"><SelectValue placeholder="선택하세요..." /></SelectTrigger>
                                <SelectContent>{feat.options.map((opt, i) => (<SelectItem key={i} value={opt}>{opt}</SelectItem>))}</SelectContent>
                              </Select>
                            </div>
                          )}

                          {feat.uiType !== "upload_only" && feat.uiType !== "dashboard_link" && (
                            <div className="grid grid-cols-1 gap-6">
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <MessageSquare className="w-3.5 h-3.5 text-cyan-500" /><span>상세 내용 / 검토 의견</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => triggerFileUpload(id)} disabled={isLocked}>
                                      <Paperclip className="w-3.5 h-3.5 mr-1.5" />파일 첨부
                                    </Button>
                                    <input type="file" className="hidden" ref={el => fileInputRefs.current[id] = el} onChange={(e) => handleFileUpload(id, e)} multiple disabled={isLocked} />
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50" onClick={() => handleAutoWrite(id, feat.featureName)} disabled={isGenerating || isLocked}>
                                      <Wand2 className={cn("w-3 h-3 mr-1.5", isGenerating && "animate-spin")} />{isGenerating ? "생성 중..." : "AI 자동작성"}
                                    </Button>
                                  </div>
                                </div>
                                <Textarea placeholder={feat.placeholder || "여기에 내용을 작성하세요..."} className="min-h-[120px] text-sm resize-y bg-background/50 focus:bg-background border-border/60 focus:border-cyan-500/50 shadow-inner rounded-xl" value={userInputs[id]?.comment || ""} onChange={(e) => handleInputChange(id, "comment", e.target.value)} disabled={isLocked} />
                              </div>
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <BookOpen className="w-3.5 h-3.5 text-blue-500" /><span>관련 규정 / 표준</span>
                                  </div>
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50" onClick={() => handleSearchRegulation(id)} disabled={isSearching || isLocked}>
                                    <Search className={cn("w-3 h-3 mr-1.5", isSearching && "animate-pulse")} />{isSearching ? "검색 중..." : "규정 검색"}
                                  </Button>
                                </div>
                                <div className="relative">
                                  <Input placeholder="관련 규정을 입력하거나 AI 검색을 이용하세요..." className="h-10 text-sm bg-background/50 border-border/60 focus:border-blue-500/50 rounded-xl pr-9" value={userInputs[id]?.regulation || ""} onChange={(e) => handleInputChange(id, "regulation", e.target.value)} disabled={isLocked} />
                                  <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
                                </div>
                              </div>
                            </div>
                          )}

                          {feat.uiType === "upload_only" && (
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => triggerFileUpload(id)}>
                              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                              <p className="text-sm font-medium">여기를 클릭하여 파일 업로드</p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, CSV, Excel, Parquet 지원</p>
                              <input type="file" className="hidden" ref={el => fileInputRefs.current[id] = el} onChange={(e) => handleFileUpload(id, e)} multiple disabled={isLocked} />
                            </div>
                          )}

                          {feat.uiType === "dashboard_link" && (
                            <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border">
                              <div className="text-4xl">📊</div>
                              <p className="text-sm text-center text-muted-foreground">데이터 품질 모니터링 대시보드에서 실시간 현황을 확인합니다.</p>
                              <Button onClick={() => navigate("/tech-review/data-quality")} className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                                대시보드 바로가기 <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          )}

                          {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 p-2 bg-secondary/30 rounded-lg">
                              {attachedFiles.map((file, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background text-xs border shadow-sm">
                                  <FileText className="w-3 h-3 text-cyan-500" />
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {feat.actionButtons && feat.actionButtons.length > 0 && (
                            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border/30">
                              {feat.actionButtons.map(action => {
                                let label = action, cls = "", Icon = CheckCircle2;
                                if (action === "approve") { label = "승인"; cls = "bg-green-600 hover:bg-green-700 text-white"; }
                                else if (action === "reject") { label = "반려"; cls = "bg-red-600 hover:bg-red-700 text-white"; Icon = XCircle; }
                                else if (action === "request_revision") { label = "보완 요청"; cls = "bg-amber-500 hover:bg-amber-600 text-white"; Icon = AlertTriangle; }
                                else if (action === "confirm") { label = "확정"; cls = "bg-blue-600 hover:bg-blue-700 text-white"; }
                                else if (action === "save") { label = "저장"; cls = "bg-secondary text-secondary-foreground hover:bg-secondary/80"; Icon = Save; }
                                else if (action === "deploy") { label = "배포"; cls = "bg-indigo-600 hover:bg-indigo-700 text-white"; Icon = Send; }
                                else if (action === "request_approval") { label = "승인 요청"; cls = "bg-cyan-600 hover:bg-cyan-700 text-white"; Icon = Send; }
                                else if (action === "apply") { label = "적용"; cls = "bg-emerald-600 hover:bg-emerald-700 text-white"; }
                                return (<Button key={action} size="sm" className={cls} onClick={() => handleAction(id, action)} disabled={isLocked}><Icon className="w-4 h-4 mr-2" />{label}</Button>);
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="min-h-[200px] rounded-2xl bg-muted/30 border-2 border-dashed flex items-center justify-center p-8 text-muted-foreground">
                <p>이 단계의 요구사항이 아직 정의되지 않았습니다.</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
              <Button variant="outline" size="lg" onClick={() => prevPath ? navigate(prevPath) : navigate("/tech-review/data-quality")} className="gap-2 rounded-full px-6">
                <ChevronLeft className="w-4 h-4" /> 이전 단계
              </Button>
              {nextPath ? (
                <Button size="lg" onClick={() => navigate(nextPath)} className="gap-2 rounded-full px-6 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/20">
                  다음 단계 <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate("/tech-review/data-quality")} className="gap-2 rounded-full px-6 bg-emerald-600 hover:bg-emerald-700">
                  검증 완료 - 대시보드로 <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>

          {/* Sidebar: AI Consultant */}
          <div className="xl:col-span-4 sticky top-6">
            <AnimatePresence mode="wait">
              {consultResult ? (
                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <Card className="border-0 shadow-2xl overflow-hidden bg-background/60 backdrop-blur-xl ring-1 ring-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-blue-500/5 pointer-events-none" />
                    <CardHeader className="bg-gradient-to-r from-teal-100/50 to-cyan-100/50 pb-6 border-b border-cyan-500/10 relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-700 to-cyan-700">AI 데이터 품질 컨설팅</CardTitle>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">TTA 2023 / ISO 8000 기반 분석</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5 pt-5 relative">
                      {[
                        { title: "품질 분석", icon: Database, color: "text-teal-600", bg: "bg-teal-100", content: consultResult.quality },
                        { title: "이상 탐지", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-100", content: consultResult.anomaly },
                        { title: "편향성 분석", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-100", content: consultResult.bias },
                      ].map((section) => {
                        const SIcon = section.icon;
                        return (
                          <div key={section.title} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider" style={{ color: undefined }}>
                              <div className={cn("p-1 rounded", section.bg)}><SIcon className={cn("w-3.5 h-3.5", section.color)} /></div>
                              <span className={section.color}>{section.title}</span>
                            </div>
                            <p className="text-sm text-foreground/80 bg-card/50 p-3 rounded-xl border border-border/50 leading-relaxed shadow-sm">{section.content}</p>
                          </div>
                        );
                      })}
                      <div className="pt-3 border-t border-border/50">
                        <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-cyan-600" /><span className="text-xs font-bold text-cyan-700 uppercase">권장 조치</span></div>
                        <p className="text-sm text-muted-foreground italic pl-4 border-l-2 border-cyan-200">"{consultResult.recommendation}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Card className="border-2 border-dashed h-full min-h-[500px] flex items-center justify-center bg-muted/10 backdrop-blur-sm">
                    <div className="text-center p-8 space-y-6 max-w-[280px]">
                      <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-teal-100 to-white flex items-center justify-center shadow-lg border border-cyan-200">
                          <Bot className="w-10 h-10 text-cyan-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">AI 데이터 품질 컨설턴트</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          "AI 데이터 컨설팅" 버튼을 클릭하면 현재 데이터셋에 대한 품질 분석, 이상 탐지, 편향성 검증 결과를 받아볼 수 있습니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground/80">
                        <div className="bg-background/80 p-2 rounded-lg border flex flex-col items-center gap-1"><Wand2 className="w-4 h-4 text-cyan-500" /><span>AI 자동작성</span></div>
                        <div className="bg-background/80 p-2 rounded-lg border flex flex-col items-center gap-1"><Search className="w-4 h-4 text-blue-500" /><span>규정 검색</span></div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
