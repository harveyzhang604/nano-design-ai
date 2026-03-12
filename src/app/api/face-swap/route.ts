import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

// R2 配置 - 从环境变量读取
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'nano-design-images';

// 创建 R2 客户端
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadToR2(base64Data: string, prefix: string = 'faceswap'): Promise<string | null> {
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
    const { 
      sourceImageUrl, 
      targetImageUrl,
      preserveExpression = true
    } = await req.json();
    
    if (!sourceImageUrl || !targetImageUrl) {
      return NextResponse.json({ error: 'Both source and target images are required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 换脸功能 - 2026-03-12 优化：增加情绪保留选项
    const expressionInstruction = preserveExpression 
      ? `
CRITICAL - PRESERVE ORIGINAL EXPRESSION:
- Keep the EXACT facial expression from the source face
- If source is smiling, keep that exact smile (mouth curve, teeth visibility)
- If source is serious, keep that exact serious expression
- Preserve eye expression (wide open, squinting, etc.)
- Maintain eyebrow position and shape
- Keep the emotional state identical
- This is the person's authentic expression - preserve it 100%`
      : `
ADAPT TO TARGET EXPRESSION:
- Adopt the expression from the target image's pose
- Match the mood and emotion of the target scene
- Natural expression that fits the target context
- Blend the new face naturally with target's expression`;

    const prompt = `Swap faces between these two images - make it look SEAMLESS and NATURAL.

PHILOSOPHY: Great face swaps look real, not fake or creepy.

FACE SWAP PROCESS:
- Take the face from source image
- Place it on target image's body
- Match skin tone perfectly (natural color matching)
- Match lighting and shadows (same lighting as target)
- Seamless blending at edges (no visible seams)
- Natural, realistic result

${expressionInstruction}

PRESERVE TARGET:
- Keep target's pose exactly (body position, angle)
- Keep target's body and clothing (only face changes)
- Keep target's background (environment unchanged)
- Keep target's lighting (match face to scene lighting)
- Keep target's overall composition

NATURAL INTEGRATION:
- Blend face naturally with neck and body
- Match skin texture and tone
- Adjust face size to fit naturally
- Match lighting direction and intensity
- Seamless, invisible transitions

FORBIDDEN:
- DO NOT make it look fake or artificial
- DO NOT create visible seams or edges
- DO NOT mismatch skin tones
- DO NOT ignore lighting differences
- DO NOT make it look creepy or uncanny
${preserveExpression ? '- DO NOT change the facial expression from source' : ''}

GOAL: Like a real photo - seamless, natural, looks like they were always in that scene.`;

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95
        }
      })
    });

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });
    }

    // 从响应中提取图片
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'faceswap');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        preserveExpression
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        preserveExpression
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Face swap error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
