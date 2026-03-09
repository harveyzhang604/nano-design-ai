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

async function uploadToR2(base64Data: string, prefix: string = 'sketch'): Promise<string | null> {
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
    const { imageUrl, realism = 'photorealistic' } = await req.json();
    
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
    
    // 草图转真实图片 - 2026-03-07 Week 4 优化：情感化、真实感
    const realismPrompts: Record<string, string> = {
      'photorealistic': `Transform this sketch into a PHOTOREALISTIC image - bring the drawing to LIFE.

PHILOSOPHY: Great transformations honor the artist's vision while adding reality.

PHOTOREALISTIC TRANSFORMATION:
- Analyze the sketch composition and intent
- Add realistic textures (skin, fabric, materials)
- Add proper lighting and shadows (natural, believable)
- Add realistic details (pores, wrinkles, fabric weave)
- Professional photograph quality
- Natural, believable result

PRESERVE SKETCH INTENT:
- Keep the composition exactly as sketched
- Maintain the pose and proportions
- Honor the artist's vision and style
- Keep the mood and feeling
- Respect the original concept

NATURAL REALISM:
- Realistic but not artificial
- Natural lighting and colors
- Believable textures
- Real-world quality
- Like a professional photo

GOAL: Like the sketch came to life - photorealistic, natural, honors the original vision.`,
      
      'artistic': `Transform this sketch into ARTISTIC realistic image - add life while keeping the ART.

PHILOSOPHY: Artistic realism balances reality with creative vision.

ARTISTIC TRANSFORMATION:
- Add colors, textures, and details
- Maintain artistic quality (not pure photo)
- Semi-realistic style (artistic yet believable)
- Creative interpretation
- Painterly or illustrative feel
- Beautiful, artistic result

PRESERVE SKETCH INTENT:
- Keep the composition and style
- Maintain the artistic vision
- Honor the creative intent
- Keep the mood and feeling
- Respect the original art

ARTISTIC BALANCE:
- Realistic enough to be believable
- Artistic enough to be beautiful
- Creative interpretation
- Not too photographic
- Artistic soul preserved

GOAL: Like an artistic illustration - realistic yet artistic, beautiful and believable.`,
      
      'hyperrealistic': `Transform this sketch into HYPERREALISTIC image - make it MORE real than real.

PHILOSOPHY: Hyperrealism is about perfect detail and clarity.

HYPERREALISTIC TRANSFORMATION:
- Ultra-detailed textures (every pore, every fiber)
- Perfect lighting (studio-quality, flawless)
- Maximum realism (indistinguishable from photo)
- Sharp, crystal-clear details
- Professional studio photography quality
- Flawless, perfect result

PRESERVE SKETCH INTENT:
- Keep the composition exactly
- Maintain the pose and proportions
- Honor the original vision
- Keep the concept intact
- Respect the artist's intent

MAXIMUM DETAIL:
- Every detail rendered perfectly
- Ultra-sharp and clear
- Perfect textures and materials
- Studio-quality lighting
- Flawless execution

GOAL: Like a high-end studio photograph - hyperrealistic, perfect, every detail crystal clear.`,
    };
    
    const prompt = realismPrompts[realism] || realismPrompts['photorealistic'];
    
    // 改进的 prompt - 即使输入不是草图也能处理
    const enhancedPrompt = `${prompt}

IMPORTANT: If this is NOT a sketch/drawing:
- Treat it as a reference image
- Apply artistic interpretation
- Add sketch-like qualities first, then transform
- Create a realistic version with enhanced details
- Make it look like a professional photograph

Work with ANY input image - sketch or photo.`;

    // 添加重试机制 - 最多重试 3 次
    let base64Data = null;
    let lastError = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: enhancedPrompt },
                { inlineData: { mimeType: "image/png", data: imageBase64.split(',')[1] } }
              ]
            }],
            generationConfig: {
              temperature: 0.5 + (attempt - 1) * 0.05,
              topK: 40,
              topP: 0.95
            }
          })
        });

        const data = await apiResponse.json();
        
        if (!apiResponse.ok) {
          lastError = data.error?.message || 'Gemini API Error';
          console.error(`Attempt ${attempt} - Gemini API error:`, data);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          return NextResponse.json({ error: lastError }, { status: apiResponse.status });
        }

        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: any) => p.inlineData);
        base64Data = imagePart?.inlineData?.data;
        
        if (base64Data) {
          break;
        }
        
        lastError = 'No image data returned from AI';
        console.error(`Attempt ${attempt} - No image data returned`);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (error: any) {
        lastError = error.message;
        console.error(`Attempt ${attempt} - Error:`, error);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: `Failed after 3 attempts: ${lastError}` 
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'sketch');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        realism
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        realism
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Sketch to image error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
