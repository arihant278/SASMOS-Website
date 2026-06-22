"use client";

import Reveal from "@/components/Reveal";

/** The ending — back to the beginning, but seen differently. The descent
 *  bottoms out in the abyss; the CTA sits in a bright surfaced-light card. */
export default function ReturnToSpace() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-6 py-32"
      style={{ background: "linear-gradient(180deg, #01040a 0%, #010307 100%)" }}
    >
      <Reveal className="cta-card mx-auto w-full max-w-2xl text-center">
        <span className="eyebrow" style={{ color: "#5b6b7e" }}>
          Back to the beginning
        </span>
        <h2 className="font-display mt-6 text-4xl leading-[1.05] tracking-tight md:text-6xl" style={{ color: "#0a0f1a" }}>
          Now you see it differently.
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed" style={{ color: "#3c4756" }}>
          You have been through the journey. You understand what was built to get that
          satellite into orbit — the hands and the precision behind it. Our products are
          world-class. Our story is extraordinary.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="mono rounded-full px-7 py-3.5 text-[11px] text-white transition-transform hover:scale-105"
            style={{ background: "#0a0f1a" }}
          >
            Partner with SASMOS
          </a>
          <a
            href="#top"
            className="mono rounded-full border px-7 py-3.5 text-[11px] transition-colors"
            style={{ borderColor: "#c3ccd6", color: "#0a0f1a" }}
          >
            Restart the journey
          </a>
        </div>
      </Reveal>
    </section>
  );
}
