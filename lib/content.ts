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
  line1: "The connections that hold,",
  line2: "from space to sea.",
  tagline:
    "We build the wiring, connectors, and precision assemblies inside the world's most demanding machines — across Defence, Aerospace, Space and Marine.",
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
    body: "The ground gives way to ocean. A submarine moves through the blue-black depth, lit only by the faint glow of its own systems. Fibre-optic cables and pressurised wiring run through the hull — the same precision, now built to hold against the deep.",
    quote: "In the deepest silence, our systems still speak.",
    proof: [
      { name: "Naval EWIS", sub: "Pressurised reliability" },
      { name: "Optical fibre", sub: "Glodesi connectivity" },
    ],
  },
];

export const MILESTONES = [
  { year: "2007 - 2009", title: "Inception & Certification", body: "Incorporated with a vision to lead global A&D. Secured AS9100 certification and obtained an industrial license from DIPP." },
  { year: "2010 - 2012", title: "Early Expansion", body: "Crossed $1M in revenue. Expanded into missile platforms, added European customers, and set up a 10,000 sq ft UAM cleanroom." },
  { year: "2013 - 2015", title: "Space & Commercial Growth", body: "Awarded best supplier for a global space program. Entered commercial aircraft wiring with Fokker Aero and crossed $10M in revenue." },
  { year: "2016 - 2018", title: "Scaling Operations", body: "Expanded production to 100,000 sq ft. Initiated digital transformation and established a UK sales office for global outreach." },
  { year: "2019 - 2020", title: "Diversification & $50M", body: "Set up AVIRATA Defence and SCTO Fiber Optic divisions. Crossed $50M in revenue and launched a Center of Excellence (CoE)." },
  { year: "2021 - 2022", title: "Acquisitions & New Plants", body: "Acquired UK-based Westwire and inaugurated the AVIRATA Pune Plant to further strengthen global delivery capabilities." },
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
  { label: "Capabilities", href: "#space" }, // Links into the cinematic journey
  { label: "Sectors", href: "#sky" },
  { label: "History", href: "#history" },
  { label: "Leadership", href: "#people" },
];
