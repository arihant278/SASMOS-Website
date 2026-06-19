"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import FadeGroup from "../FadeGroup";
import Submarine from "../models/Submarine";
import ParticleField from "../ParticleField";
import { scrollState } from "@/lib/scroll";
import { sceneLocal } from "@/lib/scenes";
import { motionState } from "@/lib/motion";

/** Sea chapter: a submarine cruising through deep water, volumetric light
 *  shafts from the surface, and rising plankton/bubbles. */
export default function SeaScene() {
  const sub = useRef<THREE.Group>(null);
  const shafts = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const lp = sceneLocal("sea", scrollState.progress);
    if (sub.current) {
      sub.current.position.x = THREE.MathUtils.lerp(-6.5, 6.5, lp);
      sub.current.position.y = 0.2 + Math.sin(lp * Math.PI * 1.1) * 0.45;
      sub.current.rotation.z = Math.sin(lp * Math.PI) * 0.05;
    }
    if (!motionState.reduced && shafts.current) shafts.current.rotation.y += delta * 0.03;
  });

  return (
    <FadeGroup id="sea">
      <ambientLight intensity={0.25} color="#2aa0b8" />
      <directionalLight position={[2, 8, 2]} intensity={1.3} color="#7fe0e8" />
      <directionalLight position={[-5, 2, -3]} intensity={0.4} color="#2f6fae" />

      {/* volumetric light shafts from the surface */}
      <group ref={shafts}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh
            key={i}
            position={[-4 + i * 2, 5, -3 - (i % 2)]}
            rotation={[0, 0, (i - 2) * 0.05]}
          >
            <coneGeometry args={[1.5, 13, 18, 1, true]} />
            <meshBasicMaterial
              color="#4fe6d6"
              transparent
              opacity={0.045}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* plankton / bubbles rising */}
      <ParticleField
        count={420}
        color="#9ff0e6"
        size={0.045}
        opacity={0.5}
        area={[24, 12, 14]}
        center={[0, 0, -2]}
        speed={motionState.reduced ? 0 : 0.45}
        direction="up"
      />

      <group ref={sub}>
        <Submarine scale={0.8} />
      </group>
    </FadeGroup>
  );
}
