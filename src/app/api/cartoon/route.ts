import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, style = 'anime' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const stylePrompts: Record<string, string> = {
      'anime': `Convert this photo to beautiful Japanese anime/manga style.
PRESERVE EXACTLY:
- Facial features and expressions
- Eye direction and emotion
- Pose and body position
- Hair style and color
- Clothing and accessories

ANIME STYLE RENDERING:
- Smooth, clean lines
- Vibrant, saturated colors
- Slightly larger, expressive eyes
- Soft shading and highlights
- Anime-style hair rendering
- Delicate facial features

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT add elements that weren't there
- Do NOT change the pose or composition
- Do NOT alter the character's identity

GOAL: Transform into anime style while keeping the person recognizable.`,

      'american': `Convert this photo to American cartoon/comic style.
PRESERVE EXACTLY:
- Facial features and expressions
- Character personality
- Pose and gesture
- Clothing and details

AMERICAN CARTOON STYLE:
- Bold, thick outlines
- Simplified but expressive features
- Vibrant, flat colors
- Exaggerated but natural proportions
- Comic book shading style
- Dynamic and energetic feel

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT add elements that weren't there
- Do NOT change the character's essence

GOAL: Western cartoon style while maintaining recognizability.`,

      '3d': `Convert this photo to 3D animated character style (Pixar/Disney).
PRESERVE EXACTLY:
- Facial features and expressions
- Character personality
- Pose and gesture
- Key characteristics

3D ANIMATION STYLE:
- Smooth, rounded forms
- Soft, realistic lighting
- Detailed textures
- Expressive, slightly stylized features
- Professional 3D rendering quality
- Warm, appealing colors

FORBIDDEN:
- Do NOT change facial expressions
- Do NOT alter the character's identity
- Do NOT add unrealistic elements

GOAL: High-quality 3D animated character while keeping recognizable.`,

      'chibi': `Convert this photo to cute chibi/SD (super deformed) style.
PRESERVE:
- Basic facial features
- Character identity
- Clothing style
- Key accessories

CHIBI STYLE:
- Large head, small body (2:1 ratio)
- Big, sparkling eyes
- Simplified features
- Cute, rounded shapes
- Soft pastel colors
- Adorable expression

ALLOWED CHANGES:
- Proportions (chibi style)
- Simplification of details
- Cuter expression

GOAL: Adorable chibi version while maintaining character identity.`,

      'chatgpt': `Convert this photo to ChatGPT official avatar style - the iconic minimalist geometric portrait style.

CHATGPT STYLE CHARACTERISTICS:
- Geometric, simplified shapes
- Flat, solid colors with minimal gradients
- Clean, modern vector art aesthetic
- Circular composition (portrait in a circle)
- Limited color palette (2-4 main colors)
- Abstract but recognizable features
- Professional, friendly, approachable feel
- Minimalist line work
- Smooth, rounded shapes
- No texture or noise - pure flat design

PRESERVE IDENTITY:
- Basic facial structure and proportions
- Hair style and color (simplified)
- Key identifying features
- Overall character essence
- Facial expression and mood

STYLE EXECUTION:
- Use geometric shapes (circles, ovals, curves)
- Simplify features to essential elements
- Flat color blocks with subtle gradients
- Clean edges and smooth curves
- Modern, tech-friendly aesthetic
- Professional illustration quality

COLOR PALETTE:
- Use 2-4 harmonious colors
- Prefer soft, modern colors
- Avoid overly bright or neon colors
- Create visual balance and harmony

FORBIDDEN:
- Do NOT add realistic details or textures
- Do NOT use complex shading
- Do NOT make it look hand-drawn or sketchy
- Do NOT lose the person's core identity
- Do NOT make it too abstract to recognize

GOAL: Create a clean, modern, geometric portrait in the style of ChatGPT's official avatar design - minimalist, professional, and instantly recognizable.`
    };
    

    const prompt = stylePrompts[style] || stylePrompts['anime'];

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.4,
      topK: 32,
      topP: 0.9,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, `cartoon-${style}`);

    return NextResponse.json({
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'cartoon',
      style,
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('Cartoon generation error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
