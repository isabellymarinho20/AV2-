import { useState, createContext, useContext, useCallback, ReactNode } from 'react'
import type {
  Aeronave, Funcionario, Peca, Etapa, Teste,
  StatusPeca, ToastState, AppContextValue,
  TipoAeronave, NivelPermissao,
} from '../types'

export const ENUMS = {
  TipoAeronave:   ['Comercial', 'Militar']                           as const,
  TipoPeca:       ['Nacional', 'Importada']                          as const,
  StatusPeca:     ['Em Produção', 'Em Transporte', 'Pronta']         as const,
  StatusEtapa:    ['Pendente', 'Em Andamento', 'Concluído']          as const,
  NivelPermissao: ['Administrador', 'Engenheiro', 'Operador']        as const,
  TipoTeste:      ['Elétrico', 'Hidráulico', 'Aerodinâmico']        as const,
  ResultadoTeste: ['Aprovado', 'Reprovado']                          as const,
}

const SEED: { aeronaves: Aeronave[]; funcionarios: Funcionario[] } = {
  aeronaves: [
    {
      id: 1,
      codigo: '1',
      modelo: 'aviao',
      tipo: 'Comercial',
      capacidade: 10,
      alcance: 3650,
      pecas: [
        { nome: 'Motor1', tipo: 'Importada', fornecedor: 'Embraer', status: 'Pronta' },
      ],
      etapas: [
        { id: 101, nome: 'Montagem ', status: 'Concluído', prazo: '2025-03-10', funcionarios: [1, 3] },
      ],
      testes: [
        { tipo: 'Elétrico', resultado: 'Aprovado' },
      ],
    },
    {
      id: 2,
      codigo: '2',
      modelo: 'aviao2',
      tipo: 'Militar',
      capacidade: 1,
      alcance: 4000,
      pecas: [
        { nome: 'Motor2', tipo: 'Importada', fornecedor: 'Embraer', status: 'Em Transporte' },
      ],
      etapas: [
        { id: 201, nome: 'Integração', status: 'Em Andamento', prazo: '2025-04-15', funcionarios: [2, 4] },
      ],
      testes: [
        { tipo: 'Aerodinâmico', resultado: 'Aprovado' },
      ],
    },
    {
      id: 3,
      codigo: '3',
      modelo: 'aviao3',
      tipo: 'Militar',
      capacidade: 80,
      alcance: 5800,
      pecas: [
        { nome: 'Motor3', tipo: 'Importada', fornecedor: 'Embraer', status: 'Em Produção' },
      ],
      etapas: [
        { id: 301, nome: 'Estrutura ', status: 'Pendente', prazo: '2025-06-01', funcionarios: [] },
      ],
      testes: [],
    },
    {
      id: 4,
      codigo: '4',
      modelo: 'aviao4',
      tipo: 'Comercial',
      capacidade: 12,
      alcance: 5600,
      pecas: [
        { nome: 'Motor 5', tipo: 'Importada', fornecedor: 'Embraer', status: 'Pronta' },
      ],
      etapas: [
        { id: 401, nome: 'Instalação ', status: 'Concluído', prazo: '2025-02-28', funcionarios: [5, 6] },
      ],
      testes: [
        { tipo: 'Hidráulico', resultado: 'Aprovado' },
      ],
    },
    {
      id: 5,
      codigo: '5',
      modelo: 'aviao5',
      tipo: 'Militar',
      capacidade: 2,
      alcance: 1330,
      pecas: [
        { nome: 'Sistema ', tipo: 'Nacional', fornecedor: 'Embraer', status: 'Em Produção' },
      ],
      etapas: [
        { id: 501, nome: 'Montagem 2', status: 'Pendente', prazo: '2025-07-10', funcionarios: [] },
      ],
      testes: [],
    },
  ],

  funcionarios: [
    {
      id: 1,
      nome: 'Isabelly Administrativo',
      telefone: '(12) 9999-1001',
      endereco: 'Av. Santos Dumont, 100 — São José dos Campos',
      usuario: 'isa.admin',
      senha: '123',
      nivel: 'Administrador' as NivelPermissao,
      cargo: 'Administradora do Sistema',
    },
    {
      id: 2,
      nome: 'Isabelly Engenharia',
      telefone: '(12) 9988-2002',
      endereco: 'Rua Eng. Álvaro Rodrigues, 45 — São José dos Campos',
      usuario: 'isa.eng',
      senha: '456',
      nivel: 'Engenheiro' as NivelPermissao,
      cargo: 'Engenheira de Produção',
    },
    {
      id: 3,
      nome: 'Operador 01',
      telefone: '(12) 9977-3003',
      endereco: 'Rua das Indústrias, 200 — Jacareí',
      usuario: 'operador01',
      senha: '789',
      nivel: 'Operador' as NivelPermissao,
      cargo: 'Técnico Operacional',
    },
    {
      id: 4,
      nome: 'Operador 02',
      telefone: '(12) 9966-4004',
      endereco: 'Av. Brasil, 350 — Taubaté',
      usuario: 'operador02',
      senha: '321',
      nivel: 'Operador' as NivelPermissao,
      cargo: 'Técnico de Montagem',
    },
    {
      id: 5,
      nome: 'Engenheiro 01',
      telefone: '(12) 9955-5005',
      endereco: 'Rua XV de Novembro, 78 — São José dos Campos',
      usuario: 'eng01',
      senha: '654',
      nivel: 'Engenheiro' as NivelPermissao,
      cargo: 'Engenheiro de Testes',
    },
    {
      id: 6,
      nome: 'Isabelly Operações',
      telefone: '(12) 9944-6006',
      endereco: 'Rua Paraíba, 12 — São José dos Campos',
      usuario: 'isa.op',
      senha: '987',
      nivel: 'Operador' as NivelPermissao,
      cargo: 'Operadora de Linha',
    },
  ],
}

export const AppCtx = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
//***************************** */
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Funcionario | null>(null)
  const [aeronaves, setAeronaves] = useState<Aeronave[]>(SEED.aeronaves)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(SEED.funcionarios)
  const [toast, setToast] = useState<ToastState | null>(null)

  const notify = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const login = () => setUser(SEED.funcionarios[0])
  const logout = () => setUser(null)

  const addAeronave = (data: Omit<Aeronave, 'id' | 'pecas' | 'etapas' | 'testes'>): boolean => {
    if (aeronaves.find(a => a.codigo === data.codigo)) { notify('Código já existe!', 'error'); return false }
    setAeronaves(p => [...p, { ...data, id: Date.now(), pecas: [], etapas: [], testes: [] }])
    notify('Aeronave cadastrada com sucesso!')
    return true
  }

  const addPeca = (aeroId: number, peca: Peca): boolean => {
    setAeronaves(p => p.map(a => a.id === aeroId ? { ...a, pecas: [...a.pecas, peca] } : a))
    notify('Peça adicionada!')
    return true
  }

  const updateStatusPeca = (aeroId: number, pecaIdx: number, newStatus: StatusPeca): void => {
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, pecas: a.pecas.map((pc, i) => i === pecaIdx ? { ...pc, status: newStatus } : pc) }
      : a))
    notify('Status da peça atualizado!')
  }

  const addEtapa = (aeroId: number, etapa: Omit<Etapa, 'id' | 'funcionarios'>): boolean => {
    const aero = aeronaves.find(a => a.id === aeroId)
    if (aero?.etapas.some(e => e.status === 'Pendente')) {
      notify('Não é possível adicionar etapa com etapa pendente existente!', 'error'); return false
    }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: [...a.etapas, { ...etapa, id: Date.now(), funcionarios: [] }] }
      : a))
    notify('Etapa adicionada!')
    return true
  }

  const iniciarEtapa = (aeroId: number, etapaId: number): boolean => {
    const aero = aeronaves.find(a => a.id === aeroId)
    const idx  = aero?.etapas.findIndex(e => e.id === etapaId) ?? -1
    if (idx > 0 && aero?.etapas[idx - 1]?.status !== 'Concluído') {
      notify('Conclua a etapa anterior primeiro!', 'error'); return false
    }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Em Andamento' } : e) }
      : a))
    notify('Etapa iniciada!')
    return true
  }

  const concluirEtapa = (aeroId: number, etapaId: number): boolean => {
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, status: 'Concluído' } : e) }
      : a))
    notify('Etapa concluída!')
    return true
  }

  const addFuncionario = (data: Omit<Funcionario, 'id'>): boolean => {
    if (funcionarios.find(f => f.usuario === data.usuario)) { notify('Usuário já existe!', 'error'); return false }
    setFuncionarios(p => [...p, { ...data, id: Date.now() }])
    notify('Funcionário cadastrado!')
    return true
  }

  const assocFuncionario = (aeroId: number, etapaId: number, funcId: number): boolean => {
    const aero  = aeronaves.find(a => a.id === aeroId)
    const etapa = aero?.etapas.find(e => e.id === etapaId)
    if (etapa?.funcionarios.includes(funcId)) { notify('Funcionário já associado!', 'error'); return false }
    setAeronaves(p => p.map(a => a.id === aeroId
      ? { ...a, etapas: a.etapas.map(e => e.id === etapaId ? { ...e, funcionarios: [...e.funcionarios, funcId] } : e) }
      : a))
    notify('Funcionário associado à etapa!')
    return true
  }

  const addTeste = (aeroId: number, teste: Teste): boolean => {
    setAeronaves(p => p.map(a => a.id === aeroId ? { ...a, testes: [...a.testes, teste] } : a))
    notify('Teste registrado!')
    return true
  }

  return (
    <AppCtx.Provider value={{
      user, login, logout,
      aeronaves, funcionarios,
      toast, notify,
      addAeronave, addPeca, updateStatusPeca,
      addEtapa, iniciarEtapa, concluirEtapa,
      addFuncionario, assocFuncionario,
      addTeste,
    }}>
      {children}
    </AppCtx.Provider>
  )
}
