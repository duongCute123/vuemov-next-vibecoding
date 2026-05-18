import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
    ];
  },
};

export default nextConfig;
