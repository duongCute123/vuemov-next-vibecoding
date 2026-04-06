'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { getMovieDetail, resolveImageUrl, type MovieListItem } from '@/lib/phimapi';
import { getFavorites } from '@/lib/api-service';
import MovieCard from '@/components/MovieCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FavouritePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<MovieListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const favData = await getFavorites();
      setFavorites(favData);

      if (favData.length > 0) {
        const moviePromises = favData.slice(0, 24).map(async (slug: string) => {
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
    } catch (err) {
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/favourite');
      return;
    }

    if (user) {
      loadFavorites();
    }
  }, [user, authLoading, router, loadFavorites]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.15),transparent_30%),radial-gradient(circle_at_left,rgba(168,85,247,0.12),transparent_25%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 to-zinc-950" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-zinc-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">Phim yêu thích</h1>
            <span className="text-zinc-500">({favorites.length} phim)</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {favoriteMovies.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-zinc-400 text-lg">Bạn chưa lưu phim yêu thích nào.</p>
            <p className="text-zinc-500 mt-2 text-sm">Nhấn vào icon trái tim trên phim để lưu vào đây</p>
            <Link href="/" className="inline-block mt-6 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full">
              Khám phá phim ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {favoriteMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name ?? ''}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                quality={movie.quality ?? ''}
                episode={movie.episode_current ?? ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}