"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import FadeGroup from "../FadeGroup";
import Aircraft from "../models/Aircraft";
import ParticleField from "../ParticleField";
import { scrollState } from "@/lib/scroll";
import { sceneLocal } from "@/lib/scenes";
import { motionState } from "@/lib/motion";

/** Sky chapter: blue daytime sky, a high sun/star, drifting cloud motes, and a
 *  wide-body airliner banking as it crosses the frame (driven by scroll). */
export default function SkyScene() {
  const plane = useRef<THREE.Group>(null);

  useFrame(() => {
    const lp = sceneLocal("sky", scrollState.progress);
    if (plane.current) {
      plane.current.position.x = THREE.MathUtils.lerp(-7.5, 7.5, lp);
      plane.current.position.y = 0.7 + Math.sin(lp * Math.PI) * 0.7;
      plane.current.position.z = -1 - Math.sin(lp * Math.PI) * 1.5;
      plane.current.rotation.z = -0.14;
      plane.current.rotation.y = -0.18;
    }
  });

  return (
    <FadeGroup id="sky">
      <hemisphereLight args={["#bcdcff", "#2a4f7e", 1.2]} />
      <directionalLight position={[8, 6, 5]} intensity={2.6} color="#fff7e6" />

      {/* the sun / bright star high in the sky */}
      <mesh position={[5.5, 3.6, -9]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial color="#fffdf2" toneMapped={false} />
      </mesh>
      <Sparkles
        count={40}
        scale={[16, 9, 6]}
        size={5}
        speed={motionState.reduced ? 0 : 0.3}
        color="#ffffff"
        position={[0, 2.5, -4]}
      />

      {/* cloud motes */}
      <ParticleField
        count={500}
        color="#eaf2ff"
        size={0.13}
        opacity={0.5}
        area={[28, 11, 12]}
        center={[0, 1, -4]}
        speed={motionState.reduced ? 0 : 0.3}
      />

      <group ref={plane}>
        <Aircraft scale={0.85} />
      </group>
    </FadeGroup>
  );
}
