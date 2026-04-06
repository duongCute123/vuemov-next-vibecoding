import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎬</div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-zinc-400 mb-6">Không tìm thấy nội dung bạn yêu cầu</p>
        <Link
          href="/"
          className="inline-block rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          Quay về trang chủ
        </Link>
      </div>
    </div>
  );
}
