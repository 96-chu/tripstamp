import React from 'react'
import type { TripPin } from '../scene/data/samplePins'
import { useAuth } from '../auth/AuthProvider'
import { AuthModal } from './auth/AuthModal'

type Props = {
  userEmail: string | null
  activePin: TripPin | null
  isGuest: boolean
}

const mockData = {
  progress: {
    countries: 12,
    cities: 36,
  },
  latestTrip: {
    title: 'Yarra Valley road trip',
    meta: '14 photos • 186 km route',
  },
  unlockNext: 'Add 1 more hiking trip to earn Trail Explorer',
}

type BottomActionProps = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
}

function glassCardStyle(width?: number): React.CSSProperties {
  return {
    width,
    borderRadius: 28,
    border: '1px solid rgba(148, 163, 184, 0.22)',
    background: 'rgba(6, 23, 54, 0.48)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    boxShadow: '0 10px 40px rgba(2, 8, 23, 0.28)',
    color: '#fff',
  }
}

function glassNavButtonStyle(): React.CSSProperties {
  return {
    padding: '10px 14px',
    borderRadius: 16,
    background: 'rgba(6, 23, 54, 0.45)',
    border: '1px solid rgba(148, 163, 184, 0.22)',
    color: '#fff',
    pointerEvents: 'auto',
    textDecoration: 'none',
    cursor: 'pointer',
  }
}

function BottomAction({ children, href, onClick }: BottomActionProps) {
  const [isHover, setIsHover] = React.useState(false)

  const style: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderRadius: 20,
    padding: '18px 16px',
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: isHover ? 700 : 500,
    textDecoration: isHover ? 'underline' : 'none',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'font-weight 120ms ease, text-decoration 120ms ease',
  }

  if (href) {
    return (
      <a
        href={href}
        style={style}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      style={style}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {children}
    </button>
  )
}

export function HomeOverlay({ userEmail, activePin, isGuest }: Props) {
  const {
    user,
    profile,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signOut,
  } = useAuth()

  const isLoggedIn = !isGuest && !!user
  const displayName = profile?.username || userEmail || 'Guest'

  const bottomActions = isLoggedIn
    ? [
      { label: 'Continue journey', type: 'button' as const },
      { label: 'Add a trip', type: 'button' as const },
      { label: 'Explore map', href: '#', type: 'link' as const },
      { label: 'View achievements', href: '#', type: 'link' as const },
    ]
    : [
      { label: 'Start your journey', type: 'button' as const },
      { label: 'Add a trip', type: 'button' as const },
      { label: 'Explore map', href: '#', type: 'link' as const },
      { label: 'View achievements', href: '#', type: 'link' as const },
    ]

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        color: '#fff',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(2, 6, 23, 0.16), rgba(2, 6, 23, 0.28) 42%, rgba(2, 6, 23, 0.52))',
          pointerEvents: 'none',
        }}
      />

      <header
        style={{
          position: 'absolute',
          top: 24,
          left: 32,
          right: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 800, pointerEvents: 'auto' }}>
          TripStamp.
        </div>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            pointerEvents: 'none',
          }}
        >
          <a
            href="/"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 700,
              borderBottom: '2px solid rgba(255,255,255,0.9)',
              paddingBottom: 6,
              pointerEvents: 'auto',
            }}
          >
            Home
          </a>

          <a
            href="#"
            style={{
              color: 'rgba(255,255,255,0.82)',
              textDecoration: 'none',
              pointerEvents: 'auto',
            }}
          >
            Map
          </a>

          <a
            href="#"
            style={{
              color: 'rgba(255,255,255,0.82)',
              textDecoration: 'none',
              pointerEvents: 'auto',
            }}
          >
            Achievements
          </a>

          <a
            href="#"
            style={{
              color: 'rgba(255,255,255,0.82)',
              textDecoration: 'none',
              pointerEvents: 'auto',
            }}
          >
            Insights
          </a>

          {isLoggedIn ? (
            <>
              <div style={glassNavButtonStyle()}>{displayName}</div>
              <button onClick={signOut} style={glassNavButtonStyle()}>
                Sign out
              </button>
            </>
          ) : (
            <button onClick={openAuthModal} style={glassNavButtonStyle()}>
              Get started
            </button>
          )}
        </nav>
      </header>

      <section
        style={{
          position: 'absolute',
          top: 108,
          left: 40,
          width: 360,
          zIndex: 10,
          pointerEvents: 'none',
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
            marginTop: 18,
            fontSize: 18,
            lineHeight: 1.45,
            color: 'rgba(255,255,255,0.84)',
            maxWidth: 320,
          }}
        >
          Record places, dates, photos, routes, and the stories that make every trip yours.
        </p>

        <div
          style={{
            ...glassCardStyle(330),
            marginTop: 44,
            padding: 22,
            pointerEvents: 'auto',
          }}
        >
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
            Travel memory system
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 24,
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            Places, photos, tags, and routes in one living map.
          </div>
        </div>
      </section>

      <section
        style={{
          position: 'absolute',
          top: 132,
          right: 40,
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div style={{ ...glassCardStyle(), padding: 22, pointerEvents: 'auto' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Your progress</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            {mockData.progress.countries} countries • {mockData.progress.cities} cities
          </div>
        </div>

        <div style={{ ...glassCardStyle(), padding: 22, pointerEvents: 'auto' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Latest trip</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            {mockData.latestTrip.title}
          </div>
          <div style={{ marginTop: 6, fontSize: 16, color: 'rgba(255,255,255,0.82)' }}>
            {mockData.latestTrip.meta}
          </div>
        </div>

        <div style={{ ...glassCardStyle(), padding: 22, pointerEvents: 'auto' }}>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Unlock next</div>
          <div style={{ marginTop: 8, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
            {mockData.unlockNext}
          </div>
        </div>
      </section>

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 36,
          transform: 'translateX(-50%)',
          width: 'min(850px, calc(100vw - 64px))',
          borderRadius: 30,
          border: '1px solid rgba(148, 163, 184, 0.18)',
          background: 'rgba(6, 23, 54, 0.58)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 10px 40px rgba(2, 8, 23, 0.28)',
          padding: 6,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 8,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        {bottomActions.map((item) => {
          if (item.type === 'link') {
            return (
              <BottomAction key={item.label} href={item.href}>
                {item.label}
              </BottomAction>
            )
          }

          return (
            <BottomAction
              key={item.label}
              onClick={() => {
                if (!isLoggedIn) {
                  openAuthModal()
                  return
                }

                // Keep placeholder for future logged-in actions.
              }}
            >
              {item.label}
            </BottomAction>
          )
        })}
      </div>

      {activePin ? (
        <div
          style={{
            position: 'absolute',
            left: 24,
            bottom: 128,
            width: 280,
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              ...glassCardStyle(),
              padding: 16,
              pointerEvents: 'auto',
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 700 }}>{activePin.title}</div>
            <div style={{ marginTop: 6, fontSize: 14, color: 'rgba(255,255,255,0.82)' }}>
              {activePin.lat.toFixed(3)}, {activePin.lng.toFixed(3)}
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal open={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  )
}