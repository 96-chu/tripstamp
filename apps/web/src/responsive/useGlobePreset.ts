import { useMemo } from 'react';
import { useViewport } from './useViewport';
import { getGlobePreset } from './presets';
import { getCameraZForSphereFit } from './globeFit';

export function useGlobePreset() {
  const vp = useViewport();

  return useMemo(() => {
    const preset = getGlobePreset(vp.shortSide, vp.isTouch);

    // Assume r3f-globe default sphere radius ~100 => diameter ~200 world units.
    const sphereDiameter = 200 * preset.worldScale;

    const cameraZ = getCameraZForSphereFit({
      viewportHeight: vp.height,
      fovDeg: preset.fov,
      sphereDiameter,
      targetHeightRatio: preset.targetHeightRatio,
      minTargetPx: preset.minTargetPx,
      minZ: vp.isTouch ? 160 : 140,
      maxZ: 420,
    });

    const minDistance = cameraZ * 0.7;
    const maxDistance = cameraZ * 1.9;

    return { ...preset, cameraZ, minDistance, maxDistance };
  }, [vp.height, vp.shortSide, vp.isTouch]);
}