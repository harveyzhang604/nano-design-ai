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

async function uploadToR2(base64Data: string, prefix: string = 'debug-image'): Promise<string | null> {
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
      resolve(`data:image/png;base64,${base64}`);
    } catch (error) {
      reject(error);
    }
  });
}

export async function POST(req: Request) {
  try {
    const { imageUrl, mode = 'cartoon-safe' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);

    const prompts: Record<string, string> = {
      'cartoon-safe': 'Convert this portrait into a clean friendly cartoon illustration. Keep the same identity, expression, hair color, and composition. Use smooth lines, simple shading, and polished colors.',
      'photo-safe': 'Enhance this portrait slightly while keeping it realistic. Improve clarity, lighting, and polish. Keep the same identity, expression, and composition.',
      'style-safe': 'Turn this portrait into a soft hand-painted illustration. Keep the same identity and composition. Use gentle brushwork, warm tones, and a polished editorial look.',
      'gesture-safe': 'Edit this portrait so the same person raises one hand naturally near the face in a casual expressive pose. Keep identity, expression, outfit, and composition consistent.',
      'age-safe': 'Edit this portrait to make the person look slightly older in a natural realistic way. Keep identity, expression, hairstyle, and composition consistent.'
    };

    const prompt = prompts[mode] || prompts['cartoon-safe'];

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
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
          topP: 0.9
        }
      })
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json({
        error: data.error?.message || 'Gemini API Error',
        status: apiResponse.status,
        mode,
        raw: data
      }, { status: apiResponse.status });
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;

    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.', mode, raw: data }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, `debug-${mode}`);

    return NextResponse.json({
      success: true,
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
