"use client";

import { useEffect, useRef, useState } from "react";
import { SPHERE_ANCHORS } from "@/lib/palette";
import { scrollState } from "@/lib/scroll";

/**
 * Fixed "depth meter" on the right edge — shows the visitor's position in the
 * Space → Sky → Land → Sea descent. Reads the scroll store via rAF (no global
 * re-renders) and only commits state when the active sphere changes.
 */
export default function SphereProgress() {
  const [active, setActive] = useState(0);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = scrollState.progress;
      // journey occupies first ~0.55 of the page
      const jp = Math.min(1, p / 0.55);
      if (fillRef.current) fillRef.current.style.height = `${jp * 100}%`;
      let idx = 0;
      SPHERE_ANCHORS.forEach((a, i) => {
        if (p >= a.at - 0.04) idx = i;
      });
      setActive((prev) => (prev !== idx ? idx : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="relative flex flex-col items-end gap-6">
        {/* track */}
        <div
          className="absolute right-[5px] top-0 h-full w-px"
          style={{ background: "var(--line)" }}
        />
        <div
          ref={fillRef}
          className="absolute right-[5px] top-0 w-px"
          style={{ background: "var(--glow)", boxShadow: "0 0 8px var(--glow)", height: "0%" }}
        />
        {SPHERE_ANCHORS.map((a, i) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            className="group flex items-center gap-3"
            style={{ opacity: i === active ? 1 : 0.45 }}
          >
            <span
              className="mono text-[10px] transition-colors"
              style={{ color: i === active ? "var(--glow)" : "var(--fg-faint)" }}
            >
              {a.label}
            </span>
            <span
              className="h-[11px] w-[11px] rounded-full border transition-all"
              style={{
                borderColor: i === active ? "var(--glow)" : "var(--line-strong)",
                background: i === active ? "var(--glow)" : "transparent",
                boxShadow: i === active ? "0 0 10px var(--glow)" : "none",
              }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
