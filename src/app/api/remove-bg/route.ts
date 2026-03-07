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

async function uploadToR2(base64Data: string, prefix: string = 'remove-bg'): Promise<string | null> {
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
    const { imageUrl, edgeMode = 'soft' } = await req.json();
    
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
    
    // 背景移除 - 2026-03-07 Week 4 优化：情感化、真实感
    const prompts: Record<string, string> = {
      'precise': `Remove the background from this image - make the subject STAND OUT perfectly.

PHILOSOPHY: Great cutouts make subjects shine on any background.

PRECISE CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Sharp, clean edges (pixel-perfect precision)
- Perfect for product photography
- Professional e-commerce quality
- Crisp, defined edges

PRESERVE SUBJECT:
- Keep ALL subject details intact
- Maintain colors and textures exactly
- Preserve fine details (buttons, textures, patterns)
- Keep subject looking natural and complete
- No artifacts or rough edges

FORBIDDEN:
- DO NOT cut into the subject
- DO NOT leave background remnants
- DO NOT blur important edges
- DO NOT alter the subject itself

GOAL: Like a professional product cutout - clean, precise, ready for any background.`,
      
      'soft': `Remove the background from this image - make it look NATURAL and BEAUTIFUL.

PHILOSOPHY: Natural cutouts blend seamlessly anywhere.

SOFT CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Natural, slightly soft edges (subtle feathering)
- Ideal for portraits and people
- Smooth, natural transitions
- Professional portrait quality

PRESERVE SUBJECT:
- Keep ALL subject details intact
- Preserve fine details like hair strands
- Maintain natural appearance
- Smooth edge transitions (not harsh)
- Keep subject looking real and natural

FORBIDDEN:
- DO NOT cut into the subject
- DO NOT leave background remnants
- DO NOT make edges too harsh
- DO NOT alter the subject itself

GOAL: Like a professional portrait cutout - natural, smooth, blends beautifully anywhere.`,
      
      'detail': `Remove the background from this image - preserve EVERY tiny detail.

PHILOSOPHY: Detail preservation makes cutouts look professional and real.

ULTRA-DETAILED CUTOUT:
- Identify the main subject accurately
- Remove background COMPLETELY (100% transparent)
- Preserve ALL fine details (hair strands, fur, fabric texture)
- Maintain transparent elements (glass, lace, etc.)
- Maximum detail preservation
- Natural edge transitions

PRESERVE SUBJECT:
- Keep EVERY detail intact (individual hairs, fur strands)
- Maintain all textures and patterns
- Preserve transparent and semi-transparent areas
- Keep fine details like jewelry, accessories
- Ultra-detailed preservation

FORBIDDEN:
- DO NOT lose any fine details
- DO NOT simplify complex edges
- DO NOT leave background remnants
- DO NOT alter the subject itself

GOAL: Like an ultra-professional cutout - every detail preserved, looks perfect anywhere.`,
    };
    
    const prompt = prompts[edgeMode] || prompts['soft'];

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
          temperature: 0.3,
          topK: 32,
          topP: 0.9
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
    const r2Url = await uploadToR2(fullBase64, 'remove-bg');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'remove-bg'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'remove-bg'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Background removal error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
