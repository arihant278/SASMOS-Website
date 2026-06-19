"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setProgress } from "@/lib/scroll";
import { sampleRamp } from "@/lib/palette";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();

    const root = document.documentElement;
    const applyPalette = (p: number) => {
      const { bg, glow } = sampleRamp(p);
      root.style.setProperty("--bg", bg);
      root.style.setProperty("--glow", glow);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      setProgress(p);
      applyPalette(p);
    };

    if (reduced) {
      // No smooth scroll; still track progress for the canvas + palette.
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", () => {
      ScrollTrigger.update();
      onScroll();
    });

    // expose for programmatic control (verification / smooth anchor jumps)
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // refresh triggers once layout has settled
    ScrollTrigger.refresh();
    onScroll();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
