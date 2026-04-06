"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type SectionBlockProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function SectionBlock({
  title,
  description,
  actionLabel,
  actionHref,
  children,
  className = "",
  delay = 0,
}: SectionBlockProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className={`overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm ${className}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-6">
        <div>
          <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">{title}</h2>
          {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
        </div>

        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/15 hover:text-white"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>

      <div className="px-5 py-5 md:px-6">{children}</div>
    </motion.section>
  );
}