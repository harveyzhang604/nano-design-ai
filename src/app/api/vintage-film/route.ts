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

async function uploadToR2(base64Data: string, prefix: string = 'vintage-film'): Promise<string | null> {
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
    const { imageUrl, filmType = 'kodachrome', intensity = 80, grain = 60, lightLeak = 'subtle' } = await req.json();
    
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
    
    // 胶片类型特征
    const filmCharacteristics: Record<string, string> = {
      'kodachrome': `KODACHROME 64 - The legendary warm, saturated film
COLOR PALETTE:
- Rich, warm tones (slightly red-shifted)
- Deep, saturated colors (especially reds and blues)
- Warm skin tones with slight magenta cast
- Punchy contrast and vibrant saturation
- Golden hour warmth even in daylight

TECHNICAL CHARACTERISTICS:
- Fine grain structure (very smooth)
- Excellent sharpness and detail
- Slightly increased contrast
- Warm color temperature (2900K-3200K feel)
- Classic 1960s-1980s color science`,

      'polaroid': `POLAROID SX-70 - Instant nostalgia and dreamy colors
COLOR PALETTE:
- Soft, muted colors with pastel quality
- Cyan-green shadows
- Warm, peachy highlights
- Desaturated midtones
- Dreamy, faded aesthetic

TECHNICAL CHARACTERISTICS:
- Soft focus and slight blur
- Vignetting around edges
- Uneven exposure (brighter center)
- Visible frame border (white Polaroid frame)
- Slightly overexposed, dreamy quality
- Chemical development artifacts`,

      'fuji-velvia': `FUJI VELVIA 50 - Ultra-saturated landscape film
COLOR PALETTE:
- EXTREMELY saturated colors
- Deep, rich blues and greens
- Vibrant reds and yellows
- High contrast and punch
- Landscape photographer's dream

TECHNICAL CHARACTERISTICS:
- Very fine grain (almost none)
- Razor-sharp detail
- High contrast
- Cool color temperature
- Slide film look (transparency)
- Deep shadows, bright highlights`,

      'tri-x': `KODAK TRI-X 400 - Classic black & white with soul
MONOCHROME CHARACTERISTICS:
- Rich, deep blacks
- Smooth gray tones
- Visible film grain (medium-coarse)
- High contrast
- Classic street photography look
- Gritty, documentary feel

TECHNICAL CHARACTERISTICS:
- Pronounced grain structure
- Strong contrast
- Deep shadows with detail
- Bright highlights
- Classic silver halide look
- 1960s-1990s photojournalism aesthetic`,

      'cinestill': `CINESTILL 800T - Cinema film with halation glow
COLOR PALETTE:
- Tungsten balanced (warm indoor, cool outdoor)
- Characteristic red halation (glow around lights)
- Cinematic color grading
- Teal and orange look
- Moody, atmospheric

TECHNICAL CHARACTERISTICS:
- Visible grain (medium)
- Halation glow around bright lights
- Cinematic color science
- Good low-light performance
- Movie film aesthetic
- Blade Runner-esque mood`,

      'portra': `KODAK PORTRA 400 - Modern portrait perfection
COLOR PALETTE:
- Natural, accurate skin tones
- Soft, pastel colors
- Slightly desaturated
- Warm but neutral
- Professional portrait look

TECHNICAL CHARACTERISTICS:
- Fine grain
- Excellent skin tone rendering
- Soft contrast
- Wide exposure latitude
- Natural, flattering colors
- Wedding photographer favorite`
    };

    // 颗粒感描述
    const grainLevel = grain >= 80 ? 'very pronounced, coarse film grain visible throughout' :
                      grain >= 60 ? 'visible medium film grain, authentic analog feel' :
                      grain >= 40 ? 'subtle fine grain, smooth but organic' :
                      'minimal grain, almost smooth';

    // 漏光效果描述
    const lightLeakDescriptions: Record<string, string> = {
      'none': 'no light leaks',
      'subtle': 'subtle, organic light leaks in corners (soft orange/red glow)',
      'moderate': 'noticeable light leaks with color shifts (vintage camera feel)',
      'strong': 'prominent light leaks with dramatic color washes (heavily used camera)'
    };

    const prompt = `PHILOSOPHY: Film photography is about SOUL, NOSTALGIA, and IMPERFECTION. Digital is perfect - film is ALIVE.

Transform this image to look like it was shot on ${filmCharacteristics[filmType]}.

CRITICAL FILM SIMULATION:

1. COLOR SCIENCE:
   - Apply authentic film color palette
   - Respect the film's unique color response
   - Show characteristic color shifts
   - Maintain organic, analog color feel
   - No digital perfection - embrace film character

2. GRAIN STRUCTURE (${grainLevel}):
   - Authentic film grain pattern
   - Organic, random grain distribution
   - Grain should feel like silver halide crystals
   - More visible in shadows and midtones
   - Natural, not artificial noise

3. TONAL RESPONSE:
   - Film-like contrast curve (S-curve)
   - Soft highlight rolloff
   - Rich shadow detail
   - Organic tonal transitions
   - No harsh digital clipping

4. OPTICAL CHARACTERISTICS:
   - Slight softness (not digital sharp)
   - Natural vignetting
   - Organic lens characteristics
   - Film-like depth and dimension
   - Analog warmth and character

5. IMPERFECTIONS (${lightLeakDescriptions[lightLeak]}):
   - Authentic film artifacts
   - Organic imperfections
   - Chemical processing variations
   - Real camera and film character
   - Nostalgic, lived-in feel

6. ATMOSPHERE & MOOD:
   - Nostalgic, timeless quality
   - Emotional warmth and soul
   - Analog authenticity
   - Memory-like quality
   - Film's unique personality

PRESERVE CONTENT:
- Keep all subjects and composition
- Maintain image clarity and detail
- Preserve facial features and expressions
- Keep the story and emotion

FORBIDDEN:
- Do NOT make it look like a digital filter
- Do NOT add fake Instagram effects
- Do NOT over-process or make it look artificial
- Do NOT lose image quality or detail
- Do NOT make it look like a preset

FILM MAGIC:
- Should feel like a real photograph from the film era
- Organic, authentic, soulful
- Nostalgic but not fake
- Imperfect but beautiful
- Timeless quality

GOAL: Make it look like this was ACTUALLY shot on ${filmType} film - authentic, organic, with soul. Not a filter, but real film photography.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
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
            temperature: 0.5,
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
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'vintage-film');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Vintage film filter error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
