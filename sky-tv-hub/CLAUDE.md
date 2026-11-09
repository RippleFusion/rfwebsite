# Project Overview
Personal UK TV discovery web app inspired by the Sky Stream / Sky Glass UI. It aggregates new and upcoming TV shows **available in the UK** across Sky, NOW, UK catch-up services and major streamers. Personal, non-commercial use.

# Tech Stack
- Next.js (App Router, current stable) + TypeScript
- Tailwind CSS (v4) 
- `lucide-react` icons
- Watchlist: browser `localStorage` (store TMDB show IDs only). No database.
- Hosting target: Vercel (needs a Node runtime; not GitHub Pages)

# Visual & UI Guidelines (Sky Stream aesthetic)
- Background `#070B14` to `#0F172A`; glass surfaces `bg-white/5 backdrop-blur-md border border-white/10`.
- **Hero**: full-width, 16:9 backdrop with gradient fade, provider badge, synopsis, "View Details" and "+ Watchlist" buttons.
- **Rails**: horizontal scroll, scroll buttons, `hover:scale-105 transition-transform`.
- **Card**: 16:9 TMDB `backdrop_path`, provider logo badge top-right, title + premiere date overlaid bottom. Styled fallback card when no backdrop.

# Data Sources & API Rules
- **TMDB v3**: base `https://api.themoviedb.org/3`. Images `https://image.tmdb.org/t/p/w780` (backdrops), `/w92` (provider logos).
- Auth: `TMDB_READ_ACCESS_TOKEN` in `.env.local` (Bearer header). Fetch only server-side (Server Components / Route Handlers). Never expose the token to the client. Commit a `.env.example`.
- Scope: shows **available in the UK**. Always pass `watch_region=GB`, `language=en-GB`, and `with_watch_monetization_types=flatrate` (use `free` for the catch-up rail). `region` is NOT a valid TV discover param; do not rely on it.
- Cache: `next: { revalidate: 3600 }` on all TMDB fetches.
- **Provider IDs (GB)**: Sky Go 29, NOW 39, BBC iPlayer 38, ITVX 41, Channel 4 103, Netflix 8, Prime Video 9, Disney+ 337, Apple TV+ 350. On first build, verify against `/watch/providers/tv?watch_region=GB` and fix any mismatch in one `providers.ts` constants file.
- No TVmaze in v1.
- **Attribution (required by TMDB terms)**: footer with the TMDB logo and "This product uses the TMDB API but is not endorsed or certified by TMDB", plus "Watch provider data by JustWatch".

# Rails (discover queries)
"New" = first aired in the last 60 days; "Upcoming" = first air date in the next 60 days. Sort new by `first_air_date.desc`, upcoming by `first_air_date.asc`.
1. New & Upcoming on Sky & NOW: `with_watch_providers=29|39`
2. Popular in the UK This Week: `discover/tv` sorted `popularity.desc` with `watch_region=GB` (the `/trending` endpoint is global, so don't label it UK)
3. Fresh on BBC iPlayer, ITVX & Channel 4: `with_watch_providers=38|41|103`
4. New on Netflix, Prime, Disney+ & Apple TV+: `with_watch_providers=8|9|337|350`
Hero = top result of rail 1, falling back to rail 2.

# Core Features
1. **Top nav**: pills `All`, `Sky & NOW`, `Free-to-Air` (catch-up: BBC/ITV/C4), `Streaming`, `My Watchlist`, plus search. Pill state lives in URL search params (`?filter=sky`) so pages render on the server.
2. **Search**: debounced client input calling `/api/search`, which proxies TMDB `search/tv`.
3. **Details modal**: opened by card click; data from `/api/tv/[id]` (details + videos + watch providers, one server call). Shows synopsis, premiere / next air date, seasons, TMDB rating, YouTube trailer (`youtube-nocookie.com` embed), and UK provider badges. Escape closes; focus is trapped and restored.
4. **Watchlist**: add/remove with instant UI feedback. The My Watchlist view fetches details for saved IDs via a Route Handler.

# Architecture
- Server Components: page, hero, rails. Client Components: modal, watchlist button/provider, search, scroll buttons.
- All TMDB calls go through one typed `lib/tmdb.ts` with response types and error handling.
- Loading skeletons for rails; a clear setup message if the token is missing; empty-state messages for empty rails.

# Coding Standards
- Strict TypeScript, no `any`. ESLint + Prettier.
- Responsive, with a layout that also works on TV browsers (large focus rings, 10-foot spacing at wide breakpoints).
- Keyboard: Tab order, visible focus, Escape closes modal. Arrow-key rail navigation is a v1.1 item (see below).

# Out of scope for v1
Arrow-key / remote spatial navigation, TVmaze "Tonight" rail, Telegram/Discord notifications, accounts, any database.
