import { useState } from 'react'
import type { ElementType } from 'react'
import {
  BarChart2, List, Package, CheckSquare, FlaskConical,
  Users, FileText, LogOut, ChevronRight, User as UserIcon,
  Menu, ChevronLeft 
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { View } from '../types'


const NAV_GROUPS: { label: string; items: { id: View; icon: ElementType; label: string }[] }[] = [
  {
    label: 'Frota',
    items: [
      { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
      { id: 'aeronaves', icon: List,      label: 'Listar Aeronaves' },
      { id: 'pecas',     icon: Package,   label: 'Peças' },
    ],
  },
  {
    label: 'Produção',
    items: [
      { id: 'etapas', icon: CheckSquare,  label: 'Etapas' },
      { id: 'testes', icon: FlaskConical, label: 'Testes' },
    ],
  },
  {
    label: 'Equipe',
    items: [
      { id: 'funcionarios', icon: Users, label: 'Funcionários' },
    ],
  },
  {
    label: 'Relatório',
    items: [
      { id: 'relatorio', icon: FileText, label: 'Gerar Relatório' },
    ],
  },
]

interface SidebarItemProps {
  icon:    ElementType
  label:   string
  active?: boolean
  onClick: () => void
  danger?: boolean
  collapsed?: boolean
}

function SidebarItem({ icon: Icon, label, active, onClick, danger, collapsed }: SidebarItemProps) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={collapsed ? label : ''} // Aparece o nome ao passar o mouse se tiver fechado
      style={{
        width: '100%', display: 'flex', alignItems: 'center', 
        gap: collapsed ? 0 : 12, // Gap zero se fechado
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
        background: active
          ? 'linear-gradient(135deg, #003366, #007CC3)'
          : hov ? (danger ? '#fef2f2' : '#f1f3f7') : 'transparent',
        color: active ? '#fff' : danger ? '#dc2626' : hov ? '#003366' : '#6b7280',
        fontSize: 12, fontWeight: active ? 700 : 500,
        transition: 'all 0.2s', textAlign: 'left', marginBottom: 2,
        position: 'relative'
      }}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
      

      {!collapsed && (
        <>
          <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
          {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
        </>
      )}
    </button>
  )
}

interface SidebarProps {
  current:    View
  setCurrent: (view: View) => void
}

export default function Sidebar({ current, setCurrent }: SidebarProps) {
  const { user, logout} = useApp()
  const [collapsed, setCollapsed] = useState(false)

  const sidebarWidth = collapsed ? '70px' : '260px'

  return (
    <aside style={{
      width: sidebarWidth, minHeight: '100vh', background: '#fff',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'sticky', top: 0, maxHeight: '100vh',transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflowX: 'hidden',
    }}>
      <button 
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: 'absolute', right: collapsed ? 'calc(50% - 12px)' : '10px', 
          top: 15, background: '#f1f3f7', border: 'none',
          borderRadius: 6, cursor: 'pointer', padding: 4, color: '#003366', zIndex: 10,
          transition: 'right 0.3s'
        }}
      >
        {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div style={{
        marginTop: collapsed ? 40 : 0, // Espaço para o botão quando fechado
        marginBottom: collapsed ? 10 : -23, 
        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'
      }}>
        <img 
          src={'../../src/assets/logo.png'} 
          alt="Logo" 
          style={{ 
            height: collapsed ? '40px' : '150px', 
            width: collapsed ? '40px' : '150px', 
            objectFit: 'contain',
            transition: 'all 0.3s'
          }} 
        />
      </div>

      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {NAV_GROUPS.map(g => (
          <div key={g.label} style={{ marginBottom: 4 }}>
            {!collapsed && (
              <div style={{ fontSize: 9, fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 8px 4px' }}>
                {g.label}
              </div>
            )}
            {g.items.map(item => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={current === item.id}
                onClick={() => setCurrent(item.id)}
                collapsed={collapsed} 
              />
            ))}
          </div>
        ))}
      </nav>

       <div style={{ 
        margin: '12px', background: '#f8f9fb', borderRadius: 12, 
        padding: collapsed ? '10px 0' : '10px 14px', 
        display: 'flex', alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: collapsed ? 0 : 10 
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #003366, #007CC3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserIcon size={16} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.nome}
            </div>
            <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600 }}>{user?.nivel}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '8px 12px 16px' }}>
        <SidebarItem 
          icon={LogOut} 
          label="Sair" 
          onClick={logout} 
          danger 
          collapsed={collapsed} 
        />
      </div>
    </aside>
  )
}
