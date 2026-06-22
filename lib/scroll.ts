// Lightweight global scroll store shared by DOM (React) and WebGL (useFrame).
// - The canvas reads `state.progress` every frame (no React re-render).
// - React UI subscribes via useScrollStore() for reactive values.

import { useSyncExternalStore } from "react";
import { type SphereId } from "./palette";

type State = {
  progress: number; // 0..1 across the whole page (WebGL layer reads this)
  journeyProgress: number; // 0..1 within the cinematic film (depth-meter fill)
  sphere: SphereId; // active chapter — owned by <CinematicJourney>
  journeyActive: boolean; // true while the film is on screen & driving the palette
};

export const scrollState: State = {
  progress: 0,
  journeyProgress: 0,
  sphere: "space",
  journeyActive: false,
};

const listeners = new Set<() => void>();

export function setProgress(p: number) {
  const clamped = Math.min(1, Math.max(0, p));
  if (clamped === scrollState.progress) return;
  scrollState.progress = clamped;
}

/** Set by the film as it scrubs; notifies React subscribers on chapter change. */
export function setSphere(sphere: SphereId) {
  if (sphere === scrollState.sphere) return;
  scrollState.sphere = sphere;
  listeners.forEach((l) => l());
}

/** The film claims/releases palette control and reports its internal progress. */
export function setJourney(active: boolean, journeyProgress?: number) {
  scrollState.journeyActive = active;
  if (typeof journeyProgress === "number") {
    scrollState.journeyProgress = Math.min(1, Math.max(0, journeyProgress));
  }
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
