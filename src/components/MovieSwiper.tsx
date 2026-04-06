"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import MovieCard from "./MovieCard";

export default function MovieSwiper(props: {
  title?: string;
  items: Array<{ slug: string; name: string; poster_url?: string | null }>;
}) {
  const { title, items } = props;

  return (
    <section className="w-full">
      {title ? (
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        </div>
      ) : null}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={2}
        spaceBetween={12}
        loop={true}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          900: { slidesPerView: 4 },
        }}
      >
        {items.map((m) => (
          <SwiperSlide key={m.slug}>
            <MovieCard
              slug={m.slug}
              title={m.name}
              posterUrl={m.poster_url ? String(m.poster_url) : null}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

