import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "phimimg.com" },
      { protocol: "https", hostname: "**.phimimg.com" },
      { protocol: "https", hostname: "img.ophim9.com" },
      { protocol: "https", hostname: "**.ophim9.com" },
      { protocol: "https", hostname: "phimapi.com" },
      { protocol: "https", hostname: "**.phimapi.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
