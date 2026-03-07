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

async function uploadToR2(base64Data: string, prefix: string = 'product'): Promise<string | null> {
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
    const { imageUrl, scene = 'studio' } = await req.json();
    
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
    
    // 产品摄影场景 - 2026-03-07 Week 4 优化：情感化、真实感
    const scenePrompts: Record<string, string> = {
      'studio': `Transform this into PROFESSIONAL STUDIO product photography - make it SELL.

PHILOSOPHY: Great product photos make you want to buy.

STUDIO PHOTOGRAPHY:
- Clean white background (pure, professional)
- Perfect studio lighting (soft, even, no harsh shadows)
- Subtle soft shadows (depth and dimension)
- Product perfectly centered and composed
- Sharp focus on product details
- Commercial e-commerce quality
- Professional, trustworthy feel

PRODUCT ENHANCEMENT:
- Enhance product details and textures
- Show quality and craftsmanship
- Make colors accurate and appealing
- Highlight key features
- Make it look premium

FORBIDDEN:
- DO NOT change the product itself
- DO NOT add fake features
- DO NOT over-process
- DO NOT make it look unrealistic

GOAL: Like an Amazon or Apple product photo - professional, clean, makes you want to buy it.`,
      
      'lifestyle': `Transform this into LIFESTYLE product photography - make it DESIRABLE.

PHILOSOPHY: Great lifestyle photos show the product in real life.

LIFESTYLE PHOTOGRAPHY:
- Natural, real-world setting (home, office, outdoor)
- Warm, inviting lighting (natural daylight feel)
- Product in context (being used, displayed naturally)
- Instagram-worthy aesthetic (shareable, aspirational)
- Authentic, relatable feel
- Emotional connection

PRODUCT PRESENTATION:
- Show product in natural use
- Create aspirational lifestyle
- Warm, inviting atmosphere
- Make it relatable and desirable
- Show the experience, not just product

FORBIDDEN:
- DO NOT make it look staged or fake
- DO NOT over-style
- DO NOT lose authenticity
- DO NOT make it look like an ad

GOAL: Like an Instagram lifestyle photo - natural, desirable, makes you want that life.`,
      
      'luxury': `Transform this into LUXURY brand product photography - make it PREMIUM.

PHILOSOPHY: Luxury is about exclusivity, quality, and desire.

LUXURY PHOTOGRAPHY:
- Premium background (elegant, sophisticated)
- Dramatic, artistic lighting (mood and atmosphere)
- High-end aesthetic (magazine editorial quality)
- Exclusive, aspirational feel
- Impeccable composition
- Premium brand quality

PRODUCT PRESENTATION:
- Showcase premium quality
- Create desire and exclusivity
- Dramatic, artistic presentation
- Sophisticated, elegant feel
- Make it look expensive and worth it

FORBIDDEN:
- DO NOT make it look cheap or common
- DO NOT over-dramatize
- DO NOT lose product clarity
- DO NOT make it look fake

GOAL: Like a Vogue or luxury brand ad - premium, exclusive, makes you desire it.`,
      
      'minimal': `Transform this into MINIMALIST product photography - make it ELEGANT.

PHILOSOPHY: Less is more. Simplicity is sophistication.

MINIMALIST PHOTOGRAPHY:
- Simple, clean background (white, gray, or soft color)
- Soft, even lighting (gentle, no drama)
- Modern, clean aesthetic (Apple-style simplicity)
- Perfect composition (balanced, centered)
- Focus on product essence
- Sophisticated simplicity

PRODUCT PRESENTATION:
- Let product speak for itself
- Clean, uncluttered presentation
- Highlight design and form
- Modern, sophisticated feel
- Elegant simplicity

FORBIDDEN:
- DO NOT add unnecessary elements
- DO NOT over-complicate
- DO NOT lose focus on product
- DO NOT make it boring

GOAL: Like an Apple product photo - simple, elegant, sophisticated. Pure product beauty.`,
      
      'outdoor': `Transform this into OUTDOOR product photography - make it ALIVE.

PHILOSOPHY: Outdoor photos show products in real, vibrant life.

OUTDOOR PHOTOGRAPHY:
- Natural outdoor environment (nature, urban, lifestyle)
- Natural daylight (golden hour feel, warm and inviting)
- Fresh, vibrant atmosphere (alive, energetic)
- Product in natural context (real-world use)
- Authentic, adventurous feel
- Connection with nature/life

PRODUCT PRESENTATION:
- Show product in natural environment
- Create sense of adventure or lifestyle
- Fresh, vibrant colors
- Natural, authentic feel
- Make it look alive and real

FORBIDDEN:
- DO NOT make lighting look artificial
- DO NOT lose product visibility
- DO NOT make it look staged
- DO NOT over-process

GOAL: Like an outdoor lifestyle brand photo - fresh, alive, makes you want to go outside.`,
    };
    
    const prompt = scenePrompts[scene] || scenePrompts['studio'];

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
    const r2Url = await uploadToR2(fullBase64, 'product');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        scene
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        scene
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Product photography error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
