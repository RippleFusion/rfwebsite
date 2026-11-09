"use client";

import { useEffect, useState } from "react";
import type { ShowSummary } from "@/lib/types";
import { useApp } from "./AppProviders";
import { Rail } from "./Rail";

export function WatchlistView() {
  const { watchlist } = useApp();
  const key = watchlist.join(",");
  const [loaded, setLoaded] = useState<{ key: string; shows: ShowSummary[] } | null>(null);

  useEffect(() => {
    if (!key) return;
    let cancelled = false;
    fetch(`/api/shows?ids=${key}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((shows: ShowSummary[]) => !cancelled && setLoaded({ key, shows }))
      .catch(() => !cancelled && setLoaded({ key, shows: [] }));
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (watchlist.length === 0) {
    return (
      <p className="px-6 py-20 text-center text-white/60">
        Your watchlist is empty. Use “+ Watchlist” on any show to save it here.
      </p>
    );
  }
  if (!loaded || loaded.key !== key) {
    return <p className="px-6 py-20 text-center text-white/60">Loading your watchlist…</p>;
  }
  const order = new Map(watchlist.map((id, i) => [id, i]));
  const shows = [...loaded.shows]
    .filter((s) => order.has(s.id))
    .sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  return <Rail title="My Watchlist" shows={shows} />;
}
