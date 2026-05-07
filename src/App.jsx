import React, { useState, createContext, useContext, useCallback } from 'react'
import {
  Plane, Users, Play, CheckCircle, PlusCircle, Package, Activity,
  List, FileText, UserPlus, UserCheck, FlaskConical, AlertTriangle,
  Info, User as UserIcon, LogOut, X, ChevronRight, BarChart2,
  Settings, Bell, Search, Menu, ArrowLeft, Download, RefreshCw,
  CheckSquare, Clock, Zap, TrendingUp, Shield, Wrench
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'


// Informações

const ENUMS = {
  TipoAeronave: ['Comercial', 'Militar'],
  TipoPeca: ['Nacional', 'Importada'],
  StatusPeca: ['Em Produção', 'Em Transporte', 'Pronta'],
  StatusEtapa: ['Pendente', 'Em Andamento', 'Concluído'],
  NivelPermissao: ['Administrador', 'Engenheiro', 'Operador'],
  TipoTeste: ['Elétrico', 'Hidráulico', 'Aerodinâmico'],
  ResultadoTeste: ['Aprovado', 'Reprovado'],
}

const SEED = {
  aeronaves: [
    { id: 1, codigo: 'AC-100', modelo: 'Phenom 300', tipo: 'Comercial', capacidade: 10, alcance: 3650, pecas: [{ nome: 'Motor PT6A-10', tipo: 'Importada', fornecedor: 'Pratt & Whitney', status: 'Pronta' }, { nome: 'Avionics Suite', tipo: 'Importada', fornecedor: 'Garmin', status: 'Pronta' }], etapas: [{ id: 101, nome: 'Montagem de Fuselagem', status: 'Concluído', prazo: '2024-06-01', funcionarios: [1] }, { id: 102, nome: 'Instalação Elétrica', status: 'Em Andamento', prazo: '2024-07-15', funcionarios: [2] }, { id: 103, nome: 'Instalação Hidráulica', status: 'Pendente', prazo: '2024-08-10', funcionarios: [] }], testes: [{ tipo: 'Elétrico', resultado: 'Aprovado' }] },
    { id: 2, codigo: 'AC-200', modelo: 'Gripen NG', tipo: 'Militar', capacidade: 1, alcance: 4000, pecas: [{ nome: 'Motor RM12', tipo: 'Importada', fornecedor: 'Volvo Aero', status: 'Em Transporte' }], etapas: [{ id: 201, nome: 'Integração de Sistemas', status: 'Concluído', prazo: '2024-05-20', funcionarios: [1, 2] }, { id: 202, nome: 'Testes de Turbina', status: 'Concluído', prazo: '2024-06-05', funcionarios: [1] }], testes: [{ tipo: 'Aerodinâmico', resultado: 'Aprovado' }, { tipo: 'Hidráulico', resultado: 'Reprovado' }] },
    { id: 3, codigo: 'AC-300', modelo: 'C-390 Millennium', tipo: 'Militar', capacidade: 80, alcance: 5800, pecas: [], etapas: [{ id: 301, nome: 'Estrutura Primária', status: 'Pendente', prazo: '2024-09-01', funcionarios: [] }], testes: [] },
  ],
  funcionarios: [
    { id: 1, nome: 'Roberto Silva', telefone: '(12) 9999-0001', endereco: 'Av. Shishito, 100', usuario: 'admin', senha: '123', nivel: 'Administrador', cargo: 'Administrador Chefe' },
    { id: 2, nome: 'Carlos Oliveira', telefone: '(12) 9988-7766', endereco: 'Rua A, 123', usuario: 'carlos.eng', senha: '123', nivel: 'Engenheiro', cargo: 'Engenheiro Sênior' },
    { id: 3, nome: 'Mariana Souza', telefone: '(12) 9911-2233', endereco: 'Av. B, 456', usuario: 'mari.tec', senha: '123', nivel: 'Operador', cargo: 'Técnica Operacional' },
  ],
}


const AppCtx = createContext(null)
const useApp = () => useContext(AppCtx)

function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [aeronaves, setAeronaves] = useState(SEED.aeronaves)
  const [funcionarios, setFuncionarios] = useState(SEED.funcionarios)
  const [toast, setToast] = useState(null)

  const notify = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const login = () => setUser(SEED.funcionarios[0])
  const logout = () => setUser(null)

  // ── Aeronave ──
  const addAeronave = (data) => {
    const exists = aeronaves.find(a => a.codigo === data.codigo)
    if (exists) { notify('Código já existe!', 'error'); return false }
    setAeronaves(p => [...p, { ...data, id: Date.now(), pecas: [], etapas: [], testes: [] }])
    notify('Aeronave cadastrada com sucesso!')
    return true
  }

  // ── Peça ──
  const addPeca = (aeroId, peca) => {
    setAeronaves(p => p.map(a => a.id === aeroId ? { ...a, pecas: [...a.pecas, peca] } : a))
    notify('Peça adicionada!')
    return true
  }
  const updateStatusPeca = (aeroId, pecaIdx, newStatus) => {
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, pecas: a.pecas.map((pc, i) => i === pecaIdx ? { ...pc, status: newStatus } : pc) }
      : a))
    notify('Status da peça atualizado!')
  }

  // ── Etapa ──
  const addEtapa = (aeroId, etapa) => {
    const aero = aeronaves.find(a => a.id === aeroId)
    const temPendente = aero?.etapas.some(e => e.status === 'Pendente')
    if (temPendente) { notify('Não é possível adicionar etapa com etapa pendente existente!', 'error'); return false }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: [...a.etapas, { ...etapa, id: Date.now(), funcionarios: [] }] }
      : a))
    notify('Etapa adicionada!')
    return true
  }
  const iniciarEtapa = (aeroId, etapaId) => {
    const aero = aeronaves.find(a => a.id === aeroId)
    const idx = aero?.etapas.findIndex(e => e.id === etapaId)
    if (idx > 0 && aero.etapas[idx - 1].status !== 'Concluído') {
      notify('Conclua a etapa anterior primeiro!', 'error'); return false
    }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Em Andamento' } : e) }
      : a))
    notify('Etapa iniciada!')
    return true
  }
  const concluirEtapa = (aeroId, etapaId) => {
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Concluído' } : e) }
      : a))
    notify('Etapa concluída!')
    return true
  }

  // ── Funcionario ──
  const addFuncionario = (data) => {
    if (funcionarios.find(f => f.usuario === data.usuario)) { notify('Usuário já existe!', 'error'); return false }
    setFuncionarios(p => [...p, { ...data, id: Date.now() }])
    notify('Funcionário cadastrado!')
    return true
  }
  const assocFuncionario = (aeroId, etapaId, funcId) => {
    const aero = aeronaves.find(a => a.id === aeroId)
    const etapa = aero?.etapas.find(e => e.id === etapaId)
    if (etapa?.funcionarios.includes(funcId)) { notify('Funcionário já associado!', 'error'); return false }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, funcionarios: [...e.funcionarios, funcId] } : e) }
      : a))
    notify('Funcionário associado à etapa!')
    return true
  }

  // ── Teste ──
  const addTeste = (aeroId, teste) => {
    setAeronaves(p => p.map(a => a.id === aeroId ? { ...a, testes: [...a.testes, teste] } : a))
    notify('Teste registrado!')
    return true
  }

  return (
    <AppCtx.Provider value={{ user, login, logout, aeronaves, funcionarios, toast, notify, addAeronave, addPeca, updateStatusPeca, addEtapa, iniciarEtapa, concluirEtapa, addFuncionario, assocFuncionario, addTeste }}>
      {children}
    </AppCtx.Provider>
  )
}

// ─────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────
function Logo({ size = 'md' }) {
  const s = size === 'lg' ? { icon: 52, text: 34, sub: 13 } : size === 'sm' ? { icon: 28, text: 17, sub: 9 } : { icon: 36, text: 22, sub: 10 }
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
          <span style={{ color: '#003366' }}>Aero</span><span style={{ color: '#007CC3' }}>Code</span><span style={{ color: '#5A9DD1', fontSize: s.text * 0.7 }}>&gt;</span>
        </div>
        {size !== 'sm' && <div style={{ fontSize: s.sub, color: '#9ca3af', fontWeight: 600, letterSpacing: '0.08em', marginTop: 1, textTransform: 'uppercase', fontStyle: 'normal' }}>MRO Control</div>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const isErr = toast.type === 'error'
  return (
    <div className="animate-slide-right" style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: isErr ? '#dc2626' : '#111827',
      color: '#fff', padding: '12px 20px', borderRadius: 12,
      fontSize: 13, fontWeight: 600, maxWidth: 340,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 8
    }}>
      {isErr ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
      {toast.msg}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
function Btn({ children, variant = 'primary', size = 'md', full, onClick, disabled, style, icon: Icon }) {
  const [hov, setHov] = useState(false)
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
    border: 'none', borderRadius: 10, transition: 'all 0.15s', whiteSpace: 'nowrap',
    width: full ? '100%' : undefined, ...style
  }
  const variants = {
    primary: { background: hov ? '#005fa3' : '#007CC3', color: '#fff', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13 },
    dark: { background: hov ? '#004080' : '#003366', color: '#fff', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13 },
    ghost: { background: hov ? '#f1f3f7' : 'transparent', color: hov ? '#003366' : '#6b7280', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13, border: '1px solid #e8eaed' },
    danger: { background: hov ? '#b91c1c' : '#dc2626', color: '#fff', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13 },
    success: { background: hov ? '#047857' : '#059669', color: '#fff', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13 },
    outline: { background: 'transparent', color: '#007CC3', padding: size === 'sm' ? '6px 14px' : '10px 20px', fontSize: size === 'sm' ? 12 : 13, border: '1px solid #007CC3' },
  }
  return (
    <button style={{ ...base, ...variants[variant] }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} disabled={disabled}>
      {Icon && <Icon size={14} />}{children}
    </button>
  )
}

function Badge({ children, variant = 'gray' }) {
  const vs = {
    gray:   { bg: '#f3f4f6', color: '#374151' },
    blue:   { bg: '#eff6ff', color: '#1d4ed8' },
    green:  { bg: '#ecfdf5', color: '#059669' },
    amber:  { bg: '#fffbeb', color: '#d97706' },
    red:    { bg: '#fef2f2', color: '#dc2626' },
    purple: { bg: '#f5f3ff', color: '#7c3aed' },
    navy:   { bg: '#eff6ff', color: '#003366' },
  }
  const s = vs[variant] || vs.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: '3px 9px',
      borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: s.bg, color: s.color, fontFamily: 'JetBrains Mono, monospace',
      letterSpacing: '0.02em', whiteSpace: 'nowrap'
    }}>{children}</span>
  )
}

function badgeForStatus(s) {
  if (s === 'Concluído') return <Badge variant="green">{s}</Badge>
  if (s === 'Em Andamento') return <Badge variant="blue">{s}</Badge>
  if (s === 'Pendente') return <Badge variant="amber">{s}</Badge>
  if (s === 'Aprovado') return <Badge variant="green">{s}</Badge>
  if (s === 'Reprovado') return <Badge variant="red">{s}</Badge>
  if (s === 'Pronta') return <Badge variant="green">{s}</Badge>
  if (s === 'Em Transporte') return <Badge variant="purple">{s}</Badge>
  if (s === 'Em Produção') return <Badge variant="amber">{s}</Badge>
  return <Badge>{s}</Badge>
}

function Card({ children, style, padding = '24px' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 16, padding, boxShadow: 'var(--shadow)', ...style }}>
      {children}
    </div>
  )
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#003366', letterSpacing: '-0.4px' }}>{children}</h2>
      {sub && <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, fontWeight: 500 }}>{sub}</p>}
    </div>
  )
}

function FormField({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  padding: '10px 14px', border: '1.5px solid #e8eaed', borderRadius: 10,
  fontSize: 13, fontWeight: 500, color: '#111827', background: '#fafbfc',
  outline: 'none', transition: 'border-color 0.15s',
  width: '100%'
}

function FInput({ value, onChange, placeholder, type = 'text' }) {
  const [f, setF] = useState(false)
  return (
    <input
      style={{ ...inputStyle, borderColor: f ? '#007CC3' : '#e8eaed', boxShadow: f ? '0 0 0 3px rgba(0,124,195,0.1)' : 'none' }}
      value={value} onChange={onChange} placeholder={placeholder} type={type}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
    />
  )
}

function FSelect({ value, onChange, children }) {
  const [f, setF] = useState(false)
  return (
    <select
      style={{ ...inputStyle, borderColor: f ? '#007CC3' : '#e8eaed', boxShadow: f ? '0 0 0 3px rgba(0,124,195,0.1)' : 'none', cursor: 'pointer' }}
      value={value} onChange={onChange}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
    >{children}</select>
  )
}

// ─────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 500 }) {
  if (!open) return null
  return (
    <div className="animate-fade" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      backdropFilter: 'blur(6px)', zIndex: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div className="animate-scale" style={{
        background: '#fff', borderRadius: 24, width: '100%', maxWidth: width,
        maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f3f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafbfc', borderRadius: '24px 24px 0 0' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#003366', letterSpacing: '-0.3px', textTransform: 'uppercase', fontStyle: 'italic' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, display: 'flex', borderRadius: 8, transition: 'background 0.1s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────────────────────
function Table({ headers, rows, empty = 'Nenhum registro encontrado.' }) {
  if (!rows.length) return (
    <div style={{ padding: '48px 24px', textAlign: 'center', color: '#9ca3af' }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
      <div style={{ fontSize: 13, fontWeight: 500 }}>{empty}</div>
    </div>
  )
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1.5px solid #f1f3f7' }}>
            {headers.map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f8f9fb', cursor: row._onClick ? 'pointer' : 'default', transition: 'background 0.1s' }}
              onMouseEnter={e => { if (row._onClick) e.currentTarget.style.background = '#fafbfc' }}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              onClick={row._onClick}>
              {row.cells.map((cell, j) => (
                <td key={j} style={{ padding: '12px 16px', verticalAlign: 'middle', color: '#374151', fontFamily: cell?.mono ? 'JetBrains Mono, monospace' : 'inherit', fontSize: cell?.mono ? 12 : 13 }}>
                  {cell?.content ?? cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────
function Sidebar({ current, setCurrent, setModal }) {
  const { user, logout, aeronaves, funcionarios } = useApp()
  const openSteps = aeronaves.flatMap(a => a.etapas).filter(e => e.status !== 'Concluído').length

  const groups = [
    {
      label: 'Frota', items: [
        { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
        { id: 'aeronaves', icon: List, label: 'Listar Aeronaves' },
        { id: 'pecas', icon: Package, label: 'Peças' },
      ]
    },
    {
      label: 'Produção', items: [
        { id: 'etapas', icon: CheckSquare, label: 'Etapas' },
        { id: 'testes', icon: FlaskConical, label: 'Testes' },
      ]
    },
    {
      label: 'Equipe', items: [
        { id: 'funcionarios', icon: Users, label: 'Funcionários' },
      ]
    },
    {
      label: 'Relatório', items: [
        { id: 'relatorio', icon: FileText, label: 'Gerar Relatório' },
      ]
    },
  ]

  return (
    <aside style={{
      width: 'var(--sidebar)', minHeight: '100vh', background: '#fff',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      flexShrink: 0, position: 'sticky', top: 0, maxHeight: '100vh', overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f3f7' }}>
        <Logo size="sm" />
      </div>

      {/* User pill */}
      <div style={{ margin: '12px 12px 4px', background: '#f8f9fb', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #003366, #007CC3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <UserIcon size={16} color="#fff" />
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.nome}</div>
          <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{user?.nivel}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 9, fontWeight: 800, color: '#c9ccd0', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '10px 8px 4px' }}>{g.label}</div>
            {g.items.map(item => {
              const active = current === item.id
              return (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} active={active} onClick={() => setCurrent(item.id)} />
              )
            })}
          </div>
        ))}
      </nav>

      {/* Status strip */}
      <div style={{ margin: '0 12px 8px', padding: '10px 14px', background: '#f8f9fb', borderRadius: 12, fontSize: 11 }}>
        <div style={{ fontWeight: 700, color: '#9ca3af', marginBottom: 6, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</div>
        {[
          { l: 'Aeronaves', v: aeronaves.length },
          { l: 'Funcionários', v: funcionarios.length },
          { l: 'Etapas abertas', v: openSteps },
        ].map(s => (
          <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', color: '#6b7280' }}>
            <span>{s.l}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#374151', fontSize: 11 }}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '8px 12px 16px' }}>
        <SidebarItem icon={LogOut} label="Sair do sistema" onClick={logout} danger />
      </div>
    </aside>
  )
}

function SidebarItem({ icon: Icon, label, active, onClick, danger }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
        padding: '8px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
        background: active ? 'linear-gradient(135deg, #003366, #007CC3)' : hov ? (danger ? '#fef2f2' : '#f1f3f7') : 'transparent',
        color: active ? '#fff' : danger ? '#dc2626' : hov ? '#003366' : '#6b7280',
        fontSize: 12, fontWeight: active ? 700 : 500,
        transition: 'all 0.12s', textAlign: 'left', marginBottom: 1
      }}
    >
      <Icon size={15} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
      {active && <ChevronRight size={12} style={{ marginLeft: 'auto', opacity: 0.7 }} />}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color = '#007CC3' }) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </Card>
  )
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────
function Dashboard({ setView, setSelectedAero }) {
  const { aeronaves, funcionarios } = useApp()
  const allEtapas = aeronaves.flatMap(a => a.etapas)
  const allPecas = aeronaves.flatMap(a => a.pecas)
  const allTestes = aeronaves.flatMap(a => a.testes)

  const etapaData = [
    { name: 'Pendente', value: allEtapas.filter(e => e.status === 'Pendente').length, fill: '#f59e0b' },
    { name: 'Andamento', value: allEtapas.filter(e => e.status === 'Em Andamento').length, fill: '#007CC3' },
    { name: 'Concluído', value: allEtapas.filter(e => e.status === 'Concluído').length, fill: '#059669' },
  ]
  const testeData = [
    { name: 'Aprovados', value: allTestes.filter(t => t.resultado === 'Aprovado').length, fill: '#059669' },
    { name: 'Reprovados', value: allTestes.filter(t => t.resultado === 'Reprovado').length, fill: '#dc2626' },
  ]
  const progressoData = aeronaves.map(a => ({
    name: a.codigo,
    pct: a.etapas.length ? Math.round((a.etapas.filter(e => e.status === 'Concluído').length / a.etapas.length) * 100) : 0
  }))

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Operations Dashboard</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#003366', letterSpacing: '-0.5px' }}>Maintenance &amp; Fleet Overview</h1>
        </div>
        <Btn variant="ghost" size="sm" icon={RefreshCw}>Atualizar</Btn>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <StatCard label="Aircraft" value={aeronaves.length} icon={Plane} color="#007CC3" />
        <StatCard label="Parts Tracked" value={allPecas.length} icon={Package} color="#7c3aed" />
        <StatCard label="Open Steps" value={allEtapas.filter(e => e.status !== 'Concluído').length} icon={Clock} color="#d97706" />
        <StatCard label="Employees" value={funcionarios.length} icon={Users} color="#059669" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <Card padding="20px">
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>All aircraft</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Steps by status</div>
          {allEtapas.length === 0 ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>No data yet</div> : (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={etapaData} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {etapaData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card padding="20px">
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>% of completed steps</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Fleet progress</div>
          {progressoData.length === 0 ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>No data yet</div> : (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={progressoData} layout="vertical" barSize={14}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={52} />
                <Tooltip formatter={v => [`${v}%`, 'Progresso']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
                <Bar dataKey="pct" fill="#007CC3" radius={[0, 5, 5, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card padding="20px">
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Quality control</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Test results</div>
          {allTestes.length === 0 ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>No data yet</div> : (
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={testeData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={4}>
                  {testeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Fleet table */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Fleet</div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>Register and inspect aircraft.</div>
          </div>
          <Btn size="sm" icon={PlusCircle} onClick={() => setView('aeronaves')}>Register aircraft</Btn>
        </div>
        {aeronaves.length === 0
          ? <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: 13, border: '2px dashed #e8eaed', margin: 20, borderRadius: 12 }}>
              No aircraft registered yet. Use "Register aircraft" to add the first one.
            </div>
          : <Table
              headers={['Código', 'Modelo', 'Tipo', 'Capacidade', 'Alcance', 'Progresso', '']}
              rows={aeronaves.map(a => {
                const pct = a.etapas.length ? Math.round((a.etapas.filter(e => e.status === 'Concluído').length / a.etapas.length) * 100) : 0
                return {
                  _onClick: () => { setSelectedAero(a); setView('aeroDetalhe') },
                  cells: [
                    { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#007CC3', fontWeight: 600 }}>{a.codigo}</span>, mono: false },
                    a.modelo,
                    { content: <Badge variant={a.tipo === 'Militar' ? 'red' : 'blue'}>{a.tipo}</Badge> },
                    `${a.capacidade} pax`,
                    `${a.alcance} km`,
                    { content: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: '#f1f3f7', borderRadius: 99, minWidth: 80 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#059669' : '#007CC3', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: '#9ca3af', width: 28 }}>{pct}%</span>
                      </div>
                    )},
                    { content: <span style={{ fontSize: 11, color: '#9ca3af' }}>Ver →</span> }
                  ]
                }
              })}
            />
        }
      </Card>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// AERONAVE DETALHE
// ─────────────────────────────────────────────────────────────
function AeroDetalhe({ aero, onBack }) {
  const { aeronaves, iniciarEtapa, concluirEtapa, funcionarios } = useApp()
  const live = aeronaves.find(a => a.id === aero.id) || aero
  const pct = live.etapas.length ? Math.round((live.etapas.filter(e => e.status === 'Concluído').length / live.etapas.length) * 100) : 0

  return (
    <div className="animate-fade-up">
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, fontWeight: 600, marginBottom: 20, padding: 0 }}
        onMouseEnter={e => e.currentTarget.style.color = '#007CC3'}
        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #003366, #007CC3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plane size={26} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: '#007CC3', fontWeight: 600, marginBottom: 2 }}>{live.codigo}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#003366', letterSpacing: '-0.5px' }}>{live.modelo}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                {live.tipo} · {live.capacidade} pax · {live.alcance} km
              </div>
            </div>
          </div>
        </Card>
        <Card style={{ minWidth: 160, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Progresso</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: pct === 100 ? '#059669' : '#007CC3', letterSpacing: '-1px', marginBottom: 8 }}>{pct}%</div>
          <div style={{ height: 4, background: '#f1f3f7', borderRadius: 99 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#059669' : '#007CC3', borderRadius: 99, transition: 'width 0.5s' }} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Etapas */}
        <Card padding="0">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>
            Etapas de Produção
          </div>
          {live.etapas.length === 0 ? <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhuma etapa vinculada.</div>
            : <div style={{ padding: 12 }}>
                {live.etapas.map((e, idx) => (
                  <div key={e.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: '#fafbfc', marginBottom: 8, border: '1px solid #f1f3f7' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{idx + 1}. {e.nome}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, fontFamily: 'JetBrains Mono' }}>prazo: {e.prazo} · {e.funcionarios.length} resp.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {badgeForStatus(e.status)}
                      {e.status === 'Pendente' && <Btn size="sm" variant="outline" onClick={() => iniciarEtapa(live.id, e.id)}>Iniciar</Btn>}
                      {e.status === 'Em Andamento' && <Btn size="sm" variant="success" onClick={() => concluirEtapa(live.id, e.id)}>✓</Btn>}
                    </div>
                  </div>
                ))}
              </div>
          }
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Peças */}
          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>Peças ({live.pecas.length})</div>
            {live.pecas.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhuma peça.</div>
              : live.pecas.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: i < live.pecas.length - 1 ? '1px solid #f8f9fb' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{p.nome}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>{p.fornecedor}</div>
                  </div>
                  {badgeForStatus(p.status)}
                </div>
              ))
            }
          </Card>

          {/* Testes */}
          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>Testes ({live.testes.length})</div>
            {live.testes.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhum teste realizado.</div>
              : live.testes.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: i < live.testes.length - 1 ? '1px solid #f8f9fb' : 'none' }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{t.tipo}</span>
                  {badgeForStatus(t.resultado)}
                </div>
              ))
            }
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// AERONAVES VIEW
// ─────────────────────────────────────────────────────────────
function ViewAeronaves({ setView, setSelectedAero }) {
  const { aeronaves, addAeronave } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ codigo: '', modelo: '', tipo: 'Comercial', capacidade: '', alcance: '' })
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = () => {
    if (!form.codigo || !form.modelo || !form.capacidade || !form.alcance) return
    if (addAeronave({ ...form, capacidade: Number(form.capacidade), alcance: Number(form.alcance) })) {
      setModal(false); setForm({ codigo: '', modelo: '', tipo: 'Comercial', capacidade: '', alcance: '' })
    }
  }

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle sub="Gerencie a frota de aeronaves em produção">Aeronaves</SectionTitle>
        <Btn icon={PlusCircle} onClick={() => setModal(true)}>Cadastrar Aeronave</Btn>
      </div>

      <Card padding="0">
        <Table
          headers={['Código', 'Modelo', 'Tipo', 'Capacidade', 'Alcance', 'Peças', 'Etapas', 'Testes', '']}
          empty="Nenhuma aeronave cadastrada."
          rows={aeronaves.map(a => ({
            _onClick: () => { setSelectedAero(a); setView('aeroDetalhe') },
            cells: [
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#007CC3', fontWeight: 600, fontSize: 12 }}>{a.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{a.modelo}</span> },
              { content: <Badge variant={a.tipo === 'Militar' ? 'red' : 'blue'}>{a.tipo}</Badge> },
              `${a.capacidade} pax`,
              `${a.alcance} km`,
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{a.pecas.length}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{a.etapas.length}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{a.testes.length}</span> },
              { content: <span style={{ color: '#9ca3af', fontSize: 11 }}>Ver detalhes →</span> },
            ]
          }))}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Cadastrar Aeronave">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Código"><FInput value={form.codigo} onChange={f('codigo')} placeholder="AC-300" /></FormField>
          <FormField label="Modelo"><FInput value={form.modelo} onChange={f('modelo')} placeholder="Boeing 737" /></FormField>
          <FormField label="Tipo">
            <FSelect value={form.tipo} onChange={f('tipo')}>
              {ENUMS.TipoAeronave.map(t => <option key={t}>{t}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Capacidade (pax)"><FInput type="number" value={form.capacidade} onChange={f('capacidade')} /></FormField>
          <FormField label="Alcance (km)"><FInput type="number" value={form.alcance} onChange={f('alcance')} /></FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={submit} icon={PlusCircle}>Cadastrar</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PEÇAS VIEW
// ─────────────────────────────────────────────────────────────
function ViewPecas() {
  const { aeronaves, addPeca, updateStatusPeca } = useApp()
  const [modal, setModal] = useState(null) // 'add' | 'status'
  const [form, setForm] = useState({ aeroId: '', nome: '', tipo: 'Nacional', fornecedor: '' })
  const [stForm, setStForm] = useState({ aeroId: '', pecaIdx: '', status: 'Pronta' })
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const sf = (k) => (e) => setStForm(p => ({ ...p, [k]: e.target.value }))

  const allPecas = aeronaves.flatMap(a => a.pecas.map((p, i) => ({ ...p, _aero: a, _idx: i })))

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle sub="Componentes associados às aeronaves">Peças</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={() => setModal('status')} icon={RefreshCw}>Mudar Status</Btn>
          <Btn size="sm" onClick={() => setModal('add')} icon={PlusCircle}>Adicionar Peça</Btn>
        </div>
      </div>

      <Card padding="0">
        <Table
          headers={['Aeronave', 'Peça', 'Tipo', 'Fornecedor', 'Status']}
          empty="Nenhuma peça cadastrada."
          rows={allPecas.map(p => ({
            cells: [
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#007CC3', fontSize: 12, fontWeight: 600 }}>{p._aero.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{p.nome}</span> },
              { content: <Badge variant={p.tipo === 'Importada' ? 'purple' : 'gray'}>{p.tipo}</Badge> },
              p.fornecedor,
              { content: badgeForStatus(p.status) },
            ]
          }))}
        />
      </Card>

      <Modal open={modal === 'add'} onClose={() => setModal(null)} title="Adicionar Peça">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={form.aeroId} onChange={f('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Nome da Peça"><FInput value={form.nome} onChange={f('nome')} /></FormField>
          <FormField label="Tipo">
            <FSelect value={form.tipo} onChange={f('tipo')}>
              {ENUMS.TipoPeca.map(t => <option key={t}>{t}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Fornecedor"><FInput value={form.fornecedor} onChange={f('fornecedor')} /></FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
          <Btn onClick={() => { if (form.aeroId && form.nome && form.fornecedor) { addPeca(Number(form.aeroId), { nome: form.nome, tipo: form.tipo, fornecedor: form.fornecedor, status: 'Em Produção' }); setModal(null) } }}>Adicionar</Btn>
        </div>
      </Modal>

      <Modal open={modal === 'status'} onClose={() => setModal(null)} title="Mudar Status da Peça">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={stForm.aeroId} onChange={e => setStForm(p => ({ ...p, aeroId: e.target.value, pecaIdx: '' }))}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Peça">
            <FSelect value={stForm.pecaIdx} onChange={sf('pecaIdx')}>
              <option value="">Selecione...</option>
              {(aeronaves.find(a => a.id === Number(stForm.aeroId))?.pecas || []).map((p, i) => <option key={i} value={i}>{p.nome}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Novo Status">
            <FSelect value={stForm.status} onChange={sf('status')}>
              {ENUMS.StatusPeca.map(s => <option key={s}>{s}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
          <Btn onClick={() => { if (stForm.aeroId && stForm.pecaIdx !== '') { updateStatusPeca(Number(stForm.aeroId), Number(stForm.pecaIdx), stForm.status); setModal(null) } }}>Atualizar</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// ETAPAS VIEW
// ─────────────────────────────────────────────────────────────
function ViewEtapas() {
  const { aeronaves, addEtapa, iniciarEtapa, concluirEtapa } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ aeroId: '', nome: '', prazo: '' })
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const allEtapas = aeronaves.flatMap(a => a.etapas.map(e => ({ ...e, _aero: a })))

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle sub="Controle sequencial do processo produtivo">Etapas de Produção</SectionTitle>
        <Btn icon={PlusCircle} onClick={() => setModal(true)}>Adicionar Etapa</Btn>
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 20 }}>
        <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 12, color: '#92400e', fontWeight: 500 }}>
          <strong>Regra de sequenciamento:</strong> Uma nova etapa só pode ser adicionada se não houver etapas pendentes. Cada etapa deve ser iniciada e concluída em ordem.
        </div>
      </div>

      <Card padding="0">
        <Table
          headers={['Aeronave', 'Etapa', 'Prazo', 'Responsáveis', 'Status', 'Ações']}
          empty="Nenhuma etapa cadastrada."
          rows={allEtapas.map(e => ({
            cells: [
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#007CC3', fontSize: 12, fontWeight: 600 }}>{e._aero.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{e.nome}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{e.prazo}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{e.funcionarios.length}</span> },
              { content: badgeForStatus(e.status) },
              { content: (
                <div style={{ display: 'flex', gap: 6 }}>
                  {e.status === 'Pendente' && <Btn size="sm" variant="outline" icon={Play} onClick={() => iniciarEtapa(e._aero.id, e.id)}>Iniciar</Btn>}
                  {e.status === 'Em Andamento' && <Btn size="sm" variant="success" icon={CheckCircle} onClick={() => concluirEtapa(e._aero.id, e.id)}>Concluir</Btn>}
                  {e.status === 'Concluído' && <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>✓ Concluído</span>}
                </div>
              )}
            ]
          }))}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Adicionar Etapa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={form.aeroId} onChange={f('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Nome da Etapa"><FInput value={form.nome} onChange={f('nome')} placeholder="Ex: Montagem de Fuselagem" /></FormField>
          <FormField label="Prazo"><FInput type="date" value={form.prazo} onChange={f('prazo')} /></FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (form.aeroId && form.nome && form.prazo) {
              if (addEtapa(Number(form.aeroId), { nome: form.nome, prazo: form.prazo, status: 'Pendente' })) {
                setModal(false); setForm({ aeroId: '', nome: '', prazo: '' })
              }
            }
          }}>Adicionar</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// TESTES VIEW
// ─────────────────────────────────────────────────────────────
function ViewTestes() {
  const { aeronaves, addTeste } = useApp()
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ aeroId: '', tipo: 'Elétrico', resultado: 'Aprovado' })
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const allTestes = aeronaves.flatMap(a => a.testes.map(t => ({ ...t, _aero: a })))

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle sub="Registros de qualidade e validação">Testes Técnicos</SectionTitle>
        <Btn icon={FlaskConical} onClick={() => setModal(true)}>Registrar Teste</Btn>
      </div>
      <Card padding="0">
        <Table
          headers={['Aeronave', 'Tipo de Teste', 'Resultado']}
          empty="Nenhum teste registrado."
          rows={allTestes.map(t => ({
            cells: [
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#007CC3', fontSize: 12, fontWeight: 600 }}>{t._aero.codigo}</span> },
              t.tipo,
              { content: badgeForStatus(t.resultado) },
            ]
          }))}
        />
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Registrar Teste">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={form.aeroId} onChange={f('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Tipo de Teste">
            <FSelect value={form.tipo} onChange={f('tipo')}>
              {ENUMS.TipoTeste.map(t => <option key={t}>{t}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Resultado">
            <FSelect value={form.resultado} onChange={f('resultado')}>
              {ENUMS.ResultadoTeste.map(r => <option key={r}>{r}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={() => { if (form.aeroId) { addTeste(Number(form.aeroId), { tipo: form.tipo, resultado: form.resultado }); setModal(false) } }}>Registrar</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FUNCIONÁRIOS VIEW
// ─────────────────────────────────────────────────────────────
function ViewFuncionarios() {
  const { funcionarios, aeronaves, addFuncionario, assocFuncionario, user } = useApp()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivel: 'Operador', cargo: '' })
  const [aForm, setAForm] = useState({ aeroId: '', etapaId: '', funcId: '' })
  const [verEtapa, setVerEtapa] = useState({ aeroId: '', etapaId: '' })
  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const af = (k) => (e) => setAForm(p => ({ ...p, [k]: e.target.value }))

  const aeroSel = aeronaves.find(a => a.id === Number(aForm.aeroId))
  const aeroVer = aeronaves.find(a => a.id === Number(verEtapa.aeroId))
  const etapaVer = aeroVer?.etapas.find(e => e.id === Number(verEtapa.etapaId))
  const funcsEtapa = etapaVer ? etapaVer.funcionarios.map(fid => funcionarios.find(f => f.id === fid)).filter(Boolean) : []

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle sub="Equipe técnica e operacional">Funcionários</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" icon={UserCheck} onClick={() => setModal('assoc')}>Associar a Etapa</Btn>
          <Btn variant="ghost" size="sm" icon={Users} onClick={() => setModal('ver')}>Ver Membros</Btn>
          {user?.nivel === 'Administrador' && <Btn size="sm" icon={UserPlus} onClick={() => setModal('novo')}>Novo Funcionário</Btn>}
        </div>
      </div>

      <Card padding="0">
        <Table
          headers={['ID', 'Nome', 'Usuário', 'Telefone', 'Cargo', 'Nível']}
          rows={funcionarios.map(f => ({
            cells: [
              { content: <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{String(f.id).padStart(3, '0')}</span> },
              { content: <span style={{ fontWeight: 600 }}>{f.nome}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#6b7280', fontSize: 12 }}>@{f.usuario}</span> },
              f.telefone || '—',
              f.cargo,
              { content: <Badge variant={f.nivel === 'Administrador' ? 'red' : f.nivel === 'Engenheiro' ? 'blue' : 'green'}>{f.nivel}</Badge> },
            ]
          }))}
        />
      </Card>

      {/* Novo funcionário */}
      <Modal open={modal === 'novo'} onClose={() => setModal(null)} title="Novo Funcionário">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Nome"><FInput value={form.nome} onChange={f('nome')} /></FormField>
          <FormField label="Telefone"><FInput value={form.telefone} onChange={f('telefone')} /></FormField>
          <FormField label="Endereço"><FInput value={form.endereco} onChange={f('endereco')} /></FormField>
          <FormField label="Cargo"><FInput value={form.cargo} onChange={f('cargo')} /></FormField>
          <FormField label="Usuário"><FInput value={form.usuario} onChange={f('usuario')} /></FormField>
          <FormField label="Senha"><FInput type="password" value={form.senha} onChange={f('senha')} /></FormField>
          <FormField label="Nível de Acesso">
            <FSelect value={form.nivel} onChange={f('nivel')}>
              {ENUMS.NivelPermissao.map(n => <option key={n}>{n}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
          <Btn onClick={() => { if (addFuncionario(form)) setModal(null) }}>Cadastrar</Btn>
        </div>
      </Modal>

      {/* Associar */}
      <Modal open={modal === 'assoc'} onClose={() => setModal(null)} title="Associar Funcionário a Etapa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={aForm.aeroId} onChange={e => setAForm(p => ({ ...p, aeroId: e.target.value, etapaId: '' }))}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Etapa">
            <FSelect value={aForm.etapaId} onChange={af('etapaId')}>
              <option value="">Selecione...</option>
              {(aeroSel?.etapas || []).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Funcionário">
            <FSelect value={aForm.funcId} onChange={af('funcId')}>
              <option value="">Selecione...</option>
              {funcionarios.map(fc => <option key={fc.id} value={fc.id}>{fc.nome}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
          <Btn onClick={() => { if (aForm.aeroId && aForm.etapaId && aForm.funcId) { assocFuncionario(Number(aForm.aeroId), Number(aForm.etapaId), Number(aForm.funcId)); setModal(null) } }}>Associar</Btn>
        </div>
      </Modal>

      {/* Ver membros por etapa */}
      <Modal open={modal === 'ver'} onClose={() => setModal(null)} title="Membros por Etapa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          <FormField label="Aeronave">
            <FSelect value={verEtapa.aeroId} onChange={e => setVerEtapa({ aeroId: e.target.value, etapaId: '' })}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Etapa">
            <FSelect value={verEtapa.etapaId} onChange={e => setVerEtapa(p => ({ ...p, etapaId: e.target.value }))}>
              <option value="">Selecione...</option>
              {(aeroVer?.etapas || []).map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
            </FSelect>
          </FormField>
        </div>
        {etapaVer && (
          funcsEtapa.length === 0
            ? <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: 10, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Nenhum funcionário nesta etapa.</div>
            : funcsEtapa.map(fc => (
              <div key={fc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{fc.nome}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{fc.cargo}</div>
                </div>
                <Badge variant={fc.nivel === 'Administrador' ? 'red' : fc.nivel === 'Engenheiro' ? 'blue' : 'green'}>{fc.nivel}</Badge>
              </div>
            ))
        )}
      </Modal>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RELATÓRIO VIEW
// ─────────────────────────────────────────────────────────────
function ViewRelatorio() {
  const { aeronaves } = useApp()
  const [aeroId, setAeroId] = useState('')
  const [cliente, setCliente] = useState('')
  const [data, setData] = useState('')
  const [relatorio, setRelatorio] = useState('')

  const gerar = () => {
    const a = aeronaves.find(x => x.id === Number(aeroId))
    if (!a || !cliente) return
    const lines = [
      '═══════════════════════════════════════════',
      '         RELATÓRIO TÉCNICO — AEROCODE      ',
      '═══════════════════════════════════════════',
      '',
      `AERONAVE : ${a.codigo} — ${a.modelo}`,
      `TIPO     : ${a.tipo}`,
      `CAPACID. : ${a.capacidade} passageiros`,
      `ALCANCE  : ${a.alcance} km`,
      '',
      `CLIENTE  : ${cliente}`,
      `ENTREGA  : ${data || 'A definir'}`,
      '',
      '───────────────────────────────────────────',
      'ETAPAS DE PRODUÇÃO:',
      '───────────────────────────────────────────',
      ...(a.etapas.length ? a.etapas.map((e, i) => `  ${i + 1}. ${e.nome} [${e.status}] — prazo: ${e.prazo}`) : ['  Nenhuma etapa registrada.']),
      '',
      '───────────────────────────────────────────',
      'PEÇAS UTILIZADAS:',
      '───────────────────────────────────────────',
      ...(a.pecas.length ? a.pecas.map(p => `  • ${p.nome} (${p.tipo}) — ${p.fornecedor} — ${p.status}`) : ['  Nenhuma peça registrada.']),
      '',
      '───────────────────────────────────────────',
      'RESULTADOS DOS TESTES:',
      '───────────────────────────────────────────',
      ...(a.testes.length ? a.testes.map(t => `  [${t.resultado.toUpperCase()}] ${t.tipo}`) : ['  Nenhum teste realizado.']),
      '',
      '═══════════════════════════════════════════',
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      '═══════════════════════════════════════════',
    ]
    setRelatorio(lines.join('\n'))
  }

  const baixar = () => {
    const blob = new Blob([relatorio], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = `relatorio_${Date.now()}.txt`; link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="animate-fade-up">
      <SectionTitle sub="Geração do documento de entrega ao cliente">Relatório Final</SectionTitle>

      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={aeroId} onChange={e => setAeroId(e.target.value)}>
              <option value="">Selecione...</option>
              {aeronaves.map(a => <option key={a.id} value={a.id}>{a.codigo} — {a.modelo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Nome do Cliente"><FInput value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Ex: Azul Linhas Aéreas" /></FormField>
          <FormField label="Data de Entrega"><FInput type="date" value={data} onChange={e => setData(e.target.value)} /></FormField>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <Btn onClick={gerar} icon={FileText}>Gerar Relatório</Btn>
          {relatorio && <Btn variant="ghost" onClick={baixar} icon={Download}>Baixar .txt</Btn>}
        </div>
      </Card>

      {relatorio && (
        <Card>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#374151', whiteSpace: 'pre-wrap', lineHeight: 1.9, background: '#f8f9fb', padding: 20, borderRadius: 10, border: '1px solid #e8eaed' }}>
            {relatorio}
          </div>
        </Card>
      )}
    </div>
  )
}


// LOGIN

function Login() {
  const { login } = useApp()
  const [hov, setHov] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      {/* Left panel — photo */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        <img
          src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1974&auto=format&fit=crop"
          alt="Aeronave"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,51,102,0.75) 0%, rgba(0,124,195,0.4) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Sistema de Controle de Produção</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', maxWidth: 340 }}>
            Gestão completa do ciclo de produção aeronáutica
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
            {['Rastreamento de Etapas', 'Controle de Peças', 'Testes Técnicos'].map(t => (
              <div key={t} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 60px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ marginBottom: 40 }}>
            <Logo size="lg" />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 4 }}>Bem-vindo de volta</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Acesse o painel de controle</div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Usuário:</label>
            <div style={{ padding: '11px 14px', border: '1.5px solid #e8eaed', borderRadius: 10, fontSize: 13, background: '#f8f9fb', color: '#9ca3af', fontStyle: 'italic' }}>
              (qualquer usuário)
            </div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Senha:</label>
            <div style={{ padding: '11px 14px', border: '1.5px solid #e8eaed', borderRadius: 10, fontSize: 13, background: '#f8f9fb', color: '#9ca3af', fontStyle: 'italic' }}>
              (qualquer senha)
            </div>
          </div>

          <button
            onClick={login}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              width: '100%', padding: '13px', border: 'none', borderRadius: 12, cursor: 'pointer',
              background: hov ? '#004080' : '#003366', color: '#fff',
              fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.15s', boxShadow: hov ? '0 8px 24px rgba(0,51,102,0.35)' : '0 4px 12px rgba(0,51,102,0.2)'
            }}
          >
            LOGIN
          </button>

          <div style={{ marginTop: 20, padding: '14px 16px', background: '#f8f9fb', borderRadius: 10, fontSize: 11 }}>
            <div style={{ fontWeight: 700, color: '#6b7280', marginBottom: 6, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Protótipo — sem validação de credenciais</div>
            <div style={{ color: '#9ca3af', lineHeight: 1.7 }}>
              Clique em LOGIN para entrar como <strong>Roberto Silva</strong> (Administrador)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
function MainApp() {
  const { user } = useApp()
  const [view, setView] = useState('dashboard')
  const [selectedAero, setSelectedAero] = useState(null)

  if (!user) return <Login />

  const views = {
    dashboard: <Dashboard setView={setView} setSelectedAero={setSelectedAero} />,
    aeronaves: <ViewAeronaves setView={setView} setSelectedAero={setSelectedAero} />,
    aeroDetalhe: selectedAero ? <AeroDetalhe aero={selectedAero} onBack={() => setView('aeronaves')} /> : null,
    pecas: <ViewPecas />,
    etapas: <ViewEtapas />,
    testes: <ViewTestes />,
    funcionarios: <ViewFuncionarios />,
    relatorio: <ViewRelatorio />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar current={view} setCurrent={setView} />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f9fb' }}>
        <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto' }}>
          {views[view] || views.dashboard}
        </div>
      </main>
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}