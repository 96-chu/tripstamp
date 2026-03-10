export type GlobePreset = {
  fov: number;
  minDistance: number;
  maxDistance: number;
  dpr: [number, number];
  targetHeightRatio: number;
  minTargetPx: number;
  worldScale: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getGlobePreset(
  width: number,
  height: number,
  isTouch: boolean
): GlobePreset {
  const shortSide = Math.min(width, height);
  const aspect = width / Math.max(height, 1);

  // Continuous scale:
  // - narrower screen => smaller globe
  // - wider desktop => larger globe
  // Keep range controlled to avoid sudden jumps.
  const widthScale = clamp(width / 1440, 0.72, 1.08);
  const aspectScale = clamp(aspect / 1.6, 0.9, 1.08);
  const worldScale = clamp(widthScale * aspectScale, 0.72, 1.08);

  if (shortSide < 420) {
    return {
      fov: 48,
      minDistance: 150,
      maxDistance: 240,
      dpr: isTouch ? [1, 1.1] : [1, 1.3],
      targetHeightRatio: 0.56,
      minTargetPx: 260,
      worldScale,
    };
  }

  if (shortSide < 768) {
    return {
      fov: 45,
      minDistance: 145,
      maxDistance: 260,
      dpr: isTouch ? [1, 1.2] : [1, 1.5],
      targetHeightRatio: 0.54,
      minTargetPx: 300,
      worldScale,
    };
  }

  return {
    fov: 42,
    minDistance: 140,
    maxDistance: 320,
    dpr: [1, 1.7],
    targetHeightRatio: 0.52,
    minTargetPx: 320,
    worldScale,
  };
}