"use client";

import { SPHERES } from "@/lib/content";
import FrameSequenceScrollytelling, {
  type Panel,
} from "./FrameSequenceScrollytelling";

const sky = SPHERES[1];

const PANELS: Panel[] = [
  {
    id: "jet-altitude",
    eyebrow: `02 — ${sky.layer}`,
    heading: sky.heading,
    body: "From orbit to the upper atmosphere — the same obsession with reliable interconnection now takes to the air, aboard the aircraft that move people and missions across the world.",
    range: [0.0, 0.28],
  },
  {
    id: "jet-proven",
    eyebrow: "PROVEN IN FLIGHT",
    heading: "Trusted by the names that fly.",
    body: "Boeing. Lockheed Martin. Deutsche Aircraft. SASMOS wiring harnesses and assemblies fly on commercial wide-bodies, maritime patrol aircraft, and the next generation of regional jets.",
    range: [0.25, 0.52],
  },
  {
    id: "jet-airworthy",
    eyebrow: "AIRWORTHINESS",
    heading: "Certified to the last connection.",
    body: "AS9100 and IPC/WHMA-built, every harness is engineered, tested, and qualified to airframe standards — because at altitude there is no room for a single faulty contact.",
    range: [0.48, 0.75],
  },
  {
    id: "jet-cruise",
    eyebrow: sky.altitude,
    heading: "Above the weather.",
    body: "Cruising through the atmosphere, each aircraft carries thousands of SASMOS connections — quietly doing their job, flight after flight.",
    range: [0.72, 1.0],
  },
];

export default function JetScrollytelling() {
  return (
    <FrameSequenceScrollytelling
      sectionId="sky"
      sequenceDir="Jet Sequence"
      totalFrames={240}
      panels={PANELS}
      proof={sky.proof}
      reducedFrame={120}
      reducedAlt="Airliner carrying SASMOS interconnection systems at cruise altitude"
    />
  );
}
