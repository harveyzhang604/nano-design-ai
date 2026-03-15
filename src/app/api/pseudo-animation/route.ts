import { NextResponse } from 'next/server';
import { generateGeminiImage, imageUrlToBase64 } from '@/lib/gemini-image';
import { uploadBase64ImageToR2 } from '@/lib/r2-upload';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { 
      imageUrl, 
      animationType = 'subtle-motion',
      frames = 3,
      duration = 2000
    } = await req.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    if (frames < 3 || frames > 5) {
      return NextResponse.json({ error: 'Frames must be between 3 and 5' }, { status: 400 });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: GEMINI_API_KEY not configured.'
      }, { status: 500 });
    }

    const imageBase64 = await imageUrlToBase64(imageUrl);
    
    // 生成关键帧序列
    const keyframes = [];
    
    for (let i = 0; i < frames; i++) {
      const progress = i / (frames - 1); // 0.0 -> 1.0
      
      let framePrompt = '';
      
      if (animationType === 'subtle-motion') {
        framePrompt = `Generate keyframe ${i + 1} of ${frames} for a SUBTLE MOTION animation.

ANIMATION PHILOSOPHY: Subtle, natural movement - like a living photograph.

FRAME ${i + 1} REQUIREMENTS (Progress: ${Math.round(progress * 100)}%):
- Keep the SAME subject and composition
- Maintain character consistency (same person, same features)
- Apply SUBTLE motion: ${progress === 0 ? 'starting position' : progress === 1 ? 'end position' : `mid-motion (${Math.round(progress * 100)}%)`}

SUBTLE MOTION TYPES:
- Gentle head turn (5-10 degrees)
- Slight smile progression
- Soft eye blink or gaze shift
- Hair movement from gentle breeze
- Clothing slight sway
- Natural breathing motion

CRITICAL CONSISTENCY:
- SAME person across all frames
- SAME facial features and structure
- SAME clothing and colors
- SAME background and lighting
- ONLY the specified motion changes

GOAL: Create a smooth, natural motion sequence that loops seamlessly.`;
        
      } else if (animationType === 'expression-change') {
        const expressions = ['neutral', 'slight smile', 'full smile'];
        const expr = expressions[Math.min(i, expressions.length - 1)];
        
        framePrompt = `Generate keyframe ${i + 1} of ${frames} for EXPRESSION CHANGE animation.

ANIMATION PHILOSOPHY: Natural emotional transition - like watching someone's mood change.

FRAME ${i + 1} REQUIREMENTS:
- Keep the SAME person (identical facial features)
- Expression: ${expr}
- Maintain character consistency
- Natural emotional progression

EXPRESSION PROGRESSION:
${i === 0 ? '- Neutral, calm expression' : ''}
${i === 1 ? '- Beginning to smile (mouth corners lifting)' : ''}
${i === 2 ? '- Full, genuine smile (eyes smiling too)' : ''}

CRITICAL CONSISTENCY:
- SAME person, face, features
- SAME clothing, background, lighting
- ONLY expression changes naturally

GOAL: Natural emotional transition that feels real and human.`;
        
      } else if (animationType === 'zoom-in') {
        const scale = 1 + (progress * 0.3); // 1.0 -> 1.3
        
        framePrompt = `Generate keyframe ${i + 1} of ${frames} for ZOOM-IN animation.

ANIMATION PHILOSOPHY: Dramatic focus - draw attention to the subject.

FRAME ${i + 1} REQUIREMENTS (Zoom: ${scale.toFixed(2)}x):
- Keep the SAME subject and composition
- Gradually zoom in (scale: ${scale.toFixed(2)}x)
- Maintain perfect center alignment
- Increase detail visibility as we zoom

ZOOM PROGRESSION:
${i === 0 ? '- Full view (1.0x)' : ''}
${i === 1 ? '- Slight zoom (1.15x)' : ''}
${i === 2 ? '- Close-up (1.3x)' : ''}

CRITICAL CONSISTENCY:
- SAME subject throughout
- Center-aligned zoom
- Smooth scale progression
- No quality loss

GOAL: Dramatic zoom that draws focus and attention.`;
        
      } else if (animationType === 'lighting-shift') {
        const lightAngle = progress * 180; // 0° -> 180°
        
        framePrompt = `Generate keyframe ${i + 1} of ${frames} for LIGHTING SHIFT animation.

ANIMATION PHILOSOPHY: Dramatic mood change through lighting.

FRAME ${i + 1} REQUIREMENTS (Light angle: ${Math.round(lightAngle)}°):
- Keep the SAME subject and composition
- Shift lighting direction: ${Math.round(lightAngle)}° (${i === 0 ? 'left' : i === frames - 1 ? 'right' : 'center'})
- Maintain character consistency
- Natural shadow progression

LIGHTING PROGRESSION:
${i === 0 ? '- Light from left (dramatic side lighting)' : ''}
${i === 1 ? '- Light from front (even, balanced)' : ''}
${i === 2 ? '- Light from right (dramatic side lighting)' : ''}

CRITICAL CONSISTENCY:
- SAME person, features, clothing
- SAME background and composition
- ONLY lighting direction changes

GOAL: Dramatic mood shift through natural lighting changes.`;
      }
      
      // 生成每一帧（带重试机制）
      let base64Data: string | null = null;
      let lastError = 'Unknown error';

      for (let attempt = 1; attempt <= 3 && !base64Data; attempt++) {
        try {
          const result = await generateGeminiImage({
            apiKey,
            prompt: framePrompt,
            imageBase64,
            temperature: 0.4,
            topK: 32,
            topP: 0.9,
          });

          if (result.ok) {
            base64Data = result.base64Data;
            break;
          }

          lastError = result.error;
          console.error(`Frame ${i + 1} attempt ${attempt} failed:`, result.raw || result.error);
        } catch (error: any) {
          lastError = error?.message || 'Unknown exception';
          console.error(`Frame ${i + 1} attempt ${attempt} exception:`, error);
        }

        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!base64Data) {
        return NextResponse.json({ 
          error: `Frame ${i + 1} failed after 3 retries: ${lastError}` 
        }, { status: 500 });
      }

      const fullBase64 = `data:image/png;base64,${base64Data}`;
      const r2Url = await uploadBase64ImageToR2(fullBase64, `pseudo-anim-frame${i + 1}`);
      
      keyframes.push({
        frame: i + 1,
        imageUrl: r2Url || fullBase64,
        isR2: !!r2Url
      });
      
      // 避免 API 限流
      if (i < frames - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return NextResponse.json({ 
      success: true,
      animationType,
      frames: keyframes,
      duration,
      totalFrames: frames,
      cssAnimation: `
/* 使用方法：将关键帧图片按顺序放入容器，应用此 CSS */
@keyframes pseudo-animation {
  ${keyframes.map((_, i) => `${Math.round((i / (frames - 1)) * 100)}% { opacity: 1; }`).join('\n  ')}
}

.pseudo-animation-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.pseudo-animation-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  animation: pseudo-animation ${duration}ms infinite;
}

${keyframes.map((_, i) => `.pseudo-animation-frame:nth-child(${i + 1}) { animation-delay: ${Math.round((i / frames) * duration)}ms; }`).join('\n')}
`
    }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
    
  } catch (error: any) {
    console.error('Pseudo animation error:', error);
    return NextResponse.json({ 
      error: `Server Exception: ${error.message}` 
    }, { status: 500 });
  }
}
