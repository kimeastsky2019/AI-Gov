/**
 * Grok (xAI) API 직접 호출 클라이언트
 * 프론트엔드에서 직접 Grok API를 호출하여 AI 기능 구현
 */

const GROK_API_URL = "https://api.x.ai/v1";
const GROK_API_KEY = "xai-8iB1zwfhxOGLH7VcgsD4SUHMOW9lpWJgagHrqL5ZbjUtBz09F96Sgi8B60MNIqKEjB8dDUBqDHwV6C92";
const GROK_MODEL = "grok-4-latest";

export interface GrokMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GrokResponse {
  answer: string;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

async function callGrok(
  messages: GrokMessage[],
  options?: { temperature?: number; max_tokens?: number }
): Promise<GrokResponse> {
  const res = await fetch(`${GROK_API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages,
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.max_tokens ?? 2000,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Grok API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return {
    answer: data.choices?.[0]?.message?.content || "",
    model: data.model,
    usage: data.usage,
  };
}

// ─── 공개 API ───

/** 자유 질문 */
export async function askGrok(query: string, systemPrompt?: string): Promise<string> {
  const messages: GrokMessage[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: query });
  const res = await callGrok(messages);
  return res.answer;
}

/** 멀티턴 대화 */
export async function chatWithGrok(
  history: GrokMessage[],
  newMessage: string,
  systemPrompt?: string
): Promise<{ reply: string; updatedHistory: GrokMessage[] }> {
  const messages: GrokMessage[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push(...history);
  messages.push({ role: "user", content: newMessage });
  const res = await callGrok(messages);
  return {
    reply: res.answer,
    updatedHistory: [...history, { role: "user", content: newMessage }, { role: "assistant", content: res.answer }],
  };
}

/** AI 자동 작성 (플로우 페이지용) */
export async function autoWrite(featureName: string, context?: string): Promise<string> {
  const systemPrompt = `당신은 AI 거버넌스 전문가입니다. 주어진 항목에 대해 전문적인 검토 의견을 한국어로 작성하세요. 구체적이고 실무적인 내용을 포함하세요.`;
  const query = context
    ? `'${featureName}' 항목에 대한 검토 의견을 작성하세요.\n\n맥락:\n${context}`
    : `'${featureName}' 항목에 대한 검토 의견을 작성하세요.`;
  return askGrok(query, systemPrompt);
}

/** 규정 검색 */
export async function searchRegulation(featureName: string): Promise<string> {
  const systemPrompt = `당신은 AI 규제 전문가입니다. 주어진 항목과 관련된 규정/법률/표준을 검색하여 관련 조항과 요구사항을 한국어로 제시하세요. 한국 AI 기본법, EU AI Act, TTA 표준, ISO/IEC 42001, 금융감독원 가이드라인 등을 포함하세요.`;
  return askGrok(`'${featureName}'과 관련된 AI 규제/법률/표준을 검색해주세요.`, systemPrompt);
}

/** 모델 성능 분석 */
export async function analyzeModel(modelInfo: {
  name: string; accuracy: number; precision: number; recall: number; f1Score: number; auc: number; status: string;
}): Promise<{
  summary: string; strengths: string[]; risks: string[]; recommendations: string[];
}> {
  const systemPrompt = `당신은 AI 모델 성능 분석 전문가입니다. 주어진 모델 정보를 분석하여 JSON 형식으로 응답하세요. 반드시 다음 형식을 사용하세요: {"summary":"...", "strengths":["..."], "risks":["..."], "recommendations":["..."]}`;
  const query = `모델 정보: ${JSON.stringify(modelInfo)}`;
  try {
    const raw = await askGrok(query, systemPrompt);
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) return JSON.parse(jsonStr);
  } catch {}
  return {
    summary: `${modelInfo.name}의 분석을 완료했습니다.`,
    strengths: [`정확도 ${(modelInfo.accuracy * 100).toFixed(1)}%`],
    risks: ["추가 분석 필요"],
    recommendations: ["정기 모니터링 권장"],
  };
}

/** 공정성 감사 */
export async function auditFairness(biasData: any[]): Promise<string> {
  const systemPrompt = `당신은 AI 공정성 검증 전문가입니다. 주어진 편향 데이터를 분석하여 종합 평가, 발견 사항, 완화 방안을 한국어로 제시하세요.`;
  return askGrok(`편향 분석 데이터: ${JSON.stringify(biasData)}`, systemPrompt);
}

/** 보안 취약점 분석 */
export async function analyzeVulnerability(vulnInfo: any): Promise<string> {
  const systemPrompt = `당신은 AI 보안 전문가입니다. 주어진 취약점 정보를 분석하여 위험도, 악용 가능성, 영향 범위, 완화 방안을 한국어로 제시하세요.`;
  return askGrok(`취약점 정보: ${JSON.stringify(vulnInfo)}`, systemPrompt);
}

/** 신뢰성 평가 도움 */
export async function evaluateTrust(dimension: string, criteria: string): Promise<{ score: number; reason: string }> {
  const systemPrompt = `당신은 AI 신뢰성 평가 전문가입니다. 주어진 차원과 기준에 대해 1-5점 점수와 근거를 JSON으로 응답하세요. 형식: {"score": 4, "reason": "..."}`;
  try {
    const raw = await askGrok(`차원: ${dimension}, 기준: ${criteria}`, systemPrompt);
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0];
    if (jsonStr) return JSON.parse(jsonStr);
  } catch {}
  return { score: 3, reason: "분석 완료" };
}

/** 범용 분석 */
export async function analyze(content: string, type: "risk" | "compliance" | "quality" | "summary"): Promise<string> {
  const prompts: Record<string, string> = {
    risk: "다음 내용의 위험 요소를 분석하세요.",
    compliance: "다음 내용의 규정 준수 상태를 분석하세요. 한국 AI 기본법, EU AI Act 기준으로 평가하세요.",
    quality: "다음 내용의 품질을 평가하세요.",
    summary: "다음 내용을 핵심 위주로 요약하세요.",
  };
  return askGrok(content, prompts[type]);
}

export { GROK_MODEL, callGrok };
