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

async function uploadToR2(base64Data: string, prefix: string = 'pixel-art'): Promise<string | null> {
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
    const { imageUrl, resolution = '16bit', palette = 'snes', style = 'classic', dithering = 50, outline = 'medium' } = await req.json();
    
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
    
    // 分辨率描述
    const resolutionDescriptions: Record<string, string> = {
      '8bit': 'LOW RESOLUTION 8-bit pixel art (32x32 to 64x64 pixel grid) with chunky, blocky pixels and simple shapes',
      '16bit': 'MEDIUM RESOLUTION 16-bit pixel art (64x64 to 128x128 pixel grid) with clear pixel definition and moderate detail',
      '32bit': 'HIGH RESOLUTION 32-bit pixel art (128x128 to 256x256 pixel grid) with fine pixel details and smooth gradients',
      'hd': 'ULTRA HIGH RESOLUTION modern pixel art (256x256+ pixel grid) with intricate details and smooth transitions'
    };

    // 调色板描述
    const paletteDescriptions: Record<string, string> = {
      'nes': 'LIMITED NES COLOR PALETTE (54 colors) with bold, saturated primary colors and high contrast',
      'gameboy': 'GAME BOY 4-COLOR PALETTE (4 shades of green: dark green, medium green, light green, pale green)',
      'snes': 'SNES COLOR PALETTE (256 colors) with rich, vibrant colors and smooth gradients',
      'rich': 'RICH COLOR PALETTE (512 colors) with subtle color variations and detailed shading',
      'modern': 'MODERN FULL COLOR PALETTE with unlimited colors and smooth color transitions'
    };

    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'retro': 'RETRO ROUGH STYLE with chunky pixels, limited colors, and nostalgic 1980s video game aesthetic',
      'classic': 'CLASSIC PIXEL ART STYLE with clean pixels, clear shapes, and 1990s golden age video game look',
      'detailed': 'DETAILED PIXEL ART STYLE with intricate pixel work, fine details, and modern indie game quality',
      'smooth': 'SMOOTH MODERN STYLE with anti-aliased edges, gradient shading, and contemporary pixel art polish',
      'monochrome': 'MONOCHROME RETRO STYLE with limited color palette and classic handheld game aesthetic'
    };

    // 抖动描述
    const ditheringLevel = dithering >= 75 ? 'HEAVY dithering with prominent checkerboard patterns for color mixing' :
                          dithering >= 50 ? 'MODERATE dithering with visible pixel patterns for smooth gradients' :
                          dithering >= 25 ? 'LIGHT dithering with subtle pixel mixing' :
                          'MINIMAL or NO dithering with solid color blocks';

    // 轮廓线描述
    const outlineDescriptions: Record<string, string> = {
      'none': 'NO outlines, colors blend directly',
      'thin': 'THIN 1-pixel black outlines around shapes',
      'medium': 'MEDIUM 1-2 pixel dark outlines for clear definition',
      'thick': 'THICK 2-3 pixel bold outlines for strong contrast'
    };

    const prompt = `Transform this image into pixel art with retro video game aesthetic.

PIXEL ART SPECIFICATIONS:
${resolutionDescriptions[resolution]}
${paletteDescriptions[palette]}
${styleDescriptions[style]}

CRITICAL PIXEL ART CHARACTERISTICS:
- Visible individual square pixels in a grid pattern
- Hard edges with no anti-aliasing (unless modern style)
- Limited color palette with strategic color choices
- Pixel-perfect alignment and clean pixel placement
- Retro video game sprite aesthetic
- Blocky, geometric simplification of forms

DITHERING: ${ditheringLevel}
OUTLINES: ${outlineDescriptions[outline]}

TECHNICAL REQUIREMENTS:
- Each pixel must be clearly visible and distinct
- Colors must be limited to the specified palette
- Shapes simplified to work within pixel constraints
- Strategic use of dithering for gradients and textures
- Clean, crisp pixel edges (no blurring)
- Maintain recognizable subject while embracing pixel limitations

COMPOSITION:
- Preserve the main subject and pose
- Simplify details to work with pixel resolution
- Use pixel art techniques (dithering, limited colors, outlines)
- Create nostalgic retro gaming aesthetic

STYLE: Authentic pixel art with visible pixel grid and retro gaming charm.
GOAL: True pixel art aesthetic with clear individual pixels and limited color palette.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 32,
            topP: 0.85,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ 
        error: `Gemini API error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const generatedImageBase64 = imagePart?.inlineData?.data;
    
    if (!generatedImageBase64) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    const r2Url = await uploadToR2(generatedImageDataUrl, 'pixel-art');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Pixel art error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
