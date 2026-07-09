import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nông Trại Vui Vẻ",
  description: "Chơi game nông trại vui vẻ trực tuyến miễn phí. Trồng trọt, chăm sóc cây trồng và thu hoạch tại NhungMov.",
  alternates: { canonical: "https://nhungmov.vercel.app/game/farm" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nhungmov.vercel.app/game/farm",
    siteName: "NhungMov",
    title: "Nông Trại Vui Vẻ | NhungMov",
    description: "Chơi game nông trại vui vẻ trực tuyến miễn phí. Trồng trọt, chăm sóc cây trồng và thu hoạch tại NhungMov.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Nông Trại Vui Vẻ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nông Trại Vui Vẻ | NhungMov",
    description: "Chơi game nông trại vui vẻ trực tuyến miễn phí. Trồng trọt, chăm sóc cây trồng và thu hoạch tại NhungMov.",
    images: ["/og-image.svg"],
  },
};

export default function FarmLayout({ children }: { children: React.ReactNode }) {
  return children;
}