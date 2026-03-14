import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

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

async function uploadToR2(base64Data: string, prefix: string = 'realestate'): Promise<string | null> {
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
    const { imageUrl, style = 'modern' } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);
    
    const prompt = `Transform this interior photo into a professional REAL ESTATE RENDERING.

PRESERVE EXACTLY:
- Room layout and architecture
- Window and door positions
- Overall space dimensions
- Structural elements

REAL ESTATE ENHANCEMENT:
- Enhanced lighting and brightness
- Modern, stylish furniture arrangement
- Professional interior design aesthetic
- Clean, organized space
- Warm, inviting atmosphere
- High-quality photography feel
- Unified color scheme
- Natural light enhancement
- Professional staging quality

FORBIDDEN:
- Do NOT change room structure or layout
- Do NOT add unrealistic elements
- Do NOT over-process or make it look fake

GOAL: Professional real estate photography with enhanced appeal and modern interior design.`;

    // 重试机制 - 最多3次
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
                { text: prompt },
                { inlineData: { mimeType: "image/png", data: imageBase64.split(',')[1] } }
              ]
            }],
            generationConfig: {
              temperature: 0.6 + (attempt - 1) * 0.05,
              topK: 40,
              topP: 0.95
            }
          })
        });

        const data = await apiResponse.json();
        
        if (!apiResponse.ok) {
          lastError = data.error?.message || 'Gemini API Error';
          console.error(`Attempt ${attempt} - Gemini API error:`, data);
          
          if (lastError.includes('location') || lastError.includes('region')) {
            return NextResponse.json({ 
              error: 'This feature is not available in your region.' 
            }, { status: 403 });
          }
          
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
      } catch (error) {
        lastError = (error as Error).message;
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
      }
    }

    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const imageUrl_result = await uploadToR2(fullBase64, 'realestate');
    
    if (!imageUrl_result) {
      console.warn('R2 upload failed, returning base64 data');
      return NextResponse.json({ imageUrl: fullBase64, isR2: false });
    }

    return NextResponse.json({ imageUrl: imageUrl_result, isR2: true });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// OLD CODE BELOW - REMOVE
if (false) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: imageUrl_result });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
