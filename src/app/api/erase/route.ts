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

async function uploadToR2(base64Data: string, prefix: string = 'erase'): Promise<string | null> {
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
    const { imageUrl, maskArea } = await req.json();
    
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
    
    // 调用 Gemini API 进行智能擦除 - 2026-03-07 Week 4 优化：情感化、真实感
    const prompt = maskArea 
      ? `Remove the object in the marked area - make it look like it was NEVER there.

PHILOSOPHY: Perfect removal means invisible removal.

OBJECT REMOVAL:
- Remove the object in the marked area completely
- Fill with natural, appropriate background
- Match surrounding textures and patterns
- Seamless blending (no visible edges)
- Natural continuation of background elements

NATURAL FILLING:
- Analyze surrounding area carefully
- Continue patterns naturally (grass, walls, floors, etc.)
- Match lighting and shadows
- Preserve depth and perspective
- Make it look untouched

PRESERVE REST:
- Keep everything else EXACTLY the same
- Maintain image quality
- Preserve all other details
- Keep natural appearance

FORBIDDEN:
- DO NOT leave visible edges or seams
- DO NOT create obvious patches
- DO NOT blur excessively
- DO NOT make it look edited

GOAL: Like the object was never there - seamless, natural, invisible removal.`
      : `Intelligently remove unwanted objects - clean up the photo NATURALLY.

PHILOSOPHY: Great cleanup is invisible cleanup.

INTELLIGENT DETECTION:
- Identify unwanted objects, distractions, photobombers
- Detect what doesn't belong in the scene
- Keep main subject and important elements intact
- Remove only what improves the photo

NATURAL REMOVAL:
- Fill removed areas with appropriate background
- Match surrounding textures and patterns
- Seamless blending (invisible removal)
- Natural continuation of background
- Preserve lighting and shadows

PRESERVE QUALITY:
- Keep main subject perfectly intact
- Maintain image quality and details
- Preserve natural appearance
- Keep the photo's character

FORBIDDEN:
- DO NOT remove important elements
- DO NOT create obvious patches
- DO NOT blur excessively
- DO NOT make it look heavily edited

GOAL: Clean, distraction-free photo - like the unwanted objects were never there. Natural and seamless.`;

    let base64Data: string | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
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
            temperature: 0.4 + (attempt - 1) * 0.05,
            topK: 40,
            topP: 0.95
          }
        })
      });

      const data = await apiResponse.json();
      
      if (!apiResponse.ok) {
        lastError = data.error?.message || 'Gemini API Error';
        console.error('Gemini API error:', data);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return NextResponse.json({ error: lastError }, { status: apiResponse.status });
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
      return NextResponse.json({ error: lastError || 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'erase');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'erase'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'erase'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Erase error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
