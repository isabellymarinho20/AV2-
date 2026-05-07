type LogoSize = 'sm' | 'md' | 'lg'

interface LogoProps {
  size?: LogoSize
}

export default function Logo({ size = 'md' }: LogoProps) {
  const s = size === 'lg'
    ? { icon: 52, text: 34, sub: 13 }
    : size === 'sm'
    ? { icon: 28, text: 17, sub: 9 }
    : { icon: 36, text: 22, sub: 10 }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ position: 'relative', width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 52 52" fill="none" style={{ width: s.icon, height: s.icon }}>
          <rect width="52" height="52" rx="14" fill="#003366" />
          <path d="M10 29 Q18 17 36 22 L45 19 Q47 19 46 22 L39 25 Q31 28 26 31 L15 34 Q10 34 10 29Z" fill="white" opacity="0.95" />
          <path d="M20 26.5 L12 36.5 L17 36.5 L28 27.5Z" fill="#5A9DD1" />
          <path d="M38 22 L45 15 L46.5 16.5 L40 24Z" fill="#5A9DD1" />
          <circle cx="25" cy="25" r="1.5" fill="#003366" />
          <circle cx="30" cy="24" r="1.5" fill="#003366" />
          <circle cx="35" cy="23" r="1.5" fill="#003366" />
        </svg>
      </div>
      <div>
        <div style={{ lineHeight: 1, fontWeight: 900, fontSize: s.text, letterSpacing: '-0.5px', fontStyle: 'italic' }}>
          <span style={{ color: '#003366' }}>Aero</span>
          <span style={{ color: '#007CC3' }}>Code</span>
          <span style={{ color: '#5A9DD1', fontSize: s.text * 0.7 }}>&gt;</span>
        </div>
        {size !== 'sm' && (
          <div style={{ fontSize: s.sub, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', marginTop: 1, textTransform: 'uppercase', fontStyle: 'normal' }}>
            MRO Control
          </div>
        )}
      </div>
    </div>
  )
}
