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

async function uploadToR2(base64Data: string, prefix: string = 'fashion'): Promise<string | null> {
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
    const { imageUrl, modelType = 'professional', pose = 'standing' } = await req.json();
    
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
    
    // 虚拟模特展示 - 2026-03-07 Week 4 优化：情感化、真实感
    const modelPrompts: Record<string, string> = {
      'professional': `Transform this clothing into PROFESSIONAL fashion model photography - make it SELL.

PHILOSOPHY: Great fashion photography makes you want to wear it.

PROFESSIONAL MODEL PHOTOGRAPHY:
- ${pose} pose (natural, confident, professional)
- Studio lighting (perfect, even, flattering)
- Clean background (white or neutral, professional)
- E-commerce quality (clear, detailed, trustworthy)
- Model looks confident and natural
- Professional fashion photography

CLOTHING PRESENTATION:
- Keep clothing EXACTLY the same (colors, details, fit)
- Show how it fits and flows naturally
- Highlight fabric texture and quality
- Make it look desirable and wearable
- Show the clothing at its best

FORBIDDEN:
- DO NOT change the clothing design
- DO NOT alter colors or patterns
- DO NOT make it look fake
- DO NOT over-edit

GOAL: Like a professional e-commerce photo - makes you want to buy and wear it.`,
      
      'lifestyle': `Transform this clothing into LIFESTYLE fashion photography - make it RELATABLE.

PHILOSOPHY: Lifestyle fashion shows real people wearing real clothes.

LIFESTYLE MODEL PHOTOGRAPHY:
- ${pose} pose (natural, relaxed, authentic)
- Natural setting (outdoor, urban, home - real environment)
- Casual atmosphere (relaxed, approachable, real)
- Instagram-worthy (shareable, aspirational)
- Model looks natural and relatable
- Lifestyle fashion aesthetic

CLOTHING PRESENTATION:
- Keep clothing EXACTLY the same (colors, details, fit)
- Show how it looks in real life
- Natural, wearable styling
- Make it look desirable and accessible
- Show the lifestyle, not just clothes

FORBIDDEN:
- DO NOT change the clothing design
- DO NOT make it look staged
- DO NOT lose authenticity
- DO NOT over-style

GOAL: Like an Instagram fashion post - relatable, desirable, makes you see yourself wearing it.`,
      
      'editorial': `Transform this clothing into EDITORIAL fashion photography - make it ARTISTIC.

PHILOSOPHY: Editorial fashion is about art, drama, and high fashion.

EDITORIAL MODEL PHOTOGRAPHY:
- ${pose} pose (dramatic, artistic, high fashion)
- Dramatic lighting (mood, atmosphere, artistic)
- Magazine quality (Vogue-level, professional)
- High fashion aesthetic (editorial, artistic)
- Model looks confident and striking
- Fashion as art

CLOTHING PRESENTATION:
- Keep clothing EXACTLY the same (colors, details, fit)
- Show it in artistic, dramatic way
- Highlight design and craftsmanship
- Make it look high fashion and desirable
- Fashion photography as art

FORBIDDEN:
- DO NOT change the clothing design
- DO NOT lose clothing visibility
- DO NOT make it unwearable-looking
- DO NOT over-dramatize

GOAL: Like a Vogue editorial - artistic, dramatic, makes you desire high fashion.`,
    };
    
    const prompt = modelPrompts[modelType] || modelPrompts['professional'];

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
    const r2Url = await uploadToR2(fullBase64, 'fashion');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        modelType,
        pose
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        modelType,
        pose
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Fashion model error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
