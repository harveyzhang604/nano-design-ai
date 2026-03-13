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

async function uploadToR2(base64Data: string, prefix: string = 'claymation'): Promise<string | null> {
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
    const { imageUrl, style = 'classic', texture = 'matte', lighting = 'soft', detailLevel = 80 } = await req.json();
    
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
    
    // 黏土动画风格特征
    const claymationStyles: Record<string, string> = {
      'classic': `CLASSIC AARDMAN CLAYMATION (Wallace & Gromit style)
- Iconic British stop-motion clay animation aesthetic
- Chunky, handcrafted clay figures with visible fingerprints
- Exaggerated facial features (big eyes, wide mouths, prominent teeth)
- Warm, cozy domestic settings with detailed miniature props
- Soft, diffused studio lighting with gentle shadows
- Matte clay texture with slight imperfections
- Charming, whimsical character design
- Nostalgic, comforting atmosphere`,

      'modern': `MODERN AARDMAN CLAYMATION (Shaun the Sheep style)
- Contemporary smooth clay animation style
- Simplified, cute character designs with minimal details
- Bright, cheerful color palette
- Clean, polished clay surfaces with subtle texture
- Clear, even lighting with soft shadows
- Playful, energetic atmosphere
- Rounded, friendly shapes
- Fresh, optimistic mood`,

      'coraline': `DARK GOTHIC CLAYMATION (Coraline/Laika style)
- Intricate, detailed stop-motion puppet animation
- Gothic, slightly eerie atmosphere with rich textures
- Dramatic lighting with strong shadows and highlights
- Highly detailed facial features and costumes
- Darker, moodier color palette
- Cinematic composition and depth
- Mysterious, enchanting mood
- Fine craftsmanship with visible texture details`,

      'chicken-run': `COMEDIC CLAYMATION (Chicken Run style)
- Expressive, humorous character animation
- Dynamic poses and exaggerated expressions
- Natural outdoor lighting with warm tones
- Detailed miniature sets with realistic textures
- Matte clay finish with handcrafted feel
- Action-oriented, energetic composition
- Witty, adventurous atmosphere
- British countryside aesthetic`,

      'kubo': `ARTISAN CLAYMATION (Kubo and the Two Strings style)
- Exquisite handcrafted stop-motion artistry
- Highly detailed textures and intricate costumes
- Cinematic lighting with dramatic atmosphere
- Rich, saturated colors with artistic composition
- Japanese-inspired aesthetic elements
- Epic, mythological mood
- Fine detail in every element
- Painterly, storybook quality`
    };

    // 材质描述
    const textureDescriptions: Record<string, string> = {
      'matte': 'matte clay surface with soft, non-reflective finish and visible fingerprint textures',
      'smooth': 'smooth, polished clay with clean surfaces and minimal texture',
      'detailed': 'highly detailed clay with visible sculpting marks, fingerprints, and handcrafted imperfections',
      'rough': 'rough, handmade clay with prominent texture, tool marks, and artisan craftsmanship'
    };

    // 光照描述
    const lightingDescriptions: Record<string, string> = {
      'soft': 'soft, diffused studio lighting with gentle shadows and warm ambiance',
      'bright': 'bright, even lighting with clear visibility and cheerful atmosphere',
      'dramatic': 'dramatic lighting with strong contrasts, deep shadows, and cinematic mood',
      'natural': 'natural daylight with realistic shadows and outdoor ambiance',
      'cinematic': 'cinematic lighting with artistic composition, depth, and atmospheric effects'
    };

    // 细节程度
    const detailDescription = detailLevel >= 90 ? 'EXTREMELY detailed with intricate sculpting marks, fingerprints, and handcrafted imperfections' :
                              detailLevel >= 75 ? 'highly detailed with visible clay texture and craftsmanship' :
                              'good detail level with clear clay characteristics';

    const prompt = `Transform this image into a stop-motion claymation animation style.

CLAYMATION STYLE: ${claymationStyles[style]}

CRITICAL CLAY CHARACTERISTICS:
- Handcrafted clay/plasticine material appearance
- Visible sculpting texture and fingerprint marks
- Slightly chunky, three-dimensional forms
- Stop-motion animation aesthetic
- Miniature set and prop feeling
- Tactile, physical material quality

TEXTURE: ${textureDescriptions[texture]}
LIGHTING: ${lightingDescriptions[lighting]}
DETAIL LEVEL: ${detailDescription}

COMPOSITION RULES:
- Preserve the original subject and their pose/expression
- Keep the emotional tone and mood
- Maintain overall composition and framing
- Add claymation-style background and environment

MATERIAL EMPHASIS:
- Show clay/plasticine material properties
- Include subtle imperfections and handmade quality
- Add slight texture variations across surfaces
- Create depth with layered clay elements
- Show the physical, tactile nature of stop-motion

STYLE: Stop-motion claymation animation with handcrafted charm.
GOAL: Authentic clay animation aesthetic with visible craftsmanship.`;

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
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
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
    const r2Url = await uploadToR2(generatedImageDataUrl, 'claymation');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Claymation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
