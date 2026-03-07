import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置 - 从环境变量读取
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

// 创建 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'style'): Promise<string | null> {
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

// 将图片转换为 base64
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
    const { imageUrl, style = 'oil-painting' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 将图片转换为 base64
    const imageBase64 = await imageToBase64(imageUrl);
    
    // 艺术风格转换 - 2026-03-07 Week 4 优化：情感化、真实感
    const stylePrompts: Record<string, string> = {
      'oil-painting': `Transform this image into a CLASSICAL OIL PAINTING - capture EMOTION and SOUL.

ARTISTIC PHILOSOPHY: Great paintings capture feeling, not just appearance.

OIL PAINTING TECHNIQUE:
- Rich, visible brush strokes (you can see the artist's hand)
- Layered paint texture (thick impasto in highlights)
- Warm, vibrant colors (oil paint richness)
- Impressionist light and shadow play
- Artistic interpretation, not photographic copy
- Emotional depth and atmosphere

PRESERVE ESSENCE:
- Keep the subject recognizable
- Capture the mood and feeling
- Show artistic interpretation with soul
- Maintain emotional connection

GOAL: Like a masterpiece in a museum - emotional, soulful, timeless. Art that makes you FEEL.`,
      
      'watercolor': `Transform this image into WATERCOLOR PAINTING - capture SOFTNESS and EMOTION.

ARTISTIC PHILOSOPHY: Watercolor is about feeling, flow, and gentle beauty.

WATERCOLOR TECHNIQUE:
- Soft, flowing edges (water and pigment blend)
- Transparent color layers (light shows through)
- Natural paper texture visible
- Gentle color bleeds and blooms
- Artistic spontaneity and life
- Delicate, dreamy atmosphere

PRESERVE ESSENCE:
- Keep subject recognizable but soft
- Capture gentle mood and feeling
- Show artistic interpretation with warmth
- Maintain emotional softness

GOAL: Like a beautiful watercolor in an art gallery - soft, emotional, dreamy. Art that feels gentle and alive.`,
      
      'cartoon': `Transform this image into CARTOON/ANIME style - capture PERSONALITY and ENERGY.

ARTISTIC PHILOSOPHY: Cartoons exaggerate personality and emotion, not just simplify.

CARTOON TECHNIQUE:
- Bold, expressive outlines (confident lines)
- Vibrant, saturated colors (eye-catching)
- Simplified but expressive features
- Exaggerated emotions and personality
- Dynamic energy and life
- Comic book/anime aesthetic with soul

PRESERVE ESSENCE:
- Keep personality and character
- Exaggerate what makes them unique
- Capture their energy and spirit
- Maintain emotional expression

GOAL: Like a character that comes alive - expressive, energetic, full of personality. Cartoon with SOUL.`,
      
      'sketch': `Transform this image into PENCIL SKETCH - capture ESSENCE and CHARACTER.

ARTISTIC PHILOSOPHY: Great sketches capture soul with minimal lines.

SKETCH TECHNIQUE:
- Confident, expressive line work
- Detailed shading with cross-hatching
- Black and white with rich tones
- Artistic interpretation, not tracing
- Visible artist's hand and style
- Raw, honest, emotional

PRESERVE ESSENCE:
- Capture the subject's character
- Show personality through lines
- Maintain emotional depth
- Keep it real and honest

GOAL: Like a master artist's sketch - raw, honest, soulful. Art that captures essence, not just appearance.`,
      
      '3d-render': `Transform this image into 3D RENDERED style - but keep it WARM and ALIVE.

ARTISTIC PHILOSOPHY: 3D doesn't mean cold. Show life, warmth, personality.

3D RENDER TECHNIQUE:
- Smooth, polished surfaces (Pixar quality)
- Realistic lighting with warmth
- Subtle textures and details
- Professional animation quality
- Vibrant, appealing colors
- Life and personality in every detail

PRESERVE ESSENCE:
- Keep personality and warmth
- Show character and emotion
- Maintain human connection
- Keep it alive, not robotic

GOAL: Like a Pixar character - polished, professional, but ALIVE with personality and warmth.`,
      
      'pop-art': `Transform this image into POP ART style - capture BOLD ENERGY and ATTITUDE.

ARTISTIC PHILOSOPHY: Pop art is about bold statements, energy, attitude.

POP ART TECHNIQUE:
- Bold, saturated colors (eye-popping)
- High contrast (dramatic)
- Graphic design aesthetic
- Andy Warhol inspired
- Bold outlines and shapes
- Confident, unapologetic style

PRESERVE ESSENCE:
- Keep personality and attitude
- Exaggerate what makes them iconic
- Show bold character
- Maintain energy and presence

GOAL: Like an iconic pop art poster - bold, confident, unforgettable. Art with ATTITUDE.`,
      
      'cyberpunk': `Transform this image into CYBERPUNK style - capture MOOD and ATMOSPHERE.

ARTISTIC PHILOSOPHY: Cyberpunk is about mood, atmosphere, feeling.

CYBERPUNK AESTHETIC:
- Neon colors (pink, blue, purple glow)
- Dark, moody atmosphere
- Futuristic, sci-fi elements
- Rain-slicked streets feel
- Blade Runner inspired
- Emotional depth in darkness

PRESERVE ESSENCE:
- Keep subject recognizable
- Show personality in the darkness
- Maintain emotional connection
- Keep human warmth in cold future

GOAL: Like a scene from Blade Runner - moody, atmospheric, emotional. Sci-fi with SOUL.`,
      
      'vintage': `Transform this image into VINTAGE PHOTOGRAPH - capture NOSTALGIA and WARMTH.

ARTISTIC PHILOSOPHY: Vintage isn't just old - it's memory, feeling, nostalgia.

VINTAGE TECHNIQUE:
- Faded, warm colors (aged photo feel)
- Film grain and texture
- Soft focus and gentle light
- 1970s aesthetic warmth
- Nostalgic, timeless feel
- Emotional connection to the past

PRESERVE ESSENCE:
- Keep subject recognizable
- Show warmth and humanity
- Capture timeless quality
- Maintain emotional connection

GOAL: Like a treasured old photograph - nostalgic, warm, timeless. Photo that feels like MEMORY.`,
    };
    
    const prompt = stylePrompts[style] || stylePrompts['oil-painting'];

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
          temperature: 0.6,
          topK: 40,
          topP: 0.95
        }
      })
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    // 从响应中提取图片
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'style');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        style
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        style
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Style transfer error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
