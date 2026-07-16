"use client";

import { useMemo, useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { addHistory } from "@/lib/api-service";

type ServerData = {
  server_name: string;
  server_data: Array<{
    name: string;
    slug: string;
    link_embed?: string;
    link_m3u8?: string;
  }>;
};

export default function EpisodePlayer(props: {
  servers: ServerData[];
  movieSlug: string;
}) {
  const { servers, movieSlug } = props;
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  
  const currentServer = servers[activeServerIndex];
  const episodes = useMemo(() => currentServer?.server_data?.map((ep) => ({
    name: ep.name,
    slug: ep.slug,
    link_embed: ep.link_embed,
    link_m3u8: ep.link_m3u8,
  })) ?? [], [currentServer]);
  
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const { user } = useAuth();

  const active = useMemo(() => {
    if (selectedSlug) {
      return episodes.find(e => e.slug === selectedSlug) ?? episodes[0] ?? null;
    }
    return episodes[0] ?? null;
  }, [selectedSlug, episodes]);

  const activeSrc = useMemo(() => {
    if (!active) return null;
    return active.link_embed || null;
  }, [active]);

  useEffect(() => {
    if (user && movieSlug) {
      addHistory(movieSlug).catch(() => {});
    }
  }, [user, movieSlug]);

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {servers.map((server, index) => (
            <button
              key={server.server_name}
              type="button"
              onClick={() => setActiveServerIndex(index)}
              className={[
                "px-4 py-2 text-sm rounded-lg border transition-colors whitespace-nowrap",
                activeServerIndex === index
                  ? "bg-cyan-400 text-zinc-950 border-cyan-400 font-semibold"
                  : "bg-white/5 text-zinc-300 border-white/10 hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-white",
              ].join(" ")}
            >
              {server.server_name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-zinc-500 mb-2">Đang chiếu: <span className="text-cyan-400">{active?.name}</span></div>
      </div>

      {episodes.length ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 max-h-[280px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {episodes.map((e) => (
            <button
              key={e.slug}
              type="button"
              onClick={() => setSelectedSlug(e.slug)}
              className={[
                "px-2 py-2 text-xs rounded-lg border transition-colors",
                active?.slug === e.slug 
                  ? "bg-cyan-400 text-zinc-950 border-cyan-400 font-semibold" 
                  : "bg-white/5 text-zinc-300 border-white/10 hover:bg-cyan-400/20 hover:border-cyan-400/40 hover:text-white",
              ].join(" ")}
            >
              {e.name}
            </button>
          ))}
        </div>
      ) : null}

      <div
        key={active?.slug}
        className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 animate-fade-scale-in"
      >
        {activeSrc ? (
          <iframe 
            src={activeSrc} 
            title={active?.name ?? "Episode player"} 
            className="w-full h-full" 
            allowFullScreen 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">Chưa có nguồn phát</div>
        )}
      </div>
    </div>
  );
}