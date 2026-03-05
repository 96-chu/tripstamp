import { useEffect, useMemo, useState } from 'react';

type Viewport = {
  width: number;
  height: number;
  shortSide: number;
  longSide: number;
  isTouch: boolean;
};

export function useViewport(): Viewport {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let raf = 0;

    function onResize() {
      // Use rAF to avoid flooding state updates during resize.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    }

    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return useMemo(() => {
    const shortSide = Math.min(size.width, size.height);
    const longSide = Math.max(size.width, size.height);

    return {
      width: size.width,
      height: size.height,
      shortSide,
      longSide,
      isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  }, [size.width, size.height]);
}