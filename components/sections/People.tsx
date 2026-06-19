"use client";

import { PEOPLE } from "@/lib/content";
import Reveal from "@/components/Reveal";

/** The minds behind the missions — a slow, cinematic reveal. Respect, not a
 *  grid of headshots. */
export default function People() {
  return (
    <section id="people" className="relative px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1100px]">
        <Reveal>
          <span className="eyebrow">The People</span>
          <h2 className="font-display display-lg mt-4 max-w-3xl text-fg">
            The minds behind the missions.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-dim">
            People who have chosen to build things that matter, in a field where
            excellence is not optional.
          </p>
        </Reveal>

        <div className="mt-24 flex flex-col gap-24 md:gap-36">
          {PEOPLE.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <figure className="grid items-start gap-8 md:grid-cols-[1fr_1.4fr]">
                <div>
                  <div className="mono text-[11px]" style={{ color: "var(--glow)" }}>
                    {p.tenure}
                  </div>
                  <h3 className="font-display mt-3 text-3xl text-fg md:text-4xl">{p.name}</h3>
                  <div className="mt-2 text-sm text-fg-dim">{p.role}</div>
                  <div className="mono mt-1 text-[10px] text-fg-faint">{p.expertise}</div>
                </div>
                <blockquote className="font-display glow-text text-2xl leading-snug text-fg md:text-4xl">
                  “{p.quote}”
                </blockquote>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
