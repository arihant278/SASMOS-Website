// All homepage copy — drawn from "Website Flow (SASMOS).pdf".
// Single editable source; swap with a CMS later.

export type SphereId = "space" | "sky" | "land" | "sea";

export type SphereContent = {
  id: SphereId;
  layer: string; // scientific layer name
  altitude: string; // telemetry line (mono)
  heading: string;
  body: string;
  quote?: string;
  proof?: { name: string; sub: string }[];
};

export const INTRO = {
  eyebrow: "SASMOS HET Technologies",
  line1: "From the sea, the land,",
  line2: "the air — to space.",
  tagline: "Delivering high-end, high-quality engineering solutions from Sea to Space.",
  blurb:
    "We build the wiring, the connectors, and the precision assemblies that go inside satellites, fighter jets, naval submarines, and defence systems. This is the journey through the four environments our products call home.",
};

// Headline metrics pulled from the live site — real, verifiable proof.
export const STATS = [
  { value: "2007", label: "Founded in Bangalore, India" },
  { value: "61%", label: "CAGR across the first decade" },
  { value: "150K", label: "sq ft of precision manufacturing" },
  { value: "150+", label: "programs delivered annually" },
  { value: "70+", label: "global customer audits passed" },
];

export const VALUES = [
  "Continuous Improvement",
  "Customer Centricity",
  "Assured Reliability",
  "Unwavering Commitment",
];

export const CERTIFICATIONS = [
  "AS9100",
  "ISO 9001",
  "ISO 14001",
  "ISO 27001",
  "IPC / WHMA",
  "ITAR & EAR Compliant",
  "CTPAT (SCM)",
];

// The six environments SASMOS products operate in (four become spheres; Nuclear & Data Center noted).
export const MARKETS = ["Aerospace", "Defence", "Space", "Marine", "Nuclear", "Data Center"];

export const CAPABILITIES = [
  { name: "Electrical Wiring Interconnection Systems", sub: "EWIS" },
  { name: "High-Precision Electromechanical Systems", sub: "Assemblies & integration" },
  { name: "Mission-Critical Electronic Control Systems", sub: "Avionics & control" },
  { name: "Fiber-Optic Interconnectivity", sub: "Customised optical solutions" },
  { name: "Specialty Products", sub: "RF & flat-cable interconnections" },
];

export const SPHERES: SphereContent[] = [
  {
    id: "space",
    layer: "Exosphere",
    altitude: "36,000 KM ABOVE EARTH",
    heading: "It begins in orbit.",
    body: "The camera pulls back from the satellite. As it does, you begin to see what is inside — the wiring harness, glowing and precise: a web of connections that lets the satellite think, communicate, and survive.",
    proof: [
      { name: "Satellite EWIS", sub: "Precision interconnection" },
      { name: "Mission survivability", sub: "Built for vacuum & radiation" },
    ],
  },
  {
    id: "sky",
    layer: "Atmosphere",
    altitude: "36,000 FT ABOVE GROUND",
    heading: "The same craft, a different altitude.",
    body: "A jet materialises below, banking through clouds — purposeful and powerful. The same glowing thread of wiring connects the scenes. This is where the Boeing and Lockheed Martin partnerships land — not names in a paragraph, but proof points.",
    proof: [
      { name: "P-8A Poseidon", sub: "Maritime patrol" },
      { name: "D328eco", sub: "Next-gen regional" },
      { name: "Boeing 767", sub: "Wide-body programs" },
    ],
  },
  {
    id: "land",
    layer: "Lithosphere",
    altitude: "GROUND LEVEL  //  AVIRATA DOMAIN",
    heading: "Where it matters most.",
    body: "The world darkens to terrain. A battle tank. A missile launcher. A defence electronics system. The same thread of precision runs through all of it — AVIRATA's domain, built for the toughest conditions on earth.",
    quote: "When the mission is critical, there is no margin for error.",
    proof: [
      { name: "Armoured systems", sub: "Battle platforms" },
      { name: "Missile launchers", sub: "Guided systems" },
      { name: "Defence electronics", sub: "Sub-systems" },
    ],
  },
  {
    id: "sea",
    layer: "Hydrosphere",
    altitude: "SUBMARINE DEPTH  //  PRESSURISED",
    heading: "In the deepest silence.",
    body: "The ground gives way to ocean. A submarine moves through the blue-black depth, lit only by the faint glow of its own systems. Fibre-optic cables shimmer alongside the familiar wiring thread.",
    quote: "In the deepest silence, our systems still speak.",
    proof: [
      { name: "Naval EWIS", sub: "Pressurised reliability" },
      { name: "Optical fibre", sub: "Glodesi connectivity" },
    ],
  },
];

export const MILESTONES = [
  { year: "2007", title: "Incorporated in Bangalore", body: "Founded by precision-engineering and interconnection experts to revolutionise India's Aerospace & Defence supply chain." },
  { year: "2010", title: "Tier-1 aerospace partnerships", body: "First long-term programs with global primes — Boeing & Lockheed Martin among them." },
  { year: "2014", title: "61% CAGR, first decade", body: "Rapid growth into a 150,000 sq ft facility delivering 150+ programs a year." },
  { year: "2017", title: "Deutsche Aircraft — D328eco", body: "Selected for high-reliability interconnection on next-generation regional aircraft." },
  { year: "2019", title: "AVIRATA Defence Systems", body: "A dedicated land & defence-electronics entity is born." },
  { year: "2021", title: "An international network", body: "Operations span India, the UK, the US, Netherlands & Morocco." },
  { year: "2024", title: "One SASMOS Group", body: "Glodesi, FESIL, LiDER & Westwire unify under one platform." },
];

export const PEOPLE = [
  {
    name: "The Founders",
    role: "Vision & Strategy",
    expertise: "Experts in precision engineering & interconnection technology",
    tenure: "Since 2007",
    quote: "We build for environments that do not forgive error.",
  },
  {
    name: "The Engineers",
    role: "EWIS & Electromechanical",
    expertise: "High-reliability assemblies",
    tenure: "20+ years combined craft",
    quote: "Precision is not a feature. It is the product.",
  },
  {
    name: "The Operators",
    role: "Global Manufacturing",
    expertise: "Scale across five countries",
    tenure: "Always on",
    quote: "Localized agility, backed by massive scale.",
  },
];

export const ENTITIES = [
  "AVIRATA Defence Systems",
  "FESIL Aerospace",
  "LiDER Technologies",
  "Glodesi",
  "Westwire",
];

export const LOCATIONS = [
  "India",
  "United Kingdom",
  "United States",
  "Netherlands",
  "Morocco",
];

export const NAV_LINKS = [
  { label: "Space", href: "#space" },
  { label: "Sky", href: "#sky" },
  { label: "Land", href: "#land" },
  { label: "Sea", href: "#sea" },
  { label: "History", href: "#history" },
  { label: "People", href: "#people" },
];
