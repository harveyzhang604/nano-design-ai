export interface Env {
  IMAGES_BUCKET: R2Bucket;
  GEMINI_API_KEY: string;
}

export const config = {
  runtime: 'edge',
};

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const { prompt, category } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 获取 Cloudflare 环境中的变量
    // 在 Next.js App Router 的 API Route 中，Cloudflare context 可以通过 process.env 注入（取决于配置）
    // 或者直接使用全局注入
    const apiKey = process.env.GEMINI_API_KEY;
    const bucket = (process.env as any).IMAGES_BUCKET;

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const categoryPrompts: Record<string, string> = {
      fashion: "Fashion Design. Professional studio photography.",
      architecture: "Architecture design. High-end architectural rendering.",
      interior: "Interior design. High-end interior photography."
    };

    const systemPrompt = categoryPrompts[category] || "Professional design AI.";

    const response = await openai.images.generate({
      model: "imagen-3.1-generate-001",
      prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
      n: 1,
      size: "1024x1024",
    } as any);

    const imageUrl = (response as any).data?.[0]?.url;
    
    if (!imageUrl) {
      throw new Error('Empty response from AI');
    }

    // --- R2 存储逻辑 ---
    if (bucket) {
      const imageRes = await fetch(imageUrl);
      const imageBlob = await imageRes.arrayBuffer();
      const fileName = `${category}-${Date.now()}.png`;
      
      await bucket.put(fileName, imageBlob, {
        httpMetadata: { contentType: 'image/png' }
      });
      
      // 注意：这里可能需要配置 R2 的公开访问，或者是返回一个本地代理 URL
      // 目前为了快速演示，我们继续返回原始 URL，但数据已存入 R2
      console.log(`Saved to R2: ${fileName}`);
    }

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
