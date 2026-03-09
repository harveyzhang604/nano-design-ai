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

async function uploadToR2(base64Data: string, prefix: string = 'object-remove'): Promise<string | null> {
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
    const { imageUrl, objectDescription, fillMode = 'intelligent' } = await req.json();
    
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
    
    // 根据填充模式生成不同的 prompt
    const fillPrompts: Record<string, string> = {
      'intelligent': `Remove unwanted objects from this image with INTELLIGENT CONTENT-AWARE FILL.

OBJECT TO REMOVE:
${objectDescription ? `- Target: ${objectDescription}` : '- Identify and remove the most obvious unwanted object (people in background, trash, wires, signs, etc.)'}

INTELLIGENT FILL STRATEGY:
1. **Analyze Context**: Understand the surrounding environment
2. **Smart Reconstruction**: Fill with contextually appropriate content
3. **Seamless Blending**: Perfect edge feathering and color matching
4. **Texture Synthesis**: Generate realistic textures that match surroundings
5. **Lighting Consistency**: Match lighting, shadows, and highlights
6. **Perspective Preservation**: Maintain correct perspective and depth

QUALITY REQUIREMENTS:
- Invisible removal - no traces of the original object
- Natural-looking fill - like the object was never there
- Smooth transitions - feathered edges, no hard boundaries
- Texture continuity - patterns and textures flow naturally
- Color harmony - perfect color matching with surroundings
- Detail preservation - maintain image quality and sharpness

FORBIDDEN:
- Do NOT leave visible seams or boundaries
- Do NOT create unnatural patterns or artifacts
- Do NOT blur or soften the entire area
- Do NOT change other parts of the image
- Do NOT make it obvious something was removed

GOAL: Professional object removal - completely invisible and natural.`,

      'blur': `Remove unwanted objects from this image with NATURAL BLUR FILL.

OBJECT TO REMOVE:
${objectDescription ? `- Target: ${objectDescription}` : '- Identify and remove the most obvious unwanted object'}

BLUR FILL STRATEGY:
- Remove the object completely
- Fill with natural background blur (bokeh effect)
- Smooth, gradual blur that matches depth of field
- Maintain lighting and color tone
- Feathered edges for seamless blending

QUALITY REQUIREMENTS:
- Natural bokeh effect
- Smooth transitions
- No visible seams
- Maintains photo's depth of field

GOAL: Clean removal with natural background blur.`,

      'clone': `Remove unwanted objects from this image with CLONE STAMP FILL.

OBJECT TO REMOVE:
${objectDescription ? `- Target: ${objectDescription}` : '- Identify and remove the most obvious unwanted object'}

CLONE FILL STRATEGY:
- Remove the object completely
- Clone nearby similar textures and patterns
- Replicate surrounding environment
- Perfect texture matching
- Seamless blending

QUALITY REQUIREMENTS:
- Exact texture replication
- Pattern continuity
- Color matching
- No visible repetition
- Natural appearance

GOAL: Invisible removal using cloned surrounding content.`,

      'extend': `Remove unwanted objects from this image with BACKGROUND EXTENSION.

OBJECT TO REMOVE:
${objectDescription ? `- Target: ${objectDescription}` : '- Identify and remove the most obvious unwanted object'}

EXTENSION STRATEGY:
- Remove the object completely
- Extend the background naturally
- Continue patterns, textures, and structures
- Maintain perspective and depth
- Seamless integration

QUALITY REQUIREMENTS:
- Natural background continuation
- Perspective consistency
- Texture flow
- Lighting harmony
- Invisible seams

GOAL: Remove object by naturally extending the background.`
    };
    
    const prompt = fillPrompts[fillMode] || fillPrompts['intelligent'];

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
            temperature: 0.3,
            topK: 32,
            topP: 0.85
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
    const r2Url = await uploadToR2(fullBase64, `object-remove-${fillMode}`);
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'object-remove',
        fillMode
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'object-remove',
        fillMode
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Object remove error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
