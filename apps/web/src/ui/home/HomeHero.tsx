import React from 'react'
import { landingMock } from './landingMock'
import { HomeInfoCard } from './HomeInfoCard'

export function HomeHero() {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 42,
          width: 360,
          color: '#fff',
          pointerEvents: 'auto',
          zIndex: 10,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 64,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.04em',
          }}
        >
          A world of memories, kept in motion.
        </h1>

        <p
          style={{
            marginTop: 20,
            marginBottom: 0,
            fontSize: 18,
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.84)',
          }}
        >
          Record places, dates, photos, routes, and the stories that make every trip yours.
        </p>

        <div style={{ marginTop: 44 }}>
          <HomeInfoCard
            eyebrow="Travel memory system"
            title="Places, photos, tags, and routes in one living map."
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 132,
          right: 42,
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          pointerEvents: 'auto',
          zIndex: 10,
        }}
      >
        <HomeInfoCard
          eyebrow="Your progress"
          title={`${landingMock.progress.countries} countries • ${landingMock.progress.cities} cities`}
        />

        <HomeInfoCard
          eyebrow="Latest trip"
          title={landingMock.latestTrip.title}
          description={`${landingMock.latestTrip.photos} photos • ${landingMock.latestTrip.route}`}
        />

        <HomeInfoCard
          eyebrow="Unlock next"
          title={landingMock.nextUnlock.title}
          description={landingMock.nextUnlock.hint}
        />
      </div>
    </>
  )
}