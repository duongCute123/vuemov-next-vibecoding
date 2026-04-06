"use client";

import Link from "next/link";

const footerLinks = {
  movies: [
    { href: "/phim-moi", label: "Phim mới" },
    { href: "/phim-bo", label: "Phim bộ" },
    { href: "/phim-le", label: "Phim lẻ" },
    { href: "/phim-chieu-rap", label: "Phim chiếu rạp" },
    { href: "/hoat-hinh", label: "Anime" },
    { href: "/tv-shows", label: "TV Shows" },
  ],
  categories: [
    { href: "/the-loai/hanh-dong", label: "Hành Động" },
    { href: "/the-loai/tinh-cam", label: "Tình Cảm" },
    { href: "/the-loai/hai-huoc", label: "Hài Hước" },
    { href: "/the-loai/co-trang", label: "Cổ Trang" },
    { href: "/the-loai/phieu-luu", label: "Phiêu Lưu" },
    { href: "/the-loai/kinh-di", label: "Kinh Dị" },
  ],
  countries: [
    { href: "/quoc-gia/viet-nam", label: "Việt Nam" },
    { href: "/quoc-gia/trung-quoc", label: "Trung Quốc" },
    { href: "/quoc-gia/han-quoc", label: "Hàn Quốc" },
    { href: "/quoc-gia/au-my", label: "Âu Mỹ" },
    { href: "/quoc-gia/thai-lan", label: "Thái Lan" },
  ],
  info: [
    { href: "/phim-vietsub", label: "Phim Vietsub" },
    { href: "/phim-thuyet-minh", label: "Phim Thuyết Minh" },
    { href: "/phim-long-tieng", label: "Phim Lồng Tiếng" },
    { href: "/sap-chieu", label: "Phim Sắp Chiếu" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="bg-zinc-900 border-t border-white/10" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">ThunMov</Link>
            <p className="mt-3 text-sm text-zinc-400">
              Xem phim online miễn phí chất lượng cao, cập nhật liên tục mỗi ngày.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-red-500 hover:text-white transition-colors" aria-label="Youtube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <nav aria-labelledby="footer-movies">
            <h3 id="footer-movies" className="text-sm font-semibold text-white mb-4">Loại Phim</h3>
            <ul className="space-y-2">
              {footerLinks.movies.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories">
            <h3 id="footer-categories" className="text-sm font-semibold text-white mb-4">Thể Loại</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-info">
            <h3 id="footer-info" className="text-sm font-semibold text-white mb-4">Thông Tin</h3>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-red-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} ThunMov. All rights reserved.
            </p>
            <p className="text-sm text-zinc-500">
              Xem phim online miễn phí không quảng cáo.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
