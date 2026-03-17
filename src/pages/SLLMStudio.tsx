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
  TrendingUp, GitMerge, BookOpen, Lightbulb, Target, CircleDot,
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
// 온톨로지 학습 탭
// =============================================
function OntologyTrainingTab() {
  const [trainingStatus, setTrainingStatus] = React.useState<Record<string, 'idle' | 'extracting' | 'training' | 'completed'>>({});
  const [trainingProgress, setTrainingProgress] = React.useState<Record<string, number>>({});
  const [loadedData, setLoadedData] = React.useState<Record<string, boolean>>({});
  const [loadingData, setLoadingData] = React.useState<Record<string, boolean>>({});
  // 모델 관리
  const [trainedModels, setTrainedModels] = React.useState([
    { id: "mdl-001", name: "GovAI-sLLM-v2.3", size: "1.2 GB", accuracy: 94.2, date: "2026-03-15", status: "active" as const, sources: ["dq", "mp", "fr"], epochs: 30, loss: 0.042 },
    { id: "mdl-002", name: "GovAI-sLLM-v2.2", size: "1.1 GB", accuracy: 91.8, date: "2026-03-01", status: "archived" as const, sources: ["dq", "mp"], epochs: 25, loss: 0.058 },
  ]);
  const [globalTraining, setGlobalTraining] = React.useState<'idle' | 'loading' | 'training' | 'completed'>('idle');
  const [globalProgress, setGlobalProgress] = React.useState(0);
  const [globalEpoch, setGlobalEpoch] = React.useState(0);
  const [globalLoss, setGlobalLoss] = React.useState(0);
  const [downloading, setDownloading] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLoadData = (sourceId: string) => {
    setLoadingData(prev => ({ ...prev, [sourceId]: true }));
    setTimeout(() => {
      setLoadingData(prev => ({ ...prev, [sourceId]: false }));
      setLoadedData(prev => ({ ...prev, [sourceId]: true }));
    }, 1500);
  };

  const handleLoadAll = () => {
    ontologySources.forEach((src, i) => {
      setTimeout(() => handleLoadData(src.id), i * 500);
    });
  };

  const handleUploadData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (['ttl', 'owl', 'rdf', 'json', 'jsonld', 'csv'].includes(ext || '')) {
          const customId = `custom-${Date.now()}`;
          setLoadedData(prev => ({ ...prev, [customId]: true }));
        }
      });
    }
  };

  const handleStartGlobalTraining = () => {
    // 1. Load phase
    setGlobalTraining('loading');
    setGlobalProgress(0);
    setGlobalEpoch(0);
    setGlobalLoss(2.5);

    setTimeout(() => {
      // 2. Training phase
      setGlobalTraining('training');
      let epoch = 0;
      let loss = 2.5;
      const totalEpochs = 30;
      const interval = setInterval(() => {
        epoch++;
        loss = Math.max(0.03, loss * (0.82 + Math.random() * 0.1));
        const pct = Math.round((epoch / totalEpochs) * 100);
        setGlobalEpoch(epoch);
        setGlobalLoss(parseFloat(loss.toFixed(4)));
        setGlobalProgress(pct);
        if (epoch >= totalEpochs) {
          clearInterval(interval);
          setGlobalTraining('completed');
          // Add new model
          const ver = `v${(2.3 + trainedModels.length * 0.1).toFixed(1)}`;
          setTrainedModels(prev => [{
            id: `mdl-${Date.now()}`, name: `GovAI-sLLM-${ver}`,
            size: `${(1.0 + Math.random() * 0.5).toFixed(1)} GB`,
            accuracy: parseFloat((92 + Math.random() * 5).toFixed(1)),
            date: new Date().toISOString().split('T')[0],
            status: "active" as const,
            sources: Object.keys(loadedData),
            epochs: totalEpochs,
            loss: parseFloat(loss.toFixed(4)),
          }, ...prev]);
        }
      }, 400);
    }, 2000);
  };

  const handleDownloadModel = (modelId: string) => {
    setDownloading(modelId);
    setTimeout(() => {
      const model = trainedModels.find(m => m.id === modelId);
      // Simulate download by creating a blob
      const modelInfo = JSON.stringify({
        model_name: model?.name,
        version: model?.name.split('-').pop(),
        accuracy: model?.accuracy,
        epochs: model?.epochs,
        loss: model?.loss,
        trained_date: model?.date,
        sources: model?.sources,
        format: "ONNX + SafeTensors",
        framework: "PyTorch",
        note: "This is a simulated model file for demonstration purposes."
      }, null, 2);
      const blob = new Blob([modelInfo], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model?.name || 'model'}-config.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloading(null);
    }, 1500);
  };

  const ontologySources = [
    {
      id: "dq", module: "데이터 품질 검증", icon: Database, color: "text-teal-600", bgColor: "bg-teal-100",
      path: "/tech-review/data-quality",
      ontologyClasses: ["DataQualityMetric", "AnomalyDetection", "BiasIndicator", "DataProfile", "QualityRule"],
      triples: 342, lastSync: "2026-03-17 09:30",
      trainingData: { total: 856, labeled: 812, quality: 97.8 },
      description: "87개 품질 규칙, 이상탐지 결과, 편향 지표, 프로파일링 데이터를 온톨로지로 구조화",
      sampleTriples: [
        "ds:Transaction dq:completeness '99.95%'",
        "ds:Customer dq:missingRate '1.0%'",
        "ds:CreditRating dq:biasStatus 'balanced'",
      ],
    },
    {
      id: "mp", module: "모델 성능 평가", icon: BarChart3, color: "text-blue-600", bgColor: "bg-blue-100",
      path: "/tech-review/model-performance",
      ontologyClasses: ["ModelMetric", "PerformanceGoal", "ModelVersion", "MonitoringData", "PredictionLatency"],
      triples: 285, lastSync: "2026-03-17 09:15",
      trainingData: { total: 712, labeled: 698, quality: 96.5 },
      description: "5개 모델의 성능 지표(정확도/F1/AUC), 목표 달성 현황, 실시간 모니터링 데이터",
      sampleTriples: [
        "model:CreditApproval perf:accuracy '94.5%'",
        "model:FraudDetection perf:f1Score '98.65%'",
        "model:ChurnPrediction perf:status 'testing'",
      ],
    },
    {
      id: "fr", module: "공정성 검증", icon: Shield, color: "text-green-600", bgColor: "bg-green-100",
      path: "/tech-review/fairness",
      ontologyClasses: ["FairnessMetric", "ProtectedAttribute", "BiasCheck", "DisparityIndex", "DemographicParity"],
      triples: 198, lastSync: "2026-03-17 08:45",
      trainingData: { total: 524, labeled: 510, quality: 95.2 },
      description: "7개 집단의 편향 지표(DI/SPD/EOD), 인구통계 분석, 완화 조치 결과",
      sampleTriples: [
        "group:Male fairness:approvalRate '62.7%'",
        "group:Female fairness:disparityIndex '0.925'",
        "metric:DemographicParity fairness:value '0.94'",
      ],
    },
    {
      id: "xai", module: "신뢰성 평가", icon: Lightbulb, color: "text-amber-600", bgColor: "bg-amber-100",
      path: "/tech-review/explainability",
      ontologyClasses: ["TrustDimension", "TrustScore", "ExplainabilityMethod", "ComprehensionTest", "AccountabilityRecord"],
      triples: 216, lastSync: "2026-03-17 10:00",
      trainingData: { total: 648, labeled: 620, quality: 94.8 },
      description: "6대 신뢰성 차원(정확성/설명가능성/공정성/견고성/투명성/책임성) 평가 결과",
      sampleTriples: [
        "trust:Accuracy score:value '93%'",
        "trust:Explainability xai:method 'SHAP'",
        "trust:Fairness score:grade 'B+'",
      ],
    },
    {
      id: "sec", module: "보안 검토", icon: Lock, color: "text-red-600", bgColor: "bg-red-100",
      path: "/tech-review/security",
      ontologyClasses: ["Vulnerability", "AdversarialTest", "AccessControl", "SecurityMetric", "ThreatModel"],
      triples: 206, lastSync: "2026-03-17 08:00",
      trainingData: { total: 501, labeled: 485, quality: 93.7 },
      description: "5건 취약점, 적대적 공격 테스트(FGSM/PGD/C&W), 접근 제어 감사 결과",
      sampleTriples: [
        "vuln:CVE-2024-001 sec:severity 'high'",
        "attack:FGSM sec:robustness '85%'",
        "system:API sec:compliance '99.5%'",
      ],
    },
  ];

  const handleStartTraining = (sourceId: string) => {
    setTrainingStatus(prev => ({ ...prev, [sourceId]: 'extracting' }));
    setTrainingProgress(prev => ({ ...prev, [sourceId]: 0 }));

    // Phase 1: Extracting ontology
    setTimeout(() => {
      setTrainingStatus(prev => ({ ...prev, [sourceId]: 'training' }));
      setTrainingProgress(prev => ({ ...prev, [sourceId]: 30 }));

      // Phase 2: Training progress
      let progress = 30;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTrainingStatus(prev => ({ ...prev, [sourceId]: 'completed' }));
        }
        setTrainingProgress(prev => ({ ...prev, [sourceId]: Math.min(progress, 100) }));
      }, 600);
    }, 1500);
  };

  const handleTrainAll = () => {
    ontologySources.forEach((src, i) => {
      setTimeout(() => handleStartTraining(src.id), i * 800);
    });
  };

  const totalTriples = ontologySources.reduce((sum, s) => sum + s.triples, 0);
  const totalTrainingData = ontologySources.reduce((sum, s) => sum + s.trainingData.total, 0);
  const completedSources = Object.values(trainingStatus).filter(s => s === 'completed').length;

  const loadedCount = Object.keys(loadedData).length;

  return (
    <div className="space-y-6">
      {/* ─── Action Panel: 데이터 불러오기 → 학습 → 다운로드 ─── */}
      <Card className="border-2 border-purple-200/60 bg-gradient-to-br from-purple-50/30 to-indigo-50/30">
        <CardContent className="pt-5 pb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: 데이터 불러오기 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center text-sm font-black text-teal-700">1</div>
                <h3 className="font-bold text-sm">데이터 불러오기</h3>
              </div>

              <Button className="w-full gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleLoadAll} disabled={loadedCount === ontologySources.length}>
                <Database className="w-4 h-4" />
                {loadedCount === ontologySources.length ? '모든 데이터 로드 완료' : '기술 검토 데이터 전체 불러오기'}
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => fileInputRef.current?.click()}>
                  <Plus className="w-3 h-3" /> 파일 업로드
                </Button>
                <input ref={fileInputRef} type="file" className="hidden" multiple accept=".ttl,.owl,.rdf,.json,.jsonld,.csv" onChange={handleUploadData} />
                <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => { /* SPARQL endpoint */ }}>
                  <Server className="w-3 h-3" /> SPARQL
                </Button>
              </div>

              <div className="p-2.5 bg-white rounded-xl border space-y-1.5">
                {ontologySources.map(src => {
                  const SrcIcon = src.icon;
                  const isLoaded = loadedData[src.id];
                  const isLoading = loadingData[src.id];
                  return (
                    <div key={src.id} className="flex items-center justify-between py-1 group">
                      <div className="flex items-center gap-2">
                        <SrcIcon className={cn("w-3.5 h-3.5", isLoaded ? src.color : "text-gray-300")} />
                        <span className={cn("text-xs", isLoaded ? "font-medium" : "text-muted-foreground")}>{src.module}</span>
                      </div>
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
                      ) : isLoaded ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                          <span className="text-[9px] text-green-600">{src.triples}</span>
                        </div>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[9px] opacity-0 group-hover:opacity-100" onClick={() => handleLoadData(src.id)}>불러오기</Button>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-muted-foreground text-center">{loadedCount}/{ontologySources.length} 모듈 로드 ({totalTriples.toLocaleString()} 트리플)</p>
            </div>

            {/* Step 2: 학습 실행 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-sm font-black text-purple-700">2</div>
                <h3 className="font-bold text-sm">sLLM 학습 / 파인튜닝</h3>
              </div>

              <Button
                className={cn("w-full gap-2 text-sm h-11",
                  globalTraining === 'idle' ? "bg-purple-600 hover:bg-purple-700" :
                  globalTraining === 'completed' ? "bg-green-600 hover:bg-green-700" : "bg-purple-600"
                )}
                onClick={handleStartGlobalTraining}
                disabled={loadedCount === 0 || globalTraining === 'loading' || globalTraining === 'training'}
              >
                {globalTraining === 'idle' && <><Play className="w-5 h-5" />학습 시작</>}
                {globalTraining === 'loading' && <><Loader2 className="w-5 h-5 animate-spin" />데이터 준비 중...</>}
                {globalTraining === 'training' && <><Loader2 className="w-5 h-5 animate-spin" />학습 중... {globalProgress}%</>}
                {globalTraining === 'completed' && <><CheckCircle2 className="w-5 h-5" />학습 완료 - 새 모델 생성됨</>}
              </Button>

              {/* Training Metrics */}
              <div className="p-3 bg-white rounded-xl border space-y-3">
                {globalTraining !== 'idle' && (
                  <>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">진행률</span>
                        <span className="font-bold">{globalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" animate={{ width: `${globalProgress}%` }} transition={{ duration: 0.3 }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-1.5 bg-muted/30 rounded-lg">
                        <p className="text-[9px] text-muted-foreground">에폭</p>
                        <p className="text-sm font-bold text-purple-600">{globalEpoch}/30</p>
                      </div>
                      <div className="p-1.5 bg-muted/30 rounded-lg">
                        <p className="text-[9px] text-muted-foreground">Loss</p>
                        <p className="text-sm font-bold text-amber-600">{globalLoss}</p>
                      </div>
                      <div className="p-1.5 bg-muted/30 rounded-lg">
                        <p className="text-[9px] text-muted-foreground">데이터</p>
                        <p className="text-sm font-bold text-teal-600">{loadedCount * 680}</p>
                      </div>
                    </div>
                  </>
                )}
                {globalTraining === 'idle' && (
                  <div className="text-center py-4">
                    <Brain className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">데이터를 불러온 후<br/>학습을 시작하세요</p>
                  </div>
                )}
              </div>
              {loadedCount === 0 && globalTraining === 'idle' && (
                <p className="text-[10px] text-amber-600 text-center flex items-center justify-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> 먼저 데이터를 불러와주세요
                </p>
              )}
            </div>

            {/* Step 3: 모델 다운로드 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm font-black text-indigo-700">3</div>
                <h3 className="font-bold text-sm">모델 다운로드</h3>
              </div>

              <div className="p-3 bg-white rounded-xl border space-y-2.5 max-h-[320px] overflow-y-auto">
                {trainedModels.map(model => (
                  <div key={model.id} className={cn("p-3 rounded-xl border transition-all hover:shadow-md",
                    model.status === 'active' ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-gray-50/30"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold">{model.name}</p>
                          {model.status === 'active' && <Badge className="bg-green-100 text-green-700 text-[8px] px-1 py-0">Active</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{model.date} | {model.size} | {model.epochs} epochs</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                      <div className="text-center p-1 bg-white rounded border">
                        <p className="text-[8px] text-muted-foreground">정확도</p>
                        <p className={cn("text-xs font-bold", model.accuracy >= 93 ? "text-green-600" : "text-amber-600")}>{model.accuracy}%</p>
                      </div>
                      <div className="text-center p-1 bg-white rounded border">
                        <p className="text-[8px] text-muted-foreground">Loss</p>
                        <p className="text-xs font-bold text-purple-600">{model.loss}</p>
                      </div>
                      <div className="text-center p-1 bg-white rounded border">
                        <p className="text-[8px] text-muted-foreground">소스</p>
                        <p className="text-xs font-bold text-blue-600">{model.sources.length}개</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-[10px] h-7"
                        onClick={() => handleDownloadModel(model.id)} disabled={downloading === model.id}>
                        {downloading === model.id ? <><Loader2 className="w-3 h-3 animate-spin" />준비중</> : <><Save className="w-3 h-3" />ONNX 다운로드</>}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-1 text-[10px] h-7"
                        onClick={() => handleDownloadModel(model.id)} disabled={downloading === model.id}>
                        {downloading === model.id ? <><Loader2 className="w-3 h-3 animate-spin" /></> : <><Save className="w-3 h-3" />SafeTensors</>}
                      </Button>
                    </div>
                  </div>
                ))}
                {trainedModels.length === 0 && (
                  <div className="text-center py-6">
                    <Cpu className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">학습된 모델이 없습니다</p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground text-center">ONNX, SafeTensors, PyTorch (.pt) 형식 지원</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Cards */}
      <div className="space-y-4">
        {ontologySources.map((source, idx) => {
          const SrcIcon = source.icon;
          const status = trainingStatus[source.id] || 'idle';
          const progress = trainingProgress[source.id] || 0;

          return (
            <motion.div key={source.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <Card className={cn("overflow-hidden transition-all",
                status === 'training' && "ring-2 ring-purple-300 shadow-lg",
                status === 'completed' && "ring-1 ring-green-300"
              )}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", source.bgColor)}>
                        <SrcIcon className={cn("w-5 h-5", source.color)} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm">{source.module}</h3>
                          <Badge variant="outline" className="text-[9px] cursor-pointer hover:bg-muted" onClick={() => window.location.href = source.path}>
                            바로가기 →
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-green-600 font-medium">LIVE</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{source.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant={status === 'completed' ? 'outline' : 'default'}
                        className={cn("gap-1.5 text-xs", status === 'idle' && "bg-purple-600 hover:bg-purple-700")}
                        onClick={() => handleStartTraining(source.id)}
                        disabled={status === 'extracting' || status === 'training'}>
                        {status === 'idle' && <><Play className="w-3 h-3" />학습 시작</>}
                        {status === 'extracting' && <><Loader2 className="w-3 h-3 animate-spin" />온톨로지 추출 중...</>}
                        {status === 'training' && <><Loader2 className="w-3 h-3 animate-spin" />학습 중 {Math.round(progress)}%</>}
                        {status === 'completed' && <><CheckCircle2 className="w-3 h-3 text-green-500" />완료</>}
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(status === 'extracting' || status === 'training') && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{status === 'extracting' ? '온톨로지 추출 중...' : 'sLLM 학습 진행 중...'}</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={cn("h-full rounded-full", status === 'extracting' ? "bg-amber-500" : "bg-purple-500")}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ontology Classes */}
                    <div className="p-3 rounded-xl bg-muted/30 border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> 온톨로지 클래스
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {source.ontologyClasses.map(cls => (
                          <Badge key={cls} variant="outline" className="text-[9px] bg-white/50 font-mono">{cls}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                        <span className="font-medium">{source.triples} 트리플</span>
                        <span>동기화: {source.lastSync}</span>
                      </div>
                    </div>

                    {/* Sample Triples */}
                    <div className="p-3 rounded-xl bg-muted/30 border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> 샘플 트리플 (RDF)
                      </p>
                      <div className="space-y-1">
                        {source.sampleTriples.map((triple, i) => (
                          <code key={i} className="block text-[9px] font-mono text-purple-700 bg-purple-50/50 px-2 py-1 rounded">{triple}</code>
                        ))}
                      </div>
                    </div>

                    {/* Training Data Stats */}
                    <div className="p-3 rounded-xl bg-muted/30 border">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Brain className="w-3 h-3" /> 학습 데이터
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">전체</span>
                          <span className="font-bold">{source.trainingData.total.toLocaleString()}건</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">레이블링</span>
                          <span className="font-bold">{source.trainingData.labeled.toLocaleString()}건</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">품질 점수</span>
                          <span className={cn("font-bold", source.trainingData.quality >= 95 ? "text-green-600" : "text-amber-600")}>
                            {source.trainingData.quality}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            style={{ width: `${(source.trainingData.labeled / source.trainingData.total) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Completed Badge */}
                  {status === 'completed' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <p className="text-xs text-green-700">
                        <span className="font-semibold">{source.module}</span> 온톨로지 {source.triples}개 트리플 추출 → {source.trainingData.labeled}건 학습 데이터 변환 → sLLM 파인튜닝 완료
                      </p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Integration Architecture */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-600" /> 온톨로지 → sLLM 학습 아키텍처</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { step: "1. 데이터 수집", icon: Database, desc: "5개 기술 검토 모듈에서 검증/평가 결과를 실시간 수집", color: "text-teal-600", bg: "bg-teal-100" },
              { step: "2. 온톨로지 변환", icon: BookOpen, desc: "RDF/OWL 기반 구조화 → 클래스/속성/관계 매핑", color: "text-amber-600", bg: "bg-amber-100" },
              { step: "3. 학습 데이터 생성", icon: FileText, desc: "Q&A 쌍, 분류 라벨, 규정 매핑 데이터 자동 생성", color: "text-blue-600", bg: "bg-blue-100" },
              { step: "4. sLLM 파인튜닝", icon: Brain, desc: "거버넌스 도메인 특화 LLM 파인튜닝 실행", color: "text-purple-600", bg: "bg-purple-100" },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <div key={i} className="p-4 bg-white rounded-xl border relative">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-2", item.bg)}>
                    <ItemIcon className={cn("w-4 h-4", item.color)} />
                  </div>
                  <h4 className="font-semibold text-xs mb-1">{item.step}</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  {i < 3 && <ArrowRight className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 z-10" />}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

        {/* ─── Solution Banner (보안 검토 스타일 통일) ─── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-900 border-0 text-white">
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">sLLM 파인튜닝 스튜디오</h3>
                  <p className="text-sm text-white/60 mt-0.5">기술 검토 온톨로지 기반 거버넌스 특화 LLM 학습 · 훈련 · 배포</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30 gap-2 border">
                    <Database className="w-4 h-4" /> 데이터셋 연동
                  </Button>
                  <Button className="bg-white text-gray-900 hover:bg-white/90 gap-2 font-semibold">
                    <Zap className="w-4 h-4" /> 파인튜닝 시작
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ─── Key Metrics (보안 검토 MetricCard 스타일) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="연동 데이터셋" value="4/5" change="+1" trend="up" />
          <MetricCard title="온톨로지 트리플" value="1,247" change="+142" trend="up" />
          <MetricCard title="학습 데이터" value="3,841건" change="+320" trend="up" />
          <MetricCard title="모델 정확도" value="94.2%" change="+2.4%" trend="up" />
        </div>

        {/* ─── 데이터셋 연동 현황 (취약점 알림 스타일) ─── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">파인튜닝 데이터셋 연동</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5"><Plus className="w-3 h-3" /> 파일 업로드</Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5"><Database className="w-3 h-3" /> SPARQL</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2.5 px-3 font-semibold text-xs">소스 모듈</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">트리플</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">학습 데이터</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">품질</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">동기화</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { module: "데이터 품질 검증", triples: 342, data: 856, quality: 97.8, sync: "09:30", connected: true },
                    { module: "모델 성능 평가", triples: 285, data: 712, quality: 96.5, sync: "09:15", connected: true },
                    { module: "공정성 검증", triples: 198, data: 524, quality: 95.2, sync: "08:45", connected: true },
                    { module: "신뢰성 평가", triples: 216, data: 648, quality: 94.8, sync: "-", connected: false },
                    { module: "보안 검토", triples: 206, data: 501, quality: 93.7, sync: "08:00", connected: true },
                  ].map((row) => (
                    <tr key={row.module} className="border-b hover:bg-muted/30">
                      <td className="py-2.5 px-3 font-medium text-xs">{row.module}</td>
                      <td className="text-center py-2.5 px-3 text-xs">{row.triples}</td>
                      <td className="text-center py-2.5 px-3 text-xs">{row.data.toLocaleString()}건</td>
                      <td className="text-center py-2.5 px-3">
                        <Badge variant="outline" className={cn("text-[10px]", row.quality >= 95 ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
                          {row.quality}%
                        </Badge>
                      </td>
                      <td className="text-center py-2.5 px-3 text-xs text-muted-foreground">{row.sync}</td>
                      <td className="text-center py-2.5 px-3">
                        {row.connected ? (
                          <Badge className="bg-green-600 text-[10px]">연동</Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="h-6 px-2 text-[9px]">연결</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ─── 학습된 모델 (다운로드) ─── */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">학습된 모델</CardTitle>
              <Badge variant="outline" className="text-xs">ONNX · SafeTensors · PyTorch 지원</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2.5 px-3 font-semibold text-xs">모델명</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">정확도</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">Loss</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">크기</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">학습일</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">상태</th>
                    <th className="text-center py-2.5 px-3 font-semibold text-xs">다운로드</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "GovAI-sLLM-v2.3", acc: 94.2, loss: 0.042, size: "1.2 GB", date: "2026-03-15", active: true, epochs: 30, sources: 4 },
                    { name: "GovAI-sLLM-v2.2", acc: 91.8, loss: 0.058, size: "1.1 GB", date: "2026-03-01", active: false, epochs: 25, sources: 3 },
                    { name: "GovAI-sLLM-v2.1", acc: 89.5, loss: 0.073, size: "1.0 GB", date: "2026-02-15", active: false, epochs: 20, sources: 2 },
                  ].map((model) => {
                    const downloadModel = (format: string) => {
                      const config = JSON.stringify({
                        model_id: model.name,
                        format,
                        accuracy: model.acc,
                        loss: model.loss,
                        epochs: model.epochs,
                        trained_date: model.date,
                        data_sources: model.sources,
                        base_model: "Llama-3-8B",
                        framework: "PyTorch",
                        license: "Apache-2.0",
                        description: `AI 거버넌스 특화 sLLM - ${model.sources}개 기술 검토 모듈 온톨로지 기반 파인튜닝`,
                      }, null, 2);
                      const blob = new Blob([config], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${model.name}.${format === 'ONNX' ? 'onnx' : format === 'SafeTensors' ? 'safetensors' : 'pt'}.config.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success(`${model.name} (${format}) 다운로드를 시작합니다.`);
                    };
                    return (
                      <tr key={model.name} className={cn("border-b hover:bg-muted/30", model.active && "bg-green-50/30")}>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-xs">{model.name}</span>
                        </td>
                        <td className="text-center py-2.5 px-3">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">{model.acc}%</Badge>
                        </td>
                        <td className="text-center py-2.5 px-3 text-xs font-medium">{model.loss}</td>
                        <td className="text-center py-2.5 px-3 text-xs text-muted-foreground">{model.size}</td>
                        <td className="text-center py-2.5 px-3 text-xs text-muted-foreground">{model.date}</td>
                        <td className="text-center py-2.5 px-3">
                          {model.active ? (
                            <Badge className="bg-green-600 text-[10px]">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">Archived</Badge>
                          )}
                        </td>
                        <td className="text-center py-2.5 px-3">
                          <div className="flex gap-1 justify-center">
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[9px] gap-1" onClick={() => downloadModel('ONNX')}>
                              <Save className="w-2.5 h-2.5" /> ONNX
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[9px] gap-1" onClick={() => downloadModel('SafeTensors')}>
                              <Save className="w-2.5 h-2.5" /> .safetensors
                            </Button>
                            <Button variant="outline" size="sm" className="h-6 px-2 text-[9px] gap-1" onClick={() => downloadModel('PyTorch')}>
                              <Save className="w-2.5 h-2.5" /> .pt
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/50 flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="ontology-training" className="data-[state=active]:bg-background gap-1.5 text-xs data-[state=active]:ring-2 data-[state=active]:ring-purple-300">
              <GitMerge className="h-3.5 w-3.5" /> 온톨로지 학습
            </TabsTrigger>
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

          <TabsContent value="ontology-training" className="mt-6">
            <OntologyTrainingTab />
          </TabsContent>

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
