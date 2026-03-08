import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  radius?: number;
  chancePerSecond?: number;
};

export function ShootingStars({ radius = 850, chancePerSecond = 0.08 }: Props) {
  const lineRef = useRef<THREE.Line>(null);
  const stateRef = useRef({
    active: false,
    t: 0,
    duration: 0.8,
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
  });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(6);
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
  }, []);

  function spawn() {
    // Generate a short segment on a sphere shell.
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.7 + Math.PI * 0.15;

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    const dir = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.2, Math.random() - 0.5).normalize();
    const len = 60 + Math.random() * 80;

    stateRef.current.a.set(x, y, z);
    stateRef.current.b.copy(stateRef.current.a).addScaledVector(dir, len);
    stateRef.current.t = 0;
    stateRef.current.duration = 0.5 + Math.random() * 0.6;
    stateRef.current.active = true;

    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.setXYZ(0, stateRef.current.a.x, stateRef.current.a.y, stateRef.current.a.z);
    attr.setXYZ(1, stateRef.current.b.x, stateRef.current.b.y, stateRef.current.b.z);
    attr.needsUpdate = true;
  }

  useFrame((_, delta) => {
    if (!lineRef.current) return;

    const st = stateRef.current;

    // Spawn occasionally based on chance per second.
    if (!st.active && Math.random() < chancePerSecond * delta) spawn();

    if (!st.active) return;

    st.t += delta;
    const p = Math.min(st.t / st.duration, 1);

    // Fade in quickly then fade out.
    const fade = p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8;
    (lineRef.current.material as THREE.LineBasicMaterial).opacity = Math.max(0, Math.min(1, fade));

    if (p >= 1) {
      st.active = false;
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = 0;
    }
  });

  return <line ref={lineRef} geometry={geometry} material={material} />;
}