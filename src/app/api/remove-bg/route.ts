import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, edgeMode = 'soft' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const prompts: Record<string, string> = {
      'precise': `Remove the background from this image - make the subject STAND OUT perfectly.

PHILOSOPHY: Great cutouts make subjects shine on any background.

PRECISE CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Sharp, clean edges (pixel-perfect precision)
- Perfect for product photography
- Professional e-commerce quality
- Crisp, defined edges

PRESERVE SUBJECT:
- Keep ALL subject details intact
- Maintain colors and textures exactly
- Preserve fine details (buttons, textures, patterns)
- Keep subject looking natural and complete
- No artifacts or rough edges

FORBIDDEN:
- DO NOT cut into the subject
- DO NOT leave background remnants
- DO NOT blur important edges
- DO NOT alter the subject itself

GOAL: Like a professional product cutout - clean, precise, ready for any background.`,
      
      'soft': `Remove the background from this image - make it look NATURAL and BEAUTIFUL.

PHILOSOPHY: Natural cutouts blend seamlessly anywhere.

SOFT CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Natural, slightly soft edges (subtle feathering)
- Ideal for portraits and people
- Smooth, natural transitions
- Professional portrait quality

PRESERVE SUBJECT:
- Keep ALL subject details intact
- Preserve fine details like hair strands
- Maintain natural appearance
- Smooth edge transitions (not harsh)
- Keep subject looking real and natural

FORBIDDEN:
- DO NOT cut into the subject
- DO NOT leave background remnants
- DO NOT make edges too harsh
- DO NOT alter the subject itself

GOAL: Like a professional portrait cutout - natural, smooth, blends beautifully anywhere.`,
      
      'detail': `Remove the background from this image - preserve EVERY tiny detail.

PHILOSOPHY: Detail preservation makes cutouts look professional and real.

ULTRA-DETAILED CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Preserve ALL fine details (hair strands, fur, fabric texture)
- Maintain transparent elements (glass, lace, etc.)
- Maximum detail preservation
- Natural edge transitions

PRESERVE SUBJECT:
- Keep EVERY detail intact (individual hairs, fur strands)
- Maintain all textures and patterns
- Preserve transparent and semi-transparent areas
- Keep fine details like jewelry, accessories
- Ultra-detailed preservation

FORBIDDEN:
- DO NOT lose any fine details
- DO NOT simplify complex edges
- DO NOT leave background remnants
- DO NOT alter the subject itself

GOAL: Like an ultra-professional cutout - every detail preserved, looks perfect anywhere.`,
    };
    
    
    const prompt = prompts[edgeMode] || prompts['soft'];

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'remove-bg');

    return NextResponse.json({
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'remove-bg', edgeMode
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('remove-bg error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
