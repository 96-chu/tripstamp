
type Props = {
  userEmail: string | null
}

export function HomeTopNav({ userEmail }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 24,
        left: 32,
        right: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'auto',
        zIndex: 20,
      }}
    >
      <div style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>TripStamp.</div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          color: 'rgba(255,255,255,0.84)',
        }}
      >
        <a href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
          Home
        </a>
        <a href="#map" style={{ color: 'inherit', textDecoration: 'none' }}>
          Map
        </a>
        <a href="#achievements" style={{ color: 'inherit', textDecoration: 'none' }}>
          Achievements
        </a>
        <a href="#insights" style={{ color: 'inherit', textDecoration: 'none' }}>
          Insights
        </a>

        {userEmail ? (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 18,
              border: '1px solid rgba(148, 163, 184, 0.22)',
              background: 'rgba(5, 18, 45, 0.45)',
            }}
          >
            {userEmail}
          </div>
        ) : (
          <a
            href="/login"
            style={{
              padding: '12px 16px',
              borderRadius: 18,
              border: '1px solid rgba(148, 163, 184, 0.22)',
              background: 'rgba(5, 18, 45, 0.45)',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            Get started
          </a>
        )}
      </div>
    </div>
  )
}