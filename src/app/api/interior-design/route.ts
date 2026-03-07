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

async function uploadToR2(base64Data: string, prefix: string = 'interior'): Promise<string | null> {
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
    const { imageUrl, designStyle = 'modern' } = await req.json();
    
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
    
    // 室内设计风格 - 2026-03-07 Week 4 优化：情感化、真实感
    const stylePrompts: Record<string, string> = {
      'modern': `Transform this room into MODERN interior design - make it feel CLEAN and SOPHISTICATED.

PHILOSOPHY: Modern design is about simplicity, function, and elegance.

MODERN DESIGN:
- Clean lines and simple forms (no clutter)
- Minimalist furniture (functional, beautiful)
- Neutral color palette (whites, grays, blacks, natural tones)
- Contemporary aesthetic (current, stylish)
- Open, airy feel (spacious, breathable)
- Professional interior design quality

CREATE ATMOSPHERE:
- Calm, sophisticated feel
- Functional elegance
- Natural light emphasis
- Clean, organized space
- Modern living

GOAL: Like a design magazine - clean, sophisticated, makes you want to live there.`,
      
      'scandinavian': `Transform this room into SCANDINAVIAN interior design - make it feel COZY and BRIGHT.

PHILOSOPHY: Scandinavian design is about warmth, light, and simplicity.

SCANDINAVIAN DESIGN:
- Light wood tones (natural, warm)
- White walls (bright, airy)
- Cozy textiles (soft throws, cushions)
- Minimalist Nordic aesthetic (simple, functional)
- Natural materials (wood, wool, linen)
- Hygge atmosphere (cozy, comfortable)

CREATE ATMOSPHERE:
- Warm, inviting feel
- Bright and airy
- Cozy and comfortable
- Natural and simple
- Home sweet home

GOAL: Like a Scandinavian home - cozy, bright, makes you feel at home.`,
      
      'industrial': `Transform this room into INDUSTRIAL interior design - make it feel URBAN and EDGY.

PHILOSOPHY: Industrial design is about raw materials, urban edge, and character.

INDUSTRIAL DESIGN:
- Exposed brick walls (raw, authentic)
- Metal elements (steel, iron, industrial fixtures)
- Concrete surfaces (urban, modern)
- Urban loft aesthetic (spacious, open)
- Raw, unfinished materials (character, authenticity)
- Edgy, contemporary feel

CREATE ATMOSPHERE:
- Urban, edgy vibe
- Raw, authentic character
- Spacious loft feel
- Modern industrial
- Cool and confident

GOAL: Like a NYC loft - urban, edgy, makes you feel cool.`,
      
      'bohemian': `Transform this room into BOHEMIAN interior design - make it feel ARTISTIC and FREE.

PHILOSOPHY: Bohemian design is about creativity, freedom, and self-expression.

BOHEMIAN DESIGN:
- Colorful textiles (patterns, textures, layers)
- Lots of plants (green, alive, natural)
- Eclectic furniture (mixed styles, unique pieces)
- Artistic and free-spirited vibe (creative, personal)
- Global influences (travel, culture, stories)
- Warm, inviting atmosphere

CREATE ATMOSPHERE:
- Creative, artistic feel
- Free-spirited and relaxed
- Warm and welcoming
- Personal and unique
- Lived-in and loved

GOAL: Like an artist's home - creative, free, makes you feel inspired.`,
      
      'luxury': `Transform this room into LUXURY interior design - make it feel ELEGANT and PREMIUM.

PHILOSOPHY: Luxury design is about quality, elegance, and sophistication.

LUXURY DESIGN:
- High-end furniture (designer pieces, quality craftsmanship)
- Elegant materials (marble, velvet, brass, premium fabrics)
- Sophisticated color palette (rich, refined colors)
- Premium aesthetic (magazine-worthy, aspirational)
- Impeccable details (every element considered)
- Exclusive, refined feel

CREATE ATMOSPHERE:
- Elegant, sophisticated feel
- Premium quality everywhere
- Refined and tasteful
- Aspirational living
- Luxury lifestyle

GOAL: Like a luxury hotel suite - elegant, premium, makes you feel special.`,
      
      'minimalist': `Transform this room into MINIMALIST interior design - make it feel ZEN and PEACEFUL.

PHILOSOPHY: Minimalist design is about less is more, peace, and clarity.

MINIMALIST DESIGN:
- Ultra-clean spaces (no clutter, no excess)
- Simple, essential furniture (only what's needed)
- Monochrome color palette (whites, blacks, grays)
- Zen aesthetic (calm, peaceful, meditative)
- Empty space as design element (breathing room)
- Pure, simple beauty

CREATE ATMOSPHERE:
- Calm, peaceful feel
- Clear mind, clear space
- Zen and meditative
- Simple elegance
- Pure tranquility

GOAL: Like a zen retreat - peaceful, simple, makes you feel calm.`,
      
      'traditional': `Transform this room into TRADITIONAL interior design - make it feel TIMELESS and ELEGANT.

PHILOSOPHY: Traditional design is about classic beauty, comfort, and timelessness.

TRADITIONAL DESIGN:
- Classic furniture (timeless pieces, quality craftsmanship)
- Warm color palette (rich woods, warm tones)
- Elegant details (moldings, classic patterns)
- Timeless aesthetic (never goes out of style)
- Comfortable, inviting feel (home, warmth)
- Classic elegance

CREATE ATMOSPHERE:
- Warm, welcoming feel
- Timeless elegance
- Comfortable and inviting
- Classic beauty
- Home and heritage

GOAL: Like a classic family home - timeless, elegant, makes you feel at home.`,
    };
    
    const prompt = stylePrompts[designStyle] || stylePrompts['modern'];

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
          temperature: 0.5,
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
    const r2Url = await uploadToR2(fullBase64, 'interior');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        designStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        designStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Interior design error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
