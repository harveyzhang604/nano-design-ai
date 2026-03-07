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

async function uploadToR2(base64Data: string, prefix: string = 'baby'): Promise<string | null> {
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
    const { parent1Url, parent2Url, babyAge = 'newborn' } = await req.json();
    
    if (!parent1Url || !parent2Url) {
      return NextResponse.json({ error: 'Both parent images are required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    // 婴儿预测 - 2026-03-07 Week 4 优化：情感化、真实感
    const agePrompts: Record<string, string> = {
      'newborn': `Generate a realistic NEWBORN BABY (0-3 months) - imagine their FUTURE CHILD with LOVE.

PHILOSOPHY: Baby predictions are about hope, dreams, and future love.

NEWBORN BABY (0-3 months):
- Combine facial features from both parents naturally
- Soft, delicate baby skin (newborn texture)
- Innocent, peaceful expression (sleeping or calm)
- Tiny features (small nose, soft cheeks)
- Natural baby appearance (real, not artificial)
- Adorable and precious

GENETIC COMBINATION:
- Blend eye color from both parents
- Mix skin tone naturally
- Combine facial structure (nose, mouth, face shape)
- Natural genetic inheritance
- Realistic baby features
- Believable combination

EMOTIONAL TONE:
- Precious and innocent
- Full of hope and love
- Future dreams
- Pure and beautiful
- Heartwarming

GOAL: Like a real newborn photo - precious, innocent, makes you dream of the future with love.`,
      
      '6months': `Generate a realistic 6-MONTH-OLD BABY - imagine their HAPPY, HEALTHY CHILD.

PHILOSOPHY: Baby predictions show hope, joy, and future happiness.

6-MONTH-OLD BABY:
- Combine facial features from both parents naturally
- Chubby baby cheeks (healthy, adorable)
- Bright, curious eyes (alert, happy)
- Happy, playful expression (smiling, joyful)
- Healthy baby appearance (thriving, growing)
- Cute and lovable

GENETIC COMBINATION:
- Blend eye color from both parents
- Mix skin tone naturally
- Combine facial features (nose, mouth, face shape)
- Natural genetic inheritance
- Realistic baby features
- Believable combination

EMOTIONAL TONE:
- Happy and joyful
- Healthy and thriving
- Playful and curious
- Full of life
- Heartwarming

GOAL: Like a real 6-month baby photo - happy, healthy, makes you smile with joy.`,
      
      '1year': `Generate a realistic 1-YEAR-OLD TODDLER - imagine their ADORABLE, PLAYFUL CHILD.

PHILOSOPHY: Toddler predictions show personality, joy, and future adventures.

1-YEAR-OLD TODDLER:
- Combine facial features from both parents naturally
- Cute toddler features (developing personality)
- Playful, curious expression (exploring, learning)
- Healthy, active appearance (growing, thriving)
- Adorable toddler look (cute, lovable)
- Full of personality

GENETIC COMBINATION:
- Blend eye color from both parents
- Mix skin tone naturally
- Combine facial features (nose, mouth, face shape)
- Natural genetic inheritance
- Realistic toddler features
- Believable combination

EMOTIONAL TONE:
- Playful and curious
- Full of personality
- Adventurous spirit
- Growing and learning
- Heartwarming

GOAL: Like a real toddler photo - adorable, playful, makes you excited for the future.`,
    };
    
    const prompt = `${agePrompts[babyAge] || agePrompts['newborn']} Analyze the facial features, skin tone, eye color, and other characteristics from both parent images to create a realistic prediction.`;

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
          temperature: 0.5,
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
    const r2Url = await uploadToR2(fullBase64, 'baby');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        babyAge
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        babyAge
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Baby prediction error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
