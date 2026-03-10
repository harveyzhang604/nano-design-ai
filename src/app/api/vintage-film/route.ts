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

    const prompt = `Edit this image to look like a scanned vintage film photograph. Apply ${filmType} inspired color grading, natural film grain, subtle analog contrast, gentle highlight rolloff, and optional ${lightLeakDescriptions[lightLeak]}. Keep the subject, composition, and realism intact. Avoid artificial filter artifacts.`;

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
