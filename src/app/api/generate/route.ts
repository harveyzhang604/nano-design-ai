import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: API Key not configured in environment.' }, { status: 500 });
    }

    const categoryPrompts: Record<string, string> = {
      fashion: "Professional Fashion Design Studio Photography.",
      architecture: "High-end Photorealistic Architectural Visualization Rendering.",
      interior: "Luxury Modern Interior Design Magazine Photography."
    };

    const systemPrompt = categoryPrompts[category] || "Professional design AI.";

    // --- Google Native Imagen API ---
    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [
          { prompt: `${systemPrompt} ${prompt}. Technical: 8k, ultra-detailed.` }
        ],
        parameters: {
          sampleCount: 1
        }
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    // Imagen 返回的是 base64 或者是图片二进制。
    // 在 v1beta 中，通常返回的是 predictions[0].bytesBase64Encoded
    const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.', debug: data }, { status: 500 });
    }

    const imageUrl = `data:image/png;base64,${base64Data}`;

    // --- R2 存储逻辑 (由于返回的是 base64，我们可以直接存) ---
    try {
      // @ts-ignore
      const bucket = process.env.IMAGES_BUCKET;
      if (bucket && typeof (bucket as any).put === 'function') {
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await (bucket as any).put(`${category}-${Date.now()}.png`, bytes.buffer, {
          httpMetadata: { contentType: 'image/png' }
        });
      }
    } catch (e) {
      console.error('R2 Background Save Failed:', e);
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Server Crash:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
