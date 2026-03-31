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
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'simpsons'): Promise<string | null> {
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
      style = 'classic',
      scene = 'springfield',
      buildType = 'auto',
      expression = 'neutral'
    } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);

    // Style variants
    const styleDescriptions: Record<string, string> = {
      'classic': 'The Simpsons classic TV show style (Season 1-10 golden era). Clean, confident linework, bold flat color fills, no shading gradients.',
      'movie': 'The Simpsons Movie style (2007). Slightly more cinematic lighting and polish, richer background detail, same iconic look.',
      'treehouse': 'Treehouse of Horror special episode style. Slightly more dramatic shadows, spookier atmosphere, same yellow-skin universe.',
      'modern': 'Modern Simpsons HD style (Season 20+). Cleaner lines, slightly more detailed, same iconic character language.',
    };

    // Scene backgrounds
    const sceneDescriptions: Record<string, string> = {
      'springfield': 'downtown Springfield street with familiar storefronts, blue sky, classic suburban American town.',
      'living-room': 'the iconic Simpsons living room with orange couch, tube TV, and family portrait on the wall.',
      'kwik-e-mart': 'Kwik-E-Mart convenience store interior with shelves of snacks and fluorescent lighting.',
      'nuclear-plant': 'Springfield Nuclear Power Plant with cooling towers, control room monitors, hazard signs.',
      'portrait': 'simple flat color background like an official character portrait card, clean and bold.',
      'school': 'Springfield Elementary School hallway or classroom, desks, chalkboard.',
    };

    // Body build mapping
    const buildDescriptions: Record<string, string> = {
      'auto': 'Match the body proportions of the person in the photo (slim, average, or stocky as appropriate).',
      'homer': 'Homer Simpson body type: round belly, stocky, large frame.',
      'bart': 'Bart Simpson body type: short, compact, energetic kid proportions.',
      'marge': 'Marge Simpson body type: slender, tall with the iconic blue beehive hair adapted to this character.',
      'slim': 'Slim Simpsons character build, similar to Lisa or younger adult characters.',
    };

    // Expression
    const expressionDescriptions: Record<string, string> = {
      'neutral': 'relaxed neutral Simpsons expression — slightly slack-jawed, half-lidded eyes.',
      'happy': 'big Simpsons grin, wide eyes, eyebrows raised.',
      'surprised': 'classic Simpsons surprised face — eyes wide, mouth open in an "O".',
      'angry': 'furrowed Simpsons brow, downturned mouth, squinted eyes.',
      'confused': 'classic confused Simpsons look — one eyebrow up, mouth slightly open.',
    };

    const prompt = `Transform this person into a Simpsons character. This is a fun, respectful art-style transformation.

STYLE: ${styleDescriptions[style] || styleDescriptions['classic']}

CORE SIMPSONS VISUAL RULES — FOLLOW EXACTLY:
- Skin color: bright Simpson yellow (#FED90F or similar warm yellow) — NO exceptions
- Eyes: large, round, prominent — the defining Simpsons feature
- Pupils: small black dots centered in large white sclera
- Outline: bold black outlines on all edges and features
- Colors: flat, solid, cel-animation fills — NO photorealistic shading or gradients
- Overbite: slight overbite is characteristic of most Simpsons adults
- Nose: simple small round nose or triangular bump, characteristic of the show
- Hair: translate the person's actual hairstyle into Simpsons-style flat colored hair shapes
- Clothing: translate their actual outfit into Simpsons flat-color costume style
- Ears: simple rounded Simpsons ear shape
- Fingers: Simpsons characters have 4 fingers on each hand

FACE MAPPING — CRITICAL:
- Analyze the input person's: face shape, hair color, skin tone, distinctive features, glasses if any
- Map these into Simpsons equivalents: preserve the ESSENCE of their face
- Hair color: keep their actual hair color, rendered in flat Simpsons style
- Glasses: if they wear glasses, include Simpsons-style glasses
- Beard/facial hair: translate to Simpsons-style stubble or beard shapes
- Their expression should be: ${expressionDescriptions[expression] || expressionDescriptions['neutral']}

BODY: ${buildDescriptions[buildType] || buildDescriptions['auto']}

SCENE / BACKGROUND: ${sceneDescriptions[scene] || sceneDescriptions['springfield']}

COMPOSITION:
- Full body or 3/4 body shot preferred
- Character centered and clearly readable
- Scene behind the character adds Springfield atmosphere
- TV animation framing — like a still from the show

QUALITY:
- Clean, professional animation-quality linework
- No artifacts, no blending of photo-realism with cartoon
- Pure 2D animation aesthetic throughout
- The result should look like an official Simpsons character, not an AI mashup

GOAL: The person in the photo, faithfully translated into The Simpsons universe. Someone should look at this and say "that's [person's name] as a Simpsons character!"`;

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
            responseModalities: ['Text', 'Image'],
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
      return NextResponse.json({ error: `Gemini API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const generatedImageBase64 = imagePart?.inlineData?.data;

    if (!generatedImageBase64) {
      return NextResponse.json({ error: 'No image data in response' }, { status: 500 });
    }

    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    const r2Url = await uploadToR2(generatedImageDataUrl, 'simpsons');

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Simpsons style error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
