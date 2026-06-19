"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/* ─── types ─────────────────────────────────────────────────────────── */

export interface Panel {
  id: string;
  eyebrow: string;
  heading: string;
  body: string;
  /** scroll progress range where this panel is visible [enter, exit] */
  range: [number, number];
}

export interface ProofPoint {
  name: string;
  sub: string;
}

export interface FrameSequenceProps {
  /** anchor + nav id, e.g. "space" | "sky" */
  sectionId: string;
  /** public/ folder holding the 1-indexed NNNNN.png frames */
  sequenceDir: string;
  totalFrames: number;
  panels: Panel[];
  proof?: ProofPoint[];
  /** 1-indexed frame shown in the reduced-motion / static fallback */
  reducedFrame?: number;
  reducedAlt: string;
  /**
   * Scroll distance (in vh) allotted to each frame. Higher = the sequence
   * scrubs more slowly. Section height = totalFrames × this. Default 3.5
   * gives a slow, deliberate cinematic scrub; keeps pacing identical across
   * chapters regardless of frame count.
   */
  vhPerFrame?: number;
}

const BATCH_SIZE = 20;
const DEFAULT_VH_PER_FRAME = 3.5;

/* ─── helpers ──────────────────────────────────────────────────────── */

function pad(index: number) {
  return String(index).padStart(5, "0");
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

export default function FrameSequenceScrollytelling({
  sectionId,
  sequenceDir,
  totalFrames,
  panels,
  proof,
  reducedFrame,
  reducedAlt,
  vhPerFrame = DEFAULT_VH_PER_FRAME,
}: FrameSequenceProps) {
  const sectionVh = Math.round(totalFrames * vhPerFrame);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    Array(totalFrames).fill(null),
  );
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const staticFrame = reducedFrame ?? Math.round(totalFrames * 0.83);

  const frameSrc = useCallback(
    (index: number) => `/${sequenceDir}/${pad(index)}.png`,
    [sequenceDir],
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* ─── image preloading ──────────────────────────────────────────── */

  const loadImage = useCallback(
    (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }
        const img = new Image();
        img.src = frameSrc(index + 1); // files are 1-indexed
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
      loadImage(staticFrame - 1).then(() => {
        setLoadProgress(1);
        setIsReady(true);
      });
      return;
    }

    let cancelled = false;

    async function preload() {
      await loadBatch(0, BATCH_SIZE);
      if (cancelled) return;
      setLoadProgress(BATCH_SIZE / totalFrames);
      setIsReady(true);

      for (let start = BATCH_SIZE; start < totalFrames; start += BATCH_SIZE) {
        if (cancelled) return;
        await loadBatch(start, start + BATCH_SIZE);
        setLoadProgress(Math.min(start + BATCH_SIZE, totalFrames) / totalFrames);
      }
    }

    preload();
    return () => {
      cancelled = true;
    };
  }, [loadImage, loadBatch, totalFrames, staticFrame]);

  /* ─── canvas sizing ─────────────────────────────────────────────── */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = `${window.innerWidth}px`;
      canvas!.style.height = `${window.innerHeight}px`;
      // repaint the current frame at the new size
      const img = imagesRef.current[currentFrameRef.current];
      const ctx = canvas!.getContext("2d");
      if (ctx && img) {
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
    const img = imagesRef.current[frameIndex];
    if (!img) return;

    // draw in device pixels with an identity transform — no DPR compounding
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFrame(ctx, img, canvas.width, canvas.height);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (isReducedMotion) return;
    const raw = Math.round(v * (totalFrames - 1));
    const clamped = Math.max(0, Math.min(totalFrames - 1, raw));
    if (clamped !== currentFrameRef.current) {
      currentFrameRef.current = clamped;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => renderFrame(clamped));
    }
  });

  useEffect(() => {
    if (isReady && !isReducedMotion) renderFrame(0);
  }, [isReady, isReducedMotion, renderFrame]);

  /* ─── reduced-motion fallback ───────────────────────────────────── */

  if (isReducedMotion) {
    return (
      <section
        id={sectionId}
        className="satellite-section-reduced relative px-6 py-32 md:px-16"
        style={{ background: "#080a12" }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frameSrc(staticFrame)} alt={reducedAlt} className="w-full" loading="eager" />
          </div>
          {panels.map((panel) => (
            <div key={panel.id} className="mb-16 max-w-2xl">
              <span className="eyebrow">{panel.eyebrow}</span>
              <h2 className="font-display display-lg mt-4 text-fg">{panel.heading}</h2>
              <p className="mt-4 text-base leading-relaxed text-fg-dim">{panel.body}</p>
            </div>
          ))}
          {proof && <StaticProof proof={proof} />}
        </div>
      </section>
    );
  }

  /* ─── main render ───────────────────────────────────────────────── */

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="satellite-section relative"
      style={{ height: `${sectionVh}vh` }}
    >
      <div className="satellite-sticky">
        <canvas ref={canvasRef} className="satellite-canvas" aria-hidden />

        {loadProgress < 1 && (
          <div className="satellite-progress-track">
            <motion.div className="satellite-progress-bar" style={{ scaleX: loadProgress }} />
          </div>
        )}

        {panels.map((panel) => (
          <TextOverlay key={panel.id} panel={panel} scrollYProgress={scrollYProgress} />
        ))}

        {proof && <ProofPointsAnimated proof={proof} scrollYProgress={scrollYProgress} />}
      </div>
    </section>
  );
}

/* ─── text overlay ─────────────────────────────────────────────────── */

function TextOverlay({
  panel,
  scrollYProgress,
}: {
  panel: Panel;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [enter, exit] = panel.range;
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
        <span className="eyebrow">{panel.eyebrow}</span>
        <h2 className="font-display display-lg mt-4 text-fg glow-text">{panel.heading}</h2>
        <p className="mt-5 max-w-md text-base leading-relaxed text-fg-dim">{panel.body}</p>
      </div>
    </motion.div>
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

function ProofPointsAnimated({
  proof,
  scrollYProgress,
}: {
  proof: ProofPoint[];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(scrollYProgress, [0.78, 0.86], [0, 1]);
  const y = useTransform(scrollYProgress, [0.78, 0.86], [50, 0]);

  return (
    <motion.div className="satellite-proof-points" style={{ opacity, y }}>
      {proof.map((pf, i) => (
        <motion.div
          key={pf.name}
          className="rounded-xl border p-5 backdrop-blur-md"
          style={{ borderColor: "var(--line)", background: "rgba(8,12,24,0.55)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div className="font-display text-xl text-fg">{pf.name}</div>
            <span className="mono text-[10px]" style={{ color: "var(--glow)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="mono mt-1 text-[10px] text-fg-faint">{pf.sub}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}
