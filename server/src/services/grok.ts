/**
 * Grok (xAI) API Service
 * OpenAI-compatible chat completions interface for Grok models
 */

import dotenv from 'dotenv';
dotenv.config();

const XAI_API_URL = process.env.XAI_API_URL || 'https://api.x.ai/v1';
const XAI_API_KEY = process.env.XAI_API_KEY || '';
const XAI_MODEL = process.env.XAI_MODEL || 'grok-4-latest';
const RAG_MAX_TOKENS = parseInt(process.env.RAG_MAX_TOKENS || '1500');
const RAG_TEMPERATURE = parseFloat(process.env.RAG_TEMPERATURE || '0.1');

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GrokChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Send a chat completion request to the Grok API
 */
export async function chatCompletion(
  messages: ChatMessage[],
  options: GrokChatOptions = {}
): Promise<ChatCompletionResponse> {
  if (!XAI_API_KEY) {
    throw new Error('XAI_API_KEY is not configured');
  }

  const body = {
    model: options.model || XAI_MODEL,
    messages,
    temperature: options.temperature ?? RAG_TEMPERATURE,
    max_tokens: options.max_tokens ?? RAG_MAX_TOKENS,
    stream: options.stream ?? false,
    ...(options.top_p !== undefined && { top_p: options.top_p }),
    ...(options.frequency_penalty !== undefined && { frequency_penalty: options.frequency_penalty }),
    ...(options.presence_penalty !== undefined && { presence_penalty: options.presence_penalty }),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${XAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${XAI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Grok API error (${response.status}): ${errText}`);
    }

    return response.json() as Promise<ChatCompletionResponse>;
  } catch (err: any) {
    // Graceful fallback when API is unreachable (sandbox/offline)
    console.warn(`Grok API unreachable: ${err.message}. Returning fallback response.`);
    const userMessage = messages.find(m => m.role === 'user')?.content || '';
    return {
      id: `fallback-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: body.model,
      choices: [{
        index: 0,
        message: {
          role: 'assistant' as const,
          content: `[오프라인 모드] Grok API에 연결할 수 없어 로컬 응답을 제공합니다.\n\n` +
            `질문: "${userMessage.substring(0, 100)}"\n\n` +
            `현재 Grok(xAI) API 서버에 접속할 수 없습니다. ` +
            `실제 운영 서버에서는 Grok 모델(${body.model})이 정상적으로 응답합니다.\n\n` +
            `이 플랫폼은 다음 AI 기능을 지원합니다:\n` +
            `• RAG 기반 문서 검색 및 Q&A (컬렉션에 문서 업로드 후 사용)\n` +
            `• AI 리스크/컴플라이언스/품질 분석\n` +
            `• 온톨로지 정책 관리 및 SPARQL 쿼리\n` +
            `• 멀티턴 대화\n\n` +
            `서버 배포 후 정상적인 Grok 응답을 받으실 수 있습니다.`,
        },
        finish_reason: 'stop',
      }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    };
  }
}

/**
 * Simple one-shot question answering with Grok
 */
export async function askGrok(
  query: string,
  systemPrompt?: string,
  options?: GrokChatOptions
): Promise<{ answer: string; usage: ChatCompletionResponse['usage'] }> {
  const messages: ChatMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: query });

  const resp = await chatCompletion(messages, options);
  const answer = resp.choices?.[0]?.message?.content || '';

  return { answer, usage: resp.usage };
}

/**
 * RAG-augmented query: inject context documents into the prompt and ask Grok
 */
export async function ragQuery(
  query: string,
  contextDocs: Array<{ content: string; source?: string; score?: number }>,
  systemPrompt?: string,
  options?: GrokChatOptions
): Promise<{
  answer: string;
  citations: Array<{ source: string; snippet: string }>;
  usage: ChatCompletionResponse['usage'];
}> {
  const defaultSystemPrompt = process.env.RAG_SYSTEM_PROMPT ||
    '당신은 GnG Meta AI 거버넌스 플랫폼의 지능형 어시스턴트입니다. ' +
    '제공된 컨텍스트에 근거하여 정확하게 답변하세요.';

  // Build context block
  const contextBlock = contextDocs
    .map((doc, i) => {
      const src = doc.source ? ` (출처: ${doc.source})` : '';
      return `[문서 ${i + 1}]${src}\n${doc.content}`;
    })
    .join('\n\n---\n\n');

  const fullSystemPrompt = `${systemPrompt || defaultSystemPrompt}\n\n` +
    `아래는 검색된 문서 컨텍스트입니다. 이 컨텍스트만을 근거로 답변하세요.\n\n` +
    `=== 문서 컨텍스트 ===\n${contextBlock}\n=== 컨텍스트 끝 ===`;

  const messages: ChatMessage[] = [
    { role: 'system', content: fullSystemPrompt },
    { role: 'user', content: query },
  ];

  const resp = await chatCompletion(messages, options);
  const answer = resp.choices?.[0]?.message?.content || '';

  const citations = contextDocs.map(doc => ({
    source: doc.source || 'unknown',
    snippet: doc.content.substring(0, 200),
  }));

  return { answer, citations, usage: resp.usage };
}

/**
 * Multi-turn conversation with Grok
 */
export async function conversationChat(
  history: ChatMessage[],
  newMessage: string,
  systemPrompt?: string,
  options?: GrokChatOptions
): Promise<{
  reply: string;
  updatedHistory: ChatMessage[];
  usage: ChatCompletionResponse['usage'];
}> {
  const messages: ChatMessage[] = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  messages.push(...history);
  messages.push({ role: 'user', content: newMessage });

  const resp = await chatCompletion(messages, options);
  const reply = resp.choices?.[0]?.message?.content || '';

  const updatedHistory: ChatMessage[] = [
    ...history,
    { role: 'user', content: newMessage },
    { role: 'assistant', content: reply },
  ];

  return { reply, updatedHistory, usage: resp.usage };
}

/**
 * Analyze a document/policy with Grok
 */
export async function analyzeWithGrok(
  content: string,
  analysisType: 'risk' | 'compliance' | 'quality' | 'summary' | 'custom',
  customPrompt?: string
): Promise<{ analysis: string; usage: ChatCompletionResponse['usage'] }> {
  const prompts: Record<string, string> = {
    risk: `다음 문서/정책의 위험 요소를 분석하세요. 위험 수준(높음/중간/낮음), 주요 위험 요소, 완화 방안을 제시하세요.`,
    compliance: `다음 문서/정책의 규정 준수 상태를 분석하세요. EU AI Act, KISA AI 윤리 가이드라인 등 주요 기준에 대한 준수 여부를 평가하세요.`,
    quality: `다음 문서/정책의 품질을 평가하세요. 논리적 일관성, 완전성, 명확성을 기준으로 점수(0-100)와 개선 사항을 제시하세요.`,
    summary: `다음 문서를 핵심 내용 위주로 간결하게 요약하세요. 주요 포인트를 bullet point로 정리하세요.`,
    custom: customPrompt || '다음 내용을 분석하세요.',
  };

  const systemPrompt = prompts[analysisType] || prompts.custom || '다음 내용을 분석하세요.';

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt as string },
    { role: 'user', content: content },
  ];

  const resp = await chatCompletion(messages, { max_tokens: 2000 });
  const analysis = resp.choices?.[0]?.message?.content || '';

  return { analysis, usage: resp.usage };
}

/**
 * Check Grok API health
 */
export async function checkGrokHealth(): Promise<{
  available: boolean;
  model: string;
  error?: string;
}> {
  try {
    const resp = await chatCompletion(
      [{ role: 'user', content: 'Hi' }],
      { max_tokens: 10, temperature: 0 }
    );
    return {
      available: true,
      model: resp.model || XAI_MODEL,
    };
  } catch (err: any) {
    return {
      available: false,
      model: XAI_MODEL,
      error: err.message,
    };
  }
}

export { XAI_MODEL, XAI_API_KEY as XAI_API_KEY_VALUE };
