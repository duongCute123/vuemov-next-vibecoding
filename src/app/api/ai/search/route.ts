import { NextRequest, NextResponse } from 'next/server';
import { callAIJSON, isAIConfigured } from '@/lib/ai';

export async function POST(request: NextRequest) {
  let query = '';
  try {
    const body = await request.json();
    query = body.query || '';

    if (!isAIConfigured()) {
      return NextResponse.json({ success: true, keyword: query, filters: {} });
    }

    const parsed = await callAIJSON<{ keyword: string; filters: Record<string, string> }>([
      {
        role: 'system',
        content: `Bạn là trợ lý tìm kiếm phim. Phân tích câu hỏi của người dùng và trả về JSON với các trường:
{
  "keyword": "từ khóa tìm kiếm chính",
  "filters": {
    "category": "slug-thể-loại-hoặc-rỗng",
    "country": "slug-quốc-gia-hoặc-rỗng",
    "year": "năm-hoặc-rỗng",
    "type": "phim-bo-hoặc-phim-le-hoặc-rỗng"
  }
}
Chỉ trả về JSON, không giải thích.`,
      },
      { role: 'user', content: query },
    ], { temperature: 0.1, maxTokens: 200 });

    return NextResponse.json({
      success: true,
      keyword: parsed?.keyword || query,
      filters: parsed?.filters || {},
    });
  } catch {
    return NextResponse.json({ success: true, keyword: query || '', filters: {} });
  }
}
