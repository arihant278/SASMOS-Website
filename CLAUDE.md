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

1. **Image-sequence scrollytelling — ACTIVE.** Pre-rendered 240-frame PNG sequences scrubbed on scroll (Apple-style), drawn to a 2D canvas. This is the current visual language.
2. **Procedural WebGL — DORMANT.** A React-Three-Fiber scene (`components/canvas/**`) with procedural Earth/jet/tank/submarine models and cross-faded scenes. Fully built and typechecks, but **intentionally not mounted** (`components/canvas/Background` is no longer imported by `app/layout.tsx`). Kept in the repo as reference / possible fallback. Don't wire it back in without asking.

### Frame-sequence engine (the part to extend)

- `components/sections/FrameSequenceScrollytelling.tsx` is a **reusable engine**: batched image preloading, scroll-synced canvas drawing (cover-fit, device-pixel rendering), fade-in/out text panels, animated proof cards, and a `prefers-reduced-motion` static-image fallback. Scroll position comes from `framer-motion`'s `useScroll`.
- Concrete chapters are **thin config wrappers** around it: `SatelliteScrollytelling.tsx` (space) and `JetScrollytelling.tsx` (sky). Each just supplies `sectionId`, `sequenceDir`, `panels`, and `proof`.
- **Frames live in `public/<Name> Sequence/` as 1-indexed `00001.png … 00240.png`.** Note the folder names contain a space; the engine builds URLs like `/Satellite Sequence/00001.png` and the browser encodes them — this works, don't "fix" it. To add the Land/Sea chapters, drop a new sequence folder in `public/` and add a wrapper modeled on `JetScrollytelling`.

### Scroll & state plumbing

- `components/providers/SmoothScroll.tsx` runs **Lenis** smooth scroll, synced into the GSAP ticker, and on every scroll updates two things: the module-singleton in `lib/scroll.ts` (`scrollState.progress` / `.sphere`) and the CSS vars `--bg` / `--glow` (via `lib/palette.ts`). It honors `prefers-reduced-motion` (native scroll, no Lenis). It also exposes `window.__lenis`.
- `lib/palette.ts` is the **single source of truth for the journey palette**: a `RAMP` of keyframes (progress → bg/glow/sphere) sampled by both DOM (CSS vars) and the WebGL layer. The fixed palette-driven backdrop div in `layout.tsx` reads `var(--bg)` so non-sequence chapters aren't flat black.
- `lib/scroll.ts` deliberately only notifies React subscribers when the **discrete sphere** changes, not on every frame — per-frame consumers (canvas) read `scrollState.progress` directly inside `useFrame`/rAF to avoid re-renders.

### Content & type system

- **`lib/content.ts` is the single editable source for all copy** (intro, per-sphere narrative + proof points, milestones, people, entities, stats, certifications). Facts are drawn from the real sasmos.com (founded 2007, 61% CAGR, AS9100, Boeing/Lockheed/Deutsche Aircraft, etc.) — keep it accurate to the real company.
- **Tailwind v4, CSS-config only** — there is no `tailwind.config.*`. Tokens live in `app/globals.css` via `@import "tailwindcss"` + `@theme inline`. Fonts are wired as `--font-display` (Archivo), `--font-sans` (IBM Plex Sans), `--font-mono` (IBM Plex Mono), loaded through `next/font/google` in `app/layout.tsx`. Use the utility classes defined there (`.font-display`, `.display-xl`, `.eyebrow`, `.mono`, `.glow-text`) rather than re-specifying fonts.

### Conventions

- Anything reading scroll/pointer per-frame or touching `window`/Three.js is a client component (`"use client"`) and dynamic-imported with `ssr:false` where it must not run on the server.
- `prefers-reduced-motion` is a first-class path everywhere (sequences show a static frame; WebGL gates autonomous motion via `lib/motion.ts`; CSS disables reveal transitions). Preserve it when adding motion.
- The project root folder name contains a space (`SASMOS Homepage`) — quote paths in shell commands.
