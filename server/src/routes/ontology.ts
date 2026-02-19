/**
 * Ontology Routes
 * Dataset management, TTL/SPARQL operations, Policy management, Ontology graph
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import crypto from 'crypto';
import { getDBHelper } from '../config/database.js';

const router = Router();

// ========== Datasets ==========

router.get('/datasets', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const datasets = db.all('SELECT * FROM ontology_datasets ORDER BY created_at DESC');
    // Parse JSON fields
    const parsed = datasets.map((d: any) => ({
      ...d,
      json_data: d.json_data ? JSON.parse(d.json_data) : null,
    }));
    res.json({ items: parsed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/datasets', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { name, description, json_data, file_size } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'name is required' });
    }
    const id = crypto.randomUUID().substring(0, 12);
    db.run(
      `INSERT INTO ontology_datasets (id, name, description, json_data, file_size, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'active', datetime('now'))`,
      [id, name, description || null, json_data ? JSON.stringify(json_data) : null, file_size || 0]
    );
    db.save();
    res.status(201).json({ id, name });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/datasets/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    db.run('DELETE FROM ontology_datasets WHERE id = ?', [req.params.id]);
    db.save();
    res.json({ status: 'deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== TTL Files ==========

router.post('/ttl', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { dataset_id, ttl_content } = req.body;
    if (!ttl_content) {
      return res.status(400).json({ error: 'ttl_content is required' });
    }
    const id = crypto.randomUUID().substring(0, 12);
    db.run(
      `INSERT INTO ontology_ttl_files (id, dataset_id, ttl_content, created_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [id, dataset_id || null, ttl_content]
    );
    db.save();
    res.status(201).json({ id, status: 'saved' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ttl', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const files = db.all('SELECT id, dataset_id, length(ttl_content) as content_length, created_at FROM ontology_ttl_files ORDER BY created_at DESC');
    res.json({ items: files });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/ttl/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const ttl = db.get('SELECT * FROM ontology_ttl_files WHERE id = ?', [req.params.id]);
    if (!ttl) return res.status(404).json({ error: 'TTL file not found' });
    res.json(ttl);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== SPARQL Query ==========

router.post('/sparql/execute', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { query, fuseki_endpoint } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    const endpoint = fuseki_endpoint || 'http://localhost:3030/fc/sparql';
    const startTime = Date.now();

    try {
      // Execute SPARQL query against Fuseki
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `query=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(30000),
      });

      const execTimeMs = Date.now() - startTime;

      if (response.ok) {
        const results = await response.json();
        // Log execution
        const logId = crypto.randomUUID().substring(0, 12);
        db.run(
          `INSERT INTO ontology_query_log (id, query, results, execution_time_ms, status, created_at)
           VALUES (?, ?, ?, ?, 'success', datetime('now'))`,
          [logId, query, JSON.stringify(results), execTimeMs]
        );
        db.save();
        res.json({ results, execution_time_ms: execTimeMs });
      } else {
        const errText = await response.text();
        res.status(response.status).json({ error: `Fuseki error: ${errText}` });
      }
    } catch (fetchErr: any) {
      // Fuseki not available - return mock/error
      if (fetchErr.name === 'TimeoutError' || fetchErr.code === 'ECONNREFUSED') {
        res.status(503).json({
          error: 'Fuseki server is not running. SPARQL queries require Apache Fuseki.',
          hint: 'Start Fuseki with: ./start_fuseki.sh',
        });
      } else {
        throw fetchErr;
      }
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/sparql/history', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const history = db.all('SELECT * FROM ontology_query_log ORDER BY created_at DESC LIMIT 20');
    const parsed = history.map((h: any) => ({
      ...h,
      results: h.results ? JSON.parse(h.results) : null,
    }));
    res.json({ items: parsed });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Policies ==========

router.get('/policies', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const policies = db.all('SELECT * FROM ontology_policies ORDER BY created_at DESC');
    res.json({ items: policies });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/policies', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { name, description, sparql_query, status } = req.body;
    if (!name || !sparql_query) {
      return res.status(400).json({ error: 'name and sparql_query are required' });
    }
    const id = crypto.randomUUID().substring(0, 12);
    db.run(
      `INSERT INTO ontology_policies (id, name, description, sparql_query, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [id, name, description || null, sparql_query, status || 'draft']
    );
    db.save();
    res.status(201).json({ id, name });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/policies/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const { name, description, sparql_query, status } = req.body;
    db.run(
      `UPDATE ontology_policies SET name=?, description=?, sparql_query=?, status=?, updated_at=datetime('now') WHERE id=?`,
      [name, description, sparql_query, status, req.params.id]
    );
    db.save();
    res.json({ status: 'updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/policies/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    db.run('DELETE FROM ontology_policies WHERE id = ?', [req.params.id]);
    db.save();
    res.json({ status: 'deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Policy Analysis (Grok-powered) ==========

router.post('/policies/:id/analyze', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const policy = db.get('SELECT * FROM ontology_policies WHERE id = ?', [req.params.id]);
    if (!policy) return res.status(404).json({ error: 'Policy not found' });

    const { analyzeWithGrok } = await import('../services/rag.js');
    const content = `정책명: ${policy.name}\n설명: ${policy.description || '없음'}\nSPARQL 쿼리:\n${policy.sparql_query}`;
    const result = await analyzeWithGrok(content, 'quality');

    // Save analysis
    const analysisId = crypto.randomUUID().substring(0, 12);
    db.run(
      `INSERT INTO ontology_analyses (id, policy_id, analysis_result, quality_score, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [analysisId, req.params.id, result.analysis, 0]
    );
    db.save();

    res.json({
      id: analysisId,
      policy_id: req.params.id,
      analysis: result.analysis,
      usage: result.usage,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analyses', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const analyses = db.all('SELECT * FROM ontology_analyses ORDER BY created_at DESC');
    res.json({ items: analyses });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ========== Ontology Graph Data ==========

router.get('/graph', async (_req: Request, res: Response) => {
  try {
    // Return a sample ontology graph structure for visualization
    const db = await getDBHelper();
    const policies = db.all('SELECT id, name, status FROM ontology_policies');
    const datasets = db.all('SELECT id, name FROM ontology_datasets');

    // Build graph nodes and edges
    const nodes: any[] = [
      { id: 'root', label: 'AI Governance Ontology', type: 'root', group: 'core' },
      { id: 'risk', label: '리스크 관리', type: 'domain', group: 'risk' },
      { id: 'compliance', label: '컴플라이언스', type: 'domain', group: 'compliance' },
      { id: 'ethics', label: 'AI 윤리', type: 'domain', group: 'ethics' },
      { id: 'data', label: '데이터 거버넌스', type: 'domain', group: 'data' },
      { id: 'security', label: '보안', type: 'domain', group: 'security' },
    ];

    const edges: any[] = [
      { source: 'root', target: 'risk' },
      { source: 'root', target: 'compliance' },
      { source: 'root', target: 'ethics' },
      { source: 'root', target: 'data' },
      { source: 'root', target: 'security' },
      { source: 'risk', target: 'compliance' },
      { source: 'ethics', target: 'compliance' },
      { source: 'data', target: 'security' },
    ];

    // Add policy nodes
    for (const p of policies) {
      nodes.push({ id: `policy-${p.id}`, label: p.name, type: 'policy', group: 'policies', status: p.status });
      edges.push({ source: 'compliance', target: `policy-${p.id}` });
    }

    // Add dataset nodes
    for (const d of datasets) {
      nodes.push({ id: `dataset-${d.id}`, label: d.name, type: 'dataset', group: 'datasets' });
      edges.push({ source: 'data', target: `dataset-${d.id}` });
    }

    res.json({ nodes, edges });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
