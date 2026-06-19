"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motionState } from "@/lib/motion";

/** Nuclear submarine, bow pointing +X. Pure geometry apart from a spinning
 *  propeller. The SeaScene supplies lighting + light shafts. */
export default function Submarine(props: React.ComponentProps<"group">) {
  const prop = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!motionState.reduced && prop.current) prop.current.rotation.x += delta * 2.2;
  });

  const hull = (
    <meshStandardMaterial color="#1b2630" metalness={0.45} roughness={0.55} />
  );
  const trim = (
    <meshStandardMaterial color="#0f161d" metalness={0.5} roughness={0.5} />
  );

  return (
    <group {...props}>
      {/* main pressure hull */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.62, 3.2, 14, 28]} />
        {hull}
      </mesh>
      {/* tapered bow */}
      <mesh position={[2.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.62, 0.7, 28]} />
        {hull}
      </mesh>

      {/* sail / conning tower */}
      <mesh position={[0.35, 0.72, 0]}>
        <boxGeometry args={[0.85, 0.7, 0.34]} />
        {trim}
      </mesh>
      <mesh position={[0.35, 1.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.85, 18]} />
        {trim}
      </mesh>
      {/* sail planes */}
      {[1, -1].map((s) => (
        <mesh key={s} position={[0.35, 0.78, s * 0.4]}>
          <boxGeometry args={[0.5, 0.05, 0.55]} />
          {trim}
        </mesh>
      ))}

      {/* tail cruciform fins */}
      <mesh position={[-1.95, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.07]} />
        {trim}
      </mesh>
      <mesh position={[-1.95, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.07]} />
        {trim}
      </mesh>

      {/* propeller */}
      <group ref={prop} position={[-2.25, 0, 0]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[(i / 5) * Math.PI * 2, 0, 0]}>
            <boxGeometry args={[0.04, 0.42, 0.12]} />
            <meshStandardMaterial color="#caa256" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.12, 0.3, 14]} />
          {trim}
        </mesh>
      </group>
    </group>
  );
}
