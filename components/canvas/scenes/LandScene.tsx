"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FadeGroup from "../FadeGroup";
import Tank from "../models/Tank";
import ParticleField from "../ParticleField";
import { scrollState } from "@/lib/scroll";
import { sceneLocal } from "@/lib/scenes";
import { motionState } from "@/lib/motion";

/** Land chapter (AVIRATA domain): a battle tank advancing across dark terrain
 *  under a warm key light with drifting dust. */
export default function LandScene() {
  const tank = useRef<THREE.Group>(null);

  useFrame(() => {
    const lp = sceneLocal("land", scrollState.progress);
    if (tank.current) {
      tank.current.position.x = THREE.MathUtils.lerp(-2.6, 1.8, lp);
      tank.current.rotation.y = -0.6 + lp * 0.35;
    }
  });

  return (
    <FadeGroup id="land">
      <hemisphereLight args={["#4a3a26", "#0a0805", 0.55]} />
      {/* warm key (low sun) */}
      <directionalLight position={[-6, 4, 3]} intensity={1.9} color="#ffae5c" />
      {/* cool fill */}
      <directionalLight position={[6, 3, -4]} intensity={0.5} color="#5e7fb0" />

      {/* terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#241a10" roughness={1} metalness={0} />
      </mesh>

      {/* dust / embers */}
      <ParticleField
        count={320}
        color="#ffb877"
        size={0.05}
        opacity={0.4}
        area={[26, 9, 14]}
        center={[0, -0.2, -2]}
        speed={motionState.reduced ? 0 : 0.5}
      />

      <group ref={tank} position={[0, -0.82, 0]}>
        <Tank scale={0.7} />
      </group>
    </FadeGroup>
  );
}
