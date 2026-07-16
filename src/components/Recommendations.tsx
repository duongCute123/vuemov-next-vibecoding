"use client";

import Link from "next/link";
import MovieCard from "./MovieCard";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getHistory } from "@/lib/api-service";
import { getRecommendations } from "@/lib/actions";

export default function Recommendations() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Array<{
    slug: string;
    name: string;
    posterUrl: string | null;
    subTitle: string;
    quality: string | null;
    episode: string | null;
    year: number | string | null;
    duration: string | null;
  }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const history = await getHistory();
        const slugs = history.map((h) => h.slug);
        if (slugs.length === 0) {
          setLoading(false);
          return;
        }
        const recs = await getRecommendations(slugs);
        setMovies(recs);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user || loading || !movies || movies.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Gợi ý cho bạn</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Đề xuất phim</h2>
        </div>
        <Link href="/phim" className="text-sm text-cyan-400 hover:text-cyan-300">
          Xem thêm →
        </Link>
      </div>
      <div className="movie-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.slug}
            slug={movie.slug}
            title={movie.name}
            posterUrl={movie.posterUrl}
            subTitle={movie.subTitle}
            quality={movie.quality}
            episode={movie.episode}
            year={movie.year}
            duration={movie.duration}
          />
        ))}
      </div>
    </section>
  );
}
