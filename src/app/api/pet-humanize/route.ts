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

async function uploadToR2(base64Data: string, prefix: string = 'pet-humanize'): Promise<string | null> {
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
    const { imageUrl, style = 'elegant', clothing = 'formal', keepFeatures = 85, background = 'portrait' } = await req.json();
    
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
    
    // 风格描述
    const styleDescriptions: Record<string, string> = {
      'elegant': 'elegant and sophisticated human character with refined features and graceful posture',
      'casual': 'relaxed, friendly human character with approachable and natural demeanor',
      'anime': 'anime-style human character with expressive features and vibrant personality',
      'fantasy': 'fantasy character with mystical elements and heroic presence',
      'modern': 'contemporary, fashionable human character with trendy style',
      'vintage': 'vintage-inspired human character with classic, timeless appeal'
    };

    // 服装描述
    const clothingDescriptions: Record<string, string> = {
      'formal': 'elegant formal wear (suit, dress shirt, or formal dress)',
      'casual': 'comfortable casual clothing (t-shirt, jeans, or casual dress)',
      'anime': 'anime-style outfit with vibrant colors and unique design',
      'fantasy': 'fantasy armor or robes with magical elements',
      'modern': 'trendy modern fashion with contemporary style',
      'traditional': 'traditional cultural clothing with authentic details'
    };

    // 特征保留程度
    const featureLevel = keepFeatures >= 90 ? 'strongly preserve the pet\'s distinctive features (ears, fur patterns, eye color, facial structure)' :
                        keepFeatures >= 75 ? 'clearly preserve the pet\'s key features while humanizing' :
                        'subtly incorporate the pet\'s features into human form';

    // 背景描述
    const backgroundDescriptions: Record<string, string> = {
      'portrait': 'professional portrait background with soft lighting and elegant backdrop',
      'fantasy': 'magical fantasy setting with mystical atmosphere',
      'modern': 'modern urban environment with contemporary architecture',
      'nature': 'beautiful natural landscape that complements the character'
    };

    const prompt = `PHILOSOPHY: Pet humanization is about celebrating the unique personality and charm of the pet while creating a believable human character. Keep their soul, transform their form.

Transform this pet into ${styleDescriptions[style]}.

CRITICAL REQUIREMENTS:

1. PRESERVE PET'S ESSENCE (${featureLevel}):
   - Keep the pet's eye color and expression
   - Incorporate fur/feather patterns into hair or clothing
   - Maintain the pet's unique facial features in human form
   - Preserve the pet's personality and character
   - Keep distinctive markings or colors

2. HUMAN TRANSFORMATION:
   - Create a fully human character (not furry/anthro)
   - Natural human proportions and anatomy
   - Believable human facial features
   - Realistic skin texture and tone
   - Human hands and body structure

3. FEATURE INTEGRATION:
   - Pet's fur color → human hair color
   - Pet's eye color → human eye color
   - Pet's markings → clothing patterns or hair highlights
   - Pet's personality → facial expression and pose
   - Pet's breed characteristics → subtle facial features

4. CLOTHING & STYLE:
   - ${clothingDescriptions[clothing]}
   - Colors should complement the pet's original colors
   - Style should match the pet's personality
   - High-quality, detailed clothing design
   - Appropriate for the chosen style

5. ARTISTIC QUALITY:
   - Professional character design
   - Clean, polished artwork
   - Proper lighting and shading
   - Detailed facial features
   - High-resolution quality

6. BACKGROUND:
   - ${backgroundDescriptions[background]}
   - Should enhance the character
   - Professional composition
   - Appropriate depth and atmosphere

PRESERVE FROM PET:
- Eye color and shape
- Fur/feather color palette
- Distinctive markings or patterns
- Facial expression and personality
- Overall "vibe" and character

FORBIDDEN:
- Do NOT create furry/anthro characters (no animal ears, tails, or fur)
- Do NOT make it look like a costume
- Do NOT lose the pet's personality
- Do NOT create generic human without pet's essence
- Do NOT make it look uncanny or creepy

HUMANIZATION MAGIC:
- The human should feel like "if this pet were human"
- Viewers should recognize the pet's personality
- Natural and believable human character
- Artistic and appealing design
- Captures the pet's unique charm

GOAL: Create a beautiful human character that embodies the pet's spirit, personality, and distinctive features in a natural and artistic way.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: 'image/png', data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'image/png'
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
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageBase64 = data.candidates[0].content.parts[0].inline_data.data;
    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'pet-humanize');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Pet humanization error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
