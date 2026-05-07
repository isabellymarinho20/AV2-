import type { ReactNode } from 'react'

interface SectionTitleProps {
  children: ReactNode
  sub?: string
}

export default function SectionTitle({ children, sub }: SectionTitleProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#003366', letterSpacing: '-0.4px' }}>
        {children}
      </h2>
      {sub && (
        <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, fontWeight: 500 }}>
          {sub}
        </p>
      )}
    </div>
  )
}
