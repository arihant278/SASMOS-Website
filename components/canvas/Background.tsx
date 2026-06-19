"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { motionState } from "@/lib/motion";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export default function Background() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [dprMax, setDprMax] = useState(1.75);

  useEffect(() => {
    const r = prefersReducedMotion();
    setReduced(r);
    motionState.reduced = r; // read by models/scenes before the canvas mounts
    const small = window.matchMedia("(max-width: 768px)").matches;
    setDprMax(small ? 1.4 : 1.75);
    setMounted(true);
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0"
      style={{ background: "var(--bg)", transition: "background 0.6s linear" }}
    >
      {mounted && <Scene reduced={reduced} dpr={reduced ? [1, 1] : [1, dprMax]} />}
    </div>
  );
}
