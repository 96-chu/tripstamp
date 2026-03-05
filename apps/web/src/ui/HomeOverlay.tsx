import React from 'react';
import type { TripPin } from '../scene/data/samplePins';

type Props = {
  userEmail: string | null;
  activePin: TripPin | null;
};

export function HomeOverlay({ userEmail, activePin }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 16, left: 16, pointerEvents: 'auto' }}>
        <div style={{ fontWeight: 700 }}>TripStamp</div>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, pointerEvents: 'auto' }}>
        {userEmail ? (
          <div style={{ padding: '8px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.35)', color: 'white' }}>
            {userEmail}
          </div>
        ) : (
          <a href="/login" style={{ padding: '8px 10px', borderRadius: 12, background: 'rgba(0,0,0,0.35)', color: 'white', textDecoration: 'none' }}>
            Sign in
          </a>
        )}
      </div>

      {activePin && (
        <div style={{ position: 'absolute', left: 16, bottom: 16, width: 320, pointerEvents: 'auto' }}>
          <div style={{ padding: 12, borderRadius: 16, background: 'rgba(0,0,0,0.4)', color: 'white' }}>
            <div style={{ fontWeight: 700 }}>{activePin.title}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>
              {activePin.lat.toFixed(3)}, {activePin.lng.toFixed(3)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}