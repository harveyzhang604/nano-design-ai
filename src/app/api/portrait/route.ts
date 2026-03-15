import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

function buildPrompt(beautyLevel: string, removeBlemishes: boolean, removeWrinkles: string): string {
  let blemishInstruction = '';
  if (removeBlemishes) {
    blemishInstruction = `
🚨 CRITICAL INSTRUCTION - FRECKLES MUST BE REMOVED 🚨
Remove ALL freckles (雀斑) from the face - every single one. This is mandatory.
Other imperfections to remove:
- 痘印、痘痘 (acne marks, pimples) - remove completely
- 疤痕、伤痕 (scars, wounds) - smooth out
- 老年斑、晒斑 (age spots, sun spots) - remove completely
- 红血丝 (redness, broken capillaries) - remove
- 油光 (shiny/oily areas) - reduce
- 毛孔粗大 (large pores) - minimize

FINAL RESULT: Perfectly clear skin with ZERO freckles or blemishes.`;
  } else {
    blemishInstruction = `
KEEP (保留以下自然特征):
- 雀斑 (freckles)
- 痣 (moles, beauty marks)
- 疤痕 (scars - if subtle)
- 自然皮肤纹理 (natural skin texture)`;
  }

  let wrinkleInstruction = '';
  if (removeWrinkles === 'remove') {
    wrinkleInstruction = `
REMOVE WRINKLES:
- 鱼尾纹 (crow's feet)
- 法令纹 (nasolabial folds)
- 眉间纹 (frown lines)
- 抬头纹 (forehead wrinkles)
- 颈纹 (neck wrinkles)
- 细纹 (fine lines)`;
  } else if (removeWrinkles === 'keep') {
    wrinkleInstruction = `
KEEP WRINKLES (保留皱纹):
- 鱼尾纹 (crow's feet - shows character)
- 法令纹 (nasolabial folds - smile lines)
- 皱纹是成熟的标志，保留自然表情`;
  } else {
    wrinkleInstruction = `
OPTIONAL WRINKLES:
- 轻轻淡化非常深的皱纹
- 保留自然表情和成熟气质`;
  }

  const prompts: Record<string, string> = {
    'natural': `Enhance this portrait with SUBTLE, natural beauty - keep it REAL and AUTHENTIC.

PHILOSOPHY: Real beauty has character. Don't erase personality.

${blemishInstruction}

${wrinkleInstruction}

GENTLE IMPROVEMENTS:
- Soften minor blemishes (keep natural skin texture visible)
- Very light, barely-there skin smoothing
- Subtle eye brightening (keep natural eye color and character)
- Preserve freckles, beauty marks, natural features
- Keep original skin tone and warmth
- Maintain natural expressions and emotions

FORBIDDEN:
- DO NOT over-smooth skin (plastic look)
- DO NOT change facial structure
- DO NOT remove character (wrinkles, smile lines are beautiful)
- DO NOT make it look "too perfect"

GOAL: Like a good quality photo on a good day - natural, real, YOU.`,
      
    'fresh': `Enhance this portrait with MODERATE, fresh improvements - polished but REAL.

PHILOSOPHY: Fresh and confident, not fake. Keep the soul.

${blemishInstruction}

${wrinkleInstruction}

BALANCED IMPROVEMENTS:
- Remove temporary blemishes (keep natural texture and character)
- Moderate skin smoothing with visible pores and texture
- Brighten eyes naturally (enhance, don't change)
- Even out skin tone gently (keep natural warmth)
- Light contouring for definition (subtle, not dramatic)
- Preserve personality, expressions, natural features

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT remove natural character (freckles, beauty marks)
- DO NOT change the person's essence
- DO NOT make it look heavily edited

GOAL: Fresh, polished, confident - but still authentically YOU. Like a great day, not a different person.`,
      
    'professional': `Enhance this portrait with CLEAR, professional quality - magazine-ready but AUTHENTIC.

PHILOSOPHY: Professional doesn't mean fake. Real people in professional photos.

${blemishInstruction}

${wrinkleInstruction}

PROFESSIONAL IMPROVEMENTS:
- Remove all temporary imperfections (acne, redness)
- Professional skin smoothing (keep subtle texture visible)
- Significantly brighten and enhance eyes (natural enhancement)
- Even out and slightly brighten skin tone (keep natural warmth)
- Define facial contours professionally (subtle, tasteful)
- Preserve unique features, expressions, personality

FORBIDDEN:
- DO NOT create unrealistic perfection
- DO NOT remove permanent features (moles, freckles, scars - they're part of you)
- DO NOT change facial structure or expressions
- DO NOT make it look like a different person

GOAL: Professional portrait photography quality - polished, confident, magazine-worthy, but still recognizably and authentically YOU. Real person, professional quality.`,
  };

  return prompts[beautyLevel] || prompts['fresh'];
}

export async function POST(req: Request) {
  try {
    const { imageUrl, beautyLevel = 'fresh', removeBlemishes = true, removeWrinkles = 'optional' } = await req.json();
    
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
    const prompt = buildPrompt(beautyLevel, removeBlemishes, removeWrinkles);

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'portrait');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      mode: 'portrait'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Portrait error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
