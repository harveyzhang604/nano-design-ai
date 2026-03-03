import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '9af2fdf271637c43b99ca8349ee04c59';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '9874ce253894ad5af6efb022edec4908';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || 'd4547155be0f4b1fad9cd7d2a37ba1246e2cbf08ba31721e0fd204073d196f39';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';
const R2_PUBLIC_URL = `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// 创建 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prompt: string): Promise<string> {
  const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const imageBuffer = Buffer.from(base64Content, 'base64');
  
  const sanitizedPrompt = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${Date.now()}-${sanitizedPrompt}.png`;
  const key = `images/${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: imageBuffer,
    ContentType: 'image/png',
  });

  await r2Client.send(command);
  
  return `${R2_PUBLIC_URL}/${key}`;
}

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured. Please set it in Cloudflare Pages environment variables.'
      }, { status: 500 });
    }

    const categoryPrompts: Record<string, string> = {
      fashion: "Professional Fashion Design Studio Photography.",
      architecture: "High-end Photorealistic Architectural Visualization Rendering.",
      interior: "Luxury Modern Interior Design Magazine Photography."
    };

    const systemPrompt = categoryPrompts[category] || "Professional design AI.";

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: `${systemPrompt} ${prompt}. Technical: 8k, ultra-detailed.` }],
        parameters: { sampleCount: 1 }
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 上传到 R2
    try {
      const r2Url = await uploadToR2(fullBase64, prompt);
      console.log('Image uploaded to R2:', r2Url);
      return NextResponse.json({ imageUrl: r2Url, isR2: true }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } catch (r2Error: any) {
      console.error('R2 upload failed:', r2Error.message);
      return NextResponse.json({ imageUrl: fullBase64, isR2: false }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
