"use client";

import { Float, Stars } from "@react-three/drei";
import FadeGroup from "../FadeGroup";
import Earth from "../models/Earth";
import Satellite from "../models/Satellite";
import { motionState } from "@/lib/motion";
import type { SceneId } from "@/lib/scenes";

/** Space chapter: textured Earth, a drifting satellite, deep starfield.
 *  Reused for the closing "return to orbit" with id="returnSpace" (Earth pulled
 *  further back so it reads as a different, calmer vantage). */
export default function SpaceScene({
  id = "space",
  earthScale = 1,
}: {
  id?: SceneId;
  earthScale?: number;
}) {
  const distant = id === "returnSpace";
  const sat = (
    <Satellite
      position={distant ? [2.6, 1.2, 0.4] : [2.1, 0.9, 1.3]}
      scale={distant ? 0.6 : 0.85}
    />
  );

  return (
    <FadeGroup id={id}>
      <Stars
        radius={90}
        depth={50}
        count={distant ? 3500 : 2600}
        factor={4}
        saturation={0}
        fade
        speed={motionState.reduced ? 0 : 0.4}
      />
      <hemisphereLight args={["#26304a", "#02030a", 0.3]} />
      <directionalLight position={[6, 3, 4]} intensity={2.4} color="#ffffff" />

      <group
        position={distant ? [1.4, 0.2, -6] : [-1.7, -0.7, -1.4]}
        scale={(distant ? 1.1 : 1.7) * earthScale}
      >
        <Earth />
      </group>

      {motionState.reduced ? (
        sat
      ) : (
        <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.8}>
          {sat}
        </Float>
      )}
    </FadeGroup>
  );
}
