"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { sampleRamp } from "@/lib/palette";
import GradientBackdrop from "./GradientBackdrop";
import SpaceScene from "./scenes/SpaceScene";
import SkyScene from "./scenes/SkyScene";
import LandScene from "./scenes/LandScene";
import SeaScene from "./scenes/SeaScene";

/** Camera + fog. Discrete scenes are centered near the origin, so the camera
 *  stays put and only does gentle parallax + a slight per-scroll breathing
 *  dolly. Fog (color tracks the palette) adds depth; the backdrop ignores it. */
function Rig({ reduced }: { reduced: boolean }) {
  const { camera, scene } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const fogColor = useRef(new THREE.Color("#04060f"));

  scene.fog = scene.fog ?? new THREE.FogExp2("#04060f", 0.018);

  useFrame(() => {
    const p = scrollState.progress;
    const { bg } = sampleRamp(p);
    fogColor.current.set(bg);
    if (scene.fog) (scene.fog as THREE.FogExp2).color.copy(fogColor.current);

    // subtle breathing dolly across the journey
    const targetZ = 7.8 - Math.sin(p * Math.PI) * 0.6;

    if (!reduced) {
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.current.x * 0.5, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.5 - pointer.current.y * 0.35, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.04);
      camera.lookAt(0, 0.2, 0);
    } else {
      camera.position.set(0, 0.5, 7.8);
      camera.lookAt(0, 0.2, 0);
    }
  });

  if (typeof window !== "undefined" && !reduced) {
    window.onpointermove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
  }

  return null;
}

export default function Scene({
  reduced = false,
  dpr = [1, 1.75] as [number, number],
}: {
  reduced?: boolean;
  dpr?: [number, number];
  particles?: number;
}) {
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.5, 7.8], fov: 50, near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      frameloop="always"
    >
      <Rig reduced={reduced} />
      <GradientBackdrop />
      <ambientLight intensity={0.18} />
      <Suspense fallback={null}>
        <SpaceScene id="space" />
        <SkyScene />
        <LandScene />
        <SeaScene />
        <SpaceScene id="returnSpace" />
      </Suspense>
    </Canvas>
  );
}
