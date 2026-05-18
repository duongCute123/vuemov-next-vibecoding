"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchFavorites, addFavorite, removeFavorite } from "@/lib/store/moviesSlice";

interface MovieCardProps {
  slug: string;
  title: string;
  posterUrl: string | null;
  subTitle?: string;
  quality?: string | null;
  episode?: string | null;
  year?: number | string | null;
  duration?: string | null;
  origin?: string | null;
  slideshowImages?: string[];
}

export default function MovieCard({
  slug,
  title,
  posterUrl,
  subTitle,
  quality,
  episode,
  year,
  duration,
  origin,
  slideshowImages,
}: MovieCardProps) {
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const { user } = useAuth();
  const slideshowSrcs = slideshowImages?.filter(Boolean) ?? [];
  const isSlideshow = slideshowSrcs.length >= 2;

  useEffect(() => {
    if (!isSlideshow || isHovered) return;
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % slideshowSrcs.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isSlideshow, isHovered, slideshowSrcs.length]);

  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.movies.favorites);
  const isFavorite = favorites.includes(slug);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    }
  }, [user, dispatch]);

  const toggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/auth?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(slug)).unwrap();
      } else {
        await dispatch(addFavorite(slug)).unwrap();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [user, slug, isFavorite, dispatch]);

  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900 transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/phim/${encodeURIComponent(slug)}`}
        className="block"
        aria-label={`Xem phim ${title}${subTitle ? ` - ${subTitle}` : ''}`}
      >
        <div className="relative aspect-[2/3] bg-gradient-to-br from-zinc-700 to-zinc-800 overflow-hidden">
          {isSlideshow ? (
            <div className="absolute inset-0 overflow-hidden">
              {slideshowSrcs.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${title} - hình ${i + 1}`}
                  loading={i === 0 ? "lazy" : undefined}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${i === slideIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                />
              ))}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {slideshowSrcs.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === slideIndex ? 'bg-white w-3' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          ) : posterUrl && !imgError ? (
            <>
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 animate-pulse" />
              )}
              <img
                src={posterUrl}
                alt={title}
                loading="lazy"
                decoding="async"
                className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                onError={() => setImgError(true)}
                onLoad={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800 text-zinc-400" role="img" aria-label={`Hình ảnh placeholder cho phim ${title}`}>
              <svg className="h-16 w-16 mb-2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          )}

          <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {quality && (
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-[11px] font-bold text-white rounded-lg shadow-lg shadow-purple-500/50">
                {quality}
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={toggleFavorite}
              disabled={!user}
              className={`p-1.5 rounded-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                !user ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isFavorite 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
                  : 'bg-black/50 text-white/80 hover:bg-red-500/80 hover:text-white'
              }`}
              aria-label={isFavorite ? `Bỏ yêu thích phim ${title}` : `Thêm phim ${title} vào yêu thích`}
            >
              <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            {subTitle && !subTitle.toLowerCase().includes('thuyết minh') && (
              <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white rounded-md border border-white/20 flex items-center gap-1">
                {subTitle.toLowerCase().includes('vietsub') ? 'Vietsub' : subTitle}
              </span>
            )}
          </div>

          {episode && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-[10px] font-semibold text-white rounded-md shadow-lg shadow-cyan-500/30">
                {episode}
              </span>
            </div>
          )}

          {isHovered && (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 w-full px-4">
                <button
                  onClick={toggleFavorite}
                  disabled={!user}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    !user ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/20 text-white hover:bg-red-500'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {isFavorite ? 'Đã thích' : 'Yêu thích'}
                </button>
                <span
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(`/phim/${encodeURIComponent(slug)}`, '_self'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); window.open(`/phim/${encodeURIComponent(slug)}`, '_self'); } }}
                  role="link"
                  tabIndex={0}
                  className="w-full px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Xem ngay
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-zinc-500">
          {year && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {year}
            </span>
          )}
          {duration && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {duration}
            </span>
          )}
          {origin && <span className="text-purple-400">{origin}</span>}
        </div>
      </div>
    </article>
  );
}
