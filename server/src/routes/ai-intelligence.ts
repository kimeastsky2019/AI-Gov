/**
 * AI Intelligence Routes
 * Grok-powered RAG, Chat, Analysis endpoints
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import {
  createCollection,
  listCollections,
  deleteCollection,
  ingestDocument,
  deleteDocument,
  listDocuments,
  ragSearch,
  aiChat,
  analyzeWithGrok,
  getRAGStats,
  searchDocuments,
} from '../services/rag.js';
import { checkGrokHealth } from '../services/grok.js';

const router = Router();

// Multer for file upload (in-memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.txt', '.md', '.csv', '.json', '.pdf', '.docx'];
    const ext = '.' + (file.originalname.split('.').pop()?.toLowerCase() || '');
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${ext} not allowed`));
    }
  },
});

// ========== Health & Stats ==========

router.get('/health', async (_req: Request, res: Response) => {
  try {
    const grokStatus = await checkGrokHealth();
    const stats = await getRAGStats();
    res.json({
      status: 'ok',
      grok: grokStatus,
      rag: stats,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await getRAGStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Collections ==========

router.get('/collections', async (_req: Request, res: Response) => {
  try {
    const collections = await listCollections();
    res.json({ items: collections });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/collections', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const collection = await createCollection(name);
    res.status(201).json(collection);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/collections/:id', async (req: Request, res: Response) => {
  try {
    await deleteCollection(req.params.id as string);
    res.json({ status: 'deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Documents ==========

router.get('/collections/:collectionId/documents', async (req: Request, res: Response) => {
  try {
    const docs = await listDocuments(req.params.collectionId as string);
    res.json({ items: docs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/collections/:collectionId/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const content = file.buffer.toString('utf-8');
    const metadata: Record<string, any> = {};

    if (req.body.category) metadata.category = req.body.category;
    if (req.body.tags) metadata.tags = req.body.tags.split(',').map((t: string) => t.trim());
    if (req.body.version) metadata.version = req.body.version;

    const collectionId = req.params.collectionId as string as string;
    const fileName = file.originalname || 'unnamed';
    const result = await ingestDocument(
      collectionId,
      fileName,
      content,
      metadata
    );

    res.status(201).json({
      status: 'uploaded',
      document_id: result.documentId,
      chunks: result.chunks,
      file_name: fileName,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Text-based document ingestion (no file upload)
router.post('/collections/:collectionId/ingest', async (req: Request, res: Response) => {
  try {
    const { name, content, metadata } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'name and content are required' });
    }

    const result = await ingestDocument(
      req.params.collectionId as string,
      name,
      content,
      metadata || {}
    );

    res.status(201).json({
      status: 'ingested',
      document_id: result.documentId,
      chunks: result.chunks,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/collections/:collectionId/documents/:docId', async (req: Request, res: Response) => {
  try {
    await deleteDocument(req.params.collectionId as string, req.params.docId as string);
    res.json({ status: 'deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Search ==========

router.post('/search', async (req: Request, res: Response) => {
  try {
    const { collection_id, query, top_k, filters } = req.body;
    if (!collection_id || !query) {
      return res.status(400).json({ error: 'collection_id and query are required' });
    }
    const results = await searchDocuments(collection_id, query, top_k || 5, filters);
    res.json({ items: results, count: results.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== RAG Chat ==========

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { query, collection_id, filters, system_prompt } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    if (collection_id) {
      // RAG mode: search documents + generate
      const result = await ragSearch(collection_id, query, {
        filters,
        systemPrompt: system_prompt,
      });
      res.json({
        mode: 'rag',
        answer: result.answer,
        citations: result.citations,
        cached: result.cached,
        latency_ms: result.latency_ms,
        usage: result.usage,
      });
    } else {
      // General AI chat mode
      const history = req.body.history || [];
      const result = await aiChat(query, history, system_prompt);
      res.json({
        mode: 'chat',
        answer: result.answer,
        citations: [],
        cached: false,
        latency_ms: 0,
        usage: result.usage,
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== AI Analysis ==========

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { content, analysis_type, custom_prompt } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const validTypes = ['risk', 'compliance', 'quality', 'summary', 'custom'];
    const type = validTypes.includes(analysis_type) ? analysis_type : 'summary';

    const result = await analyzeWithGrok(content, type, custom_prompt);
    res.json({
      analysis: result.analysis,
      analysis_type: type,
      usage: result.usage,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
