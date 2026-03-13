type GeminiFetchResult = {
  response: Response;
  data: any;
  usedKey: 'GEMINI_API_KEY' | 'GEMINI_API_KEY2';
};

function isExpiredOrInvalidKey(data: any, text?: string) {
  const msg = `${data?.error?.message || ''} ${data?.error?.status || ''} ${text || ''}`.toLowerCase();
  return msg.includes('api key expired') || msg.includes('api_key_invalid') || msg.includes('invalid_argument');
}

export function getGeminiApiKeys() {
  const keys = [
    { name: 'GEMINI_API_KEY' as const, value: process.env.GEMINI_API_KEY },
    { name: 'GEMINI_API_KEY2' as const, value: process.env.GEMINI_API_KEY2 },
  ].filter((item) => !!item.value);
  return keys;
}

export async function postGeminiWithFallback(params: {
  model: string;
  body: any;
}): Promise<GeminiFetchResult> {
  const keys = getGeminiApiKeys();
  if (!keys.length) {
    throw new Error('System Error: GEMINI_API_KEY / GEMINI_API_KEY2 not configured.');
  }

  let lastResponse: Response | null = null;
  let lastData: any = null;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key.value!,
        },
        body: JSON.stringify(params.body),
      }
    );

    let data: any = null;
    const rawText = await response.text();
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = { rawText };
    }

    if (response.ok) {
      return { response, data, usedKey: key.name };
    }

    lastResponse = response;
    lastData = data;

    if (!isExpiredOrInvalidKey(data, rawText) || i === keys.length - 1) {
      return { response, data, usedKey: key.name };
    }
  }

  return {
    response: lastResponse!,
    data: lastData,
    usedKey: 'GEMINI_API_KEY',
  };
}
