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

async function uploadToR2(base64Data: string, prefix: string = 'age-evolution'): Promise<string | null> {
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
    const { imageUrl, targetAge = 25, style = 'realistic', preserveFeatures = 90, showTimeline = 'single' } = await req.json();
    
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
    
    // 年龄阶段描述
    const getAgeDescription = (age: number): string => {
      if (age <= 2) return 'baby (0-2 years old) with soft baby features, chubby cheeks, and innocent eyes';
      if (age <= 5) return 'toddler (3-5 years old) with childlike features, round face, and playful expression';
      if (age <= 12) return 'child (6-12 years old) with youthful features, growing face structure, and bright eyes';
      if (age <= 17) return 'teenager (13-17 years old) with developing adult features, clearer face structure, and youthful skin';
      if (age <= 30) return 'young adult (18-30 years old) with mature features, defined face structure, and vibrant appearance';
      if (age <= 45) return 'adult (31-45 years old) with fully mature features, some early aging signs, and confident appearance';
      if (age <= 60) return 'middle-aged (46-60 years old) with visible aging signs, some wrinkles, and distinguished appearance';
      if (age <= 75) return 'senior (61-75 years old) with clear aging signs, wrinkles, gray hair, and wise appearance';
      return 'elderly (76+ years old) with advanced aging signs, deep wrinkles, white hair, and dignified appearance';
    };

    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'realistic': 'photorealistic style with natural lighting and authentic aging details',
      'artistic': 'artistic portrait style with painterly quality and elegant aging representation',
      'portrait': 'professional portrait photography style with studio lighting and refined aging details'
    };

    // 特征保留程度
    const featureLevel = preserveFeatures >= 95 ? 'STRONGLY preserve all unique facial features' :
                        preserveFeatures >= 85 ? 'clearly preserve key facial features' :
                        'preserve essential facial features while allowing natural aging changes';

    const ageDesc = getAgeDescription(targetAge);

    const prompt = `PHILOSOPHY: Age progression/regression is about showing natural, believable aging while preserving the person's unique identity. Every face ages differently - respect their individuality.

Transform this person to look like a ${ageDesc}.

CRITICAL REQUIREMENTS:

1. PRESERVE IDENTITY (${featureLevel}):
   - Keep exact facial structure and bone structure
   - Maintain eye shape, nose shape, and mouth shape
   - Preserve unique features (moles, scars, distinctive traits)
   - Keep the person's ethnic characteristics
   - Maintain their core identity - they should be recognizable

2. AGE-APPROPRIATE CHANGES FOR ${targetAge} YEARS OLD:
   ${targetAge <= 12 ? `
   YOUNGER FEATURES:
   - Softer, rounder facial features
   - Smoother, flawless skin
   - Brighter, more innocent eyes
   - Fuller cheeks
   - Smaller facial proportions
   - Baby fat if very young
   - Playful, innocent expression
   ` : targetAge <= 30 ? `
   YOUNG ADULT FEATURES:
   - Mature facial structure
   - Clear, vibrant skin
   - Defined features
   - Youthful glow
   - Confident expression
   - No visible aging signs
   ` : targetAge <= 50 ? `
   MIDDLE AGE FEATURES:
   - Fully mature facial structure
   - Some fine lines around eyes and mouth
   - Slight skin texture changes
   - Possible early gray hair
   - More defined facial contours
   - Mature, confident expression
   ` : `
   SENIOR FEATURES:
   - Natural wrinkles and age lines
   - Gray or white hair
   - Age spots and skin texture
   - Softer facial contours
   - Wise, experienced expression
   - Dignified appearance
   `}

3. NATURAL AGING PROCESS:
   - Aging should look completely natural
   - No artificial or exaggerated changes
   - Respect genetics and ethnicity
   - Consider lifestyle and health
   - Maintain skin tone consistency
   - Natural hair color changes

4. STYLE & QUALITY:
   - ${styleDescriptions[style]}
   - Professional photography quality
   - Proper lighting and composition
   - High resolution and detail
   - Natural color grading

5. EMOTIONAL AUTHENTICITY:
   - Expression appropriate for age
   - Natural and relaxed demeanor
   - Genuine and believable
   - Captures life stage personality

PRESERVE EXACTLY:
- Facial bone structure
- Eye color and shape
- Nose shape and size
- Mouth shape
- Ear shape
- Facial proportions
- Unique identifying features
- Ethnic characteristics

FORBIDDEN:
- Do NOT change the person's identity
- Do NOT make aging look artificial or exaggerated
- Do NOT add features that don't naturally occur
- Do NOT change ethnic characteristics
- Do NOT make it look like makeup or prosthetics
- Do NOT create uncanny valley effect

AGING MAGIC:
- Natural progression/regression of age
- Believable and authentic
- Preserves core identity
- Respects individual aging patterns
- Captures the essence of that life stage

GOAL: Create a completely natural and believable representation of this person at ${targetAge} years old, maintaining their unique identity while showing authentic age-appropriate features.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 8192,
                      }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ 
        error: `Gemini API error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    
    if (!(() => { const parts = data.candidates?.[0]?.content?.parts || []; const imagePart = parts.find((p: any) => p.inlineData); return imagePart?.inlineData?.data; })()) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const generatedImageBase64 = imagePart?.inlineData?.data;
    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'age-evolution');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Age evolution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
