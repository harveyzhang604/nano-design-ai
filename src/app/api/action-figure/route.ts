import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const runtime = 'edge';

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

async function uploadToR2(base64Data: string, prefix: string = 'action-figure'): Promise<string | null> {
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
    const { imageUrl, style = 'marvel-legends', scale = '6-inch', articulation = 'high', packaging = 'window-box', pose = 'dynamic' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.' 
      }, { status: 500 });
    }

    const imageBase64 = await imageToBase64(imageUrl);
    
    // 手办系列风格
    const actionFigureStyles: Record<string, string> = {
      'marvel-legends': `MARVEL LEGENDS ACTION FIGURE STYLE
- High-quality 6-inch scale collectible action figure
- Detailed sculpting with realistic proportions
- Multiple points of articulation (30+ joints)
- Vibrant, comic-accurate paint applications
- Heroic, dynamic character design
- Collector-grade quality with fine details
- Modern action figure aesthetic
- Premium plastic materials with matte finish`,

      'hot-toys': `HOT TOYS 1/6 SCALE COLLECTIBLE FIGURE
- Ultra-realistic 12-inch premium collectible
- Movie-accurate facial sculpting and likeness
- Hyper-detailed costume with real fabric materials
- 50+ points of articulation for maximum posability
- Weathering effects and battle damage details
- Premium paint applications with subtle shading
- Museum-quality presentation
- Cinematic realism and craftsmanship`,

      'neca': `NECA ACTION FIGURE STYLE
- Classic 7-inch scale action figure
- Highly detailed sculpting with textured surfaces
- 25+ points of articulation
- Realistic paint washes and weathering
- Character-accurate proportions and details
- Collector-focused design
- Durable plastic construction
- Action-oriented poses and accessories`,

      'figma': `FIGMA JAPANESE ACTION FIGURE STYLE
- Anime/manga-inspired 6-inch figure
- Clean, stylized sculpting with smooth surfaces
- Ultra-posable with 35+ articulation points
- Vibrant, cel-shaded paint style
- Interchangeable face plates and hands
- Dynamic action poses
- Japanese collectible aesthetic
- Glossy finish with sharp details`,

      'vintage': `VINTAGE 1980s ACTION FIGURE STYLE
- Classic 3.75-inch retro action figure
- Simplified sculpting with nostalgic charm
- Basic 5-point articulation (neck, shoulders, hips)
- Bold, toy-like paint applications
- Chunky, durable plastic construction
- Retro packaging aesthetic
- Nostalgic 80s toy design
- Collectible vintage appeal`
    };

    // 姿势描述
    const poseDescriptions: Record<string, string> = {
      'neutral': 'standing in neutral museum pose with arms at sides',
      'dynamic': 'dynamic action pose with movement and energy',
      'heroic': 'heroic power pose with confident stance',
      'battle': 'intense battle-ready pose with aggressive stance'
    };

    // 包装描述
    const packagingDescriptions: Record<string, string> = {
      'none': 'displayed without packaging on neutral background',
      'window-box': 'displayed in collector window box packaging with visible figure',
      'blister': 'mounted on vintage blister card packaging',
      'premium': 'presented in premium collector box with artistic backdrop'
    };

    const prompt = `Transform this into a collectible action figure product photo.

ACTION FIGURE STYLE: ${actionFigureStyles[style]}

CRITICAL ACTION FIGURE CHARACTERISTICS:
- Plastic toy material with visible joints and articulation points
- Sculpted details with panel lines and seams
- Action figure proportions (slightly stylized, heroic build)
- Visible ball joints, hinges, and articulation mechanisms
- Toy-like quality with collectible appeal
- Product photography lighting and presentation

SCALE: ${scale} collectible figure
ARTICULATION: ${articulation} articulation with visible joints
POSE: ${poseDescriptions[pose]}
PACKAGING: ${packagingDescriptions[packaging]}

MATERIAL DETAILS:
- Hard plastic construction with matte or glossy finish
- Visible articulation points (ball joints, hinges, swivels)
- Sculpted costume details and textures
- Paint applications with panel lining and shading
- Slight toy-like simplification while maintaining detail

PRESENTATION:
- Professional product photography setup
- Clean, well-lit studio environment
- Neutral or themed background
- Sharp focus on figure details
- Collector display aesthetic

PACKAGING ENHANCEMENT:
- Clear plastic blister window with realistic reflections and glare
- Cardboard backing with character artwork, logo, and series branding
- \"Limited Edition\" or \"Collector Series\" label if premium packaging
- Barcode, age rating, and manufacturer details on packaging
- Authentic retail toy store shelf presentation

IDENTITY PRESERVATION:
- The figure MUST be recognizable as the person in the input image
- Preserve facial features, hair color, and distinctive characteristics
- Translate their clothing/outfit into accurate action figure costume
- Maintain their core identity in sculpted form

STYLE: Premium collectible action figure product photography with authentic retail packaging.
GOAL: Authentic toy collectible — looks like it just came off a toy store shelf, with the person's likeness perfectly captured in plastic.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: 'image/png', data: imageBase64.split(',')[1] } }
            ]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.9,
            maxOutputTokens: 8192,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return NextResponse.json({ 
        error: `Gemini API error: ${response.status}` 
      }, { status: response.status });
    }

    const data = await response.json();
    
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p: any) => p.inlineData);
    const generatedImageBase64 = imagePart?.inlineData?.data;
    
    if (!generatedImageBase64) {
      return NextResponse.json({ 
        error: 'No image data in response' 
      }, { status: 500 });
    }

    const generatedImageDataUrl = `data:image/png;base64,${generatedImageBase64}`;
    const r2Url = await uploadToR2(generatedImageDataUrl, 'action-figure');
    
    return NextResponse.json({ 
      success: true,
      imageUrl: r2Url || generatedImageDataUrl
    });

  } catch (error) {
    console.error('Action figure error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
