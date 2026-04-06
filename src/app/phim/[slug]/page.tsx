import EpisodePlayer from "@/components/EpisodePlayer";
import CommentsSection from "@/components/CommentsSection";
import AddHistoryTracker from "@/components/AddHistoryTracker";
import { getMovieDetail, resolveImageUrl, type MovieDetail } from "@/lib/phimapi";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

function stripHtml(value?: string) {
  if (!value) return "";
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { movie } = await getMovieDetail(slug);
  if (!movie) {
    return { title: "Không tìm thấy phim - NhungMov" };
  }
  const title = movie?.name || movie?.origin_name || "Phim";
  const description = movie?.content ? stripHtml(movie.content).slice(0, 160) : `Xem phim ${title} chất lượng cao tại NhungMov.`;
  const imageUrl = resolveImageUrl(movie?.poster_url || movie?.thumb_url);

  return {
    title: `${title} - Xem phim HD Vietsub | NhungMov`,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
      type: "video.movie",
    },
  };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { movie, episodes } = await getMovieDetail(slug);

  if (!movie) {
    notFound();
  }

  const detail = movie as MovieDetail | null;
  const title = detail?.name || detail?.origin_name || slug;
  const originTitle = detail?.origin_name && detail.origin_name !== title ? detail.origin_name : null;
  const posterUrl = resolveImageUrl(detail?.poster_url || detail?.thumb_url);
  const backdropUrl = resolveImageUrl(detail?.thumb_url || detail?.poster_url);
  const summary = stripHtml(detail?.content);

  const availableServers = episodes?.filter((server) => server?.server_data?.length) ?? [];
  
  const servers = availableServers.map((server) => ({
    server_name: server.server_name,
    server_data: server.server_data?.map((episode) => ({
      name: episode.name,
      slug: episode.slug,
      link_embed: episode.link_embed,
      link_m3u8: episode.link_m3u8,
    })) ?? [],
  }));

  const metaItems = [
    detail?.quality ? { label: "Chất lượng", value: detail.quality } : null,
    detail?.lang ? { label: "Ngôn ngữ", value: detail.lang } : null,
    detail?.episode_current ? { label: "Trạng thái", value: detail.episode_current } : null,
    { label: "Số server", value: String(availableServers.length) },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": title,
    "description": summary,
    "image": posterUrl,
    "dateCreated": (() => {
      const d = detail?.created;
      if (!d) return undefined;
      const date = new Date(d);
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    })(),
    "director": detail?.director ? { "@type": "Person", "name": detail.director } : undefined,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <AddHistoryTracker slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {backdropUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={backdropUrl} alt={title} className="h-full w-full object-cover opacity-25" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cyan-500/10 via-zinc-950 to-fuchsia-500/10" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-zinc-950/70 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_right,rgba(217,70,239,0.16),transparent_28%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-zinc-300">
            <Link href="/" className="transition hover:text-white">
              Trang chủ
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href="/phim" className="transition hover:text-white">
              Phim
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-white">{title}</span>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10">
            <div className="mx-auto w-full max-w-[320px]">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-zinc-900/70 shadow-2xl shadow-black/40 backdrop-blur">
                {posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={posterUrl} alt={title} className="aspect-[2/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[2/3] w-full items-center justify-center bg-zinc-900 text-sm text-zinc-500">
                    Chưa có poster
                  </div>
                )}
              </div>
            </div>

            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Streaming
                </span>
                {detail?.quality ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
                    {detail.quality}
                  </span>
                ) : null}
                {detail?.lang ? (
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
                    {detail.lang}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h1>
              {originTitle ? <p className="mt-2 text-lg text-zinc-300">{originTitle}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="#xem-phim"
                  className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
                >
                  Xem ngay
                </Link>
                <Link
                  href="/phim"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Quay lại danh sách
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {metaItems.length ? (
                  metaItems.map((item) => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{item.label}</div>
                      <div className="mt-2 text-sm font-semibold text-white">{item.value}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400 backdrop-blur">
                    Thông tin phim đang được cập nhật.
                  </div>
                )}
              </div>

              <div className="mt-8 rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-white">Nội dung phim</h2>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Overview</span>
                </div>
                {detail?.content ? (
                  <div className="prose prose-invert mt-4 max-w-none prose-p:text-zinc-300 prose-strong:text-white">
                    <div dangerouslySetInnerHTML={{ __html: String(detail.content) }} />
                  </div>
                ) : summary ? (
                  <p className="mt-4 text-sm leading-7 text-zinc-300">{summary}</p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-zinc-400">Bộ phim này hiện chưa có mô tả chi tiết.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="xem-phim" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Watch now</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Trình phát phim</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Chọn server và tập phù hợp để bắt đầu xem ngay trong giao diện tối ưu cho màn hình lớn.
                </p>
              </div>
            </div>

            {servers.length ? (
              <EpisodePlayer servers={servers} movieSlug={slug} />
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/10 bg-zinc-900/50 px-6 py-12 text-center">
                <h3 className="text-lg font-semibold text-white">Chưa có nguồn phát</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Bộ phim này hiện chưa có tập phim hoặc link xem hợp lệ. Vui lòng quay lại sau.
                </p>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur">
              <h3 className="text-lg font-semibold text-white">Thông tin nhanh</h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tên phim</div>
                  <div className="mt-2 text-sm font-medium text-white">{title}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Số server</div>
                  <div className="mt-2 text-sm font-medium text-white">{availableServers.length || 0}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Số tập khả dụng</div>
                  <div className="mt-2 text-sm font-medium text-white">{servers[0]?.server_data?.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 shadow-xl shadow-black/20 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Server hiện có</h3>
                <span className="text-xs text-zinc-500">{availableServers.length} lựa chọn</span>
              </div>

              {availableServers.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {availableServers.map((server, idx) => (
                    <span
                      key={server.server_name}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-medium",
                        idx === 0
                          ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                          : "border-white/10 bg-white/5 text-zinc-300",
                      ].join(" ")}
                    >
                      {server.server_name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-zinc-400">Chưa có server nào được cung cấp.</p>
              )}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-zinc-900/70 to-fuchsia-500/10 p-5 shadow-xl shadow-black/20">
              <h3 className="text-lg font-semibold text-white">Mẹo trải nghiệm</h3>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li>- Ưu tiên xem ở chế độ toàn màn hình để có trải nghiệm tốt nhất.</li>
                <li>- Nếu link hiện tại lỗi, hãy thử đổi sang tập khác hoặc quay lại sau.</li>
                <li>- Chất lượng hiển thị phụ thuộc vào nguồn phát từ API.</li>
              </ul>
            </div>
          </aside>
        </div>

        <CommentsSection slug={slug} movieTitle={title} />
      </main>
    </div>
  );
}