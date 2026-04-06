"use client";

export default function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl overflow-hidden bg-zinc-800">
        <div className="aspect-[16/9] bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-700 animate-pulse" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-zinc-700/50 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
