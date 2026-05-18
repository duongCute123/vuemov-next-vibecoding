"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeroMovie {
  slug: string;
  name: string;
  thumb_url: string | null;
  poster_url: string | null;
  quality?: string;
  episode_current?: string;
  year?: number | string;
  time?: string;
  lang?: string;
  content?: string;
}

export default function HeroSlideshow({ movies }: { movies: HeroMovie[] }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const total = movies.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setDir(1);
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDir(-1);
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(next, 6000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, total, next]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  if (!movies.length) return null;

  const movie = movies[current];
  const heroImage = movie.thumb_url || movie.poster_url;

  const bgVariants = {
    enter: () => ({ scale: 1.08, opacity: 0 }),
    center: { scale: 1, opacity: 1 },
    exit: () => ({ scale: 0.96, opacity: 0 }),
  };

  return (
    <section
      className="relative h-[70vh] min-h-[500px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero slideshow"
    >
      <div className="absolute inset-0">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={movie.slug}
            custom={dir}
            variants={bgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {heroImage ? (
              <Image
                src={heroImage}
                alt=""
                fill
                className="object-cover"
                priority={current === 0}
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 h-full flex items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={movie.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full text-xs font-semibold text-red-400 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              {movie.quality ?? 'HD'} • {movie.episode_current ?? 'Mới'}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              {movie.name}
            </h1>

            <div className="flex items-center gap-3 text-sm text-zinc-400 mb-4">
              {movie.year && <span>{movie.year}</span>}
              {movie.time && <><span>•</span><span>{movie.time}</span></>}
              {movie.lang && <><span>•</span><span>{movie.lang}</span></>}
            </div>

            <p className="text-sm text-zinc-300 line-clamp-3 mb-6">
              {movie.content ?? 'Khám phá kho phim miễn phí chất lượng cao, cập nhật liên tục mỗi ngày.'}
            </p>

            <div className="flex gap-3">
              <Link
                href={`/phim/${encodeURIComponent(movie.slug)}`}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem ngay
              </Link>
              <button className="px-6 py-3 border border-white/20 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                + Thêm vào list
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Trước"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:bg-black/50 hover:text-white transition-all"
            aria-label="Sau"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {movies.slice(0, 7).map((m, i) => (
              <button
                key={m.slug}
                onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-red-500"
                    : "w-2 h-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
            {total > 7 && (
              <span className="text-xs text-white/40 ml-1">
                +{total - 7}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}
