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

    // 表情包模板 - 2026-03-07 Week 4 优化：情感化、真实感
    const templatePrompts: Record<string, string> = {
      'funny': `Create a FUNNY meme image - make people LAUGH and SHARE.

PHILOSOPHY: Great memes are relatable, funny, and instantly shareable.

MEME TEXT: "${text}"

FUNNY MEME DESIGN:
- Bold white text with black outline (classic meme font)
- Text at top and/or bottom (traditional meme layout)
- Funny, relatable image (humor, irony, or absurdity)
- Internet meme aesthetic (recognizable meme style)
- Shareable and viral-worthy (makes people want to share)
- Humorous and entertaining

MEME QUALITY:
- Clear, readable text (easy to read at any size)
- Funny image that matches the text
- Relatable humor (people get it immediately)
- Shareable format (perfect for social media)
- Classic meme style

GOAL: Like a viral meme - funny, relatable, makes people laugh and share immediately.`,
      
      'motivational': `Create a MOTIVATIONAL meme image - INSPIRE and UPLIFT.

PHILOSOPHY: Motivational memes inspire action and positive change.

MEME TEXT: "${text}"

MOTIVATIONAL DESIGN:
- Inspiring background (nature, sunrise, mountains, success imagery)
- Elegant, readable typography (inspiring font style)
- Positive, uplifting colors (warm, energetic, hopeful)
- Motivational aesthetic (professional, inspiring)
- Shareable inspiration (makes people want to share positivity)
- Empowering and encouraging

EMOTIONAL TONE:
- Inspiring and uplifting
- Positive and empowering
- Motivational energy
- Hope and possibility
- Action-oriented

GOAL: Like an inspiring quote image - motivational, uplifting, makes people feel empowered.`,
      
      'sarcastic': `Create a SARCASTIC meme image - make people LAUGH with IRONY.

PHILOSOPHY: Sarcastic memes use irony and wit to entertain.

MEME TEXT: "${text}"

SARCASTIC MEME DESIGN:
- Ironic, sarcastic image (visual irony)
- Classic meme font (bold white with black outline)
- Internet meme aesthetic (recognizable sarcasm style)
- Witty and clever (smart humor)
- Shareable sarcasm (relatable irony)
- Funny through contrast

SARCASTIC TONE:
- Ironic and witty
- Clever humor
- Relatable sarcasm
- Smart and funny
- Internet culture

GOAL: Like a sarcastic internet meme - ironic, witty, makes people laugh at the truth.`,
      
      'wholesome': `Create a WHOLESOME meme image - spread JOY and POSITIVITY.

PHILOSOPHY: Wholesome memes make the internet a better place.

MEME TEXT: "${text}"

WHOLESOME MEME DESIGN:
- Cute, heartwarming image (animals, kindness, love)
- Soft, friendly colors (warm, inviting, positive)
- Wholesome aesthetic (pure, innocent, kind)
- Positive energy (uplifting, heartwarming)
- Shareable positivity (makes people smile)
- Pure and genuine

EMOTIONAL TONE:
- Heartwarming and kind
- Positive and uplifting
- Pure and innocent
- Genuine goodness
- Spreads joy

GOAL: Like a wholesome internet meme - cute, heartwarming, makes people smile and feel good.`,

      'brainrot': `Create a BRAINROT surrealist meme image - chaotic, absurd, TikTok viral energy.

PHILOSOPHY: Brainrot memes embrace absurdism, unexpected mashups, and chaotic humor. The more surreal and unexpected, the better.

MEME TEXT: "${text}"

BRAINROT MEME DESIGN:
- Photorealistic but absurd subject matter (unexpected animal/object mashups, surreal scenarios)
- Chaotic, unhinged visual composition that somehow works
- Bold Impact-style meme text with maximum irony
- Colors: slightly oversaturated, chaotic energy
- Deep fried meme aesthetic optional (slightly overexposed, high contrast)
- The kind of image that makes people stop scrolling and say "what am I looking at"

BRAINROT ENERGY:
- Unexpected, unhinged, absurdist humor
- Photorealistic quality making absurdity even funnier
- Perfect for TikTok/Instagram Reels comment sections
- Instantly recognizable as peak 2026 internet culture
- Maximum shareability through pure chaos

GOAL: Viral TikTok brainrot meme energy — absurd, chaotic, photorealistic, impossible NOT to share.`,
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
