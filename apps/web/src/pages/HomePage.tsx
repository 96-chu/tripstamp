import React, { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { GlobeScene } from '../scene/GlobeScene';
import type { TripPin } from '../scene/data/samplePins';
import { samplePins } from '../scene/data/samplePins';
import { HomeOverlay } from '../ui/HomeOverlay';

export function HomePage() {
  const { user } = useAuth();
  const [activePin, setActivePin] = useState<TripPin | null>(null);

  const pins = useMemo(() => {
    // Replace with real pins from DB when ready; keep demo pins for guest mode.
    return samplePins;
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <GlobeScene pins={pins} onPinSelect={setActivePin} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <HomeOverlay userEmail={user?.email ?? null} activePin={activePin} />
      </div>
    </div>
  );
}