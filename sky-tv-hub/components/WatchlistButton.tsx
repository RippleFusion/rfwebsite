"use client";

import { Check, Plus } from "lucide-react";
import { useApp } from "./AppProviders";

export function WatchlistButton({ id, className = "" }: { id: number; className?: string }) {
  const { watchlist, toggle } = useApp();
  const saved = watchlist.includes(id);
  return (
    <button
      type="button"
      onClick={() => toggle(id)}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium backdrop-blur-md border border-white/20 transition-colors ${
        saved ? "bg-sky-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
      } ${className}`}
    >
      {saved ? <Check size={18} /> : <Plus size={18} />}
      {saved ? "In Watchlist" : "Watchlist"}
    </button>
  );
}
