"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

type ServerData = {
  server_name: string;
  server_data: Array<{
    name: string;
    slug: string;
    link_embed?: string;
    link_m3u8?: string;
  }>;
};

type EpisodeItem = {
  name: string;
  slug: string;
  link_embed?: string;
  link_m3u8?: string;
};

export default function EpisodePlayer(props: {
  servers: ServerData[];
  movieSlug: string;
}) {
  const { servers, movieSlug } = props;
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  
  const currentServer = servers[activeServerIndex];
  const episodes = currentServer?.server_data?.map((ep) => ({
    name: ep.name,
    slug: ep.slug,
    link_embed: ep.link_embed,
    link_m3u8: ep.link_m3u8,
  })) ?? [];
  
  const first = episodes[0] ?? null;
  const [active, setActive] = useState<EpisodeItem | null>(first);
  const { user } = useAuth();

  useEffect(() => {
    if (currentServer?.server_data?.length) {
      setActive(currentServer.server_data[0]);
    }
  }, [activeServerIndex]);

  const activeSrc = useMemo(() => {
    if (!active) return null;
    return active.link_embed || null;
  }, [active]);

  useEffect(() => {
    if (user && movieSlug) {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addHistory', userId: user.id, slug: movieSlug }),
      }).catch(() => {});
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
              onClick={() => setActive(e)}
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

      <motion.div
        key={active?.slug}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10"
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
      </motion.div>
    </div>
  );
}