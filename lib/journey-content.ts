// The four cinematic chapters, assembled into one continuous frame timeline by
// <CinematicJourney>. Panel copy lives here; narrative facts come from
// lib/content.ts (SPHERES). Order defines the journey: Space → Sky → Land → Sea.
//
// IMPORTANT — panel ranges are timed to the "main frame" of each sequence, i.e.
// the local-progress window where that chapter's hero subject is actually on
// screen. Every sequence opens on the *previous* chapter's subject (the shared
// boundary frame that makes transitions seamless), so the new subject arrives
// later. Copy must land while its subject is visible:
//   Space  — wiring macro 0.0–0.55 · satellite-over-Earth 0.7–1.0
//   Sky    — Earth/cloud descent 0.0–0.5 · AIRCRAFT 0.55–1.0
//   Land   — descent 0.0–0.2 · tank 0.26–0.44 · launcher 0.46–0.6 · module 0.6–1.0
//   Sea    — sealed module 0.0–0.2 · submarine deep 0.28–0.5 · fleet 0.52–0.7 · glide 0.78–1.0

import { SPHERES } from "@/lib/content";
import type { JourneyChapter } from "@/components/sections/CinematicJourney";

const [space, sky, land, sea] = SPHERES;

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "space",
    sequenceDir: "Satellite Sequence 1",
    totalFrames: 240,
    reducedFrame: 200,
    reducedAlt: "SASMOS satellite in orbit above Earth",
    proof: space.proof,
    panels: [
      {
        id: "panel-wiring",
        eyebrow: `01 — ${space.layer}`,
        heading: space.heading,
        body: space.body,
        range: [0.03, 0.22],
      },
      {
        id: "panel-nervous",
        eyebrow: "EWIS ARCHITECTURE",
        heading: "The nervous system.",
        body: "Every signal, every command, every byte of telemetry — channelled through a web of precision-engineered wiring that lets the satellite think, communicate, and survive.",
        range: [0.27, 0.46],
      },
      {
        id: "panel-void",
        eyebrow: "MISSION SURVIVABILITY",
        heading: "Built for the void.",
        body: "Vacuum. Radiation. Thermal extremes from −170 °C to +120 °C. Our interconnection systems are designed, tested, and qualified for the harshest environment known to engineering.",
        range: [0.5, 0.66],
      },
      {
        id: "panel-orbit",
        eyebrow: space.altitude,
        heading: "36,000 km above Earth.",
        body: "The camera pulls back. What you see now is the culmination — a satellite wired by SASMOS, orbiting above the planet, carrying the precision of thousands of connections.",
        range: [0.74, 0.98],
      },
    ],
  },
  {
    id: "sky",
    sequenceDir: "Jet Sequence 1",
    totalFrames: 240,
    reducedFrame: 220,
    reducedAlt: "Airliner carrying SASMOS interconnection systems at cruise altitude",
    // company logos live in the "proven in flight" panel — no separate proof cards
    panels: [
      {
        id: "jet-altitude",
        eyebrow: `02 — ${sky.layer}`,
        heading: sky.heading,
        body: "From orbit down through the upper atmosphere — the same obsession with reliable interconnection now descends toward the aircraft that move people and missions across the world.",
        range: [0.04, 0.24],
      },
      {
        id: "jet-proven",
        eyebrow: "PROVEN IN FLIGHT",
        heading: "Trusted by the names that fly.",
        body: "SASMOS wiring harnesses and assemblies fly on commercial wide-bodies, maritime patrol aircraft, and the next generation of regional jets — built for the primes who set the standard.",
        range: [0.55, 0.77],
        logos: [
          { src: "/logos/boeing.svg", alt: "Boeing", h: 24 },
          { src: "/logos/lockheed.svg", alt: "Lockheed Martin", h: 21 },
          { src: "/logos/deutsche.png", alt: "Deutsche Aircraft", h: 40 },
        ],
      },
      {
        id: "jet-airworthy",
        eyebrow: "AIRWORTHINESS",
        heading: "Certified to the last connection.",
        body: "AS9100 and IPC/WHMA-built, every harness is engineered, tested, and qualified to airframe standards — because at altitude there is no room for a single faulty contact.",
        range: [0.8, 0.98],
      },
    ],
  },
  {
    id: "land",
    sequenceDir: "Land Sequence",
    totalFrames: 300,
    reducedFrame: 195,
    reducedAlt: "Mobile missile launcher and armoured systems carrying SASMOS interconnection assemblies",
    proof: land.proof,
    panels: [
      {
        id: "land-descent",
        eyebrow: `03 — ${land.layer}`,
        heading: land.heading,
        body: "The aircraft drops out of cruise and the cloud thins to terrain. From orbit to altitude to the ground itself — this is where conditions turn unforgiving, and where reliability is measured in lives.",
        range: [0.02, 0.18],
      },
      {
        id: "land-armour",
        eyebrow: "ARMOURED MOBILITY",
        heading: "On the hardest ground.",
        body: "A main battle tank breaks onto broken rock. Inside its hull, ruggedised wiring harnesses and electromechanical assemblies carry every command through shock, vibration, dust, and temperature swings that would defeat ordinary electronics.",
        range: [0.26, 0.44],
      },
      {
        id: "land-airdefence",
        eyebrow: "MISSILE & AIR DEFENCE",
        heading: "Targeting data that cannot drop.",
        body: "A mobile launcher raises its tubes; radar and command vehicles sweep the horizon. The link between sensor, fire-control, and launcher must carry targeting data without a single faulty contact — this is AVIRATA's domain.",
        range: [0.46, 0.6],
      },
      {
        id: "land-inside",
        eyebrow: land.altitude,
        heading: "Inside every system.",
        body: "The camera pushes through the armour to what we actually build: a precision interconnection module — gold contacts, routed harnesses, control electronics. The same SASMOS thread that wired the satellite now runs through the fighting edge on the ground.",
        range: [0.66, 0.96],
      },
    ],
  },
  {
    id: "sea",
    sequenceDir: "water sequence 1",
    totalFrames: 240,
    reducedFrame: 200,
    reducedAlt: "Submarine carrying SASMOS naval interconnection systems gliding through deep water",
    proof: sea.proof,
    panels: [
      {
        id: "sea-sealed",
        eyebrow: `04 — ${sea.layer}`,
        heading: "Sealed against the sea.",
        body: "The same interconnection module — now housed and pressurised, engineered to keep working where salt water and crushing depth defeat everything else. From the fighting edge on land to the silent edge beneath the waves.",
        range: [0.02, 0.2],
      },
      {
        id: "sea-descent",
        eyebrow: "PRESSURISED RELIABILITY",
        heading: "Down into the dark.",
        body: "The light thins and the pressure climbs. Every connection must hold against water ingress and depth — fibre-optic links and naval EWIS carrying command and sensor data through the deep, where there is no second chance.",
        range: [0.28, 0.46],
      },
      {
        id: "sea-fleet",
        eyebrow: "NAVAL & MARINE",
        heading: "Where the fleet patrols.",
        body: "On the surface, a working fleet; below it, a submarine breaks the swell. SASMOS interconnection systems run through naval platforms built for blue-water operations and the long, quiet watch.",
        range: [0.52, 0.68],
      },
      {
        id: "sea-silence",
        eyebrow: sea.altitude,
        heading: sea.heading,
        body: "A submarine glides through the blue-black, lit only by the faint glow of its own systems. In the most demanding silence on earth, our connections still speak — flawlessly, mission after mission.",
        range: [0.78, 0.98],
      },
    ],
  },
];
