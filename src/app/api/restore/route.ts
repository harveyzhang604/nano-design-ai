import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, restoreLevel = 'standard' } = await req.json();
    
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
      'conservative': `Restore this old or damaged photo with ULTRA-CONSERVATIVE approach. 
CRITICAL: This is DAMAGE REPAIR ONLY, NOT photo enhancement or beautification.

ABSOLUTE PRESERVATION RULES - NEVER VIOLATE:
1. FACIAL EXPRESSIONS: Keep EXACT same smile/frown/neutral expression, mouth curve, eye shape, gaze direction
   - If person is smiling, keep EXACT same smile (don't widen or reduce)
   - If person is serious, keep EXACT same serious expression
   - If person is sad, keep EXACT same sad expression
   - DO NOT change expression intensity even 1%
2. EMOTIONAL STATE: Preserve the EXACT mood and feeling (happy/sad/serious/playful/contemplative)
3. FACIAL FEATURES: Keep EXACT wrinkles, laugh lines, skin texture, age marks, freckles, moles, scars
4. BODY LANGUAGE: Keep EXACT poses, hand positions, head tilt, body angle
5. CLOTHING & ACCESSORIES: Keep EXACT patterns, colors, styles, jewelry, glasses
6. COMPOSITION: Keep EXACT framing, background, lighting, shadows

ONLY REPAIR PHYSICAL DAMAGE (nothing else):
- Remove scratches, tears, cracks, water stains, fold marks
- Fix color fading and yellowing
- Reduce noise ONLY in obviously damaged areas
- Fix blur ONLY where clearly damaged by time/handling

STRICTLY FORBIDDEN:
- DO NOT change facial expressions even 0.1% (no smile adjustment, no eye opening, no mouth change)
- DO NOT "improve" or "beautify" faces (no smoothing, no brightening eyes, no skin enhancement)
- DO NOT add missing details (if blurry, keep it blurry after damage repair)
- DO NOT change emotions or moods
- DO NOT modernize hairstyles, clothing, or makeup
- DO NOT alter the person's character or personality
- DO NOT make eyes bigger or brighter
- DO NOT make smile wider or happier

VERIFICATION: After restoration, the person should look EXACTLY the same, just without physical damage.
GOAL: Remove damage marks, preserve everything else 100%.`,
      
      'standard': `Restore this old or damaged photo with CONSERVATIVE-BALANCED approach.
CRITICAL: This is DAMAGE REPAIR with minimal enhancement, NOT a beauty filter.

ABSOLUTE PRESERVATION RULES - NEVER VIOLATE:
1. FACIAL EXPRESSIONS: Keep EXACT same expression - if serious, stay serious; if smiling, keep same smile intensity
   - DO NOT change smile width, mouth curve, or lip position
   - DO NOT change eye openness, gaze direction, or eye expression
   - DO NOT alter eyebrow position or facial muscle tension
2. EMOTIONAL STATE: Preserve the EXACT mood (happy/sad/serious/contemplative/neutral)
3. FACIAL FEATURES: Keep EXACT wrinkles, age lines, skin texture, natural imperfections, moles, scars
4. BODY & POSE: Keep EXACT positions, gestures, angles, head tilt
5. ORIGINAL CHARACTER: Preserve the person's authentic look and personality 100%

REPAIR DAMAGE (primary goal):
- Remove scratches, tears, cracks, water stains, fold marks
- Fix color fading, yellowing, and discoloration
- Reduce noise and grain moderately
- Fix blur and improve clarity in damaged areas
- Restore colors where faded

MINIMAL ENHANCEMENT (only if needed):
- Slight clarity improvement in undamaged areas
- Gentle contrast adjustment for better visibility
- Color balance correction if severely off

STRICTLY FORBIDDEN:
- DO NOT change facial expressions or emotions even 0.1% (no smile adjustment, no eye widening, no expression change)
- DO NOT "beautify" faces (no skin smoothing, no wrinkle removal, no eye brightening, no face reshaping)
- DO NOT add details that weren't visible in the original
- DO NOT change the mood or feeling
- DO NOT modernize the look
- DO NOT make person look happier, sadder, or different emotionally

VERIFICATION: The person's expression and character should feel IDENTICAL to the original.
GOAL: Repair damage and restore clarity, preserve authenticity 100%.`,
      
      'deep': `Restore this old or damaged photo with THOROUGH approach.
CRITICAL: Maximum quality restoration while preserving the person's authentic character.

ABSOLUTE PRESERVATION RULES - NEVER VIOLATE:
1. FACIAL EXPRESSIONS: Keep EXACT same expression and emotional state
2. PERSONALITY: Preserve the person's authentic character and vibe
3. CORE FEATURES: Keep facial structure, eye shape, nose, mouth proportions
4. NATURAL AGING: Keep age-appropriate features (wrinkles, gray hair, etc.)

THOROUGH REPAIR (primary goal):
- Remove ALL damage: scratches, tears, cracks, stains, discoloration, water marks
- Significantly reduce noise and grain
- Fix blur and maximize clarity and sharpness
- Restore colors and contrast to natural levels
- Enhance overall technical quality

QUALITY ENHANCEMENTS (allowed):
- Improve sharpness and detail clarity
- Restore natural color balance
- Fix exposure and lighting issues
- Reduce artifacts and compression damage
- Enhance texture definition

STRICTLY FORBIDDEN:
- DO NOT change facial expressions or emotions (keep original mood)
- DO NOT alter core facial features or proportions
- DO NOT "beautify" or apply beauty filters
- DO NOT add elements that weren't in the original
- DO NOT change the person's age appearance
- DO NOT modernize hairstyles or clothing

VERIFICATION: The person should look like a high-quality version of themselves, not a different person.
GOAL: Maximum technical quality while preserving 100% authenticity and character.`,
    };
    
    const prompt = prompts[restoreLevel] || prompts['standard'];

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
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'restore');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      restoreLevel: restoreLevel || 'standard'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
