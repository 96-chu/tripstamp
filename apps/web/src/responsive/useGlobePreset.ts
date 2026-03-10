import { useMemo } from 'react';
import { useViewport } from './useViewport';
import { getGlobePreset } from './presets';
import { getCameraZForSphereFit } from './globeFit';

export function useGlobePreset() {
  const vp = useViewport();

  return useMemo(() => {
    const preset = getGlobePreset(vp.width, vp.height, vp.isTouch);

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

    return {
      ...preset,
      cameraZ,
      minDistance: cameraZ,
      maxDistance: cameraZ,
    };
  }, [vp.width, vp.height, vp.isTouch]);
}