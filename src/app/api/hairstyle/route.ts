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

async function uploadToR2(base64Data: string, prefix: string = 'hairstyle'): Promise<string | null> {
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
    const { imageUrl, hairstyle = 'short', hairColor } = await req.json();
    
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
    
    // 发型设计 - 2026-03-07 Week 4 优化：情感化、真实感
    const hairstylePrompts: Record<string, string> = {
      'short': `Change this person's hairstyle to SHORT hair - make it look NATURAL and FLATTERING.

PHILOSOPHY: Great hair looks effortless and suits the person.

SHORT HAIRSTYLE:
- Modern short haircut (professional, stylish)
- Natural hair texture and movement
- Flattering for face shape
- Realistic hair growth and direction
- Natural shine and dimension
- Effortless, confident style

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality and character

NATURAL INTEGRATION:
- Blend hair naturally with head shape
- Natural shadows and highlights
- Realistic hair texture
- Appropriate volume and body

GOAL: Like they just got a great haircut - natural, flattering, confident.`,
      
      'long': `Change this person's hairstyle to LONG hair - make it look NATURAL and BEAUTIFUL.

PHILOSOPHY: Beautiful long hair has life and movement.

LONG HAIRSTYLE:
- Flowing long hair (natural, healthy)
- Natural hair texture and movement
- Realistic volume and body
- Natural shine and dimension
- Flattering length and style
- Effortless, feminine/elegant style

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality

NATURAL INTEGRATION:
- Natural hair flow and movement
- Realistic shadows and highlights
- Natural hair texture
- Appropriate volume

GOAL: Like they've always had beautiful long hair - natural, healthy, flowing.`,
      
      'bob': `Change this person's hairstyle to BOB cut - make it look CHIC and NATURAL.

PHILOSOPHY: A great bob is timeless and effortlessly chic.

BOB HAIRSTYLE:
- Classic bob cut (chin-length, stylish)
- Clean lines with natural movement
- Flattering for face shape
- Natural hair texture
- Modern, sophisticated style
- Effortless elegance

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality

NATURAL INTEGRATION:
- Natural hair swing and movement
- Realistic texture and shine
- Appropriate volume
- Natural shadows

GOAL: Like they just stepped out of a salon - chic, polished, effortlessly stylish.`,
      
      'pixie': `Change this person's hairstyle to PIXIE cut - make it look BOLD and NATURAL.

PHILOSOPHY: Pixie cuts are about confidence and personality.

PIXIE HAIRSTYLE:
- Short pixie haircut (trendy, bold)
- Natural texture and movement
- Flattering for face shape
- Confident, edgy style
- Natural hair growth pattern
- Effortless cool

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Enhance personality

NATURAL INTEGRATION:
- Natural hair texture
- Realistic shadows and dimension
- Appropriate volume
- Natural styling

GOAL: Like they rock a pixie cut - confident, bold, naturally stylish.`,
      
      'curly': `Change this person's hairstyle to CURLY hair - make it look NATURAL and BEAUTIFUL.

PHILOSOPHY: Beautiful curls have life, bounce, and personality.

CURLY HAIRSTYLE:
- Natural curls (voluminous, bouncy)
- Realistic curl pattern and texture
- Natural volume and body
- Healthy, defined curls
- Natural shine and dimension
- Effortless, lively style

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality

NATURAL INTEGRATION:
- Natural curl formation
- Realistic texture and movement
- Appropriate volume
- Natural shadows and highlights

GOAL: Like they have naturally beautiful curls - bouncy, healthy, full of life.`,
      
      'straight': `Change this person's hairstyle to STRAIGHT hair - make it look SLEEK and NATURAL.

PHILOSOPHY: Sleek straight hair is about polish and shine.

STRAIGHT HAIRSTYLE:
- Sleek straight hair (smooth, polished)
- Natural shine and movement
- Healthy, silky texture
- Flattering style
- Effortless elegance
- Natural flow

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality

NATURAL INTEGRATION:
- Natural hair flow
- Realistic shine and dimension
- Appropriate volume
- Natural shadows

GOAL: Like they have naturally sleek hair - smooth, shiny, effortlessly polished.`,
      
      'wavy': `Change this person's hairstyle to WAVY hair - make it look NATURAL and EFFORTLESS.

PHILOSOPHY: Beautiful waves look effortless and beachy.

WAVY HAIRSTYLE:
- Soft waves (natural, beachy)
- Effortless texture and movement
- Natural volume and body
- Relaxed, casual style
- Natural shine and dimension
- Carefree, beautiful

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural hairline
- Keep face shape and proportions
- Preserve personality

NATURAL INTEGRATION:
- Natural wave pattern
- Realistic texture and movement
- Appropriate volume
- Natural shadows and highlights

GOAL: Like they have naturally beautiful waves - effortless, beachy, carefree.`,
      
      'bald': `Change this person to BALD/shaved head - make it look CONFIDENT and NATURAL.

PHILOSOPHY: Bald is bold, confident, and powerful.

BALD STYLE:
- Clean shaved head (smooth, polished)
- Natural head shape
- Realistic skin texture
- Confident, bold look
- Natural skin tone
- Powerful presence

PRESERVE IDENTITY:
- Keep facial features EXACTLY the same
- Maintain natural head shape
- Keep face proportions
- Enhance confidence

NATURAL INTEGRATION:
- Natural skin texture
- Realistic shadows and highlights
- Appropriate skin tone
- Natural appearance

GOAL: Like they confidently rock the bald look - bold, powerful, naturally confident.`,
    };
    
    let prompt = hairstylePrompts[hairstyle] || hairstylePrompts['short'];
    
    if (hairColor) {
      prompt += `\n\nHAIR COLOR: ${hairColor} - natural, realistic color with dimension and shine.`;
    }

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
    const r2Url = await uploadToR2(fullBase64, 'hairstyle');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        hairstyle,
        hairColor
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        hairstyle,
        hairColor
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Hairstyle change error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
