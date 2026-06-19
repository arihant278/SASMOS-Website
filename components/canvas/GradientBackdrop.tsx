"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { sceneWeights, type SceneId } from "@/lib/scenes";

// Vertical top/bottom colors per chapter. One dome surrounds the camera; its
// colors are the weighted blend of the active scenes, so the sky/space/water
// cross-fades exactly in step with the models.
const BACKDROP: Record<SceneId, { top: string; bottom: string }> = {
  space: { top: "#01030a", bottom: "#070b1a" },
  sky: { top: "#0b2c5e", bottom: "#7cb1de" }, // azure up high → pale near horizon
  land: { top: "#15110b", bottom: "#3c2a16" }, // dark sky → dusty amber horizon
  sea: { top: "#0a5e74", bottom: "#01101f" }, // lit surface above → dark depth below
  returnSpace: { top: "#01030a", bottom: "#070b1a" },
};

const VERT = /* glsl */ `
  varying float vY;
  void main() {
    vY = normalize(position).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  varying float vY;
  uniform vec3 uTop;
  uniform vec3 uBottom;
  void main() {
    float t = smoothstep(-0.55, 0.55, vY);
    gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
  }
`;

export default function GradientBackdrop() {
  const { camera } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const top = useMemo(() => new THREE.Color("#01030a"), []);
  const bottom = useMemo(() => new THREE.Color("#070b1a"), []);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#01030a") },
      uBottom: { value: new THREE.Color("#070b1a") },
    }),
    [],
  );

  useFrame(() => {
    const p = scrollState.progress;
    const w = sceneWeights(p);
    let total = 0;
    let tr = 0,
      tg = 0,
      tb = 0;
    let br = 0,
      bg = 0,
      bb = 0;
    (Object.keys(w) as SceneId[]).forEach((id) => {
      const weight = w[id];
      if (weight <= 0) return;
      total += weight;
      top.set(BACKDROP[id].top);
      bottom.set(BACKDROP[id].bottom);
      tr += top.r * weight;
      tg += top.g * weight;
      tb += top.b * weight;
      br += bottom.r * weight;
      bg += bottom.g * weight;
      bb += bottom.b * weight;
    });
    if (total > 0) {
      uniforms.uTop.value.setRGB(tr / total, tg / total, tb / total);
      uniforms.uBottom.value.setRGB(br / total, bg / total, bb / total);
    }
    // keep the dome centered on the camera
    if (meshRef.current) meshRef.current.position.copy(camera.position);
  });

  return (
    <mesh ref={meshRef} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[60, 32, 32]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
