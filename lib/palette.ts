// Single source of truth for the journey palette ramp.
// Both the DOM (CSS vars) and the WebGL canvas (THREE.Color) sample from this.

export type Stop = { at: number; bg: string; glow: string; sphere: SphereId };
export type SphereId = "space" | "sky" | "land" | "sea";

// Keyframes across the full page scroll [0..1].
export const RAMP: Stop[] = [
  { at: 0.0, bg: "#04060f", glow: "#8fe6ff", sphere: "space" }, // Exosphere
  { at: 0.17, bg: "#1f4f86", glow: "#cfe6ff", sphere: "sky" }, // Atmosphere (high-altitude azure)
  { at: 0.34, bg: "#0d0a07", glow: "#ff8a3c", sphere: "land" }, // Lithosphere
  { at: 0.5, bg: "#02070f", glow: "#2ff0cf", sphere: "sea" }, // Hydrosphere
  { at: 0.66, bg: "#060814", glow: "#6fb6ff", sphere: "sea" }, // history (deep)
  { at: 0.84, bg: "#080a16", glow: "#9fd0ff", sphere: "space" }, // people
  { at: 1.0, bg: "#04060f", glow: "#8fe6ff", sphere: "space" }, // return to orbit
];

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function rgbToHex(r: number, g: number, b: number) {
  const c = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
export function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return rgbToHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t));
}

// Per-chapter palette, used by <CinematicJourney> to drive --bg/--glow and the
// depth meter directly from the film's own progress (chapter-exact, immune to
// page-layout changes). Glows are chosen to read on the lower-third scrim.
export const CHAPTER_PALETTE: Record<SphereId, { bg: string; glow: string }> = {
  space: { bg: "#04060f", glow: "#8fe6ff" },
  sky: { bg: "#0a1626", glow: "#7cc4ff" },
  land: { bg: "#0d0a07", glow: "#ff8a3c" },
  sea: { bg: "#02070f", glow: "#2ff0cf" },
};
// what the sea chapter cross-fades toward as the film ends (history/tail)
export const POST_JOURNEY = { bg: "#060814", glow: "#6fb6ff" };

export function sampleRamp(p: number): { bg: string; glow: string; sphere: SphereId } {
  const x = Math.min(1, Math.max(0, p));
  for (let i = 0; i < RAMP.length - 1; i++) {
    const a = RAMP[i];
    const b = RAMP[i + 1];
    if (x >= a.at && x <= b.at) {
      const t = (x - a.at) / (b.at - a.at || 1);
      // pick the nearer sphere id for labels
      const sphere = t < 0.5 ? a.sphere : b.sphere;
      return { bg: mix(a.bg, b.bg, t), glow: mix(a.glow, b.glow, t), sphere };
    }
  }
  const last = RAMP[RAMP.length - 1];
  return { bg: last.bg, glow: last.glow, sphere: last.sphere };
}

// Sphere anchor positions used for the journey progress meter.
export const SPHERE_ANCHORS: { id: SphereId; at: number; label: string }[] = [
  { id: "space", at: 0.0, label: "Space" },
  { id: "sky", at: 0.17, label: "Sky" },
  { id: "land", at: 0.34, label: "Land" },
  { id: "sea", at: 0.5, label: "Sea" },
];
