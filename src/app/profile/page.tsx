'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getMovieDetail, resolveImageUrl, type MovieListItem } from '@/lib/phimapi';
import {
  getFavorites,
  removeFavorite,
  getHistory,
  removeHistory,
  clearHistory
} from '@/lib/firebase-service';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

interface HistoryItem {
  slug: string;
  watchedAt: string;
}

function ProfileContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get('tab') || 'profile';
  
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<MovieListItem[]>([]);
  const [historyMovies, setHistoryMovies] = useState<(HistoryItem & { movie?: MovieListItem })[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [favData, histData] = await Promise.all([
        getFavorites(),
        getHistory()
      ]);

      setFavorites(favData);
      setHistory(histData);

      if (favData.length > 0) {
        const moviePromises = favData.slice(0, 12).map(async (slug: string) => {
          try {
            const res = await getMovieDetail(slug);
            return res.movie;
          } catch {
            return null;
          }
        });
        const movies = await Promise.all(moviePromises);
        setFavoriteMovies(movies.filter(Boolean) as MovieListItem[]);
      }

      if (histData.length > 0) {
        const histMoviesPromises = histData.slice(0, 12).map(async (item: HistoryItem) => {
          try {
            const res = await getMovieDetail(item.slug);
            return { ...item, movie: res.movie ?? undefined } as (HistoryItem & { movie?: MovieListItem });
          } catch {
            return item as (HistoryItem & { movie?: MovieListItem });
          }
        });
        const histMovies = await Promise.all(histMoviesPromises);
        setHistoryMovies(histMovies);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, authLoading, router, loadUserData]);

  const handleRemoveFavorite = async (slug: string) => {
    if (!user) return;
    try {
      await removeFavorite(slug);
      setFavorites(prev => prev.filter(f => f !== slug));
      setFavoriteMovies(prev => prev.filter(m => m.slug !== slug));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleRemoveHistory = async (slug: string) => {
    if (!user) return;
    try {
      await removeHistory(slug);
      setHistory(prev => prev.filter(h => h.slug !== slug));
      setHistoryMovies(prev => prev.filter(h => h.slug !== slug));
    } catch (err) {
      console.error('Error removing history:', err);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    try {
      await clearHistory();
      setHistory([]);
      setHistoryMovies([]);
    } catch (err) {
      console.error('Error clearing history:', err);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Hồ sơ' },
    { id: 'favorites', label: `Yêu thích (${favorites.length})` },
    { id: 'history', label: `Lịch sử (${history.length})` },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_30%),radial-gradient(circle_at_left,rgba(168,85,247,0.12),transparent_25%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-4xl font-black text-zinc-950 shadow-xl">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              <p className="text-zinc-400">{user.email}</p>
              <p className="text-sm text-zinc-500 mt-1">Thành viên</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={`/profile?tab=${t.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-cyan-400 text-zinc-950'
                  : 'border border-white/10 text-zinc-300 hover:border-cyan-400/30'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Phim yêu thích</span>
                  <span className="text-cyan-400 font-bold">{favorites.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Lịch sử xem</span>
                  <span className="text-cyan-400 font-bold">{history.length}</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">Tài khoản</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">Email:</span>
                  <span className="text-white">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-zinc-500">Username:</span>
                  <span className="text-white">{user.username}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-zinc-900/70 to-fuchsia-500/10 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-white mb-4">Hướng dẫn</h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>- Lưu phim yêu thích để xem lại sau</li>
                <li>- Lịch sử xem tự động lưu khi bạn xem phim</li>
                <li>- Bình luận và đánh giá phim yêu thích</li>
              </ul>
            </div>
          </div>
        )}

        {tab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Phim yêu thích ({favorites.length})</h2>
            {favoriteMovies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 text-center">
                <p className="text-zinc-400">Bạn chưa lưu phim yêu thích nào.</p>
                <Link href="/" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300">
                  Khám phá phim ngay
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {favoriteMovies.map((movie) => (
                  <div key={movie.slug} className="relative group">
                    <MovieCard
                      slug={movie.slug}
                      title={movie.name ?? ''}
                      posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                      subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                      quality={movie.quality ?? ''}
                      episode={movie.episode_current ?? ''}
                    />
                    <button
                      onClick={() => handleRemoveFavorite(movie.slug)}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      title="Xóa khỏi yêu thích"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Lịch sử xem ({history.length})</h2>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Xóa lịch sử
                </button>
              )}
            </div>
            {historyMovies.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 text-center">
                <p className="text-zinc-400">Bạn chưa xem phim nào.</p>
                <Link href="/" className="inline-block mt-4 text-cyan-400 hover:text-cyan-300">
                  Khám phá phim ngay
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {historyMovies.map((item) => (
                  <div key={item.slug} className="relative group">
                    <MovieCard
                      slug={item.slug}
                      title={item.movie?.name ?? item.slug}
                      posterUrl={resolveImageUrl(item.movie?.poster_url) ?? resolveImageUrl(item.movie?.thumb_url)}
                      subTitle={item.movie?.lang ?? item.movie?.episode_current ?? ''}
                      quality={item.movie?.quality ?? ''}
                      episode={item.movie?.episode_current ?? ''}
                    />
                    <button
                      onClick={() => handleRemoveHistory(item.slug)}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                      title="Xóa khỏi lịch sử"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Đang tải...</div>
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}