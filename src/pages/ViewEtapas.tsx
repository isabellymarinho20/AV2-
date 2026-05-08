import { useState, ChangeEvent } from 'react'
import { PlusCircle, AlertTriangle, Play, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { badgeForStatus } from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FInput, FSelect } from '../components/ui/FormField'
import Modal from '../components/Modal'

export default function ViewEtapas() {
  const { aeronaves, addEtapa, iniciarEtapa, concluirEtapa } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [modalStatusAberto, setModalStatusAberto] = useState(false)
  const [etapaSelecionada, setEtapaSelecionada] = useState<any>(null)
  const [form, setForm] = useState({ aeroId: '', nome: '', prazo: '' })
//***************************** */
  const handleChange = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [campo]: e.target.value }))

  const todasAsEtapas = aeronaves.flatMap(aeronave => aeronave.etapas.map(etapa => ({ ...etapa, _aero: aeronave })))

  const abrirModalStatus = (etapa: any) => {
    setEtapaSelecionada(etapa)
    setModalStatusAberto(true)
  }

  const fecharModalStatus = () => {
    setModalStatusAberto(false)
    setEtapaSelecionada(null)
  }

  const mudarStatus = (novoStatus: string) => {
    if (!etapaSelecionada) return

    if (novoStatus === 'Em Andamento') {
      iniciarEtapa(etapaSelecionada._aero.id, etapaSelecionada.id)
    } else if (novoStatus === 'Concluída') {
      concluirEtapa(etapaSelecionada._aero.id, etapaSelecionada.id)
    }

    fecharModalStatus()
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, bgColor: string, borderColor: string) => {
    const btn = e.currentTarget
    btn.style.background = bgColor
    btn.style.borderColor = borderColor
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
    const btn = e.currentTarget
    btn.style.background = isActive ? '#f3f4f6' : '#fff'
    btn.style.borderColor = '#e5e7eb'
  }

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle>Etapas</SectionTitle>
        <Btn icon={PlusCircle} onClick={() => setModalAberto(true)}>Adicionar Etapa</Btn>
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
          rows={todasAsEtapas.map(etapa => ({
            cells: [
              { content: <span style={{ color: '#000000', fontSize: 12, fontWeight: 600 }}>{etapa._aero.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{etapa.nome}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{etapa.prazo}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{etapa.funcionarios.length}</span> },
              { content: badgeForStatus(etapa.status) },
              {
                content: (
                  <button
                    onClick={() => abrirModalStatus(etapa)}
                    style={{
                      background: '#123572',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '6px 12px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    Mudar Status
                  </button>
                )
              }
            ],
          }))}
        />
      </Card>

      {/* Modal Adicionar Etapa */}
      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Adicionar Etapa" width={600}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={form.aeroId} onChange={handleChange('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo} — {aeronave.modelo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Nome da Etapa">
            <FInput value={form.nome} onChange={handleChange('nome')} placeholder="Ex: Montagem de Fuselagem" />
          </FormField>
          <FormField label="Prazo">
            <FInput type="date" value={form.prazo} onChange={handleChange('prazo')} />
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(false)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (form.aeroId && form.nome && form.prazo) {
              if (addEtapa(Number(form.aeroId), { nome: form.nome, prazo: form.prazo, status: 'Pendente' })) {
                setModalAberto(false)
                setForm({ aeroId: '', nome: '', prazo: '' })
              }
            }
          }}>Adicionar</Btn>
        </div>
      </Modal>


      <Modal open={modalStatusAberto} onClose={fecharModalStatus} title="Alterar Status da Etapa" width={550}>
        {etapaSelecionada && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <div style={{ background: '#f3f4f6', padding: 16, borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>ETAPA SELECIONADA</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 8 }}>{etapaSelecionada.nome}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                <strong>Aeronave:</strong> {etapaSelecionada._aero.codigo} — {etapaSelecionada._aero.modelo}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                <strong>Status atual:</strong> {etapaSelecionada.status}
              </div>
            </div>


            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Novo Status</div>


              <button
                onClick={() => mudarStatus('Pendente')}
                disabled={etapaSelecionada.status === 'Pendente'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: etapaSelecionada.status === 'Pendente' ? '#f3f4f6' : '#fff',
                  cursor: etapaSelecionada.status === 'Pendente' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: etapaSelecionada.status === 'Pendente' ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  if (etapaSelecionada.status !== 'Pendente') {
                    handleMouseEnter(e, '#fef3c7', '#fcd34d')
                  }
                }}
                onMouseLeave={e => {
                  handleMouseLeave(e, etapaSelecionada.status === 'Pendente')
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#fbbf24' }} />
                <span style={{ fontWeight: 600, color: '#1f2937' }}>Pendente</span>
              </button>

              {/* Botão Em Andamento */}
              <button
                onClick={() => mudarStatus('Em Andamento')}
                disabled={etapaSelecionada.status === 'Em Andamento'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: etapaSelecionada.status === 'Em Andamento' ? '#f3f4f6' : '#fff',
                  cursor: etapaSelecionada.status === 'Em Andamento' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: etapaSelecionada.status === 'Em Andamento' ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  if (etapaSelecionada.status !== 'Em Andamento') {
                    handleMouseEnter(e, '#dbeafe', '#93c5fd')
                  }
                }}
                onMouseLeave={e => {
                  handleMouseLeave(e, etapaSelecionada.status === 'Em Andamento')
                }}
              >
                <Play size={14} style={{ color: '#3b82f6' }} />
                <span style={{ fontWeight: 600, color: '#1f2937' }}>Em Andamento</span>
              </button>

              {/* Botão Concluída */}
              <button
                onClick={() => mudarStatus('Concluída')}
                disabled={etapaSelecionada.status === 'Concluída'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  background: etapaSelecionada.status === 'Concluída' ? '#f3f4f6' : '#fff',
                  cursor: etapaSelecionada.status === 'Concluída' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: etapaSelecionada.status === 'Concluída' ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  if (etapaSelecionada.status !== 'Concluída') {
                    handleMouseEnter(e, '#dcfce7', '#86efac')
                  }
                }}
                onMouseLeave={e => {
                  handleMouseLeave(e, etapaSelecionada.status === 'Concluída')
                }}
              >
                <CheckCircle size={14} style={{ color: '#10b981' }} />
                <span style={{ fontWeight: 600, color: '#1f2937' }}>Concluída</span>
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={fecharModalStatus}>Cancelar</Btn>
        </div>
      </Modal>
    </div>
  )
}