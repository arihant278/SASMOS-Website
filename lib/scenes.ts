// Scene cross-fade windows for the discrete 3D chapters.
// Each scene fades in over [in0,in1], holds, then fades out over [out0,out1].
// Windows overlap on purpose so adjacent scenes cross-fade. The canvas reads
// scrollState.progress every frame and asks for each scene's weight (0..1).

export type SceneId = "space" | "sky" | "land" | "sea" | "returnSpace";

type Win = { id: SceneId; in0: number; in1: number; out0: number; out1: number };

// Coverage is continuous from 0 → 1 with no blank gaps.
export const SCENE_WINDOWS: Win[] = [
  { id: "space", in0: 0.0, in1: 0.0, out0: 0.12, out1: 0.2 },
  { id: "sky", in0: 0.13, in1: 0.2, out0: 0.32, out1: 0.4 },
  { id: "land", in0: 0.3, in1: 0.38, out0: 0.46, out1: 0.54 },
  { id: "sea", in0: 0.46, in1: 0.54, out0: 0.72, out1: 0.8 },
  { id: "returnSpace", in0: 0.78, in1: 0.88, out0: 1.0, out1: 1.0 },
];

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function smoothstep(a: number, b: number, x: number) {
  if (b <= a) return x >= b ? 1 : 0;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

export function sceneWeight(w: Win, p: number) {
  if (p <= w.in0 && w.in1 <= w.in0) {
    // hard-on at start (space)
  } else if (p < w.in0 || p > w.out1) {
    return 0;
  }
  const rise = smoothstep(w.in0, w.in1, p);
  const fall = 1 - smoothstep(w.out0, w.out1, p);
  return clamp01(Math.min(rise, fall));
}

export function sceneWeights(p: number): Record<SceneId, number> {
  const out = {} as Record<SceneId, number>;
  for (const w of SCENE_WINDOWS) out[w.id] = sceneWeight(w, p);
  return out;
}

// Local progress within a scene's active span [in0,out1], 0..1 — used for
// per-scene camera moves / model travel.
export function sceneLocal(id: SceneId, p: number): number {
  const w = SCENE_WINDOWS.find((s) => s.id === id);
  if (!w) return 0;
  return clamp01((p - w.in0) / (w.out1 - w.in0 || 1));
}
