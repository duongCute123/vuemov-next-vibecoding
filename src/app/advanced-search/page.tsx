'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { getTheLoaiList, getQuocGiaList, resolveImageUrl, type MovieListItem, type TheLoaiItem, type QuocGiaItem, PHIMAPI_BASE } from '@/lib/phimapi';
import { useAuth } from '@/lib/auth-context';

interface FilterOptions {
  category: string;
  country: string;
  year: string;
  quality: string;
  type: string;
}

export default function AdvancedSearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { user } = useAuth();

  const [movies, setMovies] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<TheLoaiItem[]>([]);
  const [countries, setCountries] = useState<QuocGiaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    country: '',
    year: '',
    quality: '',
    type: '',
  });

  const years = Array.from({ length: 20 }, (_, i) => String(2025 - i));
  const qualities = ['HD', 'Full HD', '4K', '1080p', '720p'];
  const types = [
    { value: 'phim-vietsub', label: 'Phim Vietsub' },
    { value: 'phim-bo', label: 'Phim Bộ' },
    { value: 'phim-le', label: 'Phim Lẻ' },
    { value: 'phim-chieu-rap', label: 'Phim Chiếu Rạp' },
    { value: 'phim-hoat-hinh', label: 'Phim Hoạt Hình' },
  ];

  useEffect(() => {
    const loadData = async () => {
      const [catData, countryData] = await Promise.all([
        getTheLoaiList(),
        getQuocGiaList(),
      ]);
      setCategories(catData);
      setCountries(countryData);
    };
    loadData();
  }, []);

  const searchMovies = useCallback(async (pageNum: number = 1, append = false) => {
    setLoading(true);
    try {
      let url: string;
      const hasFilters = filters.category || filters.country || filters.year || filters.quality || filters.type;

      if (q || hasFilters) {
        url = `${PHIMAPI_BASE}/v1/api/tim-kiem?page=${pageNum}&limit=24&sort_field=_id&sort_type=desc`;
        
        if (q) {
          url += `&keyword=${encodeURIComponent(q)}`;
        }
        if (filters.category) {
          url += `&category=${encodeURIComponent(filters.category)}`;
        }
        if (filters.country) {
          url += `&country=${encodeURIComponent(filters.country)}`;
        }
        if (filters.year) {
          url += `&year=${filters.year}`;
        }
        if (filters.quality) {
          url += `&quality=${encodeURIComponent(filters.quality)}`;
        }
        if (filters.type) {
          url += `&type_list=${encodeURIComponent(filters.type)}`;
        }

        const res = await fetch(url, { headers: { 'User-Agent': 'NhungMov/1.0' } });
        const data = await res.json();
        
        if (data.status === false && data.msg?.includes('keyword')) {
          if (filters.type || filters.category || filters.country || filters.year || filters.quality) {
            url = `${PHIMAPI_BASE}/v1/api/danh-sach/${filters.type || 'phim-vietsub'}?page=${pageNum}&sort_field=modified.time&sort_type=desc&limit=24`;
            
            if (filters.category) {
              url += `&category=${encodeURIComponent(filters.category)}`;
            }
            if (filters.country) {
              url += `&country=${encodeURIComponent(filters.country)}`;
            }
            if (filters.year) {
              url += `&year=${filters.year}`;
            }
            
            const res2 = await fetch(url, { headers: { 'User-Agent': 'NhungMov/1.0' } });
            const data2 = await res2.json();
            const items = data2.data?.items || [];
            
            if (append) {
              setMovies(prev => [...prev, ...items]);
            } else {
              setMovies(items);
            }
            setHasMore(items.length === 24);
            setLoading(false);
            return;
          }
        }
        
        const items = data.data?.items || [];

        if (append) {
          setMovies(prev => [...prev, ...items]);
        } else {
          setMovies(items);
        }
        setHasMore(items.length === 24);
      } else {
        const res = await fetch(`${PHIMAPI_BASE}/v1/api/danh-sach/phim-vietsub?page=${pageNum}&sort_field=modified.time&sort_type=desc&limit=24`, { headers: { 'User-Agent': 'NhungMov/1.0' } });
        const data = await res.json();
        const items = data.data?.items || [];
        
        if (append) {
          setMovies(prev => [...prev, ...items]);
        } else {
          setMovies(items);
        }
        setHasMore(items.length === 24);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [q, filters]);

  useEffect(() => {
    searchMovies(1, false);
    setPage(1);
  }, [q, filters.category, filters.country, filters.year, filters.quality, filters.type, searchMovies]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    searchMovies(nextPage, true);
  };

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

        <div className="mb-8 rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur">
          <h2 className="text-lg font-semibold text-white mb-4">Bộ lọc</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Loại phim</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="">Tất cả</option>
                {types.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Thể loại</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="">Tất cả</option>
                {categories.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Quốc gia</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="">Tất cả</option>
                {countries.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Năm</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="">Tất cả</option>
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Chất lượng</label>
              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white"
              >
                <option value="">Tất cả</option>
                {qualities.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ category: '', country: '', year: '', quality: '', type: '' })}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:border-cyan-400/30"
            >
              Xóa lọc
            </button>
          </div>
        </div>

        {loading && movies.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-cyan-400 text-lg">Đang tìm kiếm...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-400">
            Không tìm thấy phim nào phù hợp.
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-zinc-400">Tìm thấy {movies.length} phim</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-200 hover:bg-cyan-400/20 disabled:opacity-50"
                >
                  {loading ? 'Đang tải...' : 'Xem thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}