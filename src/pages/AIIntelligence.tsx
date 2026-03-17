/**
 * AI Intelligence - Grok RAG 검색 서비스
 * Grok_RAG 서비스 연동 (http://localhost:8000)
 */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MetricCard } from "@/components/Cards";
import {
  Brain, Search, Upload, FileText, Zap, Database, Loader2,
  CheckCircle2, AlertTriangle, Trash2, Plus,
  Bot, FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ragApi, RagCollection, RagDocument } from "@/api/rag";
import { useAuth } from "@/lib/auth";

const AIIntelligence = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("search");
  const [ragConnected, setRagConnected] = useState(false);

  // 통합 로그인 활용 - 항상 true (ProtectedRoute에서 이미 검증)
  const isLoggedIn = isAuthenticated;

  const [collections, setCollections] = useState<RagCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState("");
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; message: string; citations?: any[]; latency?: number }[]>([]);
  const [stats, setStats] = useState<{ documents: number; collections: number; queries: number } | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recentUploads, setRecentUploads] = useState<{ name: string; status: "done" | "uploading" | "error" }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarFileRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 통합 로그인 시 RAG 서버 자동 인증 시도
  useEffect(() => {
    if (!isAuthenticated) return;
    ragApi.login("info@gngmeta.com", "gngmeta2024!")
      .then(() => {
        setRagConnected(true);
        // 로그인 성공 후 컬렉션 로드
        return ragApi.getCollections();
      })
      .then(data => {
        setCollections(data);
        const stored = localStorage.getItem("rag_collection_id");
        const nextId = stored && data.some(c => String(c.id) === stored) ? stored : data[0] ? String(data[0].id) : "";
        setSelectedCollectionId(nextId);
      })
      .catch(() => {
        // RAG 서버 미연결 - 로컬 모드로 동작
        setRagConnected(false);
      });
    ragApi.getStats().then(data => data && setStats(data)).catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isLoggedIn || !selectedCollectionId) { setDocuments([]); return; }
    ragApi.getDocuments(Number(selectedCollectionId), true).then(setDocuments).catch(() => {});
  }, [isLoggedIn, selectedCollectionId]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setChatHistory(prev => [...prev, { role: "user", message: userMsg }]);
    setQuery(""); setIsSearching(true);
    try {
      if (ragConnected && selectedCollectionId) {
        const res = await ragApi.chat(userMsg, Number(selectedCollectionId));
        setChatHistory(prev => [...prev, { role: "ai", message: res.answer, citations: res.citations, latency: res.latency_ms }]);
        if (stats) setStats({ ...stats, queries: stats.queries + 1 });
      } else {
        // 로컬 모드 - 데모 응답
        await new Promise(r => setTimeout(r, 1500));
        const demoAnswer = userMsg.includes("기본법")
          ? "한국 AI 기본법(인공지능 기본법)은 2026년 1월 21일부터 시행됩니다. 주요 내용으로는 고위험 AI 영향평가 의무(제18조), 투명성 확보(제22조), 이용자 권리 보장(제27조), 초거대 AI 특례(제30조) 등이 있습니다."
          : userMsg.includes("EU") || userMsg.includes("AI Act")
          ? "EU AI Act는 2024년 8월 발효되어 단계적으로 시행됩니다. AI를 4단계 위험(금지/고위험/제한/최소)으로 분류하며, 고위험 AI에는 적합성 평가, 기술 문서, 인간 감독 등의 의무가 부과됩니다."
          : `"${userMsg}"에 대한 검색 결과입니다.\n\nRAG 서버가 연결되면 업로드된 문서에서 정확한 답변을 검색합니다. 현재 로컬 모드에서 데모 응답을 제공합니다.\n\nRAG 서버 연결: localhost:8000`;
        setChatHistory(prev => [...prev, { role: "ai", message: demoAnswer, latency: 1500 }]);
      }
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: "ai", message: `오류: ${e.message}. RAG 서버(localhost:8000) 연결을 확인하세요.` }]);
    } finally { setIsSearching(false); }
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    setIsCreatingCollection(true);
    try {
      const col = await ragApi.createCollection(newCollectionName);
      setCollections(prev => [...prev, col]);
      setSelectedCollectionId(String(col.id));
      setNewCollectionName("");
    } catch (e: any) {
      // RAG 서버 미연결 시 로컬 컬렉션으로 생성
      const localCol: RagCollection = {
        id: Date.now(),
        name: newCollectionName,
        xai_id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        documents_count: 0,
      };
      setCollections(prev => [...prev, localCol]);
      setSelectedCollectionId(String(localCol.id));
      setNewCollectionName("");
    }
    finally { setIsCreatingCollection(false); }
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm("컬렉션을 삭제하시겠습니까?")) return;
    try {
      await ragApi.deleteCollection(id);
      setCollections(prev => prev.filter(c => c.id !== id));
      if (selectedCollectionId === String(id)) setSelectedCollectionId("");
    } catch (e: any) { alert(e.message); }
  };

  const ensureCollection = async (): Promise<string> => {
    if (selectedCollectionId) return selectedCollectionId;
    // 컬렉션이 없으면 자동 생성
    try {
      const col = await ragApi.createCollection("AI 거버넌스 문서");
      setCollections(prev => [...prev, col]);
      const id = String(col.id);
      setSelectedCollectionId(id);
      localStorage.setItem("rag_collection_id", id);
      return id;
    } catch {
      const localCol: RagCollection = {
        id: Date.now(), name: "AI 거버넌스 문서",
        xai_id: `local-${Date.now()}`, created_at: new Date().toISOString(), documents_count: 0,
      };
      setCollections(prev => [...prev, localCol]);
      const id = String(localCol.id);
      setSelectedCollectionId(id);
      return id;
    }
  };

  const uploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const colId = await ensureCollection();
    setIsUploading(true);
    for (const file of files) {
      setRecentUploads(prev => [{ name: file.name, status: "uploading" }, ...prev.slice(0, 9)]);
      try {
        if (ragConnected) {
          // RAG 서버로 업로드
          await ragApi.uploadDocument(Number(colId), file);
        } else {
          // 백엔드(/api/ai)로 업로드
          const formData = new FormData();
          formData.append("file", file);
          const token = localStorage.getItem("aigov_token");
          await fetch(`/api/ai/collections/${colId}/upload`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData,
          });
        }
        setRecentUploads(prev => prev.map(u => u.name === file.name && u.status === "uploading" ? { ...u, status: "done" } : u));
        // 문서 목록에 즉시 반영
        setDocuments(prev => [...prev, { id: Date.now() + Math.random(), filename: file.name, status: "processing", created_at: new Date().toISOString() } as RagDocument]);
      } catch (err: any) {
        setRecentUploads(prev => prev.map(u => u.name === file.name && u.status === "uploading" ? { ...u, status: "error" } : u));
      }
    }
    // 서버에서 최신 문서 목록 가져오기
    try { const docs = await ragApi.getDocuments(Number(colId), true); setDocuments(docs); } catch {}
    try { const s = await ragApi.getStats(); if (s) setStats(s); } catch {}
    setIsUploading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    await uploadFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDeleteDocument = async (docId: number) => {
    try { await ragApi.deleteDocument(docId); setDocuments(prev => prev.filter(d => d.id !== docId)); }
    catch (e: any) { alert(e.message); }
  };

  const processedDocs = documents.filter(d => d.status === "processed").length;
  const processingDocs = documents.filter(d => d.status === "processing").length;

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Intelligence</h1>
            <p className="text-muted-foreground mt-1">Grok RAG 기반 AI 거버넌스 문서 검색 · 질의응답 서비스</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 gap-1"><CheckCircle2 className="w-3 h-3" /> {user?.name || "로그인됨"}</Badge>
            {ragConnected ? (
              <Badge className="bg-green-100 text-green-700 text-xs gap-1"><CheckCircle2 className="w-3 h-3" /> RAG 연결됨</Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">RAG 로컬모드</Badge>
            )}
          </div>
        </div>

        {/* Solution Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-slate-800 via-gray-900 to-slate-900 border-0 text-white">
            <CardContent className="py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Grok RAG 검색 서비스</h3>
                  <p className="text-sm text-white/60 mt-0.5">xAI Grok API + Collections RAG로 AI 거버넌스 문서를 검색하고 분석합니다</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-purple-500/20 border-purple-400/30 text-purple-300 hover:bg-purple-500/30 gap-2 border"
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4" /> 문서 업로드
                  </Button>
                  <input ref={fileInputRef} type="file" className="hidden" multiple accept=".pdf,.txt,.md,.csv,.json,.docx" onChange={handleUpload} />
                  <Button className="bg-white text-gray-900 hover:bg-white/90 gap-2 font-semibold"
                    onClick={() => setActiveTab("search")}>
                    <Search className="w-4 h-4" /> RAG 검색
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="처리된 문서" value={stats?.documents ?? "—"} change={isLoggedIn ? "연결됨" : "미연결"} trend="up" />
          <MetricCard title="검색 쿼리" value={stats?.queries ?? "—"} change={`+${chatHistory.filter(c => c.role === 'user').length}`} trend="up" />
          <MetricCard title="활성 컬렉션" value={stats?.collections ?? collections.length} change={`${collections.length}개`} trend="up" />
          <MetricCard title="현재 컬렉션 문서" value={`${processedDocs}/${documents.length}`} change={processingDocs > 0 ? `${processingDocs} 인덱싱중` : "완료"} trend="up" />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="search" className="data-[state=active]:bg-background gap-1.5">
              <Search className="w-4 h-4" /> RAG 검색
            </TabsTrigger>
            <TabsTrigger value="collections" className="data-[state=active]:bg-background gap-1.5">
              <FolderOpen className="w-4 h-4" /> 컬렉션 관리
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-background gap-1.5">
              <FileText className="w-4 h-4" /> 문서 관리
            </TabsTrigger>
          </TabsList>

          {/* Tab: RAG Search */}
          <TabsContent value="search" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <div className="xl:col-span-8">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Bot className="w-5 h-5 text-purple-600" /> Grok RAG 검색
                      </CardTitle>
                      <Select value={selectedCollectionId} onValueChange={v => { setSelectedCollectionId(v); localStorage.setItem("rag_collection_id", v); }}
                        disabled={!isLoggedIn || collections.length === 0}>
                        <SelectTrigger className="w-[200px] h-8 text-xs"><SelectValue placeholder="컬렉션 선택" /></SelectTrigger>
                        <SelectContent>
                          {collections.map(c => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name} {c.documents_count !== undefined && `(${c.documents_count})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-2">
                      {chatHistory.length === 0 && (
                        <div className="text-center py-16 space-y-4">
                          <div className="relative mx-auto w-20 h-20">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping" />
                            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-white flex items-center justify-center shadow-lg border border-purple-200">
                              <Brain className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                          <p className="font-semibold">Grok RAG 검색</p>
                          <p className="text-sm text-muted-foreground">업로드된 문서에서 AI가 답변을 찾아드립니다</p>
                          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                            {["AI 기본법 핵심 조항은?", "고위험 AI 영향평가 절차", "EU AI Act 시행 일정", "금융 AI 가이드라인 요약"].map(s => (
                              <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-purple-50"
                                onClick={() => setQuery(s)}>{s}</Button>
                            ))}
                          </div>
                        </div>
                      )}
                      {chatHistory.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                          {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-md' : 'bg-muted/50 border rounded-bl-md'
                          }`}>
                            <div className="whitespace-pre-wrap">{msg.message}</div>
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
                                <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                                  <FileText className="w-3 h-3" /> 참고 문서
                                </p>
                                {msg.citations.map((cite: any, i: number) => (
                                  <div key={i} className="text-[10px] bg-background/60 p-2 rounded-lg flex items-start gap-1.5">
                                    <Badge variant="outline" className="text-[8px] shrink-0 mt-0.5">{i + 1}</Badge>
                                    <div>
                                      <span className="font-medium block">{cite.title || "문서"}</span>
                                      <span className="text-muted-foreground line-clamp-2">{cite.content || cite.snippet}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {msg.latency && <p className="text-[9px] text-muted-foreground mt-2 text-right">응답: {msg.latency}ms</p>}
                          </div>
                        </motion.div>
                      ))}
                      {isSearching && (
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-muted/50 border rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" /> 문서 검색 중...
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                    <div className="flex gap-2 border-t pt-4">
                      <Input placeholder="문서에 대해 질문하세요..."
                        value={query} onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        className="flex-1 rounded-full border-purple-200 focus:border-purple-400" />
                      <Button onClick={handleSearch} disabled={!query.trim() || isSearching}
                        className="rounded-full bg-purple-600 hover:bg-purple-700 px-6">
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="xl:col-span-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2"><Upload className="w-4 h-4 text-purple-500" /> 빠른 문서 업로드</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* 드래그 & 드롭 영역 */}
                    <div
                        className={cn(
                          "p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all",
                          isDragging ? "border-purple-500 bg-purple-50 scale-[1.02]" : "border-border hover:border-purple-300 hover:bg-muted/30"
                        )}
                        onClick={() => sidebarFileRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                      >
                        <input ref={sidebarFileRef} type="file" className="hidden" multiple
                          accept=".pdf,.txt,.md,.csv,.json,.docx" onChange={handleUpload} />
                        {isUploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-purple-500 mx-auto mb-2 animate-spin" />
                            <p className="text-xs font-medium text-purple-600">업로드 중...</p>
                          </>
                        ) : isDragging ? (
                          <>
                            <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-xs font-medium text-purple-600">여기에 놓으세요</p>
                          </>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-xs font-medium">클릭 또는 드래그하여 업로드</p>
                            <p className="text-[10px] text-muted-foreground mt-1">PDF, TXT, MD, CSV, JSON, DOCX</p>
                          </>
                        )}
                      </div>

                    {/* 최근 업로드 목록 */}
                    {recentUploads.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">최근 업로드</p>
                        {recentUploads.slice(0, 5).map((u, i) => (
                          <div key={i} className="flex items-center gap-2 py-1 px-2 rounded-lg bg-muted/30 text-xs">
                            {u.status === "uploading" ? <Loader2 className="w-3 h-3 animate-spin text-purple-500 shrink-0" /> :
                             u.status === "done" ? <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" /> :
                             <AlertTriangle className="w-3 h-3 text-red-500 shrink-0" />}
                            <span className="truncate flex-1">{u.name}</span>
                            <Badge className={cn("text-[8px] px-1 py-0",
                              u.status === "done" ? "bg-green-100 text-green-700" :
                              u.status === "uploading" ? "bg-purple-100 text-purple-700" :
                              "bg-red-100 text-red-700"
                            )}>
                              {u.status === "done" ? "완료" : u.status === "uploading" ? "진행중" : "실패"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {selectedCollectionId && documents.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2"><Database className="w-4 h-4 text-blue-500" /> 현재 컬렉션</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">전체 문서</span><span className="font-bold">{documents.length}</span></div>
                      <div className="flex justify-between text-xs"><span className="text-muted-foreground">처리 완료</span><span className="font-bold text-green-600">{processedDocs}</span></div>
                      {processingDocs > 0 && (
                        <div className="flex justify-between text-xs"><span className="text-muted-foreground">인덱싱 중</span><span className="font-bold text-amber-600">{processingDocs}</span></div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                  <CardContent className="pt-5 space-y-3">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">기술 스택</p>
                    {[
                      { label: "Grok API", desc: "xAI 최신 LLM 추론" },
                      { label: "Collections API", desc: "관리형 RAG 인덱싱" },
                      { label: "하이브리드 검색", desc: "벡터 + 키워드 결합" },
                      { label: "실시간 처리", desc: "2초 이내 응답" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60">
                        <Zap className="w-4 h-4 text-purple-500 shrink-0" />
                        <div><p className="text-xs font-medium">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tab: Collections */}
          <TabsContent value="collections" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">컬렉션 관리</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="새 컬렉션 이름" value={newCollectionName} onChange={e => setNewCollectionName(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleCreateCollection()}
                      className="w-48 h-8 text-xs" />
                    <Button size="sm" onClick={handleCreateCollection} disabled={!newCollectionName.trim() || isCreatingCollection} className="gap-1">
                      {isCreatingCollection ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} 생성
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {collections.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">컬렉션이 없습니다. 위 입력란에 이름을 입력하고 생성 버튼을 클릭하세요.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2.5 px-3 font-semibold text-xs">컬렉션명</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">문서 수</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">생성일</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">상태</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {collections.map(col => (
                          <tr key={col.id} className={cn("border-b hover:bg-muted/30", selectedCollectionId === String(col.id) && "bg-purple-50/30")}>
                            <td className="py-2.5 px-3 font-medium text-xs">{col.name}</td>
                            <td className="text-center py-2.5 px-3 text-xs">{col.documents_count ?? "-"}</td>
                            <td className="text-center py-2.5 px-3 text-xs text-muted-foreground">{col.created_at?.split("T")[0]}</td>
                            <td className="text-center py-2.5 px-3">
                              {selectedCollectionId === String(col.id)
                                ? <Badge className="bg-green-600 text-[10px]">선택됨</Badge>
                                : <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setSelectedCollectionId(String(col.id))}>선택</Button>}
                            </td>
                            <td className="text-center py-2.5 px-3">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700" onClick={() => handleDeleteCollection(col.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Documents */}
          <TabsContent value="documents" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    문서 관리
                    {selectedCollectionId && collections.find(c => String(c.id) === selectedCollectionId) && (
                      <span className="text-muted-foreground font-normal text-sm ml-2">
                        — {collections.find(c => String(c.id) === selectedCollectionId)?.name}
                      </span>
                    )}
                  </CardTitle>
                  <Button size="sm" className="gap-1" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-3 h-3" /> 업로드
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="text-sm">{selectedCollectionId ? "문서가 없습니다. 파일을 업로드하세요." : "컬렉션을 먼저 선택하세요."}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2.5 px-3 font-semibold text-xs">파일명</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">상태</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">청크</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">업로드일</th>
                          <th className="text-center py-2.5 px-3 font-semibold text-xs">삭제</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map(doc => (
                          <tr key={doc.id} className="border-b hover:bg-muted/30">
                            <td className="py-2.5 px-3 text-xs font-medium">{doc.filename}</td>
                            <td className="text-center py-2.5 px-3">
                              <Badge className={cn("text-[10px]",
                                doc.status === "processed" ? "bg-green-600" :
                                doc.status === "processing" ? "bg-amber-600" : "bg-red-600"
                              )}>
                                {doc.status === "processed" ? "완료" : doc.status === "processing" ? "인덱싱" : "실패"}
                              </Badge>
                            </td>
                            <td className="text-center py-2.5 px-3 text-xs">{doc.chunk_count ?? "-"}</td>
                            <td className="text-center py-2.5 px-3 text-xs text-muted-foreground">{doc.created_at?.split("T")[0]}</td>
                            <td className="text-center py-2.5 px-3">
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500" onClick={() => handleDeleteDocument(doc.id)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIIntelligence;
