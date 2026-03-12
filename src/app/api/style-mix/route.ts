import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置
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

async function uploadToR2(base64Data: string, prefix: string = 'style-mix'): Promise<string | null> {
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

// 风格定义库
const styleDefinitions: Record<string, string> = {
  'ghibli': 'Studio Ghibli hand-drawn animation style with warm colors, soft lighting, magical atmosphere',
  '80s-neon': '1980s neon aesthetic with vibrant pink/blue/purple colors, retro-futuristic vibe, synthwave',
  'film-noir': 'Film noir black and white with dramatic shadows, high contrast, moody atmosphere',
  'watercolor': 'Watercolor painting with soft edges, flowing colors, artistic brush strokes',
  'cyberpunk': 'Cyberpunk aesthetic with neon lights, dark urban setting, futuristic tech',
  'vintage-70s': '1970s vintage with warm tones, film grain, retro fashion and colors',
  'minimalist': 'Minimalist design with clean lines, simple colors, negative space',
  'baroque': 'Baroque art style with ornate details, dramatic lighting, rich colors',
  'pop-art': 'Pop art with bold colors, comic book style, Ben-Day dots, high contrast',
  'impressionist': 'Impressionist painting with visible brush strokes, light effects, soft focus'
};

export async function POST(req: Request) {
  try {
    let { imageUrl, styles = [], blendMode = 'balanced' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // 支持字符串输入（逗号分隔）
    if (typeof styles === 'string') {
      styles = styles.split(',').map((s: string) => s.trim()).filter((s: string) => s);
    }
    
    if (!styles || styles.length === 0) {
      return NextResponse.json({ error: 'At least one style is required' }, { status: 400 });
    }
    
    if (styles.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 styles allowed' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);
    
    // 构建混合风格 prompt
    const styleDescriptions = styles.map((s: string) => styleDefinitions[s] || s).join(' + ');
    
    let blendInstruction = '';
    if (blendMode === 'dominant-first') {
      blendInstruction = `Primary style: ${styleDefinitions[styles[0]]}, with subtle influences from: ${styles.slice(1).map((s: string) => styleDefinitions[s]).join(', ')}`;
    } else if (blendMode === 'layered') {
      blendInstruction = `Layer these styles sequentially: ${styles.map((s: string, i: number) => `Layer ${i+1}: ${styleDefinitions[s]}`).join(' → ')}`;
    } else {
      // balanced
      blendInstruction = `Blend these styles equally: ${styleDescriptions}`;
    }
    
    const prompt = `Transform this image by MIXING multiple artistic styles.

STYLE BLEND INSTRUCTION:
${blendInstruction}

BLENDING RULES:
1. Each style should be clearly recognizable in the final image
2. Styles should complement each other, not conflict
3. Maintain visual harmony and coherence
4. Preserve the main subject and composition
5. Create a unique aesthetic that combines all styles naturally

QUALITY REQUIREMENTS:
- High artistic quality
- Balanced color palette
- Coherent visual language
- Professional execution
- Creative and unique result

GOAL: Create a visually stunning image that seamlessly blends ${styles.length} different artistic styles.

Styles to mix: ${styles.join(' + ')}`;

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
          temperature: 0.7,
          topK: 40,
          topP: 0.95
        }
      })
    });

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
    const r2Url = await uploadToR2(fullBase64, 'style-mix');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'style-mix',
        styles,
        blendMode
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'style-mix',
        styles,
        blendMode
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Style mix error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
