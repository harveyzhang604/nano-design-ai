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

async function uploadToR2(base64Data: string, prefix: string = 'yearbook'): Promise<string | null> {
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
    const { imageUrl, decade = '90s', gender = 'auto' } = await req.json();
    
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
    
    // 年代风格映射
    const decadePrompts: Record<string, string> = {
      '60s': `Transform this photo into an authentic 1960s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Classic 1960s school photography aesthetic
- Black and white or slightly sepia-toned
- Studio lighting with simple backdrop
- Film grain typical of 60s photos
- Professional yearbook portrait composition

STYLING (1960s):
- 60s hairstyles: bouffant, beehive, clean-cut, or Beatles-inspired
- Natural makeup (if applicable): subtle, classic
- 60s fashion: Peter Pan collars, cardigans, clean-cut preppy
- Accessories: pearls, simple jewelry, classic frames
- Genuine smile, formal yearbook pose

TECHNICAL:
- Black and white or sepia tone
- Film photography quality
- Authentic 1960s yearbook aesthetic
- Classic, timeless feel

IMPORTANT: Make it look like a real 1960s yearbook photo!`,
      
      '70s': `Transform this photo into an authentic 1970s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Classic 1970s school photography aesthetic
- Warm, slightly orange-tinted colors
- Studio lighting with simple backdrop
- Film grain and color shift typical of 70s photos
- Professional yearbook portrait composition

STYLING (1970s):
- 70s hairstyles: long, flowing hair, afros, or feathered styles
- Natural makeup (if applicable): earthy tones
- 70s fashion: wide collars, earth tones, patterns
- Accessories: headbands, natural jewelry
- Genuine smile, classic yearbook pose

TECHNICAL:
- Warm, faded colors (aged photo feel)
- Film photography quality
- Authentic 1970s yearbook aesthetic
- Retro nostalgia

IMPORTANT: Make it look like a real 1970s yearbook photo!`,
      
      '80s': `Transform this photo into an authentic 1980s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Classic 1980s school photography aesthetic
- Soft focus with slight vignette
- Studio lighting with blue/gray backdrop
- Film grain and slight color shift typical of 80s photos
- Professional yearbook portrait composition

STYLING (1980s):
- Big, voluminous hair (teased, permed, or feathered)
- Bold makeup (if applicable): bright eyeshadow, strong blush
- 80s fashion: preppy collars, bold patterns, shoulder pads
- Accessories: large glasses, statement jewelry
- Natural smile, classic yearbook pose

TECHNICAL:
- Slightly faded colors (aged photo feel)
- Soft edges and gentle lighting
- Film photography quality
- Authentic 1980s yearbook aesthetic

IMPORTANT: Make it look like a real 1980s yearbook photo!`,
      
      '90s': `Transform this photo into an authentic 1990s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Classic 1990s school photography aesthetic
- Slightly sharper than 80s but still soft
- Studio lighting with neutral or cloudy backdrop
- Film grain typical of 90s photos
- Professional yearbook portrait composition

STYLING (1990s):
- 90s hairstyles: straight hair, curtain bangs, or grunge styles
- Natural makeup (if applicable): brown tones, minimal look
- 90s fashion: denim, flannel, simple collars, casual preppy
- Accessories: small hoop earrings, chokers, minimal jewelry
- Genuine smile, relaxed yearbook pose

TECHNICAL:
- Slightly faded colors (aged photo feel)
- Film photography quality
- Authentic 1990s yearbook aesthetic
- Nostalgic feel

IMPORTANT: Make it look like a real 1990s yearbook photo!`,
      
      '00s': `Transform this photo into an authentic 2000s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Early digital camera aesthetic (slightly over-processed)
- Brighter, more saturated colors than 90s
- Studio lighting with modern backdrop
- Digital photo quality (not film)
- Professional yearbook portrait composition

STYLING (2000s):
- 2000s hairstyles: straightened hair, chunky highlights, spiky styles
- Makeup (if applicable): glossy lips, shimmery eyeshadow
- 2000s fashion: popped collars, layered looks, graphic tees
- Accessories: chunky jewelry, colorful accessories
- Confident smile, modern yearbook pose

TECHNICAL:
- Bright, saturated colors
- Digital camera quality
- Authentic 2000s yearbook aesthetic
- Y2K nostalgia feel

IMPORTANT: Make it look like a real 2000s yearbook photo!`,
      
      '10s': `Transform this photo into an authentic 2010s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Modern high-resolution digital photography
- Sharp, clear focus with professional quality
- Professional studio lighting (soft, even)
- Clean, modern backdrop (gray, blue, or gradient)
- Contemporary yearbook portrait composition

STYLING (2010s):
- 2010s hairstyles: natural waves, ombre, side-swept, modern cuts
- Makeup (if applicable): natural contour, Instagram-inspired, defined brows
- 2010s fashion: casual modern, simple tops, minimal accessories
- Accessories: minimal jewelry, modern glasses, natural look
- Natural, confident smile, relaxed modern pose

TECHNICAL:
- High-resolution digital quality
- Natural, accurate colors
- Modern photography aesthetic
- Contemporary, social media influenced

IMPORTANT: Make it look like a real 2010s yearbook photo!`,
      
      '70s': `Transform this photo into an authentic 1970s HIGH SCHOOL YEARBOOK portrait.

PHOTOGRAPHY STYLE:
- Classic 1970s school photography aesthetic
- Warm, slightly orange-tinted colors
- Studio lighting with simple backdrop
- Film grain and color shift typical of 70s photos
- Professional yearbook portrait composition

STYLING (1970s):
- 70s hairstyles: long, flowing hair, afros, or feathered styles
- Natural makeup (if applicable): earthy tones
- 70s fashion: wide collars, earth tones, patterns
- Accessories: headbands, natural jewelry
- Genuine smile, classic yearbook pose

TECHNICAL:
- Warm, faded colors (aged photo feel)
- Film photography quality
- Authentic 1970s yearbook aesthetic
- Retro nostalgia

IMPORTANT: Make it look like a real 1970s yearbook photo!`,
    };
    
    const prompt = decadePrompts[decade] || decadePrompts['90s'];

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
    const r2Url = await uploadToR2(fullBase64, 'yearbook');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'yearbook'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'yearbook'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Yearbook error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
