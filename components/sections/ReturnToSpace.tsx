"use client";

import Reveal from "@/components/Reveal";

/** The ending — back to the beginning, but seen differently. */
export default function ReturnToSpace() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6 py-32 text-center">
      <Reveal className="mx-auto max-w-3xl">
        <span className="eyebrow">Back to the beginning</span>
        <h2 className="font-display display-lg glow-text mt-6 text-fg">
          Now you see it differently.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-fg-dim">
          You have been through the journey. You understand what was built to get that
          satellite into orbit — the hands and the precision behind it. Our products are
          world-class. Our story is extraordinary.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="mono rounded-full px-6 py-3 text-[11px] text-[#03060c] transition-transform hover:scale-105"
            style={{ background: "var(--glow)", boxShadow: "0 0 24px var(--glow)" }}
          >
            Partner with SASMOS
          </a>
          <a
            href="#top"
            className="mono rounded-full border px-6 py-3 text-[11px] text-fg transition-colors hover:border-glow"
            style={{ borderColor: "var(--line-strong)" }}
          >
            Restart the journey
          </a>
        </div>
      </Reveal>
    </section>
  );
}
