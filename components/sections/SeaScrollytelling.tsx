"use client";

import { SPHERES } from "@/lib/content";
import FrameSequenceScrollytelling, {
  type Panel,
} from "./FrameSequenceScrollytelling";

const sea = SPHERES[3];

// 240-frame sequence. Narrative: the glowing interconnection module (continuing
// straight out of the Land chapter's final frame) is sealed into a pressurised
// subsea housing → the camera surfaces to a naval fleet with a submarine
// breaking the swell → descends through light shafts and bubbles into the
// blue-black → and finds a submarine gliding silently through the deep.
const PANELS: Panel[] = [
  {
    id: "sea-sealed",
    eyebrow: `04 — ${sea.layer}`,
    heading: "Sealed against the sea.",
    body: "The same interconnection module — now housed and pressurised, engineered to keep working where salt water and crushing depth defeat everything else. From the fighting edge on land to the silent edge beneath the waves.",
    range: [0.0, 0.2],
  },
  {
    id: "sea-fleet",
    eyebrow: "NAVAL & MARINE",
    heading: "Where the fleet patrols.",
    body: "On the surface, a working fleet; below it, a submarine breaks the swell. SASMOS interconnection systems run through naval platforms built for blue-water operations and the long, quiet watch.",
    range: [0.2, 0.45],
  },
  {
    id: "sea-descent",
    eyebrow: "PRESSURISED RELIABILITY",
    heading: "Down into the dark.",
    body: "The light thins and the pressure climbs. Every connection must hold against water ingress and depth — fibre-optic links and naval EWIS carrying command and sensor data through the deep, where there is no second chance.",
    range: [0.43, 0.66],
  },
  {
    id: "sea-silence",
    eyebrow: sea.altitude,
    heading: sea.heading,
    body: "A submarine glides through the blue-black, lit only by the faint glow of its own systems. In the most demanding silence on earth, our connections still speak — flawlessly, mission after mission.",
    range: [0.64, 1.0],
  },
];

export default function SeaScrollytelling() {
  return (
    <FrameSequenceScrollytelling
      sectionId="sea"
      sequenceDir="water sequence"
      totalFrames={240}
      panels={PANELS}
      proof={sea.proof}
      reducedFrame={210}
      reducedAlt="Submarine carrying SASMOS naval interconnection systems gliding through deep water"
    />
  );
}
