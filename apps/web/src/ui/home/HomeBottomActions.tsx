
type ActionItem = {
  label: string
  href: string
}

type Props = {
  actions: ActionItem[]
}

export function HomeBottomActions({ actions }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 42,
        transform: 'translateX(-50%)',
        width: 'min(880px, calc(100vw - 48px))',
        borderRadius: 30,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        background: 'rgba(5, 18, 45, 0.62)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 10px 40px rgba(2, 8, 23, 0.32)',
        padding: 12,
        pointerEvents: 'auto',
        zIndex: 20,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 8,
        }}
      >
        {actions.map((action, index) => (
          <a
            key={action.label}
            href={action.href}
            style={{
              textDecoration: 'none',
              color: index === 0 ? '#fff' : 'rgba(255,255,255,0.78)',
              background: index === 0 ? 'rgba(255,255,255,0.06)' : 'transparent',
              borderRadius: 20,
              padding: '18px 16px',
              textAlign: 'center',
              fontWeight: index === 0 ? 700 : 500,
            }}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}