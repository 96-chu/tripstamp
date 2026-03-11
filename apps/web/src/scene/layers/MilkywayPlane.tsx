import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import type { Mesh } from 'three'
import {
  DoubleSide,
  MeshBasicMaterial,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
  Vector3,
} from 'three'

type Props = {
  textureUrl: string
  distance?: number
  driftSpeed?: number
  scale?: number
  spinSpeed?: number
}

export function MilkywayPlane({
  textureUrl,
  distance = 10,
  driftSpeed = 0.002,
  scale = 1.25,
  spinSpeed = 0.06,
}: Props) {
  const meshRef = useRef<Mesh>(null)
  const { camera } = useThree()
  const texture = useLoader(TextureLoader, textureUrl)

  const geometry = useMemo(() => {
    // Use a unit plane; we will scale it based on camera FOV.
    return new PlaneGeometry(2, 2, 1, 1)
  }, [])

  const material = useMemo(() => {
    // Depth write off so background never occludes the globe.
    return new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      depthWrite: false,
      transparent: false,
    })
  }, [texture])

  useEffect(() => {
    // Enable UV scrolling.
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Keep the plane locked to the camera.
    meshRef.current.position.copy(camera.position)
    meshRef.current.quaternion.copy(camera.quaternion)

    // Move the plane in front of the camera.
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    meshRef.current.position.addScaledVector(forward, distance)

    // Scale the plane to fully cover the viewport.
    const fov = (camera as any).fov ?? 45
    const height = 2 * Math.tan((fov * Math.PI) / 360) * distance
    const width = height * ((camera as any).aspect ?? 1)
    meshRef.current.scale.set(width * scale, height * scale, 1)

    // Drift the UVs for a subtle moving starfield.
    texture.offset.x += delta * driftSpeed
    texture.offset.y -= delta * driftSpeed * 0.35

    // Spin clockwise around the view axis.
    meshRef.current.rotation.z -= delta * spinSpeed
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} frustumCulled={false} renderOrder={-1000} />
}