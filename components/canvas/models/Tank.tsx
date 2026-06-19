"use client";

import * as THREE from "three";

/** Main battle tank, gun pointing +X. Pure geometry; the LandScene places it
 *  on the ground and supplies lighting. Olive armour with darker running gear. */
export default function Tank(props: React.ComponentProps<"group">) {
  const armour = (
    <meshStandardMaterial color="#3a4230" metalness={0.35} roughness={0.7} />
  );
  const dark = (
    <meshStandardMaterial color="#16181b" metalness={0.4} roughness={0.6} />
  );

  const wheels = [-0.85, -0.45, -0.05, 0.35, 0.75];

  return (
    <group {...props}>
      {/* lower hull */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[2.3, 0.42, 1.25]} />
        {armour}
      </mesh>
      {/* sloped glacis (upper hull) */}
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[2.05, 0.28, 1.05]} />
        {armour}
      </mesh>

      {/* turret */}
      <mesh position={[-0.15, 0.92, 0]}>
        <boxGeometry args={[1.15, 0.4, 0.95]} />
        {armour}
      </mesh>
      {/* mantlet */}
      <mesh position={[0.45, 0.92, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.3, 12]} />
        {armour}
      </mesh>
      {/* main gun barrel */}
      <mesh position={[1.35, 0.92, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.07, 1.7, 14]} />
        {dark}
      </mesh>
      {/* muzzle */}
      <mesh position={[2.18, 0.92, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.18, 14]} />
        {dark}
      </mesh>
      {/* commander cupola */}
      <mesh position={[-0.5, 1.18, 0.2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.16, 14]} />
        {armour}
      </mesh>

      {/* tracks + road wheels */}
      {[1, -1].map((s) => (
        <group key={s} position={[0, 0.22, s * 0.62]}>
          <mesh>
            <boxGeometry args={[2.4, 0.34, 0.26]} />
            {dark}
          </mesh>
          {wheels.map((x, i) => (
            <mesh key={i} position={[x, -0.04, s * 0.02]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.17, 0.17, 0.12, 14]} />
              <meshStandardMaterial color="#24262a" metalness={0.4} roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
