// Module flag for prefers-reduced-motion, set once by Background before the
// canvas mounts. Models/scenes read it in useFrame to gate autonomous motion
// (idle spins, floats, drift, parallax) while keeping scroll-linked placement.
export const motionState = { reduced: false };
