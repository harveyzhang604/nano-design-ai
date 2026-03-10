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

async function uploadToR2(base64Data: string, prefix: string = 'pet-portrait'): Promise<string | null> {
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

    const prompt = `Create a human portrait inspired by this pet. Keep the pet's personality, color palette, mood, and distinctive visual traits, but render a normal human character with no animal ears, fur, tail, or costume elements. Use ${clothingDescriptions[clothing]} and ${backgroundDescriptions[background]}. Make it polished, believable, and appealing.`;

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
            temperature: 0.7,
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
    
    const r2Url = await uploadToR2(generatedImageDataUrl, 'pet-portrait');
    
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
