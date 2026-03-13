import { postGeminiWithFallback } from './gemini-fallback';

export type GeminiImageResult = {
  ok: true;
  base64Data: string;
  raw: any;
} | {
  ok: false;
  status: number;
  error: string;
  raw?: any;
};

export async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch source image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get('content-type') || 'image/png';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function generateGeminiImage(params: {
  apiKey: string;
  prompt: string;
  imageBase64: string;
  model?: string;
  temperature?: number;
  topK?: number;
  topP?: number;
}) : Promise<GeminiImageResult> {
  const {
    apiKey,
    prompt,
    imageBase64,
    model = 'gemini-3.1-flash-image-preview',
    temperature = 0.4,
    topK = 32,
    topP = 0.9,
  } = params;

  const result = await postGeminiWithFallback({
    model,
    body: {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } },
        ],
      }],
      generationConfig: {
        temperature,
        topK,
        topP,
      },
    },
  });

  const apiResponse = result.response;
  const data = result.data;

  if (!apiResponse.ok) {
    return {
      ok: false,
      status: apiResponse.status,
      error: data?.error?.message || `Gemini API Error (${apiResponse.status})`,
      raw: data,
    };
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData);
  const base64Data = imagePart?.inlineData?.data;

  if (!base64Data) {
    return {
      ok: false,
      status: 500,
      error: 'No image data returned from AI.',
      raw: data,
    };
  }

  return {
    ok: true,
    base64Data,
    raw: data,
  };
}
