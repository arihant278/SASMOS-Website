# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> The import above is load-bearing: this is **Next.js 16 (App Router, Turbopack)** with breaking changes from older versions. Read `node_modules/next/dist/docs/` before writing framework code.

## Commands

```bash
npm run dev        # dev server (Turbopack) → http://localhost:3000
npm run build      # production build; also runs full TypeScript check
npm run lint       # eslint (eslint-config-next)
npx tsc --noEmit   # fast typecheck without building
```

There is **no test suite**. Verification is done by running the app and observing it — Playwright (+ Chromium) is installed as a dev dependency for driving the page and capturing screenshots at scroll positions. Drive scroll programmatically via `window.__lenis.scrollTo(y, { immediate: true })` (the Lenis instance is exposed for exactly this); plain `window.scrollTo` is fought by smooth scroll.

Path alias: `@/*` → repository root (e.g. `@/lib/content`).

## The big picture

A single long-scroll cinematic homepage for SASMOS (aerospace/defence interconnection systems). The narrative is a journey **Space → Sky → Land → Sea → History → People → Return to space**, assembled in `app/page.tsx`.

### Two visual systems (only one is mounted)

1. **Image-sequence scrollytelling — ACTIVE.** Pre-rendered PNG sequences (240–300 frames each) scrubbed on scroll (Apple-style), drawn to a 2D canvas. This is the current visual language.
2. **Procedural WebGL — DORMANT.** A React-Three-Fiber scene (`components/canvas/**`) with procedural Earth/jet/tank/submarine models and cross-faded scenes. Fully built and typechecks, but **intentionally not mounted** (`components/canvas/Background` is no longer imported by `app/layout.tsx`). Kept in the repo as reference / possible fallback. Don't wire it back in without asking.

### Frame-sequence engine (the part to extend)

The four chapters (Space/Sky/Land/Sea) are **one continuous film**, not four sections. This is deliberate: separate sticky sections each with their own canvas produce a visible split-line "seam" at every boundary (the outgoing sticky canvas scrolls up while the incoming one slides in). Merging them into a single canvas over a single section is the only seam-free, overlap-free structure.

- `components/sections/CinematicJourney.tsx` is the **single engine**. It flattens every chapter into one global frame timeline (Space 240 + Sky 240 + Land 300 + Sea 240 = 1020 frames), renders **one sticky `<canvas>` in one `#journey` section** (height = `totalFrames × vhPerFrame`, default 3.5vh/frame), and scrubs the global frame from `framer-motion`'s `useScroll`. Handles: batched preloading, cover-fit device-pixel drawing (identity transform — no DPR compounding), nearest-loaded-frame fallback so a fast scroll never goes blank, the per-chapter palette/meter (see Scroll & state plumbing), and a `prefers-reduced-motion` stacked-static fallback. Consecutive chapters share their boundary frame (e.g. Jet 240 ≈ Land 1), so the join is invisible.
- **Presentation is a consistent cinematic lower-third** (not alternating boxes — that was tried and looked poor). A persistent full-width bottom **scrim** keeps captions legible while leaving the hero subject (centre/upper frame) clear. Each panel renders a bottom-left caption (eyebrow + heading + body, with a `--glow` accent bar); `proof` cards sit bottom-right; a panel may carry an optional `logos` strip (partner marks, normalised to white via CSS `brightness(0) invert(1)` — see `public/logos/`). All driven by `framer-motion` opacity/`y` over each panel's global range.
- **Chapter copy/config lives in `lib/journey-content.ts`** (`JOURNEY_CHAPTERS`): per chapter `sequenceDir`, `totalFrames`, `panels`, `proof`, `reducedFrame`; per panel `eyebrow`/`heading`/`body`, a local `range` (0–1 within the chapter), and optional `logos`. Edit content there; the engine is generic. `app/page.tsx` just renders `<CinematicJourney chapters={JOURNEY_CHAPTERS} />`.
- **Time panel `range`s to each sequence's "main frame."** Every sequence *opens on the previous chapter's subject* (the shared boundary frame that makes transitions seamless), so the new hero subject arrives later in the sequence — e.g. the Jet sequence shows Earth/cloud for its first ~half and the aircraft only appears ~0.6→1.0. Copy (and logos) must land while its subject is on screen, not over the transition. The arc per chapter is documented at the top of `lib/journey-content.ts`; re-check it (a quick `sharp` contact sheet of the frames) before retiming.
- **Nav anchors** (`#space/#sky/#land/#sea`) are invisible divs the engine places at each chapter's exact scroll offset inside `#journey`, so `Nav`'s native hash jumps still land frame-exact.
- **Frames live in `public/<Name> Sequence/` as 1-indexed `00001.png …`.** Folder names contain a space; URLs like `/Satellite Sequence/00001.png` are browser-encoded — this works, don't "fix" it. To add/replace a chapter: drop the folder in `public/` and add/edit an entry in `JOURNEY_CHAPTERS`.
- **Frame asset spec — keep sequences a uniform `1280×720` and reasonably light (~300–950 KB/frame).** Mixed resolutions (e.g. a few 4K frames) or very heavy PNGs make the preloader fall behind a fast scroll → stutter. `sharp` (ships with Next) is the tool: `.resize(1280,720)` + `.png({compressionLevel:9})` to normalize. The canvas cover-fits and caps at ~2× DPR, so 720p is the target.

### Scroll & state plumbing

- `components/providers/SmoothScroll.tsx` runs **Lenis** smooth scroll, synced into the GSAP ticker. On every scroll it sets `scrollState.progress` (page fraction) and, **only while the film is not on screen**, the CSS vars `--bg`/`--glow` from `lib/palette.ts`'s `RAMP` (this covers the hero + the post-journey tail). It honors `prefers-reduced-motion` (native scroll, no Lenis) and exposes `window.__lenis`.
- **The film owns its own palette + depth meter.** Because `#journey` is ~80% of the page, fixed page-fraction anchors can't track it — so `CinematicJourney` drives `--bg`/`--glow`/`--glow-soft` and the active sphere **from its own `scrollYProgress`** (chapter-exact), using `CHAPTER_PALETTE` in `lib/palette.ts`. Each chapter holds its colour and cross-fades only in its last 15%. It calls `setJourney(active, progress)` to claim palette control (so SmoothScroll yields) and `setSphere(id)` for the meter. Edit chapter accents in `CHAPTER_PALETTE`, not `RAMP`.
- `lib/scroll.ts` is the module-singleton store: `progress` (page fraction, read per-frame by the dormant WebGL layer), `journeyProgress` + `journeyActive` + `sphere` (owned by the film). It only notifies React subscribers when the **discrete sphere** changes. `SphereProgress` reads `journeyProgress` (fill) + `sphere` (active label) via rAF.

### Content & type system

- **`lib/content.ts` is the single editable source for all copy** (intro, per-sphere narrative + proof points, milestones, people, entities, stats, certifications). Facts are drawn from the real sasmos.com (founded 2007, 61% CAGR, AS9100, Boeing/Lockheed/Deutsche Aircraft, etc.) — keep it accurate to the real company.
- **Tailwind v4, CSS-config only** — there is no `tailwind.config.*`. Tokens live in `app/globals.css` via `@import "tailwindcss"` + `@theme inline`. Fonts are wired as `--font-display` (Archivo), `--font-sans` (IBM Plex Sans), `--font-mono` (IBM Plex Mono), loaded through `next/font/google` in `app/layout.tsx`. Use the utility classes defined there (`.font-display`, `.display-xl`, `.eyebrow`, `.mono`, `.glow-text`) rather than re-specifying fonts.

### Conventions

- Anything reading scroll/pointer per-frame or touching `window`/Three.js is a client component (`"use client"`) and dynamic-imported with `ssr:false` where it must not run on the server.
- `prefers-reduced-motion` is a first-class path everywhere (sequences show a static frame; WebGL gates autonomous motion via `lib/motion.ts`; CSS disables reveal transitions). Preserve it when adding motion.
- The project root folder name contains a space (`SASMOS Homepage`) — quote paths in shell commands.
