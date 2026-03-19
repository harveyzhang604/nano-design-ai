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

async function uploadToR2(base64Data: string, prefix: string = 'ghibli'): Promise<string | null> {
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
    const { imageUrl, style = 'spirited-away', atmosphere = 'magical', detailLevel = 85, colorPalette = 'warm' } = await req.json();
    
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
    
    // Ghibli 作品风格特征
    const ghibliStyles: Record<string, string> = {
      'spirited-away': `WHIMSICAL SPIRIT-WORLD ANIMATION (千と千尋の神隠し) - Magical bathhouse and spirit world
VISUAL CHARACTERISTICS:
- Rich, detailed backgrounds with intricate architecture
- Warm, glowing lantern light and magical atmosphere
- Traditional Japanese elements mixed with fantasy
- Soft, dreamy lighting with warm color palette
- Detailed textures (wood, stone, fabric)
- Mysterious, enchanting mood
- Steam, mist, and atmospheric effects
- Red lanterns and traditional decorations`,

      'totoro': `PEACEFUL COUNTRYSIDE FANTASY ANIMATION (となりのトトロ) - Peaceful countryside and forest spirits
VISUAL CHARACTERISTICS:
- Lush, detailed nature and countryside
- Soft, warm sunlight filtering through trees
- Rich greens and earth tones
- Gentle, peaceful atmosphere
- Detailed foliage and natural elements
- Nostalgic, comforting mood
- Soft shadows and dappled light
- Rural Japanese landscape`,

      'howls-castle': `ROMANTIC EUROPEAN FANTASY ANIMATION (ハウルの動く城) - Romantic steampunk fantasy
VISUAL CHARACTERISTICS:
- Intricate mechanical and architectural details
- Romantic, dreamy atmosphere
- Soft, pastel color palette
- Victorian and steampunk elements
- Detailed interiors with warm lighting
- Magical, whimsical mood
- Soft focus and dreamy quality
- European-inspired fantasy settings`,

      'ponyo': `VIBRANT OCEAN FANTASY ANIMATION (崖の上のポニョ) - Vibrant ocean and coastal life
VISUAL CHARACTERISTICS:
- Bright, saturated colors
- Dynamic water and ocean effects
- Clear, vibrant lighting
- Energetic, joyful atmosphere
- Detailed coastal scenery
- Playful, childlike wonder
- Rich blues and warm tones
- Expressive, fluid animation style`,

      'mononoke': `EPIC FOREST SPIRIT ANIMATION (もののけ姫) - Epic nature and ancient spirits
VISUAL CHARACTERISTICS:
- Majestic, detailed forest landscapes
- Epic, dramatic lighting
- Rich, deep colors
- Ancient, mystical atmosphere
- Detailed natural textures
- Powerful, spiritual mood
- Dramatic shadows and highlights
- Primordial forest beauty`,

      'kiki': `CHARMING EUROPEAN TOWN FANTASY ANIMATION (魔女の宅急便) - Charming European town
VISUAL CHARACTERISTICS:
- Detailed European architecture
- Warm, sunny atmosphere
- Bright, cheerful colors
- Coastal town scenery
- Detailed urban landscapes
- Optimistic, uplifting mood
- Clear skies and warm light
- Charming, storybook quality`
    };

    // 氛围描述
    const atmosphereDescriptions: Record<string, string> = {
      'magical': 'mysterious, enchanting, with a sense of wonder and magic in the air',
      'peaceful': 'calm, serene, with gentle warmth and nostalgic comfort',
      'romantic': 'dreamy, soft, with tender emotion and whimsical beauty',
      'vibrant': 'energetic, bright, with joyful colors and dynamic life',
      'epic': 'majestic, powerful, with dramatic grandeur and spiritual depth'
    };

    // 细节程度
    const detailDescription = detailLevel >= 90 ? 'EXTREMELY detailed backgrounds with intricate textures and elements (Ghibli signature quality)' :
                              detailLevel >= 75 ? 'highly detailed backgrounds with rich textures and careful attention' :
                              'detailed backgrounds with good texture and depth';

    // 色彩风格
    const colorDescriptions: Record<string, string> = {
      'warm': 'warm, golden tones with soft yellows, oranges, and gentle reds',
      'cool': 'cool, serene tones with soft blues, greens, and purples',
      'vibrant': 'bright, saturated colors with high energy and clarity',
      'muted': 'soft, pastel tones with gentle, understated colors'
    };

    const prompt = `Transform this image into a Studio Ghibli-style hand-painted animation illustration with WATERCOLOR TEXTURE.

CRITICAL WATERCOLOR CHARACTERISTICS:
- Soft, flowing watercolor brush strokes with visible texture
- Gentle color bleeding and blending at edges
- Translucent layers with subtle color variations
- Paper texture visible through the paint
- Organic, hand-painted feel (NOT digital/smooth)
- Delicate color gradients with natural transitions
- Soft edges and dreamy atmosphere

GHIBLI VISUAL STYLE:
- Warm, nostalgic hand-painted animation aesthetic
- Detailed whimsical backgrounds with intricate elements
- Soft organic lines and gentle character features
- Atmospheric lighting with warm glows and soft shadows
- Cozy, magical mood with family-friendly appeal
- Rich environmental details (nature, architecture, objects)

COLOR PALETTE: ${colorDescriptions[colorPalette]}
ATMOSPHERE: ${atmosphereDescriptions[atmosphere]}

COMPOSITION RULES:
- Preserve the original subject and their pose/expression
- Keep the emotional tone and mood of the original
- Maintain the overall composition and framing
- Add Ghibli-style background details and atmosphere

TEXTURE EMPHASIS:
- Use visible watercolor brush strokes
- Show paint texture and paper grain
- Create soft, organic edges (not sharp digital lines)
- Layer translucent colors for depth
- Add subtle color variations within each area

STYLE: Painterly, cinematic, hand-crafted watercolor animation illustration.
GOAL: Warm Ghibli magic with authentic watercolor texture.`;

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
            temperature: 0.55,
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
    
    if (!(() => { const parts = data.candidates?.[0]?.content?.parts || []; const imagePart = parts.find((p: any) => p.inlineData); return imagePart?.inlineData?.data; })()) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const generatedImageBase64 = imagePart?.inlineData?.data;
    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'ghibli');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Ghibli style error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
