import { NextResponse } from 'next/server';
import { generateGeminiImage } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';
export const maxDuration = 300; // 5分钟，Cloudflare Workers Pro 支持

const STEP_PROMPTS: Record<number, string> = {
  1: `You are restoring a damaged old photograph that was photographed with a phone camera. This is Step 1: Deskew, crop, and remove physical damage.

MANY OLD PHOTOS ARE PHONE-PHOTOGRAPHED: The input may show a physical photograph lying on a surface, photographed from above. It may have:
- Extra background (table, hand, surface) around the actual photo
- Perspective distortion (photo not shot perfectly flat)
- Bent or curled corners
- Uneven lighting from the phone flash

STEP 1A - DETECT AND CROP (do this first):
- Identify the actual photograph within the scene (it has a distinct border/edge)
- Detect the four corners of the physical photograph
- Apply perspective correction to straighten and flatten the image
- Crop tightly to the photograph content, removing all surrounding background (table, fingers, surface)
- If the photo appears to already be a flat scan (no perspective distortion), skip deskewing

STEP 1B - COLOR CORRECTION:
- Remove yellow/sepia/green aging cast, restore natural color balance
- Fix uneven lighting or flash hotspots from phone photography
- Restore faded colors to their natural state
- Do not over-saturate - keep colors natural and period-accurate

STEP 1C - REMOVE PHYSICAL DAMAGE (be thorough and aggressive):
- Scratches, tears, and cracks
- Water stains, brown spots, mold marks
- Fold lines and crease marks that exist in the original
- Dust, dirt, and surface debris
- Use inpainting/content-aware fill for ALL damage areas
- After repair, there should be ZERO visible physical damage remaining

CRITICAL - DO NOT INTRODUCE NEW DEFECTS:
- DO NOT add any fold lines, crease lines, or edge artifacts that were NOT in the original
- DO NOT introduce vertical or horizontal line artifacts along any edge
- DO NOT create new banding, streaking, or linear artifacts anywhere
- The output must be completely clean - no new defects introduced by the AI

STEP 1D - INITIAL CLARITY:
- Apply moderate denoising to reduce noise while preserving film grain
- Apply gentle initial sharpening to improve edge definition
- Preserve natural vintage film grain character

EDGE AND GRADIENT AREAS:
- Pay special attention to corners and borders where fading/damage lingers
- Fully repair edge gradients and vignetting
- Ensure uniform tone across the entire image including all edges

ABSOLUTE PRESERVATION RULES - AFTER CROPPING:
- Every facial expression, smile, eye shape, gaze direction
- All skin texture, wrinkles, age marks, freckles, moles - do NOT smooth skin
- Clothing patterns, colors, and styles
- Hair appearance and styling

STRICTLY FORBIDDEN:
- DO NOT reconstruct or guess missing content
- DO NOT change any facial features
- DO NOT beautify or smooth skin

OUTPUT: A perspective-corrected, cropped, color-corrected, damage-repaired version of the photograph with initial clarity improvement.
IMPORTANT: NO white borders, NO padding, NO frames, NO margins around the output image. The photograph content should fill the entire output canvas edge-to-edge.`,

  2: `You are restoring a damaged old photograph. This is Step 2: Clarify existing details only - NO reconstruction.

This image has already had its physical damage (scratches, stains, tears) cleaned in Step 1.
Your ONLY job is to clarify and sharpen details that ALREADY EXIST but are hard to see due to blur or fading.

THE GOLDEN RULE: If you cannot see it clearly, do NOT add it. Preserve ambiguity.
- If a part is missing → leave it missing
- If a part is blurry → you may gently clarify IF the shape is already visible
- If a part is completely absent → DO NOT reconstruct or fill it in
- When in doubt → do nothing, leave as-is

ALL ZONES ARE LOCKED - NOTHING NEW MAY BE ADDED:
- Face: LOCKED - only clarify already-visible features, do not reshape or reconstruct
- Eyes/nose/mouth: LOCKED - do not invent detail where none exists
- Hair: only clarify strands that are already partially visible
- Clothing: only sharpen fabric texture that is already present
- Background: only clarify existing depth and tone
- Accessories: only sharpen what is already there
- Missing objects/parts: leave missing - do NOT fill in holes, gaps, or absent elements

CRITICAL - DO NOT INTRODUCE NEW DEFECTS:
- DO NOT add any fold lines, crease lines, or edge artifacts that were NOT in the input
- DO NOT introduce vertical or horizontal line artifacts along any edge (especially left/right sides)
- DO NOT create new banding, streaking, or linear artifacts anywhere
- If the input image has no fold lines → the output must also have no fold lines
- The output must be completely clean with no new defects introduced by the AI

STRICTLY FORBIDDEN:
- DO NOT add any element not already present in the input image
- DO NOT fill empty spaces with plausible content
- DO NOT reconstruct missing body parts, clothing pieces, or objects
- DO NOT "complete" any partial or missing element
- DO NOT apply beautification or smoothing
- DO NOT change colors, tones, or proportions

MILD SHARPNESS IMPROVEMENT:
- Apply a gentle sharpness pass to improve overall clarity of the image
- Slightly increase edge definition and detail crispness
- This should be subtle - about 20-30% of what Step 3 will do
- Do NOT over-sharpen or create halo artifacts

OUTPUT: The same image with slightly improved clarity on already-visible details, plus a mild sharpness improvement. If unsure whether something exists or is invented, output the input unchanged.
IMPORTANT: NO white borders, NO padding, NO frames around the output. Fill the entire canvas with image content.`,

  3: `You are finalizing the restoration of an old photograph. This is Step 3: Final polish and tonal unification.

This image has gone through two restoration passes. The physical damage is repaired and fine details are recovered.
Your job now is final quality unification - making the whole image feel coherent and complete.

FINAL RESTORATION TASKS - MAXIMUM CLARITY WITH NATURAL LOOK:

1. DEEP DETAIL RECOVERY (most important):
- Recover fine micro-textures: individual hair strands, fabric weave, skin pores, button details
- Sharpen facial features to maximum clarity while keeping them natural-looking
- Recover fine text, insignia, badges, and small details
- Enhance eyes: restore catchlights, iris detail, eyelashes with precision
- Restore clothing texture: stitching, collar shape, medal/button details

2. SELECTIVE SHARPENING (apply differently per zone):
- Main subject (person/face): MAXIMUM sharpness - crisp, clear, photorealistic
- Mid-ground objects: HIGH sharpness
- Distant background (trees, buildings, sky): MODERATE sharpness - keep slight natural softness to preserve depth of field
- This selective approach makes the subject pop and the image feel three-dimensional

3. SKIN TEXTURE PRESERVATION (critical):
- Sharpen skin details WITHOUT creating a 'waxy' or 'plastic' look
- Preserve natural skin imperfections, pores, and texture
- Do NOT over-smooth or beautify - the person should look like themselves, not AI-generated
- Blend restored areas with original skin texture using masked restoration technique

4. TONAL REFINEMENT:
- Boost mid-tone contrast to improve perceived depth and sharpness
- Fine-tune color saturation: avoid over-saturation especially on warm tones (yellows, khakis)
- Ensure tonal consistency across the entire image
- Final noise reduction only where it does not reduce sharpness

- GOAL: The result should look like a professionally scanned, high-resolution archival photograph - dramatically sharper and clearer than the input, with natural skin texture, selective depth of field, and maximum fine detail.

CRITICAL PRESERVATION - SAME AS BEFORE:
- Facial expression and features remain exactly as they are
- No beautification, no smoothing, no skin enhancement
- Retain the authentic vintage character - do not make it look modern
- The people should look like themselves, not AI-generated versions
- Emotional content and mood must be preserved

AIM FOR: A photograph that looks like it was taken with quality equipment and stored carefully - naturally aged but undamaged, clear but not artificially crisp.

OUTPUT: The final restored photograph with unified tone, color, and quality.
IMPORTANT: NO white borders, NO padding, NO frames around the output. Fill the entire canvas with image content.`,
};

const STEP_MODELS: Record<number, string> = {
  1: 'gemini-3.1-flash-image-preview',
  2: 'gemini-3.1-flash-image-preview',
  3: 'gemini-3-pro-image-preview',
};

const STEP_PARAMS: Record<number, { temperature: number; topK: number; topP: number }> = {
  1: { temperature: 0.2, topK: 32, topP: 0.85 },
  2: { temperature: 0.25, topK: 32, topP: 0.88 },
  3: { temperature: 0.1, topK: 64, topP: 0.95 },
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
