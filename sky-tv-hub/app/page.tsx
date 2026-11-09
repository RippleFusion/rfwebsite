import { Hero } from "@/components/Hero";
import { NavBar } from "@/components/NavBar";
import { Rail } from "@/components/Rail";
import { WatchlistView } from "@/components/WatchlistView";
import {
  FILTERS,
  FREE_TO_AIR,
  SKY_NOW,
  STREAMING,
  type FilterKey,
} from "@/lib/providers";
import { MissingTokenError, discover } from "@/lib/tmdb";

function parseFilter(v: string | string[] | undefined): FilterKey {
  const s = Array.isArray(v) ? v[0] : v;
  return FILTERS.some((f) => f.key === s) ? (s as FilterKey) : "all";
}

function SetupMessage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="mb-3 text-2xl font-bold">One more step</h1>
      <p className="text-white/70">
        Add your TMDB token to <code className="rounded bg-white/10 px-1">.env.local</code>:
      </p>
      <pre className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm">
        TMDB_READ_ACCESS_TOKEN=your_token_here
      </pre>
      <p className="mt-4 text-sm text-white/50">
        Get a free token at themoviedb.org/settings/api, then restart the dev server.
      </p>
    </div>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const filter = parseFilter((await searchParams).filter);

  if (filter === "watchlist") {
    return (
      <>
        <NavBar active={filter} />
        <WatchlistView />
      </>
    );
  }

  const want = {
    sky: filter === "all" || filter === "sky",
    free: filter === "all" || filter === "free",
    streaming: filter === "all" || filter === "streaming",
    popular: filter === "all",
  };

  let data: Awaited<ReturnType<typeof loadRails>>;
  try {
    data = await loadRails(want);
  } catch (e) {
    return (
      <>
        <NavBar active={filter} />
        {e instanceof MissingTokenError ? (
          <SetupMessage />
        ) : (
          <p className="px-6 py-24 text-center text-white/60">
            Couldn&apos;t reach TMDB. Please try again in a moment.
          </p>
        )}
      </>
    );
  }

  const { sky, popular, free, streaming } = data;
  const hero = [...sky, ...popular, ...free, ...streaming].find((s) => s.backdrop_path) ?? null;

  return (
    <>
      <NavBar active={filter} />
      {hero && <Hero show={hero} />}
      <div className="pb-6">
        {want.sky && <Rail title="New & Upcoming on Sky & NOW" shows={sky} />}
        {want.popular && <Rail title="Popular in the UK This Week" shows={popular} />}
        {want.free && <Rail title="Fresh on BBC iPlayer, ITVX & Channel 4" shows={free} />}
        {want.streaming && (
          <Rail title="New on Netflix, Prime, Disney+ & Apple TV+" shows={streaming} />
        )}
      </div>
    </>
  );
}

async function loadRails(want: { sky: boolean; free: boolean; streaming: boolean; popular: boolean }) {
  const [sky, popular, free, streaming] = await Promise.all([
    want.sky ? discover({ providers: SKY_NOW, kind: "both" }) : [],
    want.popular
      ? discover({ providers: [...SKY_NOW, ...FREE_TO_AIR, ...STREAMING], kind: "popular" })
      : [],
    want.free
      ? discover({ providers: FREE_TO_AIR, kind: "both", monetization: "flatrate|free|ads" })
      : [],
    want.streaming ? discover({ providers: STREAMING, kind: "both" }) : [],
  ]);
  return { sky, popular, free, streaming };
}
