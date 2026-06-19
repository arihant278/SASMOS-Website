"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { motionState } from "@/lib/motion";

const ATMO_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  void main() {
    float f = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(uColor, f * 0.9);
  }
`;

export default function Earth({ radius = 1.45 }: { radius?: number }) {
  const map = useTexture("/textures/earth_bluemarble.jpg");
  const earthRef = useRef<THREE.Mesh>(null);

  // sRGB so continents/oceans read true-color
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const atmoUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color("#6fc4ff") } }),
    [],
  );

  useFrame((_, delta) => {
    if (!motionState.reduced && earthRef.current) earthRef.current.rotation.y += delta * 0.035;
  });

  return (
    <group rotation={[0.35, 0, 0.15]}>
      {/* planet */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={map}
          emissiveMap={map}
          emissive={new THREE.Color("#13243f")}
          emissiveIntensity={0.18}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* atmosphere halo */}
      <mesh scale={1.045}>
        <sphereGeometry args={[radius, 48, 48]} />
        <shaderMaterial
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
          uniforms={atmoUniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
