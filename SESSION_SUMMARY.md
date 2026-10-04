# Ripple Fusion static site — session summary

Project: `~/Documents/ripplefusion-pages` — single-page static HTML site (no build step, no framework). Everything lives in `index.html` (~3000+ lines: inline `<style>` + two classic `<script>` blocks + one `type="module"` Three.js block).

## Testing setup
- Local server: `cd ~/Documents/ripplefusion-pages && python3 -m http.server 8420` (often already running in the background — check with `curl -s -o /dev/null -w "%{http_code}" http://localhost:8420/` before starting a new one).
- View at `http://localhost:8420/index.html`, or `http://localhost:8420/index.html#section-id` to jump straight to a section (e.g. `#trusted-by`, `#contact`).
- On phone/LAN: the Mac's LAN IP drifts (DHCP) — `http://Maisys-MacBook-Air.local:8420/` is the stable alternative.
- The intro/constellation cutscene plays on every load (~15-20s) before the page is usable, so always wait ~20s after opening before screenshotting.
- **After every edit**: run a brace-balance check on the `<style>` block and `node --check` on each `<script>` block (extract via Python regex) before considering an edit done — a missing closing brace/tag has silently broken the whole page before.
- Live visual verification: Safari is granted at "read" tier only (screenshots yes, clicks/typing no) — navigate via `open "http://localhost:8420/index.html#anchor"` from the shell, not by clicking. Screenshots via computer-use occasionally fail with "Screenshot capture returned nil" — this is an intermittent OS-level permission hiccup, retry a few times.

## Page structure (top to bottom)
```
#houseHero        — hero: video/photo of house, headline, 4-across hero-stats
#the-problem       — "The Problem" (Problem-section, eyebrow+heading, 2 lede paragraphs, puzzle image)
#about             — Founder ("Meet The Founder" eyebrow, "Hello", bio) — class="founder wrap"
#trusted-by        — "Trusted By" client grid (13 boxes, flex-wrap centered)
#meet-nina         — "Meet Nina" profile section — class="meet-nina wrap"
#capabilities      — "Capability Pillars" — 6-card grid
#how-i-work        — "How I Work" — 3-card grid, no icons/numbers (ghost-numeral style card, numbers removed)
#how-i-engage      — "How I Engage" — 6-card grid (2 rows of 3 on desktop), each with a circular icon: Advisory, Embedded Strategist, Interim Programme Lead, Interim Chief Data Officer, Interim Chief AI Officer, Non-Executive Director (NED)
#proof-points      — "What Success Looks Like" — checklist, no h2 heading (eyebrow only)
#contact           — "Get In Touch" — contact details/socials + form
```
Nav: Home→`#top`, About→`#the-problem`, Services→`#capabilities`, Contact→`#contact` (About/Services are single anchors into this one page, not separate routes — `about.html`/`services.html` are now just redirect stubs to these anchors).

## Design conventions established this session
- **Horizontal inset**: every content section's `.wrap` now shares the same padding scale — `1.5rem` (mobile) → `3rem` (640px) → `5rem` (1024px) — enforced via a shared selector list in the CSS (search `Same horizontal inset as .founder / .meet-nina`). Founder/Meet Nina apply it via their own class combined with `wrap` on the section element; all other sections nest `.wrap` as a child div, so it's scoped `.section-class > .wrap`. **If a new section is added, add its `> .wrap` selector to that same shared rule** or its content will sit closer to the edge than everything else.
- **Text/image split sections** (Problem, Founder, Meet Nina): grid uses `align-items: start` (not `center`) so the heading lines up with the top of the photo/image — this was a real bug (center-alignment made headings start lower than the image top) fixed this session; keep new split-sections consistent with this.
- **No numbers on section titles**: all `<span class="section-num">` badges (01/02/03/04 prefixes on eyebrows) and all `<div class="num">` ghost-numeral badges on cards (How I Work / How I Engage) were removed per explicit request — don't reintroduce numbered titles. This includes the 3 cards added to How I Engage this session (Interim Chief Data Officer / Interim Chief AI Officer / NED) — no "04/05/06" badges, matching the un-numbered style of the existing 3.
- **Every section eyebrow+heading block is left-aligned** (matching The Problem/Trusted By) — the `text-align:center` inline style previously on Capabilities, How I Work, How I Engage and Proof Points' heading wrappers was removed this session so every heading and its cyan `.heading-underline` bar line up at the same left position all the way down the page. Don't reintroduce centered section headings.
- **Jump-to-section landing precision**: the on-load hash landing in `hidePreloader()` (fires when the intro cutscene ends) now does a `getBoundingClientRect`-based scroll instead of a plain `scrollIntoView`, plus a >4px-drift instant correction ~500ms later to catch any late layout shift from the hero spacer/fonts/images — this fixed a real bug where landing on a section anchor (e.g. `#the-problem`) could drift and show a neighbouring section's content underneath the nav instead of landing cleanly on the target. Verified live via Safari screenshot.
- **No blue/cyan dots anywhere** — removed site-wide earlier in the project (hero cursor-reactive circuit-pulse, nina-dots, section-divider ripple-dots, proof-dot replaced with checkmarks, back-to-top-dot, section-tag-dot). Don't add decorative dot elements back.
- **`.reveal` / `.reveal-group`**: every section's intro text block should be wrapped in `.reveal` (and lists of items in `.reveal-group` with `.reveal` children) for the scroll fade-in + consistent stagger — this was missing on Founder and Meet Nina and has been added; keep it on any new content block.
- **Cannot source or fabricate real company logos** (trademark/copyright constraint) — Trusted By client boxes are text+tag only. If the user wants actual logo images, they must supply the image files directly (same as they've sent other images/screenshots via Mail).
- Nina's photo (`images/nina.jpg`) is grayscale by explicit request — don't recolor it.
- The floating "Speak with Nina" pill (`.float-cta`, fixed bottom-left) can visually overlap section text near the bottom of a short viewport (e.g. was seen overlapping the last line of Founder's bio). Flagged to the user as a known cosmetic overlap, not yet fixed — no action taken since it wasn't explicitly requested.

## Known dead CSS (harmless, intentionally left in place)
`.faq-section`/`.faq-item` rules, `.gap-diagram`/`.gap-card` rules, `footer{}` rule — all correspond to markup that was removed earlier in the project (FAQ section, Strategy-Deck/Technical-Hire diagram, a `<footer>` tag that was never actually used). Established pattern this session: leave dead CSS alone rather than chase it, unless asked.

## Status as of last message
All of the following were completed and (mostly) live-verified via Safari screenshot this session:
- Added Trusted By boxes: CGI Inc., Pirelli, Cerco, CodeSearch, Pest Control Partnership (13 total now; grid uses flex-wrap + centered last row so an odd count doesn't look stranded).
- Founder section: top-aligned grid, wrapped in `.reveal`, verified live.
- Contact section: removed "04" number, removed border-line+gap above copyright footer, removed "Let Nina get to work..." line, added matching side inset. Verified live.
- Removed all remaining numbered titles (eyebrow "02"/"03" prefixes, and the big ghost-numeral "01/02/03" on How I Work + How I Engage cards). Verified live.
- Full site-wide spacing/alignment audit: unified `.wrap` side-padding across all sections, fixed Meet Nina's alignment/color/reveal to match Founder, fixed Problem section's same center-align issue, fixed Proof Points' cramped heading-to-list gap.
  - **Verified live**: Founder, Trusted By, How I Work, How I Engage, Contact.
  - **NOT yet visually re-verified** (screenshots stopped working partway through due to an OS permission hiccup, though code is syntax-checked and should be correct): Meet Nina, the Problem section, Capabilities, Proof Points. Worth a live check next session.

## Pending / open items
- User may still want the `.float-cta` bottom-left overlap addressed (flagged, not actioned).
- Real Trusted By logo images are still blocked on the user supplying image files.

## Status as of 2026-09-02 session
- Fixed jump-to-section landing precision (see design conventions above) — verified live on `#the-problem`.
- Left-aligned every section heading + underline for consistency (Capabilities, How I Work, How I Engage, Proof Points) — verified live on `#how-i-engage`.
- Added 3 new How I Engage cards (Interim Chief Data Officer, Interim Chief AI Officer, Non-Executive Director (NED)) with wording matching the existing 3 cards' style; grid CSS already handled 6 items via its existing `repeat(3,1fr)` breakpoint (same pattern as the 6-card Capability Pillars grid), no CSS changes needed.
- Ran a sitewide misspelling grep (clean) and syntax-checked the edited `<script>`/`<style>` blocks (balanced, no errors).
- **Not yet visually verified**: the 3 new How I Engage cards themselves (Safari is read-only for this session — no scroll capability was available to see below the fold on `#how-i-engage`). Structurally sound and using a proven grid pattern, but worth an eyeball check next session.

## Status as of 2026-09-13 session

Long session, mostly on Trusted By, a new Private Equity section, and a full rebuild of Meet Nina. All verified live via headless-Chromium screenshots (Playwright — `pip install playwright` if missing, no browser download needed since Chromium was already present) since Safari/computer-use wasn't reliably available this session. **No ffmpeg on this machine** — any video work went through Python (`opencv-python-headless` + `numpy`, installed via pip this session).

### New section: Private Equity (`#private-equity`)
Sits between Trusted By and Meet Nina. Rebuilt from a custom `engage-card` layout (icon + heading + description) to reuse Trusted By's exact `.clients-grid`/`.client-item`/`.client-logo` markup — the two sections are now format-identical by design (same fixed-size white logo tiles, same cyan `.client-tag` labels, no description text). Fixed logo-tile size: `#private-equity .client-logo { width:9.5rem; height:2.75rem; }`. Firms: Partners Group, Providence, EQT, TPG Capital, CPP Investment Board, Leonard Green & Partners (added this session — CPP and Leonard Green's source logos were small marks centered on large square/white canvases and had to be cropped tight, see `images/logos/*-cropped.*`). Heading: "Investors of **private equity** companies:" — the `.kw-underline` cyan accent covers only "private equity", not "companies". Eyebrow ("Also Advising") and lede paragraph were removed per request; top padding trimmed aggressively (`#private-equity { padding-top:0; margin-top:-3rem; }`).

### Trusted By line (background squiggle)
Went through many iterations — worth reading this before touching it again, the user's taste on this was very specific and arrived at after a lot of back-and-forth:
- **Landed state**: a single thin (`stroke-width:1`) path in pure `var(--cyan)`, dim base (`opacity:0.15`) with a small irregular flicker keyframe (`trusted-flicker`, non-evenly-spaced % stops so it doesn't read as a clean loop), plus a brighter travelling highlight segment, plus a scroll-velocity-reactive `.charging` class (JS listens to `scroll`, computes velocity, briefly speeds up/brightens the line, added via `#trusted-by`).
- Curve is intentionally **flat/gentle** ("like a snake, not a rollercoaster") — low amplitude, not the tall sine-wave version from earlier attempts.
- **Explicitly rejected and removed**: a "constellation" overlay (extra stars + connector lines echoing the site's own intro cutscene — looked like "weird triangles" to the user), electric arc/spark branches, a comet dot with SMIL `animateMotion`, cursor-reactive spotlight, and a full "boot-up cutscene" (blur/scale/bloom-flash on scroll-in). All of that code was added then fully removed again — if resurrecting any of it, expect the user to want it much more restrained than the first pass.
- Same `.pe-trendline`-style squiggle is *not* shared with the PE section's line — Trusted By has its own `.trusted-line`/`.trusted-line-flow` classes now, separate from `#private-equity`'s original `.pe-trendline`.

### Meet Nina — full rebuild
- Restructured to mirror the Founder section's layout exactly: eyebrow → big "Hello" → a name/intro line → bio paragraphs (previously had its own bespoke `h2`/`.kicker`/`.intro` structure, all removed).
- **The intro line is a live typewriter**, not static text: `<span id="ninaTypedName">` holds "Hello, I'm Nina — how can I help today?" as a no-JS fallback, and JS clears + retypes it character-by-character (55ms/char, starts ~900ms after scroll-into-view to let the video's focus-pull read first) the first time `#meet-nina` scrolls into view (`IntersectionObserver`, threshold 0.3, fires once). Gated behind `prefersReducedMotion`.
- Bio copy (current, verbatim): "Most transformation execs talk about AI. I built an AI-first business around one. Nina runs lead gen, socials, ops and finance, end to end, every day, no shortcuts." / "She's not the pitch. She's the proof. 20+ years leading transformation, tested on my own AI-first business first." / "Say &ldquo;hello&rdquo;, she might just say it back" followed inline by a 3-dot bounce button (`#ninaAsk`, no label/border chrome, just the dots) — click it and a random one-line reply fades in below (`#ninaAskResponse`), auto-hides after 3.2s.
- **Removed and should stay removed unless asked again**: the old rotating-question preview box ("Ask Nina things like..."), the old "Speak with Nina" CTA button *inside this section* (the unrelated sitewide floating `.float-cta` pill is untouched), an "Active now" status pill (added then explicitly un-requested), and the old `#thinkTicker` "How we think" rotating one-liner divider that used to sit right under this section (fully removed — JS, CSS, and the `<div class="section-divider">` wrapper all deleted).
- **Photo → video**: `.meet-nina-photo` now holds a `<video id="ninaOrb" autoplay muted loop playsinline poster="images/nina.jpg">` instead of an `<img>`. Source is the user's own upload — an abstract pulsing glowing cyan/teal orb animation (not a photo of a person), original at `~/Downloads/hf_20260913_150718_c348a9a6-e9e7-4d33-acae-3ddc81574459.mp4` (1920×1080, 241 frames @24fps, 10s, contains a brighter "starburst" transition partway through). Current `videos/nina.mp4` is the **full original clip**, reprocessed only to black-crush/color-match the background to the site's exact `--bg: #080808` (not pure `#000000` — that was the actual cause of an earlier visible "box" seam). The busy starburst section was trimmed out at one point per user request, then put back in per a later request ("its missing the end of the video when it changes") — full clip is correct as of now.
- A **fully self-generated synthetic replacement** (procedural radial-gradient orb, numpy/opencv, no external AI video tool, ~6s render once vectorized instead of using slow per-frame Gaussian blur) was built and briefly live, but the user asked to revert to their real uploaded footage — the synthetic-orb generation technique works and is fast if ever wanted again, just isn't in use now.
- Container sizing: `.meet-nina-photo { aspect-ratio: 498/565; }` (matches the old photo's footprint) with `object-fit:cover; object-position:center` on the video, so it's centered/cropped consistently regardless of the source's own aspect ratio.
- CSS zoom/focus-pull (`blur(10px)→0`, `scale(1.08)→1`, `opacity 0.5→1`, 1.3s ease-out) lives on `#meet-nina.in-view .meet-nina-photo img, ...video` — this is what actually produces the "zooms into focus" cutscene effect for the current real-footage video (it has no zoom baked into the footage itself; that was only true of the now-unused synthetic version, which briefly had this CSS removed in favor of baked-in motion — restored when reverting to real footage).
- **Gotcha for future full-bleed media on this page**: the site has a page-wide fixed decorative grid (`.dot-grid`, very faint cyan lines every 80px, `z-index:0`) that was bleeding through behind the video due to a stacking context issue. Fixed via `.meet-nina-photo { z-index:1; background: var(--bg); }`. If any other new image/video block ever looks like it has faint grid squares on it, this is almost certainly why — check z-index/background on its container first.

### Other smaller changes this session
- `.client-tag` text colour changed sitewide from grey (`--ink-40`) to cyan (`--cyan`) — affects both Trusted By and PE section tags now.
- `.kw-underline` + `.heading-underline.no-start-bar` pattern established: moves the cyan underline accent off the start of a heading onto a specific keyword instead. In use on: Problem section ("potential"), Trusted By ("organisations"), PE section ("private equity").
- Trusted By logo fixes: CodeSearch now uses the proper `.client-logo` white-tile wrapper (was raw unstyled img+text before); IQVIA logo swapped to a new higher-res file (`iqvia.jpg`); Marlink/Pirelli/Pest Control Partnership/Vistra all given `.client-logo-narrow` (or had `.client-logo-solid` removed, in Pirelli's case) to fix oversized/no-background logos.
- Founder bio: third paragraph rewritten to drop the inline "Vodafone, GSK, Roche..." company list, since the Trusted By logo grid immediately follows and was repeating the same names.
- Founder photo: several sizing/positioning experiments (wider column, stretch-to-text-height, nudging) were all explicitly reverted back to the original untouched state — don't re-apply any of that without being asked again.
- `images/puzzle-cropped.jpg` — cropped tighter than the original `puzzle.jpg` to remove excess black margin baked into the source photo (was a source-image composition issue, not a CSS bug).

### Pending / open items
- Nina's video starburst transition is genuinely bright/busy content — flagged to the user that no further color correction will make it disappear into black the way the calm orb portions do; they've accepted keeping the full clip as-is.
- No other known open items from this session — everything above was verified live.
