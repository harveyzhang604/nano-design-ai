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

async function uploadToR2(base64Data: string, prefix: string = 'enhance'): Promise<string | null> {
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
    const { imageUrl, beautyLevel = 'subtle' } = await req.json();
    
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
    
    // 根据美化程度调整prompt - 2026-03-07 Week 4 优化：情感化、真实感
    const prompts: Record<string, string> = {
      'subtle': `Enhance this image with super-resolution quality - make it BETTER while keeping it REAL.

PHILOSOPHY: Enhancement means bringing out the best, not creating fake perfection.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Enhance quality, not change reality

FOR FACES/PORTRAITS:
- Gently reduce temporary imperfections (acne, blemishes)
- SUBTLE skin tone evening (keep original warmth and character)
- Light smoothing (preserve natural texture and pores)
- Keep freckles, beauty marks, natural features
- DO NOT over-brighten or over-whiten skin
- Keep natural expressions and personality

FOR ALL IMAGES:
- Enhance sharpness and clarity naturally
- Improve colors subtly (more vibrant, still natural)
- Reduce noise while keeping natural grain
- Enhance details without artifacts

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT over-process or over-smooth
- DO NOT change the photo's character
- DO NOT make it look heavily edited

GOAL: Like a good quality photo on a good day - natural, real, just BETTER.`,
      
      'light': `Enhance this image with super-resolution quality - NOTICEABLE improvement, still AUTHENTIC.

PHILOSOPHY: Professional quality doesn't mean fake. Real people, better quality.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Clear enhancement, still believable

FOR FACES/PORTRAITS:
- Remove visible imperfections (acne, blemishes, dark spots)
- Moderate skin tone improvement (brighter, more even)
- Smooth skin while keeping natural texture visible
- Light beauty enhancement (natural but improved)
- Keep personality and character
- Preserve unique features

FOR ALL IMAGES:
- Significantly enhance sharpness and clarity
- Improve colors noticeably (vibrant, still realistic)
- Professional noise reduction
- Enhance all details

FORBIDDEN:
- DO NOT create unrealistic perfection
- DO NOT over-smooth (keep texture)
- DO NOT change the person's essence
- DO NOT make it look fake

GOAL: Professionally retouched quality - noticeably better, still authentically YOU.`,
      
      'professional': `Enhance this image with super-resolution quality - MAGAZINE-READY, still REAL.

PHILOSOPHY: Professional photography quality - polished, not plastic.

CRITICAL REQUIREMENTS:
1. Keep the ENTIRE image intact - NO cropping, NO cutting
2. Maintain EXACT aspect ratio and composition
3. Professional quality, still authentic

FOR FACES/PORTRAITS:
- Remove all temporary imperfections (acne, blemishes, spots)
- Brighten and even out skin tone significantly
- Professional skin smoothing (keep subtle texture)
- Clear beauty enhancement (magazine-quality)
- Preserve unique features and personality
- Keep natural expressions and character

FOR ALL IMAGES:
- Maximum sharpness and clarity
- Vibrant, professional colors (still realistic)
- Professional noise reduction
- Enhance every detail

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT remove permanent features (moles, freckles, scars)
- DO NOT change facial structure
- DO NOT make it look like a different person

GOAL: Professional portrait photography - magazine-ready, polished, but still recognizably and authentically YOU.`
    };
    
    const prompt = prompts[beautyLevel] || prompts['subtle'];

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
    const r2Url = await uploadToR2(fullBase64, 'enhance');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        beautyLevel
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        beautyLevel
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Enhance error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
