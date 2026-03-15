import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, maskArea } = await req.json();
    
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
    
    const prompt = maskArea 
      ? `Remove the object in the marked area - make it look like it was NEVER there.

PHILOSOPHY: Perfect removal means invisible removal.

OBJECT REMOVAL:
- Remove the object in the marked area completely
- Fill with natural, appropriate background
- Match surrounding textures and patterns
- Seamless blending (no visible edges)
- Natural continuation of background elements

NATURAL FILLING:
- Analyze surrounding area carefully
- Continue patterns naturally (grass, walls, floors, etc.)
- Match lighting and shadows
- Preserve depth and perspective
- Make it look untouched

PRESERVE REST:
- Keep everything else EXACTLY the same
- Maintain image quality
- Preserve all other details
- Keep natural appearance

FORBIDDEN:
- DO NOT leave visible edges or seams
- DO NOT create obvious patches
- DO NOT blur excessively
- DO NOT make it look edited

GOAL: Like the object was never there - seamless, natural, invisible removal.`
      : `Intelligently remove unwanted objects - clean up the photo NATURALLY.

PHILOSOPHY: Great cleanup is invisible cleanup.

INTELLIGENT DETECTION:
- Identify unwanted objects, distractions, photobombers
- Detect what doesn't belong in the scene
- Keep main subject and important elements intact
- Remove only what improves the photo

NATURAL REMOVAL:
- Remove unwanted elements completely
- Fill with appropriate background
- Match surrounding textures and patterns
- Seamless blending (invisible removal)
- Natural continuation of background

PRESERVE QUALITY:
- Keep main subject perfect
- Maintain image quality
- Preserve all important details
- Keep natural appearance

FORBIDDEN:
- DO NOT remove important elements
- DO NOT create obvious patches
- DO NOT blur excessively
- DO NOT make it look edited

GOAL: Clean, natural photo - like the unwanted objects were never there.`;

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.35,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'erase');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      mode: 'erase'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Erase error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
