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

async function uploadToR2(base64Data: string, prefix: string = 'lego'): Promise<string | null> {
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
    const { imageUrl, style = 'classic', scene = 'studio' } = await req.json();

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

    // LEGO style variants
    const styleDescriptions: Record<string, string> = {
      'classic': 'Classic LEGO minifigure style — iconic yellow cylindrical head, trademark smile, simple dot eyes, C-clip hands, standard rectangular torso with printed design, short cylindrical legs. Clean, bright, cheerful.',
      'detailed': 'Highly detailed LEGO minifigure with custom printed torso design, hair/helmet piece, accessory elements, licensed-set quality. Premium collector edition feel with realistic ABS plastic sheen.',
      'movie': 'The LEGO Movie animation style — 3D rendered minifigure with dynamic pose, expressive face, cinematic lighting, slightly worn plastic texture for authenticity. Alive and personality-filled.',
      'duplo': 'LEGO DUPLO style — larger, rounder, toddler-friendly proportions. Bigger head, simplified features, bright primary colors, chunky hands. Cute and approachable.',
    };

    const sceneDescriptions: Record<string, string> = {
      'studio': 'Clean white studio background, professional product photography lighting, soft shadows beneath the figure.',
      'diorama': 'LEGO brick-built diorama background — colorful baseplate with simple architectural elements, true to the LEGO aesthetic.',
      'box': 'Official LEGO set box packaging — bright red/white/yellow box with LEGO logo, age rating, set name printed in bold typography, clear window showing the figure.',
      'shelf': 'Collector toy shelf display — surrounded by other LEGO sets, warm ambient light, realistic shelf environment.',
    };

    const chosenStyle = styleDescriptions[style] || styleDescriptions['classic'];
    const chosenScene = sceneDescriptions[scene] || sceneDescriptions['studio'];

    const prompt = `Transform the person in this photo into an authentic LEGO minifigure — one of the most viral AI image trends of 2026.

LEGO MINIFIGURE DESIGN:
${chosenStyle}

IDENTITY PRESERVATION (CRITICAL):
- The LEGO figure MUST be recognizable as the person in the input photo
- Translate their facial features into LEGO minifigure equivalents: hair color → hair piece color, eye color → dot eye color, skin tone → appropriate LEGO head color
- Recreate their outfit/clothing as a printed torso design with matching colors and patterns
- Preserve distinctive features: glasses become printed spectacles, beard becomes printed facial hair, hat becomes a hat piece
- Capture their personality and expression in the figure's simplified face

LEGO AUTHENTICITY:
- Strict LEGO aesthetic — no realistic human features, fully committed to the brick-toy style
- Characteristic plastic sheen and ABS material appearance
- Correct LEGO proportions: large head relative to body, short legs, rectangular torso
- Stud details visible on top of head and appropriate surfaces
- Color palette consistent with real LEGO sets (no gradients, flat areas of color)
- Printing quality matches official LEGO licensed sets

SCENE & PRESENTATION:
${chosenScene}

QUALITY STANDARD:
- 4K resolution output — collector photography quality
- Sharp focus on all minifigure details
- Professional lighting that shows the plastic material correctly
- Shareable, viral-ready image that would perform on TikTok and Instagram

GOAL: The most accurate, charming LEGO minifigure version of this person — instantly recognizable, authentically LEGO, ready to go viral on social media.`;

    let base64Data: string | null = null;
    let lastError = '';

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const apiResponse = await fetch(
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
                temperature: 0.7 + (attempt - 1) * 0.05,
                topK: 40,
                topP: 0.95,
              }
            })
          }
        );

        const data = await apiResponse.json();

        if (!apiResponse.ok) {
          lastError = data.error?.message || 'Gemini API Error';
          if (lastError.includes('location') || lastError.includes('region')) {
            return NextResponse.json({
              error: 'This feature is not available in your region.'
            }, { status: 403 });
          }
          if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
          continue;
        }

        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: any) => p.inlineData);
        base64Data = imagePart?.inlineData?.data;

        if (base64Data) break;

        lastError = 'No image data returned from AI';
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      } catch (error: any) {
        lastError = error.message;
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    if (!base64Data) {
      return NextResponse.json({
        error: `Failed after 3 attempts: ${lastError}`
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, 'lego');

    return NextResponse.json({
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      style,
      scene,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });

  } catch (error: any) {
    console.error('LEGO route error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
