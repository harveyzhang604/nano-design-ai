import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, backgroundPrompt = 'professional studio background' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);
    
    const prompt = `Replace the background with: ${backgroundPrompt} - make it look NATURAL and BELIEVABLE.

PHILOSOPHY: Great background replacement looks like it was always there.

BACKGROUND REPLACEMENT:
- Remove current background completely
- Replace with: ${backgroundPrompt}
- Make new background look natural and realistic
- Professional integration (no obvious edges)
- Proper lighting match (subject fits the scene)
- Color harmony (subject and background work together)

SUBJECT PRESERVATION:
- Keep main subject PERFECTLY intact
- Perfect edge detection (clean, natural edges)
- Preserve all subject details (hair, clothing, textures)
- Maintain subject's lighting and colors
- Keep subject looking natural in new environment

NATURAL INTEGRATION:
- Match lighting direction and intensity
- Adjust subject colors to fit new environment
- Add natural shadows if needed
- Ensure depth and perspective match
- Make it look like a real photo

FORBIDDEN:
- DO NOT create obvious cutout edges
- DO NOT make lighting look mismatched
- DO NOT make it look fake or composited
- DO NOT lose subject details

GOAL: Like the photo was taken in that location - natural, believable, professional. Seamless integration.`;

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'change-bg');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      backgroundPrompt: backgroundPrompt || 'professional studio background'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Change background error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
