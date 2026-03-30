import { NextResponse } from 'next/server';
import { generateGeminiImage } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

const STEP_PROMPTS: Record<number, string> = {
  1: `You are restoring a damaged old photograph. This is Step 1: Remove physical damage only.

TASK: Clean up visible physical damage from this old photo.

FIX ONLY THESE DAMAGE TYPES:
- Scratches, tears, and cracks
- Water stains, brown spots, mold marks
- Fold lines and crease marks
- Dust, dirt, and surface debris
- Severe fading and color loss in damaged areas

ABSOLUTE PRESERVATION RULES - DO NOT CHANGE:
- Every facial expression, smile, eye shape, gaze direction
- All skin texture, wrinkles, age marks, freckles, moles
- Clothing patterns, colors, and styles
- Hair appearance and styling
- Body poses and positions
- Background composition
- The overall aged/vintage feeling

STRICTLY FORBIDDEN:
- DO NOT reconstruct or guess missing content
- DO NOT sharpen or enhance clarity beyond damage repair
- DO NOT change any facial features
- DO NOT beautify or smooth skin
- DO NOT alter colors beyond restoring faded areas

OUTPUT: A clean version of the same photo with only physical damage removed. Everything else stays exactly as it was.`,

  2: `You are restoring a damaged old photograph. This is Step 2: Restore fine details in non-face areas.

This image has already had its physical damage (scratches, stains, tears) cleaned in Step 1.
Now your job is to carefully restore fine details in hair, clothing, hands, and background.

FACE IS LOCKED - CRITICAL RULE:
- Treat all facial features as a LOCKED ZONE
- You may gently clarify already-visible facial details (reduce blur if blurry)
- You must NOT reposition, resize, or reshape: eyes, nose, mouth, jawline, skull shape
- You must NOT invent or "improve" any facial features
- If a facial area is too blurry to confidently restore, leave it blurry - do NOT guess
- The person's expression and emotional state must remain IDENTICAL

RESTORE THESE AREAS:
- Hair: restore individual strand texture and volume where visible
- Clothing: recover fabric weave, buttons, collars, seam lines, patterns
- Hands and fingers: restore natural skin texture and nail details
- Background: recover depth, texture, and subtle tonal variation
- Accessories: glasses frames, jewelry, belts - restore material texture

DO NOT:
- Add any detail that wasn't present in the input image
- Change skin tone or color temperature
- Alter the composition or cropping
- Apply any beautification or smoothing

OUTPUT: A version with richer texture and detail in hair/clothing/background, with face completely unchanged.`,

  3: `You are finalizing the restoration of an old photograph. This is Step 3: Final polish and tonal unification.

This image has gone through two restoration passes. The physical damage is repaired and fine details are recovered.
Your job now is final quality unification - making the whole image feel coherent and complete.

FINAL POLISH TASKS:
- Unify overall tonal balance and contrast across the entire image
- Smooth any remaining tonal inconsistencies between repaired and original areas
- Gently correct color cast (yellowing, greenish tint, fading) to neutral
- Ensure sharpness is consistent across the image
- Final noise reduction where needed without losing texture
- Make the image feel like a naturally well-preserved old photograph

CRITICAL PRESERVATION - SAME AS BEFORE:
- Facial expression and features remain exactly as they are
- No beautification, no smoothing, no skin enhancement
- Retain the authentic vintage character - do not make it look modern
- The people should look like themselves, not AI-generated versions
- Emotional content and mood must be preserved

AIM FOR: A photograph that looks like it was taken with quality equipment and stored carefully - naturally aged but undamaged, clear but not artificially crisp.

OUTPUT: The final restored photograph with unified tone, color, and quality.`,
};

const STEP_MODELS: Record<number, string> = {
  1: 'gemini-3.1-flash-image-preview',
  2: 'gemini-3.1-flash-image-preview',
  3: 'gemini-3-pro-image-preview',
};

const STEP_PARAMS: Record<number, { temperature: number; topK: number; topP: number }> = {
  1: { temperature: 0.2, topK: 32, topP: 0.85 },
  2: { temperature: 0.25, topK: 32, topP: 0.88 },
  3: { temperature: 0.3, topK: 40, topP: 0.9 },
};

async function resolveImageBase64(imageUrl: string): Promise<string> {
  // Already a data URL
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  // Fetch from URL
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get('content-type') || 'image/png';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

export async function POST(req: Request) {
  try {
    const { imageUrl, step } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 });
    }

    const stepNum = Number(step);
    if (![1, 2, 3].includes(stepNum)) {
      return NextResponse.json({ error: 'step must be 1, 2, or 3' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await resolveImageBase64(imageUrl);
    const prompt = STEP_PROMPTS[stepNum];
    const model = STEP_MODELS[stepNum];
    const params = STEP_PARAMS[stepNum];

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      model,
      ...params,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const stepNames: Record<number, string> = { 1: 'repair', 2: 'detail', 3: 'polish' };
    const r2Url = await uploadBase64ImageToR2(fullBase64, `restore-pro-${stepNames[stepNum]}`);

    return NextResponse.json({
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      step: stepNum,
      stepName: stepNames[stepNum],
      model,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error: any) {
    console.error('Restore-pro error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
