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

async function uploadToR2(base64Data: string, prefix: string = 'card'): Promise<string | null> {
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
    const { message, occasion = 'birthday', recipientName } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 贺卡场景 - 2026-03-07 Week 4 优化：情感化、真实感
    const occasionPrompts: Record<string, string> = {
      'birthday': `Create a BEAUTIFUL birthday greeting card - make them feel SPECIAL and LOVED.

PHILOSOPHY: Great birthday cards make people smile and feel celebrated.

BIRTHDAY CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Colorful balloons and confetti (joyful, festive)
- Birthday cake or candles (celebration)
- Warm, happy colors (vibrant, cheerful)
- Festive decorations (party atmosphere)
- Professional card design (polished, beautiful)

EMOTIONAL TONE:
- Joyful and celebratory
- Warm and loving
- Makes them feel special
- Shareable and memorable
- Heartfelt celebration

GOAL: Like a Hallmark card - beautiful, heartfelt, makes them feel celebrated and loved.`,
      
      'christmas': `Create a WARM Christmas greeting card - spread HOLIDAY JOY and LOVE.

PHILOSOPHY: Christmas cards bring warmth, joy, and connection.

CHRISTMAS CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Snow and winter wonderland (magical, peaceful)
- Christmas tree with warm lights (cozy, festive)
- Festive red and green colors (traditional, warm)
- Holiday decorations (ornaments, stars, wreaths)
- Cozy, warm atmosphere (home, family, love)

EMOTIONAL TONE:
- Warm and cozy
- Joyful and peaceful
- Holiday magic
- Family and love
- Heartfelt wishes

GOAL: Like a classic Christmas card - warm, magical, spreads holiday joy and love.`,
      
      'new-year': `Create an ELEGANT New Year greeting card - celebrate NEW BEGINNINGS with HOPE.

PHILOSOPHY: New Year cards inspire hope, dreams, and fresh starts.

NEW YEAR CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Fireworks and celebration (excitement, new beginnings)
- Champagne or sparkles (elegance, celebration)
- Gold and silver colors (elegant, premium)
- Midnight celebration theme (hope, dreams)
- Elegant, sophisticated design (classy, inspiring)

EMOTIONAL TONE:
- Hopeful and inspiring
- Elegant and celebratory
- New beginnings
- Dreams and possibilities
- Optimistic future

GOAL: Like a premium New Year card - elegant, inspiring, celebrates new beginnings with hope.`,
      
      'valentine': `Create a ROMANTIC Valentine's Day card - express LOVE and AFFECTION.

PHILOSOPHY: Valentine cards express love, romance, and deep connection.

VALENTINE CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Hearts and roses (love, romance)
- Romantic red and pink colors (passion, affection)
- Love theme (romantic, heartfelt)
- Elegant typography (beautiful, romantic)
- Warm, loving atmosphere (intimate, special)

EMOTIONAL TONE:
- Romantic and loving
- Heartfelt and sincere
- Passionate yet elegant
- Deep connection
- Special and intimate

GOAL: Like a romantic Valentine card - beautiful, heartfelt, expresses love perfectly.`,
      
      'thank-you': `Create a HEARTFELT thank you card - express GENUINE GRATITUDE.

PHILOSOPHY: Thank you cards show appreciation and strengthen connections.

THANK YOU CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Warm, soft colors (gentle, sincere)
- Flowers or nature elements (beauty, growth)
- Grateful theme (appreciation, kindness)
- Elegant and sincere design (tasteful, heartfelt)
- Warm, appreciative atmosphere (genuine, caring)

EMOTIONAL TONE:
- Grateful and sincere
- Warm and appreciative
- Heartfelt thanks
- Genuine connection
- Kindness and care

GOAL: Like a heartfelt thank you card - sincere, warm, expresses genuine gratitude.`,
      
      'congratulations': `Create a JOYFUL congratulations card - celebrate their ACHIEVEMENT and SUCCESS.

PHILOSOPHY: Congratulations cards celebrate achievements and share joy.

CONGRATULATIONS CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Confetti and stars (celebration, success)
- Vibrant, happy colors (joyful, energetic)
- Celebration theme (achievement, pride)
- Exciting, dynamic design (energetic, positive)
- Joyful, celebratory atmosphere (proud, happy)

EMOTIONAL TONE:
- Joyful and celebratory
- Proud and excited
- Positive energy
- Shared happiness
- Achievement celebration

GOAL: Like an exciting congratulations card - joyful, energetic, celebrates their success.`,
      
      'get-well': `Create a COMFORTING get well soon card - send HEALING WISHES and CARE.

PHILOSOPHY: Get well cards bring comfort, hope, and healing energy.

GET WELL CARD DESIGN:
- Message: "${message}"${recipientName ? ` for ${recipientName}` : ''}
- Soft, gentle colors (calming, peaceful)
- Flowers or nature (healing, hope)
- Healing theme (recovery, strength)
- Warm and comforting design (caring, supportive)
- Peaceful, hopeful atmosphere (gentle, encouraging)

EMOTIONAL TONE:
- Comforting and caring
- Hopeful and encouraging
- Gentle and peaceful
- Healing wishes
- Supportive love

GOAL: Like a caring get well card - comforting, hopeful, sends healing wishes and love.`,
    };
    
    const prompt = occasionPrompts[occasion] || occasionPrompts['birthday'];

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
    const r2Url = await uploadToR2(fullBase64, 'card');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        occasion
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        occasion
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Greeting card error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
