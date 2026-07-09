import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetail, getNewUpdatedMovies } from '@/lib/phimapi';
import { callAIJSON, isAIConfigured } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { slugs } = await request.json();

    const detailPromises = slugs.slice(0, 10).map((s: string) =>
      getMovieDetail(s).then(r => r.movie).catch(() => null)
    );
    const watchedMovies = (await Promise.all(detailPromises)).filter(Boolean);

    if (!isAIConfigured()) {
      const recent = await getNewUpdatedMovies({ limit: 12 }).catch(() => ({ items: [] }));
      return NextResponse.json({ success: true, items: recent.items, source: 'fallback' });
    }

    const prompt = watchedMovies.length > 0
      ? `Dựa vào lịch sử xem: ${JSON.stringify(watchedMovies.map((m: any) => ({ name: m?.name, category: m?.category?.map((c: any) => c.name), country: m?.country?.map((c: any) => c.name) })))}. Hãy đề xuất 5 thể loại/quốc gia phù hợp (trả về JSON array dạng ["category-slug1", "country-slug2"])`
      : 'Hãy đề xuất 5 thể loại phim hot nhất hiện tại (trả về JSON array dạng ["category-slug1", ...])';

    const suggestions = await callAIJSON<string[]>([
      { role: 'system', content: 'Bạn là chuyên gia đề xuất phim. Chỉ trả về JSON array, không giải thích.' },
      { role: 'user', content: prompt },
    ], { temperature: 0.3, maxTokens: 200 });

    const categorySlugs = (suggestions || []).filter(s => !s.startsWith('country-') && s !== 'all');
    const moviesPromises = categorySlugs.slice(0, 3).map((slug: string) =>
      getNewUpdatedMovies({ type_list: slug, limit: 8 }).catch(() => ({ items: [] }))
    );
    const moviesResults = await Promise.all(moviesPromises);

    const seen = new Set(slugs || []);
    const items: any[] = [];
    for (const res of moviesResults) {
      for (const m of res.items) {
        if (!seen.has(m.slug)) {
          seen.add(m.slug);
          items.push(m);
          if (items.length >= 12) break;
        }
      }
      if (items.length >= 12) break;
    }

    if (items.length === 0) {
      const fallback = await getNewUpdatedMovies({ limit: 12 }).catch(() => ({ items: [] }));
      return NextResponse.json({ success: true, items: fallback.items, source: 'fallback' });
    }

    return NextResponse.json({ success: true, items, source: 'ai' });
  } catch {
    const fallback = await getNewUpdatedMovies({ limit: 12 }).catch(() => ({ items: [] }));
    return NextResponse.json({ success: true, items: fallback.items, source: 'fallback' });
  }
}
