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

async function uploadToR2(base64Data: string, prefix: string = 'photoshoot'): Promise<string | null> {
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
    const { imageUrl, theme = 'professional' } = await req.json();
    
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
    
    // AI写真主题 - 2026-03-07 Week 4 优化：情感化、真实感
    const themePrompts: Record<string, string> = {
      'professional': `Transform this into PROFESSIONAL portrait photography - make them look CONFIDENT and CAPABLE.

PHILOSOPHY: Professional portraits show competence, confidence, and approachability.

PROFESSIONAL PORTRAIT:
- Studio lighting (perfect, flattering, professional)
- Clean background (neutral, professional)
- Business attire (professional, polished)
- Confident pose (approachable yet professional)
- High-quality headshot (LinkedIn-worthy)
- Professional, trustworthy feel

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain natural expressions
- Keep their personality and warmth
- Show confidence, not stiffness

GOAL: Like a professional headshot - confident, capable, makes you want to hire them.`,
      
      'casual': `Transform this into CASUAL lifestyle photography - make them look NATURAL and RELATABLE.

PHILOSOPHY: Casual portraits show real people in real moments.

CASUAL PORTRAIT:
- Natural lighting (soft, warm, real)
- Relaxed pose (natural, comfortable, authentic)
- Everyday setting (home, outdoor, casual environment)
- Instagram-worthy (shareable, relatable)
- Natural, genuine smile
- Warm, approachable feel

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain natural expressions
- Keep their personality and warmth
- Show them at their most natural

GOAL: Like an Instagram portrait - natural, relatable, makes you feel like you know them.`,
      
      'artistic': `Transform this into ARTISTIC portrait photography - make it BEAUTIFUL and UNIQUE.

PHILOSOPHY: Artistic portraits are about creativity, emotion, and beauty.

ARTISTIC PORTRAIT:
- Creative lighting (dramatic, artistic, mood)
- Artistic composition (unique, creative framing)
- Unique aesthetic (artistic vision, creative)
- Gallery-quality (art photography, professional)
- Emotional depth (feeling, soul, story)
- Beautiful, artistic feel

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain their essence and personality
- Show their beauty and character
- Capture their soul

GOAL: Like gallery art photography - beautiful, unique, captures their soul.`,
      
      'vintage': `Transform this into VINTAGE portrait photography - make it TIMELESS and NOSTALGIC.

PHILOSOPHY: Vintage portraits capture timeless beauty and nostalgia.

VINTAGE PORTRAIT:
- Film photography aesthetic (grain, faded colors)
- Retro styling (classic, timeless)
- Nostalgic feel (warm, memories, timeless)
- Classic vintage portrait (1950s-1970s feel)
- Warm, aged tones
- Timeless, nostalgic feel

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain their natural beauty
- Keep their personality
- Show timeless quality

GOAL: Like a treasured vintage photo - timeless, nostalgic, beautiful.`,
      
      'fashion': `Transform this into FASHION portrait photography - make them look STUNNING and STYLISH.

PHILOSOPHY: Fashion portraits are about style, confidence, and high fashion.

FASHION PORTRAIT:
- High fashion styling (editorial, trendy, stylish)
- Dramatic lighting (mood, atmosphere, fashion)
- Editorial quality (Vogue-level, professional)
- Fashion-forward (stylish, confident, bold)
- Striking, confident pose
- High fashion feel

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain their personality
- Show their confidence and style
- Keep their essence

GOAL: Like a Vogue fashion portrait - stunning, stylish, makes them look like a model.`,
    };
    
    const prompt = themePrompts[theme] || themePrompts['professional'];

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
          temperature: 0.5,
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
    const r2Url = await uploadToR2(fullBase64, 'photoshoot');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        theme
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        theme
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('AI photoshoot error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
