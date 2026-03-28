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

async function uploadToR2(base64Data: string, prefix: string = 'filter'): Promise<string | null> {
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
    const { imageUrl, filterType = 'warm' } = await req.json();
    
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
    
    // AI滤镜效果 - 2026-03-07 优化：更明确的指令
    const filterPrompts: Record<string, string> = {
      'warm': 'Transform this image with a warm color filter. Apply golden and orange tones throughout. Increase warmth in highlights. Create a cozy, inviting atmosphere. Similar to Instagram warm filter. Return the modified image.',
      'cool': 'Transform this image with a cool color filter. Apply blue and cyan tones throughout. Increase coolness in shadows. Create a fresh, calm atmosphere. Similar to Instagram cool filter. Return the modified image.',
      'vivid': 'Transform this image with a vivid color filter. Significantly increase color saturation. Boost contrast and vibrancy. Make colors pop and stand out. Similar to Instagram vivid filter. Return the modified image.',
      'bw': 'Transform this image to black and white. Convert to monochrome with high contrast. Preserve details and textures. Create dramatic lighting. Professional black and white photography style. Return the modified image.',
      'vintage': 'Transform this image with a vintage film filter. Apply faded colors and slight sepia tone. Add subtle film grain texture. Create retro 1970s-80s aesthetic. Vintage film photography look. Return the modified image.',
      'cinematic': 'Transform this image with cinematic color grading. Apply movie-like color tones with teal shadows and orange highlights. Increase contrast and drama. Professional film color grade. Return the modified image.',
      'sunset': 'Transform this image with a sunset filter. Apply warm orange, pink, and golden tones. Create golden hour lighting effect. Romantic and dreamy atmosphere. Return the modified image.',
      'moody': 'Transform this image with a moody filter. Darken overall tones, increase shadows. Apply cool dark tones with muted colors. Create atmospheric and dramatic feel. Moody photography aesthetic. Return the modified image.',
      'lo-fi-film': 'Transform this image with an authentic lo-fi analog film aesthetic — the #1 trending look of 2026. Apply: visible film grain (15-20% intensity), slight color shift toward warm amber in midtones, lifted blacks (faded shadow floor), subtle light leak on one edge (warm orange or pink), soft halation around highlights, slightly desaturated overall with pops of warm color. The effect should feel like a real 35mm photo shot on expired Kodak Gold film. Imperfect, authentic, nostalgic. Return the modified image.',
      'golden-hour': 'Transform this image with a magic golden hour filter — the most shareable lighting aesthetic on social media. Apply: intense warm amber and golden tones flooding from one side, glowing skin tones with bronze warmth, soft lens flare artifacts, rich deep shadows with warm undertones, bokeh-style soft glow on highlights, the light feels like the last 20 minutes before sunset. Cinematic, romantic, luminous. Return the modified image.',
      'cinematic-iphone': 'Transform this image with professional iPhone Cinematic Mode color grading — the TikTok/Instagram aesthetic of 2026. Apply: subtle teal-to-green color cast in shadows, warm orange skin tones, slightly desaturated highlights, lifted midtones (filmic rather than crushed), very subtle vignette (10%), shallow depth-of-field suggestion through softened edges, overall feeling of an expensive Netflix show shot on iPhone. Clean, modern, professional. Return the modified image.',
      'moody-seoul': 'Transform this image with a K-drama Seoul night aesthetic — cinematic and atmospheric. Apply: cool blue-purple shadows, warm skin tones that contrast beautifully against cool backgrounds, high contrast with detail preserved in both shadows and highlights, subtle color bleeding at light sources, neon-lit urban night feel without adding artificial lights, cinematic widescreen energy, the emotional palette of a Park Chan-wook film. Mysterious, romantic, cinematic. Return the modified image.',
      'cinematic-bw': 'Transform this image into a cinematic black and white masterpiece — the prestige film noir aesthetic of 2026. Apply: rich, deep blacks with luminous whites and full tonal range, pronounced grain (8-12% intensity) for authentic film stock feel, high-contrast dramatic lighting that sculpts faces and forms, lifted midtones preserving texture in both highlights and shadows, subtle vignette to draw focus, the monochromatic depth of a Roger Deakins-lit feature film. Avoid flat or digital-looking grey — this should feel like 35mm Kodak Tri-X pushed one stop. Timeless, cinematic, gallery-quality. Return the modified image.',
      'instagram-bw': 'Transform this image with a modern Instagram black and white filter — clean, high-impact, social-media optimized. Apply: punchy contrast with bright whites and deep shadows, smooth skin tones with natural texture preserved, slightly softened mid-range for flattering portrait quality, minimal grain (3-5%) for a polished digital look, enhanced sharpness on edges and details, the crisp monochrome aesthetic dominating Instagram Reels in 2026. Looks great as a thumbnail — sharp, modern, professional. Return the modified image.',
      'neon-aura': 'Transform this image with the viral Neon Aura portrait effect — the most shared AI filter trend of early 2026. Apply: a luminous, ethereal glow emanating from the subject, vivid neon accents (electric purple, cyan, hot pink) bleeding into the background at light sources, deep dark background with dramatic contrast, subject skin rendered beautifully luminous as if lit by neon signs, dreamy bokeh-like halo effect, fantasy-portrait energy. The subject should look radiant and otherworldly — like a music artist promo shoot shot in a neon-lit studio. Highly shareable, visually striking. Return the modified image.',
      'brainrot-vhs': 'Transform this image with a chaotic brainrot VHS glitch effect — the absurdist viral aesthetic dominating TikTok #AIbrainrot in 2026. Apply: heavy VHS scan lines and interlace artifacts, aggressive color channel separation (red/green/blue misalignment), blown-out whites and crushed blacks, distorted edge warping on 1-2 sides, faded washed-out palette of a badly dubbed 90s tape, random glitch blocks, timestamp overlay aesthetic (optional), chaotic and funny energy. Intentionally imperfect and chaotic — that IS the aesthetic. Nostalgic, absurd, highly shareable. Return the modified image.',
      'clay-pastel': 'Transform this image with a soft Claymation pastel filter — the cozy viral aesthetic trending on Instagram and Pinterest in 2026. Apply: matte clay-like texture on all surfaces, soft rounded edges and forms, muted pastel color palette (lavender, peach, mint, baby blue), warm diffused studio lighting with no harsh shadows, subtle fingerprint/handcrafted texture impression, playful 3D stop-motion aesthetic, Pixar-adjacent warmth and charm. Everything should look like it was lovingly sculpted from clay. Adorable, unique, highly shareable. Return the modified image.',
    };
    
    const prompt = filterPrompts[filterType] || filterPrompts['warm'];

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
              temperature: 0.4 + (attempt - 1) * 0.05,
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
              error: 'This feature is not available in your region. Please try other filters.' 
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
    const r2Url = await uploadToR2(fullBase64, 'filter');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        filterType
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        filterType
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Filter error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
