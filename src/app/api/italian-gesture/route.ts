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

async function uploadToR2(base64Data: string, prefix: string = 'italian-gesture'): Promise<string | null> {
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
      gesture = 'ma-che-vuoi', 
      intensity = 85, 
      background = 'italian-street',
      combo = false,
      secondGesture = null
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
    
    // 意大利手势的详细描述
    const gestureDescriptions: Record<string, string> = {
      'chef-kiss': `the classic Italian "chef's kiss" gesture (fingertips pinched together, brought to lips and then opened outward in a kissing motion) - expressing perfection and deliciousness`,
      'ma-che-vuoi': `the iconic Italian "Ma che vuoi?" gesture (fingers pinched together pointing upward, hand moving up and down) - the most famous Italian hand gesture meaning "what do you want?"`,
      'perfetto': `the Italian "perfetto" gesture (thumb and index finger forming an OK sign, other fingers extended) - expressing perfection`,
      'mamma-mia': `the Italian "Mamma Mia!" gesture (both hands raised with palms facing forward, fingers spread) - expressing amazement or disbelief`,
      'non-mi-rompere': `the Italian "Non mi rompere" gesture (one hand raised with palm facing forward in a stop motion) - meaning "don't bother me"`,
      'basta': `the Italian "Basta!" gesture (one hand raised with palm facing forward, fingers together) - meaning "enough!"`
    };

    // 背景描述
    const backgroundDescriptions: Record<string, string> = {
      'italian-street': 'a charming Italian street with colorful buildings, cobblestones, and warm Mediterranean lighting',
      'restaurant': 'a cozy Italian restaurant interior with checkered tablecloths, wine bottles, and warm ambient lighting',
      'kitchen': 'a rustic Italian kitchen with hanging herbs, copper pots, and marble countertops',
      'original': 'the original background'
    };

    const intensityLevel = intensity >= 90 ? 'VERY EXPRESSIVE and ANIMATED (exaggerated, theatrical)' : 
                          intensity >= 75 ? 'NATURALLY EXPRESSIVE (authentic Italian passion)' : 
                          'SUBTLE and REFINED (gentle, understated)';
    
    let gestureInstruction = '';
    if (combo && secondGesture) {
      gestureInstruction = `GESTURE COMBINATION:
- Primary gesture (right hand): ${gestureDescriptions[gesture]}
- Secondary gesture (left hand): ${gestureDescriptions[secondGesture]}
- Both gestures performed simultaneously
- Natural, coordinated body language
- Expressive Italian passion`;
    } else {
      gestureInstruction = `GESTURE:
- Perform ${gestureDescriptions[gesture]}
- Clear, recognizable hand position
- Natural, expressive execution`;
    }

    const prompt = `Transform this person into making an AUTHENTIC ITALIAN HAND GESTURE - capture PASSION and EXPRESSION!

ITALIAN GESTURE PHILOSOPHY: Italian gestures are about emotion, communication, and cultural expression. They're not just hand movements - they're a language of passion!

${gestureInstruction}

EXPRESSION INTENSITY: ${intensityLevel}

GESTURE EXECUTION:
- Hand position must be CLEAR and RECOGNIZABLE
- Anatomically correct fingers and hand shape
- Natural arm position and body language
- Facial expression matches the gesture emotion
- Intensity level: ${intensity}% (${intensity >= 90 ? 'very theatrical' : intensity >= 75 ? 'naturally passionate' : 'subtle and refined'})

CHARACTER CONSISTENCY:
- Keep the SAME person (identical face, features, identity)
- Maintain their clothing and style
- Preserve their personality
- Only add the gesture and expression

ITALIAN ATMOSPHERE:
- Background: ${background === 'original' ? 'keep original background' : backgroundDescriptions[background]}
- Warm, Mediterranean lighting
- Authentic Italian vibe
- Passionate, expressive mood

VISUAL QUALITY:
- Professional photography quality
- Natural, believable execution
- Clear gesture visibility
- Warm, inviting atmosphere

GOAL: Create an authentic, expressive Italian gesture photo that captures passion, emotion, and cultural character!

Gesture: ${gesture}${combo && secondGesture ? ` + ${secondGesture}` : ''}
Intensity: ${intensity}%`;

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
            temperature: 0.4 + (intensity / 500), // 强度越高，temperature 越高
            topK: 32,
            topP: 1,
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
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'italian-gesture');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl,
      gesture,
      intensity,
      combo: combo && secondGesture
    });

  } catch (error) {
    console.error('Italian gesture generation error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
