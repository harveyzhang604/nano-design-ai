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

    const prompt = `PARTIAL REDESIGN: Modify ONLY ${targetDescriptions[target]} - keep EVERYTHING ELSE IDENTICAL to the original photo!

🚨 CRITICAL: This is NOT a full room redesign - it's a SURGICAL MODIFICATION 🚨

ABSOLUTE PRESERVATION RULES:
1. The output must look 99% identical to the input photo
2. ONLY ${targetDescriptions[target]} should look different
3. Everything else must be PIXEL-PERFECT identical:
   - Same room layout and dimensions
   - Same camera angle and perspective
   - Same lighting and shadows
   - Same colors for unchanged elements
   - Same textures for unchanged elements
   - Same positions for all other items

WHAT TO KEEP EXACTLY THE SAME:
${target !== 'sofa' ? '- Sofa/couch: EXACT same style, color, fabric, position, angle' : ''}
${target !== 'wall' ? '- Walls: EXACT same color, texture, artwork, decorations' : ''}
${target !== 'floor' ? '- Floor: EXACT same material, color, pattern, finish' : ''}
${target !== 'curtains' ? '- Curtains/windows: EXACT same style, color, fabric, position' : ''}
${target !== 'lighting' ? '- Lighting: EXACT same fixtures, style, position, brightness' : ''}
${target !== 'furniture' ? '- Other furniture: EXACT same pieces, styles, positions' : ''}
${target !== 'decor' ? '- Decor items: EXACT same items, positions, colors' : ''}

WHAT TO REDESIGN (${target} ONLY):
- Apply ${styleDescriptions[style]}
- Make it blend naturally with the unchanged elements
- Match the room's existing lighting
- Keep proportions and scale appropriate
- Professional quality${customDesc}

TECHNICAL REQUIREMENTS:
- Maintain original photo's resolution and quality
- Keep the same perspective and camera angle
- Preserve original lighting conditions
- Match color temperature of original photo
- Seamless integration (no visible editing)

FORBIDDEN:
- DO NOT redesign the entire room
- DO NOT change camera angle or perspective
- DO NOT alter lighting or atmosphere
- DO NOT change any element except ${target}
- DO NOT make it look AI-generated or fake

GOAL: The result should look like someone physically replaced ONLY ${target} in the real room - everything else stays exactly the same.

IMPORTANT FAILURE MODE TO AVOID:
- Do NOT regenerate the whole room from scratch
- Do NOT turn people into furniture or furniture into people
- Do NOT merge unrelated objects together
- If the image is not clearly a room/interior scene, preserve it and make only the smallest plausible change

Target: ${target}
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
