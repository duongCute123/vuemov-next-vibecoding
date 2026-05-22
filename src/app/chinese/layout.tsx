import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học Tiếng Trung - NhungMov",
  description: "Học tiếng Trung qua phim, từ vựng và hội thoại tiếng Trung cho người yêu thích phim Trung Quốc.",
  alternates: { canonical: "https://nhungmov.vercel.app/chinese" },
};

export default function ChineseLayout({ children }: { children: React.ReactNode }) {
  return children;
}