import React, { useState, useEffect, useRef, useMemo } from 'react';
import { aiAPI, ontologyAPI } from '../api/client';
import { useI18n } from '@/lib/i18n';

// Types
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: Array<{ source: string; snippet: string }>;
  mode?: string;
  timestamp: string;
}

interface Collection {
  id: string;
  name: string;
  document_count: number;
  created_at: string;
}

interface Document {
  id: string;
  name: string;
  chunk_count: number;
  status: string;
  created_at: string;
}

// Tab type
type Tab = 'chat' | 'collections' | 'ontology' | 'analysis';

const AIIntelligence: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Collections state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<string>('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  // Analysis state
  const [analysisContent, setAnalysisContent] = useState('');
  const [analysisType, setAnalysisType] = useState('summary');
  const [analysisResult, setAnalysisResult] = useState('');
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Ontology state
  const [policies, setPolicies] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicySPARQL, setNewPolicySPARQL] = useState('');
  const [policyLoading, setPolicyLoading] = useState(false);

  // Stats
  const [stats, setStats] = useState<any>(null);

  const statsItems = useMemo(() => [
    { label: t('aiIntelligence.stat.collections'), key: 'collections', color: 'blue' },
    { label: t('aiIntelligence.stat.documents'), key: 'documents', color: 'green' },
    { label: t('aiIntelligence.stat.chunks'), key: 'chunks', color: 'purple' },
    { label: t('aiIntelligence.stat.queries'), key: 'queries', color: 'orange' },
  ], [t]);

  const analysisTypes = useMemo(() => [
    { value: 'summary', label: `📝 ${t('aiIntelligence.analysis.summary')}` },
    { value: 'risk', label: `⚠️ ${t('aiIntelligence.analysis.risk')}` },
    { value: 'compliance', label: `✅ ${t('aiIntelligence.analysis.compliance')}` },
    { value: 'quality', label: `📐 ${t('aiIntelligence.analysis.quality')}` },
    { value: 'custom', label: `🔧 ${t('aiIntelligence.analysis.custom')}` },
  ], [t]);

  useEffect(() => {
    loadCollections();
    loadStats();
    if (activeTab === 'ontology') {
      loadPolicies();
      loadGraph();
    }
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadStats = async () => {
    try {
      const res = await aiAPI.stats();
      setStats(res.data);
    } catch (e) { /* silent */ }
  };

  const loadCollections = async () => {
    try {
      const res = await aiAPI.getCollections();
      setCollections(res.data.items || []);
    } catch (e) { /* silent */ }
  };

  const loadDocuments = async (collId: string) => {
    try {
      const res = await aiAPI.getDocuments(collId);
      setDocuments(res.data.items || []);
      setActiveCollectionId(collId);
    } catch (e) { /* silent */ }
  };

  const loadPolicies = async () => {
    try {
      const res = await ontologyAPI.getPolicies();
      setPolicies(res.data.items || []);
    } catch (e) { /* silent */ }
  };

  const loadGraph = async () => {
    try {
      const res = await ontologyAPI.getGraph();
      setGraphData(res.data);
    } catch (e) { /* silent */ }
  };

  // ===== Chat =====
  const sendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await aiAPI.chat(
        userMsg.content,
        selectedCollection || undefined,
        history,
      );
      const data = res.data;
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
        mode: data.mode,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `${t('aiIntelligence.chat.error')}: ${err.response?.data?.error || err.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // ===== Collections =====
  const createNewCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await aiAPI.createCollection(newCollectionName);
      setNewCollectionName('');
      loadCollections();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeCollectionId || !e.target.files?.length) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      await aiAPI.uploadDocument(activeCollectionId, formData);
      loadDocuments(activeCollectionId);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setUploadLoading(false);
      e.target.value = '';
    }
  };

  // ===== Analysis =====
  const runAnalysis = async () => {
    if (!analysisContent.trim() || analysisLoading) return;
    setAnalysisLoading(true);
    setAnalysisResult('');
    try {
      const res = await aiAPI.analyze(analysisContent, analysisType);
      setAnalysisResult(res.data.analysis);
    } catch (err: any) {
      setAnalysisResult(`${t('aiIntelligence.chat.error')}: ${err.response?.data?.error || err.message}`);
    } finally {
      setAnalysisLoading(false);
    }
  };

  // ===== Ontology =====
  const createPolicy = async () => {
    if (!newPolicyName.trim() || !newPolicySPARQL.trim()) return;
    setPolicyLoading(true);
    try {
      await ontologyAPI.createPolicy({
        name: newPolicyName,
        sparql_query: newPolicySPARQL,
        status: 'draft',
      });
      setNewPolicyName('');
      setNewPolicySPARQL('');
      loadPolicies();
      loadGraph();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setPolicyLoading(false);
    }
  };

  const analyzePolicy = async (id: string) => {
    try {
      const res = await ontologyAPI.analyzePolicy(id);
      alert(`${t('aiIntelligence.ontology.analysisComplete')}:\n${res.data.analysis?.substring(0, 300)}...`);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const tabClass = (tab: Tab) =>
    `px-4 py-2 rounded-t-lg text-sm font-medium cursor-pointer transition-colors ${
      activeTab === tab
        ? 'bg-blue-600 text-white'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">🧠</span> {t('aiIntelligence.header')}
        </h1>
        <p className="text-gray-500 mt-1">
          {t('aiIntelligence.headerDesc')}
        </p>

        {/* Stats Bar */}
        {stats && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statsItems.map(({ label, key, color }) => (
              <div key={key} className={`bg-white rounded-lg p-3 border-l-4 border-${color}-500 shadow-sm`}>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-xl font-bold">{stats[key]}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-1 mb-0">
          <button className={tabClass('chat')} onClick={() => setActiveTab('chat')}>💬 {t('aiIntelligence.tab.chat')}</button>
          <button className={tabClass('collections')} onClick={() => setActiveTab('collections')}>📂 {t('aiIntelligence.tab.collections')}</button>
          <button className={tabClass('ontology')} onClick={() => setActiveTab('ontology')}>🔗 {t('aiIntelligence.tab.ontology')}</button>
          <button className={tabClass('analysis')} onClick={() => setActiveTab('analysis')}>📊 {t('aiIntelligence.tab.analysis')}</button>
        </div>

        <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm border p-6 min-h-[500px]">
          {/* ===== CHAT TAB ===== */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[600px]">
              {/* Collection selector */}
              <div className="mb-3 flex items-center gap-2">
                <select
                  className="border rounded px-3 py-1.5 text-sm bg-gray-50"
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value)}
                >
                  <option value="">{t('aiIntelligence.chat.general')}</option>
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>📂 {c.name} ({c.document_count}{t('aiIntelligence.collections.docCount')})</option>
                  ))}
                </select>
                <span className="text-xs text-gray-400">
                  {selectedCollection ? `🔍 ${t('aiIntelligence.chat.ragMode')}` : `💬 ${t('aiIntelligence.chat.chatMode')}`}
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-3 bg-gray-50 rounded-lg">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 py-20">
                    <p className="text-4xl mb-3">🤖</p>
                    <p className="font-medium">{t('aiIntelligence.chat.empty')}</p>
                    <p className="text-sm mt-1">{t('aiIntelligence.chat.emptyDesc')}</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border shadow-sm'
                      }`}
                    >
                      {msg.mode && (
                        <div className="text-xs opacity-60 mb-1">
                          {msg.mode === 'rag' ? '🔍 RAG' : '💬 Chat'}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">📚 {t('aiIntelligence.chat.sources')}:</p>
                          {msg.citations.map((c, j) => (
                            <p key={j} className="text-xs text-gray-400 truncate">• {c.source}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-500">{t('aiIntelligence.chat.loading')}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('aiIntelligence.chat.placeholder')}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={chatLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('aiIntelligence.chat.send')}
                </button>
              </div>
            </div>
          )}

          {/* ===== COLLECTIONS TAB ===== */}
          {activeTab === 'collections' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Collection List */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">📂 {t('aiIntelligence.collections.title')}</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    className="flex-1 border rounded px-3 py-1.5 text-sm"
                    placeholder={t('aiIntelligence.collections.newName')}
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createNewCollection()}
                  />
                  <button
                    onClick={createNewCollection}
                    className="bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700"
                  >
                    {t('aiIntelligence.collections.create')}
                  </button>
                </div>
                <div className="space-y-2">
                  {collections.map(c => (
                    <div
                      key={c.id}
                      onClick={() => loadDocuments(c.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeCollectionId === c.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">
                        {c.document_count}{t('aiIntelligence.collections.docCount')} · {new Date(c.created_at).toLocaleDateString('ko')}
                      </p>
                    </div>
                  ))}
                  {collections.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">
                      {t('aiIntelligence.collections.empty')}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Documents */}
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-gray-700 mb-3">
                  📄 {t('aiIntelligence.documents.title')} {activeCollectionId && `(${collections.find(c => c.id === activeCollectionId)?.name})`}
                </h3>
                {activeCollectionId ? (
                  <>
                    <div className="mb-3 flex items-center gap-3">
                      <label className="bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-blue-700">
                        {uploadLoading ? t('aiIntelligence.documents.uploading') : `📤 ${t('aiIntelligence.documents.upload')}`}
                        <input
                          type="file"
                          className="hidden"
                          accept=".txt,.md,.csv,.json,.pdf,.docx"
                          onChange={handleFileUpload}
                          disabled={uploadLoading}
                        />
                      </label>
                      <span className="text-xs text-gray-400">.txt, .md, .csv, .json, .pdf, .docx</span>
                    </div>
                    <div className="space-y-2">
                      {documents.map(d => (
                        <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{d.name}</p>
                            <p className="text-xs text-gray-500">
                              {d.chunk_count}{t('aiIntelligence.documents.chunks')} · {t('aiIntelligence.documents.status')}: {d.status}
                            </p>
                          </div>
                          <button
                            onClick={() => { aiAPI.deleteDocument(activeCollectionId, d.id); loadDocuments(activeCollectionId); }}
                            className="text-red-500 text-xs hover:underline"
                          >
                            {t('aiIntelligence.documents.delete')}
                          </button>
                        </div>
                      ))}
                      {documents.length === 0 && (
                        <p className="text-sm text-gray-400 text-center py-8">
                          {t('aiIntelligence.documents.empty')}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-16">
                    {t('aiIntelligence.documents.selectCollection')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ===== ONTOLOGY TAB ===== */}
          {activeTab === 'ontology' && (
            <div className="space-y-6">
              {/* Ontology Graph */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">🔗 {t('aiIntelligence.ontology.graph')}</h3>
                {graphData && (
                  <div className="bg-gray-900 rounded-lg p-6 text-white overflow-auto" style={{ minHeight: 300 }}>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {graphData.nodes.map((node: any) => {
                        const colors: Record<string, string> = {
                          root: 'bg-yellow-500',
                          domain: 'bg-blue-500',
                          policy: 'bg-green-500',
                          dataset: 'bg-purple-500',
                        };
                        return (
                          <div
                            key={node.id}
                            className={`${colors[node.type] || 'bg-gray-500'} rounded-lg px-4 py-2 text-sm font-medium shadow-lg`}
                          >
                            {node.label}
                            {node.status && <span className="ml-1 text-xs opacity-75">({node.status})</span>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 text-center text-xs text-gray-400">
                      {graphData.edges.length}{t('aiIntelligence.ontology.relations')} · {graphData.nodes.length}{t('aiIntelligence.ontology.nodes')}
                    </div>
                  </div>
                )}
              </div>

              {/* Policy Management */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">📋 {t('aiIntelligence.ontology.policyManagement')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    className="border rounded px-3 py-2 text-sm"
                    placeholder={t('aiIntelligence.ontology.policyName')}
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                      placeholder={t('aiIntelligence.ontology.sparqlQuery')}
                      value={newPolicySPARQL}
                      onChange={(e) => setNewPolicySPARQL(e.target.value)}
                    />
                    <button
                      onClick={createPolicy}
                      disabled={policyLoading}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      {t('aiIntelligence.ontology.add')}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {policies.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500 font-mono truncate max-w-md">{p.sparql_query}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => analyzePolicy(p.id)}
                          className="text-blue-600 text-xs hover:underline"
                        >
                          {t('aiIntelligence.ontology.aiAnalysis')}
                        </button>
                        <button
                          onClick={async () => { await ontologyAPI.deletePolicy(p.id); loadPolicies(); loadGraph(); }}
                          className="text-red-500 text-xs hover:underline"
                        >
                          {t('aiIntelligence.ontology.delete')}
                        </button>
                      </div>
                    </div>
                  ))}
                  {policies.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">{t('aiIntelligence.ontology.noPolicies')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== ANALYSIS TAB ===== */}
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">📊 {t('aiIntelligence.analysis.title')}</h3>
                <div className="mb-3">
                  <select
                    className="border rounded px-3 py-2 text-sm w-full"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                  >
                    {analysisTypes.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="w-full border rounded-lg p-3 text-sm resize-none"
                  rows={15}
                  placeholder={t('aiIntelligence.analysis.placeholder')}
                  value={analysisContent}
                  onChange={(e) => setAnalysisContent(e.target.value)}
                />
                <button
                  onClick={runAnalysis}
                  disabled={analysisLoading || !analysisContent.trim()}
                  className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 w-full"
                >
                  {analysisLoading ? t('aiIntelligence.analysis.running') : `🧠 ${t('aiIntelligence.analysis.run')}`}
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">📋 {t('aiIntelligence.analysis.resultTitle')}</h3>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[400px]">
                  {analysisResult ? (
                    <div className="text-sm whitespace-pre-wrap">{analysisResult}</div>
                  ) : (
                    <p className="text-gray-400 text-center py-20">
                      {t('aiIntelligence.analysis.emptyResult')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIIntelligence;
