import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học Tiếng Trung",
  description: "Học tiếng Trung qua phim, từ vựng và hội thoại tiếng Trung cho người yêu thích phim Trung Quốc.",
  alternates: { canonical: "https://nhungmov.vercel.app/chinese" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nhungmov.vercel.app/chinese",
    siteName: "NhungMov",
    title: "Học Tiếng Trung | NhungMov",
    description: "Học tiếng Trung qua phim, từ vựng và hội thoại tiếng Trung cho người yêu thích phim Trung Quốc.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Học Tiếng Trung" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Học Tiếng Trung | NhungMov",
    description: "Học tiếng Trung qua phim, từ vựng và hội thoại tiếng Trung cho người yêu thích phim Trung Quốc.",
    images: ["/og-image.jpg"],
  },
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return children;
}