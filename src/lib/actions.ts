"use server";

import { getNewUpdatedMovies, getMovieDetail, getMoviesByCategory, resolveImageUrl } from "./phimapi";

export interface LoadMoreResult {
  items: Array<{
    slug: string;
    name: string;
    posterUrl: string | null;
    subTitle: string;
    quality: string | null;
    episode: string | null;
    year: number | string | null;
    duration: string | null;
  }>;
  hasMore: boolean;
}

export async function getRecommendations(historySlugs: string[]): Promise<LoadMoreResult["items"]> {
  try {
    const watched = new Set(historySlugs);
    const detailPromises = historySlugs.slice(0, 5).map((slug) =>
      getMovieDetail(slug).catch(() => ({ movie: null, episodes: [] }))
    );
    const details = await Promise.all(detailPromises);

    const categorySlugs = new Set<string>();
    for (const d of details) {
      if (d.movie?.category) {
        for (const c of d.movie.category) {
          categorySlugs.add(c.slug);
        }
      }
    }

    if (categorySlugs.size === 0) return [];

    const topCategories = Array.from(categorySlugs).slice(0, 3);
    const promises = topCategories.map((slug) =>
      getMoviesByCategory(slug, { page: 1, limit: 8 }).catch(() => ({ items: [] }))
    );
    const results = await Promise.all(promises);

    const seen = new Set<string>();
    const recommendations: LoadMoreResult["items"] = [];

    for (const res of results) {
      for (const m of res.items) {
        if (watched.has(m.slug) || seen.has(m.slug)) continue;
        seen.add(m.slug);
        recommendations.push({
          slug: m.slug,
          name: m.name,
          posterUrl: resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url),
          subTitle: m.lang ?? m.episode_current ?? m.quality ?? "",
          quality: m.quality ?? null,
          episode: m.episode_current ?? null,
          year: m.year ?? null,
          duration: m.time ?? null,
        });
        if (recommendations.length >= 12) break;
      }
      if (recommendations.length >= 12) break;
    }

    return recommendations;
  } catch {
    return [];
  }
}

export async function loadMoreMovies(opts: {
  type_list?: string;
  page: number;
  limit?: number;
  sort_type?: "asc" | "desc";
  sort_lang?: string;
}): Promise<LoadMoreResult> {
  const apiOpts: { page: number; limit: number; sort_type: "asc" | "desc"; type_list?: string; sort_lang?: string } = {
    page: opts.page,
    limit: opts.limit ?? 12,
    sort_type: opts.sort_type ?? "desc",
  };
  if (opts.type_list) apiOpts.type_list = opts.type_list;
  if (opts.sort_lang) apiOpts.sort_lang = opts.sort_lang;

  const data = await getNewUpdatedMovies(apiOpts).catch(() => ({ items: [] }));
  return {
    items: data.items.map((m) => ({
      slug: m.slug,
      name: m.name,
      posterUrl: resolveImageUrl(m.poster_url) ?? resolveImageUrl(m.thumb_url),
      subTitle: m.lang ?? m.episode_current ?? m.quality ?? "",
      quality: m.quality ?? null,
      episode: m.episode_current ?? null,
      year: m.year ?? null,
      duration: m.time ?? null,
    })),
    hasMore: data.items.length === (opts.limit ?? 12),
  };
}
