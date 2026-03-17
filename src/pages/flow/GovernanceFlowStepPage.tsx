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
  GitBranch,
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { GovernanceJourneyStepper } from "@/components/flow/GovernanceJourneyStepper";
import {
  getGovFlowStepById,
  getGovPrevPath,
  GOV_FLOW_STEPS,
} from "@/lib/governance-flow";
import { getGovFlowRequirements } from "@/lib/governance-flow-requirements";
import { useI18n } from "@/lib/i18n";

export default function GovernanceFlowStepPage() {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [userInputs, setUserInputs] = useState<
    Record<
      string,
      {
        comment: string;
        regulation: string;
        files?: File[];
        selectedOption?: string;
        monitoring?: { indicator: string; threshold: string; period: string };
      }
    >
  >({});
  const [isLocked, setIsLocked] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultResult, setConsultResult] = useState<any>(null);
  const [processingState, setProcessingState] = useState<Record<string, string>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const requirements = stepId ? getGovFlowRequirements(stepId) : [];
  const step = stepId ? getGovFlowStepById(stepId) : undefined;

  // Reset state on step change
  useEffect(() => {
    if (!stepId) return;
    const savedData = localStorage.getItem(`gov_flow_${stepId}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCheckedItems(parsed.checkedItems || {});
        setUserInputs(parsed.userInputs || {});
        setIsLocked(parsed.isLocked || false);
      } catch {
        setCheckedItems({});
        setUserInputs({});
      }
    } else {
      setCheckedItems({});
      setUserInputs({});
      setIsLocked(false);
    }
    setConsultResult(null);
    setIsConsulting(false);
    setProcessingState({});
  }, [stepId]);

  if (!stepId || !step) {
    navigate("/governance/flow/request-form", { replace: true });
    return null;
  }

  const prevPath = getGovPrevPath(step);
  const hasBranch = step.nextBranch && step.nextBranch.length > 0;
  const nextPath = !hasBranch ? step.nextPath : undefined;

  const handlePrev = () => {
    if (prevPath) navigate(prevPath);
    else navigate("/governance/services");
  };

  const handleNext = (path: string) => navigate(path);

  const handleSave = () => {
    const dataToSave = {
      checkedItems,
      userInputs: Object.keys(userInputs).reduce((acc, key) => {
        const { files, ...rest } = userInputs[key];
        acc[key] = rest;
        return acc;
      }, {} as any),
      isLocked,
    };
    localStorage.setItem(`gov_flow_${stepId}`, JSON.stringify(dataToSave));
    toast({ title: "임시 저장 완료", description: "작성 내용이 저장되었습니다." });
  };

  const stepOrder = Object.keys(GOV_FLOW_STEPS).indexOf(stepId);
  const totalSteps = Object.keys(GOV_FLOW_STEPS).length;
  const progress = totalSteps > 0 ? Math.round(((stepOrder + 1) / totalSteps) * 100) : 0;

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedItems((prev) => ({ ...prev, [id]: checked }));
  };

  const handleInputChange = (id: string, field: "comment" | "regulation", value: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const handleMonitoringChange = (id: string, field: "indicator" | "threshold" | "period", value: string) => {
    setUserInputs((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        monitoring: {
          ...(prev[id]?.monitoring || { indicator: "", threshold: "", period: "" }),
          [field]: value,
        },
      },
    }));
  };

  const handleSelectionChange = (id: string, value: string) => {
    setUserInputs((prev) => ({ ...prev, [id]: { ...prev[id], selectedOption: value } }));
  };

  const handleAction = (id: string, action: string) => {
    if (["approve", "confirm", "deploy", "request_approval"].includes(action)) {
      toast({ title: "알림 발송", description: "담당자에게 시스템 알림이 발송되었습니다." });
    }
    if (action === "request_revision" || action === "reject") {
      toast({ title: "보완 요청", description: "보완 요청 알림이 발송되었습니다.", variant: "destructive" });
    }
    if (action === "save") {
      toast({ title: "저장 완료", description: "저장되었습니다." });
    }
    if (["apply", "confirm", "approve", "deploy", "request_approval"].includes(action)) {
      setIsLocked(true);
      toast({ title: "제출 완료", description: "제출이 완료되어 수정이 제한됩니다." });
      const savedData = localStorage.getItem(`gov_flow_${stepId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        parsed.isLocked = true;
        localStorage.setItem(`gov_flow_${stepId}`, JSON.stringify(parsed));
      }
    }
  };

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUserInputs((prev) => ({
        ...prev,
        [id]: { ...prev[id], files: [...(prev[id]?.files || []), ...newFiles] },
      }));
      toast({ title: "파일 첨부 완료", description: "파일이 첨부되었습니다." });
    }
  };

  const triggerFileUpload = (id: string) => {
    if (!isLocked) fileInputRefs.current[id]?.click();
  };

  const handleAutoWrite = (id: string, featureName: string) => {
    setProcessingState((prev) => ({ ...prev, [id]: "generating" }));
    setTimeout(() => {
      const mockComment = `[AI 자동생성] '${featureName}'에 대한 초기 검토 의견입니다.\n\n1. 목적 적합성: 비즈니스 요구사항과 부합\n2. 위험 요소: 데이터 편향성 관련 추가 검토 필요\n3. 규제 준수: EU AI Act Article 9 참고 권장`;
      handleInputChange(id, "comment", mockComment);
      setProcessingState((prev) => ({ ...prev, [id]: "" }));
    }, 1500);
  };

  const handleSearchRegulation = (id: string) => {
    setProcessingState((prev) => ({ ...prev, [id]: "searching" }));
    setTimeout(() => {
      handleInputChange(id, "regulation", "ISO/IEC 42001 (AI Management System), EU AI Act Article 9, 금융감독원 AI 가이드라인");
      setProcessingState((prev) => ({ ...prev, [id]: "" }));
    }, 1500);
  };

  const handleConsult = () => {
    setIsConsulting(true);
    setConsultResult(null);
    setTimeout(() => {
      setIsConsulting(false);
      setConsultResult({
        planning: "현 단계의 요구사항은 적절히 정의되어 있습니다. 데이터 민감도 분류를 추가로 수행하면 위험 식별 정확도를 높일 수 있습니다.",
        development: "ISO/IEC 42001 및 EU AI Act 기준으로 설명가능성(XAI) 요건을 충족해야 합니다. SHAP 또는 LIME 기반 설명 모듈 통합을 권장합니다.",
        operation: "운영 단계에서는 모델 드리프트 모니터링(주 1회 이상)과 편향성 재검증(분기 1회)을 의무화하는 것을 권장합니다.",
        intro: "GnG CyberGuide AI 거버넌스 프레임워크에 기반한 분석 결과입니다.",
      });
    }, 2500);
  };

  return (
    <Layout>
      <div className="max-w-[1600px] mx-auto space-y-8 pb-20 px-4 md:px-8">
        {/* Journey Stepper */}
        <GovernanceJourneyStepper currentFlowStepId={stepId} />

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden border shadow-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 min-h-[280px] flex items-center justify-center text-center"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBWNDBIMHoiLz48cGF0aCBkPSJNMjAgMjBhMSAxIDAgMSAwLTIgMCAxIDEgMCAwIDAgMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-60" />
          <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl px-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 text-xs">
                Step {stepOrder + 1} / {totalSteps}
              </Badge>
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
          <Button
            variant="outline"
            size="lg"
            onClick={handleSave}
            disabled={isLocked}
            className="gap-2 rounded-full border-primary/20 hover:bg-primary/5"
          >
            <Save className="w-4 h-4" />
            임시 저장
          </Button>

          {(nextPath || hasBranch) && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNext(nextPath || step.nextBranch![0].path)}
              className="gap-2 rounded-full border-primary/50 text-primary hover:bg-primary/10"
            >
              다음 단계
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          <Button
            size="lg"
            onClick={handleConsult}
            disabled={isConsulting || isLocked}
            className="rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg border-0"
          >
            {isConsulting ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-pulse" />
                AI 분석 중...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                AI 컨설팅
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Main Content: Requirements Checklist */}
          <motion.div
            className="xl:col-span-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {requirements.length > 0 ? (
              <div className="grid gap-6">
                {requirements.map((feat, idx) => {
                  const id = `req-${idx}`;
                  const isChecked = !!checkedItems[id];
                  const isGenerating = processingState[id] === "generating";
                  const isSearching = processingState[id] === "searching";
                  const attachedFiles = userInputs[id]?.files || [];

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className={cn(
                        "group relative rounded-[2rem] border bg-card/60 backdrop-blur-sm p-1 shadow-sm transition-all duration-300 overflow-hidden",
                        isChecked
                          ? "border-green-500/30 bg-green-50/10 shadow-lg shadow-green-500/5 ring-1 ring-green-500/10"
                          : "hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
                      )}
                    >
                      <div className="bg-background/80 rounded-[1.8rem] p-6 h-full">
                        {/* Requirement Header */}
                        <div className="flex items-start gap-5 mb-6">
                          <div
                            className={cn(
                              "mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 cursor-pointer",
                              isChecked
                                ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20"
                                : "border-muted-foreground/30 text-muted-foreground/30 bg-secondary/50"
                            )}
                            onClick={() => !isLocked && handleCheck(id, !isChecked)}
                          >
                            <Checkbox
                              id={id}
                              checked={isChecked}
                              onCheckedChange={(c) => handleCheck(id, c as boolean)}
                              className="opacity-0 absolute w-8 h-8 cursor-pointer"
                              disabled={isLocked}
                            />
                            {isChecked && <CheckCircle2 className="w-5 h-5" />}
                          </div>

                          <div className="space-y-1.5 flex-1">
                            <label
                              htmlFor={id}
                              className={cn(
                                "text-xl font-bold cursor-pointer transition-colors block leading-tight",
                                isChecked
                                  ? "text-green-700 dark:text-green-400"
                                  : "text-foreground group-hover:text-purple-600"
                              )}
                            >
                              {feat.featureName}
                            </label>
                            <p className="text-sm text-muted-foreground font-medium">{feat.description}</p>

                            {/* Requirement Guide Box */}
                            <div className="relative mt-3 p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-background border border-border/40 text-sm text-foreground/80 leading-relaxed">
                              <div className="absolute -left-1 top-4 w-1 h-6 bg-purple-400/50 rounded-r-full" />
                              <span className="font-bold text-purple-600/80 mr-2 text-xs uppercase tracking-wide">
                                Requirement
                              </span>
                              {feat.requirement}
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Content */}
                        <div className="border-t border-border/40 pt-4 space-y-4">
                          {/* Monitoring Input */}
                          {feat.uiType === "monitoring" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-secondary/20 p-4 rounded-xl">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">지표 (Indicator)</label>
                                <Input
                                  placeholder="예: Accuracy, Latency"
                                  value={userInputs[id]?.monitoring?.indicator || ""}
                                  onChange={(e) => handleMonitoringChange(id, "indicator", e.target.value)}
                                  className="bg-background"
                                  disabled={isLocked}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">임계값 (Threshold)</label>
                                <Input
                                  placeholder="예: < 200ms, > 95%"
                                  value={userInputs[id]?.monitoring?.threshold || ""}
                                  onChange={(e) => handleMonitoringChange(id, "threshold", e.target.value)}
                                  className="bg-background"
                                  disabled={isLocked}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">주기 (Period)</label>
                                <Input
                                  placeholder="예: 일간, 실시간"
                                  value={userInputs[id]?.monitoring?.period || ""}
                                  onChange={(e) => handleMonitoringChange(id, "period", e.target.value)}
                                  className="bg-background"
                                  disabled={isLocked}
                                />
                              </div>
                            </div>
                          )}

                          {/* Selection Input */}
                          {feat.uiType === "selection" && feat.options && (
                            <div className="mb-4">
                              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                                선택 항목
                              </label>
                              <Select
                                onValueChange={(val) => handleSelectionChange(id, val)}
                                value={userInputs[id]?.selectedOption}
                                disabled={isLocked}
                              >
                                <SelectTrigger className="w-full md:w-[400px]">
                                  <SelectValue placeholder="선택하세요..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {feat.options.map((opt, oIdx) => (
                                    <SelectItem key={oIdx} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          {/* Standard Inputs (Comment & Regulation) */}
                          {feat.uiType !== "upload_only" && feat.uiType !== "dashboard_link" && (
                            <div className="grid grid-cols-1 gap-6">
                              {/* Comment Section */}
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                                    <span>상세 내용 / 검토 의견</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                                      onClick={() => triggerFileUpload(id)}
                                      disabled={isLocked}
                                    >
                                      <Paperclip className="w-3.5 h-3.5 mr-1.5" />
                                      파일 첨부
                                    </Button>
                                    <input
                                      type="file"
                                      className="hidden"
                                      ref={(el) => (fileInputRefs.current[id] = el)}
                                      onChange={(e) => handleFileUpload(id, e)}
                                      multiple
                                      disabled={isLocked}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                      onClick={() => handleAutoWrite(id, feat.featureName)}
                                      disabled={isGenerating || isLocked}
                                    >
                                      <Wand2 className={cn("w-3 h-3 mr-1.5", isGenerating && "animate-spin")} />
                                      {isGenerating ? "생성 중..." : "AI 자동작성"}
                                    </Button>
                                  </div>
                                </div>
                                <Textarea
                                  placeholder={feat.placeholder || "여기에 내용을 작성하세요..."}
                                  className="min-h-[120px] text-sm resize-y bg-background/50 focus:bg-background border-border/60 focus:border-purple-500/50 shadow-inner rounded-xl transition-all"
                                  value={userInputs[id]?.comment || ""}
                                  onChange={(e) => handleInputChange(id, "comment", e.target.value)}
                                  disabled={isLocked}
                                />
                              </div>

                              {/* Regulation Section */}
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>관련 규정 / 법규</span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => handleSearchRegulation(id)}
                                    disabled={isSearching || isLocked}
                                  >
                                    <Search className={cn("w-3 h-3 mr-1.5", isSearching && "animate-pulse")} />
                                    {isSearching ? "검색 중..." : "규정 검색"}
                                  </Button>
                                </div>
                                <div className="relative group/input">
                                  <Input
                                    placeholder="관련 규정을 입력하거나 AI 검색을 이용하세요..."
                                    className="h-10 text-sm bg-background/50 focus:bg-background border-border/60 focus:border-indigo-500/50 shadow-inner rounded-xl pr-9 transition-all"
                                    value={userInputs[id]?.regulation || ""}
                                    onChange={(e) => handleInputChange(id, "regulation", e.target.value)}
                                    disabled={isLocked}
                                  />
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50 group-focus-within/input:opacity-100 transition-opacity">
                                    <ShieldCheck className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Upload Only View */}
                          {feat.uiType === "upload_only" && (
                            <div
                              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                              onClick={() => triggerFileUpload(id)}
                            >
                              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                              <p className="text-sm font-medium text-foreground">
                                여기를 클릭하여 파일 업로드
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, JPG 지원</p>
                              <input
                                type="file"
                                className="hidden"
                                ref={(el) => (fileInputRefs.current[id] = el)}
                                onChange={(e) => handleFileUpload(id, e)}
                                multiple
                                disabled={isLocked}
                              />
                            </div>
                          )}

                          {/* Dashboard Link */}
                          {feat.uiType === "dashboard_link" && (
                            <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border">
                              <div className="text-4xl">📊</div>
                              <p className="text-sm text-center text-muted-foreground">
                                거버넌스 대시보드에서 실시간 모니터링 현황을 확인합니다.
                              </p>
                              <Button
                                onClick={() => navigate("/governance/dashboard")}
                                className="gap-2"
                              >
                                대시보드 바로가기
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          )}

                          {/* Attached Files List */}
                          {attachedFiles.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 p-2 bg-secondary/30 rounded-lg">
                              {attachedFiles.map((file, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background text-xs text-foreground border shadow-sm"
                                >
                                  <FileText className="w-3 h-3 text-purple-500" />
                                  <span className="max-w-[150px] truncate">{file.name}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons */}
                          {feat.actionButtons && feat.actionButtons.length > 0 && (
                            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border/30">
                              {feat.actionButtons.map((action) => {
                                let btnLabel = action;
                                let btnClass = "";
                                let Icon = CheckCircle2;

                                if (action === "approve") {
                                  btnLabel = "승인";
                                  btnClass = "bg-green-600 hover:bg-green-700 text-white";
                                } else if (action === "reject") {
                                  btnLabel = "반려";
                                  btnClass = "bg-red-600 hover:bg-red-700 text-white";
                                  Icon = XCircle;
                                } else if (action === "request_revision") {
                                  btnLabel = "보완 요청";
                                  btnClass = "bg-amber-500 hover:bg-amber-600 text-white";
                                  Icon = AlertTriangle;
                                } else if (action === "confirm") {
                                  btnLabel = "확정";
                                  btnClass = "bg-blue-600 hover:bg-blue-700 text-white";
                                } else if (action === "save") {
                                  btnLabel = "저장";
                                  btnClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
                                  Icon = Save;
                                } else if (action === "deploy") {
                                  btnLabel = "배포 실행";
                                  btnClass = "bg-indigo-600 hover:bg-indigo-700 text-white";
                                  Icon = Send;
                                } else if (action === "request_approval") {
                                  btnLabel = "승인 요청";
                                  btnClass = "bg-purple-600 hover:bg-purple-700 text-white";
                                  Icon = Send;
                                } else if (action === "apply") {
                                  btnLabel = "적용";
                                  btnClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
                                }

                                return (
                                  <Button
                                    key={action}
                                    size="sm"
                                    className={btnClass}
                                    onClick={() => handleAction(id, action)}
                                    disabled={isLocked}
                                  >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {btnLabel}
                                  </Button>
                                );
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
              <div className="min-h-[200px] rounded-2xl bg-muted/30 border-2 border-dashed border-border flex items-center justify-center p-8 text-center text-muted-foreground">
                <p>이 단계의 요구사항이 아직 정의되지 않았습니다.</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-8 border-t">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                disabled={!prevPath}
                className="gap-2 rounded-full px-6 hover:bg-secondary/80"
              >
                <ChevronLeft className="w-4 h-4" />
                이전 단계
              </Button>

              {hasBranch ? (
                <div className="flex flex-wrap gap-3 justify-end">
                  {step.nextBranch!.map((branch) => (
                    <Button
                      key={branch.key}
                      size="lg"
                      onClick={() => handleNext(branch.path)}
                      className="gap-2 rounded-full px-6 bg-primary/90 hover:bg-primary"
                    >
                      <GitBranch className="w-4 h-4" />
                      {branch.label}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              ) : nextPath ? (
                <Button
                  size="lg"
                  onClick={() => handleNext(nextPath)}
                  className="gap-2 rounded-full px-6 bg-primary/90 hover:bg-primary shadow-lg shadow-primary/20"
                >
                  다음 단계
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : null}
            </div>
          </motion.div>

          {/* Sidebar: AI Consultant Result */}
          <div className="xl:col-span-4 sticky top-6">
            <AnimatePresence mode="wait">
              {consultResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-2xl overflow-hidden bg-background/60 backdrop-blur-xl ring-1 ring-border/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-indigo-500/5 pointer-events-none" />
                    <CardHeader className="bg-gradient-to-r from-purple-100/50 to-indigo-100/50 pb-6 border-b border-purple-500/10 relative">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
                            AI 거버넌스 컨설팅
                          </CardTitle>
                          <p className="text-xs font-medium text-muted-foreground mt-0.5">
                            GnG CyberGuide AI Analysis
                          </p>
                        </div>
                      </div>
                      <CardDescription className="text-foreground/70 mt-3 text-sm leading-relaxed">
                        현재 단계에 대한 AI 기반 검토 의견입니다.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6 relative">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-sm font-bold text-green-600 uppercase tracking-wider">
                          <div className="p-1 rounded bg-green-100">
                            <Brain className="w-3.5 h-3.5" />
                          </div>
                          기획/평가 관점
                        </div>
                        <p className="text-sm text-foreground/80 bg-card/50 p-4 rounded-xl border border-border/50 leading-relaxed shadow-sm">
                          {consultResult.planning}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-sm font-bold text-blue-600 uppercase tracking-wider">
                          <div className="p-1 rounded bg-blue-100">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          기술/개발 관점
                        </div>
                        <p className="text-sm text-foreground/80 bg-card/50 p-4 rounded-xl border border-border/50 leading-relaxed shadow-sm">
                          {consultResult.development}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-sm font-bold text-amber-600 uppercase tracking-wider">
                          <div className="p-1 rounded bg-amber-100">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </div>
                          운영/규제 관점
                        </div>
                        <p className="text-sm text-foreground/80 bg-card/50 p-4 rounded-xl border border-border/50 leading-relaxed shadow-sm">
                          {consultResult.operation}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border/50 mt-2">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-bold text-purple-700 uppercase">분석 기반</span>
                        </div>
                        <p className="text-sm text-muted-foreground italic pl-6 border-l-2 border-purple-200">
                          "{consultResult.intro}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="border-2 border-dashed h-full min-h-[500px] flex items-center justify-center bg-muted/10 backdrop-blur-sm">
                    <div className="text-center p-8 space-y-6 max-w-[280px]">
                      <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center shadow-lg border border-purple-200">
                          <Bot className="w-10 h-10 text-purple-600" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-2">AI 거버넌스 컨설턴트</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          우측 상단의 "AI 컨설팅" 버튼을 클릭하면 현재 단계에 대한 AI 분석 결과를 받아볼 수 있습니다.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground/80">
                        <div className="bg-background/80 p-2 rounded-lg border flex flex-col items-center gap-1">
                          <Wand2 className="w-4 h-4 text-purple-500" />
                          <span>AI 자동작성</span>
                        </div>
                        <div className="bg-background/80 p-2 rounded-lg border flex flex-col items-center gap-1">
                          <Search className="w-4 h-4 text-indigo-500" />
                          <span>규정 검색</span>
                        </div>
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
