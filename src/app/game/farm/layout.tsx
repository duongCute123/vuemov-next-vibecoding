import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nông Trại Vui Vẻ - NhungMov",
  description: "Chơi game nông trại vui vẻ trực tuyến miễn phí. Trồng trọt, chăm sóc cây trồng và thu hoạch tại NhungMov.",
  alternates: { canonical: "https://nhungmov.vercel.app/game/farm" },
};

export default function FarmLayout({ children }: { children: React.ReactNode }) {
  return children;
}