import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, mode = 'cartoon-safe' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const prompts: Record<string, string> = {
      'cartoon-safe': 'Convert this portrait into a clean friendly cartoon illustration. Keep the same identity, expression, hair color, and composition. Use smooth lines, simple shading, and polished colors.',
      'photo-safe': 'Enhance this portrait slightly while keeping it realistic. Improve clarity, lighting, and polish. Keep the same identity, expression, and composition.',
      'style-safe': 'Turn this portrait into a soft hand-painted illustration. Keep the same identity and composition. Use gentle brushwork, warm tones, and a polished editorial look.',
      'gesture-safe': 'Edit this portrait so the same person raises one hand naturally near the face in a casual expressive pose. Keep identity, expression, outfit, and composition consistent.',
      'age-safe': 'Edit this portrait to make the person look slightly older in a natural realistic way. Keep identity, expression, hairstyle, and composition consistent.',
    };

    const result = await generateGeminiImage({
      apiKey,
      prompt: prompts[mode] || prompts['cartoon-safe'],
      imageBase64,
      temperature: 0.4,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({
        error: result.error,
        status: result.status,
        mode,
        raw: result.raw,
      }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, `debug-${mode}`);

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
