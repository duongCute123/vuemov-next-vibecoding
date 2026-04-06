import Link from "next/link";
import { getQuocGiaList } from "@/lib/phimapi";

export default async function CountriesPage() {
  const countries = await getQuocGiaList();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="text-2xl font-black text-cyan-400">NhungMov</Link>
          <nav className="hidden sm:flex gap-3 text-sm text-zinc-300">
            <Link href="/" className="hover:text-white">Trang chủ</Link>
            <Link href="/phim" className="hover:text-white">Phim</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-white">Quốc gia</h1>
          <p className="mt-2 text-zinc-300">Chọn quốc gia để xem phim theo khu vực.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {countries.map((country) => (
            <Link
              key={country.slug}
              href={`/quoc-gia/${country.slug}`}
              className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 text-center transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
            >
              <span className="text-lg font-semibold text-white">{country.name}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}