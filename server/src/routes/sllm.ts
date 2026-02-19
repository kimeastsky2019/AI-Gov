/**
 * sLLM 프롬프트 엔지니어링 & 파인튜닝 API 라우트
 */
import { Router } from 'express';
import type { Request, Response } from 'express';
import { getDBHelper } from '../config/database.js';
import { chatCompletion } from '../services/grok.js';
import type { ChatMessage } from '../services/grok.js';

const router = Router();

// =============================================
// 프롬프트 템플릿 CRUD
// =============================================

router.get('/templates', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const templates = db.all('SELECT * FROM sllm_prompt_templates ORDER BY updated_at DESC');
    res.json({ templates });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/templates', async (req: Request, res: Response) => {
  try {
    const { name, context, system_prompt, user_prompt_template, variables, category, tags } = req.body;
    const db = await getDBHelper();
    const id = `TPL-${crypto.randomUUID().substring(0, 8)}`;
    db.run(
      `INSERT INTO sllm_prompt_templates (id, name, context, system_prompt, user_prompt_template, variables, category, tags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [id, name, context || '', system_prompt, user_prompt_template || '', JSON.stringify(variables || []), category || 'general', JSON.stringify(tags || [])]
    );
    db.save();
    res.json({ id, message: '프롬프트 템플릿이 생성되었습니다.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/templates/:id', async (req: Request, res: Response) => {
  try {
    const { name, context, system_prompt, user_prompt_template, variables, category, tags, status } = req.body;
    const db = await getDBHelper();
    db.run(
      `UPDATE sllm_prompt_templates SET name=?, context=?, system_prompt=?, user_prompt_template=?, variables=?, category=?, tags=?, status=?, updated_at=datetime('now')
       WHERE id=?`,
      [name, context || '', system_prompt, user_prompt_template || '', JSON.stringify(variables || []), category || 'general', JSON.stringify(tags || []), status || 'draft', req.params.id]
    );
    db.save();
    res.json({ message: '수정 완료' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/templates/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    db.run('DELETE FROM sllm_prompt_templates WHERE id=?', [req.params.id]);
    db.save();
    res.json({ message: '삭제 완료' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// 프롬프트 테스트 & 평가
// =============================================

router.post('/test', async (req: Request, res: Response) => {
  try {
    const { system_prompt, user_message, temperature, max_tokens } = req.body;
    const startTime = Date.now();

    const messages: ChatMessage[] = [
      { role: 'system', content: system_prompt },
      { role: 'user', content: user_message },
    ];

    const resp = await chatCompletion(messages, {
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 2048,
    });

    const elapsed = Date.now() - startTime;
    const responseText = resp.choices?.[0]?.message?.content || '';

    res.json({
      response: responseText,
      latency_ms: elapsed,
      model: resp.model,
      usage: resp.usage,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const { system_prompt, user_prompt_template, test_input, test_output } = req.body;

    const evaluationPrompt = `당신은 AI 프롬프트 엔지니어링 전문가입니다. 아래 프롬프트와 결과를 평가해 주세요.

[시스템 프롬프트]
${system_prompt}

[사용자 프롬프트 템플릿]
${user_prompt_template || '없음'}

[테스트 입력]
${test_input}

[AI 응답 결과]
${test_output}

다음 기준으로 평가해 주세요:
1. 명확성 (1-10): 프롬프트가 명확하고 구체적인가?
2. 완전성 (1-10): 필요한 맥락과 지시사항이 모두 포함되어 있는가?
3. 응답 품질 (1-10): AI 응답이 의도에 부합하는가?
4. 효율성 (1-10): 토큰 사용이 효율적인가?
5. 안전성 (1-10): 잠재적 위험이나 편향이 있는가?

JSON 형태로 응답:
{"scores": {"clarity": N, "completeness": N, "response_quality": N, "efficiency": N, "safety": N}, "overall": N, "suggestions": ["개선사항1", "개선사항2"], "improved_prompt": "개선된 시스템 프롬프트"}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: '당신은 AI 프롬프트 엔지니어링 품질 평가 전문가입니다. 반드시 JSON 형태로 응답하세요.' },
      { role: 'user', content: evaluationPrompt },
    ];

    const resp = await chatCompletion(messages, { temperature: 0.3, max_tokens: 2048 });
    const resultText = resp.choices?.[0]?.message?.content || '';

    let evaluation;
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: resultText };
    } catch {
      evaluation = { raw: resultText };
    }

    res.json({ evaluation });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// 파인튜닝 데이터셋 관리
// =============================================

router.get('/datasets', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const datasets = db.all('SELECT * FROM sllm_finetune_datasets ORDER BY created_at DESC');
    res.json({ datasets });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/datasets', async (req: Request, res: Response) => {
  try {
    const { name, description, source_type, format } = req.body;
    const db = await getDBHelper();
    const id = `DS-${crypto.randomUUID().substring(0, 8)}`;

    let records: any[] = [];

    switch (source_type) {
      case 'risk_assessments': {
        const rows = db.all('SELECT * FROM risk_assessments_v2 WHERE status != "draft"');
        records = rows.map((row: any) => ({
          input: `AI 서비스 "${row.service_name}"에 대한 위험성 평가: ${row.service_description}`,
          output: `위험 등급: ${row.risk_level}, 총 점수: ${row.total_score}, AI 검토: ${row.ai_review}`,
        }));
        break;
      }
      case 'compliance_reports': {
        const rows = db.all('SELECT * FROM compliance');
        records = rows.map((row: any) => ({
          input: `컴플라이언스 보고서 "${row.title}" (${row.standard}) 분석`,
          output: `상태: ${row.status}, 점수: ${row.score}, 결함: ${row.findings}건`,
        }));
        break;
      }
      case 'ai_services': {
        const rows = db.all('SELECT * FROM ai_services');
        records = rows.map((row: any) => ({
          input: `AI 서비스 "${row.name}" (${row.provider}) 위험 분석`,
          output: `위험 점수: ${row.risk_score}, 준수율: ${row.compliance_level}%, 상태: ${row.status}`,
        }));
        break;
      }
      case 'chat_history': {
        const rows = db.all('SELECT * FROM ai_chat_messages ORDER BY created_at DESC LIMIT 500');
        for (let i = 0; i < rows.length - 1; i++) {
          if (rows[i].role === 'user' && rows[i + 1].role === 'assistant') {
            records.push({ input: rows[i].content, output: rows[i + 1].content });
          }
        }
        break;
      }
    }

    db.run(
      `INSERT INTO sllm_finetune_datasets (id, name, description, source_type, source_config, record_count, format, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ready')`,
      [id, name, description || '', source_type, JSON.stringify({ records }), records.length, format || 'jsonl']
    );
    db.save();

    res.json({ id, recordCount: records.length, message: `${records.length}건의 데이터로 데이터셋이 생성되었습니다.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/datasets/:id/preview', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const ds = db.get('SELECT source_config FROM sllm_finetune_datasets WHERE id=?', [req.params.id]);
    if (!ds) return res.status(404).json({ error: 'Not found' });
    const config = JSON.parse(ds.source_config || '{}');
    const preview = (config.records || []).slice(0, 10);
    res.json({ preview, total: (config.records || []).length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/datasets/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    db.run('DELETE FROM sllm_finetune_datasets WHERE id=?', [req.params.id]);
    db.save();
    res.json({ message: '삭제 완료' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// 모델 설정
// =============================================

router.get('/models', async (_req: Request, res: Response) => {
  const models = [
    { id: 'grok-4-latest', name: 'Grok 4 (Latest)', provider: 'xAI', type: 'cloud', status: 'active', capabilities: ['chat', 'analysis', 'code'] },
    { id: 'grok-3-mini', name: 'Grok 3 Mini', provider: 'xAI', type: 'cloud', status: 'available', capabilities: ['chat'] },
    { id: 'custom-sllm-v1', name: '거버넌스 전문 sLLM v1', provider: 'GnG Meta (자체)', type: 'local', status: 'training', capabilities: ['governance', 'compliance', 'risk'] },
    { id: 'custom-sllm-v2', name: '규제 분석 sLLM v2', provider: 'GnG Meta (자체)', type: 'local', status: 'planned', capabilities: ['regulation', 'analysis'] },
  ];
  res.json({ models });
});

// =============================================
// 파인튜닝 작업 관리
// =============================================

router.get('/jobs', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();
    const jobs = db.all('SELECT * FROM sllm_finetune_jobs ORDER BY created_at DESC');
    res.json({ jobs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/jobs', async (req: Request, res: Response) => {
  try {
    const { name, model_base, dataset_id, hyperparameters } = req.body;
    const db = await getDBHelper();
    const id = `JOB-${crypto.randomUUID().substring(0, 8)}`;

    const defaultHyperparams = {
      epochs: 3,
      learning_rate: 2e-5,
      batch_size: 4,
      warmup_steps: 100,
      weight_decay: 0.01,
      ...hyperparameters,
    };

    db.run(
      `INSERT INTO sllm_finetune_jobs (id, name, model_base, dataset_id, hyperparameters, status, progress)
       VALUES (?, ?, ?, ?, ?, 'queued', 0)`,
      [id, name, model_base, dataset_id, JSON.stringify(defaultHyperparams)]
    );
    db.save();

    res.json({ id, message: '파인튜닝 작업이 대기열에 추가되었습니다.', status: 'queued' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// AI 프롬프트 자동 생성
// =============================================

router.post('/generate-prompt', async (req: Request, res: Response) => {
  try {
    const { purpose, context, target_model, requirements } = req.body;

    const genContent = `당신은 AI 프롬프트 엔지니어링 전문가입니다. 다음 요구사항에 맞는 최적의 시스템 프롬프트를 생성해 주세요.

[목적] ${purpose}
[컨텍스트] ${context || 'AI 거버넌스 플랫폼'}
[대상 모델] ${target_model || 'Grok 4'}
[추가 요구사항] ${requirements || '없음'}

다음 JSON 형식으로 응답해 주세요:
{
  "system_prompt": "생성된 시스템 프롬프트",
  "user_prompt_template": "사용자 입력 템플릿 ({{변수}} 형식)",
  "variables": ["변수1", "변수2"],
  "usage_tips": ["팁1", "팁2"],
  "category": "카테고리"
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: '당신은 프롬프트 엔지니어링 전문가입니다. JSON으로 응답하세요.' },
      { role: 'user', content: genContent },
    ];

    const resp = await chatCompletion(messages, { temperature: 0.5, max_tokens: 2048 });
    const resultText = resp.choices?.[0]?.message?.content || '';

    let generated;
    try {
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      generated = jsonMatch ? JSON.parse(jsonMatch[0]) : { system_prompt: resultText };
    } catch {
      generated = { system_prompt: resultText };
    }

    res.json({ generated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =============================================
// 통계
// =============================================

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const db = await getDBHelper();

    const templates = db.all('SELECT COUNT(*) as cnt FROM sllm_prompt_templates');
    const datasets = db.all('SELECT COUNT(*) as cnt FROM sllm_finetune_datasets');
    const totalJobs = db.all('SELECT COUNT(*) as cnt FROM sllm_finetune_jobs');
    const activeJobs = db.all("SELECT COUNT(*) as cnt FROM sllm_finetune_jobs WHERE status IN ('queued', 'running')");

    res.json({
      templates: templates[0]?.cnt || 0,
      datasets: datasets[0]?.cnt || 0,
      totalJobs: totalJobs[0]?.cnt || 0,
      activeJobs: activeJobs[0]?.cnt || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
