"use client";

import { useState } from "react";

export default function AISummary({ slug }: { slug: string }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGetSummary = async () => {
    if (summary) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-purple-500/10 via-zinc-900/70 to-cyan-500/10 p-5 shadow-xl shadow-black/20">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
        Tóm tắt AI
      </h3>

      {!summary && !loading && !error && (
        <button
          onClick={handleGetSummary}
          className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-medium hover:opacity-90 transition"
        >
          Tạo tóm tắt bằng AI
        </button>
      )}

      {loading && (
        <div className="mt-3 text-sm text-zinc-400 animate-pulse">
          AI đang phân tích nội dung phim...
        </div>
      )}

      {summary && (
        <div className="mt-3 text-sm text-zinc-300 leading-relaxed">
          {summary}
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-zinc-500">
          Chưa thể tạo tóm tắt. Vui lòng thử lại sau.
        </p>
      )}
    </div>
  );
}
