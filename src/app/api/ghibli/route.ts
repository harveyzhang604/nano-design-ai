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
      'spirited-away': `SPIRITED AWAY (千と千尋の神隠し) - Magical bathhouse and spirit world
VISUAL CHARACTERISTICS:
- Rich, detailed backgrounds with intricate architecture
- Warm, glowing lantern light and magical atmosphere
- Traditional Japanese elements mixed with fantasy
- Soft, dreamy lighting with warm color palette
- Detailed textures (wood, stone, fabric)
- Mysterious, enchanting mood
- Steam, mist, and atmospheric effects
- Red lanterns and traditional decorations`,

      'totoro': `MY NEIGHBOR TOTORO (となりのトトロ) - Peaceful countryside and forest spirits
VISUAL CHARACTERISTICS:
- Lush, detailed nature and countryside
- Soft, warm sunlight filtering through trees
- Rich greens and earth tones
- Gentle, peaceful atmosphere
- Detailed foliage and natural elements
- Nostalgic, comforting mood
- Soft shadows and dappled light
- Rural Japanese landscape`,

      'howls-castle': `HOWL'S MOVING CASTLE (ハウルの動く城) - Romantic steampunk fantasy
VISUAL CHARACTERISTICS:
- Intricate mechanical and architectural details
- Romantic, dreamy atmosphere
- Soft, pastel color palette
- Victorian and steampunk elements
- Detailed interiors with warm lighting
- Magical, whimsical mood
- Soft focus and dreamy quality
- European-inspired fantasy settings`,

      'ponyo': `PONYO (崖の上のポニョ) - Vibrant ocean and coastal life
VISUAL CHARACTERISTICS:
- Bright, saturated colors
- Dynamic water and ocean effects
- Clear, vibrant lighting
- Energetic, joyful atmosphere
- Detailed coastal scenery
- Playful, childlike wonder
- Rich blues and warm tones
- Expressive, fluid animation style`,

      'mononoke': `PRINCESS MONONOKE (もののけ姫) - Epic nature and ancient spirits
VISUAL CHARACTERISTICS:
- Majestic, detailed forest landscapes
- Epic, dramatic lighting
- Rich, deep colors
- Ancient, mystical atmosphere
- Detailed natural textures
- Powerful, spiritual mood
- Dramatic shadows and highlights
- Primordial forest beauty`,

      'kiki': `KIKI'S DELIVERY SERVICE (魔女の宅急便) - Charming European town
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

    const prompt = `PHILOSOPHY: Studio Ghibli films are about BEAUTY, EMOTION, and WONDER. Every frame is a painting, every scene tells a story, every detail has soul.

Transform this image into the style of ${ghibliStyles[style]}.

CRITICAL GHIBLI CHARACTERISTICS:

1. ANIMATION STYLE:
   - Hand-drawn animation aesthetic
   - Soft, organic lines (not digital sharp)
   - Watercolor-like quality
   - Gentle, flowing forms
   - Hayao Miyazaki's signature style
   - Traditional cel animation feel

2. BACKGROUND DETAIL (${detailDescription}):
   - Incredibly detailed environments
   - Rich textures and materials
   - Atmospheric depth and layers
   - Every element carefully crafted
   - Painterly quality
   - Lived-in, authentic spaces

3. COLOR PALETTE (${colorDescriptions[colorPalette]}):
   - Ghibli's signature color harmony
   - Soft, natural color transitions
   - Warm, inviting tones
   - Atmospheric color grading
   - Emotional color choices
   - Never harsh or oversaturated

4. LIGHTING & ATMOSPHERE (${atmosphereDescriptions[atmosphere]}):
   - Soft, natural lighting
   - Atmospheric effects (mist, steam, dust motes)
   - Dappled light and gentle shadows
   - Magical, dreamy quality
   - Emotional lighting
   - Time-of-day atmosphere

5. EMOTIONAL QUALITY:
   - Sense of wonder and discovery
   - Nostalgic, comforting feeling
   - Magical realism
   - Connection to nature
   - Human warmth and emotion
   - Timeless, universal appeal

6. TECHNICAL EXECUTION:
   - Soft edges and organic forms
   - Watercolor texture quality
   - Hand-painted background feel
   - Gentle color gradients
   - Atmospheric perspective
   - Depth and layering

PRESERVE CONTENT:
- Keep all subjects and composition
- Maintain the story and emotion
- Preserve character and personality
- Keep recognizable elements

FORBIDDEN:
- Do NOT make it look like a digital filter
- Do NOT lose the hand-drawn quality
- Do NOT make it too sharp or digital
- Do NOT oversaturate colors
- Do NOT lose emotional warmth
- Do NOT make it generic anime

GHIBLI MAGIC:
- Should feel like a frame from a Ghibli film
- Hand-crafted, soulful quality
- Emotional depth and beauty
- Sense of wonder and magic
- Timeless, painterly aesthetic

GOAL: Transform this into a scene that could exist in a Studio Ghibli film - beautiful, emotional, hand-crafted, with soul. Not just anime style, but specifically GHIBLI's unique magic.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/png', data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.6,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'image/png'
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
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageBase64 = data.candidates[0].content.parts[0].inline_data.data;
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
