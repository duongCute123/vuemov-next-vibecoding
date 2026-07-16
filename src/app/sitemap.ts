import { getTheLoaiList, getQuocGiaList, getNewUpdatedMovies } from '@/lib/phimapi';
import { MetadataRoute } from 'next';

const MAX_LIMIT = 64;
const MAX_PAGES = 20;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nhungmov.vercel.app';

  const [categories, countries, ...moviePages] = await Promise.all([
    getTheLoaiList().catch(() => []),
    getQuocGiaList().catch(() => []),
    ...Array.from({ length: MAX_PAGES }, (_, i) =>
      getNewUpdatedMovies({ limit: MAX_LIMIT, page: i + 1 })
        .catch(() => ({ items: [] })),
    ),
  ]);

  const seenSlugs = new Set<string>();
  const allMovies = moviePages.flatMap(p => p.items).filter(m => {
    if (seenSlugs.has(m.slug)) return false;
    seenSlugs.add(m.slug);
    return true;
  });

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/phim`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/phim-bo`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-le`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-moi`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-vietsub`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-thuyet-minh`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-long-tieng`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${baseUrl}/phim-chieu-rap`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/hoat-hinh`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/tv-shows`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/sap-chieu`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/countries`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${baseUrl}/the-loai/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const countryPages = countries.map((country) => ({
    url: `${baseUrl}/quoc-gia/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const movieSitemapPages = allMovies.map((movie) => ({
    url: `${baseUrl}/phim/${movie.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...countryPages, ...movieSitemapPages];
}
