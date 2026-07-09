import Link from "next/link";
import type { Metadata } from "next";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata(
  "Hoạt hình",
  "Xem phim hoạt hình online miễn phí. Anime, hoạt hình Disney, Pixar và phim hoạt hình Trung Quốc, Nhật Bản vietsub.",
  "/hoat-hinh",
);

export default async function HoatHinhPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const { page: rawPage, sort: rawSort } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNum) ? pageNum : 1;
  const sortType = rawSort === "asc" ? "asc" : "desc";

  const categories = await getTheLoaiList().catch(() => []);
  const animeMovies = await getNewUpdatedMovies({ page, limit: 15, type_list: "hoat-hinh", sort_type: sortType }).catch(() => ({ items: [] }));

  const topCategories = categories.slice(0, 12);
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  const breadCrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://nhungmov.vercel.app" },
      { "@type": "ListItem", "position": 2, "name": "Hoạt hình", "item": "https://nhungmov.vercel.app/hoat-hinh" },
    ],
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadCrumbLd) }} />
      <SiteHeader 
        categories={topCategories.map((category) => ({ name: category.name, slug: category.slug }))} 
        searchPlaceholder="Tìm kiếm anime..." 
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">🌸</span>
          <div>
            <h1 className="text-2xl font-bold text-white">Anime</h1>
            <p className="text-sm text-zinc-400">Khám phá thế giới anime</p>
          </div>
        </div>

        {animeMovies.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center text-zinc-400">
            <p className="text-lg mb-2">Không tìm thấy anime nào</p>
            <Link href="/" className="text-purple-400 hover:text-purple-300">Quay về trang chủ</Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 mr-1">Sắp xếp:</span>
              <Link href={`/hoat-hinh?page=1&sort=desc`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "desc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Mới nhất</Link>
              <Link href={`/hoat-hinh?page=1&sort=asc`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "asc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Cũ nhất</Link>
            </div>
            <div className="movie-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-12 gap-y-6">
            {animeMovies.items.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                slideshowImages={[resolveImageUrl(movie.poster_url), resolveImageUrl(movie.thumb_url)].filter(Boolean) as string[]}
                subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
                duration={movie.time ?? null}
              />
            ))}
          </div>
          </>
        )}

        {animeMovies.items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/hoat-hinh?page=${prevPage}&sort=${sortType}`}
              className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300"
            >
              ← Trang trước
            </Link>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl text-sm font-medium">
              Trang {page}
            </span>
            <Link
              href={`/hoat-hinh?page=${nextPage}&sort=${sortType}`}
              className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300"
            >
              Trang tiếp →
            </Link>
          </div>
        )}

        <section className="mt-10 rounded-xl bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Thể loại khác</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 20).map((category) => (
              <Link
                key={category.slug}
                href={`/the-loai/${category.slug}`}
                className="px-4 py-2 text-sm text-zinc-300 bg-white/5 rounded-xl hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
