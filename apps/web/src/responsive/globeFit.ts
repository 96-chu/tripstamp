export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type FitOptions = {
  viewportHeight: number;
  fovDeg: number;
  sphereDiameter: number;
  targetHeightRatio: number;
  minTargetPx: number;
  minZ?: number;
  maxZ?: number;
};

export function getCameraZForSphereFit(options: FitOptions) {
  const {
    viewportHeight,
    fovDeg,
    sphereDiameter,
    targetHeightRatio,
    minTargetPx,
    minZ = 140,
    maxZ = 420,
  } = options;

  // Compute desired on-screen diameter in pixels.
  const targetPx = Math.max(viewportHeight * targetHeightRatio, minTargetPx);

  // Convert fov to radians.
  const fovRad = (fovDeg * Math.PI) / 180;

  // Solve for camera distance so the sphere diameter matches the target screen height.
  const z = (sphereDiameter / 2) / Math.tan(fovRad / 2) * (viewportHeight / targetPx);

  return clamp(z, minZ, maxZ);
}