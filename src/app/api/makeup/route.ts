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

async function uploadToR2(base64Data: string, prefix: string = 'makeup'): Promise<string | null> {
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
    const { imageUrl, makeupStyle = 'natural' } = await req.json();
    
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
    
    // 妆容风格 - 2026-03-07 Week 4 优化：情感化、真实感
    const makeupPrompts: Record<string, string> = {
      'natural': `Apply NATURAL makeup to this face - enhance beauty, don't hide it.

PHILOSOPHY: Natural makeup enhances, not masks. You're beautiful already.

NATURAL MAKEUP:
- Light, breathable foundation (even skin tone, keep natural texture)
- Subtle blush (natural flush, healthy glow)
- Natural lip color (enhance natural lip color, not change it)
- Light mascara (define lashes, not dramatic)
- Groomed brows (natural shape, just defined)
- Fresh, dewy finish (healthy, alive, glowing)

PRESERVE IDENTITY:
- Keep facial features exactly the same
- Maintain natural expressions
- Keep personality and character
- Enhance, don't transform

FORBIDDEN:
- DO NOT over-apply makeup
- DO NOT create artificial perfection
- DO NOT change facial structure
- DO NOT make it look heavily made up

GOAL: Fresh, natural, glowing - like you on your best day. Makeup that says "I woke up like this."`,
      
      'glamorous': `Apply GLAMOROUS makeup to this face - bold, confident, stunning.

PHILOSOPHY: Glamorous is about confidence and drama, not fake perfection.

GLAMOROUS MAKEUP:
- Full coverage foundation (flawless base, still natural texture)
- Dramatic eyeshadow (bold colors, expertly blended)
- Bold lipstick (statement lips, confident color)
- False lashes or dramatic mascara (stunning eyes)
- Contouring and highlighting (defined features)
- Red carpet ready (polished, professional)

PRESERVE IDENTITY:
- Keep facial features recognizable
- Maintain personality and character
- Enhance, don't change who they are
- Keep natural expressions

FORBIDDEN:
- DO NOT make it look fake or plastic
- DO NOT change facial structure
- DO NOT lose their identity
- DO NOT make it look costume-like

GOAL: Red carpet glamour - bold, confident, stunning, but still authentically THEM.`,
      
      'smokey': `Apply SMOKEY EYE makeup to this face - dramatic, mysterious, alluring.

PHILOSOPHY: Smokey eyes are about drama and confidence, not hiding.

SMOKEY EYE MAKEUP:
- Dark, blended eyeshadow (smokey gradient, expertly done)
- Winged eyeliner (dramatic, precise)
- Nude or soft lips (balance the dramatic eyes)
- Dramatic lashes (false lashes or heavy mascara)
- Defined brows (frame the eyes)
- Evening-ready look (sophisticated, alluring)

PRESERVE IDENTITY:
- Keep facial features the same
- Maintain personality
- Enhance eyes, don't change face
- Keep natural expressions

FORBIDDEN:
- DO NOT make it look messy or overdone
- DO NOT change facial structure
- DO NOT lose their character
- DO NOT make it look costume-like

GOAL: Dramatic evening look - mysterious, alluring, confident, still recognizably THEM.`,
      
      'korean': `Apply KOREAN K-BEAUTY makeup to this face - fresh, youthful, glowing.

PHILOSOPHY: K-beauty is about healthy, glowing skin and soft features.

K-BEAUTY MAKEUP:
- Dewy, glowing skin (healthy, hydrated look)
- Gradient lips (soft, natural ombre effect)
- Straight, natural brows (soft, youthful)
- Aegyo sal (cute under-eye highlight)
- Soft, natural colors (pinks, corals, soft browns)
- Fresh, youthful aesthetic (innocent, glowing)

PRESERVE IDENTITY:
- Keep facial features the same
- Maintain natural expressions
- Enhance with K-beauty style
- Keep personality

FORBIDDEN:
- DO NOT change facial structure
- DO NOT make it look artificial
- DO NOT lose their identity
- DO NOT over-whiten skin

GOAL: K-beauty glow - fresh, youthful, dewy, healthy. Natural beauty enhanced Korean style.`,
      
      'vintage': `Apply VINTAGE makeup to this face - classic Hollywood glamour.

PHILOSOPHY: Vintage glamour is timeless elegance and confidence.

VINTAGE MAKEUP (1950s Hollywood):
- Classic red lips (bold, matte, perfectly defined)
- Winged eyeliner (cat-eye, precise, dramatic)
- Defined brows (arched, elegant)
- Matte, porcelain skin (flawless, classic)
- Subtle blush (classic placement)
- Timeless elegance (sophisticated, glamorous)

PRESERVE IDENTITY:
- Keep facial features recognizable
- Maintain personality
- Apply vintage style, keep their essence
- Keep natural expressions

FORBIDDEN:
- DO NOT make it look costume-like
- DO NOT change facial structure
- DO NOT lose their identity
- DO NOT make it look fake

GOAL: Classic Hollywood glamour - timeless, elegant, confident. Vintage beauty, still authentically THEM.`,
      
      'editorial': `Apply EDITORIAL makeup to this face - artistic, bold, creative.

PHILOSOPHY: Editorial makeup is art - creative, bold, expressive.

EDITORIAL MAKEUP:
- Artistic and bold (creative expression)
- Creative colors (unexpected, artistic)
- Dramatic features (statement-making)
- Fashion-forward (avant-garde, trendy)
- Magazine-quality (professional, polished)
- Artistic interpretation (creative, unique)

PRESERVE IDENTITY:
- Keep facial features recognizable
- Maintain personality
- Apply artistic makeup, keep their essence
- Show creativity, not transformation

FORBIDDEN:
- DO NOT make it look costume-like
- DO NOT change facial structure completely
- DO NOT lose their identity
- DO NOT make it unwearable

GOAL: Fashion magazine editorial - artistic, bold, creative, but still recognizably THEM. Wearable art.`,

      'glass-skin': `Apply GLASS SKIN makeup to this face - the ultimate K-beauty luminosity trend of 2026.

PHILOSOPHY: Glass skin is not makeup — it's the illusion of perfect skin from within.

GLASS SKIN TECHNIQUE:
- Skin prep glow: intense hydration visible through the skin surface
- Translucent foundation (skin looks like skin, just flawless)
- No-powder finish: dewy, wet-look luminosity throughout
- Poreless appearance without looking filtered
- Strategic highlighter: inner corner eyes, cupid's bow, nose bridge, cheekbones
- Glossy, hydrated lips (clear gloss or sheer tint)
- Barely-there brows (groomed, natural, feathery)
- Minimal eye makeup (lash curl, maybe one coat mascara)
- The overall effect: skin that looks lit from within, like glass

PRESERVE IDENTITY:
- Natural skin tone (enhance, never change)
- Facial features fully visible
- Natural expressions
- Their authentic beauty amplified

FORBIDDEN:
- DO NOT add heavy coverage that masks skin
- DO NOT use matte finish
- DO NOT add dramatic eye or lip looks
- DO NOT change skin tone

GOAL: Hyper-luminous, dewy, poreless glass skin — the K-beauty Holy Grail. Skin so hydrated it looks reflective.`,

      'clean-girl': `Apply CLEAN GIRL aesthetic makeup - the defining minimalist beauty trend.

PHILOSOPHY: Clean girl is effortless, natural, intentional. "I woke up like this" but better.

CLEAN GIRL MAKEUP:
- Skin: light coverage tinted moisturizer, natural finish, real skin texture visible
- Brows: full, brushed-up, fluffy and natural (laminated brow effect)
- Eyes: no eyeshadow — just curled lashes, thin mascara or none
- Lips: clear or barely-tinted gloss, natural lip color
- Cheeks: light, natural-placement blush (no contouring)
- Highlight: subtle, natural-looking glow on cheekbones only
- Hair (if visible): slicked back bun or effortless ponytail implied by styling
- Overall: polished but not trying, expensive-looking simplicity

PRESERVE IDENTITY:
- Natural skin tone and texture
- Full facial features
- Their authentic look

FORBIDDEN:
- DO NOT add heavy or dramatic elements
- DO NOT contour aggressively
- DO NOT use bold eye or lip colors
- DO NOT make it look like "no makeup" — it should look intentionally minimal

GOAL: The clean girl aesthetic — effortless, natural, glowy. Looks expensive, feels effortless.`
    };
    
    const prompt = makeupPrompts[makeupStyle] || makeupPrompts['natural'];

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
    const r2Url = await uploadToR2(fullBase64, 'makeup');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        makeupStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        makeupStyle
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Makeup try-on error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
