import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, scale = 2 } = await req.json();
    
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
    
    const scaleText = scale === 4 ? '4K ultra-high' : scale === 8 ? '8K maximum' : 'high';
    const prompt = `Upscale this image to ${scaleText} resolution - make it SHARP and CLEAR while keeping it REAL.

PHILOSOPHY: Bigger doesn't mean fake. Enhance quality, not change reality.

UPSCALING GOALS:
- Increase resolution to ${scaleText} quality
- Preserve and ENHANCE fine details (every texture matters)
- Sharpen edges and definition (crisp, not artificial)
- Intelligent noise reduction (clean, not plastic)
- Maintain natural grain and texture (real photos have texture)
- Enhance clarity without introducing artifacts

PRESERVE AUTHENTICITY:
- Keep original composition EXACTLY the same
- Maintain original colors and lighting
- Preserve natural textures and details
- Keep the photo's character and soul
- Maintain realistic appearance

FORBIDDEN:
- DO NOT over-sharpen (no halos or artifacts)
- DO NOT over-smooth (keep natural texture)
- DO NOT change colors or lighting
- DO NOT make it look artificial or processed
- DO NOT lose the photo's natural character

GOAL: Print-ready quality - sharp, clear, detailed, but still REAL and natural. Like the photo was taken with a better camera.`;

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.3,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'upscale');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      scale: scale || 2,
      originalScale: scale || 2
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Upscale error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
