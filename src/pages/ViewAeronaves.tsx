import { useState, ChangeEvent } from 'react'
import { PlusCircle } from 'lucide-react'
import { useApp, ENUMS } from '../context/AppContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FInput, FSelect } from '../components/ui/FormField'
import Modal from '../components/Modal'
import type { Aeronave, View } from '../types'

interface Props {
  setView: (view: View) => void
  setSelectedAero: (aero: Aeronave) => void
}

export default function ViewAeronaves({ setView, setSelectedAero }: Props) {
  const { aeronaves, addAeronave } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ codigo: '', modelo: '', tipo: 'Comercial', capacidade: '', alcance: '' })

  const handleChange = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [campo]: e.target.value }))

  const handleSubmit = () => {
    if (!form.codigo || !form.modelo || !form.capacidade || !form.alcance) return
    if (addAeronave({ ...form, tipo: form.tipo as Aeronave['tipo'], capacidade: Number(form.capacidade), alcance: Number(form.alcance) })) {
      setModalAberto(false)
      setForm({ codigo: '', modelo: '', tipo: 'Comercial', capacidade: '', alcance: '' })
    }
  }

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle>Aeronaves</SectionTitle>
        <Btn icon={PlusCircle} onClick={() => setModalAberto(true)}>Cadastrar Aeronave</Btn>
      </div>
      <Card padding="0">
        <Table
          headers={['Código', 'Modelo', 'Tipo', 'Capacidade', 'Alcance', 'Peças', 'Etapas', 'Testes', '']}
          empty="Nenhuma aeronave cadastrada."
          rows={aeronaves.map(aeronave => ({
            _onClick: () => { setSelectedAero(aeronave); setView('aeroDetalhe') },
            cells: [
              { content: <span style={{  color: '#000000', fontWeight: 600, fontSize: 12 }}>{aeronave.codigo}</span> },
              { content: <span style={{ fontWeight: 600 }}>{aeronave.modelo}</span> },
              { content: <Badge variant={aeronave.tipo === 'Militar' ? 'red' : 'blue'}>{aeronave.tipo}</Badge> },
              `${aeronave.capacidade} pax`,
              `${aeronave.alcance} km`,
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{aeronave.pecas.length}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{aeronave.etapas.length}</span> },
              { content: <span style={{ fontFamily: 'JetBrains Mono' }}>{aeronave.testes.length}</span> },
              { content: <span style={{ color: '#9ca3af', fontSize: 11 }}>Ver detalhes </span> },
            ],
          }))}
        />
      </Card>
      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Cadastrar Aeronave">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <FormField label="Código"><FInput value={form.codigo} onChange={handleChange('codigo')} placeholder="AC-300" /></FormField>
          <FormField label="Modelo"><FInput value={form.modelo} onChange={handleChange('modelo')} placeholder="Boeing 737" /></FormField>
          <FormField label="Tipo">
            <FSelect value={form.tipo} onChange={handleChange('tipo')}>
              {ENUMS.TipoAeronave.map(tipo => <option key={tipo}>{tipo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Capacidade (pax)"><FInput type="number" value={form.capacidade} onChange={handleChange('capacidade')} /></FormField>
          <FormField label="Alcance (km)"><FInput type="number" value={form.alcance} onChange={handleChange('alcance')} /></FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(false)}>Cancelar</Btn>
          <Btn onClick={handleSubmit} icon={PlusCircle}>Cadastrar</Btn>
        </div>
      </Modal>
    </div>
  )
}
