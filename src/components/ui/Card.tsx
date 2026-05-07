import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  padding?: string
}

export default function Card({ children, style, padding = '24px' }: CardProps) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding,
      boxShadow: 'var(--shadow)',
      ...style,
    }}>
      {children}
    </div>
  )
}
