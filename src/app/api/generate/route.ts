import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 构建针对设计场景的 System Prompt
    const systemPrompt = `You are a professional ${category} design AI assistant powered by Nano Banana 2 (Gemini 3 Pro Image). 
    Your goal is to generate a highly detailed, photorealistic, and creative design based on the user's prompt. 
    Focus on material textures, lighting, and professional design aesthetics.`;

    const response = await openai.images.generate({
      model: "gemini-3-pro-preview", // 映射到 Gemini 3 Pro Image (Nano Banana 2)
      prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('No image was generated');
    }
    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Nano Banana Generation Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
