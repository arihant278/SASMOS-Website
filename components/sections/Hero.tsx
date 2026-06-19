"use client";

import { INTRO } from "@/lib/content";

export default function Hero() {
  return (
    <section id="top" className="relative">
      {/* opening intro */}
      <div
        className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <span className="eyebrow animate-[fadeUp_1s_ease_forwards]">{INTRO.eyebrow}</span>
        <h1 className="font-display display-xl glow-text mt-6 max-w-5xl text-fg">
          {INTRO.line1}
          <br />
          {INTRO.line2}
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-fg-dim">{INTRO.blurb}</p>
        <div className="mono mt-16 flex flex-col items-center gap-2 text-[10px] text-fg-faint">
          <span>SCROLL TO DESCEND</span>
          <span className="block h-10 w-px animate-pulse" style={{ background: "var(--glow)" }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  );
}

