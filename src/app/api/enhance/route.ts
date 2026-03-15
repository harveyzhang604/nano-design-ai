import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, beautyLevel = 'subtle' } = await req.json();
    
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
    
    const prompts: Record<string, string> = {
      'subtle': `Enhance this image with super-resolution quality - make it BETTER while keeping it REAL.

PHILOSOPHY: Enhancement means bringing out the best, not creating fake perfection.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Enhance quality, not change reality

FOR FACES/PORTRAITS:
- Gently reduce temporary imperfections (acne, blemishes)
- SUBTLE skin tone evening (keep original warmth and character)
- Light smoothing (preserve natural texture and pores)
- Keep freckles, beauty marks, natural features
- DO NOT over-brighten or over-whiten skin
- Keep natural expressions and personality

FOR ALL IMAGES:
- Enhance sharpness and clarity naturally
- Improve colors subtly (more vibrant, still natural)
- Reduce noise while keeping natural grain
- Enhance details without artifacts

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT over-process or over-smooth
- DO NOT change the photo's character
- DO NOT make it look heavily edited

GOAL: Like a good quality photo on a good day - natural, real, just BETTER.`,
      
      'light': `Enhance this image with super-resolution quality - NOTICEABLE improvement, still AUTHENTIC.

PHILOSOPHY: Professional quality doesn't mean fake. Real people, better quality.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Clear enhancement, still believable

FOR FACES/PORTRAITS:
- Remove visible imperfections (acne, blemishes, dark spots)
- Moderate skin tone improvement (brighter, more even)
- Smooth skin while keeping natural texture visible
- Light beauty enhancement (natural but improved)
- Keep personality and character
- Preserve unique features

FOR ALL IMAGES:
- Significantly enhance sharpness and clarity
- Improve colors noticeably (vibrant, still realistic)
- Professional noise reduction
- Enhance all details

FORBIDDEN:
- DO NOT create unrealistic perfection
- DO NOT over-smooth (keep texture)
- DO NOT change the person's essence
- DO NOT make it look fake

GOAL: Professionally retouched quality - noticeably better, still authentically YOU.`,
      
      'professional': `Enhance this image with super-resolution quality - MAGAZINE-READY, still REAL.

PHILOSOPHY: Professional photography quality - polished, not plastic.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Professional quality, still authentic

FOR FACES/PORTRAITS:
- Remove all temporary imperfections (acne, blemishes, spots)
- Brighten and even out skin tone significantly
- Professional skin smoothing (keep subtle texture)
- Clear beauty enhancement (magazine-quality)
- Preserve unique features and personality
- Keep natural expressions and character

FOR ALL IMAGES:
- Maximum sharpness and clarity
- Vibrant, professional colors (still realistic)
- Professional noise reduction
- Enhance every detail

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT remove permanent features (moles, freckles, scars)
- DO NOT change facial structure
- DO NOT make it look like a different person

GOAL: Professional portrait photography - magazine-ready, polished, but still recognizably and authentically YOU.`
    };
    
    const prompt = prompts[beautyLevel] || prompts['subtle'];

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'enhance');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      beautyLevel: beautyLevel || 'subtle'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Enhance error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
