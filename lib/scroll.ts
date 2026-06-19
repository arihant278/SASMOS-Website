// Lightweight global scroll store shared by DOM (React) and WebGL (useFrame).
// - The canvas reads `state.progress` every frame (no React re-render).
// - React UI subscribes via useScrollStore() for reactive values.

import { useSyncExternalStore } from "react";
import { sampleRamp, type SphereId } from "./palette";

type State = {
  progress: number; // 0..1 across the whole page
  sphere: SphereId;
};

export const scrollState: State = { progress: 0, sphere: "space" };

const listeners = new Set<() => void>();

export function setProgress(p: number) {
  const clamped = Math.min(1, Math.max(0, p));
  if (clamped === scrollState.progress) return;
  scrollState.progress = clamped;
  const { sphere } = sampleRamp(clamped);
  const sphereChanged = sphere !== scrollState.sphere;
  scrollState.sphere = sphere;
  // Only notify React subscribers when the discrete sphere changes,
  // to avoid re-rendering UI on every scroll frame.
  if (sphereChanged) listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useActiveSphere(): SphereId {
  return useSyncExternalStore(
    subscribe,
    () => scrollState.sphere,
    () => "space" as SphereId,
  );
}
