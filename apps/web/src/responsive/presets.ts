export type GlobePreset = {
  fov: number;
  minDistance: number;
  maxDistance: number;
  dpr: [number, number];
  targetHeightRatio: number;
  minTargetPx: number;
  worldScale: number;
};

export function getGlobePreset(shortSide: number, isTouch: boolean): GlobePreset {
  if (shortSide < 420) {
    return {
      fov: 46,
      minDistance: 160,
      maxDistance: 260,
      dpr: isTouch ? [1, 1.1] : [1, 1.3],
      targetHeightRatio: 0.5,
      minTargetPx: 300,
      worldScale: 1,
    };
  }

  if (shortSide < 768) {
    return {
      fov: 44,
      minDistance: 150,
      maxDistance: 280,
      dpr: isTouch ? [1, 1.2] : [1, 1.5],
      targetHeightRatio: 0.5,
      minTargetPx: 300,
      worldScale: 1,
    };
  }

  return {
    fov: 42,
    minDistance: 145,
    maxDistance: 320,
    dpr: [1, 1.7],
    targetHeightRatio: 0.5,
    minTargetPx: 300,
    worldScale: 1,
  };
}