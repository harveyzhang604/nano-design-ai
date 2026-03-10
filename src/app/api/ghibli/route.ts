import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, style = 'spirited-away' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const prompt = `Transform this image into a warm hand-painted animation illustration. Use soft organic lines, watercolor-like shading, detailed whimsical backgrounds, gentle atmospheric lighting, and a cozy magical mood. Preserve the subject, composition, and emotional tone. Use ${colorDescriptions[colorPalette]} and ${atmosphereDescriptions[atmosphere]}. Keep it painterly, cinematic, and family-friendly.`;

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'ghibli');

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'ghibli',
      style
    });

  } catch (error) {
    console.error('Ghibli style error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
