"use client";

import { INTRO, SPHERES } from "@/lib/content";

const space = SPHERES[0];

export default function Hero() {
  return (
    <section id="space" className="relative">
      {/* opening intro */}
      <div
        id="top"
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

      {/* space sphere panel */}
      <div className="relative min-h-[160vh]">
        <div className="sticky top-0 flex min-h-screen items-center px-6 md:px-16">
          <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 md:grid-cols-2">
            <div>
              <span className="eyebrow">
                01 — {space.layer}
              </span>
              <div className="mono mt-3 text-[11px] text-fg-faint">{space.altitude}</div>
              <h2 className="font-display display-lg mt-6 text-fg">{space.heading}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-fg-dim">{space.body}</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              {space.proof?.map((pf) => (
                <div
                  key={pf.name}
                  className="w-full max-w-sm rounded-xl border p-5 backdrop-blur-sm transition-colors hover:border-glow"
                  style={{ borderColor: "var(--line)", background: "rgba(8,12,24,0.35)" }}
                >
                  <div className="font-display text-xl text-fg">{pf.name}</div>
                  <div className="mono mt-1 text-[10px] text-fg-faint">{pf.sub}</div>
                </div>
              ))}
            </div>
          </div>
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
