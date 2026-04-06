import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";
import { log } from "console";

export default async function HoatHinhPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const page = Number.isFinite(pageNum) ? pageNum : 1;

  const categories = await getTheLoaiList();
  const animeMovies = await getNewUpdatedMovies({ page, limit: 15, type_list: "hoat-hinh" });
  const apiUrl = `https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=${page}&sort_field=modified.time&sort_type=desc&sort_lang=vietsub&limit=15`;
  console.log('API URL:', apiUrl);
  console.log(animeMovies)
  console.log('Anime page - items:', animeMovies.items.length);
  console.log('Anime page - first:', animeMovies.items[0]?.name);

  const topCategories = categories.slice(0, 12);
  const prevPage = Math.max(1, page - 1);
  const nextPage = page + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
            {animeMovies.items.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
              />
            ))}
          </div>
        )}

        {animeMovies.items.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href={`/hoat-hinh?page=${prevPage}`}
              className="px-5 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-300"
            >
              ← Trang trước
            </Link>
            <span className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl text-sm font-medium">
              Trang {page}
            </span>
            <Link
              href={`/hoat-hinh?page=${nextPage}`}
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
