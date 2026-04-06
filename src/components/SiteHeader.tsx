"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

type HeaderCategory = {
  name: string;
  slug: string;
};

type SiteHeaderProps = {
  categories?: HeaderCategory[];
  searchPlaceholder?: string;
};

const mainMenuItems = [
  { href: "/phim-moi", label: "Phim mới", icon: "✨" },
  { href: "/phim-bo", label: "Phim bộ", icon: "📺" },
  { href: "/phim-le", label: "Phim lẻ", icon: "🎬" },
  { href: "/phim-vietsub", label: "Phim Vietsub", icon: "💬" },
  { href: "/phim-thuyet-minh", label: "Phim thuyết minh", icon: "🎙️" },
  { href: "/phim-long-tieng", label: "Phim lồng tiếng", icon: "🔊" },
  { href: "/hoat-hinh", label: "Anime", icon: "🌸" },
  { href: "/phim-chieu-rap", label: "Phim chiếu rạp", icon: "🎥" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({
  categories = [],
  searchPlaceholder = "Tìm kiếm...",
}: SiteHeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q") ?? "";
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-gradient-to-r focus:from-purple-600 focus:to-pink-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Chuyển đến nội dung chính
      </a>
      <header 
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolled 
            ? 'bg-zinc-900/95 backdrop-blur-xl shadow-2xl shadow-purple-500/10' 
            : 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900'
        }`} 
        role="banner"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-purple-600/5 pointer-events-none" />
        
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="group flex items-center gap-3" aria-label="ThunMov - Trang chủ">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg shadow-purple-500/40 group-hover:shadow-purple-500/60 transition-all duration-300 group-hover:scale-110">
                    <span className="text-lg font-black text-white">T</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <span className="text-xl font-black bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  ThunMov
                </span>
              </Link>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form action="/search" method="get" className="w-full" role="search">
                <div className="relative group">
                  <input 
                    type="text"
                    name="q"
                    defaultValue={searchValue}
                    placeholder={searchPlaceholder}
                    className="w-full px-5 py-2.5 pr-12 bg-zinc-800/80 border border-zinc-700/50 rounded-full text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:bg-zinc-800 transition-all duration-300 group-hover:border-zinc-600/50"
                    aria-label="Tìm kiếm phim, diễn viên, thể loại"
                  />
                  <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-purple-400 hover:bg-zinc-700/50 rounded-full transition-all duration-300" aria-label="Tìm kiếm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/favourite"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl hover:bg-pink-500/20 transition-all duration-300 hover:scale-110 group"
                aria-label="Yêu thích"
              >
                <svg className="w-5 h-5 text-zinc-400 group-hover:text-pink-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">0</span>
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-800/50 transition-all duration-300 border border-transparent hover:border-purple-500/30"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    aria-label={`Tài khoản ${user.username}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/30">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white">{user.username}</span>
                    <svg className="w-4 h-4 text-zinc-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl py-2 shadow-2xl shadow-purple-500/10 transition-all duration-300 ${
                      userMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-label="Menu tài khoản"
                  >
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-zinc-500">@{user.username.toLowerCase()}</p>
                    </div>
                    <div className="py-2">
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-300" role="menuitem">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hồ sơ cá nhân
                      </Link>
                      <Link href="/profile?tab=favorites" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-300" role="menuitem">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Phim yêu thích
                      </Link>
                      <Link href="/profile?tab=history" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-zinc-300 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-300" role="menuitem">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Lịch sử xem
                      </Link>
                    </div>
                    <div className="border-t border-zinc-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-all duration-300"
                        role="menuitem"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="group relative px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/40 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Đăng nhập</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              )}

              <button
                type="button"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-zinc-800/50 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              >
                <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="relative border-t border-zinc-800/50 bg-zinc-900/80 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-pink-600/5 pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="hidden lg:flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
              {mainMenuItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
                    }`}
                    aria-current={active ? "page" : undefined}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="mr-1.5">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <nav
              id="mobile-menu"
              className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'} py-4`}
              aria-label="Menu chính"
            >
              <form action="/search" method="get" className="mb-4 px-2" role="search">
                <div className="relative">
                  <input 
                    type="text"
                    name="q"
                    placeholder="Tìm kiếm..."
                    className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/50 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
                    aria-label="Tìm kiếm phim"
                  />
                </div>
              </form>

              <div className="mb-4">
                <h3 className="px-3 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Loại Phim</h3>
                <div className="flex flex-wrap gap-2">
                  {mainMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 bg-zinc-800/50 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-300"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="px-3 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Thể Loại</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/the-loai/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 text-sm text-zinc-300 bg-zinc-800/50 rounded-xl hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-white transition-all duration-300"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
