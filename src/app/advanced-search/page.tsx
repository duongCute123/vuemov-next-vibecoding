import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { PHIMAPI_BASE, getTheLoaiList, getQuocGiaList, resolveImageUrl, type MovieListItem } from '@/lib/phimapi';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata(
  'Tìm kiếm nâng cao',
  'Tìm kiếm phim nâng cao với nhiều bộ lọc: thể loại, quốc gia, năm, chất lượng. Xem phim online miễn phí tại NhungMov.',
  '/advanced-search',
);

const YEARS = Array.from({ length: 20 }, (_, i) => String(2025 - i));
const QUALITIES = ['HD', 'Full HD', '4K', '1080p', '720p'];
const TYPES = [
  { value: 'phim-vietsub', label: 'Phim Vietsub' },
  { value: 'phim-bo', label: 'Phim Bộ' },
  { value: 'phim-le', label: 'Phim Lẻ' },
  { value: 'phim-chieu-rap', label: 'Phim Chiếu Rạp' },
  { value: 'phim-hoat-hinh', label: 'Phim Hoạt Hình' },
];

async function fetchMovies(searchParams: Record<string, string | undefined>, page: number = 1): Promise<MovieListItem[]> {
  const { q, category, country, year, quality, type } = searchParams;
  const hasFilters = category || country || year || quality || type;

  try {
    let url: string;
    if (q || hasFilters) {
      url = `${PHIMAPI_BASE}/v1/api/tim-kiem?page=${page}&limit=24&sort_field=_id&sort_type=desc`;
      if (q) url += `&keyword=${encodeURIComponent(q)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;
      if (country) url += `&country=${encodeURIComponent(country)}`;
      if (year) url += `&year=${year}`;
      if (quality) url += `&quality=${encodeURIComponent(quality)}`;
      if (type) url += `&type_list=${encodeURIComponent(type)}`;

      const res = await fetch(url, { headers: { 'User-Agent': 'NhungMov/1.0' }, next: { revalidate: 120 } });
      const data = await res.json();

      if (data.status === false && data.msg?.includes('keyword') && hasFilters) {
        url = `${PHIMAPI_BASE}/v1/api/danh-sach/${type || 'phim-vietsub'}?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`;
        if (category) url += `&category=${encodeURIComponent(category)}`;
        if (country) url += `&country=${encodeURIComponent(country)}`;
        if (year) url += `&year=${year}`;

        const res2 = await fetch(url, { headers: { 'User-Agent': 'NhungMov/1.0' }, next: { revalidate: 120 } });
        const data2 = await res2.json();
        return data2.data?.items || [];
      }

      return data.data?.items || [];
    } else {
      const res = await fetch(`${PHIMAPI_BASE}/v1/api/danh-sach/phim-vietsub?page=${page}&sort_field=modified.time&sort_type=desc&limit=24`, {
        headers: { 'User-Agent': 'NhungMov/1.0' }, next: { revalidate: 300 },
      });
      const data = await res.json();
      return data.data?.items || [];
    }
  } catch {
    return [];
  }
}

function buildHref(params: Record<string, string | undefined>, extra: Record<string, string> = {}): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...params, ...extra })) {
    if (v) sp.set(k, v);
  }
  const qs = sp.toString();
  return `/advanced-search${qs ? '?' + qs : ''}`;
}

export default async function AdvancedSearchPage({
  searchParams: sp,
}: {
  searchParams: Promise<{ q?: string; category?: string; country?: string; year?: string; quality?: string; type?: string; page?: string }>;
}) {
  const params = await sp;
  const q = params.q || '';
  const page = Math.max(1, Number(params.page) || 1);

  const [movies, categories, countries] = await Promise.all([
    fetchMovies(params, page),
    getTheLoaiList().catch(() => []),
    getQuocGiaList().catch(() => []),
  ]);

  const filters = { category: params.category || '', country: params.country || '', year: params.year || '', quality: params.quality || '', type: params.type || '' };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black text-cyan-400">NhungMov</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/phim" className="hover:text-white">Phim</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white">
            {q ? `Kết quả tìm kiếm: "${q}"` : 'Tìm kiếm nâng cao'}
          </h1>
        </div>

        <form method="GET" action="/advanced-search" className="mb-8 rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur">
          <h2 className="text-lg font-semibold text-white mb-4">Bộ lọc</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Loại phim</label>
              <select name="type" defaultValue={filters.type} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="">Tất cả</option>
                {TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Thể loại</label>
              <select name="category" defaultValue={filters.category} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="">Tất cả</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Quốc gia</label>
              <select name="country" defaultValue={filters.country} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="">Tất cả</option>
                {countries.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Năm</label>
              <select name="year" defaultValue={filters.year} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="">Tất cả</option>
                {YEARS.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Chất lượng</label>
              <select name="quality" defaultValue={filters.quality} className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white">
                <option value="">Tất cả</option>
                {QUALITIES.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>

          {q && <input type="hidden" name="q" value={q} />}

          <div className="mt-4 flex flex-wrap gap-2">
            <button type="submit" className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 transition-colors">
              Tìm kiếm
            </button>
            <Link href="/advanced-search" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:border-cyan-400/30 transition-colors">
              Xóa lọc
            </Link>
          </div>
        </form>

        {movies.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-400">
            Không tìm thấy phim nào phù hợp.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-400">Tìm thấy {movies.length} phim</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-12">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.slug}
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                  quality={movie.quality ?? ''}
                  episode={movie.episode_current ?? ''}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={buildHref(params, { page: String(page - 1) })} className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 hover:border-cyan-400/30 transition-colors">
                  ← Trang trước
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-zinc-500">Trang {page}</span>
              {movies.length === 24 && (
                <Link href={buildHref(params, { page: String(page + 1) })} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-400/20 transition-colors">
                  Trang tiếp →
                </Link>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}