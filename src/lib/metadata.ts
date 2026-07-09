import type { Metadata } from "next";

const siteName = "NhungMov";
const baseUrl = "https://nhungmov.vercel.app";

export function createPageMetadata(title: string, description: string, canonicalPath: string, ogImage?: string): Metadata {
  const canonical = `${baseUrl}${canonicalPath}`;
  const img = ogImage ?? "/og-image.svg";

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: canonical,
      siteName,
      title: `${title} | ${siteName}`,
      description,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [img],
    },
  };
}

export function homePageMetadata(): Metadata {
  return {
    description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub. Kho phim phong phú, cập nhật liên tục.",
    alternates: { canonical: baseUrl },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: baseUrl,
      siteName,
      title: "NhungMov - Xem phim online miễn phí",
      description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "NhungMov - Xem phim online" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "NhungMov - Xem phim online miễn phí",
      description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub",
      images: ["/og-image.svg"],
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

export function itemListJsonLd(items: Array<{ name: string; url: string; image?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": item.url,
      "item": {
        "@type": "Movie",
        "name": item.name,
        "url": item.url,
        "image": item.image,
      },
    })),
  };
}
