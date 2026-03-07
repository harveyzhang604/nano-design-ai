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

async function uploadToR2(base64Data: string, prefix: string = 'age'): Promise<string | null> {
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
    const { imageUrl, targetAge = 'older' } = await req.json();
    
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
    
    // 年龄变化 - 2026-03-07 Week 4 优化：情感化、真实感
    const agePrompts: Record<string, string> = {
      'younger': `Transform this person to look 10-15 years YOUNGER - but keep it REAL and BELIEVABLE.

PHILOSOPHY: Younger doesn't mean fake. Show how they might have looked, not a different person.

NATURAL AGING REVERSAL:
- Smoother, more elastic skin (but keep natural texture)
- Reduce fine lines and wrinkles naturally
- Brighter, more youthful eyes (keep their unique eye character)
- Fuller, more vibrant hair (keep their hair type and style)
- Slightly fuller face (natural youthful volume)
- More energetic, fresh appearance

PRESERVE IDENTITY:
- Keep facial structure EXACTLY the same
- Keep unique features (nose, eyes, mouth shape)
- Keep their essence and personality
- Keep natural skin tone and warmth

FORBIDDEN:
- DO NOT make them look like a different person
- DO NOT create artificial perfection
- DO NOT change their core identity

GOAL: How they might have looked 10-15 years ago - recognizable, real, believable.`,
      
      'older': `Transform this person to look 20-30 years OLDER - show GRACEFUL, REAL aging.

PHILOSOPHY: Aging is natural and beautiful. Show wisdom, character, life experience.

NATURAL AGING SIGNS:
- Natural wrinkles and laugh lines (signs of a life well-lived)
- Gray or white hair (dignified, natural)
- Slightly thinner face (natural aging)
- Deeper expression lines (character, not just wrinkles)
- Mature skin texture (real, not artificial)
- Wise, experienced eyes (keep their warmth)

PRESERVE IDENTITY:
- Keep facial structure EXACTLY the same
- Keep unique features and personality
- Keep their essence - just older
- Maintain natural warmth and humanity

FORBIDDEN:
- DO NOT make them look sick or unhealthy
- DO NOT exaggerate aging unnaturally
- DO NOT lose their identity

GOAL: Graceful, natural aging - how they might look in 20-30 years. Dignified, real, still THEM.`,
      
      'elderly': `Transform this person to look 50-60 years OLDER - show DIGNIFIED elderly appearance.

PHILOSOPHY: Elderly is beautiful. Show a life fully lived, wisdom, grace.

ELDERLY APPEARANCE:
- White or silver hair (distinguished, natural)
- Deep wrinkles and age lines (stories of laughter and life)
- Age spots and natural skin changes (real aging)
- Thinner face with defined bone structure
- Wise, kind eyes (keep their soul)
- Dignified, graceful elderly presence

PRESERVE IDENTITY:
- Keep facial structure recognizable
- Keep their unique features
- Keep their essence and warmth
- Show aging with dignity and grace

FORBIDDEN:
- DO NOT make them look frail or sick
- DO NOT lose their personality
- DO NOT make it depressing

GOAL: Dignified elderly version - wise, graceful, still recognizably THEM. Beautiful aging.`,
      
      'child': `Transform this person to look like a CHILD (8-12 years old) - but keep them RECOGNIZABLE.

PHILOSOPHY: Show their childhood self - innocent, playful, but still THEM.

CHILDLIKE FEATURES:
- Rounder, fuller face (natural child proportions)
- Smooth, clear skin (natural child skin)
- Bigger, more innocent eyes (keep their eye character)
- Smaller nose and features (child proportions)
- Playful, innocent expression
- Childlike energy and warmth

PRESERVE IDENTITY:
- Keep their unique facial features recognizable
- Keep their eye shape and character
- Keep their essence - just younger
- Make it believable as their childhood self

FORBIDDEN:
- DO NOT make them look like a random child
- DO NOT lose their identity completely
- DO NOT make it creepy or unnatural

GOAL: How they might have looked as a child - innocent, playful, but recognizably THEM.`,
    };
    
    const prompt = agePrompts[targetAge] || agePrompts['older'];

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
    const r2Url = await uploadToR2(fullBase64, 'age');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        targetAge
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        targetAge
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Age transformation error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
