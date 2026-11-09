// UK (GB) TMDB watch provider IDs. Verify against
// /watch/providers/tv?watch_region=GB if a badge ever looks wrong.
export const PROVIDERS = {
  skyGo: 29,
  now: 39,
  bbcIPlayer: 38,
  itvx: 41,
  channel4: 103,
  netflix: 8,
  prime: 9,
  disney: 337,
  appleTv: 350,
} as const;

export const SKY_NOW = [PROVIDERS.skyGo, PROVIDERS.now];
export const FREE_TO_AIR = [PROVIDERS.bbcIPlayer, PROVIDERS.itvx, PROVIDERS.channel4];
export const STREAMING = [PROVIDERS.netflix, PROVIDERS.prime, PROVIDERS.disney, PROVIDERS.appleTv];

export type FilterKey = "all" | "sky" | "free" | "streaming" | "watchlist";

export const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "sky", label: "Sky & NOW" },
  { key: "free", label: "Free-to-Air" },
  { key: "streaming", label: "Streaming" },
  { key: "watchlist", label: "My Watchlist" },
];
