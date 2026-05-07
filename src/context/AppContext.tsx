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

export const AppCtx = createContext<AppContextValue | null>(null)

export function useApp(): AppContextValue {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

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
