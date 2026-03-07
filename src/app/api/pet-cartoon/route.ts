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

async function uploadToR2(base64Data: string, prefix: string = 'pet'): Promise<string | null> {
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

// 将图片转换为 base64
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
    const { imageUrl, cartoonStyle = 'cute', humanize = false } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 将图片转换为 base64
    const imageBase64 = await imageToBase64(imageUrl);
    
    // 宠物拟人化风格 (新增)
    if (humanize) {
      const humanizePrompts: Record<string, string> = {
        'professional': `Transform this pet into a HUMANIZED character with professional attire.

TRANSFORMATION RULES:
- Keep the pet's distinctive features (fur color, markings, breed characteristics)
- Give them human body posture (standing upright, human proportions)
- Dress them in professional business attire (suit, tie, professional clothing)
- Maintain their personality and expression
- Anthropomorphic style - blend of pet features and human form
- Professional setting or background

STYLE: Realistic anthropomorphic art, high quality, professional photography feel`,
        
        'casual': `Transform this pet into a HUMANIZED character with casual style.

TRANSFORMATION RULES:
- Keep the pet's distinctive features (fur color, markings, breed characteristics)
- Give them human body posture (standing upright, human proportions)
- Dress them in casual modern clothing (hoodie, jeans, sneakers, etc.)
- Maintain their personality and expression
- Anthropomorphic style - blend of pet features and human form
- Casual, friendly atmosphere

STYLE: Realistic anthropomorphic art, high quality, lifestyle photography feel`,
        
        'royal': `Transform this pet into a HUMANIZED royal character.

TRANSFORMATION RULES:
- Keep the pet's distinctive features (fur color, markings, breed characteristics)
- Give them human body posture (standing upright, regal proportions)
- Dress them in royal attire (crown, royal robes, elegant clothing)
- Maintain their personality with regal dignity
- Anthropomorphic style - blend of pet features and human form
- Royal palace or elegant background

STYLE: Realistic anthropomorphic art, high quality, royal portrait feel`,
        
        'superhero': `Transform this pet into a HUMANIZED superhero character.

TRANSFORMATION RULES:
- Keep the pet's distinctive features (fur color, markings, breed characteristics)
- Give them human body posture (heroic stance, muscular proportions)
- Dress them in superhero costume (cape, mask, heroic outfit)
- Maintain their personality with heroic confidence
- Anthropomorphic style - blend of pet features and human form
- Heroic action background

STYLE: Realistic anthropomorphic art, high quality, superhero movie poster feel`,
      };
      
      const prompt = humanizePrompts[cartoonStyle] || humanizePrompts['casual'];
      
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
      const r2Url = await uploadToR2(fullBase64, 'pet-humanized');
      
      if (r2Url) {
        return NextResponse.json({ 
          imageUrl: r2Url, 
          isR2: true,
          mode: 'pet-humanized'
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      } else {
        return NextResponse.json({ 
          imageUrl: fullBase64, 
          isR2: false,
          mode: 'pet-humanized'
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      }
    }
    
    // 原有的宠物卡通化风格
    const stylePrompts: Record<string, string> = {
      'cute': 'Transform this pet into cute cartoon style. Big expressive eyes, adorable features, Disney/Pixar aesthetic. Maintain pet\'s breed characteristics.',
      'anime': 'Transform this pet into anime/manga style. Japanese animation aesthetic, expressive features, vibrant colors.',
      '3d': 'Transform this pet into 3D rendered cartoon. Pixar-quality 3D character, smooth surfaces, professional animation style.',
      'comic': 'Transform this pet into comic book style. Bold outlines, vibrant colors, comic art aesthetic.',
      'watercolor': 'Transform this pet into watercolor painting style. Soft colors, artistic brush strokes, gentle aesthetic.',
    };
    
    const prompt = stylePrompts[cartoonStyle] || stylePrompts['cute'];

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

    // 从响应中提取图片
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const base64Data = imagePart?.inlineData?.data;
    
    if (!base64Data) {
      return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'pet');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        cartoonStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        cartoonStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Pet cartoon error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
