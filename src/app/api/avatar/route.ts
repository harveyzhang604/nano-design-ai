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

async function uploadToR2(base64Data: string, prefix: string = 'avatar'): Promise<string | null> {
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
    const { imageUrl, avatarStyle = 'professional' } = await req.json();
    
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
    
    // AI 头像生成 - 2026-03-07 Week 4 优化：情感化、真实感
    const avatarStyles: Record<string, string> = {
      'cartoon': `Transform this portrait into CARTOON avatar - make it CUTE and EXPRESSIVE.

PHILOSOPHY: Great avatars capture personality, not just appearance.

CARTOON AVATAR:
- Big expressive eyes (show personality and emotion)
- Simplified features (cute, friendly, approachable)
- Vibrant colors (eye-catching, cheerful)
- Disney/Pixar style (professional, polished)
- Exaggerated personality traits (what makes them unique)
- Warm, friendly feel

PRESERVE IDENTITY:
- Keep recognizable features (hair, face shape, key characteristics)
- Capture their personality and expression
- Keep what makes them unique
- Maintain their essence

GOAL: Like a Pixar character - cute, expressive, captures their personality perfectly.`,
      
      'anime': `Transform this portrait into ANIME avatar - make it EXPRESSIVE and STYLISH.

PHILOSOPHY: Anime avatars are about style, emotion, and character.

ANIME AVATAR:
- Large expressive eyes (emotion and character)
- Detailed hair (anime-style, dynamic)
- Japanese animation aesthetic (professional, stylish)
- Vibrant colors and shading (anime quality)
- Character and personality (what makes them unique)
- Stylish, cool feel

PRESERVE IDENTITY:
- Keep recognizable features
- Capture their personality
- Keep their unique characteristics
- Maintain their essence

GOAL: Like an anime character - stylish, expressive, captures their character.`,
      
      '3d': `Transform this portrait into 3D RENDERED avatar - make it POLISHED and PROFESSIONAL.

PHILOSOPHY: 3D avatars are about quality, polish, and personality.

3D AVATAR:
- Smooth surfaces (Pixar-quality rendering)
- Professional 3D character design (polished, high-quality)
- Realistic lighting and shading (professional 3D)
- Vibrant, appealing colors (eye-catching)
- Personality and warmth (not robotic)
- Professional, polished feel

PRESERVE IDENTITY:
- Keep recognizable features
- Capture their personality
- Keep their warmth and humanity
- Maintain their essence

GOAL: Like a Pixar/Disney 3D character - polished, professional, full of personality.`,
      
      'pixel': `Transform this portrait into PIXEL ART avatar - make it RETRO and COOL.

PHILOSOPHY: Pixel art is about nostalgia, simplicity, and charm.

PIXEL ART AVATAR:
- 8-bit/16-bit retro game style (nostalgic, cool)
- Limited color palette (retro aesthetic)
- Simplified but recognizable (pixel art charm)
- Retro gaming feel (nostalgic, fun)
- Character and personality (even in pixels)
- Cool, retro vibe

PRESERVE IDENTITY:
- Keep recognizable features (even simplified)
- Capture their personality
- Keep their unique characteristics
- Maintain their essence

GOAL: Like a retro game character - cool, nostalgic, captures their personality in pixels.`,
      
      'minimalist': `Transform this portrait into MINIMALIST LINE ART avatar - make it ELEGANT and MODERN.

PHILOSOPHY: Minimalist avatars are about simplicity and elegance.

MINIMALIST AVATAR:
- Simple clean lines (elegant, modern)
- Geometric shapes (simplified, stylish)
- Modern design (contemporary, sophisticated)
- Minimal colors (clean, elegant)
- Essential features only (less is more)
- Elegant, sophisticated feel

PRESERVE IDENTITY:
- Keep recognizable features (simplified)
- Capture their essence
- Keep their unique characteristics
- Maintain their personality

GOAL: Like modern minimalist art - elegant, simple, captures their essence beautifully.`,
      
      'cyberpunk': `Transform this portrait into CYBERPUNK avatar - make it FUTURISTIC and EDGY.

PHILOSOPHY: Cyberpunk avatars are about future, technology, and attitude.

CYBERPUNK AVATAR:
- Neon colors (pink, blue, purple glow)
- Futuristic elements (tech, cybernetic, sci-fi)
- Sci-fi aesthetic (Blade Runner inspired)
- Edgy, cool vibe (attitude and style)
- Tech-enhanced features (futuristic)
- Bold, confident feel

PRESERVE IDENTITY:
- Keep recognizable features
- Capture their personality
- Keep their attitude and character
- Maintain their essence

GOAL: Like a cyberpunk character - futuristic, edgy, captures their personality with attitude.`,

      'professional': `Create a PROFESSIONAL REALISTIC HEADSHOT AVATAR from this specific person.

CRITICAL GOAL:
- This must remain the SAME PERSON, clearly recognizable
- This is NOT a cartoon, NOT anime, NOT illustration
- Create a clean professional profile/avatar photo suitable for LinkedIn, website profile, or business use

PRESERVE IDENTITY EXACTLY:
- Keep the exact face shape
- Keep eye shape, nose, mouth, eyebrows recognizable
- Keep hairstyle recognizable
- Keep skin tone natural
- Keep this person's unique facial characteristics

PROFESSIONAL AVATAR STYLE:
- Realistic photography look
- Clean background or simple studio background
- Professional lighting
- Clear head-and-shoulders composition
- Polished but natural appearance
- Slight cleanup only, no heavy beautification
- Sharp, trustworthy, premium profile-photo quality

FORBIDDEN:
- Do NOT turn into cartoon or illustration
- Do NOT change identity
- Do NOT over-stylize
- Do NOT add sunglasses, hats, masks, or face-covering accessories
- Do NOT make it look like a different person

GOAL: A realistic professional avatar/headshot of the same person.`,
    };
    
    const prompt = avatarStyles[avatarStyle] || avatarStyles['professional'];

    // 添加重试机制 - 最多重试 3 次
    let base64Data = null;
    let lastError = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
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
              temperature: 0.6 + (attempt - 1) * 0.05,
              topK: 40,
              topP: 0.95
            }
          })
        });

        const data = await apiResponse.json();
        
        if (!apiResponse.ok) {
          lastError = data.error?.message || 'Gemini API Error';
          console.error(`Attempt ${attempt} - Gemini API error:`, data);
          
          // 如果是地区限制错误，不重试
          if (lastError.includes('location') || lastError.includes('region')) {
            return NextResponse.json({ 
              error: 'This feature is not available in your region. Please try other avatar styles.' 
            }, { status: 403 });
          }
          
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          return NextResponse.json({ error: lastError }, { status: apiResponse.status });
        }

        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p: any) => p.inlineData);
        base64Data = imagePart?.inlineData?.data;
        
        if (base64Data) {
          break;
        }
        
        lastError = 'No image data returned from AI';
        console.error(`Attempt ${attempt} - No image data returned`);
        
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      } catch (error: any) {
        lastError = error.message;
        console.error(`Attempt ${attempt} - Error:`, error);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    if (!base64Data) {
      return NextResponse.json({ 
        error: `Failed after 3 attempts: ${lastError}` 
      }, { status: 500 });
    }

    const fullBase64 = `data:image/png;base64,${base64Data}`;
    
    // 尝试上传到 R2
    const r2Url = await uploadToR2(fullBase64, 'avatar');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        avatarStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        avatarStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Avatar generation error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
