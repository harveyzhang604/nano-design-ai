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

async function uploadToR2(base64Data: string, prefix: string = 'outfit'): Promise<string | null> {
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
    const { imageUrl, outfitStyle = 'casual', gender = 'auto' } = await req.json();
    
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
    
    // 根据服装风格生成不同的 prompt
    const outfitPrompts: Record<string, string> = {
      'casual': `Change this person's outfit to stylish casual wear.
PRESERVE EXACTLY:
- Face, facial features, and expressions
- Body proportions and pose
- Background and environment
- Person's identity and characteristics

OUTFIT CHANGE - CASUAL STYLE:
- Modern casual clothing (jeans, t-shirt, sneakers, etc.)
- Comfortable and relaxed style
- Age-appropriate and season-appropriate
- Natural fit and draping
- Realistic fabric textures
- Proper clothing physics (wrinkles, folds)

REQUIREMENTS:
- Seamless integration with body
- Natural lighting and shadows on clothes
- Maintain original pose and body position
- Keep background unchanged
- Professional photo quality

FORBIDDEN:
- Do NOT change face or body shape
- Do NOT alter the pose
- Do NOT change the background
- Do NOT make it look artificial

GOAL: Natural outfit change - like the person wore these clothes originally.`,

      'formal': `Change this person's outfit to elegant formal wear.
PRESERVE EXACTLY:
- Face, facial features, and expressions
- Body proportions and pose
- Background and environment
- Person's identity

OUTFIT CHANGE - FORMAL STYLE:
- Professional business attire or elegant evening wear
- Suit, dress shirt, tie (for men) or elegant dress/suit (for women)
- High-quality fabrics (wool, silk, satin)
- Sophisticated and polished look
- Proper fit and tailoring
- Realistic fabric textures and sheen

REQUIREMENTS:
- Seamless integration with body
- Natural lighting and shadows
- Maintain original pose
- Keep background unchanged
- Professional photo quality

FORBIDDEN:
- Do NOT change face or body
- Do NOT alter the pose
- Do NOT change the background

GOAL: Elegant formal outfit - professional and sophisticated.`,

      'sporty': `Change this person's outfit to athletic sportswear.
PRESERVE EXACTLY:
- Face, facial features, and expressions
- Body proportions and pose
- Background and environment
- Person's identity

OUTFIT CHANGE - SPORTY STYLE:
- Athletic wear (sports jersey, track pants, running shoes, etc.)
- Performance fabrics (breathable, stretchy)
- Active and energetic style
- Proper fit for movement
- Realistic athletic wear textures
- Sport-appropriate accessories

REQUIREMENTS:
- Seamless integration with body
- Natural lighting and shadows
- Maintain original pose
- Keep background unchanged
- Professional photo quality

FORBIDDEN:
- Do NOT change face or body
- Do NOT alter the pose
- Do NOT change the background

GOAL: Athletic outfit - ready for sports and fitness.`,

      'trendy': `Change this person's outfit to cutting-edge trendy fashion.
PRESERVE EXACTLY:
- Face, facial features, and expressions
- Body proportions and pose
- Background and environment
- Person's identity

OUTFIT CHANGE - TRENDY STYLE:
- Latest fashion trends (streetwear, designer pieces)
- Bold colors and patterns
- Fashion-forward accessories
- Modern and stylish
- High-quality fabrics
- Instagram-worthy look

REQUIREMENTS:
- Seamless integration with body
- Natural lighting and shadows
- Maintain original pose
- Keep background unchanged
- Professional photo quality

FORBIDDEN:
- Do NOT change face or body
- Do NOT alter the pose
- Do NOT change the background

GOAL: Trendy fashion outfit - modern and stylish.`,

      'vintage': `Change this person's outfit to classic vintage style.
PRESERVE EXACTLY:
- Face, facial features, and expressions
- Body proportions and pose
- Background and environment
- Person's identity

OUTFIT CHANGE - VINTAGE STYLE:
- Classic retro clothing (50s-80s inspired)
- Timeless silhouettes and patterns
- Vintage fabrics and textures
- Nostalgic and elegant
- Period-appropriate accessories
- Classic color palettes

REQUIREMENTS:
- Seamless integration with body
- Natural lighting and shadows
- Maintain original pose
- Keep background unchanged
- Professional photo quality

FORBIDDEN:
- Do NOT change face or body
- Do NOT alter the pose
- Do NOT change the background

GOAL: Vintage outfit - timeless and classic.`
    };
    
    const prompt = outfitPrompts[outfitStyle] || outfitPrompts['casual'];

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`,
      {
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
            topK: 32,
            topP: 0.9
          }
        })
      }
    );

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ 
        error: data.error?.message || 'Gemini API Error' 
      }, { status: apiResponse.status });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: 'No image data returned from AI.' 
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, `outfit-${outfitStyle}`);
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'outfit-change',
        style: outfitStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'outfit-change',
        style: outfitStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Outfit change error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
