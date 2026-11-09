import type { ProviderBadge, ShowDetails, ShowSummary } from "./types";

const BASE = process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p";

export class MissingTokenError extends Error {
  constructor() {
    super("TMDB_READ_ACCESS_TOKEN is not set");
  }
}

type Params = Record<string, string | number | undefined>;

// Server-only. The token never reaches the browser.
async function tmdb<T>(path: string, params: Params = {}): Promise<T> {
  const token = process.env.TMDB_READ_ACCESS_TOKEN;
  const key = process.env.TMDB_API_KEY;
  if (!token && !key) throw new MissingTokenError();

  const url = new URL(BASE + path);
  url.searchParams.set("language", "en-GB");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  if (!token && key) url.searchParams.set("api_key", key);

  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

type RawShow = Omit<ShowSummary, "provider">;

function toSummary(s: RawShow): ShowSummary {
  return {
    id: s.id,
    name: s.name,
    overview: s.overview ?? "",
    backdrop_path: s.backdrop_path ?? null,
    poster_path: s.poster_path ?? null,
    first_air_date: s.first_air_date || null,
    vote_average: s.vote_average ?? 0,
  };
}

function isoDate(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

const WINDOW_DAYS = 60;

export type RailKind = "new" | "upcoming" | "both" | "popular";

export async function discover(opts: {
  providers: number[];
  kind: RailKind;
  monetization?: "flatrate" | "free" | "flatrate|free|ads";
  limit?: number;
}): Promise<ShowSummary[]> {
  const params: Params = {
    watch_region: "GB",
    with_watch_providers: opts.providers.join("|"),
    with_watch_monetization_types: opts.monetization ?? "flatrate",
    include_adult: "false",
  };
  if (opts.kind === "popular") {
    params.sort_by = "popularity.desc";
  } else if (opts.kind === "upcoming") {
    params.sort_by = "first_air_date.asc";
    params["first_air_date.gte"] = isoDate(0);
    params["first_air_date.lte"] = isoDate(WINDOW_DAYS);
  } else if (opts.kind === "new") {
    params.sort_by = "first_air_date.desc";
    params["first_air_date.gte"] = isoDate(-WINDOW_DAYS);
    params["first_air_date.lte"] = isoDate(0);
  } else {
    params.sort_by = "first_air_date.desc";
    params["first_air_date.gte"] = isoDate(-WINDOW_DAYS);
    params["first_air_date.lte"] = isoDate(WINDOW_DAYS);
  }
  const data = await tmdb<{ results: RawShow[] }>("/discover/tv", params);
  const shows = data.results.map(toSummary).slice(0, opts.limit ?? 14);
  return withProviderBadges(shows, opts.providers);
}

type RawProviders = {
  results: Record<
    string,
    {
      flatrate?: RawProvider[];
      free?: RawProvider[];
      ads?: RawProvider[];
    }
  >;
};
type RawProvider = { provider_id: number; provider_name: string; logo_path: string | null };

function ukProviders(raw: RawProviders): ProviderBadge[] {
  const gb = raw.results?.GB;
  if (!gb) return [];
  const seen = new Set<number>();
  const out: ProviderBadge[] = [];
  for (const p of [...(gb.flatrate ?? []), ...(gb.free ?? []), ...(gb.ads ?? [])]) {
    if (seen.has(p.provider_id)) continue;
    seen.add(p.provider_id);
    out.push({ id: p.provider_id, name: p.provider_name, logo_path: p.logo_path });
  }
  return out;
}

// Discover does not say *which* provider a show is on, so look it up per card.
async function withProviderBadges(shows: ShowSummary[], preferred: number[]) {
  return Promise.all(
    shows.map(async (show) => {
      try {
        const raw = await tmdb<RawProviders>(`/tv/${show.id}/watch/providers`);
        const all = ukProviders(raw);
        const provider = all.find((p) => preferred.includes(p.id)) ?? all[0] ?? null;
        return { ...show, provider };
      } catch {
        return { ...show, provider: null };
      }
    }),
  );
}

export async function searchShows(query: string): Promise<ShowSummary[]> {
  const data = await tmdb<{ results: RawShow[] }>("/search/tv", {
    query,
    include_adult: "false",
  });
  return data.results.map(toSummary).slice(0, 12);
}

export async function getShowsByIds(ids: number[]): Promise<ShowSummary[]> {
  const shows = await Promise.all(
    ids.slice(0, 60).map(async (id) => {
      try {
        const s = await tmdb<RawShow>(`/tv/${id}`);
        return toSummary(s);
      } catch {
        return null;
      }
    }),
  );
  return shows.filter((s): s is ShowSummary => s !== null);
}

export async function getShowDetails(id: number): Promise<ShowDetails> {
  type Raw = RawShow & {
    number_of_seasons: number;
    genres: { name: string }[];
    next_episode_to_air: { air_date: string } | null;
    videos: { results: { site: string; type: string; key: string; official?: boolean }[] };
    "watch/providers": RawProviders;
  };
  const s = await tmdb<Raw>(`/tv/${id}`, {
    append_to_response: "videos,watch/providers",
  });
  const vids = s.videos?.results?.filter((v) => v.site === "YouTube") ?? [];
  const trailer =
    vids.find((v) => v.type === "Trailer" && v.official) ??
    vids.find((v) => v.type === "Trailer") ??
    vids.find((v) => v.type === "Teaser") ??
    null;
  return {
    ...toSummary(s),
    next_air_date: s.next_episode_to_air?.air_date ?? null,
    seasons: s.number_of_seasons ?? 0,
    genres: (s.genres ?? []).map((g) => g.name),
    trailerKey: trailer?.key ?? null,
    providers: ukProviders(s["watch/providers"] ?? { results: {} }),
  };
}
