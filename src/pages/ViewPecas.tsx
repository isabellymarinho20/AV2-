import { useState, ChangeEvent } from 'react'
import { PlusCircle, RefreshCw } from 'lucide-react'
import { useApp, ENUMS } from '../context/AppContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge, { badgeForStatus } from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FInput, FSelect } from '../components/ui/FormField'
import Modal from '../components/Modal'
import type { StatusPeca } from '../types'

export default function ViewPecas() {
  const { aeronaves, addPeca, updateStatusPeca } = useApp()
  const [modalAberto, setModalAberto] = useState<string | null>(null)
  const [formNovaPeca, setFormNovaPeca] = useState({ aeroId: '', nome: '', tipo: 'Nacional', fornecedor: '' })
  const [formStatus, setFormStatus] = useState({ aeroId: '', pecaIdx: '', status: 'Pronta' })

  const handleChangePeca = (campo: keyof typeof formNovaPeca) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormNovaPeca(prev => ({ ...prev, [campo]: e.target.value }))

  const handleChangeStatus = (campo: keyof typeof formStatus) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormStatus(prev => ({ ...prev, [campo]: e.target.value }))

  const todasAsPecas = aeronaves.flatMap(aeronave => aeronave.pecas.map((peca, indice) => ({ ...peca, _aero: aeronave, _idx: indice })))

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle>Peças</SectionTitle>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn variant="ghost" size="sm" onClick={() => setModalAberto('status')} icon={RefreshCw}>Mudar Status</Btn>
          <Btn size="sm" onClick={() => setModalAberto('add')} icon={PlusCircle}>Adicionar Peça</Btn>
        </div>
      </div>

      <Card padding="0">
        <Table
          headers={['Aeronave', 'Peça', 'Tipo', 'Fornecedor', 'Status']}
          empty="Nenhuma peça cadastrada."
          rows={todasAsPecas.map(peca => ({
            cells: [
              { content: <span style={{  color: '#000000', fontSize: 12, fontWeight: 600 }}>{peca._aero.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{peca.nome}</span> },
              { content: <Badge variant={peca.tipo === 'Importada' ? 'purple' : 'gray'}>{peca.tipo}</Badge> },
              peca.fornecedor,
              { content: badgeForStatus(peca.status) },
            ],
          }))}
        />
      </Card>

      <Modal open={modalAberto === 'add'} onClose={() => setModalAberto(null)} title="Adicionar Peça">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={formNovaPeca.aeroId} onChange={handleChangePeca('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo} — {aeronave.modelo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Nome da Peça">
            <FInput value={formNovaPeca.nome} onChange={handleChangePeca('nome')} />
          </FormField>
          <FormField label="Tipo">
            <FSelect value={formNovaPeca.tipo} onChange={handleChangePeca('tipo')}>
              {ENUMS.TipoPeca.map(tipo => <option key={tipo}>{tipo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Fornecedor">
            <FInput value={formNovaPeca.fornecedor} onChange={handleChangePeca('fornecedor')} />
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(null)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (formNovaPeca.aeroId && formNovaPeca.nome && formNovaPeca.fornecedor) {
              addPeca(Number(formNovaPeca.aeroId), {
                nome: formNovaPeca.nome,
                tipo: formNovaPeca.tipo as 'Nacional' | 'Importada',
                fornecedor: formNovaPeca.fornecedor,
                status: 'Em Produção',
              })
              setModalAberto(null)
            }
          }}>Adicionar</Btn>
        </div>
      </Modal>

      <Modal open={modalAberto === 'status'} onClose={() => setModalAberto(null)} title="Mudar Status da Peça">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={formStatus.aeroId} onChange={e => setFormStatus(prev => ({ ...prev, aeroId: e.target.value, pecaIdx: '' }))}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo} — {aeronave.modelo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Peça">
            <FSelect value={formStatus.pecaIdx} onChange={handleChangeStatus('pecaIdx')}>
              <option value="">Selecione...</option>
              {(aeronaves.find(aeronave => aeronave.id === Number(formStatus.aeroId))?.pecas || []).map((peca, indice) => (
                <option key={indice} value={indice}>{peca.nome}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Novo Status">
            <FSelect value={formStatus.status} onChange={handleChangeStatus('status')}>
              {ENUMS.StatusPeca.map(status => <option key={status}>{status}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(null)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (formStatus.aeroId && formStatus.pecaIdx !== '') {
              updateStatusPeca(Number(formStatus.aeroId), Number(formStatus.pecaIdx), formStatus.status as StatusPeca)
              setModalAberto(null)
            }
          }}>Atualizar</Btn>
        </div>
      </Modal>
    </div>
  )
}
