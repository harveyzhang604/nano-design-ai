import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

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

async function uploadToR2(base64Data: string, prefix: string = 'character'): Promise<string | null> {
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
    const { 
      action, 
      characterId, 
      characterName,
      characterImage,
      scene,
      style,
      pose,
      clothing,
      background
    } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 保存角色到库
    if (action === 'save') {
      if (!characterImage || !characterName) {
        return NextResponse.json({ 
          error: 'Character image and name are required' 
        }, { status: 400 });
      }
      
      // 生成角色 ID
      const charId = `char_${Date.now()}`;
      
      // 上传角色图片到 R2
      const imageBase64 = await imageToBase64(characterImage);
      const r2Url = await uploadToR2(imageBase64, `character-${charId}`);
      
      return NextResponse.json({ 
        success: true,
        characterId: charId,
        characterName,
        characterImage: r2Url || imageBase64,
        message: '角色已保存到库'
      });
    }
    
    // 使用角色生成新场景
    if (action === 'generate') {
      if (!characterImage) {
        return NextResponse.json({ 
          error: 'Character image is required' 
        }, { status: 400 });
      }
      
      const imageBase64 = await imageToBase64(characterImage);
      
      // 构建 prompt
      const prompt = `Generate a new image with this EXACT character in a different scene.

CRITICAL CHARACTER CONSISTENCY RULES:
1. PRESERVE EXACTLY: facial features, face shape, eye shape, nose, mouth, ears
2. PRESERVE EXACTLY: skin tone, hair color, hair style, hair length
3. PRESERVE EXACTLY: body proportions, height, build
4. PRESERVE EXACTLY: distinctive features (glasses, facial hair, accessories)
5. PRESERVE EXACTLY: character's age and overall appearance

NEW SCENE REQUIREMENTS:
${scene ? `- Scene: ${scene}` : ''}
${style ? `- Style: ${style}` : ''}
${pose ? `- Pose: ${pose}` : ''}
${clothing ? `- Clothing: ${clothing}` : ''}
${background ? `- Background: ${background}` : ''}

CONSISTENCY VERIFICATION:
- If someone who knows this character sees the new image, they should immediately recognize them
- The character should look like the SAME PERSON in a different situation
- Maintain ALL distinctive features that make this character unique

GOAL: Generate a new scene with 100% character consistency.`;

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
            temperature: 0.3,
            topK: 20,
            topP: 0.85
          }
        })
      });

      const data = await apiResponse.json();
      
      if (!apiResponse.ok) {
        console.error('Gemini API error:', data);
        return NextResponse.json({ 
          error: data.error?.message || 'Gemini API Error' 
        }, { status: apiResponse.status });
      }

      const parts = data.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p.inlineData);
      const base64Data = imagePart?.inlineData?.data;
      
      if (!base64Data) {
        return NextResponse.json({ 
          error: 'No image data returned from AI.' 
        }, { status: 500 });
      }

      const fullBase64 = `data:image/png;base64,${base64Data}`;
      const r2Url = await uploadToR2(fullBase64, 'character-scene');
      
      if (r2Url) {
        return NextResponse.json({ 
          imageUrl: r2Url, 
          isR2: true,
          mode: 'character-library',
          characterId
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      } else {
        return NextResponse.json({ 
          imageUrl: fullBase64, 
          isR2: false,
          mode: 'character-library',
          characterId
        }, {
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
      }
    }
    
    return NextResponse.json({ 
      error: 'Invalid action. Use "save" or "generate".' 
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('Character library error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
