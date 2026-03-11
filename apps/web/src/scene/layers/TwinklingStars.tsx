import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Props = {
  count?: number
  radius?: number
}

export function TwinklingStars({ count = 1200, radius = 900 }: Props) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute stars on a sphere shell.
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)

      const r = radius
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      pos[i * 3 + 0] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      ph[i] = Math.random() * Math.PI * 2
    }

    return { positions: pos, phases: ph }
  }, [count, radius])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  const material = useMemo(() => {
    // Keep it simple: size attenuation gives a nice depth feel.
    return new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.4,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    // Subtle twinkle by modulating global opacity.
    const t = clock.getElapsedTime()
    const o = 0.75 + 0.25 * Math.sin(t * 1.2);
    (pointsRef.current.material as THREE.PointsMaterial).opacity = o
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}