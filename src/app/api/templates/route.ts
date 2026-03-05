import { NextResponse } from 'next/server';
import { promptTemplates } from '@/config/templates';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category && category in promptTemplates) {
    return NextResponse.json({
      templates: promptTemplates[category as keyof typeof promptTemplates]
    });
  }

  return NextResponse.json({ templates: [] });
}
