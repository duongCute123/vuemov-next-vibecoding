import type { ReactNode } from "react";

export function AnimatedSection({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`animate-on-scroll ${className ?? ""}`}
    >
      {children}
    </section>
  );
}

export function AnimatedGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={className}
    >
      {children}
    </div>
  );
}

export function AnimatedCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`animate-on-scroll-card ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
