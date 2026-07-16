import Link from "next/link";
import type { Metadata } from "next";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata(
  "TV Shows",
  "Xem TV shows online miễn phí. Các chương trình truyền hình thực tế, talkshow, gameshow hấp dẫn vietsub.",
  "/tv-shows",
);

type PageProps = { searchParams: Promise<{ page?: string; sort?: string; lang?: string }> };

export default async function TvShowsPage({ searchParams }: PageProps) {
  const { page: rawPage, sort: rawSort, lang: rawLang } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNum) ? pageNum : 1;
  const sortType = rawSort === "asc" ? "asc" : "desc";
  const sortLang = rawLang || "all";

  const apiOpts: { page: number; limit: number; type_list: string; sort_type: "asc" | "desc"; sort_lang?: string } = { page, limit: 24, type_list: "tv-shows", sort_type: sortType };
  if (sortLang !== "all") apiOpts.sort_lang = sortLang;

  const [categories, movies] = await Promise.all([
    getTheLoaiList().catch(() => []),
    getNewUpdatedMovies(apiOpts).catch(() => ({ items: [] })),
  ]);

  const topCategories = categories.slice(0, 12);
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  const breadCrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://nhungmov.vercel.app" },
      { "@type": "ListItem", "position": 2, "name": "TV Shows", "item": "https://nhungmov.vercel.app/tv-shows" },
    ],
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <SiteHeader categories={topCategories.map((c) => ({ name: c.name, slug: c.slug }))} searchPlaceholder="Tìm kiếm..." />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">📺</span>
          <div>
            <h1 className="text-2xl font-bold text-white">TV Shows</h1>
            <p className="text-sm text-zinc-400">Chương trình truyền hình</p>
          </div>
        </div>
        {movies.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            <p className="text-lg mb-2">Không tìm thấy phim nào</p>
            <Link href="/" className="text-purple-400 hover:text-purple-300">Quay về trang chủ</Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 mr-1">Sắp xếp:</span>
              <Link href={`?page=1&sort=desc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "desc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Mới nhất</Link>
              <Link href={`?page=1&sort=asc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "asc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Cũ nhất</Link>
              <span className="text-xs text-zinc-500 ml-2 mr-1">Ngôn ngữ:</span>
              <Link href={`?page=1&sort=${sortType}&lang=vietsub`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "vietsub" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Vietsub</Link>
              <Link href={`?page=1&sort=${sortType}&lang=thuyet-minh`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "thuyet-minh" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Thuyết minh</Link>
              <Link href={`?page=1&sort=${sortType}&lang=long-tieng`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "long-tieng" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Lồng tiếng</Link>
              <Link href={`?page=1&sort=${sortType}&lang=all`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "all" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Tất cả</Link>
            </div>
            <div className="movie-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
            {movies.items.map((movie) => (
              <MovieCard key={movie.slug} slug={movie.slug} title={movie.name} posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)} subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''} quality={movie.quality ?? null} episode={movie.episode_current ?? null} year={movie.year ?? null} duration={movie.time ?? null} />
            ))}
          </div>
          </>
        )}
        {movies.items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href={`?page=${prevPage}&sort=${sortType}&lang=${sortLang}`} className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300">← Trang trước</Link>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl text-sm font-medium">Trang {page}</span>
            <Link href={`?page=${nextPage}&sort=${sortType}&lang=${sortLang}`} className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300">Trang tiếp →</Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}