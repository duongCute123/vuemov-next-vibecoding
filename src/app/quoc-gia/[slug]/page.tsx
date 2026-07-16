import Link from "next/link";
import type { Metadata } from "next";
import MovieCard from "@/components/MovieCard";
import { getMoviesByCountry, getQuocGiaList, resolveImageUrl } from "@/lib/phimapi";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const countries = await getQuocGiaList().catch(() => []);
  const current = countries.find((c) => c.slug === slug);
  const name = current?.name || slug;
  const canonical = `https://nhungmov.vercel.app/quoc-gia/${slug}`;
  const title = `Phim ${name}`;
  const description = `Xem phim ${name} online miễn phí, phim ${name} hay nhất vietsub chất lượng cao cập nhật liên tục.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: canonical,
      siteName: "NhungMov",
      title: `${title} | NhungMov`,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${title} - NhungMov` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | NhungMov`,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function CountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; lang?: string }>;
}) {
  const { slug } = await params;
  const { page: rawPage, sort: rawSort, lang: rawLang } = await searchParams;
  const pageNum = Number.parseInt(rawPage || "1", 10);
  const sortType = rawSort === "asc" ? "asc" : "desc";
  const sortLang = rawLang || "all";

  const apiOpts: { page: number; sort_type: "asc" | "desc"; sort_lang?: string } = { page: Number.isFinite(pageNum) ? pageNum : 1, sort_type: sortType };
  if (sortLang !== "all") apiOpts.sort_lang = sortLang;

  const [countries, res] = await Promise.all([
    getQuocGiaList().catch(() => []),
    getMoviesByCountry(slug, apiOpts).catch(() => ({ items: [] })),
  ]);

  const current = countries.find((c) => c.slug === slug) || null;
  const title = current?.name ? current.name : `Quốc gia: ${slug}`;
  const canonical = `https://nhungmov.vercel.app/quoc-gia/${slug}`;

  const prevPage = Math.max(1, Number.isFinite(pageNum) ? pageNum - 1 : 1);
  const nextPage = (Number.isFinite(pageNum) ? pageNum : 1) + 1;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", url: "https://nhungmov.vercel.app" },
    { name: "Quốc gia", url: "https://nhungmov.vercel.app/countries" },
    { name: title, url: canonical },
  ]);

  const itemList = res.items.length > 0 ? itemListJsonLd(res.items.slice(0, 20).map(m => ({
    name: m.name,
    url: `https://nhungmov.vercel.app/phim/${m.slug}`,
    image: resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url) ?? undefined,
  }))) : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {itemList && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />}
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
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-500 mr-1">Sắp xếp:</span>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=desc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "desc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Mới nhất</Link>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=asc&lang=${sortLang}`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortType === "asc" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Cũ nhất</Link>
              <span className="text-xs text-zinc-500 ml-2 mr-1">Ngôn ngữ:</span>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=${sortType}&lang=vietsub`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "vietsub" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Vietsub</Link>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=${sortType}&lang=thuyet-minh`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "thuyet-minh" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Thuyết minh</Link>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=${sortType}&lang=long-tieng`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "long-tieng" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Lồng tiếng</Link>
              <Link href={`/quoc-gia/${encodeURIComponent(slug)}?page=1&sort=${sortType}&lang=all`} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${sortLang === "all" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"}`}>Tất cả</Link>
            </div>
            <div className="movie-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-6">
            {res.items.map((m) => (
              <MovieCard
                key={m.slug}
                slug={m.slug}
                title={m.name}
                posterUrl={resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url)}
                subTitle={m.episode_current ?? m.quality ?? "N/A"}
                quality={m.quality ?? ""}
                episode={m.episode_current ?? ""}
                year={m.year ?? null}
                duration={m.time ?? null}
              />
            ))}
          </div>
          </>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link
            href={`/quoc-gia/${encodeURIComponent(slug)}?page=${prevPage}&sort=${sortType}&lang=${sortLang}`}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 hover:border-cyan-400/30 hover:bg-cyan-400/10 transition"
          >
            ← Trang trước
          </Link>
          <Link
            href={`/quoc-gia/${encodeURIComponent(slug)}?page=${nextPage}&sort=${sortType}&lang=${sortLang}`}
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