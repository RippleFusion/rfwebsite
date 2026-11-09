// Tiny localStorage-backed store (IDs only) for useSyncExternalStore.
const KEY = "sky-tv-hub:watchlist";
const EMPTY: number[] = [];
let cache: number[] | null = null;
const listeners = new Set<() => void>();

function read(): number[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "number") : [];
  } catch {
    return [];
  }
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export const getSnapshot = () => (cache ??= read());
export const getServerSnapshot = () => EMPTY;

export function toggleWatchlist(id: number) {
  const current = getSnapshot();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current];
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage blocked: still works for this tab */
  }
  listeners.forEach((l) => l());
}
