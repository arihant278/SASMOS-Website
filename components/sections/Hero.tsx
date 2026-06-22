"use client";

import { INTRO } from "@/lib/content";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen overflow-hidden"
      style={{ background: "var(--void)" }}
    >
      {/* ── backdrop: frame 1 of the journey (the SASMOS wiring harness),
          so the hero opens immersed and hands off seamlessly into the
          satellite sequence that follows. */}
      <img
        src="/Satellite Sequence/00001.png"
        alt=""
        aria-hidden
        className="hero-bg absolute inset-0 h-full w-full object-cover"
      />

      {/* legibility + atmosphere: edge vignette, top scrim under the nav,
          and a soft floor that lifts toward the journey below. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 42%, transparent 0%, transparent 38%, rgba(4,6,13,0.55) 78%, rgba(4,6,13,0.86) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,6,13,0.78) 0%, rgba(4,6,13,0.28) 26%, rgba(4,6,13,0.30) 70%, rgba(8,10,18,0.55) 100%)",
        }}
      />

      {/* ── instrument framing: registration ticks at the four corners */}
      <div aria-hidden className="hero-ticks pointer-events-none absolute inset-0 z-[1]">
        <span className="tick tick-tl" />
        <span className="tick tick-tr" />
        <span className="tick tick-bl" />
        <span className="tick tick-br" />
      </div>

      {/* ── content */}
      <div className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span className="eyebrow hero-reveal" style={{ animationDelay: "0.15s" }}>
          {INTRO.eyebrow}
        </span>

        <h1 className="font-display display-xl glow-text mt-6 max-w-5xl text-fg">
          <span
            className="hero-reveal block"
            style={{ animationDelay: "0.35s" }}
          >
            {INTRO.line1}
          </span>
          <span
            className="hero-reveal block"
            style={{ animationDelay: "0.5s" }}
          >
            {INTRO.line2}
          </span>
        </h1>

        <p
          className="hero-reveal mt-8 max-w-xl text-base leading-relaxed text-fg-dim"
          style={{ animationDelay: "0.7s" }}
        >
          {INTRO.tagline}
        </p>

        {/* telemetry strip — small proof, instrument-panel style */}
        <div
          className="hero-reveal mono mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] text-fg-faint"
          style={{ animationDelay: "0.85s" }}
        >
          <span>EST. 2007 · BANGALORE</span>
          <span className="hero-sep" />
          <span>SEA → LAND → AIR → SPACE</span>
          <span className="hero-sep" />
          <span>AS9100 CERTIFIED</span>
        </div>
      </div>

      {/* ── corner readouts */}
      <div
        aria-hidden
        className="hero-reveal mono absolute bottom-6 left-6 z-[2] hidden text-[10px] text-fg-faint sm:block md:bottom-8 md:left-10"
        style={{ animationDelay: "1s" }}
      >
        12.97°N · 77.59°E
      </div>
      <div
        className="hero-reveal mono absolute bottom-6 right-6 z-[2] hidden items-center gap-2 text-[10px] text-fg-faint sm:flex md:bottom-8 md:right-10"
        style={{ animationDelay: "1s" }}
      >
        <span
          className="hero-pulse inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: "var(--glow)", boxShadow: "0 0 10px var(--glow)" }}
        />
        SYSTEMS NOMINAL
      </div>

      {/* ── scroll cue */}
      <div
        className="hero-reveal mono absolute bottom-8 left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] text-fg-faint"
        style={{ animationDelay: "1.15s" }}
      >
        <span>SCROLL TO DESCEND</span>
        <span className="hero-scroll-track">
          <span className="hero-scroll-dot" style={{ background: "var(--glow)" }} />
        </span>
      </div>

      <style>{`
        @keyframes heroUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes heroZoom {
          from { transform: scale(1.06); }
          to { transform: scale(1.14); }
        }
        @keyframes heroDot {
          0% { transform: translateY(-6px); opacity: 0; }
          35% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        @keyframes heroPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }

        .hero-bg {
          transform-origin: 50% 45%;
          animation: heroZoom 28s ease-out forwards;
          will-change: transform;
        }
        .hero-reveal {
          opacity: 0;
          animation: heroUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* corner registration ticks */
        .tick {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: var(--line-strong);
          opacity: 0.8;
        }
        .tick-tl { top: 84px; left: 24px; border-top: 1px solid; border-left: 1px solid; }
        .tick-tr { top: 84px; right: 24px; border-top: 1px solid; border-right: 1px solid; }
        .tick-bl { bottom: 24px; left: 24px; border-bottom: 1px solid; border-left: 1px solid; }
        .tick-br { bottom: 24px; right: 24px; border-bottom: 1px solid; border-right: 1px solid; }
        @media (min-width: 768px) {
          .tick-tl { left: 40px; }
          .tick-tr { right: 40px; }
          .tick-bl { left: 40px; bottom: 32px; }
          .tick-br { right: 40px; bottom: 32px; }
        }

        .hero-sep {
          width: 18px;
          height: 1px;
          background: var(--line-strong);
        }
        .hero-pulse { animation: heroPulse 2.4s ease-in-out infinite; }

        .hero-scroll-track {
          position: relative;
          display: block;
          width: 1px;
          height: 40px;
          background: var(--line-strong);
          overflow: hidden;
        }
        .hero-scroll-dot {
          position: absolute;
          left: 50%;
          top: 0;
          width: 3px;
          height: 8px;
          margin-left: -1.5px;
          border-radius: 2px;
          box-shadow: 0 0 8px var(--glow);
          animation: heroDot 1.9s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bg { animation: none; transform: scale(1.06); }
          .hero-reveal { opacity: 1; animation: none; }
          .hero-pulse, .hero-scroll-dot { animation: none; }
          .hero-scroll-dot { top: 8px; opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}
