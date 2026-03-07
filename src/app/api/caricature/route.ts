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

async function uploadToR2(base64Data: string, prefix: string = 'caricature'): Promise<string | null> {
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
    const { imageUrl, profession = 'developer', style = 'fun' } = await req.json();
    
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
    
    // 职业相关物品映射
    const professionItems: Record<string, string> = {
      'developer': 'laptops, multiple monitors, coffee mugs, energy drinks, keyboards, mice, headphones, code books, sticky notes, cables, USB drives',
      'designer': 'tablets, stylus pens, color swatches, design books, coffee cups, sketches, mood boards, Pantone guides, brushes, art supplies',
      'teacher': 'books, notebooks, pens, pencils, apple, chalkboard, ruler, globe, certificates, coffee mug, glasses, lesson plans',
      'doctor': 'stethoscope, medical books, prescription pads, coffee, white coat, medical charts, clipboard, pens, medical equipment',
      'chef': 'chef hat, knives, pots, pans, spices, recipe books, apron, vegetables, cooking utensils, cutting boards',
      'musician': 'instruments, sheet music, headphones, microphones, speakers, music notes, coffee, vinyl records, guitar picks',
      'writer': 'typewriter, books, coffee cups, notebooks, pens, papers, manuscripts, reading glasses, desk lamp, crumpled papers',
      'photographer': 'cameras, lenses, tripods, memory cards, photo prints, coffee, laptop, lighting equipment, camera bags',
      'entrepreneur': 'laptop, phone, coffee, business cards, charts, graphs, money symbols, briefcase, notebooks, pens',
      'athlete': 'sports equipment, water bottles, protein shakes, medals, trophies, gym bag, sneakers, towels, stopwatch',
      'artist': 'paint brushes, canvases, paint tubes, palette, easel, coffee, sketchbooks, pencils, art books, sculptures',
      'scientist': 'lab equipment, beakers, microscope, test tubes, books, coffee, lab coat, periodic table, notebooks, calculator',
    };
    
    const items = professionItems[profession] || professionItems['developer'];
    
    // 根据风格调整prompt
    const stylePrompts: Record<string, string> = {
      'fun': `Create a FUN and PLAYFUL caricature portrait based on this photo.

CARICATURE STYLE:
- Exaggerate facial features in a fun, friendly way (bigger eyes, expressive smile, playful proportions)
- Cartoon aesthetic with bold outlines and vibrant colors
- Warm, inviting, humorous feel
- Keep it flattering and positive

PROFESSION THEME (${profession}):
Surround the person with MANY items related to their profession:
${items}

COMPOSITION:
- Person in center, slightly exaggerated features
- Items scattered all around them (floating, stacked, arranged creatively)
- Colorful, energetic background
- Fun, lighthearted atmosphere
- Similar to viral ChatGPT caricature challenge style

IMPORTANT: Make it fun and shareable on social media!`,
      
      'professional': `Create a PROFESSIONAL caricature portrait based on this photo.

CARICATURE STYLE:
- Subtle exaggeration of facial features (maintain professional dignity)
- Clean, polished cartoon aesthetic
- Professional color palette
- Sophisticated and tasteful

PROFESSION THEME (${profession}):
Arrange professional items elegantly around the person:
${items}

COMPOSITION:
- Person in center with subtle caricature features
- Items arranged professionally around them
- Clean, organized layout
- Professional background
- Suitable for LinkedIn or professional profiles

IMPORTANT: Keep it professional yet personable!`,
      
      'artistic': `Create an ARTISTIC caricature portrait based on this photo.

CARICATURE STYLE:
- Creative exaggeration with artistic flair
- Unique art style (watercolor, sketch, or mixed media feel)
- Rich, artistic color palette
- Expressive and creative

PROFESSION THEME (${profession}):
Artistically integrate profession-related elements:
${items}

COMPOSITION:
- Person as the artistic focal point
- Items blended into artistic composition
- Creative, flowing layout
- Artistic background with texture
- Gallery-worthy aesthetic

IMPORTANT: Make it unique and artistic!`,
    };
    
    const prompt = stylePrompts[style] || stylePrompts['fun'];

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
          temperature: 0.8,
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
    const r2Url = await uploadToR2(fullBase64, 'caricature');
    
    if (r2Url) {
      return NextResponse.json({ 
        imageUrl: r2Url, 
        isR2: true,
        mode: 'caricature'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    } else {
      return NextResponse.json({ 
        imageUrl: fullBase64, 
        isR2: false,
        mode: 'caricature'
      }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' }
      });
    }
  } catch (error: any) {
    console.error('Caricature error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
