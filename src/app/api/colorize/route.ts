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

async function uploadToR2(base64Data: string, prefix: string = 'colorize'): Promise<string | null> {
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
    const { imageUrl, colorStyle = 'natural' } = await req.json();
    
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
    
    // 调用 Gemini API 进行照片上色 - 2026-03-07 Week 4 优化：情感化、真实感
    const colorStyles: Record<string, string> = {
      natural: `Colorize this black and white photograph - bring LIFE and MEMORY back to it.

PHILOSOPHY: This is someone's memory. Treat it with respect and care.

NATURAL COLORIZATION:
- Analyze the era, clothing, environment carefully
- Apply historically accurate, period-appropriate colors
- Use realistic, warm skin tones (people had life, not plastic)
- Natural fabric colors (clothes had texture and character)
- Authentic environmental hues (nature was real)
- Smooth, natural color transitions (no harsh boundaries)

PRESERVE HISTORY:
- Keep ALL original details and textures
- Maintain the photo's character and soul
- Preserve tonal values and depth
- Keep the emotional connection to the past

FORBIDDEN:
- DO NOT over-saturate (keep it believable)
- DO NOT make it look artificial or fake
- DO NOT lose the historical authenticity
- DO NOT erase the photo's character

GOAL: Like the photo was taken in color - natural, authentic, alive. Bring the memory back to LIFE.`,
      
      vibrant: `Colorize this black and white photo with RICH, VIBRANT colors - but keep it REAL.

PHILOSOPHY: Vibrant doesn't mean fake. Life was colorful and full of energy.

VIBRANT COLORIZATION:
- Rich, saturated colors (life was vivid)
- Bold but natural colors for clothing and objects
- Realistic skin tones (warm, alive, human)
- Eye-catching but believable colors
- Smooth color transitions (no harsh edges)
- Energy and life in every color

PRESERVE AUTHENTICITY:
- Keep it believable and real
- Maintain historical accuracy
- Preserve all details and textures
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look cartoonish
- DO NOT lose realism
- DO NOT create artificial colors

GOAL: Like a vivid memory - colorful, energetic, but still REAL and authentic.`,
      
      vintage: `Colorize this black and white photo with AUTHENTIC VINTAGE colors - capture NOSTALGIA.

PHILOSOPHY: This is a window to the past. Show how it really looked.

VINTAGE COLORIZATION:
- Authentic 1950s-1960s color palette
- Slightly faded, nostalgic tones (aged photo feel)
- Period-accurate colors for clothing and environment
- Warm, aged color grading (time has passed)
- Soft color transitions (gentle, nostalgic)
- Preserve vintage photograph aesthetic

PRESERVE MEMORY:
- Keep historical authenticity
- Maintain the era's character
- Preserve all details and textures
- Keep emotional connection to the past

FORBIDDEN:
- DO NOT modernize the colors
- DO NOT make it look new
- DO NOT lose the vintage soul

GOAL: Like a treasured old color photo - nostalgic, authentic, timeless. A window to the PAST.`,
      
      warm: `Colorize this black and white photo with WARM, GOLDEN colors - create WARMTH and COMFORT.

PHILOSOPHY: Warm colors evoke emotion, memory, comfort.

WARM COLORIZATION:
- Golden yellows, amber, soft oranges
- Warm browns and earth tones
- Natural skin tones with warm undertones (alive, human)
- Cozy, inviting atmosphere
- Smooth, gentle color blending
- Emotional warmth in every tone

PRESERVE HUMANITY:
- Keep people looking real and alive
- Maintain natural details
- Preserve emotional connection
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look artificial
- DO NOT over-warm (keep it natural)
- DO NOT lose realism

GOAL: Like a warm memory - comforting, inviting, emotionally warm. Photo that feels like HOME.`,
      
      cool: `Colorize this black and white photo with COOL, SERENE colors - create CALM and PEACE.

PHILOSOPHY: Cool colors evoke calm, serenity, timelessness.

COOL COLORIZATION:
- Blues, teals, cool grays
- Subtle purples and cool tones
- Natural skin tones with cool undertones (still alive, still human)
- Calm, serene atmosphere
- Smooth color transitions
- Peaceful, timeless feel

PRESERVE HUMANITY:
- Keep people looking real and alive
- Maintain natural details
- Preserve emotional connection
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look cold or lifeless
- DO NOT over-cool (keep it natural)
- DO NOT lose warmth and humanity

GOAL: Like a peaceful memory - calm, serene, timeless. Photo that feels PEACEFUL.`,
    };
    
    const prompt = colorStyles[colorStyle] || colorStyles.natural;

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
          temperature: 0.35,
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
    const r2Url = await uploadToR2(fullBase64, 'colorize');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        colorStyle: colorStyle || 'natural'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        colorStyle: colorStyle || 'natural'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Colorize error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
