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

async function uploadToR2(base64Data: string, prefix: string = 'mapgen'): Promise<string | null> {
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

export async function POST(req: Request) {
  try {
    const { prompt = 'generate a beautiful map scene' } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const fullPrompt = `根据以下描述生成一个精美的地图场景：${prompt}。生成的图像应该是一个真实感的地图或位置场景，包含道路、建筑、自然景观等元素。风格应该是清晰、专业且美观的。`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:predict?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: fullPrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 });
    }

    const result = await response.json();
    const generatedImage = result.predicted_image || result.image;
    
    if (!generatedImage) {
      return NextResponse.json({ error: 'No image generated' }, { status: 500 });
    }

    const imageUrl_result = await uploadToR2(generatedImage, 'mapgen');
    if (!imageUrl_result) {
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: imageUrl_result });
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
