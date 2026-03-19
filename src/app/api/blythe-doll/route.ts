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

async function uploadToR2(base64Data: string, prefix: string = 'blythe-doll'): Promise<string | null> {
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
    const { imageUrl, style = 'classic', eyeSize = 'large', outfit = 'vintage', skinTone = 'porcelain', hairStyle = 'original' } = await req.json();
    
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
    
    // Blythe 娃娃风格特征
    const blytheStyles: Record<string, string> = {
      'classic': `CLASSIC BLYTHE DOLL (1972 Original Style)
- Iconic oversized head with small body proportions
- Large, round, glossy eyes with pull-string mechanism aesthetic
- Smooth, matte plastic skin texture
- Delicate facial features with small nose and mouth
- Vintage 1970s doll aesthetic
- Collectible toy quality
- Nostalgic, retro charm`,

      'neo': `NEO BLYTHE DOLL (Modern Takara Style)
- Contemporary Blythe with refined features
- Extra-large, expressive eyes with color-changing mechanism look
- Smooth, high-quality plastic finish
- Detailed facial sculpting
- Modern collectible doll aesthetic
- Premium toy quality
- Fashionable, trendy appeal`,

      'custom': `CUSTOM ARTIST BLYTHE DOLL
- Unique, one-of-a-kind artistic customization
- Hand-painted face with intricate details
- Custom eye chips with unique colors/patterns
- Artistic modifications and enhancements
- High-end collectible quality
- Gallery-worthy presentation
- Creative, artistic expression`,

      'gothic': `GOTHIC BLYTHE DOLL
- Dark, mysterious aesthetic
- Dramatic eye makeup and styling
- Pale or alternative skin tones
- Gothic fashion and accessories
- Moody, atmospheric presentation
- Alternative collectible style
- Edgy, dramatic appeal`,

      'kawaii': `KAWAII JAPANESE BLYTHE DOLL
- Ultra-cute Japanese aesthetic
- Extra-large, sparkling eyes
- Sweet, innocent expression
- Pastel colors and soft tones
- Lolita fashion influence
- Adorable, charming presentation
- Japanese pop culture style`
    };

    // 眼睛大小描述
    const eyeSizeDescriptions: Record<string, string> = {
      'large': 'LARGE oversized eyes (standard Blythe proportion - eyes are 1/3 of face height)',
      'extra-large': 'EXTRA-LARGE exaggerated eyes (anime-inspired - eyes are 1/2 of face height)',
      'medium': 'MEDIUM-LARGE eyes (subtle Blythe look - eyes are 1/4 of face height)'
    };

    // 服装风格描述
    const outfitDescriptions: Record<string, string> = {
      'vintage': 'vintage 1970s fashion with retro patterns and classic silhouettes',
      'modern': 'contemporary trendy fashion with modern styling',
      'artistic': 'unique artistic outfit with creative design elements',
      'gothic': 'gothic dark fashion with lace, velvet, and dramatic details',
      'lolita': 'Japanese Lolita fashion with frills, bows, and elaborate details',
      'casual': 'cute casual wear with playful, comfortable styling'
    };

    // 肤色描述
    const skinToneDescriptions: Record<string, string> = {
      'porcelain': 'smooth porcelain white plastic skin (classic doll aesthetic)',
      'fair': 'fair plastic skin tone with subtle warmth',
      'tan': 'warm tan plastic skin tone',
      'custom': 'maintain original skin tone but with doll-like plastic texture'
    };

    // 发型描述
    const hairStyleDescriptions: Record<string, string> = {
      'original': 'keep original hairstyle but with doll-like synthetic hair texture',
      'straight-bangs': 'straight hair with neat bangs (classic Blythe style)',
      'curly': 'soft curly hair with bouncy texture',
      'twin-tails': 'cute twin-tails with ribbons or accessories',
      'bob': 'stylish bob cut with smooth finish'
    };

    const prompt = `Transform this SPECIFIC PERSON into a BLYTHE DOLL - the iconic collectible fashion doll!

🚨 CRITICAL: PRESERVE THE ORIGINAL PERSON'S IDENTITY 🚨
- Keep the EXACT facial features of the person in the photo
- Maintain their unique face shape, eyes, nose, mouth
- Preserve their distinctive characteristics
- This must be RECOGNIZABLE as the same person, just as a doll

BLYTHE DOLL STYLE: ${blytheStyles[style]}

CRITICAL BLYTHE DOLL CHARACTERISTICS:
- OVERSIZED HEAD with small body (doll proportions)
- ${eyeSizeDescriptions[eyeSize]}
- Smooth, matte PLASTIC SKIN texture (not human skin)
- Doll-like facial features (small nose, small mouth, large eyes)
- Synthetic doll hair with shiny, plastic-like texture
- Collectible toy aesthetic (not human, clearly a doll)
- Visible doll joints at neck, shoulders, elbows, wrists, hips, knees
- Plastic material quality throughout

⚠️ IDENTITY PRESERVATION RULES:
- The person's face must be CLEARLY RECOGNIZABLE
- Keep their facial structure, proportions, and unique features
- Only change: skin to plastic texture, eyes to doll eyes, add doll characteristics
- DO NOT change: face shape, facial features, identity

EYE DETAILS:
- Large, round, glossy eyes with reflective surface
- Visible eye mechanism aesthetic (pull-string or color-change look)
- Bright, vibrant eye colors
- Long, dramatic eyelashes
- Innocent, wide-eyed expression
- BUT: maintain the person's eye shape and placement

SKIN & TEXTURE:
- ${skinToneDescriptions[skinTone]}
- Smooth, non-porous plastic surface
- Matte finish with slight sheen
- No human skin texture (pores, wrinkles, etc.)
- Doll-like perfection
- BUT: keep the person's face shape and features

OUTFIT: ${outfitDescriptions[outfit]}

HAIR: ${hairStyleDescriptions[hairStyle]}
- Synthetic doll hair texture
- Shiny, plastic-like strands
- Perfectly styled and maintained

BODY PROPORTIONS:
- Large head (1.5x normal human proportion)
- Small, delicate body
- Thin limbs with visible ball joints
- Doll-like posture and stance

PRESENTATION:
- Collectible doll photography style
- Clean, well-lit studio setup
- Neutral or themed background
- Professional product photo quality

FORBIDDEN ACCESSORIES / CHANGES:
- Do NOT add sunglasses
- Do NOT cover the eyes or face
- Do NOT add hats or masks that hide identity
- Do NOT replace the person with a generic random doll face
- Do NOT change ethnicity or core facial structure

GOAL: Transform THIS SPECIFIC PERSON into an authentic Blythe doll - clearly a collectible fashion doll, but RECOGNIZABLE as the same person!

Style: ${style}
Eyes: ${eyeSize}
Outfit: ${outfit}`;

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
            temperature: 0.45,
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
    const r2Url = await uploadToR2(generatedImageDataUrl, 'blythe-doll');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Blythe doll error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
