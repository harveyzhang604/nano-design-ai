import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, style = 'cute' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const prompt = `Turn this portrait into a cute chibi illustration. Keep the same identity, hair color, outfit colors, and facial expression, but use a very large head, tiny body, soft rounded shapes, big sparkling eyes, and a playful polished cartoon finish. Use ${backgroundDescriptions[background]}. Keep it adorable and family-friendly.`;

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.4,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'chibi');

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'chibi',
      style
    });

  } catch (error) {
    console.error('Chibi generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
