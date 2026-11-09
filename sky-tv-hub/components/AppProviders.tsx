"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from "react";
import type { ShowSummary } from "@/lib/types";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  toggleWatchlist,
} from "@/lib/watchlist-store";
import { ShowModal } from "./ShowModal";

type Ctx = {
  openShow: (s: ShowSummary) => void;
  watchlist: number[];
  toggle: (id: number) => void;
};
const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProviders");
  return ctx;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const watchlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [selected, setSelected] = useState<ShowSummary | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <AppCtx.Provider value={{ openShow: setSelected, watchlist, toggle: toggleWatchlist }}>
      {children}
      {selected && <ShowModal key={selected.id} show={selected} onClose={close} />}
    </AppCtx.Provider>
  );
}
