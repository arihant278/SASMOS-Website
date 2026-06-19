"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Parametrized atmosphere layer reused per scene: drifting cloud motes (sky),
 * dust/embers (land), plankton/bubbles (sea). A fixed color + drift direction;
 * the enclosing FadeGroup handles overall opacity as the scene cross-fades.
 */
export default function ParticleField({
  count = 600,
  color = "#ffffff",
  size = 0.04,
  opacity = 0.5,
  area = [22, 16, 14] as [number, number, number],
  center = [0, 0, -2] as [number, number, number],
  speed = 0.6,
  direction = "down" as "down" | "up",
}: {
  count?: number;
  color?: string;
  size?: number;
  opacity?: number;
  area?: [number, number, number];
  center?: [number, number, number];
  speed?: number;
  direction?: "down" | "up";
}) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = center[0] + (Math.random() - 0.5) * area[0];
      arr[i * 3 + 1] = center[1] + (Math.random() - 0.5) * area[1];
      arr[i * 3 + 2] = center[2] + (Math.random() - 0.5) * area[2];
    }
    return arr;
  }, [count, area, center]);

  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.2 + Math.random() * 0.8;
    return arr;
  }, [count]);

  const halfY = area[1] / 2;
  const sign = direction === "down" ? -1 : 1;

  useFrame((_, delta) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const a = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      a[i * 3 + 1] += sign * speeds[i] * delta * speed;
      const rel = a[i * 3 + 1] - center[1];
      if (sign < 0 && rel < -halfY) a[i * 3 + 1] = center[1] + halfY;
      if (sign > 0 && rel > halfY) a[i * 3 + 1] = center[1] - halfY;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
