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

async function uploadToR2(base64Data: string, prefix: string = 'age-evolution'): Promise<string | null> {
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
    const { imageUrl, targetAge = 25, style = 'realistic', preserveFeatures = 90, showTimeline = 'single' } = await req.json();
    
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
    
    // 年龄阶段描述 - 更精确的年龄段划分
    const getAgeDescription = (age: number): string => {
      if (age <= 2) return 'baby (0-2 years old) with soft baby features, chubby cheeks, large innocent eyes, and delicate skin';
      if (age <= 5) return 'toddler (3-5 years old) with childlike features, round face, button nose, and playful expression';
      if (age <= 10) return 'young child (6-10 years old) with youthful features, growing face structure, bright eyes, and smooth skin';
      if (age <= 14) return 'preteen (11-14 years old) with developing features, elongating face, clearer bone structure, and fresh skin';
      if (age <= 19) return 'teenager (15-19 years old) with maturing features, defined face structure, youthful skin, and emerging adult characteristics';
      if (age <= 25) return 'young adult (20-25 years old) with fully developed features, peak skin condition, vibrant appearance, and youthful energy';
      if (age <= 35) return 'adult (26-35 years old) with mature features, stable face structure, healthy skin, and confident appearance';
      if (age <= 45) return 'middle-aged adult (36-45 years old) with fully mature features, first subtle aging signs (fine lines), and distinguished appearance';
      if (age <= 55) return 'mature adult (46-55 years old) with visible aging signs (wrinkles, some gray hair), refined features, and experienced look';
      if (age <= 65) return 'senior adult (56-65 years old) with clear aging signs (deeper wrinkles, gray/white hair), softer skin, and wise appearance';
      if (age <= 75) return 'elderly (66-75 years old) with advanced aging signs (deep wrinkles, white hair, age spots), thinner skin, and dignified appearance';
      return 'very elderly (76+ years old) with pronounced aging signs (very deep wrinkles, white/thinning hair, age spots, sagging skin), and venerable appearance';
    };

    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'realistic': 'photorealistic style with natural lighting and authentic aging details',
      'artistic': 'artistic portrait style with painterly quality and elegant aging representation',
      'portrait': 'professional portrait photography style with studio lighting and refined aging details'
    };

    // 特征保留程度
    const featureLevel = preserveFeatures >= 95 ? 'STRONGLY preserve all unique facial features' :
                        preserveFeatures >= 85 ? 'clearly preserve key facial features' :
                        'preserve essential facial features while allowing natural aging changes';

    const ageDesc = getAgeDescription(targetAge);

    const prompt = `Transform this portrait to show the same person at ${targetAge} years old (${ageDesc}).

CRITICAL IDENTITY PRESERVATION:
- Keep EXACT same face shape, bone structure, and facial proportions
- Preserve unique facial features (nose shape, eye shape, mouth shape, ears)
- Maintain the same expression and emotional state
- Keep the same hairstyle direction and general style
- Preserve the overall composition and framing

AGE-APPROPRIATE CHANGES (apply naturally):
${targetAge <= 12 ? `
- Softer, rounder facial features
- Larger eyes relative to face size
- Smoother, flawless skin
- Fuller cheeks and baby fat
- Smaller nose and mouth proportions
- Bright, clear eyes with no aging signs
` : targetAge <= 19 ? `
- Developing facial structure
- Clear, youthful skin with no wrinkles
- Bright, energetic eyes
- Defined but youthful features
- Fresh, vibrant appearance
` : targetAge <= 35 ? `
- Fully developed adult features
- Smooth, healthy skin
- Clear, confident eyes
- Mature but youthful appearance
- Peak physical condition
` : targetAge <= 55 ? `
- Subtle aging signs: fine lines around eyes and mouth
- Slight skin texture changes
- Possible early gray hair (natural amount)
- Mature, experienced appearance
- Maintained facial structure
` : `
- Clear aging signs: wrinkles, age lines, crow's feet
- Gray or white hair (age-appropriate amount)
- Softer skin texture with age spots
- Deeper facial lines and folds
- Wise, dignified appearance
`}

STYLE: ${styleDescriptions[style]}
FEATURE PRESERVATION: ${featureLevel}

GOAL: Natural age transformation while keeping the person recognizable and authentic.`;

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
            temperature: 0.4,
            topK: 32,
            topP: 0.9,
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
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'age-evolution');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Age evolution error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
