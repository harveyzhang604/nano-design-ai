import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare Pages 要求所有 API 统一使用 edge runtime
export const runtime = 'edge';

// R2 配置
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

async function uploadToR2(base64Data: string, prefix: string = 'compose'): Promise<string | null> {
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
    const { imageUrls, prompt, blendMode = 'natural' } = await req.json();
    
    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length < 2) {
      return NextResponse.json({ error: 'At least 2 images required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 处理图片：如果是 data URL 直接用，否则下载
    const imageBase64Array = await Promise.all(
      imageUrls.map(async (url: string) => {
        if (url.startsWith('data:')) {
          return url;
        }
        return await imageToBase64(url);
      })
    );
    
    // 根据合成模式调整 prompt
    const blendPrompts: Record<string, string> = {
      'guided': `Create ONE final merged image by following the user's instruction precisely.
The uploaded images are ordered as Image 1, Image 2, Image 3, Image 4.
When the user says “图1 / 图2 / 图3”, they mean Image 1 / Image 2 / Image 3.
Respect source mapping exactly and combine only the requested elements.
Make the result look natural, coherent, and realistic unless the user asks for another style.`,
      'blend': `Seamlessly blend these ${imageUrls.length} images into one cohesive composition.
Requirements:
- Natural transitions between images
- Consistent lighting and color tone
- Clean edges without visible seams
- Harmonious overall composition
- Maintain subject clarity and detail`,
      'artistic': `Create an artistic composition by blending these ${imageUrls.length} images.
Requirements:
- Creative and artistic fusion
- Interesting visual flow
- Balanced composition
- Unique artistic style
- Maintain recognizable elements`,
      'collage': `Create a modern collage from these ${imageUrls.length} images.
Requirements:
- Clear separation between images
- Organized layout
- Consistent style
- Professional presentation
- Balanced visual weight`
    };

    const sourceGuide = imageUrls
      .map((_: string, index: number) => `Image ${index + 1} = 图${index + 1}`)
      .join('\n');

    const userInstruction = prompt?.trim()
      ? `User instruction:\n${prompt.trim()}`
      : 'No extra instruction provided. Use the selected mode to compose the final image.';

    const finalPrompt = `${blendPrompts[blendMode] || blendPrompts['guided']}\n\n${sourceGuide}\n\n${userInstruction}\n\nOutput rules:\n- Return exactly one final composed image\n- Follow the requested source mapping strictly\n- Keep identity/features from the referenced source image\n- If clothing/accessories are referenced, transfer only those items\n- Preserve clean edges and consistent perspective/lighting`;

    // 构建 API 请求的 parts
    const parts = [
      { text: finalPrompt },
      ...imageBase64Array.map(base64 => ({
        inlineData: { 
          mimeType: "image/png", 
          data: base64.split(',')[1] 
        }
      }))
    ];

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.9,
            maxOutputTokens: 8192
          }
        })
      }
    );

    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('Gemini API error:', data);
      return NextResponse.json({ 
        error: data.error?.message || 'Gemini API Error' 
      }, { status: apiResponse.status });
    }

    const parts_result = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts_result.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: 'No image data returned from AI.' 
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传 R2，如果超时则直接返回 base64
    try {
      const r2Url = await uploadToR2(fullBase64, 'compose');
      if (r2Url) {
        return NextResponse.json({ 
          imageUrl: r2Url, 
          isR2: true,
          mode: 'compose'
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      }
    } catch (r2Error) {
      console.error('R2 upload error:', r2Error);
    }
    
    // 如果 R2 上传失败，直接返回 base64
    return NextResponse.json({ 
      imageUrl: fullBase64, 
      isR2: false,
      mode: 'compose'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Compose error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
