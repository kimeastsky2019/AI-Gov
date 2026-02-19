/**
 * RAG (Retrieval-Augmented Generation) Service
 * Manages document collections, vector search simulation, and Grok-powered Q&A
 */

import crypto from 'crypto';
import { ragQuery, askGrok, analyzeWithGrok, type ChatCompletionResponse } from './grok.js';
import { getDBHelper } from '../config/database.js';

// ========== In-Memory Document Store (lightweight vector simulation) ==========

interface DocumentChunk {
  id: string;
  collectionId: string;
  documentId: string;
  content: string;
  source: string;
  metadata: Record<string, any>;
  embedding?: number[];  // simplified keyword-based scoring
  createdAt: string;
}

// In-memory store (will persist to SQLite for metadata)
const documentStore: Map<string, DocumentChunk[]> = new Map();

// Simple keyword-based relevance scoring (until proper vector DB is needed)
function computeRelevance(query: string, content: string): number {
  const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const contentLower = content.toLowerCase();
  let score = 0;
  for (const token of queryTokens) {
    const regex = new RegExp(token, 'gi');
    const matches = contentLower.match(regex);
    if (matches) score += matches.length;
  }
  // Normalize by query length
  return queryTokens.length > 0 ? score / queryTokens.length : 0;
}

// ========== Collection Management ==========

export async function createCollection(name: string): Promise<{ id: string; name: string }> {
  const db = await getDBHelper();
  const id = `col-${crypto.randomUUID().substring(0, 8)}`;

  db.run(
    `INSERT INTO rag_collections (id, name, created_at) VALUES (?, ?, datetime('now'))`,
    [id, name]
  );
  db.save();

  documentStore.set(id, []);
  return { id, name };
}

export async function listCollections(): Promise<any[]> {
  const db = await getDBHelper();
  const collections = db.all('SELECT * FROM rag_collections ORDER BY created_at DESC');

  return collections.map((c: any) => ({
    ...c,
    document_count: documentStore.get(c.id)?.length || 0,
  }));
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await getDBHelper();
  db.run('DELETE FROM rag_documents WHERE collection_id = ?', [id]);
  db.run('DELETE FROM rag_collections WHERE id = ?', [id]);
  db.save();
  documentStore.delete(id);
}

// ========== Document Ingestion ==========

function splitIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.substring(start, end));
    start = end - overlap;
    if (start + overlap >= text.length) break;
  }
  return chunks;
}

export async function ingestDocument(
  collectionId: string,
  fileName: string,
  content: string,
  metadata: Record<string, any> = {}
): Promise<{ documentId: string; chunks: number }> {
  const db = await getDBHelper();
  const documentId = `doc-${crypto.randomUUID().substring(0, 8)}`;

  // Split into chunks
  const chunks = splitIntoChunks(content);

  // Store metadata in SQLite
  db.run(
    `INSERT INTO rag_documents (id, collection_id, name, chunk_count, status, metadata, created_at)
     VALUES (?, ?, ?, ?, 'processed', ?, datetime('now'))`,
    [documentId, collectionId, fileName, chunks.length, JSON.stringify(metadata)]
  );

  // Store chunks in memory
  if (!documentStore.has(collectionId)) {
    documentStore.set(collectionId, []);
  }
  const store = documentStore.get(collectionId)!;

  for (let i = 0; i < chunks.length; i++) {
    store.push({
      id: `${documentId}-chunk-${i}`,
      collectionId,
      documentId,
      content: chunks[i]!,
      source: fileName,
      metadata: { ...metadata, chunkIndex: i, totalChunks: chunks.length },
      createdAt: new Date().toISOString(),
    });
  }

  db.save();
  return { documentId, chunks: chunks.length };
}

export async function deleteDocument(collectionId: string, documentId: string): Promise<void> {
  const db = await getDBHelper();
  db.run('DELETE FROM rag_documents WHERE id = ? AND collection_id = ?', [documentId, collectionId]);
  db.save();

  const store = documentStore.get(collectionId);
  if (store) {
    const filtered = store.filter(c => c.documentId !== documentId);
    documentStore.set(collectionId, filtered);
  }
}

export async function listDocuments(collectionId: string): Promise<any[]> {
  const db = await getDBHelper();
  return db.all('SELECT * FROM rag_documents WHERE collection_id = ? ORDER BY created_at DESC', [collectionId]);
}

// ========== Search & Retrieval ==========

export async function searchDocuments(
  collectionId: string,
  query: string,
  topK: number = 5,
  filters?: Record<string, any>
): Promise<Array<{ content: string; source: string; score: number; metadata: Record<string, any> }>> {
  const store = documentStore.get(collectionId) || [];

  if (store.length === 0) return [];

  // Score all chunks
  let scored = store.map(chunk => ({
    content: chunk.content,
    source: chunk.source,
    score: computeRelevance(query, chunk.content),
    metadata: chunk.metadata,
  }));

  // Apply metadata filters
  if (filters) {
    scored = scored.filter(doc => {
      for (const [key, value] of Object.entries(filters)) {
        if (doc.metadata[key] !== undefined && doc.metadata[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  // Sort by score descending and take top K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter(d => d.score > 0);
}

// ========== RAG Query (Search + Generate) ==========

interface RAGResult {
  answer: string;
  citations: Array<{ source: string; snippet: string }>;
  cached: boolean;
  latency_ms: number;
  usage?: ChatCompletionResponse['usage'];
}

// Simple TTL Cache
const queryCache = new Map<string, { result: RAGResult; expiry: number }>();
const CACHE_TTL = parseInt(process.env.RAG_CACHE_TTL_SEC || '300') * 1000;

function cacheKey(collectionId: string, query: string, filters?: Record<string, any>): string {
  const raw = `${collectionId}|${query}|${JSON.stringify(filters || {})}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export async function ragSearch(
  collectionId: string,
  query: string,
  options: {
    topK?: number;
    filters?: Record<string, any>;
    systemPrompt?: string;
    useCache?: boolean;
  } = {}
): Promise<RAGResult> {
  const t0 = Date.now();
  const { topK = 5, filters, systemPrompt, useCache = true } = options;

  // Check cache
  if (useCache) {
    const key = cacheKey(collectionId, query, filters);
    const cached = queryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return { ...cached.result, cached: true, latency_ms: Date.now() - t0 };
    }
  }

  // Retrieve relevant documents
  const docs = await searchDocuments(collectionId, query, topK, filters);

  if (docs.length === 0) {
    // No documents found - use Grok directly without context
    const { answer, usage } = await askGrok(
      query,
      systemPrompt || process.env.RAG_SYSTEM_PROMPT,
    );
    const result: RAGResult = {
      answer: `[문서 컨텍스트 없이 일반 응답]\n\n${answer}`,
      citations: [],
      cached: false,
      latency_ms: Date.now() - t0,
      usage,
    };
    return result;
  }

  // Generate answer with context
  const { answer, citations, usage } = await ragQuery(
    query,
    docs.map(d => ({ content: d.content, source: d.source, score: d.score })),
    systemPrompt,
  );

  const result: RAGResult = {
    answer,
    citations,
    cached: false,
    latency_ms: Date.now() - t0,
    usage,
  };

  // Store in cache
  if (useCache) {
    const key = cacheKey(collectionId, query, filters);
    queryCache.set(key, { result, expiry: Date.now() + CACHE_TTL });
  }

  // Log usage
  try {
    const db = await getDBHelper();
    db.run(
      `INSERT INTO rag_usage_log (id, collection_id, query, prompt_tokens, completion_tokens, total_tokens, latency_ms, cached, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        crypto.randomUUID().substring(0, 12),
        collectionId,
        query,
        usage?.prompt_tokens || 0,
        usage?.completion_tokens || 0,
        usage?.total_tokens || 0,
        result.latency_ms,
        0,
      ]
    );
    db.save();
  } catch (e) {
    console.warn('Failed to log RAG usage:', e);
  }

  return result;
}

// ========== General AI Chat (no RAG) ==========

export async function aiChat(
  query: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  systemPrompt?: string
): Promise<{ answer: string; usage?: ChatCompletionResponse['usage'] }> {
  const defaultPrompt = '당신은 GnG Meta AI 거버넌스 플랫폼의 지능형 어시스턴트입니다. ' +
    'AI 거버넌스, 리스크 관리, 컴플라이언스에 대해 전문적으로 답변합니다. 한국어로 응답하세요.';

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    { role: 'system', content: systemPrompt || defaultPrompt },
    ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user', content: query },
  ];

  const resp = await (await import('./grok.js')).chatCompletion(messages, {
    max_tokens: 2000,
    temperature: 0.3,
  });

  return {
    answer: resp.choices?.[0]?.message?.content || '',
    usage: resp.usage,
  };
}

// ========== AI Analysis ==========

export { analyzeWithGrok };

// ========== RAG Stats ==========

export async function getRAGStats(): Promise<any> {
  const db = await getDBHelper();

  const totalCollections = db.get('SELECT COUNT(*) as count FROM rag_collections') || { count: 0 };
  const totalDocuments = db.get('SELECT COUNT(*) as count FROM rag_documents') || { count: 0 };
  const totalQueries = db.get('SELECT COUNT(*) as count FROM rag_usage_log') || { count: 0 };
  const avgLatency = db.get('SELECT AVG(latency_ms) as avg_ms FROM rag_usage_log') || { avg_ms: 0 };
  const totalTokens = db.get('SELECT SUM(total_tokens) as total FROM rag_usage_log') || { total: 0 };

  // Count total chunks across all collections
  let totalChunks = 0;
  for (const [, chunks] of documentStore) {
    totalChunks += chunks.length;
  }

  return {
    collections: Number(totalCollections.count),
    documents: Number(totalDocuments.count),
    chunks: totalChunks,
    queries: Number(totalQueries.count),
    avg_latency_ms: Math.round(Number(avgLatency.avg_ms) || 0),
    total_tokens: Number(totalTokens.total) || 0,
  };
}
