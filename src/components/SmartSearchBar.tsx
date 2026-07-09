"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SmartSearchBar({ placeholder }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (aiMode) {
      setLoading(true);
      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        if (data.success) {
          const params = new URLSearchParams();
          params.set("q", data.keyword || q);
          if (data.filters?.category) params.set("category", data.filters.category);
          if (data.filters?.country) params.set("country", data.filters.country);
          if (data.filters?.year) params.set("year", data.filters.year);
          if (data.filters?.type) params.set("type", data.filters.type);
          router.push(`/advanced-search?${params.toString()}`);
          return;
        }
      } catch {
        // fallback to normal search
      } finally {
        setLoading(false);
      }
    }

    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestion(true)}
            onBlur={() => setTimeout(() => setShowSuggestion(false), 200)}
            placeholder={aiMode ? "VD: phim hành động hay năm 2024..." : placeholder || "Tìm kiếm phim..."}
            className="w-full rounded-xl border border-white/10 bg-zinc-800/80 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/50 transition"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-zinc-500">⌘K</kbd>
        </div>

        <button
          type="button"
          onClick={() => setAiMode(!aiMode)}
          className={`p-2.5 rounded-xl border text-xs font-medium transition ${
            aiMode
              ? "bg-purple-500/30 border-purple-400/30 text-purple-300"
              : "border-white/10 text-zinc-400 hover:border-zinc-600"
          }`}
          title={aiMode ? "Tắt AI search" : "Bật AI search"}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </button>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "..." : "Tìm"}
        </button>
      </div>

      {showSuggestion && query.length > 2 && aiMode && (
        <div className="absolute top-full mt-2 left-0 right-0 rounded-xl border border-purple-500/20 bg-zinc-900 p-3 shadow-xl z-30">
          <p className="text-xs text-zinc-400">
            🔍 AI search đang bật. Bạn có thể gõ tự nhiên như:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {["phim hành động mỹ", "phim hay 2024", "phim kinh dị hàn quốc", "phim bộ trung quốc"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => { setQuery(s); inputRef.current?.focus(); }}
                className="px-2 py-1 rounded-lg bg-white/5 text-xs text-zinc-300 hover:bg-purple-500/20 hover:text-purple-200 transition"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
