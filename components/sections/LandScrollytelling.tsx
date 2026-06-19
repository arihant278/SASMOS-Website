"use client";

import { SPHERES } from "@/lib/content";
import FrameSequenceScrollytelling, {
  type Panel,
} from "./FrameSequenceScrollytelling";

const land = SPHERES[2];

// 300-frame sequence. Narrative: the SASMOS airliner (continuing straight out
// of the Jet chapter's final frame) descends through cloud to the ground →
// a main battle tank breaks through the cloud with the jet still overhead →
// a mobile missile launcher → a ground radar / air-defence command post →
// and finally pushes inside, to the glowing interconnection module that runs
// through all of it. Panel ranges are timed to the frame where each subject
// is on screen (tank ~0.25, launcher ~0.37, radar ~0.50, module ~0.62→1.0).
const PANELS: Panel[] = [
  {
    id: "land-descent",
    eyebrow: `03 — ${land.layer}`,
    heading: land.heading,
    body: "The same aircraft drops out of cruise and the cloud thins to terrain. From orbit to altitude to the ground itself — this is where conditions turn unforgiving, and where reliability is measured in lives.",
    range: [0.0, 0.2],
  },
  {
    id: "land-armour",
    eyebrow: "ARMOURED MOBILITY",
    heading: "On the hardest ground.",
    body: "A main battle tank breaks through the cloud line and onto broken rock. Inside its hull, ruggedised wiring harnesses and electromechanical assemblies carry every command through shock, vibration, dust, and temperature swings that would defeat ordinary electronics.",
    range: [0.18, 0.38],
  },
  {
    id: "land-airdefence",
    eyebrow: "MISSILE & AIR DEFENCE",
    heading: "Targeting data that cannot drop.",
    body: "A mobile launcher raises its tubes; a ground radar and command vehicle sweep the horizon. The interconnection between sensor, fire-control, and launcher must carry targeting data without a single faulty contact — this is AVIRATA's domain.",
    range: [0.36, 0.62],
  },
  {
    id: "land-inside",
    eyebrow: land.altitude,
    heading: "Inside every system.",
    body: "The camera pushes through the armour to what we actually build: a precision interconnection module — gold contacts, routed harnesses, control electronics. The same SASMOS thread that wired the satellite now runs through the fighting edge on the ground.",
    range: [0.6, 1.0],
  },
];

export default function LandScrollytelling() {
  return (
    <FrameSequenceScrollytelling
      sectionId="land"
      sequenceDir="Land Sequence"
      totalFrames={300}
      panels={PANELS}
      proof={land.proof}
      reducedFrame={150}
      reducedAlt="Mobile missile launcher and armoured systems carrying SASMOS interconnection assemblies"
    />
  );
}
