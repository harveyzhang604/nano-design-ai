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

async function uploadToR2(base64Data: string, prefix: string = 'pet-family'): Promise<string | null> {
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
    const { 
      petImages = [],
      scene = 'family-portrait',
      style = 'realistic'
    } = await req.json();
    
    if (!petImages || petImages.length === 0) {
      return NextResponse.json({ 
        error: 'At least one pet image is required' 
      }, { status: 400 });
    }
    
    if (petImages.length > 5) {
      return NextResponse.json({ 
        error: 'Maximum 5 pets allowed' 
      }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.' 
      }, { status: 500 });
    }

    // 转换所有宠物图片为 base64
    const petBase64Array = await Promise.all(
      petImages.map((url: string) => imageToBase64(url))
    );
    
    // 场景描述
    const sceneDescriptions: Record<string, string> = {
      'family-portrait': 'formal family portrait with everyone posed together, warm and loving atmosphere',
      'casual-group': 'casual group photo, relaxed poses, friendly and fun atmosphere',
      'adventure': 'outdoor adventure scene, everyone in action poses, exciting and energetic',
      'celebration': 'celebration scene with party elements, joyful and festive atmosphere',
      'cozy-home': 'cozy home scene, everyone relaxed together, warm and comfortable'
    };
    
    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'realistic': 'realistic humanized versions with natural human features and proportions',
      'anime': 'anime-style humanized versions with expressive features and vibrant colors',
      'cartoon': 'cartoon-style humanized versions with fun, exaggerated features',
      'chibi': 'super cute chibi-style humanized versions with big heads and tiny bodies'
    };

    const prompt = `Transform these ${petImages.length} pets into HUMANIZED characters and create a GROUP PHOTO together!

PET HUMANIZATION PHILOSOPHY: Each pet becomes a unique human character that captures their personality and distinctive features.

HUMANIZATION RULES (for each pet):
1. PRESERVE PET IDENTITY:
   - Keep each pet's distinctive features (fur color → hair color, markings → unique traits)
   - Maintain each pet's personality (playful, calm, mischievous, etc.)
   - Preserve breed characteristics in human form
   - Keep each pet recognizable as their humanized self

2. HUMAN TRANSFORMATION:
   - Full human body and face (not hybrid)
   - Pet's fur color becomes hair color
   - Pet's eye color becomes human eye color
   - Pet's personality shows in expression and pose
   - Clothing reflects pet's character

3. CHARACTER CONSISTENCY:
   - Each pet should be clearly distinguishable
   - Maintain size relationships (big dog → tall person, small cat → shorter person)
   - Keep personality differences visible

GROUP COMPOSITION:
- Scene: ${sceneDescriptions[scene]}
- Style: ${styleDescriptions[style]}
- All ${petImages.length} characters together in one image
- Natural group interaction and poses
- Balanced composition
- Everyone clearly visible

VISUAL QUALITY:
- Professional group photo quality
- Good lighting and composition
- Natural interactions between characters
- Warm, engaging atmosphere
- High-quality illustration

GOAL: Create a heartwarming group photo where each pet's humanized character is unique, recognizable, and full of personality!

Number of pets to humanize: ${petImages.length}`;

    // 构建 API 请求的 parts（包含 prompt + 所有宠物图片）
    const parts = [
      { text: prompt },
      ...petBase64Array.map(base64 => ({
        inlineData: { mimeType: 'image/png', data: base64.split(',')[1] }
      }))
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
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
    const parts_result = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts_result.find((p: any) => p.inlineData);
    
    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageBase64 = imagePart.inlineData.data;
    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'pet-family');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl,
      petCount: petImages.length,
      scene,
      style
    });

  } catch (error) {
    console.error('Pet family generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
