import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { imageUrl, style = 'oil-painting' } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'System Error: GEMINI_API_KEY not configured.' }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);

    const stylePrompts: Record<string, string> = {
      'oil-painting': `Transform this image into a CLASSICAL OIL PAINTING - capture EMOTION and SOUL.

ARTISTIC PHILOSOPHY: Great paintings capture feeling, not just appearance.

OIL PAINTING TECHNIQUE:
- Rich, visible brush strokes (you can see the artist's hand)
- Layered paint texture (thick impasto in highlights)
- Warm, vibrant colors (oil paint richness)
- Impressionist light and shadow play
- Artistic interpretation, not photographic copy
- Emotional depth and atmosphere

PRESERVE ESSENCE:
- Keep the subject recognizable
- Capture the mood and feeling
- Show artistic interpretation with soul
- Maintain emotional connection

GOAL: Like a masterpiece in a museum - emotional, soulful, timeless. Art that makes you FEEL.`,
      
      'watercolor': `Transform this image into WATERCOLOR PAINTING - capture SOFTNESS and EMOTION.

ARTISTIC PHILOSOPHY: Watercolor is about feeling, flow, and gentle beauty.

WATERCOLOR TECHNIQUE:
- Soft, flowing edges (water and pigment blend)
- Transparent color layers (light shows through)
- Natural paper texture visible
- Gentle color bleeds and blooms
- Artistic spontaneity and life
- Delicate, dreamy atmosphere

PRESERVE ESSENCE:
- Keep subject recognizable but soft
- Capture gentle mood and feeling
- Show artistic interpretation with warmth
- Maintain emotional softness

GOAL: Like a beautiful watercolor in an art gallery - soft, emotional, dreamy. Art that feels gentle and alive.`,
      
      'cartoon': `Transform this image into CARTOON/ANIME style - capture PERSONALITY and ENERGY.

ARTISTIC PHILOSOPHY: Cartoons exaggerate personality and emotion, not just simplify.

CARTOON TECHNIQUE:
- Bold, expressive outlines (confident lines)
- Vibrant, saturated colors (eye-catching)
- Simplified but expressive features
- Exaggerated emotions and personality
- Dynamic energy and life
- Comic book/anime aesthetic with soul

PRESERVE ESSENCE:
- Keep personality and character
- Exaggerate what makes them unique
- Capture their energy and spirit
- Maintain emotional expression

GOAL: Like a character that comes alive - expressive, energetic, full of personality. Cartoon with SOUL.`,
      
      'sketch': `Transform this image into PENCIL SKETCH - capture ESSENCE and CHARACTER.

ARTISTIC PHILOSOPHY: Great sketches capture soul with minimal lines.

SKETCH TECHNIQUE:
- Confident, expressive line work
- Detailed shading with cross-hatching
- Black and white with rich tones
- Artistic interpretation, not tracing
- Visible artist's hand and style
- Raw, honest, emotional

PRESERVE ESSENCE:
- Capture the subject's character
- Show personality through lines
- Maintain emotional depth
- Keep it real and honest

GOAL: Like a master artist's sketch - raw, honest, soulful. Art that captures essence, not just appearance.`,
      
      '3d-render': `Transform this image into 3D RENDERED style - but keep it WARM and ALIVE.

ARTISTIC PHILOSOPHY: 3D doesn't mean cold. Show life, warmth, personality.

3D RENDER TECHNIQUE:
- Smooth, polished surfaces (Pixar quality)
- Realistic lighting with warmth
- Subtle textures and details
- Professional animation quality
- Vibrant, appealing colors
- Life and personality in every detail

PRESERVE ESSENCE:
- Keep personality and warmth
- Show character and emotion
- Maintain human connection
- Keep it alive, not robotic

GOAL: Like a Pixar character - polished, professional, but ALIVE with personality and warmth.`,
      
      'pop-art': `Transform this image into POP ART style - capture BOLD ENERGY and ATTITUDE.

ARTISTIC PHILOSOPHY: Pop art is about bold statements, energy, attitude.

POP ART TECHNIQUE:
- Bold, saturated colors (eye-popping)
- High contrast (dramatic)
- Graphic design aesthetic
- Andy Warhol inspired
- Bold outlines and shapes
- Confident, unapologetic style

PRESERVE ESSENCE:
- Keep personality and attitude
- Exaggerate what makes them iconic
- Show bold character
- Maintain energy and presence

GOAL: Like an iconic pop art poster - bold, confident, unforgettable. Art with ATTITUDE.`,
      
      'cyberpunk': `Transform this image into CYBERPUNK style - capture MOOD and ATMOSPHERE.

ARTISTIC PHILOSOPHY: Cyberpunk is about mood, atmosphere, feeling.

CYBERPUNK AESTHETIC:
- Neon colors (pink, blue, purple glow)
- Dark, moody atmosphere
- Futuristic, sci-fi elements
- Rain-slicked streets feel
- Blade Runner inspired
- Emotional depth in darkness

PRESERVE ESSENCE:
- Keep subject recognizable
- Show personality in the darkness
- Maintain emotional connection
- Keep human warmth in cold future

GOAL: Like a scene from Blade Runner - moody, atmospheric, emotional. Sci-fi with SOUL.`,
      
      'vintage': `Transform this image into VINTAGE PHOTOGRAPH - capture NOSTALGIA and WARMTH.

ARTISTIC PHILOSOPHY: Vintage isn't just old - it's memory, feeling, nostalgia.

VINTAGE TECHNIQUE:
- Faded, warm colors (aged photo feel)
- Film grain and texture
- Soft focus and gentle light
- 1970s aesthetic warmth
- Nostalgic, timeless feel
- Emotional connection to the past

PRESERVE ESSENCE:
- Keep subject recognizable
- Show warmth and humanity
- Capture timeless quality
- Maintain emotional connection

GOAL: Like a treasured old photograph - nostalgic, warm, timeless. Photo that feels like MEMORY.`,
      
      'impressionism': `Transform this image into IMPRESSIONIST PAINTING - capture LIGHT and MOMENT.

ARTISTIC PHILOSOPHY: Impressionism is about capturing fleeting moments, light, and atmosphere - like Monet's water lilies.

IMPRESSIONIST TECHNIQUE:
- Visible, broken brush strokes (dabs and dashes of color)
- Emphasis on light and its changing qualities
- Soft, blurred edges (capturing movement and atmosphere)
- Vibrant, unmixed colors placed side by side
- Outdoor light quality (plein air feeling)
- Sense of spontaneity and immediacy
- Dreamy, atmospheric quality

COLOR PALETTE:
- Bright, pure colors
- Avoid black - use color for shadows
- Complementary colors side by side
- Light-filled and luminous

PRESERVE ESSENCE:
- Keep subject recognizable but soft
- Capture the feeling of the moment
- Show light and atmosphere
- Maintain emotional warmth

GOAL: Like a Monet masterpiece - light-filled, atmospheric, capturing a fleeting moment. Art that feels like SUNLIGHT.`,
      
      'cyberpunk': `Transform this image into CYBERPUNK style - capture NEON FUTURE and ATMOSPHERE.

ARTISTIC PHILOSOPHY: Cyberpunk is about high-tech dystopia, neon dreams, and human soul in a digital world.

CYBERPUNK AESTHETIC:
- Neon colors (hot pink, electric blue, purple, cyan glow)
- Dark, moody atmosphere with dramatic lighting
- Futuristic, sci-fi elements (holographic effects, digital glitches)
- Rain-slicked streets and reflections
- Blade Runner / Ghost in the Shell inspired
- High contrast between dark and neon
- Urban dystopia feeling
- Digital artifacts and scan lines

LIGHTING:
- Neon signs and holographic projections
- Dramatic rim lighting
- Colored fog and atmosphere
- Reflective wet surfaces
- Moody shadows with neon highlights

PRESERVE ESSENCE:
- Keep subject recognizable
- Show personality in the neon glow
- Maintain human emotion in tech world
- Keep warmth despite cold future

GOAL: Like a scene from Blade Runner 2049 - moody, atmospheric, neon-soaked. Sci-fi with SOUL and STYLE.`,
      
      'ukiyo-e': `Transform this image into UKIYO-E (Japanese Woodblock Print) style - capture ELEGANCE and TRADITION.

ARTISTIC PHILOSOPHY: Ukiyo-e is about elegant simplicity, bold composition, and timeless Japanese aesthetics.

UKIYO-E TECHNIQUE:
- Bold, clean outlines (black ink lines)
- Flat, solid color areas (no gradients)
- Limited color palette (traditional pigments)
- Simplified, stylized forms
- Elegant composition and negative space
- Traditional Japanese patterns and motifs
- Woodblock print texture and grain
- Asymmetrical balance

VISUAL ELEMENTS:
- Traditional Japanese color harmony
- Decorative patterns (waves, clouds, flowers)
- Elegant line work
- Flat perspective (no Western depth)
- Stylized natural elements

PRESERVE ESSENCE:
- Keep subject recognizable in Japanese style
- Show elegance and grace
- Maintain character and personality
- Capture timeless beauty

GOAL: Like a Hokusai or Hiroshige masterpiece - elegant, timeless, beautifully composed. Art that feels like JAPANESE TRADITION.`,
      
      'van-gogh': `Transform this image into VAN GOGH style - capture EMOTION and SWIRLING ENERGY.

ARTISTIC PHILOSOPHY: Van Gogh painted with raw emotion - every brush stroke shows feeling, passion, and inner turmoil.

VAN GOGH TECHNIQUE:
- Thick, swirling brush strokes (impasto texture)
- Visible, energetic paint application
- Swirling, flowing patterns (especially in sky and background)
- Bold, expressive colors (yellows, blues, greens)
- Emotional intensity in every stroke
- Post-impressionist style
- Starry Night inspired movement
- Raw, honest, passionate

COLOR PALETTE:
- Vibrant yellows and blues (signature Van Gogh)
- Bold, contrasting colors
- Emotional color choices
- Thick paint texture visible

BRUSH WORK:
- Swirling, circular strokes
- Thick, textured paint
- Energetic, passionate application
- Visible artist's emotion

PRESERVE ESSENCE:
- Keep subject recognizable
- Show emotional depth
- Capture inner feeling
- Maintain human connection

GOAL: Like Starry Night or Sunflowers - passionate, emotional, swirling with energy. Art that shows RAW FEELING and SOUL.`,
    };
    
    
    const prompt = stylePrompts[style] || stylePrompts['oil-painting'];

    const result = await generateGeminiImage({
      apiKey,
      prompt,
      imageBase64,
      temperature: 0.5,
      topK: 40,
      topP: 0.95,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error, raw: result.raw }, { status: result.status });
    }

    const fullBase64 = `data:image/png;base64,${result.base64Data}`;
    const r2Url = await uploadBase64ImageToR2(fullBase64, 'style-transfer');

    return NextResponse.json({
      imageUrl: r2Url || fullBase64,
      isR2: !!r2Url,
      mode: 'style-transfer', style
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    console.error('style-transfer error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
