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
    
    // 根据修复强度调整prompt
    const prompts: Record<string, string> = {
      'conservative': `Restore this old or damaged photo with CONSERVATIVE approach. CRITICAL - DO NOT change any original details:
- ONLY repair visible damage: scratches, tears, stains, fading
- ONLY reduce noise and grain where clearly damaged
- ONLY fix obvious blur in damaged areas
- DO NOT change: facial expressions, poses, positions, clothing, background elements
- DO NOT add details that weren't there
- DO NOT "improve" or "enhance" beyond damage repair
- Keep the original character and authenticity of the photo
- Minimal intervention - preserve history`,
      
      'standard': `Restore this old or damaged photo with BALANCED approach. CRITICAL - preserve original details:
- Repair damage: scratches, tears, stains, fading, cracks
- Reduce noise and grain moderately
- Fix blur and improve clarity where damaged
- DO NOT change: facial expressions, poses, positions
- DO NOT add new details
- Balance between repair and preservation
- Keep authentic look while improving quality`,
      
      'deep': `Restore this old or damaged photo with THOROUGH approach. CRITICAL - still preserve core details:
- Repair all damage: scratches, tears, stains, fading, cracks, discoloration
- Significantly reduce noise and grain
- Fix blur and maximize clarity
- Enhance overall quality
- DO NOT change: facial expressions, poses, core composition
- Thorough restoration while keeping authenticity
- Maximum quality improvement within preservation limits`
    };
    
    const prompt = prompts[restoreLevel] || prompts['standard'];
    // 调用 Gemini API 进行老照片修复
    // 关键：只修复损坏，不改变任何原有细节！
    const prompt = `Professionally restore this damaged old photograph. ONLY repair the following issues: remove scratches, tears, water stains, noise, and physical damage. ONLY enhance clarity in blurry areas. Keep ALL original details EXACTLY the same including: facial expression (DO NOT change - keep exactly as is), eye position, mouth shape, pose, head position, lighting direction, and all other details. Restore colors to match the original tones - do not add or change any colors. Make it look like the original photo was simply cleaned and damage-repaired, not recreated. The result should look like the same photo with damage fixed.`;

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
