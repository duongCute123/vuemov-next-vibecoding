import Link from "next/link";
import type { Metadata } from "next";
import MovieCard from "@/components/MovieCard";
import LoadMore from "@/components/LoadMore";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata(
  "Phim bộ",
  "Xem phim bộ online miễn phí, phim truyền hình Hàn Quốc, Trung Quốc, Nhật Bản, Thái Lan vietsub cập nhật liên tục.",
  "/phim-bo",
);

export default async function PhimBoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; lang?: string }>;
}) {
  const { page: rawPage, sort: rawSort, lang: rawLang } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNum) ? pageNum : 1;
  const sortType = rawSort === "asc" ? "asc" : "desc";
  const sortLang = rawLang || "vietsub";

  const apiOpts: { page: number; limit: number; type_list: string; sort_type: "asc" | "desc"; sort_lang?: string } = { page, limit: 24, type_list: "phim-bo", sort_type: sortType };
  if (sortLang !== "all") apiOpts.sort_lang = sortLang;

  const [categories, movies] = await Promise.all([
    getTheLoaiList().catch(() => []),
    getNewUpdatedMovies(apiOpts).catch(() => ({ items: [] })),
  ]);

  const topCategories = categories.slice(0, 12);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://nhungmov.vercel.app" },
      { "@type": "ListItem", "position": 2, "name": "Phim bộ", "item": "https://nhungmov.vercel.app/phim-bo" },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Phim bộ",
    "url": `https://nhungmov.vercel.app/phim-bo?page=${page}`,
    "itemListElement": movies.items.map((m, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Movie",
        "name": m.name,
        "url": `https://nhungmov.vercel.app/phim/${m.slug}`,
        "image": resolveImageUrl(m.poster_url) || resolveImageUrl(m.thumb_url) || undefined,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {movies.items.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />}
      <SiteHeader 
        categories={topCategories.map((category) => ({ name: category.name, slug: category.slug }))} 
        searchPlaceholder="Tìm kiếm phim bộ..." 
      />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-6 flex items-center gap-3">
          <span className="text-3xl">📺</span>
          <div>
            <h1 className="text-2xl font-bold text-white">Phim bộ</h1>
            <p className="text-sm text-zinc-400">Phim truyền hình, series</p>
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
              <Link href={`/phim-bo?page=1&sort=desc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "desc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Mới nhất</Link>
              <Link href={`/phim-bo?page=1&sort=asc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "asc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Cũ nhất</Link>
              <span className="text-xs text-zinc-500 ml-2 mr-1">Ngôn ngữ:</span>
              <Link href={`/phim-bo?page=1&sort=${sortType}&lang=vietsub`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "vietsub" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Vietsub</Link>
              <Link href={`/phim-bo?page=1&sort=${sortType}&lang=thuyet-minh`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "thuyet-minh" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Thuyết minh</Link>
              <Link href={`/phim-bo?page=1&sort=${sortType}&lang=long-tieng`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "long-tieng" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Lồng tiếng</Link>
              <Link href={`/phim-bo?page=1&sort=${sortType}&lang=all`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "all" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Tất cả</Link>
            </div>
            <LoadMore
              initialItems={movies.items.map((m) => ({
                slug: m.slug,
                name: m.name,
                posterUrl: resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url),
                subTitle: m.lang ?? m.episode_current ?? m.quality ?? '',
                quality: m.quality ?? null,
                episode: m.episode_current ?? null,
                year: m.year ?? null,
                duration: m.time ?? null,
              }))}
              type_list="phim-bo"
              sort_type={sortType}
              sort_lang={sortLang !== "all" ? sortLang : undefined}
            />
          </>
        )}

        <section className="mt-10 rounded-xl bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Thể loại phim bộ</h2>
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
