import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetail } from '@/lib/phimapi';
import { callAI, isAIConfigured } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    if (!isAIConfigured()) {
      return NextResponse.json({ success: false, summary: null });
    }

    const { slug } = await request.json();
    const { movie } = await getMovieDetail(slug);

    if (!movie) {
      return NextResponse.json({ success: false, summary: null });
    }

    const movieInfo = {
      name: movie.name,
      origin_name: movie.origin_name,
      content: movie.content?.slice(0, 500),
      category: movie.category?.map(c => c.name).join(', '),
      country: movie.country?.map(c => c.name).join(', '),
      year: movie.year,
      director: movie.director,
      actor: movie.actor,
    };

    const summary = await callAI([
      {
        role: 'system',
        content: 'Bạn là chuyên gia điện ảnh. Tóm tắt phim bằng tiếng Việt ngắn gọn, hấp dẫn trong 2-3 câu. Nếu có thể, đưa ra đánh giá ngắn về phim.',
      },
      {
        role: 'user',
        content: `Hãy tóm tắt và đánh giá phim sau: ${JSON.stringify(movieInfo)}`,
      },
    ], { temperature: 0.5, maxTokens: 300 });

    return NextResponse.json({ success: true, summary: summary || null });
  } catch {
    return NextResponse.json({ success: false, summary: null });
  }
}
