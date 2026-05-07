import { useState, ChangeEvent } from 'react'
import { UserPlus, UserCheck, Users } from 'lucide-react'
import { useApp, ENUMS } from '../context/AppContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FInput, FSelect } from '../components/ui/FormField'
import Modal from '../components/Modal'
import type { Funcionario, NivelPermissao } from '../types'

export default function ViewFuncionarios() {
  const { funcionarios, aeronaves, addFuncionario, assocFuncionario, user } = useApp()
  const [modalAberto, setModalAberto] = useState<string | null>(null)
  const [formNovoFunc, setFormNovoFunc] = useState({ nome: '', telefone: '', endereco: '', usuario: '', senha: '', nivel: 'Operador', cargo: '' })
  const [formAssoc, setFormAssoc] = useState({ aeroId: '', etapaId: '', funcId: '' })
  const [filtroMembros, setFiltroMembros] = useState({ aeroId: '', etapaId: '' })

  const handleChangeFunc = (campo: keyof typeof formNovoFunc) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormNovoFunc(prev => ({ ...prev, [campo]: e.target.value }))

  const handleChangeAssoc = (campo: keyof typeof formAssoc) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormAssoc(prev => ({ ...prev, [campo]: e.target.value }))

  const aeronaveAssoc = aeronaves.find(aeronave => aeronave.id === Number(formAssoc.aeroId))
  const aeronaveVer   = aeronaves.find(aeronave => aeronave.id === Number(filtroMembros.aeroId))
  const etapaVer      = aeronaveVer?.etapas.find(etapa => etapa.id === Number(filtroMembros.etapaId))

  const membrosEtapa: Funcionario[] = etapaVer
    ? etapaVer.funcionarios.map(id => funcionarios.find(func => func.id === id)).filter((func): func is Funcionario => func !== undefined)
    : []

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle >Funcionários</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" icon={UserCheck} onClick={() => setModalAberto('assoc')}>Associar a Etapa</Btn>
          <Btn variant="ghost" size="sm" icon={Users}     onClick={() => setModalAberto('ver')}>Ver Membros</Btn>
          {user?.nivel === 'Administrador' && (
            <Btn size="sm" icon={UserPlus} onClick={() => setModalAberto('novo')}>Novo Funcionário</Btn>
          )}
        </div>
      </div>

      <Card padding="0">
        <Table
          headers={['ID', 'Nome', 'Usuário', 'Telefone', 'Cargo', 'Nível']}
          rows={funcionarios.map(funcionario => ({
            cells: [
              { content: <span style={{ fontSize: 11 }}>{String(funcionario.id).padStart(3, '0')}</span> },
              { content: <span style={{ fontWeight: 600 }}>{funcionario.nome}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', color: '#6b7280', fontSize: 12 }}>@{funcionario.usuario}</span> },
              funcionario.telefone || '—',
              funcionario.cargo,
              { content: <Badge variant={funcionario.nivel === 'Administrador' ? 'red' : funcionario.nivel === 'Engenheiro' ? 'blue' : 'green'}>{funcionario.nivel}</Badge> },
            ],
          }))}
        />
      </Card>

      <Modal open={modalAberto === 'novo'} onClose={() => setModalAberto(null)} title="Novo Funcionário">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Nome"><FInput value={formNovoFunc.nome} onChange={handleChangeFunc('nome')} /></FormField>
          <FormField label="Telefone"><FInput value={formNovoFunc.telefone} onChange={handleChangeFunc('telefone')} /></FormField>
          <FormField label="Endereço"><FInput value={formNovoFunc.endereco} onChange={handleChangeFunc('endereco')} /></FormField>
          <FormField label="Cargo"><FInput value={formNovoFunc.cargo} onChange={handleChangeFunc('cargo')} /></FormField>
          <FormField label="Usuário"><FInput value={formNovoFunc.usuario} onChange={handleChangeFunc('usuario')} /></FormField>
          <FormField label="Senha"><FInput type="password" value={formNovoFunc.senha} onChange={handleChangeFunc('senha')} /></FormField>
          <FormField label="Nível de Acesso">
            <FSelect value={formNovoFunc.nivel} onChange={handleChangeFunc('nivel')}>
              {ENUMS.NivelPermissao.map(nivel => <option key={nivel}>{nivel}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(null)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (addFuncionario({ ...formNovoFunc, nivel: formNovoFunc.nivel as NivelPermissao })) setModalAberto(null)
          }}>Cadastrar</Btn>
        </div>
      </Modal>

      <Modal open={modalAberto === 'assoc'} onClose={() => setModalAberto(null)} title="Associar Funcionário a Etapa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={formAssoc.aeroId} onChange={e => setFormAssoc(prev => ({ ...prev, aeroId: e.target.value, etapaId: '' }))}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo} — {aeronave.modelo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Etapa">
            <FSelect value={formAssoc.etapaId} onChange={handleChangeAssoc('etapaId')}>
              <option value="">Selecione...</option>
              {(aeronaveAssoc?.etapas || []).map(etapa => (
                <option key={etapa.id} value={etapa.id}>{etapa.nome}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Funcionário">
            <FSelect value={formAssoc.funcId} onChange={handleChangeAssoc('funcId')}>
              <option value="">Selecione...</option>
              {funcionarios.map(funcionario => (
                <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
              ))}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(null)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (formAssoc.aeroId && formAssoc.etapaId && formAssoc.funcId) {
              assocFuncionario(Number(formAssoc.aeroId), Number(formAssoc.etapaId), Number(formAssoc.funcId))
              setModalAberto(null)
            }
          }}>Associar</Btn>
        </div>
      </Modal>

      <Modal open={modalAberto === 'ver'} onClose={() => setModalAberto(null)} title="Membros por Etapa">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
          <FormField label="Aeronave">
            <FSelect value={filtroMembros.aeroId} onChange={e => setFiltroMembros({ aeroId: e.target.value, etapaId: '' })}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Etapa">
            <FSelect value={filtroMembros.etapaId} onChange={e => setFiltroMembros(prev => ({ ...prev, etapaId: e.target.value }))}>
              <option value="">Selecione...</option>
              {(aeronaveVer?.etapas || []).map(etapa => (
                <option key={etapa.id} value={etapa.id}>{etapa.nome}</option>
              ))}
            </FSelect>
          </FormField>
        </div>
        {etapaVer && (
          membrosEtapa.length === 0
            ? <div style={{ padding: '16px', background: '#f8f9fb', borderRadius: 10, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Nenhum funcionário nesta etapa.</div>
            : membrosEtapa.map(funcionario => (
              <div key={funcionario.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8f9fb', borderRadius: 10, marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{funcionario.nome}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{funcionario.cargo}</div>
                </div>
                <Badge variant={funcionario.nivel === 'Administrador' ? 'red' : funcionario.nivel === 'Engenheiro' ? 'blue' : 'green'}>
                  {funcionario.nivel}
                </Badge>
              </div>
            ))
        )}
      </Modal>
    </div>
  )
}
