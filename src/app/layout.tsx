import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ReduxProvider } from "@/lib/store/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nhungmov.vercel.app"),
  verification: {
    google: "jZOo6rJMiX5v8i1A7IkmqPMEPHaZA6bpVN74ASCsPBY",
  },
  title: {
    default: "NhungMov - Xem phim online miễn phí",
    template: "%s | NhungMov",
  },
  description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub. Kho phim phong phú, cập nhật liên tục.",
  keywords: ["xem phim online", "phim miễn phí", "phim vietsub", "phim hd", "phim mới", "phim lẻ", "phim bộ", "xem phim", "phim hay"],
  authors: [{ name: "NhungMov" }],
  creator: "NhungMov",
  publisher: "NhungMov",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nhungmov.vercel.app",
    siteName: "NhungMov",
    title: "NhungMov - Xem phim online miễn phí",
    description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NhungMov - Xem phim online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NhungMov - Xem phim online miễn phí",
    description: "NhungMov - Xem phim online miễn phí, phim mới nhất, phim chất lượng cao, vietsub",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://nhungmov.vercel.app",
    languages: {
      vi: "https://nhungmov.vercel.app",
    },
  },
  category: "entertainment",
  classification: "Movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
