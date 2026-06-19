"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionState } from "@/lib/motion";

/** A communications satellite: foil-wrapped bus, twin solar arrays, dish + antennae.
 *  Pure geometry; the scene positions/floats it. Lights come from the scene. */
export default function Satellite(props: React.ComponentProps<"group">) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!motionState.reduced && ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <group ref={ref} {...props}>
      {/* main bus */}
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.5, 0.66]} />
        <meshStandardMaterial color="#d8c79a" metalness={0.85} roughness={0.32} />
      </mesh>
      {/* gold foil base */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[0.5, 0.08, 0.7]} />
        <meshStandardMaterial color="#caa256" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* solar array arms + panels */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.35, 0, 0]}>
          <mesh position={[s * 0.45, 0, 0]}>
            <boxGeometry args={[0.9, 0.03, 0.03]} />
            <meshStandardMaterial color="#8a8f99" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[s * 1.25, 0, 0]}>
            <boxGeometry args={[1.5, 0.02, 0.62]} />
            <meshStandardMaterial
              color="#1b3a78"
              emissive="#0a1f4d"
              emissiveIntensity={0.5}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
        </group>
      ))}

      {/* communications dish */}
      <group position={[0, 0.18, 0.42]} rotation={[0.5, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
          <meshStandardMaterial color="#e6e9ef" metalness={0.4} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.24, 8]} />
          <meshStandardMaterial color="#9aa0ab" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* antenna */}
      <mesh position={[0, 0.45, -0.1]}>
        <cylinderGeometry args={[0.008, 0.008, 0.5, 6]} />
        <meshStandardMaterial color="#aab0bb" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
