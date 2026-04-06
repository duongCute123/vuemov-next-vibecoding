import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { getTheLoaiList, resolveImageUrl, searchMovies } from "@/lib/phimapi";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm kiếm phim - NhungMov",
  description: "Tìm kiếm phim yêu thích. Xem phim online miễn phí, phim vietsub, phim hd chất lượng cao.",
  alternates: {
    canonical: "https://nhungmov.vercel.app/search",
  },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q: rawQ, page: rawPage } = await searchParams;
  const q = (rawQ || "").trim();
  const pageNum = Number.parseInt(rawPage || "1", 10);

  if (!q) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <main className="max-w-6xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2 text-cyan-200">Tìm kiếm</h1>
          <div className="text-zinc-400 mb-4">Vui lòng nhập từ khóa.</div>
          <div className="flex gap-3">
            <Link href="/" className="text-cyan-300 hover:text-white underline">
              Quay lại trang chủ
            </Link>
            <Link href="/advanced-search" className="text-cyan-300 hover:text-white underline">
              Tìm kiếm nâng cao
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const { items } = await searchMovies(q, { page: Number.isFinite(pageNum) ? pageNum : 1 });
  const categories = await getTheLoaiList();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black text-cyan-300">NhungMov</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/phim" className="hover:text-white">Phim</Link>
            <Link href="/advanced-search" className="text-cyan-300 hover:text-white">Tìm nâng cao</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h1 className="text-3xl font-bold text-cyan-200">Kết quả tìm kiếm: &ldquo;{q}&rdquo;</h1>
          <p className="mt-1 text-sm text-zinc-400">{items.length} phim tìm thấy.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
            Không tìm thấy phim phù hợp. Thử tìm kiếm nâng cao?
            <Link href="/advanced-search" className="ml-2 text-cyan-300 hover:text-white">
              Tìm nâng cao →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((m) => (
              <MovieCard
                key={m.slug}
                slug={m.slug}
                title={m.name}
                posterUrl={resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url)}
                subTitle={m.episode_current ?? m.lang ?? ""}
                quality={m.quality ?? null}
                episode={m.episode_current ?? null}
              />
            ))}
          </div>
        )}

        <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-3 text-lg font-semibold text-cyan-200">Thể loại khác</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 18).map((c) => (
              <Link
                key={c.slug}
                href={`/the-loai/${c.slug}`}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:border-cyan-400 hover:text-cyan-200"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

