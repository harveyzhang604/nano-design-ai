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

async function uploadToR2(base64Data: string, prefix: string = 'gender'): Promise<string | null> {
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
    const { imageUrl, targetGender = 'opposite' } = await req.json();
    
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
    
    // 性别转换 - 2026-03-07 Week 4 优化：情感化、真实感
    const genderPrompts: Record<string, string> = {
      'male': `Transform this person to look MALE - but keep them RECOGNIZABLE.

PHILOSOPHY: Gender transformation shows possibility, not creates a stranger.

MASCULINE FEATURES:
- Stronger, more defined jawline
- Broader facial structure
- Masculine brow ridge
- Facial hair if appropriate (natural, well-groomed)
- Male hairstyle (natural, flattering)
- Masculine skin texture
- Natural masculine appearance

PRESERVE IDENTITY:
- Keep core facial features recognizable
- Maintain eye shape and character
- Keep their essence and personality
- Preserve unique features
- Keep natural expressions

NATURAL TRANSFORMATION:
- Realistic masculine features
- Natural skin texture
- Appropriate facial hair
- Believable transformation
- Keep it real, not exaggerated

FORBIDDEN:
- DO NOT make them unrecognizable
- DO NOT create artificial features
- DO NOT exaggerate masculinity
- DO NOT lose their identity

GOAL: Like their male version - recognizable, natural, believable. Still THEM, just masculine.`,
      
      'female': `Transform this person to look FEMALE - but keep them RECOGNIZABLE.

PHILOSOPHY: Gender transformation shows possibility, not creates a stranger.

FEMININE FEATURES:
- Softer, more delicate jawline
- Softer facial structure
- Feminine brow shape
- Natural makeup if appropriate (subtle, flattering)
- Female hairstyle (natural, beautiful)
- Softer skin texture
- Natural feminine appearance

PRESERVE IDENTITY:
- Keep core facial features recognizable
- Maintain eye shape and character
- Keep their essence and personality
- Preserve unique features
- Keep natural expressions

NATURAL TRANSFORMATION:
- Realistic feminine features
- Natural skin texture
- Subtle, natural makeup
- Believable transformation
- Keep it real, not exaggerated

FORBIDDEN:
- DO NOT make them unrecognizable
- DO NOT create artificial features
- DO NOT exaggerate femininity
- DO NOT lose their identity

GOAL: Like their female version - recognizable, natural, believable. Still THEM, just feminine.`,
      
      'opposite': `Transform this person to the OPPOSITE gender - but keep them RECOGNIZABLE.

PHILOSOPHY: Gender transformation shows possibility, not creates a stranger.

TRANSFORMATION RULES:
- If male → feminine features (softer jawline, feminine styling, natural makeup)
- If female → masculine features (stronger jawline, masculine styling, facial hair if appropriate)
- Natural, realistic transformation
- Keep core identity recognizable
- Preserve unique features and personality

PRESERVE IDENTITY:
- Keep core facial features recognizable
- Maintain eye shape and character
- Keep their essence and personality
- Preserve what makes them unique
- Keep natural expressions

NATURAL TRANSFORMATION:
- Realistic gender features
- Natural skin texture
- Appropriate styling
- Believable transformation
- Keep it real, not exaggerated

FORBIDDEN:
- DO NOT make them unrecognizable
- DO NOT create artificial features
- DO NOT exaggerate gender features
- DO NOT lose their identity

GOAL: Like their opposite gender version - recognizable, natural, believable. Still THEM, just different gender.`,
    };
    
    const prompt = genderPrompts[targetGender] || genderPrompts['opposite'];

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
          temperature: 0.4,
          topK: 40,
          topP: 0.95
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
    const r2Url = await uploadToR2(fullBase64, 'gender');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        targetGender
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        targetGender
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Gender swap error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
