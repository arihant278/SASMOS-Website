"use client";

import { SPHERES } from "@/lib/content";
import FrameSequenceScrollytelling, {
  type Panel,
} from "./FrameSequenceScrollytelling";

const space = SPHERES[0];

const PANELS: Panel[] = [
  {
    id: "panel-wiring",
    eyebrow: `01 — ${space.layer}`,
    heading: space.heading,
    body: space.body,
    range: [0.0, 0.28],
  },
  {
    id: "panel-nervous",
    eyebrow: "EWIS ARCHITECTURE",
    heading: "The nervous system.",
    body: "Every signal, every command, every byte of telemetry — channelled through a web of precision-engineered wiring that lets the satellite think, communicate, and survive.",
    range: [0.25, 0.52],
  },
  {
    id: "panel-void",
    eyebrow: "MISSION SURVIVABILITY",
    heading: "Built for the void.",
    body: "Vacuum. Radiation. Thermal extremes from −170 °C to +120 °C. Our interconnection systems are designed, tested, and qualified for the harshest environment known to engineering.",
    range: [0.48, 0.75],
  },
  {
    id: "panel-orbit",
    eyebrow: space.altitude,
    heading: "36,000 km above Earth.",
    body: "The camera pulls back. What you see now is the culmination — a satellite wired by SASMOS, orbiting above the planet, carrying the precision of thousands of connections.",
    range: [0.72, 1.0],
  },
];

export default function SatelliteScrollytelling() {
  return (
    <FrameSequenceScrollytelling
      sectionId="space"
      sequenceDir="Satellite Sequence"
      totalFrames={240}
      panels={PANELS}
      proof={space.proof}
      reducedFrame={200}
      reducedAlt="SASMOS satellite in orbit above Earth"
    />
  );
}
