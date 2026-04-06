import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";

type PageProps = { searchParams: Promise<{ page?: string }> };

export default async function PhimLongTiengPage({ searchParams }: PageProps) {
  const { page: rawPage } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNum) ? pageNum : 1;

  const [categories, movies] = await Promise.all([
    getTheLoaiList(),
    getNewUpdatedMovies({ page, limit: 24, type_list: "phim-long-tieng" }),
  ]);

  const topCategories = categories.slice(0, 12);
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader categories={topCategories.map((c) => ({ name: c.name, slug: c.slug }))} searchPlaceholder="Tìm kiếm phim..." />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">🔊</span>
          <div>
            <h1 className="text-2xl font-bold text-white">Phim Lồng Tiếng</h1>
            <p className="text-sm text-zinc-400">Phim được lồng tiếng Việt</p>
          </div>
        </div>
        {movies.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            <p className="text-lg mb-2">Không tìm thấy phim nào</p>
            <Link href="/" className="text-purple-400 hover:text-purple-300">Quay về trang chủ</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
            {movies.items.map((movie) => (
              <MovieCard key={movie.slug} slug={movie.slug} title={movie.name} posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)} subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''} quality={movie.quality ?? null} episode={movie.episode_current ?? null} year={movie.year ?? null} />
            ))}
          </div>
        )}
        {movies.items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href={`?page=${prevPage}`} className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300">← Trang trước</Link>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl text-sm font-medium">Trang {page}</span>
            <Link href={`?page=${nextPage}`} className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300">Trang tiếp →</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
