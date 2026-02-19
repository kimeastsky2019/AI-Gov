import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Could redirect to login here
    }
    return Promise.reject(error);
  }
);

// ---- Auth API ----
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string; department?: string }) =>
    apiClient.post('/auth/register', data),
  getMe: () => apiClient.get('/auth/me'),
};

// ---- Risk Assessments API ----
export const riskAssessmentAPI = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get('/risk-assessments', { params }),
  getById: (id: string) =>
    apiClient.get(`/risk-assessments/${id}`),
  create: (data: any) =>
    apiClient.post('/risk-assessments', data),
  update: (id: string, data: any) =>
    apiClient.put(`/risk-assessments/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/risk-assessments/${id}`),
  getStats: () =>
    apiClient.get('/risk-assessments/stats/summary'),
};

// ---- Compliance API ----
export const complianceAPI = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get('/compliance', { params }),
  getById: (id: string) =>
    apiClient.get(`/compliance/${id}`),
  create: (data: any) =>
    apiClient.post('/compliance', data),
  update: (id: string, data: any) =>
    apiClient.put(`/compliance/${id}`, data),
  getStats: () =>
    apiClient.get('/compliance/stats/summary'),
};

// ---- AI Services API ----
export const aiServiceAPI = {
  getAll: (params?: Record<string, string>) =>
    apiClient.get('/ai-services', { params }),
  getById: (id: string) =>
    apiClient.get(`/ai-services/${id}`),
  create: (data: any) =>
    apiClient.post('/ai-services', data),
  update: (id: string, data: any) =>
    apiClient.put(`/ai-services/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/ai-services/${id}`),
  getStats: () =>
    apiClient.get('/ai-services/stats/summary'),
};

// ---- Products API (GnGMeta) ----
export const productAPI = {
  getAll: () =>
    apiClient.get('/products'),
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  getSolutions: () =>
    apiClient.get('/products/solutions/all'),
  getSolutionById: (id: string) =>
    apiClient.get(`/products/solutions/${id}`),
};

// ---- Dashboard API ----
export const dashboardAPI = {
  getOverview: () =>
    apiClient.get('/dashboard/overview'),
  getSecurity: () =>
    apiClient.get('/dashboard/security'),
  getRiskItems: () =>
    apiClient.get('/dashboard/risk-items'),
  submitContact: (data: any) =>
    apiClient.post('/dashboard/contact', data),
};

// ---- AI Intelligence API ----
export const aiAPI = {
  // Health & Stats
  health: () => apiClient.get('/ai/health'),
  stats: () => apiClient.get('/ai/stats'),

  // Collections
  getCollections: () => apiClient.get('/ai/collections'),
  createCollection: (name: string) => apiClient.post('/ai/collections', { name }),
  deleteCollection: (id: string) => apiClient.delete(`/ai/collections/${id}`),

  // Documents
  getDocuments: (collectionId: string) => apiClient.get(`/ai/collections/${collectionId}/documents`),
  uploadDocument: (collectionId: string, formData: FormData) =>
    apiClient.post(`/ai/collections/${collectionId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    }),
  ingestText: (collectionId: string, name: string, content: string, metadata?: any) =>
    apiClient.post(`/ai/collections/${collectionId}/ingest`, { name, content, metadata }),
  deleteDocument: (collectionId: string, docId: string) =>
    apiClient.delete(`/ai/collections/${collectionId}/documents/${docId}`),

  // Chat / RAG
  chat: (query: string, collectionId?: string, history?: any[], filters?: any, systemPrompt?: string) =>
    apiClient.post('/ai/chat', { query, collection_id: collectionId, history, filters, system_prompt: systemPrompt }, { timeout: 60000 }),

  // Search
  search: (collectionId: string, query: string, topK?: number) =>
    apiClient.post('/ai/search', { collection_id: collectionId, query, top_k: topK }),

  // Analysis
  analyze: (content: string, analysisType: string, customPrompt?: string) =>
    apiClient.post('/ai/analyze', { content, analysis_type: analysisType, custom_prompt: customPrompt }, { timeout: 60000 }),
};

// ---- Ontology API ----
export const ontologyAPI = {
  // Datasets
  getDatasets: () => apiClient.get('/ontology/datasets'),
  createDataset: (data: any) => apiClient.post('/ontology/datasets', data),
  deleteDataset: (id: string) => apiClient.delete(`/ontology/datasets/${id}`),

  // TTL
  saveTTL: (data: any) => apiClient.post('/ontology/ttl', data),
  getTTLFiles: () => apiClient.get('/ontology/ttl'),
  getTTLFile: (id: string) => apiClient.get(`/ontology/ttl/${id}`),

  // SPARQL
  executeSPARQL: (query: string, endpoint?: string) =>
    apiClient.post('/ontology/sparql/execute', { query, fuseki_endpoint: endpoint }, { timeout: 30000 }),
  getSPARQLHistory: () => apiClient.get('/ontology/sparql/history'),

  // Policies
  getPolicies: () => apiClient.get('/ontology/policies'),
  createPolicy: (data: any) => apiClient.post('/ontology/policies', data),
  updatePolicy: (id: string, data: any) => apiClient.put(`/ontology/policies/${id}`, data),
  deletePolicy: (id: string) => apiClient.delete(`/ontology/policies/${id}`),
  analyzePolicy: (id: string) => apiClient.post(`/ontology/policies/${id}/analyze`, {}, { timeout: 60000 }),

  // Analyses
  getAnalyses: () => apiClient.get('/ontology/analyses'),

  // Graph
  getGraph: () => apiClient.get('/ontology/graph'),
};

// ---- Risk Guide API (위험등급평가 가이드) ----
export const riskGuideAPI = {
  getQuestions: () => apiClient.get('/risk-guide/questions'),
  getPrinciples: () => apiClient.get('/risk-guide/principles'),
  aiReview: (serviceName: string, serviceDescription: string, answers: any[]) =>
    apiClient.post('/risk-guide/ai-review', { serviceName, serviceDescription, answers }, { timeout: 120000 }),
  aiMitigationReview: (serviceName: string, mitigations: any[]) =>
    apiClient.post('/risk-guide/ai-mitigation-review', { serviceName, mitigations }, { timeout: 120000 }),
  aiAutoAssess: (serviceName: string, serviceDescription: string) =>
    apiClient.post('/risk-guide/ai-auto-assess', { serviceName, serviceDescription }, { timeout: 120000 }),
  saveAssessment: (data: any) => apiClient.post('/risk-guide/save-assessment', data),
  getAssessments: () => apiClient.get('/risk-guide/assessments'),
  getAssessment: (id: string) => apiClient.get(`/risk-guide/assessments/${id}`),
};

// ---- sLLM (Prompt Engineering & Fine-tuning) API ----
export const sllmAPI = {
  // 프롬프트 템플릿
  getTemplates: () => apiClient.get('/sllm/templates'),
  createTemplate: (data: any) => apiClient.post('/sllm/templates', data),
  updateTemplate: (id: string, data: any) => apiClient.put(`/sllm/templates/${id}`, data),
  deleteTemplate: (id: string) => apiClient.delete(`/sllm/templates/${id}`),

  // 프롬프트 테스트 & 평가
  testPrompt: (data: { system_prompt: string; user_message: string; model?: string; temperature?: number; max_tokens?: number }) =>
    apiClient.post('/sllm/test', data, { timeout: 120000 }),
  evaluatePrompt: (data: any) =>
    apiClient.post('/sllm/evaluate', data, { timeout: 120000 }),

  // 파인튜닝 데이터셋
  getDatasets: () => apiClient.get('/sllm/datasets'),
  createDataset: (data: any) => apiClient.post('/sllm/datasets', data),
  previewDataset: (id: string) => apiClient.get(`/sllm/datasets/${id}/preview`),
  deleteDataset: (id: string) => apiClient.delete(`/sllm/datasets/${id}`),

  // 모델
  getModels: () => apiClient.get('/sllm/models'),

  // 파인튜닝 작업
  getJobs: () => apiClient.get('/sllm/jobs'),
  createJob: (data: any) => apiClient.post('/sllm/jobs', data),

  // 프롬프트 자동 생성
  generatePrompt: (data: { purpose: string; context?: string; target_model?: string; requirements?: string }) =>
    apiClient.post('/sllm/generate-prompt', data, { timeout: 120000 }),

  // 통계
  getStats: () => apiClient.get('/sllm/stats'),
};

// ---- Health check ----
export const healthCheck = () => apiClient.get('/health');

export default apiClient;
