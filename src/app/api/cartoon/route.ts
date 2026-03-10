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

async function uploadToR2(base64Data: string, prefix: string = 'cartoon'): Promise<string | null> {
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
    const { imageUrl, style = 'anime' } = await req.json();
    
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
    
    // 根据风格选择不同的 prompt
    const stylePrompts: Record<string, string> = {
      'anime': `Convert this photo to beautiful Japanese anime/manga style.
PRESERVE EXACTLY:
- Facial features and expressions
- Eye direction and emotion
- Pose and body position
- Hair style and color
- Clothing and accessories

ANIME STYLE RENDERING:
- Smooth, clean lines
- Vibrant, saturated colors
- Slightly larger, expressive eyes
- Soft shading and highlights
- Anime-style hair rendering
- Delicate facial features

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT add elements that weren't there
- Do NOT change the pose or composition
- Do NOT alter the character's identity

GOAL: Transform into anime style while keeping the person recognizable.`,

      'american': `Convert this photo to American cartoon/comic style.
PRESERVE EXACTLY:
- Facial features and expressions
- Character personality
- Pose and gesture
- Clothing and details

AMERICAN CARTOON STYLE:
- Bold, thick outlines
- Simplified but expressive features
- Vibrant, flat colors
- Exaggerated but natural proportions
- Comic book shading style
- Dynamic and energetic feel

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT add elements that weren't there
- Do NOT change the character's essence

GOAL: Western cartoon style while maintaining recognizability.`,

      '3d': `Convert this photo to 3D animated character style (Pixar/Disney).
PRESERVE EXACTLY:
- Facial features and expressions
- Character personality
- Pose and gesture
- Key characteristics

3D ANIMATION STYLE:
- Smooth, rounded forms
- Soft, realistic lighting
- Detailed textures
- Expressive, slightly stylized features
- Professional 3D rendering quality
- Warm, appealing colors

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT alter the character's identity
- Do NOT add unrealistic elements

GOAL: High-quality 3D animated character while keeping recognizable.`,

      'chibi': `Convert this photo to cute chibi/SD (super deformed) style.
PRESERVE:
- Basic facial features
- Character identity
- Clothing style
- Key accessories

CHIBI STYLE:
- Large head, small body (2:1 ratio)
- Big, sparkling eyes
- Simplified features
- Cute, rounded shapes
- Soft pastel colors
- Adorable expression

ALLOWED CHANGES:
- Proportions (chibi style)
- Simplification of details
- Cuter expression

GOAL: Adorable chibi version while maintaining character identity.`,

      'chatgpt': `Convert this photo to ChatGPT official avatar style - the iconic minimalist geometric portrait style.

CHATGPT STYLE CHARACTERISTICS:
- Geometric, simplified shapes
- Flat, solid colors with minimal gradients
- Clean, modern vector art aesthetic
- Circular composition (portrait in a circle)
- Limited color palette (2-4 main colors)
- Abstract but recognizable features
- Professional, friendly, approachable feel
- Minimalist line work
- Smooth, rounded shapes
- No texture or noise - pure flat design

PRESERVE IDENTITY:
- Basic facial structure and proportions
- Hair style and color (simplified)
- Key identifying features
- Overall character essence
- Facial expression and mood

STYLE EXECUTION:
- Use geometric shapes (circles, ovals, curves)
- Simplify features to essential elements
- Flat color blocks with subtle gradients
- Clean edges and smooth curves
- Modern, tech-friendly aesthetic
- Professional illustration quality

COLOR PALETTE:
- Use 2-4 harmonious colors
- Prefer soft, modern colors
- Avoid overly bright or neon colors
- Create visual balance and harmony

FORBIDDEN:
- Do NOT add realistic details or textures
- Do NOT use complex shading
- Do NOT make it look hand-drawn or sketchy
- Do NOT lose the person's core identity
- Do NOT make it too abstract to recognize

GOAL: Create a clean, modern, geometric portrait in the style of ChatGPT's official avatar design - minimalist, professional, and instantly recognizable.`
    };
    
    const prompt = stylePrompts[style] || stylePrompts['anime'];

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
            temperature: 0.4,
            topK: 32,
            topP: 0.9
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
    const r2Url = await uploadToR2(fullBase64, `cartoon-${style}`);
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'cartoon',
        style
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'cartoon',
        style
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Cartoon error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
