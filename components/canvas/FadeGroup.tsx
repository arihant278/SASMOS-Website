"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll";
import { sceneWeights, type SceneId } from "@/lib/scenes";

type MatLike = THREE.Material & { opacity: number; transparent: boolean };

/** Wraps a scene's contents and cross-fades them in/out by reading the scene's
 *  scroll weight every frame. Preserves each material's authored opacity
 *  (multiplies it by the weight) and hides the group entirely when off-screen
 *  so it skips draw calls. */
export default function FadeGroup({
  id,
  children,
}: {
  id: SceneId;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const w = sceneWeights(scrollState.progress)[id];
    const visible = w > 0.004;
    g.visible = visible;
    if (!visible) return;

    g.traverse((obj) => {
      const mat = (obj as THREE.Mesh).material as MatLike | MatLike[] | undefined;
      if (!mat) return;
      const list = Array.isArray(mat) ? mat : [mat];
      for (const m of list) {
        if (m.userData.baseOpacity === undefined) {
          m.userData.baseOpacity = m.opacity;
        }
        m.transparent = true;
        m.opacity = (m.userData.baseOpacity as number) * w;
      }
    });
  });

  return (
    <group ref={ref} visible={false}>
      {children}
    </group>
  );
}
