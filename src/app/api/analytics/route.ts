import { NextRequest, NextResponse } from 'next/server';

// 配置 Edge Runtime
export const runtime = 'edge';

// POST /api/analytics - 接收分析数据
export async function POST(request: NextRequest) {
  try {
    const events = await request.json();
    
    // TODO: 存储到数据库
    // 目前只是记录到日志
    console.log('[Analytics] Received events:', events.length);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics] Error:', error);
    return NextResponse.json({ error: 'Failed to save analytics' }, { status: 500 });
  }
}

// GET /api/analytics - 获取统计数据
export async function GET(request: NextRequest) {
  try {
    // TODO: 从数据库读取统计数据
    // 目前返回模拟数据
    const stats = {
      totalUsers: 0,
      totalProcessed: 0,
      topFeatures: [
        { id: 'remove-bg', name: '背景移除', count: 0 },
        { id: 'upscale', name: '照片放大', count: 0 },
        { id: 'portrait', name: '人像增强', count: 0 }
      ],
      topPresets: [
        { feature: 'remove-bg', preset: 'portrait', count: 0 },
        { feature: 'upscale', preset: 'portrait', count: 0 },
        { feature: 'portrait', preset: 'natural', count: 0 }
      ]
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[Analytics] Error:', error);
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 });
  }
}
