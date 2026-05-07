export type TipoAeronave  = 'Comercial' | 'Militar'
export type TipoPeca      = 'Nacional' | 'Importada'
export type StatusPeca    = 'Em Produção' | 'Em Transporte' | 'Pronta'
export type StatusEtapa   = 'Pendente' | 'Em Andamento' | 'Concluído'
export type NivelPermissao = 'Administrador' | 'Engenheiro' | 'Operador'
export type TipoTeste     = 'Elétrico' | 'Hidráulico' | 'Aerodinâmico'
export type ResultadoTeste = 'Aprovado' | 'Reprovado'
export type ToastType     = 'success' | 'error'

export type View =
  | 'dashboard'
  | 'aeronaves'
  | 'aeroDetalhe'
  | 'pecas'
  | 'etapas'
  | 'testes'
  | 'funcionarios'
  | 'relatorio'

export interface Peca {
  nome: string
  tipo: TipoPeca
  fornecedor: string
  status: StatusPeca
}

export interface Etapa {
  id: number
  nome: string
  status: StatusEtapa
  prazo: string
  funcionarios: number[]
}

export interface Teste {
  tipo: TipoTeste
  resultado: ResultadoTeste
}

export interface Aeronave {
  id: number
  codigo: string
  modelo: string
  tipo: TipoAeronave
  capacidade: number
  alcance: number
  pecas: Peca[]
  etapas: Etapa[]
  testes: Teste[]
}

export interface Funcionario {
  id: number
  nome: string
  telefone: string
  endereco: string
  usuario: string
  senha: string
  nivel: NivelPermissao
  cargo: string
}

export interface ToastState {
  msg: string
  type: ToastType
}

export interface AppContextValue {
  user: Funcionario | null
  login: () => void
  logout: () => void
  aeronaves: Aeronave[]
  funcionarios: Funcionario[]
  toast: ToastState | null
  notify: (msg: string, type?: ToastType) => void
  addAeronave: (data: Omit<Aeronave, 'id' | 'pecas' | 'etapas' | 'testes'>) => boolean
  addPeca: (aeroId: number, peca: Peca) => boolean
  updateStatusPeca: (aeroId: number, pecaIdx: number, newStatus: StatusPeca) => void
  addEtapa: (aeroId: number, etapa: Omit<Etapa, 'id' | 'funcionarios'>) => boolean
  iniciarEtapa: (aeroId: number, etapaId: number) => boolean
  concluirEtapa: (aeroId: number, etapaId: number) => boolean
  addFuncionario: (data: Omit<Funcionario, 'id'>) => boolean
  assocFuncionario: (aeroId: number, etapaId: number, funcId: number) => boolean
  addTeste: (aeroId: number, teste: Teste) => boolean
}
