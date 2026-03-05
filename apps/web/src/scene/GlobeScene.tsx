import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import type { Group } from "three";
import R3fGlobe from 'r3f-globe';
import type { TripPin } from './data/samplePins';
import { pinPalette } from './data/palette';
import { CloudsLayer } from './layers/CloudsLayer';
import { useGlobePreset } from '../responsive/useGlobePreset';
// import { textures } from './textures';
import { getTextureUrls, type TextureUrls } from "./textures";

type Props = {
  pins: TripPin[];
  onPinSelect?: (pin: TripPin | null) => void;
};

function preloadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

function SceneContent({ pins, onPinSelect }: Props) {
  const preset = useGlobePreset();

  const globeRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const worldRef = useRef<Group>(null);

  const [activePin, setActivePin] = useState<TripPin | null>(null);
  const pointsData = useMemo(() => pins, [pins]);

  const tRef = useRef<number>(0);

  const [isInteracting, setIsInteracting] = useState(false);

  const [textureUrls, setTextureUrls] = useState<TextureUrls | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsReady(false);
        setLoadError("");

        const urls = await getTextureUrls();

        // Pre-download both images before showing the globe.
        await Promise.all([preloadImage(urls.earthDayUrl), preloadImage(urls.earthCloudsUrl)]);

        if (!alive) return;

        setTextureUrls(urls);
        setIsReady(true);
      } catch (e) {
        if (!alive) return;
        setLoadError(e instanceof Error ? e.message : "Failed to load textures.");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useFrame((_, delta) => {
    if (isInteracting) return;

    if (worldRef.current) {
      tRef.current += delta;
      worldRef.current.position.y = Math.sin(tRef.current * 0.6) * 1.2;
    }
  });

  function handleClick(layer: string, elementData: any) {
    if (layer !== "points" || !elementData) return;

    const pin = elementData as TripPin;
    setActivePin(pin);
    onPinSelect?.(pin);
  }

  const globeRadius = 100;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 1]} intensity={1.2} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={preset.minDistance}
        maxDistance={preset.maxDistance}
        autoRotate={!isInteracting}
        autoRotateSpeed={0.6}
        onStart={() => setIsInteracting(true)}
        onEnd={() => setIsInteracting(false)}
        onChange={() => {
          const cam = controlsRef.current?.object;
          globeRef.current?.setPointOfView?.(cam);
        }}
      />

      {!isReady && (
        <Html center>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(0,0,0,0.55)",
              color: "white",
              fontSize: 14,
              whiteSpace: "nowrap",
            }}
          >
            {loadError ? `Texture load failed: ${loadError}` : "Loading textures..."}
          </div>
        </Html>
      )}

      {isReady && textureUrls && (
        <group ref={worldRef} scale={preset.worldScale}>
          <R3fGlobe
            ref={globeRef}
            globeImageUrl={textureUrls.earthDayUrl}
            showAtmosphere={false}
            atmosphereAltitude={0}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.12}
            pointRadius={0.35}
            pointResolution={16}
            pointColor={(d: TripPin) => pinPalette[Math.abs(hashString(d.id)) % pinPalette.length]}
            ringsData={activePin ? [activePin] : []}
            ringLat="lat"
            ringLng="lng"
            ringColor={() => "rgba(255,255,255,0.85)"}
            ringMaxRadius={2.5}
            ringPropagationSpeed={2.0}
            ringRepeatPeriod={800}
            onClick={(layer: string, elementData: any) => handleClick(layer, elementData)}
          />

          <CloudsLayer
            radius={globeRadius}
            textureUrl={textureUrls.earthCloudsUrl}
            opacity={0.35}
            extraRotationSpeed={0.035}
            isPaused={isInteracting}
          />
        </group>
      )}
    </>
  );
}

export function GlobeScene(props: Props) {
  const preset = useGlobePreset();

  return (
    <Canvas
      camera={{ position: [0, 0, preset.cameraZ], fov: preset.fov }}
      dpr={preset.dpr}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}