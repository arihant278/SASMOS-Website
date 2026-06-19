"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/content";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(4,6,13,0.55)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="group flex items-center gap-3">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "var(--glow)", boxShadow: "0 0 12px var(--glow)" }}
          />
          <span className="font-display text-lg tracking-tight text-fg">SASMOS</span>
          <span className="mono hidden text-[10px] text-fg-faint sm:inline">
            HET TECHNOLOGIES
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="mono text-[11px] text-fg-dim transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="mono rounded-full border px-4 py-2 text-[11px] text-fg transition-all hover:border-glow"
            style={{ borderColor: "var(--line-strong)" }}
          >
            Contact
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="mono text-[11px] text-fg-dim md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {open && (
        <div
          className="border-t md:hidden"
          style={{ borderColor: "var(--line)", background: "rgba(4,6,13,0.92)" }}
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="mono py-2 text-xs text-fg-dim"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
