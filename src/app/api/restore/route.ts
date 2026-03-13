import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置 - 从环境变量读取
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

// 创建 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'restore'): Promise<string | null> {
  try {
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Content, 'base64');
    
    const filename = `${prefix}-${Date.now()}.png`;
    const key = `images/${filename}`;
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/png',
    });

    await r2Client.send(command);
    
    return `https://img.talkphoto.app/${key}`;
  } catch (error) {
    console.error('R2 upload error:', error);
    return null;
  }
}

// 将图片转换为 base64
function imageToBase64(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const mimeType = response.headers.get('content-type') || 'image/png';
      resolve(`data:${mimeType};base64,${base64}`);
    } catch (error) {
      reject(error);
    }
  });
}

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

    // 将图片转换为 base64
    const imageBase64 = await imageToBase64(imageUrl);
    
    // 根据修复强度调整prompt - 2026-03-13 优化：强调不改变表情，只修复损坏
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

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/png", data: imageBase64.split(',')[1] } }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 20,
          topP: 0.85
        }
      })
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    // 从响应中提取图片
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'restore');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'restore'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'restore'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Restore error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
