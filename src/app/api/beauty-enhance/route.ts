import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'beauty'): Promise<string | null> {
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
    const { imageUrl, intensity = 'natural', features = [] } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.' 
      }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);
    
    // 根据强度生成不同的 prompt
    const intensityPrompts: Record<string, string> = {
      'subtle': `Apply SUBTLE natural beauty enhancement to this portrait.

PHILOSOPHY: Less is more. Enhance, don't transform.

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural expressions
- Preserve unique characteristics
- Keep the person recognizable

SUBTLE ENHANCEMENTS (Very Light):
- Minimal skin smoothing (keep natural texture)
- Slight blemish reduction (keep character)
- Gentle eye brightening (natural sparkle)
- Soft skin tone evening (maintain natural color)
- Light under-eye improvement (keep natural)

FORBIDDEN:
- Do NOT change facial structure
- Do NOT over-smooth (keep skin texture)
- Do NOT change eye/nose/mouth shape
- Do NOT make it look filtered or fake
- Do NOT alter natural beauty marks

GOAL: "I woke up like this" - barely noticeable enhancement.`,

      'natural': `Apply NATURAL beauty enhancement to this portrait.

PHILOSOPHY: Enhance natural beauty, maintain authenticity.

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural expressions
- Preserve unique characteristics
- Keep the person recognizable

NATURAL ENHANCEMENTS (Moderate):
- Smooth skin while keeping natural texture
- Reduce blemishes and minor imperfections
- Brighten eyes naturally
- Even skin tone (maintain natural color)
- Reduce under-eye darkness
- Enhance natural lip color slightly
- Soften fine lines (keep character)

QUALITY STANDARDS:
- Professional photo quality
- Natural lighting enhancement
- Realistic skin texture
- No plastic or artificial look
- Maintain photo authenticity

FORBIDDEN:
- Do NOT change facial structure
- Do NOT over-smooth skin
- Do NOT change features
- Do NOT make it look fake

GOAL: Natural beauty enhancement - "best version of yourself".`,

      'enhanced': `Apply ENHANCED beauty treatment to this portrait.

PHILOSOPHY: Noticeable enhancement while maintaining natural appearance.

PRESERVE IDENTITY:
- Keep facial features recognizable
- Maintain core characteristics
- Preserve natural expressions

ENHANCED BEAUTY (Strong):
- Smooth skin significantly (keep some texture)
- Remove blemishes, spots, and imperfections
- Brighten and enhance eyes
- Even skin tone and color
- Reduce under-eye circles and bags
- Enhance lip color and definition
- Soften wrinkles and fine lines
- Improve facial contours subtly
- Add healthy glow to skin

QUALITY STANDARDS:
- Magazine-quality enhancement
- Professional retouching
- Polished appearance
- Still looks like a real person

FORBIDDEN:
- Do NOT change facial structure drastically
- Do NOT make it look plastic or fake
- Do NOT lose the person's identity

GOAL: Professional beauty enhancement - polished and refined.`,

      'glamour': `Apply GLAMOUR beauty treatment to this portrait.

PHILOSOPHY: Maximum enhancement with AUTHENTIC skin texture — 2026 editorial beauty is radiant and real, NOT plastic or AI-looking.

PRESERVE CORE IDENTITY:
- Keep the person FULLY recognizable
- Maintain facial structure and unique features
- Preserve freckles, beauty marks (enhance, don't erase)
- Keep natural skin undertone

GLAMOUR ENHANCEMENTS (Maximum but authentic):
- Luminous, glass-skin glow (Hailey Bieber / Korean glass skin aesthetic)
- Smooth skin while KEEPING visible pore texture and natural grain
- Dramatic, defined eye enhancement with depth and sparkle
- Rich, editorial lip color with natural texture
- Sculpted cheekbones with soft highlight and shadow
- Radiant golden-hour skin warmth
- Professional high-fashion makeup look (not overly filtered)
- Healthy, dewy skin that looks TOUCHABLE not plastic

FORBIDDEN (2026 anti-AI aesthetic rules):
- Do NOT make skin look smooth like plastic or wax
- Do NOT lose all skin texture — pores and natural grain MUST remain
- Do NOT over-brighten to the point of losing dimension
- Do NOT erase ALL imperfections — keep character
- Do NOT change facial structure or features
- Do NOT make it look like an obvious AI filter

QUALITY STANDARDS:
- Vogue / Harper's Bazaar editorial quality
- High-end beauty campaign retouching
- Skin looks real and touchable, not digital
- The "uncanny valley" must be avoided at all costs

GOAL: Glamorous red carpet look — stunning, radiant, unmistakably REAL.`
    };
    
    let prompt = intensityPrompts[intensity] || intensityPrompts['natural'];
    
    // 如果指定了特定功能，添加到 prompt
    if (features && features.length > 0) {
      const featureInstructions = features.map((f: string) => {
        const featureMap: Record<string, string> = {
          'skin': 'Focus on skin smoothing and blemish removal',
          'eyes': 'Focus on eye brightening and enhancement',
          'teeth': 'Focus on teeth whitening',
          'face-shape': 'Focus on subtle facial contouring',
          'wrinkles': 'Focus on wrinkle reduction',
          'dark-circles': 'Focus on under-eye improvement'
        };
        return featureMap[f] || '';
      }).filter(Boolean).join('\n- ');
      
      if (featureInstructions) {
        prompt += `\n\nSPECIFIC FOCUS AREAS:\n- ${featureInstructions}`;
      }
    }

    let base64Data: string | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      const apiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`,
        {
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
              temperature: 0.3 + (attempt - 1) * 0.05,
              topK: 32,
              topP: 0.85
            }
          })
        }
      );

      const data = await apiResponse.json();
      
      if (!apiResponse.ok) {
        lastError = data.error?.message || 'Gemini API Error';
        console.error('Gemini API error:', data);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return NextResponse.json({ 
          error: lastError 
        }, { status: apiResponse.status });
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      base64Data = imagePart?.inlineData?.data || null;
      
      if (base64Data) break;
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: lastError || 'No image data returned from AI.' 
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, `beauty-${intensity}`);
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'beauty-enhance',
        intensity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'beauty-enhance',
        intensity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Beauty enhance error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
