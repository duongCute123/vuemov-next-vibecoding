import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { getMoviesByCategory, getTheLoaiList, resolveImageUrl } from "@/lib/phimapi";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);

  const [categories, res] = await Promise.all([
    getTheLoaiList(),
    getMoviesByCategory(slug, { page: Number.isFinite(pageNum) ? pageNum : 1 }),
  ]);

  const current = categories.find((c) => c.slug === slug) || null;
  const title = current?.name ? current.name : `Thể loại: ${slug}`;

  const prevPage = Math.max(1, Number.isFinite(pageNum) ? pageNum - 1 : 1);
  const nextPage = (Number.isFinite(pageNum) ? pageNum : 1) + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black text-cyan-300">ThunMov Clone</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/phim" className="hover:text-white">Phim</Link>
            <Link href="/search?q=phim-bo" className="hover:text-white">Phim bộ</Link>
            <Link href="/search?q=kinh-di" className="hover:text-white">Kinh dị</Link>
          </nav>
          <Link href="/" className="text-sm text-cyan-200 hover:text-white">Đổi thể loại</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-cyan-200">{title}</h1>
            <div className="text-sm text-zinc-400">Trang {Number.isFinite(pageNum) ? pageNum : 1}</div>
          </div>
          <p className="mt-2 text-zinc-300">Hiển thị {res.items.length} phim mới cập nhật theo thể loại.</p>
        </div>

        {res.items.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">Không tìm thấy phim cho thể loại này.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {res.items.map((m) => (
              <MovieCard
                key={m.slug}
                slug={m.slug}
                title={m.name}
                posterUrl={resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url)}
                subTitle={m.episode_current ?? m.quality ?? "N/A"}
                quality={m.quality ?? null}
                episode={m.episode_current ?? null}
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/the-loai/${encodeURIComponent(slug)}?page=${prevPage}`}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-cyan-200 hover:bg-zinc-700"
          >
            Trang trước
          </Link>
          <Link
            href={`/the-loai/${encodeURIComponent(slug)}?page=${nextPage}`}
            className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-cyan-200 hover:bg-zinc-700"
          >
            Trang tiếp
          </Link>
        </div>

        <section className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-3 text-lg font-semibold text-cyan-200">Thể loại khác</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 20).map((c) => (
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

