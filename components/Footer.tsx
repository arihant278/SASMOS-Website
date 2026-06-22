import { ENTITIES, LOCATIONS } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="site-footer px-6 py-16 md:px-10"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src="/sasmos-logo.png" alt="SASMOS" className="h-10 w-auto object-contain" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg-dim">
            High-reliability interconnection systems and electromechanical assemblies
            for the world&apos;s most demanding environments — on earth and beyond it.
          </p>
          <a
            href="#contact"
            className="mono mt-6 inline-block rounded-full border px-5 py-2.5 text-[11px] text-fg transition-colors hover:border-glow"
            style={{ borderColor: "var(--line-strong)" }}
          >
            Start a conversation
          </a>
        </div>

        <div>
          <div className="eyebrow mb-4">Group Entities</div>
          <ul className="space-y-2.5">
            {ENTITIES.map((e) => (
              <li key={e} className="text-sm text-fg-dim transition-colors hover:text-fg">
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="eyebrow mb-4">Global Network</div>
          <ul className="space-y-2.5">
            {LOCATIONS.map((l) => (
              <li key={l} className="text-sm text-fg-dim">
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="mx-auto mt-14 flex max-w-[1400px] flex-col gap-2 border-t pt-6 text-xs text-fg-faint md:flex-row md:items-center md:justify-between"
        style={{ borderColor: "var(--line)" }}
      >
        <span className="mono text-[10px]">© {new Date().getFullYear()} SASMOS HET TECHNOLOGIES LTD.</span>
        <span className="mono text-[10px]">SEA · LAND · AIR · SPACE</span>
      </div>
    </footer>
  );
}
