import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'authenticity'): Promise<string | null> {
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
    const { imageUrl, authenticity = 50, task = 'enhance' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);
    
    // 根据真实感等级生成 prompt
    // 0-30: 高度真实（保留瑕疵、颗粒、自然光）
    // 31-70: 平衡（轻微优化，保持自然）
    // 71-100: 完美化（专业摄影级别）
    
    let prompt = '';
    let temperature = 0.4;
    let topP = 0.9;
    
    if (authenticity <= 30) {
      // 高度真实
      prompt = `Process this photo with MAXIMUM AUTHENTICITY and natural imperfections.

PRESERVE NATURAL CHARACTERISTICS:
- Keep film grain, noise, and texture
- Preserve natural skin texture, pores, fine lines
- Keep natural lighting imperfections (lens flare, light leaks)
- Maintain candid, unposed feeling
- Preserve authentic colors (no oversaturation)
- Keep slight blur or motion if present

MINIMAL PROCESSING:
- Only fix obvious technical flaws (severe noise, color cast)
- Keep the "real moment" feeling
- Avoid any "Instagram filter" look
- No skin smoothing or beautification

GOAL: Make it look like a real, authentic photo taken by a human, not AI-generated perfection.
Task: ${task}`;
      temperature = 0.6;
      topP = 0.95;
      
    } else if (authenticity <= 70) {
      // 平衡模式
      prompt = `Process this photo with BALANCED approach - natural yet polished.

PRESERVE AUTHENTICITY:
- Keep natural skin texture (reduce smoothing)
- Maintain realistic lighting and shadows
- Preserve genuine expressions and emotions
- Keep natural colors (avoid oversaturation)

GENTLE ENHANCEMENTS:
- Improve clarity and sharpness moderately
- Balance exposure and contrast
- Reduce obvious noise while keeping texture
- Enhance colors naturally (not artificially vibrant)

AVOID:
- Over-smoothing skin
- Artificial "perfect" look
- Oversaturated colors
- Fake HDR effect

GOAL: Professional quality that still feels authentic and real.
Task: ${task}`;
      temperature = 0.4;
      topP = 0.9;
      
    } else {
      // 完美化模式
      prompt = `Process this photo with PROFESSIONAL PERFECTION approach.

MAXIMUM QUALITY:
- Crystal clear sharpness and detail
- Perfect exposure and lighting
- Vibrant, rich colors
- Smooth, polished look
- Professional photography quality

ENHANCEMENTS:
- Optimize skin texture (smooth but not fake)
- Perfect lighting and shadows
- Enhanced colors and contrast
- Remove minor imperfections
- Magazine-quality finish

MAINTAIN:
- Natural facial expressions
- Realistic proportions
- Authentic composition

GOAL: Professional, polished, high-end photography quality.
Task: ${task}`;
      temperature = 0.3;
      topP = 0.85;
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
          temperature,
          topK: authenticity <= 30 ? 40 : (authenticity <= 70 ? 30 : 20),
          topP
        }
      })
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, 'authenticity');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'authenticity',
        level: authenticity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'authenticity',
        level: authenticity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Authenticity error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
