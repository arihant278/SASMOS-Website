"use client";

import { useEffect, useRef } from "react";
import { MILESTONES } from "@/lib/content";
import { mix } from "@/lib/palette";
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

// We descend out of the sea chapter: the section opens on the last sea frame's
// tone and darkens into the abyss as you scroll deeper through time.
const SEA_SURFACE = "#16232c"; // avg colour of the final sea frame
const ABYSS = "#02060c";

export default function Timeline() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    registerGsap();
    const pin = pinRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!pin || !track || !fill) return;

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>(".tl-dot");
      const distance = track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: -distance,
        ease: "none",
      });
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: () => `+=${distance + window.innerHeight}`,
        pin: true,
        scrub: 1,
        animation: tween,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          // glowing fill advances left → right with scroll
          fill.style.transform = `scaleX(${p})`;
          // each dot lights as the fill reaches it
          dots.forEach((d, i) => {
            const pos = dots.length > 1 ? i / (dots.length - 1) : 0;
            d.classList.toggle("is-active", p >= pos - 0.015);
          });
          // descend into deeper, darker water
          pin.style.backgroundColor = mix(SEA_SURFACE, ABYSS, p);
        },
      });

      // reveal each card as it scrolls toward centre
      gsap.utils.toArray<HTMLElement>(".milestone").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 85%",
          },
        });
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="history"
      ref={pinRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: SEA_SURFACE }}
    >
      <div className="flex min-h-screen flex-col justify-center py-20">
        <div className="px-6 md:px-16">
          <div className="mx-auto max-w-[1400px]">
            <span className="eyebrow">Our History</span>
            <h2 className="font-display display-lg mt-4 max-w-2xl text-fg">
              Two decades of relentless building.
            </h2>
          </div>
        </div>

        <div ref={trackRef} className="mt-16 flex w-max items-stretch gap-6 px-6 md:gap-10 md:px-16">
          {MILESTONES.map((m) => (
            <article
              key={m.year}
              className="milestone flex w-[78vw] max-w-[420px] flex-col justify-between rounded-2xl border p-7 md:w-[34vw]"
              style={{
                borderColor: "var(--line)",
                background: "rgba(8,12,24,0.45)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div>
                <div className="font-display text-5xl glow-text text-fg md:text-6xl">{m.year}</div>
                <div
                  className="mt-4 h-px w-12"
                  style={{ background: "var(--glow)", boxShadow: "0 0 8px var(--glow)" }}
                />
              </div>
              <div className="mt-8">
                <h3 className="font-display text-2xl text-fg">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-dim">{m.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* horizontal depth/progress bar — glows as each milestone is reached */}
        <div className="mt-14 px-6 md:px-16">
          <div className="mx-auto max-w-[1400px]">
            <div className="tl-progress">
              <div className="tl-progress-fill" ref={fillRef} />
              {MILESTONES.map((m, i) => (
                <div
                  key={m.year}
                  className="tl-node"
                  style={{ left: `${MILESTONES.length > 1 ? (i / (MILESTONES.length - 1)) * 100 : 0}%` }}
                >
                  <span className="tl-dot" />
                  <span className="tl-node-year mono">{m.year}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 flex items-center justify-between">
              <span className="mono text-[10px] text-fg-faint">2007 — PRESENT</span>
              <span className="mono text-[10px] text-fg-faint">SCROLL TO DESCEND THROUGH TIME →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
