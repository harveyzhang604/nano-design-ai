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

async function uploadToR2(base64Data: string, prefix: string = 'style-pro'): Promise<string | null> {
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
    const { imageUrl, artStyle = 'oil-painting', intensity = 'medium' } = await req.json();
    
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
    
    // 艺术风格库
    const stylePrompts: Record<string, string> = {
      'oil-painting': `Transform this image into a beautiful OIL PAINTING.

STYLE CHARACTERISTICS:
- Rich, thick brushstrokes (impasto technique)
- Vibrant, layered colors
- Visible brush texture and direction
- Oil paint luminosity and depth
- Classical painting composition
- Artistic interpretation of light and shadow

PRESERVE:
- Main composition and subjects
- Key details and recognizable elements
- Overall mood and atmosphere

ARTISTIC FREEDOM:
- Painterly interpretation allowed
- Artistic color enhancement
- Expressive brushwork
- Traditional oil painting aesthetic

GOAL: Museum-quality oil painting - rich, textured, artistic.`,

      'watercolor': `Transform this image into a delicate WATERCOLOR PAINTING.

STYLE CHARACTERISTICS:
- Soft, flowing watercolor washes
- Transparent, layered colors
- Wet-on-wet bleeding effects
- Paper texture visible
- Light, airy feel
- Gentle color gradients
- White paper showing through

PRESERVE:
- Main composition
- Key subjects
- Overall mood

ARTISTIC FREEDOM:
- Watercolor fluidity
- Soft edges and blending
- Artistic color interpretation
- Traditional watercolor aesthetic

GOAL: Beautiful watercolor painting - soft, flowing, delicate.`,

      'impressionist': `Transform this image into an IMPRESSIONIST MASTERPIECE.

STYLE CHARACTERISTICS:
- Short, visible brushstrokes
- Emphasis on light and its changing qualities
- Vibrant, pure colors placed side by side
- Outdoor scenes and natural light
- Movement and life captured
- Loose, spontaneous composition
- Monet, Renoir, Degas style

PRESERVE:
- Main composition
- Subject matter
- Atmosphere and mood

ARTISTIC FREEDOM:
- Impressionist interpretation
- Broken color technique
- Emphasis on light effects
- Artistic spontaneity

GOAL: Impressionist painting - light-filled, vibrant, alive.`,

      'van-gogh': `Transform this image in VAN GOGH'S ICONIC STYLE.

STYLE CHARACTERISTICS:
- Bold, swirling brushstrokes
- Thick impasto texture
- Vibrant, expressive colors
- Dynamic movement and energy
- Emotional intensity
- Starry Night / Sunflowers aesthetic
- Post-impressionist technique

PRESERVE:
- Main subjects
- Composition
- Recognizable elements

ARTISTIC FREEDOM:
- Van Gogh's expressive style
- Swirling patterns
- Bold color choices
- Emotional interpretation

GOAL: Van Gogh masterpiece - bold, swirling, emotionally powerful.`,

      'ukiyo-e': `Transform this image into JAPANESE UKIYO-E WOODBLOCK PRINT.

STYLE CHARACTERISTICS:
- Flat, bold colors
- Strong outlines (black contours)
- Simplified forms
- Decorative patterns
- Traditional Japanese composition
- Hokusai / Hiroshige aesthetic
- Woodblock print texture

PRESERVE:
- Main subjects
- Composition
- Key elements

ARTISTIC FREEDOM:
- Japanese artistic interpretation
- Flat color areas
- Decorative stylization
- Traditional ukiyo-e aesthetic

GOAL: Japanese woodblock print - bold, decorative, traditional.`,

      'pop-art': `Transform this image into vibrant POP ART.

STYLE CHARACTERISTICS:
- Bold, flat colors
- High contrast
- Ben-Day dots or halftone patterns
- Thick black outlines
- Warhol / Lichtenstein style
- Commercial art aesthetic
- Bright, saturated colors

PRESERVE:
- Main subjects
- Composition
- Recognizable elements

ARTISTIC FREEDOM:
- Pop art interpretation
- Bold color choices
- Graphic simplification
- Commercial art style

GOAL: Pop art masterpiece - bold, graphic, iconic.`,

      'cubist': `Transform this image into CUBIST ART.

STYLE CHARACTERISTICS:
- Multiple viewpoints simultaneously
- Geometric shapes and fragmentation
- Flattened perspective
- Angular forms
- Picasso / Braque style
- Abstract geometric composition
- Muted, earthy colors

PRESERVE:
- Subject matter (recognizable)
- Key elements
- Overall composition

ARTISTIC FREEDOM:
- Cubist fragmentation
- Multiple perspectives
- Geometric interpretation
- Abstract elements

GOAL: Cubist masterpiece - geometric, multi-perspective, analytical.`,

      'abstract': `Transform this image into ABSTRACT EXPRESSIONISM.

STYLE CHARACTERISTICS:
- Bold, gestural brushstrokes
- Non-representational forms
- Emotional color use
- Dynamic composition
- Pollock / Rothko / Kandinsky style
- Spontaneous and energetic
- Color field or action painting

PRESERVE:
- Color palette inspiration
- Emotional mood
- Energy and movement

ARTISTIC FREEDOM:
- Full abstract interpretation
- Expressive freedom
- Non-representational
- Emotional expression

GOAL: Abstract expressionist work - bold, emotional, free.`,

      'sketch': `Transform this image into an ARTISTIC PENCIL SKETCH.

STYLE CHARACTERISTICS:
- Pencil/charcoal drawing technique
- Hatching and cross-hatching
- Varying line weights
- Shading and tonal values
- Paper texture visible
- Artist's hand visible
- Classical drawing technique

PRESERVE:
- Main subjects
- Composition
- Key details

ARTISTIC FREEDOM:
- Sketch interpretation
- Line quality variation
- Artistic shading
- Drawing aesthetic

GOAL: Beautiful pencil sketch - detailed, artistic, hand-drawn.`,

      'anime': `Transform this image into ANIME ART STYLE.

STYLE CHARACTERISTICS:
- Clean, precise linework
- Cel-shaded coloring
- Expressive eyes
- Simplified but detailed
- Japanese animation aesthetic
- Vibrant colors
- Studio Ghibli / modern anime quality

PRESERVE:
- Main subjects
- Composition
- Key features

ARTISTIC FREEDOM:
- Anime stylization
- Expressive interpretation
- Japanese animation aesthetic
- Character design principles

GOAL: High-quality anime art - clean, expressive, beautiful.`
    };
    
    let basePrompt = stylePrompts[artStyle] || stylePrompts['oil-painting'];
    
    // 根据强度调整 prompt
    const intensityModifiers: Record<string, string> = {
      'light': '\n\nINTENSITY: LIGHT - Subtle style application, keep photo-realistic elements, gentle artistic touch.',
      'medium': '\n\nINTENSITY: MEDIUM - Balanced style application, clear artistic style while maintaining recognizability.',
      'strong': '\n\nINTENSITY: STRONG - Bold style application, full artistic transformation, prioritize style over realism.',
      'extreme': '\n\nINTENSITY: EXTREME - Maximum style application, complete artistic transformation, style dominates.'
    };
    
    const prompt = basePrompt + (intensityModifiers[intensity] || intensityModifiers['medium']);

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
            temperature: 0.5,
            topK: 40,
            topP: 0.95
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
    const r2Url = await uploadToR2(fullBase64, `style-${artStyle}-${intensity}`);
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'style-transfer-pro',
        artStyle,
        intensity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'style-transfer-pro',
        artStyle,
        intensity
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Style transfer pro error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
