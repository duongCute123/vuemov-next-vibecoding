"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Đã xảy ra lỗi</h1>
        <p className="text-zinc-400 mb-6">{error.message || "Không thể tải nội dung. Vui lòng thử lại."}</p>
        <button
          onClick={reset}
          className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
