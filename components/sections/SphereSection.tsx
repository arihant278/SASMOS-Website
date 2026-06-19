"use client";

import type { SphereContent } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function SphereSection({
  data,
  index,
}: {
  data: SphereContent;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <section id={data.id} className="relative min-h-[180vh]">
      <div className="sticky top-0 flex min-h-screen items-center px-6 md:px-16">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* left: narrative */}
            <Reveal>
              <span className="eyebrow">
                {num} — {data.layer}
              </span>
              <div className="mono mt-3 text-[11px] text-fg-faint">{data.altitude}</div>
              <h2 className="font-display display-lg mt-6 text-fg">{data.heading}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-fg-dim">{data.body}</p>
              {data.quote && (
                <blockquote
                  className="glow-text mt-8 max-w-md border-l-2 pl-5 font-display text-xl italic text-fg md:text-2xl"
                  style={{ borderColor: "var(--glow)" }}
                >
                  “{data.quote}”
                </blockquote>
              )}
            </Reveal>

            {/* right: proof points */}
            <div className="flex flex-col gap-3 md:items-end">
              {data.proof?.map((pf, i) => (
                <Reveal key={pf.name} delay={120 + i * 120} className="w-full max-w-sm">
                  <div
                    className="rounded-xl border p-5 backdrop-blur-sm transition-colors hover:border-glow"
                    style={{ borderColor: "var(--line)", background: "rgba(8,12,24,0.4)" }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="font-display text-xl text-fg">{pf.name}</div>
                      <span
                        className="mono text-[10px]"
                        style={{ color: "var(--glow)" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mono mt-1 text-[10px] text-fg-faint">{pf.sub}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
