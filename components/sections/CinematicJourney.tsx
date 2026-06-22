"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { setSphere, setJourney } from "@/lib/scroll";
import { CHAPTER_PALETTE, POST_JOURNEY, mix, type SphereId } from "@/lib/palette";

/* ─── types ─────────────────────────────────────────────────────────── */

export interface PanelLogo {
  src: string;
  alt: string;
  /** rendered height in px (logos vary in aspect; height normalizes the row) */
  h: number;
}

export interface Panel {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  /** scroll progress range *within this chapter* where the panel is visible */
  range: [number, number];
  /** partner logos shown beneath the body (e.g. when naming Boeing/Lockheed) */
  logos?: PanelLogo[];
}

export interface ProofPoint {
  name: string;
  sub: string;
}

export interface JourneyChapter {
  /** nav anchor id, e.g. "space" | "sky" | "land" | "sea" */
  id: string;
  /** public/ folder holding the 1-indexed NNNNN.png frames */
  sequenceDir: string;
  totalFrames: number;
  panels: Panel[];
  proof?: ProofPoint[];
  /** 1-indexed frame shown in the reduced-motion / static fallback */
  reducedFrame?: number;
  reducedAlt: string;
}

export interface CinematicJourneyProps {
  chapters: JourneyChapter[];
  /**
   * Scroll distance (in vh) allotted to each frame. Higher = slower scrub.
   * The whole journey is one section of (totalFrames × vhPerFrame) vh.
   */
  vhPerFrame?: number;
}

const BATCH_SIZE = 20;
const DEFAULT_VH_PER_FRAME = 3.5;
/** Must match `.satellite-sticky { height }` in globals.css. */
const STICKY_VH = 100;

/* ─── helpers ──────────────────────────────────────────────────────── */

function pad(index: number) {
  return String(index).padStart(5, "0");
}

/** hex + 0.5-alpha for --glow-soft (text-shadow tint). */
function hexAlpha(hex: string, a = 0.5) {
  return hex + Math.round(a * 255).toString(16).padStart(2, "0");
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  // cover-fit: centre the image so it fills the canvas without distortion
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = cw / ch;
  let sx = 0,
    sy = 0,
    sw = img.naturalWidth,
    sh = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sw = img.naturalHeight * canvasRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / canvasRatio;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

/* ─── component ────────────────────────────────────────────────────── */

export default function CinematicJourney({
  chapters,
  vhPerFrame = DEFAULT_VH_PER_FRAME,
}: CinematicJourneyProps) {
  /* Flatten every chapter into one continuous frame timeline. Each entry maps
     a global frame index to a concrete (folder, local 1-indexed file). */
  const { frames, chapterStarts, totalFrames } = useMemo(() => {
    const frames: { dir: string; local: number }[] = [];
    const chapterStarts: number[] = [];
    for (const ch of chapters) {
      chapterStarts.push(frames.length);
      for (let i = 0; i < ch.totalFrames; i++) {
        frames.push({ dir: ch.sequenceDir, local: i + 1 });
      }
    }
    return { frames, chapterStarts, totalFrames: frames.length };
  }, [chapters]);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(totalFrames).fill(null),
  );
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const loadedBatchesRef = useRef<Set<number>>(new Set());

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const sectionVh = Math.round(totalFrames * vhPerFrame);
  const lastFrame = Math.max(1, totalFrames - 1);

  const frameSrc = useCallback(
    (globalIndex: number) => {
      const f = frames[globalIndex];
      return `/${f.dir}/${pad(f.local)}.webp`;
    },
    [frames],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ─── image preloading (whole journey, in order) ─────────────────── */

  const loadImage = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }
        const img = new Image();
        img.src = frameSrc(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          resolve(img);
        };
        img.onerror = reject;
      });
    },
    [frameSrc],
  );

  const loadBatch = useCallback(
    async (start: number, end: number) => {
      const promises: Promise<HTMLImageElement>[] = [];
      for (let i = start; i < Math.min(end, totalFrames); i++) {
        promises.push(loadImage(i));
      }
      await Promise.all(promises);
    },
    [loadImage, totalFrames],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setIsReducedMotion(true);
      setLoadProgress(1);
      setIsReady(true);
      return;
    }

    let cancelled = false;
    async function preloadInitial() {
      loadedBatchesRef.current.add(0);
      await loadBatch(0, BATCH_SIZE);
      if (cancelled) return;
      
      const chapterFirstFrames = chapterStarts.filter(start => start > 0);
      await Promise.all(chapterFirstFrames.map(f => loadImage(f)));

      setLoadProgress(Math.min(BATCH_SIZE, totalFrames) / totalFrames);
      setIsReady(true);
    }
    preloadInitial();
    return () => {
      cancelled = true;
    };
  }, [loadBatch, totalFrames, chapterStarts, loadImage]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isReducedMotion || !isReady) return;
    
    const currentFrame = Math.round(v * lastFrame);
    const PRELOAD_AHEAD = 100;
    const targetFrame = Math.min(totalFrames, currentFrame + PRELOAD_AHEAD);
    
    const currentBatchIdx = Math.floor(currentFrame / BATCH_SIZE);
    const targetBatchIdx = Math.floor(targetFrame / BATCH_SIZE);

    for (let b = currentBatchIdx; b <= targetBatchIdx; b++) {
      if (!loadedBatchesRef.current.has(b)) {
        loadedBatchesRef.current.add(b);
        const start = b * BATCH_SIZE;
        loadBatch(start, start + BATCH_SIZE).catch(console.error);
      }
    }
  });

  /* ─── canvas sizing ─────────────────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function resize() {
      // Source frames are 1280×720. Limit the canvas buffer so we never
      // stretch a 720p image across a much larger pixel grid — the main
      // cause of the soft/blurry look on high-DPI screens.
      const nativeDpr = window.devicePixelRatio || 1;
      // On a 1920-wide display, dpr 1 already matches the frames well.
      // On a 2560+ display we allow a mild upscale (1.25×) but no more.
      const maxBufferWidth = 1920;
      const effectiveDpr = Math.min(
        nativeDpr,
        maxBufferWidth / window.innerWidth,
      );
      const dpr = Math.max(1, effectiveDpr);

      canvas!.width = Math.round(window.innerWidth * dpr);
      canvas!.height = Math.round(window.innerHeight * dpr);
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;

      const img = imagesRef.current[currentFrameRef.current];
      const ctx = canvas!.getContext("2d");
      if (ctx && img) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        drawFrame(ctx, img, canvas!.width, canvas!.height);
      }
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ─── render loop ───────────────────────────────────────────────── */

  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let img = imagesRef.current[frameIndex];
    // If this exact frame hasn't decoded yet, fall back to the nearest loaded
    // frame so a fast scroll never leaves the canvas blank or frozen-stale.
    if (!img) {
      for (let d = 1; d <= 12 && !img; d++) {
        img = imagesRef.current[frameIndex - d] || imagesRef.current[frameIndex + d] || null;
      }
    }
    if (!img) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Force high-quality upscaling for high-DPI/Retina displays
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    
    drawFrame(ctx, img, canvas.width, canvas.height);
  }, []);

  /* Drive --bg/--glow and the depth meter from the film's own progress, so the
     accent colour and the "Space/Sky/Land/Sea" indicator always match the frame
     on screen. Each chapter holds its colour, cross-fading only near its end. */
  const applyJourneyPalette = useCallback(
    (v: number) => {
      const root = document.documentElement;
      // release control at the very edges → hero & tail use the global ramp
      if (v <= 0.0015 || v >= 0.9985) {
        setJourney(false, v <= 0.0015 ? 0 : 1);
        return;
      }
      const frame = v * lastFrame;
      let c = 0;
      for (let i = 0; i < chapterStarts.length; i++) {
        if (frame >= chapterStarts[i]) c = i;
      }
      const startF = chapterStarts[c];
      const endF = chapterStarts[c + 1] ?? totalFrames;
      const lcp = (frame - startF) / Math.max(1, endF - startF); // 0..1 in chapter
      const id = chapters[c].id as SphereId;
      let { bg, glow } = CHAPTER_PALETTE[id] ?? CHAPTER_PALETTE.space;

      const CF = 0.85; // hold colour until the last 15% of the chapter
      if (lcp > CF) {
        const nextId = chapters[c + 1]?.id as SphereId | undefined;
        const target = nextId ? CHAPTER_PALETTE[nextId] : POST_JOURNEY;
        const t = (lcp - CF) / (1 - CF);
        bg = mix(bg, target.bg, t);
        glow = mix(glow, target.glow, t);
      }

      root.style.setProperty("--bg", bg);
      root.style.setProperty("--glow", glow);
      root.style.setProperty("--glow-soft", hexAlpha(glow, 0.5));
      setSphere(id);
      setJourney(true, v);
    },
    [chapters, chapterStarts, totalFrames, lastFrame],
  );

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isReducedMotion) return;
    const raw = Math.round(v * lastFrame);
    const clamped = Math.max(0, Math.min(lastFrame, raw));
    if (clamped !== currentFrameRef.current) {
      currentFrameRef.current = clamped;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => renderFrame(clamped));
    }
    applyJourneyPalette(v);
  });

  useEffect(() => {
    if (isReady && !isReducedMotion) renderFrame(0);
  }, [isReady, isReducedMotion, renderFrame]);

  /* ─── chapter → global progress windows ─────────────────────────── */

  // [enter,exit] within a chapter → global scroll progress, matching the
  // frame mapping (which uses lastFrame).
  const toGlobal = useCallback(
    (chStart: number, chFrames: number, localT: number) =>
      (chStart + localT * (chFrames - 1)) / lastFrame,
    [lastFrame],
  );

  /* ─── reduced-motion fallback (stacked chapters) ────────────────── */

  if (isReducedMotion) {
    return (
      <section
        id="journey"
        className="satellite-section-reduced relative px-6 py-24 md:px-16"
        style={{ background: "#080a12" }}
      >
        <div className="mx-auto max-w-[1400px]">
          {chapters.map((ch) => {
            const staticFrame = ch.reducedFrame ?? Math.round(ch.totalFrames * 0.83);
            return (
              <div key={ch.id} id={ch.id} className="mb-24 scroll-mt-24">
                <div className="mb-10 overflow-hidden rounded-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/${ch.sequenceDir}/${pad(staticFrame)}.png`}
                    alt={ch.reducedAlt}
                    className="w-full"
                    loading="lazy"
                  />
                </div>
                {ch.panels.map((panel) => (
                  <div key={panel.id} className="mb-12 max-w-2xl">
                    <span className="eyebrow">{panel.eyebrow}</span>
                    <h2 className="font-display display-lg mt-4 text-fg">{panel.heading}</h2>
                    <p className="mt-4 text-base leading-relaxed text-fg-dim">{panel.body}</p>
                    {panel.logos && <LogoRow logos={panel.logos} />}
                  </div>
                ))}
                {ch.proof && <StaticProof proof={ch.proof} />}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  /* ─── main render ───────────────────────────────────────────────── */

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="satellite-section relative"
      style={{ height: `${sectionVh}vh` }}
    >
      {/* nav anchors placed at each chapter's scroll offset */}
      {chapters.map((ch, c) => {
        const anchorVh = (chapterStarts[c] / lastFrame) * (sectionVh - STICKY_VH);
        return (
          <div
            key={ch.id}
            id={ch.id}
            aria-hidden
            style={{ position: "absolute", top: `${anchorVh}vh`, left: 0, width: 1, height: 1 }}
          />
        );
      })}

      <div className="satellite-sticky">
        <canvas ref={canvasRef} className="satellite-canvas" aria-hidden />
        {/* cinematic lower-third scrim: keeps captions legible and the hero
            subject (centre/upper frame) clear, consistently across chapters */}
        <div className="journey-scrim" aria-hidden />

        {loadProgress < 1 && (
          <div className="satellite-progress-track">
            <motion.div className="satellite-progress-bar" style={{ scaleX: loadProgress }} />
          </div>
        )}

        {chapters.map((ch, c) =>
          ch.panels.map((panel) => {
            const chFrames = ch.totalFrames;
            const chStart = chapterStarts[c];
            const range: [number, number] = [
              toGlobal(chStart, chFrames, panel.range[0]),
              toGlobal(chStart, chFrames, panel.range[1]),
            ];
            return (
              <TextOverlay
                key={ch.id + panel.id}
                eyebrow={panel.eyebrow}
                heading={panel.heading}
                body={panel.body}
                logos={panel.logos}
                range={range}
                scrollYProgress={scrollYProgress}
              />
            );
          }),
        )}

        {chapters.map((ch, c) => {
          if (!ch.proof) return null;
          const chFrames = ch.totalFrames;
          const chStart = chapterStarts[c];
          return (
            <ProofGroup
              key={ch.id + "-proof"}
              proof={ch.proof}
              // fade in late in the chapter (on the hero frame), fade out before it ends
              inRange={[toGlobal(chStart, chFrames, 0.8), toGlobal(chStart, chFrames, 0.88)]}
              outRange={[toGlobal(chStart, chFrames, 0.97), toGlobal(chStart, chFrames, 1.0)]}
              scrollYProgress={scrollYProgress}
            />
          );
        })}
      </div>
    </section>
  );
}

/* ─── text overlay ─────────────────────────────────────────────────── */

function TextOverlay({
  eyebrow,
  heading,
  body,
  logos,
  range,
  scrollYProgress,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  logos?: PanelLogo[];
  range: [number, number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [enter, exit] = range;
  const mid = (enter + exit) / 2;
  const fadeIn = (mid - enter) * 0.4;
  const fadeOut = (exit - mid) * 0.4;

  const opacity = useTransform(
    scrollYProgress,
    [enter, enter + fadeIn, mid, exit - fadeOut, exit],
    [0, 1, 1, 1, 0],
  );
  const y = useTransform(
    scrollYProgress,
    [enter, enter + fadeIn, exit - fadeOut, exit],
    [60, 0, 0, -40],
  );

  return (
    <motion.div className="satellite-overlay" style={{ opacity, y }}>
      <div className="satellite-panel">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="font-display mt-3 text-fg glow-text satellite-heading">{heading}</h2>
        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-fg-dim">{body}</p>
        {logos && <LogoRow logos={logos} />}
      </div>
    </motion.div>
  );
}

function LogoRow({ logos }: { logos: PanelLogo[] }) {
  return (
    <div className="journey-logos">
      {logos.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={l.src} src={l.src} alt={l.alt} style={{ height: l.h }} />
      ))}
    </div>
  );
}

/* ─── proof point cards ────────────────────────────────────────────── */

function StaticProof({ proof }: { proof: ProofPoint[] }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {proof.map((pf) => (
        <div
          key={pf.name}
          className="rounded-xl border p-5 backdrop-blur-sm"
          style={{ borderColor: "var(--line)", background: "rgba(8,12,24,0.5)" }}
        >
          <div className="font-display text-xl text-fg">{pf.name}</div>
          <div className="mono mt-1 text-[10px] text-fg-faint">{pf.sub}</div>
        </div>
      ))}
    </div>
  );
}

function ProofGroup({
  proof,
  inRange,
  outRange,
  scrollYProgress,
}: {
  proof: ProofPoint[];
  inRange: [number, number];
  outRange: [number, number];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(
    scrollYProgress,
    [inRange[0], inRange[1], outRange[0], outRange[1]],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [inRange[0], inRange[1]], [50, 0]);

  return (
    <motion.div className="satellite-proof-points" style={{ opacity, y }}>
      {proof.map((pf, i) => (
        <div
          key={pf.name}
          className="rounded-xl border p-5 backdrop-blur-md"
          style={{ borderColor: "var(--line)", background: "rgba(8,12,24,0.55)" }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div className="font-display text-xl text-fg">{pf.name}</div>
            <span className="mono text-[10px]" style={{ color: "var(--glow)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mono mt-1 text-[10px] text-fg-faint">{pf.sub}</div>
        </div>
      ))}
    </motion.div>
  );
}
