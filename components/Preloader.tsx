"use client";

import { useEffect, useState } from "react";

/** Brief boot sequence masking first-frame WebGL init. */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v = Math.min(100, v + Math.random() * 18 + 6);
      setPct(Math.floor(v));
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => setDone(true), 450);
      }
    }, 110);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center transition-opacity duration-700"
      style={{
        background: "#04060f",
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <div className="flex w-[min(80vw,420px)] flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-2xl tracking-tight text-fg">SASMOS</span>
          <span className="mono text-[11px] text-glow">{pct}%</span>
        </div>
        <div className="h-px w-full" style={{ background: "var(--line)" }}>
          <div
            className="h-px"
            style={{
              width: `${pct}%`,
              background: "var(--glow)",
              boxShadow: "0 0 8px var(--glow)",
              transition: "width 0.2s linear",
            }}
          />
        </div>
        <span className="mono text-[10px] text-fg-faint">
          INITIALISING ORBIT // EXOSPHERE
        </span>
      </div>
    </div>
  );
}
