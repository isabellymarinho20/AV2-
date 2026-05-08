import { useState } from 'react'
import type { CSSProperties, ElementType } from 'react'

type BtnVariant = 'primary' | 'dark' | 'ghost' | 'danger' | 'success' | 'outline'
type BtnSize    = 'sm' | 'md'


interface BtnProps {
  children?: React.ReactNode
  variant?:  BtnVariant//***************************** */
  size?:     BtnSize
  full?:     boolean
  onClick?:  () => void
  disabled?: boolean
  style?:    CSSProperties
  icon?:     ElementType
}

export default function Btn({
  children, variant = 'primary', size = 'md',
  full, onClick, disabled, style, icon: Icon,
}: BtnProps) {
  const [hov, setHov] = useState(false)

  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    border: 'none', borderRadius: 10, transition: 'all 0.15s', whiteSpace: 'nowrap',
    width: full ? '100%' : undefined, ...style,
  }

  const pad = size === 'sm' ? '6px 14px' : '10px 20px'
  const fs  = size === 'sm' ? 12 : 13
//***************************** */
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: { background: hov ? '#005fa3' : '#007CC3', color: '#fff', padding: pad, fontSize: fs },
    dark:    { background: hov ? '#004080' : '#003366', color: '#fff', padding: pad, fontSize: fs },
    ghost:   { background: hov ? '#f1f3f7' : 'transparent', color: hov ? '#003366' : '#6b7280', padding: pad, fontSize: fs, border: '1px solid #e8eaed' },
    danger:  { background: hov ? '#b91c1c' : '#dc2626', color: '#fff', padding: pad, fontSize: fs },
    success: { background: hov ? '#047857' : '#059669', color: '#fff', padding: pad, fontSize: fs },
    outline: { background: 'transparent', color: '#007CC3', padding: pad, fontSize: fs, border: '1px solid #007CC3' },
  }

  return (
    <button
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  )
}
