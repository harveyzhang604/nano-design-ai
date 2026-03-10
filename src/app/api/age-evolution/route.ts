import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, targetAge = 25, style = 'realistic' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const prompt = `Edit this portrait to show the same person at about ${targetAge} years old. Keep identity, face shape, hairstyle direction, expression, and overall composition consistent. Apply subtle, natural age changes only. Use ${styleDescriptions[style]}. Keep the result realistic, clean, and high quality.`;

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'age-evolution');

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'age-evolution',
      style
    });

  } catch (error) {
    console.error('Age evolution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
