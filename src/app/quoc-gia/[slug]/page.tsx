import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { getMoviesByCountry, getQuocGiaList, resolveImageUrl } from "@/lib/phimapi";

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: rawPage } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);

  const [countries, res] = await Promise.all([
    getQuocGiaList(),
    getMoviesByCountry(slug, { page: Number.isFinite(pageNum) ? pageNum : 1 }),
  ]);

  const current = countries.find((c) => c.slug === slug) || null;
  const title = current?.name ? current.name : `Quốc gia: ${slug}`;

  const prevPage = Math.max(1, Number.isFinite(pageNum) ? pageNum - 1 : 1);
  const nextPage = (Number.isFinite(pageNum) ? pageNum : 1) + 1;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black text-cyan-400">NhungMov</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/phim" className="hover:text-white">Phim</Link>
          </nav>
          <Link href="/" className="text-sm text-cyan-300 hover:text-white">Đổi quốc gia</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <div className="text-sm text-zinc-400">Trang {Number.isFinite(pageNum) ? pageNum : 1}</div>
          </div>
          <p className="mt-2 text-zinc-300">Hiển thị {res.items.length} phim theo quốc gia.</p>
        </div>

        {res.items.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-zinc-900/50 p-8 text-zinc-400 text-center">
            Không tìm thấy phim cho quốc gia này.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {res.items.map((m) => (
              <MovieCard
                key={m.slug}
                slug={m.slug}
                title={m.name}
                posterUrl={resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url)}
                subTitle={m.episode_current ?? m.quality ?? "N/A"}
                quality={m.quality ?? ""}
                episode={m.episode_current ?? ""}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            href={`/quoc-gia/${encodeURIComponent(slug)}?page=${prevPage}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition"
          >
            ← Trang trước
          </Link>
          <Link
            href={`/quoc-gia/${encodeURIComponent(slug)}?page=${nextPage}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition"
          >
            Trang tiếp →
          </Link>
        </div>

        <section className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <h2 className="mb-4 text-lg font-semibold text-white">Quốc gia khác</h2>
          <div className="flex flex-wrap gap-2">
            {countries.slice(0, 20).map((c) => (
              <Link
                key={c.slug}
                href={`/quoc-gia/${c.slug}`}
                className="rounded-full border border-white/10 bg-zinc-900/75 px-4 py-2 text-sm text-zinc-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-200"
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