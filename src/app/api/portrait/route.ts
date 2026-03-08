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

async function uploadToR2(base64Data: string, prefix: string = 'portrait'): Promise<string | null> {
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

// 构建prompt的辅助函数
function buildPrompt(beautyLevel: string, removeBlemishes: boolean, removeWrinkles: string): string {
  // 瑕疵处理指令
  let blemishInstruction = '';
  if (removeBlemishes) {
    blemishInstruction = `
CRITICAL: You MUST completely remove these skin imperfections:
- 雀斑 (freckles) - REMOVE COMPLETELY, no exceptions
- 痘印、痘痘 (acne marks, pimples) - remove completely
- 疤痕、伤痕 (scars, wounds) - smooth out
- 老年斑、晒斑 (age spots, sun spots) - remove completely
- 红血丝 (redness, broken capillaries) - remove
- 油光 (shiny/oily areas) - reduce
- 毛孔粗大 (large pores) - minimize

The skin should be CLEAN and SMOOTH with NO visible freckles or blemishes.`;
  } else {
    blemishInstruction = `
KEEP (保留以下自然特征):
- 雀斑 (freckles)
- 痣 (moles, beauty marks)
- 疤痕 (scars - if subtle)
- 自然皮肤纹理 (natural skin texture)`;
  }

  // 皱纹处理指令
  let wrinkleInstruction = '';
  if (removeWrinkles === 'remove') {
    wrinkleInstruction = `
REMOVE WRINKLES:
- 鱼尾纹 (crow's feet)
- 法令纹 (nasolabial folds)
- 眉间纹 (frown lines)
- 抬头纹 (forehead wrinkles)
- 颈纹 (neck wrinkles)
- 细纹 (fine lines)`;
  } else if (removeWrinkles === 'keep') {
    wrinkleInstruction = `
KEEP WRINKLES (保留皱纹):
- 鱼尾纹 (crow's feet - shows character)
- 法令纹 (nasolabial folds - smile lines)
- 皱纹是成熟的标志，保留自然表情`;
  } else {
    wrinkleInstruction = `
OPTIONAL WRINKLES:
- 轻轻淡化非常深的皱纹
- 保留自然表情和成熟气质`;
  }

  const prompts: Record<string, string> = {
    'natural': `Enhance this portrait with SUBTLE, natural beauty - keep it REAL and AUTHENTIC.

PHILOSOPHY: Real beauty has character. Don't erase personality.

${blemishInstruction}

${wrinkleInstruction}

GENTLE IMPROVEMENTS:
- Soften minor blemishes (keep natural skin texture visible)
- Very light, barely-there skin smoothing
- Subtle eye brightening (keep natural eye color and character)
- Preserve freckles, beauty marks, natural features
- Keep original skin tone and warmth
- Maintain natural expressions and emotions

FORBIDDEN:
- DO NOT over-smooth skin (plastic look)
- DO NOT change facial structure
- DO NOT remove character (wrinkles, smile lines are beautiful)
- DO NOT make it look "too perfect"

GOAL: Like a good quality photo on a good day - natural, real, YOU.`,
      
    'fresh': `Enhance this portrait with MODERATE, fresh improvements - polished but REAL.

PHILOSOPHY: Fresh and confident, not fake. Keep the soul.

${blemishInstruction}

${wrinkleInstruction}

BALANCED IMPROVEMENTS:
- Remove temporary blemishes (keep natural texture and character)
- Moderate skin smoothing with visible pores and texture
- Brighten eyes naturally (enhance, don't change)
- Even out skin tone gently (keep natural warmth)
- Light contouring for definition (subtle, not dramatic)
- Preserve personality, expressions, natural features

FORBIDDEN:
- DO NOT create artificial perfection
- DO NOT remove natural character (freckles, beauty marks)
- DO NOT change the person's essence
- DO NOT make it look heavily edited

GOAL: Fresh, polished, confident - but still authentically YOU. Like a great day, not a different person.`,
      
    'professional': `Enhance this portrait with CLEAR, professional quality - magazine-ready but AUTHENTIC.

PHILOSOPHY: Professional doesn't mean fake. Real people in professional photos.

${blemishInstruction}

${wrinkleInstruction}

PROFESSIONAL IMPROVEMENTS:
- Remove all temporary imperfections (acne, redness)
- Professional skin smoothing (keep subtle texture visible)
- Significantly brighten and enhance eyes (natural enhancement)
- Even out and slightly brighten skin tone (keep natural warmth)
- Define facial contours professionally (subtle, tasteful)
- Preserve unique features, expressions, personality

FORBIDDEN:
- DO NOT create unrealistic perfection
- DO NOT remove permanent features (moles, freckles, scars - they're part of you)
- DO NOT change facial structure or expressions
- DO NOT make it look like a different person

GOAL: Professional portrait photography quality - polished, confident, magazine-worthy, but still recognizably and authentically YOU. Real person, professional quality.`,
  };

  return prompts[beautyLevel] || prompts['fresh'];
}

export async function POST(req: Request) {
  try {
    const { imageUrl, beautyLevel = 'fresh', removeBlemishes = true, removeWrinkles = 'optional' } = await req.json();
    
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
    
    // 构建prompt
    const prompt = buildPrompt(beautyLevel, removeBlemishes, removeWrinkles);

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
    const r2Url = await uploadToR2(fullBase64, 'portrait');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'portrait'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'portrait'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Portrait enhance error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
