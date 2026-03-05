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

async function uploadToR2(base64Data: string, prefix: string = 'meme'): Promise<string | null> {
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
    const { text, template = 'funny', imageUrl } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 表情包模板
    const templatePrompts: Record<string, string> = {
      'funny': `Create a funny meme image with the text: "${text}". Use bold white text with black outline, typical meme font style. Make it humorous and shareable.`,
      'motivational': `Create a motivational meme image with the text: "${text}". Inspiring background, elegant typography, positive vibes.`,
      'sarcastic': `Create a sarcastic meme image with the text: "${text}". Ironic style, typical internet meme aesthetic.`,
      'wholesome': `Create a wholesome meme image with the text: "${text}". Cute, heartwarming, positive energy.`,
    };
    
    let prompt = templatePrompts[template] || templatePrompts['funny'];
    
    // 如果提供了图片，则在图片上添加文字
    if (imageUrl) {
      const imageToBase64 = async (url: string): Promise<string> => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/png';
        return `data:${mimeType};base64,${base64}`;
      };
      
      const imageBase64 = await imageToBase64(imageUrl);
      prompt = `Add meme text to this image: "${text}". Use bold white text with black outline at the top and/or bottom. Classic meme style.`;
      
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/png", data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.6,
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

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      const base64Data = imagePart?.inlineData?.data;
      
      if (!base64Data) {
        return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
      }

      const fullBase64 = `data:image/png;base64,${base64Data}`;
      const r2Url = await uploadToR2(fullBase64, 'meme');
      
      return NextResponse.json({ 
        imageUrl: r2Url || fullBase64, 
        isR2: !!r2Url,
        template
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }

    // 生成新的表情包图片
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
          temperature: 0.7,
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

    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    const r2Url = await uploadToR2(fullBase64, 'meme');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      template
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Meme generation error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
