import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  width?: number
}

export default function Modal({ open, onClose, title, children, width = 500 }: ModalProps) {
  if (!open) return null

  return (
    <div
      className="animate-fade"
      style={{
        position: 'fixed',
        zIndex: 500,
        top: '60%',
        left: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale"
        style={{
          background: '#fff',
          borderRadius: 24,
          width: '500px',
          maxWidth: width,
          maxHeight: 'calc(100vh - 40px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f3f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fafbfc',
          borderRadius: '24px 24px 0 0',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#003366', letterSpacing: '-0.3px', textTransform: 'uppercase', fontStyle: 'italic' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex', borderRadius: 8, transition: 'background 0.1s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 24, 
          overflowY: 'auto', 
          flex: 1 
          }}>
          {children}
        </div>
      </div>
    </div>
  )
}
