import type { ReactNode } from 'react'

type BadgeVariant = 'gray' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'navy'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const VARIANTS: Record<BadgeVariant, { bg: string; color: string }> = {
  gray:   { bg: '#f3f4f6', color: '#374151' },
  blue:   { bg: '#eff6ff', color: '#1d4ed8' },
  green:  { bg: '#ecfdf5', color: '#059669' },
  amber:  { bg: '#fffbeb', color: '#d97706' },
  red:    { bg: '#fef2f2', color: '#dc2626' },
  purple: { bg: '#f5f3ff', color: '#7c3aed' },
  navy:   { bg: '#eff6ff', color: '#003366' },
}

export default function Badge({ children, variant = 'gray' }: BadgeProps) {
  const s = VARIANTS[variant]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color,
      fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.02em', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

export function badgeForStatus(s: string) {
  if (s === 'Concluído')     return <Badge variant="green">{s}</Badge>
  if (s === 'Em Andamento')  return <Badge variant="blue">{s}</Badge>
  if (s === 'Pendente')      return <Badge variant="amber">{s}</Badge>
  if (s === 'Aprovado')      return <Badge variant="green">{s}</Badge>
  if (s === 'Reprovado')     return <Badge variant="red">{s}</Badge>
  if (s === 'Pronta')        return <Badge variant="green">{s}</Badge>
  if (s === 'Em Transporte') return <Badge variant="purple">{s}</Badge>
  if (s === 'Em Produção')   return <Badge variant="amber">{s}</Badge>
  return <Badge>{s}</Badge>
}
