import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { riskGuideAPI } from '@/api/client';
import {
  ArrowLeft, ArrowRight, Brain, CheckCircle2, AlertTriangle,
  ShieldAlert, ShieldCheck, Loader2, Sparkles, Save, FileText,
  ChevronDown, ChevronUp, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface RiskQuestion {
  no: number; lv1: string; lv2: string; lv3: string;
  score: number; reviewer: string; criteria: string; mitigation: string;
}

interface Answer {
  no: number; identified: boolean; reason: string;
  mitigationPlan: string; mitigationLevel: string;
  residualRisk: string;
}

type WizardStep = 'info' | 'identify' | 'mitigate' | 'residual' | 'review' | 'result';

const PRINCIPLE_COLORS: Record<string, string> = {
  '합법성 원칙': 'bg-blue-500/10 text-blue-700 border-blue-200',
  '신뢰성 원칙': 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  '신의성실의 원칙': 'bg-amber-500/10 text-amber-700 border-amber-200',
  '보안성 원칙': 'bg-red-500/10 text-red-700 border-red-200',
};

const PRINCIPLE_ICONS: Record<string, string> = {
  '합법성 원칙': '⚖️', '신뢰성 원칙': '🔍', '신의성실의 원칙': '🤝', '보안성 원칙': '🔒',
};

const RiskAssessmentWizard: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('info');
  const [questions, setQuestions] = useState<RiskQuestion[]>([]);
  const [principles, setPrinciples] = useState<any[]>([]);
  const [riskLevels, setRiskLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReviewResult, setAiReviewResult] = useState('');
  const [autoAssessing, setAutoAssessing] = useState(false);

  // Form data
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [assessor, setAssessor] = useState('');
  const [answers, setAnswers] = useState<Answer[]>([]);

  // UI state
  const [expandedPrinciple, setExpandedPrinciple] = useState<string>('합법성 원칙');
  const [expandedGuide, setExpandedGuide] = useState<number | null>(null);

  useEffect(() => {
    loadGuideData();
  }, []);

  const loadGuideData = async () => {
    try {
      const res = await riskGuideAPI.getQuestions();
      const data = res.data;
      setQuestions(data.questions);
      setPrinciples(data.principles);
      setRiskLevels(data.riskLevels);
      setAnswers(data.questions.map((q: RiskQuestion) => ({
        no: q.no, identified: false, reason: '', mitigationPlan: '',
        mitigationLevel: '', residualRisk: '',
      })));
    } catch (err) {
      console.error('Failed to load guide data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateAnswer = (no: number, field: keyof Answer, value: any) => {
    setAnswers(prev => prev.map(a => a.no === no ? { ...a, [field]: value } : a));
  };

  const getAnswer = (no: number): Answer => answers.find(a => a.no === no) || {
    no, identified: false, reason: '', mitigationPlan: '', mitigationLevel: '', residualRisk: '',
  };

  const groupByPrinciple = () => {
    const groups: Record<string, RiskQuestion[]> = {};
    questions.forEach(q => {
      if (!groups[q.lv1]) groups[q.lv1] = [];
      groups[q.lv1].push(q);
    });
    return groups;
  };

  // Calculate total score
  const calculateScore = () => {
    let total = 0;
    answers.forEach(a => {
      const q = questions.find(q => q.no === a.no);
      if (!q) return;
      if (a.identified) {
        let mitigationWeight = 1.0;
        if (a.mitigationLevel === '○') mitigationWeight = 0.0;
        else if (a.mitigationLevel === '△') mitigationWeight = 0.5;
        else if (a.mitigationLevel === 'X') mitigationWeight = 1.0;
        total += q.score * mitigationWeight;
      }
    });
    return Math.round(total * 10) / 10;
  };

  const getRiskLevel = (score: number) => {
    if (score >= 75) return { level: '허용불가 서비스', color: 'text-red-600 bg-red-50', icon: '🚫' };
    if (score >= 50) return { level: '고위험 서비스', color: 'text-orange-600 bg-orange-50', icon: '⚠️' };
    if (score >= 25) return { level: '중위험 서비스', color: 'text-yellow-600 bg-yellow-50', icon: '⚡' };
    return { level: '저위험 서비스', color: 'text-green-600 bg-green-50', icon: '✅' };
  };

  // AI Auto Assessment
  const handleAutoAssess = async () => {
    if (!serviceName || !serviceDesc) return;
    setAutoAssessing(true);
    try {
      const res = await riskGuideAPI.aiAutoAssess(serviceName, serviceDesc);
      const data = res.data;
      if (data.assessments && data.assessments.length > 0) {
        setAnswers(prev => prev.map(a => {
          const ai = data.assessments.find((x: any) => x.no === a.no);
          if (!ai) return a;
          return {
            ...a,
            identified: ai.identified ?? false,
            reason: ai.reason || a.reason,
            mitigationPlan: ai.suggestedMitigation || a.mitigationPlan,
          };
        }));
      }
      if (data.rawReview) {
        setAiReviewResult(prev => (prev ? prev + '\n\n---\n\n' : '') + '[AI 자동 평가 완료]\n' + data.rawReview);
      }
    } catch (err: any) {
      alert('AI 자동 평가 실패: ' + (err.response?.data?.error || err.message));
    } finally {
      setAutoAssessing(false);
    }
  };

  // AI Review
  const handleAiReview = async () => {
    setAiLoading(true);
    try {
      const res = await riskGuideAPI.aiReview(serviceName, serviceDesc, answers);
      setAiReviewResult(res.data.review);
    } catch (err: any) {
      setAiReviewResult('AI 검토 실패: ' + (err.response?.data?.error || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  // Save assessment
  const handleSave = async () => {
    const score = calculateScore();
    const level = getRiskLevel(score);
    try {
      await riskGuideAPI.saveAssessment({
        serviceName, serviceDescription: serviceDesc, assessor,
        answers, mitigations: answers.filter(a => a.identified),
        totalScore: score, riskLevel: level.level, aiReview: aiReviewResult,
      });
      setStep('result');
    } catch (err: any) {
      alert('저장 실패: ' + (err.response?.data?.error || err.message));
    }
  };

  const steps: { key: WizardStep; label: string; icon: React.ReactNode }[] = [
    { key: 'info', label: '기본정보', icon: <FileText className="w-4 h-4" /> },
    { key: 'identify', label: '1. 위험 식별', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'mitigate', label: '2. 완화방안', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'residual', label: '3. 잔여위험', icon: <ShieldAlert className="w-4 h-4" /> },
    { key: 'review', label: 'AI 검토', icon: <Brain className="w-4 h-4" /> },
    { key: 'result', label: '결과', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  const stepIndex = steps.findIndex(s => s.key === step);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">평가 가이드 로딩 중...</span>
        </div>
      </Layout>
    );
  }

  const groups = groupByPrinciple();

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI 위험등급평가 위자드</h1>
            <p className="text-sm text-muted-foreground mt-1">
              금융분야 AI RMF 기반 32개 항목 · 4대 원칙 · AI 자동 검토
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/risk-assessment')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> 목록으로
          </Button>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => s.key !== 'result' && setStep(s.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                i === stepIndex
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : i < stepIndex
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Basic Info */}
            {step === 'info' && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      평가 대상 AI 서비스 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">AI 서비스명 *</label>
                      <Input value={serviceName} onChange={e => setServiceName(e.target.value)}
                        placeholder="예: 고객 응대 챗봇 v2.0" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">서비스 설명 *</label>
                      <Textarea value={serviceDesc} onChange={e => setServiceDesc(e.target.value)}
                        placeholder="AI 서비스의 목적, 데이터 수집 방식, 주요 기능 등을 상세히 기술하세요..."
                        className="min-h-[120px]" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">평가 담당자</label>
                      <Input value={assessor} onChange={e => setAssessor(e.target.value)}
                        placeholder="성함 또는 팀명" />
                    </div>
                  </CardContent>
                </Card>

                {/* Guide Reference Info */}
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
                      <Info className="w-5 h-5" />
                      평가 가이드 개요
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {principles.map(p => (
                        <div key={p.name} className={`rounded-lg p-3 border ${PRINCIPLE_COLORS[p.name] || 'bg-gray-50'}`}>
                          <div className="text-lg font-semibold">{PRINCIPLE_ICONS[p.name]} {p.name}</div>
                          <div className="text-sm mt-1">{p.questions}문항 · {p.totalScore}점</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {(riskLevels || []).map((r: any) => (
                        <div key={r.level} className="text-center text-xs p-2 rounded-md"
                          style={{ backgroundColor: r.color + '15', color: r.color, border: `1px solid ${r.color}30` }}>
                          <div className="font-semibold">{r.level}</div>
                          <div>{r.min}-{r.max}점</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      총 32문항 · 100점 만점 · 금융분야 AI 위험관리 프레임워크(RMF) 기반
                    </p>
                  </CardContent>
                </Card>

                {/* AI Auto Assessment Button */}
                {serviceName && serviceDesc && (
                  <Card className="border-purple-200 bg-purple-50/30">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-purple-700 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> AI 자동 위험 평가
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            서비스 설명을 기반으로 AI가 32개 항목을 자동으로 사전 평가합니다.
                          </p>
                        </div>
                        <Button onClick={handleAutoAssess} disabled={autoAssessing}
                          className="bg-purple-600 hover:bg-purple-700 text-white">
                          {autoAssessing ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Brain className="w-4 h-4 mr-1" />}
                          {autoAssessing ? 'AI 분석 중...' : 'AI 자동 평가 시작'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button onClick={() => setStep('identify')} disabled={!serviceName || !serviceDesc}>
                    다음: 위험 식별 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Risk Identification */}
            {step === 'identify' && (
              <div className="space-y-4">
                <Card className="border-yellow-200 bg-yellow-50/30">
                  <CardContent className="py-3">
                    <p className="text-sm text-yellow-800">
                      <strong>작성 가이드:</strong> 각 위험 항목에 대해 해당 AI 서비스가 해당 위험에 해당하는지 Yes/No를 선택하고, 사유를 작성하세요.
                      위험 정의를 참고하여 판단하세요.
                    </p>
                  </CardContent>
                </Card>

                {Object.entries(groups).map(([principle, qs]) => (
                  <Card key={principle} className="overflow-hidden">
                    <button
                      className={`w-full text-left px-4 py-3 flex items-center justify-between border-b ${PRINCIPLE_COLORS[principle]}`}
                      onClick={() => setExpandedPrinciple(expandedPrinciple === principle ? '' : principle)}
                    >
                      <span className="font-semibold flex items-center gap-2">
                        {PRINCIPLE_ICONS[principle]} {principle}
                        <span className="text-xs font-normal">({qs.length}문항)</span>
                      </span>
                      {expandedPrinciple === principle ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedPrinciple === principle && (
                      <CardContent className="p-0">
                        {qs.map(q => {
                          const ans = getAnswer(q.no);
                          const isExpanded = expandedGuide === q.no;
                          return (
                            <div key={q.no} className="border-b last:border-0 p-4 hover:bg-muted/30">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{q.no}</span>
                                    <span className="text-xs text-muted-foreground">{q.lv2}</span>
                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{q.score}점</span>
                                    <span className="text-xs text-muted-foreground">({q.reviewer})</span>
                                  </div>
                                  <h4 className="font-medium text-sm">{q.lv3}</h4>
                                  <button className="text-xs text-primary hover:underline mt-1"
                                    onClick={() => setExpandedGuide(isExpanded ? null : q.no)}>
                                    {isExpanded ? '가이드 접기 ▲' : '평가기준 보기 ▼'}
                                  </button>
                                  {isExpanded && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-md text-xs space-y-2 border border-blue-100">
                                      <div><strong>평가기준:</strong> {q.criteria}</div>
                                      <div><strong>권장 경감방안:</strong> {q.mitigation}</div>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => updateAnswer(q.no, 'identified', true)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                      ans.identified ? 'bg-red-500 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-red-100'
                                    }`}
                                  >Yes</button>
                                  <button
                                    onClick={() => updateAnswer(q.no, 'identified', false)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                      !ans.identified ? 'bg-green-500 text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-green-100'
                                    }`}
                                  >No</button>
                                </div>
                              </div>
                              <div className="mt-2">
                                <Textarea
                                  value={ans.reason}
                                  onChange={e => updateAnswer(q.no, 'reason', e.target.value)}
                                  placeholder={ans.identified ? '위험 해당 사유를 작성하세요...' : '위험 미해당 사유를 작성하세요...'}
                                  className="text-sm min-h-[60px]"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    )}
                  </Card>
                ))}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('info')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> 이전
                  </Button>
                  <Button onClick={() => setStep('mitigate')}>
                    다음: 완화방안 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Mitigation */}
            {step === 'mitigate' && (
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50/30">
                  <CardContent className="py-3">
                    <p className="text-sm text-green-800">
                      <strong>작성 가이드:</strong> 위험으로 식별된 항목({answers.filter(a=>a.identified).length}개)에 대해 완화방안을 수립하고,
                      완화 정도를 선택하세요. (○ 완전히 완화 / △ 잔여위험 존재 / X 위험 수준 동일)
                    </p>
                  </CardContent>
                </Card>

                {answers.filter(a => a.identified).length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      식별된 위험이 없습니다. 위험 식별 단계로 돌아가 확인해 주세요.
                    </CardContent>
                  </Card>
                ) : (
                  answers.filter(a => a.identified).map(ans => {
                    const q = questions.find(q => q.no === ans.no);
                    if (!q) return null;
                    return (
                      <Card key={ans.no}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{q.no}</span>
                            <span className="font-medium text-sm">[{q.lv1}] {q.lv3}</span>
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{q.score}점</span>
                          </div>
                          <div className="p-2 bg-blue-50 rounded text-xs border border-blue-100">
                            <strong>권장 경감방안:</strong> {q.mitigation}
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">완화 방안</label>
                            <Textarea
                              value={ans.mitigationPlan}
                              onChange={e => updateAnswer(q.no, 'mitigationPlan', e.target.value)}
                              placeholder="구체적인 완화 방안을 작성하세요..."
                              className="text-sm min-h-[60px]"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block">완화 정도</label>
                            <div className="flex gap-2">
                              {[
                                { symbol: '○', label: '완전히 완화', color: 'bg-green-100 text-green-700 border-green-300' },
                                { symbol: '△', label: '잔여위험 존재', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
                                { symbol: 'X', label: '위험 수준 동일', color: 'bg-red-100 text-red-700 border-red-300' },
                              ].map(m => (
                                <button key={m.symbol}
                                  onClick={() => updateAnswer(q.no, 'mitigationLevel', m.symbol)}
                                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-all ${
                                    ans.mitigationLevel === m.symbol
                                      ? m.color + ' shadow-sm ring-1 ring-offset-1'
                                      : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
                                  }`}
                                >
                                  {m.symbol} {m.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('identify')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> 이전
                  </Button>
                  <Button onClick={() => setStep('residual')}>
                    다음: 잔여위험 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Residual Risk */}
            {step === 'residual' && (() => {
              const score = calculateScore();
              const level = getRiskLevel(score);
              return (
                <div className="space-y-4">
                  <Card className={`border-2 ${level.color}`}>
                    <CardContent className="py-6 text-center">
                      <div className="text-4xl mb-2">{level.icon}</div>
                      <h2 className="text-2xl font-bold">{score}점 / 100점</h2>
                      <p className="text-lg font-semibold mt-1">{level.level}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        위험 식별: {answers.filter(a=>a.identified).length}건 /
                        완화 적용: {answers.filter(a=>a.identified && a.mitigationLevel).length}건
                      </p>
                    </CardContent>
                  </Card>

                  {/* Score breakdown by principle */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(groups).map(([principle, qs]) => {
                      let pScore = 0;
                      qs.forEach(q => {
                        const a = getAnswer(q.no);
                        if (a.identified) {
                          let w = 1.0;
                          if (a.mitigationLevel === '○') w = 0.0;
                          else if (a.mitigationLevel === '△') w = 0.5;
                          pScore += q.score * w;
                        }
                      });
                      const pTotal = principles.find((p: any) => p.name === principle)?.totalScore || 0;
                      return (
                        <Card key={principle} className={`${PRINCIPLE_COLORS[principle]}`}>
                          <CardContent className="py-3 text-center">
                            <div className="text-sm font-semibold">{PRINCIPLE_ICONS[principle]} {principle}</div>
                            <div className="text-xl font-bold mt-1">{Math.round(pScore*10)/10} / {pTotal}</div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Detail table */}
                  <Card>
                    <CardHeader><CardTitle className="text-sm">문항별 잔여 위험 상세</CardTitle></CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-2 text-left">No</th>
                              <th className="p-2 text-left">원칙</th>
                              <th className="p-2 text-left">위험(Lv3)</th>
                              <th className="p-2 text-center">배점</th>
                              <th className="p-2 text-center">식별</th>
                              <th className="p-2 text-center">완화</th>
                              <th className="p-2 text-center">잔여점수</th>
                            </tr>
                          </thead>
                          <tbody>
                            {questions.map(q => {
                              const a = getAnswer(q.no);
                              let w = a.identified ? (a.mitigationLevel === '○' ? 0 : a.mitigationLevel === '△' ? 0.5 : 1) : 0;
                              let residual = a.identified ? q.score * w : 0;
                              return (
                                <tr key={q.no} className="border-b hover:bg-muted/20">
                                  <td className="p-2 font-mono">{q.no}</td>
                                  <td className="p-2">{q.lv1}</td>
                                  <td className="p-2">{q.lv3}</td>
                                  <td className="p-2 text-center">{q.score}</td>
                                  <td className="p-2 text-center">{a.identified ?
                                    <span className="text-red-600 font-semibold">Yes</span> :
                                    <span className="text-green-600">No</span>}
                                  </td>
                                  <td className="p-2 text-center">{a.identified ? (a.mitigationLevel || '-') : '-'}</td>
                                  <td className="p-2 text-center font-semibold">{residual > 0 ? residual : '-'}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep('mitigate')}>
                      <ArrowLeft className="w-4 h-4 mr-1" /> 이전
                    </Button>
                    <Button onClick={() => setStep('review')}>
                      다음: AI 검토 <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              );
            })()}

            {/* Step 5: AI Review */}
            {step === 'review' && (
              <div className="space-y-4">
                <Card className="border-purple-200 bg-purple-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                      <Brain className="w-5 h-5" />
                      AI 자동 검토 (Grok LLM)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      AI가 귀하의 위험 식별 결과를 금융분야 AI RMF 기준으로 검토하고 의견을 제시합니다.
                      검토 결과를 확인한 후, 최종 확인(저장)하세요.
                    </p>
                    <Button onClick={handleAiReview} disabled={aiLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white">
                      {aiLoading ?
                        <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> AI 검토 중...</> :
                        <><Sparkles className="w-4 h-4 mr-1" /> AI 검토 요청</>
                      }
                    </Button>
                    {aiReviewResult && (
                      <div className="mt-4 p-4 bg-white border rounded-lg">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-600" />
                          AI 검토 의견
                        </h4>
                        <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">
                          {aiReviewResult}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Summary */}
                <Card>
                  <CardContent className="py-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-red-600">{answers.filter(a=>a.identified).length}</div>
                        <div className="text-xs text-muted-foreground">식별된 위험</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">{calculateScore()}</div>
                        <div className="text-xs text-muted-foreground">잔여 위험 점수</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{getRiskLevel(calculateScore()).icon}</div>
                        <div className="text-xs text-muted-foreground">{getRiskLevel(calculateScore()).level}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep('residual')}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> 이전
                  </Button>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                    <Save className="w-4 h-4 mr-1" /> 평가 저장 및 확인
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6: Result */}
            {step === 'result' && (
              <div className="space-y-4">
                <Card className="border-green-200 bg-green-50/30">
                  <CardContent className="py-8 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-700">평가가 완료되었습니다</h2>
                    <p className="text-muted-foreground mt-2">
                      {serviceName} 서비스의 위험등급평가가 성공적으로 저장되었습니다.
                    </p>
                    <div className="mt-4 text-lg font-semibold">
                      최종 위험 점수: {calculateScore()}점 · {getRiskLevel(calculateScore()).level}
                    </div>
                  </CardContent>
                </Card>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => navigate('/risk-assessment')}>
                    평가 목록으로
                  </Button>
                  <Button onClick={() => {
                    setStep('info');
                    setServiceName(''); setServiceDesc(''); setAssessor('');
                    setAiReviewResult('');
                    setAnswers(questions.map(q => ({
                      no: q.no, identified: false, reason: '', mitigationPlan: '',
                      mitigationLevel: '', residualRisk: '',
                    })));
                  }}>
                    새 평가 시작
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default RiskAssessmentWizard;
