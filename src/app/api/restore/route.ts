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
    
    // 根据修复强度调整prompt - 2026-03-07 优化：强调保守修复，不改变表情
    const prompts: Record<string, string> = {
      'conservative': `Restore this old or damaged photo with ULTRA-CONSERVATIVE approach. 
ABSOLUTE RULES - NEVER VIOLATE:
1. PRESERVE EXACTLY: facial expressions, eye direction, mouth shape, wrinkles, skin texture
2. PRESERVE EXACTLY: poses, body positions, hand gestures, head angles
3. PRESERVE EXACTLY: clothing details, patterns, colors, accessories
4. PRESERVE EXACTLY: background elements, lighting, composition

ONLY REPAIR PHYSICAL DAMAGE:
- Remove scratches, tears, cracks, stains
- Fix fading and discoloration
- Reduce noise ONLY in damaged areas
- Fix blur ONLY where clearly damaged

FORBIDDEN ACTIONS:
- DO NOT change any facial features or expressions
- DO NOT "improve" or "beautify" faces
- DO NOT add missing details - leave them as is
- DO NOT change emotions or moods
- DO NOT modernize or stylize

GOAL: Make it look like the photo was never damaged, but keep EVERYTHING else identical to the original.`,
      
      'standard': `Restore this old or damaged photo with CONSERVATIVE-BALANCED approach.
ABSOLUTE RULES - NEVER VIOLATE:
1. PRESERVE EXACTLY: facial expressions, emotions, eye contact
2. PRESERVE EXACTLY: poses, positions, gestures
3. PRESERVE EXACTLY: original character and authenticity

REPAIR DAMAGE:
- Remove scratches, tears, cracks, stains, fading
- Reduce noise and grain moderately
- Fix blur and improve clarity in damaged areas
- Restore colors where faded

FORBIDDEN ACTIONS:
- DO NOT change facial expressions or emotions
- DO NOT add details that weren't there
- DO NOT "enhance" beyond damage repair
- DO NOT change the mood or feeling of the photo

GOAL: Repair damage while keeping the soul of the original photo intact.`,
      
      'deep': `Restore this old or damaged photo with THOROUGH approach.
ABSOLUTE RULES - NEVER VIOLATE:
1. PRESERVE: facial expressions, core emotions, personality
2. PRESERVE: poses, main composition, key elements

THOROUGH REPAIR:
- Remove all damage: scratches, tears, cracks, stains, discoloration
- Significantly reduce noise and grain
- Fix blur and maximize clarity
- Enhance overall quality and sharpness
- Restore colors and contrast

ALLOWED ENHANCEMENTS:
- Improve technical quality (sharpness, clarity, color)
- Reduce noise and artifacts
- Fix lighting and exposure

FORBIDDEN ACTIONS:
- DO NOT change facial expressions or core emotions
- DO NOT change poses or main composition
- DO NOT add elements that weren't there

GOAL: Maximum quality restoration while preserving the essence and character of the original.`
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
