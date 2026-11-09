"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ShowSummary } from "@/lib/types";
import { ShowCard } from "./ShowCard";

export function Rail({ title, shows }: { title: string; shows: ShowSummary[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section className="group/rail relative px-6 py-4" aria-label={title}>
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {shows.length === 0 ? (
        <p className="text-white/50">Nothing to show right now.</p>
      ) : (
        <div className="relative">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 opacity-0 backdrop-blur-md transition-opacity group-hover/rail:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft />
          </button>
          <div ref={ref} className="no-scrollbar flex gap-4 overflow-x-auto py-3 -my-3 px-1 scroll-smooth">
            {shows.map((s) => (
              <ShowCard key={s.id} show={s} />
            ))}
          </div>
          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/70 p-2 opacity-0 backdrop-blur-md transition-opacity group-hover/rail:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </section>
  );
}
