# NhungMov - Xem phim online miễn phí

Website xem phim online miễn phí với giao diện streaming hiện đại, hỗ trợ xem phim bộ, phim lẻ, phim chiếu rạp vietsub chất lượng cao.

**URL:** [https://nhungmov.vercel.app](https://nhungmov.vercel.app)

## Công nghệ

- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4
- **State:** Redux Toolkit
- **Auth:** Firebase Authentication
- **Animation:** Framer Motion
- **Carousel:** Swiper
- **API:** phimapi.com

## Tính năng

- Xem phim online (phim bộ, phim lẻ, phim chiếu rạp, hoạt hình, TV shows)
- Lọc phim theo thể loại, quốc gia, năm
- Tìm kiếm phim nâng cao
- Đăng nhập/đăng ký với Firebase
- Bình luận dưới phim
- Lịch sử xem phim
- Yêu thích phim
- Responsive, mobile-first
- SEO tối ưu (Google Search Console, sitemap, JSON-LD, robots.txt)
- Hỗ trợ nhiều server phát

## Cài đặt

```bash
npm install
```

## Chạy development

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Biến môi trường

Tạo file `.env.local`:

```env
NEXT_PUBLIC_PHIMAPI_BASE=https://phimapi.com
NEXT_PUBLIC_PHIMIMG_CDN=https://phimimg.com
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## API Backend

Backend Java Spring Boot: [https://github.com/duongCute123/apivuemov-next](https://github.com/duongCute123/apivuemov-next)

CORS đã cấu hình cho phép `https://nhungmov.vercel.app` và `http://localhost:3000`.

## Cấu trúc thư mục

```
src/
├── app/
│   ├── phim/[slug]/        # Trang chi tiết phim
│   ├── the-loai/[slug]/    # Lọc theo thể loại
│   ├── quoc-gia/[slug]/    # Lọc theo quốc gia
│   ├── phim-bo/            # Phim bộ
│   ├── phim-le/            # Phim lẻ
│   ├── phim-moi/           # Phim mới
│   ├── phim-chieu-rap/     # Phim chiếu rạp
│   ├── hoat-hinh/          # Hoạt hình
│   ├── tv-shows/           # TV Shows
│   ├── search/             # Tìm kiếm
│   ├── auth/               # Đăng nhập
│   ├── profile/            # Hồ sơ
│   ├── favourite/          # Yêu thích
│   ├── countries/          # Danh sách quốc gia
│   ├── sitemap.ts          # Sitemap động
│   └── layout.tsx          # Layout chính + SEO metadata
├── components/
│   ├── MovieCard.tsx       # Card phim
│   ├── SiteHeader.tsx      # Header navigation
│   ├── SiteFooter.tsx      # Footer
│   └── ...
└── lib/
    ├── phimapi.ts          # API client
    ├── auth-context.tsx     # Auth context
    └── store/              # Redux store
```

## SEO

- ✅ robots.txt cho phép crawl toàn bộ
- ✅ Sitemap động (static pages + categories + countries + movies)
- ✅ Metadata + canonical URL trên mọi trang
- ✅ JSON-LD structured data (WebSite, Movie, BreadcrumbList)
- ✅ Google Search Console verified
- ✅ Security headers (X-Robots-Tag, X-Content-Type-Options, etc.)
