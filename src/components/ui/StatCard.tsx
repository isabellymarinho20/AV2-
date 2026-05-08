import type { ElementType } from 'react'
import Card from './Card'

interface StatCardProps {
  label:  string
  value:  number
  icon:   ElementType
  color?: string
}

export default function StatCard({ label, value, icon: Icon, color = '#007CC3' }: StatCardProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {label}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-1px' }}>
            {value}
          </div>
        </div>//***************************** */
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </Card>
  )
}
