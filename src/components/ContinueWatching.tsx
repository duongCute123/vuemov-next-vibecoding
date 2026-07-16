"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getHistory } from "@/lib/api-service";
import { getMovieDetail, resolveImageUrl } from "@/lib/phimapi";

interface HistoryMovie {
  slug: string;
  name: string;
  thumb_url?: string;
  poster_url?: string;
  episode_current?: string;
  watchedAt: string;
}

export default function ContinueWatching() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<HistoryMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const history = await getHistory();
        if (history.length === 0) {
          setLoading(false);
          return;
        }
        const recent = history.sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime()).slice(0, 6);
        const results = await Promise.all(
          recent.map(async (item) => {
            try {
              const res = await getMovieDetail(item.slug);
              if (!res.movie) return null;
              return {
                slug: item.slug,
                name: res.movie.name ?? item.slug,
                thumb_url: res.movie.thumb_url,
                poster_url: res.movie.poster_url,
                episode_current: res.movie.episode_current,
                watchedAt: item.watchedAt,
              };
            } catch {
              return null;
            }
          })
        );
        setMovies(results.filter(Boolean) as HistoryMovie[]);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user || loading || movies.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Tiếp tục xem</h2>
        <Link href="/profile?tab=history" className="text-sm text-cyan-400 hover:text-cyan-300">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
        {movies.map((movie) => (
          <Link key={movie.slug} href={`/phim/${encodeURIComponent(movie.slug)}`} className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2">
            <div className="relative aspect-[2/3] bg-zinc-800 overflow-hidden">
              {resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url) ? (
                <Image
                  src={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url) ?? ""}
                  alt={movie.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1536px) 20vw, 8vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-zinc-600 text-xs">No image</div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                <div className="h-full w-2/3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-r-full" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold text-white line-clamp-1">{movie.name}</h3>
              <p className="mt-1 text-xs text-zinc-400">
                {movie.episode_current ?? "Đang cập nhật"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
