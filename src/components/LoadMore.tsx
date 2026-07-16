"use client";

import { useState, useTransition } from "react";
import MovieCard from "./MovieCard";
import { loadMoreMovies, type LoadMoreResult } from "@/lib/actions";

interface LoadMoreProps {
  initialItems: LoadMoreResult["items"];
  type_list?: string;
  sort_type?: "asc" | "desc";
  sort_lang?: string;
  limit?: number;
}

export default function LoadMore({ initialItems, type_list, sort_type, sort_lang, limit = 12 }: LoadMoreProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const nextPage = page + 1;
      const result = await loadMoreMovies({
        type_list,
        page: nextPage,
        limit,
        sort_type,
        sort_lang,
      });
      setItems((prev) => [...prev, ...result.items]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
        {items.map((movie) => (
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
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="px-8 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            {isPending ? "Đang tải..." : "Xem thêm ↓"}
          </button>
        </div>
      )}
    </>
  );
}
