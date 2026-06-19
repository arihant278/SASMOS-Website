"use client";

import * as THREE from "three";

/** Twin-engine wide-body airliner (787-like) silhouette, nose pointing +X.
 *  Pure geometry — the SkyScene handles the banking + cross-frame travel. */
export default function Aircraft(props: React.ComponentProps<"group">) {
  const body = (
    <meshStandardMaterial color="#eef2f8" metalness={0.45} roughness={0.4} />
  );

  return (
    <group {...props}>
      {/* fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.34, 3.0, 12, 24]} />
        {body}
      </mesh>
      {/* nose cone */}
      <mesh position={[1.85, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.34, 0.6, 24]} />
        {body}
      </mesh>
      {/* tail cone */}
      <mesh position={[-1.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.34, 0.7, 24]} />
        {body}
      </mesh>

      {/* main wings — swept back */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[-0.1, -0.05, s * 1.15]}
          rotation={[0, s * -0.32, 0]}
        >
          <boxGeometry args={[1.0, 0.07, 2.3]} />
          <meshStandardMaterial color="#dfe5ee" metalness={0.4} roughness={0.45} />
        </mesh>
      ))}

      {/* engine nacelles under wings */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[0.1, -0.32, s * 1.05]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.17, 0.15, 0.6, 18]} />
          <meshStandardMaterial color="#aeb6c2" metalness={0.6} roughness={0.35} />
        </mesh>
      ))}

      {/* horizontal stabilizers */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[-1.5, 0.05, s * 0.6]}
          rotation={[0, s * -0.4, 0]}
        >
          <boxGeometry args={[0.5, 0.05, 1.0]} />
          <meshStandardMaterial color="#dfe5ee" metalness={0.4} roughness={0.45} />
        </mesh>
      ))}

      {/* vertical tail fin */}
      <mesh position={[-1.55, 0.42, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.5, 0.85, 0.06]} />
        <meshStandardMaterial color="#c9d2df" metalness={0.4} roughness={0.45} />
      </mesh>

      {/* accent cheatline */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.345, 0.345, 2.4, 24, 1, true]} />
        <meshStandardMaterial
          color="#1f5fae"
          metalness={0.5}
          roughness={0.4}
          side={THREE.DoubleSide}
          transparent
          opacity={0.18}
        />
      </mesh>
    </group>
  );
}
