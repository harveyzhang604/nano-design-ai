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

async function uploadToR2(base64Data: string, prefix: string = 'chibi'): Promise<string | null> {
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
    const { 
      imageUrl, 
      style = 'cute', 
      headSize = 90, 
      eyeSize = 85, 
      background = 'pastel',
      profession = 'none'
    } = await req.json();
    
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
    
    // Chibi 风格描述
    const styleDescriptions: Record<string, string> = {
      'cute': 'ultra-cute chibi style with round features, soft lines, and adorable proportions',
      'kawaii': 'Japanese kawaii chibi style with sparkly eyes, rosy cheeks, and sweet expressions',
      'sd': 'Super Deformed (SD) style with extremely exaggerated proportions and simplified features',
      'anime-chibi': 'anime-style chibi with clean lines, vibrant colors, and expressive features'
    };

    // 头身比例描述
    const proportionLevel = headSize >= 95 ? 'extremely large head (1:1 or 1:0.8 head-to-body ratio)' :
                           headSize >= 85 ? 'very large head (1:1.5 head-to-body ratio)' :
                           'large head (1:2 head-to-body ratio)';

    // 眼睛大小描述
    const eyeSizeLevel = eyeSize >= 90 ? 'extremely large, sparkling eyes taking up 40% of face' :
                        eyeSize >= 75 ? 'very large, expressive eyes taking up 30% of face' :
                        'large, cute eyes taking up 25% of face';

    // 背景描述
    const backgroundDescriptions: Record<string, string> = {
      'pastel': 'soft pastel gradient background with gentle pink, blue, and lavender tones',
      'sparkle': 'magical background with twinkling stars, sparkles, and soft glowing effects',
      'simple': 'clean, simple solid color background that complements the character',
      'transparent': 'transparent background (PNG with alpha channel)'
    };
    
    // 职业装描述
    const professionOutfits: Record<string, string> = {
      'none': '',
      'doctor': 'wearing cute doctor outfit: white coat, stethoscope, medical cap',
      'nurse': 'wearing cute nurse outfit: nurse cap with red cross, white uniform',
      'programmer': 'wearing cute programmer outfit: hoodie, glasses, laptop or keyboard accessory',
      'chef': 'wearing cute chef outfit: tall chef hat, white chef coat, holding tiny cooking utensil',
      'teacher': 'wearing cute teacher outfit: professional attire, holding tiny book or pointer',
      'astronaut': 'wearing cute astronaut outfit: space suit, helmet, NASA patch',
      'police': 'wearing cute police outfit: police cap, badge, uniform',
      'firefighter': 'wearing cute firefighter outfit: firefighter helmet, protective gear',
      'pilot': 'wearing cute pilot outfit: pilot cap, aviator sunglasses, uniform',
      'scientist': 'wearing cute scientist outfit: lab coat, safety goggles, holding beaker',
      'artist': 'wearing cute artist outfit: beret, paint palette, brush',
      'musician': 'wearing cute musician outfit: holding tiny instrument, music notes around'
    };

    const professionText = profession !== 'none' ? `\n\nPROFESSION OUTFIT:\n${professionOutfits[profession]}` : '';

    const prompt = `Transform this person into an ADORABLE CHIBI character - SUPER CUTE and EXPRESSIVE!

CHIBI PHILOSOPHY: Chibi is about maximum cuteness, exaggerated proportions, and pure joy.

CHIBI PROPORTIONS:
- ${proportionLevel} (head is HUGE compared to body)
- Tiny, cute body (short arms and legs)
- ${eyeSizeLevel}
- Small nose and mouth (simple, cute)
- Round, soft shapes everywhere (no sharp angles)

CHIBI FEATURES:
- Huge, sparkling eyes with highlights (anime-style)
- Rosy cheeks (cute blush)
- Simple, expressive facial features
- Soft, rounded body shapes
- Tiny hands and feet (adorable)
- ${styleDescriptions[style]}${professionText}

CHARACTER CONSISTENCY:
- Keep the person's hair color and style (chibi version)
- Maintain their distinctive features (in cute form)
- Preserve their personality and expression
- Keep them recognizable but SUPER CUTE

VISUAL STYLE:
- Clean, polished illustration
- Vibrant, appealing colors
- Soft shading and highlights
- Professional chibi art quality
- ${backgroundDescriptions[background]}

MOOD:
- Adorable and joyful
- Expressive and lively
- Pure cuteness overload
- Makes you go "awww!"

TRENDING 2026 CHIBI AESTHETICS:
- Soft pastel color palette with gentle gradients
- Clean linework with subtle cel-shading
- Sparkling highlight dots in eyes (4-point star sparkles)
- Tiny blush marks (two soft circles on cheeks)
- Floating heart or star accessories optional
- IP-quality illustration standard (LINE Friends / Sanrio level)

GOAL: Create an irresistibly cute chibi character at IP mascot quality — so adorable it could be a sticker pack or LINE Friends character!`;

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
            temperature: 0.6,
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
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'chibi');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl,
      profession
    });

  } catch (error) {
    console.error('Chibi generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
