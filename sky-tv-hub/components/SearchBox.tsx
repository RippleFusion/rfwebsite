"use client";
/* eslint-disable @next/next/no-img-element */

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { IMG } from "@/lib/tmdb";
import type { ShowSummary } from "@/lib/types";
import { useApp } from "./AppProviders";

export function SearchBox() {
  const { openShow } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShowSummary[]>([]);
  const q = query.trim();
  const active = q.length >= 2;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => (r.ok ? r.json() : []))
        .then((d: ShowSummary[]) => !cancelled && setResults(d))
        .catch(() => !cancelled && setResults([]));
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, active]);

  const shown = active ? results : [];

  return (
    <div className="relative w-full sm:w-72">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && setQuery("")}
        placeholder="Search shows"
        aria-label="Search shows"
        className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 backdrop-blur-md placeholder:text-white/40"
      />
      {shown.length > 0 && (
        <ul className="absolute right-0 z-40 mt-2 max-h-96 w-full min-w-72 overflow-y-auto rounded-xl border border-white/10 bg-[#0b1220]/95 p-1 backdrop-blur-md">
          {shown.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => {
                  openShow(s);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/10"
              >
                {s.poster_path ? (
                  <img src={`${IMG}/w92${s.poster_path}`} alt="" className="h-14 w-10 rounded object-cover" />
                ) : (
                  <div className="h-14 w-10 rounded bg-white/10" />
                )}
                <span>
                  <span className="block text-sm font-medium">{s.name}</span>
                  <span className="block text-xs text-white/50">{s.first_air_date?.slice(0, 4) ?? ""}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
