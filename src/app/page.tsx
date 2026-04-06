import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";

export default async function Home() {
  const [newMovies, categories] = await Promise.all([
    getNewUpdatedMovies({ limit: 30 }),
    getTheLoaiList()
  ]);

  const featuredMovie = newMovies.items[0] ?? null;
  const latestMovies = newMovies.items.slice(1, 7);
  const topCategories = categories.slice(0, 12);
  const heroImage = featuredMovie ? (resolveImageUrl(featuredMovie.thumb_url) ?? resolveImageUrl(featuredMovie.poster_url)) : null;

  const actionMovies = newMovies.items.slice(7, 13);
  const animeMovies = newMovies.items.slice(13, 19);
  const horrorMovies = newMovies.items.slice(19, 25);
  const thaiMovies = newMovies.items.slice(25, 30);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader 
        categories={topCategories.map((category) => ({ name: category.name, slug: category.slug }))} 
        searchPlaceholder="Tìm kiếm phim..." 
      />

      <main id="main-content" className="pb-12" tabIndex={-1}>
        {featuredMovie && (
          <section className="relative h-[70vh] min-h-[500px] overflow-hidden" aria-labelledby="hero-heading">
            {heroImage && (
              <div className="absolute inset-0">
                <Image
                  src={heroImage}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />

            <div className="relative mx-auto max-w-7xl px-4 h-full flex items-center">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full text-xs font-semibold text-red-400 mb-4">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {featuredMovie.quality ?? 'HD'} • {featuredMovie.episode_current ?? 'Mới'}
                </div>

                <h1 id="hero-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
                  {featuredMovie.name}
                </h1>

                <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
                  {featuredMovie.year && <span>{featuredMovie.year}</span>}
                  {featuredMovie.time && <><span>•</span><span>{featuredMovie.time}</span></>}
                  {featuredMovie.lang && <><span>•</span><span>{featuredMovie.lang}</span></>}
                </div>

                <p className="text-sm text-zinc-300 line-clamp-3 mb-6">
                  {featuredMovie.content ?? 'Khám phá kho phim miễn phí chất lượng cao, cập nhật liên tục mỗi ngày.'}
                </p>

                <div className="flex gap-3">
                  <Link
                    href={`/phim/${encodeURIComponent(featuredMovie.slug)}`}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Xem ngay
                  </Link>
                  <button className="px-6 py-3 border border-white/20 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                    + Thêm vào list
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim mới cập nhật</h2>
            <Link href="/phim-moi" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
            {newMovies.items.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
                duration={movie.time ?? null}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Hành Động</h2>
            <Link href="/the-loai/hanh-dong" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {actionMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Anime</h2>
            <Link href="/hoat-hinh" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {animeMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Kinh Dị</h2>
            <Link href="/the-loai/kinh-di" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {horrorMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Thái Lan</h2>
            <Link href="/quoc-gia/thai-lan" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6">
            {thaiMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.episode_current ?? ''}
                quality={movie.quality ?? null}
                episode={movie.episode_current ?? null}
                year={movie.year ?? null}
              />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="rounded-xl bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Thể loại phim</h2>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 20).map((category) => (
                <Link
                  key={category.slug}
                  href={`/the-loai/${category.slug}`}
                  className="px-4 py-2 text-sm text-zinc-300 bg-white/5 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
