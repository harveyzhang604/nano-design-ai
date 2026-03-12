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

async function uploadToR2(base64Data: string, prefix: string = 'partial-redesign'): Promise<string | null> {
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
    const { 
      imageUrl, 
      target = 'sofa',
      style = 'modern',
      description = ''
    } = await req.json();
    
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
    
    // 局部改造目标描述
    const targetDescriptions: Record<string, string> = {
      'sofa': 'the sofa/couch only',
      'wall': 'the wall(s) only',
      'floor': 'the floor/flooring only',
      'curtains': 'the curtains/window treatments only',
      'lighting': 'the lighting fixtures only',
      'furniture': 'all furniture pieces',
      'decor': 'decorative items and accessories only'
    };
    
    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'modern': 'modern, contemporary style with clean lines and minimalist aesthetic',
      'scandinavian': 'Scandinavian style with light wood, white tones, and cozy textiles',
      'industrial': 'industrial style with metal, concrete, and urban loft aesthetic',
      'bohemian': 'bohemian style with colorful textiles, plants, and eclectic mix',
      'luxury': 'luxury style with premium materials, elegant details, and sophisticated look',
      'minimalist': 'minimalist style with ultra-clean, simple, and zen aesthetic',
      'traditional': 'traditional style with classic furniture and timeless elegance'
    };

    const customDesc = description ? `\nCustom requirement: ${description}` : '';

    const prompt = `Redesign ONLY ${targetDescriptions[target]} in this room - keep EVERYTHING ELSE exactly the same!

PARTIAL REDESIGN PHILOSOPHY: Surgical precision - change only what's specified, preserve everything else perfectly.

CRITICAL RULES - ABSOLUTE PRESERVATION:
1. ONLY redesign ${targetDescriptions[target]}
2. Keep ALL other elements EXACTLY the same:
   ${target !== 'sofa' ? '- Sofa/couch (same style, color, position)' : ''}
   ${target !== 'wall' ? '- Walls (same color, texture, decorations)' : ''}
   ${target !== 'floor' ? '- Floor (same material, color, pattern)' : ''}
   ${target !== 'curtains' ? '- Curtains/windows (same style, color)' : ''}
   ${target !== 'lighting' ? '- Lighting fixtures (same style, position)' : ''}
   ${target !== 'furniture' ? '- Other furniture (same pieces, positions)' : ''}
   ${target !== 'decor' ? '- Decorative items (same items, positions)' : ''}
3. Maintain room layout, dimensions, and perspective
4. Keep lighting and shadows consistent
5. Preserve the overall room character

REDESIGN TARGET (${target}):
- Apply ${styleDescriptions[style]}
- Make it look natural and integrated
- Match the room's lighting and atmosphere
- Seamless integration with existing elements
- Professional interior design quality${customDesc}

NATURAL INTEGRATION:
- New element fits perfectly with existing room
- Colors and materials harmonize
- Lighting matches the room
- Proportions and scale are correct
- Looks like it belongs there

FORBIDDEN:
- DO NOT change elements other than ${target}
- DO NOT alter room layout or dimensions
- DO NOT change lighting or atmosphere
- DO NOT make it look fake or composited

GOAL: Like a professional interior designer changed just one element - natural, harmonious, looks like it was always meant to be there.

Target to redesign: ${target}
Style: ${style}`;

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
            temperature: 0.4,
            topK: 32,
            topP: 0.9,
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
    
    if (!imagePart?.inlineData?.data) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageBase64 = imagePart.inlineData.data;
    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'partial-redesign');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl,
      target,
      style
    });

  } catch (error) {
    console.error('Partial redesign error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
