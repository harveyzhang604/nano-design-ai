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

    const prompt = `Transform this person into making an AUTHENTIC ITALIAN HAND GESTURE with BAROQUE PAINTING AESTHETIC!

BAROQUE PAINTING STYLE:
- Rich, dramatic chiaroscuro lighting (strong light/shadow contrast)
- Warm, golden Renaissance color palette
- Painterly texture with visible brushstrokes
- Classical Italian Renaissance/Baroque composition
- Theatrical, dramatic atmosphere
- Oil painting quality with rich colors
- Caravaggio-inspired dramatic lighting
- Titian-style warm golden tones

ITALIAN GESTURE PHILOSOPHY: Italian gestures are about emotion, communication, and cultural expression. They're not just hand movements - they're a language of passion!

${gestureInstruction}

EXPRESSION INTENSITY: ${intensityLevel}

GESTURE EXECUTION:
- Hand position must be CLEAR and RECOGNIZABLE
- Anatomically correct fingers and hand shape (Renaissance accuracy)
- Natural arm position and body language
- Facial expression matches the gesture emotion
- Intensity level: ${intensity}% (${intensity >= 90 ? 'very theatrical' : intensity >= 75 ? 'naturally passionate' : 'subtle and refined'})

CHARACTER CONSISTENCY:
- Keep the SAME person (identical face, features, identity)
- Maintain their clothing and style (but with Baroque painting texture)
- Preserve their personality
- Only add the gesture, expression, and Baroque painting style

BAROQUE VISUAL TREATMENT:
- Background: ${background === 'original' ? 'keep original background but add Baroque painting texture' : backgroundDescriptions[background] + ' rendered as a Baroque painting'}
- Dramatic chiaroscuro lighting (Caravaggio style)
- Warm golden tones and rich colors
- Painterly texture throughout
- Classical Italian Renaissance/Baroque aesthetic
- Theatrical, dramatic mood

VISUAL QUALITY:
- Oil painting texture and quality
- Rich, saturated colors with warm tones
- Dramatic lighting with deep shadows
- Clear gesture visibility
- Authentic Baroque painting atmosphere

MEME VIRALITY (2026 Italian Brainrot trend):
- The gesture must be IMMEDIATELY recognizable and shareable
- Expression should be peak dramatic Italian energy — over the top, operatic
- Think: "this belongs on a meme template" level of expressiveness
- Facial expression must match the gesture perfectly — zero ambiguity
- The absurdity and passion should make viewers laugh AND share

GOAL: Create a viral Italian gesture meme in Baroque painting style — dramatically expressive, instantly shareable, captures the full spirit of Italian Brainrot culture with classical art aesthetics!

Gesture: ${gesture}${combo && secondGesture ? ` + ${secondGesture}` : ''}
Intensity: ${intensity}%
Style: Baroque painting with dramatic chiaroscuro`;

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
            temperature: 0.6 + (intensity / 400), // 强度越高，temperature 越高
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
