/**
 * Grok RAG API Client
 * Grok_RAG 서비스 (http://localhost:8000) 연동
 */

const RAG_API_BASE = import.meta.env.VITE_RAG_API_URL || "http://localhost:8000";

export interface RagCollection {
  id: number;
  name: string;
  xai_id: string;
  created_at: string;
  documents_count?: number;
  processing_count?: number;
  failed_count?: number;
}

export interface RagChatResponse {
  request_id: string;
  answer: string;
  citations: { title?: string; content?: string; snippet?: string }[];
  cached: boolean;
  latency_ms: number;
}

export interface RagDocument {
  id: number;
  filename: string;
  status: "processed" | "processing" | "failed";
  created_at: string;
  chunk_count?: number;
}

function getHeaders(): Record<string, string> {
  // 1차: RAG 전용 토큰, 2차: AI-Gov 통합 토큰 사용
  const token = localStorage.getItem("rag_token") || localStorage.getItem("aigov_token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export const ragApi = {
  async login(username: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const res = await fetch(`${RAG_API_BASE}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });
    if (!res.ok) throw new Error("Login failed");
    const data = await res.json();
    localStorage.setItem("rag_token", data.access_token);
    return data;
  },

  logout() {
    localStorage.removeItem("rag_token");
  },

  isLoggedIn() {
    return !!(localStorage.getItem("rag_token") || localStorage.getItem("aigov_token"));
  },

  async getCollections(): Promise<RagCollection[]> {
    const res = await fetch(`${RAG_API_BASE}/collections`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch collections");
    return res.json();
  },

  async createCollection(name: string): Promise<RagCollection> {
    const res = await fetch(`${RAG_API_BASE}/collections`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error("Failed to create collection");
    return res.json();
  },

  async deleteCollection(id: number) {
    const res = await fetch(`${RAG_API_BASE}/collections/${id}`, { method: "DELETE", headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to delete collection");
    return res.json();
  },

  async getDocuments(collectionId: number, refresh?: boolean): Promise<RagDocument[]> {
    const q = refresh ? "?refresh=true" : "";
    const res = await fetch(`${RAG_API_BASE}/collections/${collectionId}${q}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  },

  async uploadDocument(collectionId: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${RAG_API_BASE}/collections/${collectionId}/upload`, {
      method: "POST",
      headers: getHeaders(),
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload");
    return res.json();
  },

  async deleteDocument(documentId: number) {
    const res = await fetch(`${RAG_API_BASE}/documents/${documentId}`, { method: "DELETE", headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to delete document");
    return res.json();
  },

  async chat(query: string, collectionId?: number, filters?: any): Promise<RagChatResponse> {
    const body: any = { query };
    if (collectionId) body.collection_id = collectionId;
    if (filters) body.filters = filters;
    const res = await fetch(`${RAG_API_BASE}/chat`, {
      method: "POST",
      headers: { ...getHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Chat failed");
    return res.json();
  },

  async getStats(): Promise<{ documents: number; collections: number; queries: number } | null> {
    try {
      const res = await fetch(`${RAG_API_BASE}/stats`, { headers: getHeaders() });
      if (!res.ok) return null;
      return res.json();
    } catch { return null; }
  },
};
