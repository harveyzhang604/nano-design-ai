import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();
    
    // 验证 prompt
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    // DEBUG: 检查环境变量
    const envVars = Object.keys(process.env);
    console.log("Available Env Vars:", envVars);

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyClHMIZtkzGVsu3LxIfsFYwpEBCBXL-z8w";
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'System Error: API Key not configured.',
        debug: { envFound: envVars.includes("GEMINI_API_KEY") }
      }, { status: 500 });
    }

    const categoryPrompts: Record<string, string> = {
      fashion: "Professional Fashion Design Studio Photography.",
      architecture: "High-end Photorealistic Architectural Visualization Rendering.",
      interior: "Luxury Modern Interior Design Magazine Photography."
    };

    const systemPrompt = categoryPrompts[category] || "Professional design AI.";

    const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instances: [{ prompt: `${systemPrompt} ${prompt}. Technical: 8k, ultra-detailed.` }],
        parameters: { sampleCount: 1 }
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) return NextResponse.json({ error: data.error?.message || 'Gemini API Error' }, { status: apiResponse.status });

    const base64Data = data.predictions?.[0]?.bytesBase64Encoded;
    if (!base64Data) return NextResponse.json({ error: 'No image data returned from AI.' }, { status: 500 });

    return NextResponse.json({ imageUrl: `data:image/png;base64,${base64Data}` }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: `Server Exception: ${error.message}` }, { status: 500 });
  }
}
