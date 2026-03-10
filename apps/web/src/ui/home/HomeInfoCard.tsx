import React from 'react'

type Props = {
    eyebrow: string
    title: string
    description?: string
    style?: React.CSSProperties
}

export function HomeInfoCard({ eyebrow, title, description, style }: Props) {
    return (
        <div
            style={{
                border: '1px solid rgba(148, 163, 184, 0.22)',
                background: 'rgba(5, 18, 45, 0.52)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                borderRadius: 28,
                padding: 24,
                boxShadow: '0 10px 40px rgba(2, 8, 23, 0.32)',
                color: '#fff',
                ...style,
            }}
        >
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                {eyebrow}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                {title}
            </div>
            {description ? (
                <div style={{ marginTop: 8, fontSize: 16, lineHeight: 1.4, color: 'rgba(255,255,255,0.84)' }}>
                    {description}
                </div>
            ) : null}
        </div>
    )
}