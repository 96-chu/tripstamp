import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

type Props = {
  radius: number;
  textureUrl: string;
  opacity?: number;
  extraRotationSpeed?: number;
  isPaused?: boolean;
};

export function CloudsLayer({
  radius,
  textureUrl,
  opacity = 0.35,
  extraRotationSpeed = 0.035,
  isPaused = false
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, textureUrl);

  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(radius * 1.015, 64, 64);
  }, [radius]);

  const material = useMemo(() => {
    // Additive blending keeps the base globe vivid and makes clouds feel lighter.
    return new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      premultipliedAlpha: true,
      side: THREE.DoubleSide,
      alphaTest: 0.25,
    });
  }, [texture, opacity]);

  useEffect(() => {
    texture.anisotropy = 8;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((_, delta) => {
    // Add a subtle relative drift so clouds feel alive.
    if (isPaused) return;
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * extraRotationSpeed;
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} renderOrder={10} />;
}