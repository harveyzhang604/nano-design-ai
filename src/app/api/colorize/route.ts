import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, colorStyle = 'natural' } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);
    
    const colorStyles: Record<string, string> = {
      natural: `Colorize this black and white photograph - bring LIFE and MEMORY back to it.

PHILOSOPHY: This is someone's memory. Treat it with respect and care.

NATURAL COLORIZATION:
- Analyze the era, clothing, environment carefully
- Apply historically accurate, period-appropriate colors
- Use realistic, warm skin tones (people had life, not plastic)
- Natural fabric colors (clothes had texture and character)
- Authentic environmental hues (nature was real)
- Smooth, natural color transitions (no harsh boundaries)

PRESERVE HISTORY:
- Keep ALL original details and textures
- Maintain the photo's character and soul
- Preserve tonal values and depth
- Keep the emotional connection to the past

FORBIDDEN:
- DO NOT over-saturate (keep it believable)
- DO NOT make it look artificial or fake
- DO NOT lose the historical authenticity
- DO NOT erase the photo's character

GOAL: Like the photo was taken in color - natural, authentic, alive. Bring the memory back to LIFE.`,
      
      vibrant: `Colorize this black and white photo with RICH, VIBRANT colors - but keep it REAL.

PHILOSOPHY: Vibrant doesn't mean fake. Life was colorful and full of energy.

VIBRANT COLORIZATION:
- Rich, saturated colors (life was vivid)
- Bold but natural colors for clothing and objects
- Realistic skin tones (warm, alive, human)
- Eye-catching but believable colors
- Smooth color transitions (no harsh edges)
- Energy and life in every color

PRESERVE AUTHENTICITY:
- Keep it believable and real
- Maintain historical accuracy
- Preserve all details and textures
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look cartoonish
- DO NOT lose realism
- DO NOT create artificial colors

GOAL: Like a vivid memory - colorful, energetic, but still REAL and authentic.`,
      
      vintage: `Colorize this black and white photo with AUTHENTIC VINTAGE colors - capture NOSTALGIA.

PHILOSOPHY: This is a window to the past. Show how it really looked.

VINTAGE COLORIZATION:
- Authentic 1950s-1960s color palette
- Slightly faded, nostalgic tones (aged photo feel)
- Period-accurate colors for clothing and environment
- Warm, aged color grading (time has passed)
- Soft color transitions (gentle, nostalgic)
- Preserve vintage photograph aesthetic

PRESERVE MEMORY:
- Keep historical authenticity
- Maintain the era's character
- Preserve all details and textures
- Keep emotional connection to the past

FORBIDDEN:
- DO NOT modernize the colors
- DO NOT make it look new
- DO NOT lose the vintage soul

GOAL: Like a treasured old color photo - nostalgic, authentic, timeless. A window to the PAST.`,
      
      warm: `Colorize this black and white photo with WARM, GOLDEN colors - create WARMTH and COMFORT.

PHILOSOPHY: Warm colors evoke emotion, memory, comfort.

WARM COLORIZATION:
- Golden yellows, amber, soft oranges
- Warm browns and earth tones
- Natural skin tones with warm undertones (alive, human)
- Cozy, inviting atmosphere
- Smooth, gentle color blending
- Emotional warmth in every tone

PRESERVE HUMANITY:
- Keep people looking real and alive
- Maintain natural details
- Preserve emotional connection
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look artificial
- DO NOT over-warm (keep it natural)
- DO NOT lose realism

GOAL: Like a warm memory - comforting, inviting, emotionally warm. Photo that feels like HOME.`,
      
      cool: `Colorize this black and white photo with COOL, SERENE colors - create CALM and PEACE.

PHILOSOPHY: Cool colors evoke calm, serenity, timelessness.

COOL COLORIZATION:
- Blues, teals, cool grays
- Subtle purples and cool tones
- Natural skin tones with cool undertones (still alive, still human)
- Calm, serene atmosphere
- Smooth color transitions
- Peaceful, timeless feel

PRESERVE HUMANITY:
- Keep people looking real and alive
- Maintain natural details
- Preserve emotional connection
- Keep the photo's soul

FORBIDDEN:
- DO NOT make it look cold or lifeless
- DO NOT over-cool (keep it natural)
- DO NOT lose warmth and humanity

GOAL: Like a peaceful memory - calm, serene, timeless. Photo that feels PEACEFUL.`,
    };
    
    const prompt = colorStyles[colorStyle] || colorStyles.natural;

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.35,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'colorize');
    
    return NextResponse.json({ 
      imageUrl: r2Url || fullBase64, 
      isR2: !!r2Url,
      colorStyle: colorStyle || 'natural'
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error: any) {
    console.error('Colorize error:', error);
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
