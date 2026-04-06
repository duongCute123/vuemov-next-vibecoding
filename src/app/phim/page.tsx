import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getNewUpdatedMovies, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim - NhungMov",
  description: "Kho phim online miễn phí chất lượng cao. Xem phim Vietsub, phim lẻ, phim bộ, phim chiếu rạp mới nhất.",
  alternates: {
    canonical: "https://nhungmov.vercel.app/phim",
  },
};

export default async function PhimHomePage() {
  const [newMovies, categories] = await Promise.all([getNewUpdatedMovies({ limit: 48 }), getTheLoaiList()]);

  const heroMovie = newMovies.items[0] ?? null;
  const featuredRow = newMovies.items.slice(1, 5);
  const gridMovies = newMovies.items.slice(5);
  const navCategories = categories.slice(0, 12);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader categories={navCategories.map((category) => ({ name: category.name, slug: category.slug }))} searchPlaceholder="Tìm trong thư viện phim..." />

      <main className="pb-12">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.14),transparent_22%)]" />
          {heroMovie ? (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `url(${resolveImageUrl(heroMovie.thumb_url) ?? resolveImageUrl(heroMovie.poster_url) ?? ""})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950" />

          <div className="relative mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Danh sách phim</p>
                <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                  Phim mới cập nhật
                </h1>
                <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                  Tổng hợp phim nổi bật đang được cập nhật từ API, sắp xếp theo phong cách giao diện streaming hiện đại với lưới thẻ dày, dễ duyệt và tối ưu cho màn hình tối.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200">
                    {newMovies.items.length} tiêu đề mới
                  </div>
                  <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
                    {categories.length} thể loại
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/search?q=phim-bo"
                    className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
                  >
                    Khám phá phim bộ
                  </Link>
                  <Link
                    href="/search?q=phim-le"
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
                  >
                    Xem phim lẻ
                  </Link>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Đang hot</p>
                <div className="mt-4 space-y-3">
                  {featuredRow.map((movie) => (
                    <Link
                      key={movie.slug}
                      href={`/phim/${encodeURIComponent(movie.slug)}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 transition hover:border-cyan-400/30 hover:bg-white/5"
                    >
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-900">
                        {resolveImageUrl(movie.thumb_url) ?? resolveImageUrl(movie.poster_url) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveImageUrl(movie.thumb_url) ?? resolveImageUrl(movie.poster_url) ?? ""}
                            alt={movie.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-semibold text-white">{movie.name}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                          {movie.episode_current ?? movie.quality ?? movie.lang ?? "Đang cập nhật"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {categories.slice(0, 18).map((category) => (
                <Link
                  key={category.slug}
                  href={`/the-loai/${category.slug}`}
                  className="rounded-full border border-white/10 bg-zinc-900/75 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Thư viện</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Tất cả phim mới</h2>
            </div>
            <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
              Quay về trang chủ
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {gridMovies.map((movie) => (
              <MovieCard
                key={movie.slug}
                slug={movie.slug}
                title={movie.name}
                posterUrl={resolveImageUrl(movie.poster_url) ?? resolveImageUrl(movie.thumb_url)}
                subTitle={movie.lang ?? movie.time ?? movie.episode_current ?? ""}
                quality={movie.quality ?? ""}
                episode={movie.episode_current ?? ""}
              />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}