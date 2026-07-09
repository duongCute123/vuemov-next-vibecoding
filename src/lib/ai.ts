const AI_API_KEY = process.env.OPENAI_API_KEY || process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

function isGemini(key: string): boolean {
  return key.startsWith('AIza') || key.startsWith('AQ.');
}

function isGroq(key: string): boolean {
  return key.startsWith('gsk_');
}

function getBaseUrl(): string {
  if (isGroq(AI_API_KEY)) return 'https://api.groq.com/openai/v1';
  return 'https://api.openai.com/v1';
}

export function isAIConfigured(): boolean {
  return AI_API_KEY.length > 0;
}

type AIMessage = { role: string; content: string };

export async function callAI(
  messages: AIMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const temp = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 500;

  if (isGemini(AI_API_KEY)) {
    const systemMsg = messages.find(m => m.role === 'system');
    const chatMessages = messages.filter(m => m.role !== 'system');

    const contents = chatMessages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: { temperature: temp, maxOutputTokens: maxTokens },
    };

    if (systemMsg) {
      body.systemInstruction = { parts: [{ text: systemMsg.content }] };
    }

    const model = AI_MODEL.includes('/') ? AI_MODEL : AI_MODEL.startsWith('gemini') ? AI_MODEL : `gemini-2.0-flash`;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${AI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || 'Gemini API error');
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  // OpenAI / Groq (OpenAI-compatible)
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      temperature: temp,
      max_tokens: maxTokens,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const provider = isGroq(AI_API_KEY) ? 'Groq' : 'OpenAI';
    throw new Error(data.error?.message || `${provider} API error`);
  }

  return data.choices?.[0]?.message?.content || '';
}

export async function callAIJSON<T>(
  messages: AIMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<T | null> {
  try {
    const text = await callAI(messages, options);
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
