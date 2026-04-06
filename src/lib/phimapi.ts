export const PHIMAPI_BASE = process.env.NEXT_PUBLIC_PHIMAPI_BASE || "https://phimapi.com";
export const PHIMIMG_CDN = process.env.NEXT_PUBLIC_PHIMIMG_CDN || "https://phimimg.com";

export function resolveImageUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${PHIMIMG_CDN}${url}`;
  return `${PHIMIMG_CDN}/${url}`;
}

interface ApiError {
  status: boolean;
  msg: string;
}

interface MovieListData {
  items: MovieListItem[];
}

interface ApiResponse<T> {
  status?: boolean;
  msg?: string;
  data?: T;
}

async function phimapiFetchJson<T>(url: string): Promise<T> {
  const resp = await fetch(url, {
    headers: { "User-Agent": "vuemov-next/1.0" },
    cache: "no-store",
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`phimapiFetchJson failed: ${resp.status} ${resp.statusText} ${text.slice(0, 120)}`);
  }
  const json = await resp.json() as T;
  return json;
}

export interface MovieListItem {
  slug: string;
  name: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
  time?: string;
  year?: number | string;
  content?: string;
  category?: Array<{ name: string; slug: string }>;
  country?: Array<{ name: string; slug: string }>;
}

export interface MovieDetail {
  name?: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  quality?: string;
  lang?: string;
  episode_current?: string;
  content?: string;
  created?: string;
  director?: string;
}

export interface TheLoaiItem {
  _id: string;
  name: string;
  slug: string;
}

export interface MovieEpisodeServerDataItem {
  name: string;
  slug: string;
  filename?: string;
  link_embed?: string;
  link_m3u8?: string;
}

export interface MovieEpisode {
  server_name: string;
  server_data: MovieEpisodeServerDataItem[];
}

export interface MovieListResult {
  items: MovieListItem[];
}

export interface SearchResult extends MovieListResult {
  params?: { total: number; page: number; limit: number };
}

export async function getNewUpdatedMovies(opts?: {
  type_list?: string;
  page?: number;
  limit?: number;
  sort_lang?: string;
  sort_type?: "asc" | "desc";
}): Promise<MovieListResult> {
  const type_list = opts?.type_list ?? "phim-vietsub";
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 12;
  const sort_lang = opts?.sort_lang ?? "vietsub";
  const sort_type = opts?.sort_type ?? "desc";

  const url = `${PHIMAPI_BASE}/v1/api/danh-sach/${type_list}?page=${page}&sort_field=modified.time&sort_type=${sort_type}&sort_lang=${sort_lang}&limit=${limit}`;
  const json = await phimapiFetchJson<ApiResponse<MovieListData>>(url);
  return { items: json.data?.items ?? [] };
}

export async function getTheLoaiList(): Promise<TheLoaiItem[]> {
  const url = `${PHIMAPI_BASE}/the-loai`;
  return phimapiFetchJson<TheLoaiItem[]>(url);
}

export async function getMoviesByCategory(slug: string, opts?: { page?: number; limit?: number; sort_lang?: string }): Promise<MovieListResult> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 24;
  const sort_lang = opts?.sort_lang ?? "vietsub";

  const url = `${PHIMAPI_BASE}/v1/api/the-loai/${encodeURIComponent(slug)}?page=${page}&sort_field=modified.time&sort_type=desc&sort_lang=${encodeURIComponent(sort_lang)}&limit=${limit}`;
  const json = await phimapiFetchJson<ApiResponse<MovieListData>>(url);
  return { items: json.data?.items ?? [] };
}

export async function searchMovies(keyword: string, opts?: { page?: number; limit?: number; sort_lang?: string }): Promise<SearchResult> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 24;
  const sort_lang = opts?.sort_lang ?? "vietsub";

  const url = `${PHIMAPI_BASE}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}&sort_field=_id&sort_type=asc&sort_lang=${encodeURIComponent(sort_lang)}&limit=${limit}`;
  const json = await phimapiFetchJson<ApiResponse<SearchResult>>(url);
  return {
    items: json.data?.items ?? [],
    params: json.data?.params
  };
}

export async function getMovieDetail(slug: string): Promise<{ movie: MovieDetail | null; episodes: MovieEpisode[] }> {
  const url = `${PHIMAPI_BASE}/phim/${encodeURIComponent(slug)}`;
  const json = await phimapiFetchJson<{ movie?: MovieDetail | null; episodes?: MovieEpisode[] }>(url);
  return { movie: json.movie ?? null, episodes: json.episodes ?? [] };
}

export interface QuocGiaItem {
  _id: string;
  name: string;
  slug: string;
}

export async function getQuocGiaList(): Promise<QuocGiaItem[]> {
  const url = `${PHIMAPI_BASE}/quoc-gia`;
  return phimapiFetchJson<QuocGiaItem[]>(url);
}

export async function getMoviesByCountry(slug: string, opts?: { page?: number; limit?: number; sort_lang?: string }): Promise<MovieListResult> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 24;
  const sort_lang = opts?.sort_lang ?? "vietsub";

  const url = `${PHIMAPI_BASE}/v1/api/quoc-gia/${encodeURIComponent(slug)}?page=${page}&sort_field=_id&sort_type=asc&sort_lang=${encodeURIComponent(sort_lang)}&limit=${limit}`;
  const json = await phimapiFetchJson<ApiResponse<MovieListData>>(url);
  return { items: json.data?.items ?? [] };
}

export async function getMoviesByYear(year: number, opts?: { page?: number; limit?: number; sort_lang?: string }): Promise<MovieListResult> {
  const page = opts?.page ?? 1;
  const limit = opts?.limit ?? 24;
  const sort_lang = opts?.sort_lang ?? "vietsub";

  const url = `${PHIMAPI_BASE}/v1/api/nam/${year}?page=${page}&sort_field=modified.time&sort_type=desc&sort_lang=${encodeURIComponent(sort_lang)}&limit=${limit}`;
  const json = await phimapiFetchJson<ApiResponse<MovieListData>>(url);
  return { items: json.data?.items ?? [] };
}

