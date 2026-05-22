import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import HeroSlideshow from "@/components/HeroSlideshow";
import { AnimatedSection, AnimatedGrid, AnimatedCard } from "@/components/AnimatedGrid";
import { getNewUpdatedMovies, getMoviesByCategory, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "NhungMov",
  "url": "https://nhungmov.vercel.app",
  "description": "Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nhungmov.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NhungMov",
    "logo": {
      "@type": "ImageObject",
      "url": "https://nhungmov.vercel.app/logo.svg"
    }
  }
};

export default async function Home() {
  const [newMovies, categories, animeData] = await Promise.all([
    getNewUpdatedMovies({ limit: 30 }).catch(() => ({ items: [] })),
    getTheLoaiList().catch(() => []),
    getMoviesByCategory("hoat-hinh", { limit: 5 }).catch(() => ({ items: [] })),
  ]);

  const heroMovies = animeData.items.length
    ? animeData.items.slice(0, 5).map((m) => ({
        slug: m.slug,
        name: m.name,
        thumb_url: resolveImageUrl(m.thumb_url),
        poster_url: resolveImageUrl(m.poster_url),
        quality: m.quality,
        episode_current: m.episode_current,
        year: m.year,
        time: m.time,
        lang: m.lang,
        content: m.content,
      }))
    : newMovies.items.slice(0, 5).map((m) => ({
        slug: m.slug,
        name: m.name,
        thumb_url: resolveImageUrl(m.thumb_url),
        poster_url: resolveImageUrl(m.poster_url),
        quality: m.quality,
        episode_current: m.episode_current,
        year: m.year,
        time: m.time,
        lang: m.lang,
        content: m.content,
      }));
  const latestMovies = newMovies.items.slice(1, 7);
  const topCategories = categories.slice(0, 12);

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
        <HeroSlideshow movies={heroMovies} />

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim mới cập nhật</h2>
            <Link href="/phim-moi" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-12 gap-y-6">
            {newMovies.items.slice(0, 12).map((movie) => (
              <AnimatedCard key={movie.slug}>
                <MovieCard
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? movie.quality ?? ''}
                  quality={movie.quality ?? null}
                  episode={movie.episode_current ?? null}
                  year={movie.year ?? null}
                  duration={movie.time ?? null}
                />
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Hành Động</h2>
            <Link href="/the-loai/hanh-dong" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-12 gap-y-6">
            {actionMovies.map((movie) => (
              <AnimatedCard key={movie.slug}>
                <MovieCard
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? ''}
                  quality={movie.quality ?? null}
                  episode={movie.episode_current ?? null}
                  year={movie.year ?? null}
                />
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Anime</h2>
            <Link href="/hoat-hinh" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-12 gap-y-6">
            {animeMovies.map((movie) => (
              <AnimatedCard key={movie.slug}>
                <MovieCard
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? ''}
                  quality={movie.quality ?? null}
                  episode={movie.episode_current ?? null}
                  year={movie.year ?? null}
                />
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Kinh Dị</h2>
            <Link href="/the-loai/kinh-di" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-12 gap-y-6">
            {horrorMovies.map((movie) => (
              <AnimatedCard key={movie.slug}>
                <MovieCard
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? ''}
                  quality={movie.quality ?? null}
                  episode={movie.episode_current ?? null}
                  year={movie.year ?? null}
                />
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Phim Thái Lan</h2>
            <Link href="/quoc-gia/thai-lan" className="text-sm text-red-400 hover:text-red-300">
              Xem thêm →
            </Link>
          </div>
          <AnimatedGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-12 gap-y-6">
            {thaiMovies.map((movie) => (
              <AnimatedCard key={movie.slug}>
                <MovieCard
                  slug={movie.slug}
                  title={movie.name}
                  posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                  subTitle={movie.lang ?? movie.episode_current ?? ''}
                  quality={movie.quality ?? null}
                  episode={movie.episode_current ?? null}
                  year={movie.year ?? null}
                />
              </AnimatedCard>
            ))}
          </AnimatedGrid>
        </AnimatedSection>

        <AnimatedSection className="mx-auto max-w-7xl px-4 py-6">
          <div className="rounded-xl bg-zinc-900 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Thể loại phim</h2>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 20).map((category) => (
                <AnimatedCard key={category.slug}>
                  <Link
                    href={`/the-loai/${category.slug}`}
                    className="px-4 py-2 text-sm text-zinc-300 bg-white/5 rounded-lg hover:bg-red-500 hover:text-white transition-colors block"
                  >
                    {category.name}
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
