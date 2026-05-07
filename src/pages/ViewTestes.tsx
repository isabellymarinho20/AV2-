import { useState, ChangeEvent } from 'react'
import { FlaskConical } from 'lucide-react'
import { useApp, ENUMS } from '../context/AppContext'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import { badgeForStatus } from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FSelect } from '../components/ui/FormField'
import Modal from '../components/Modal'
import type { TipoTeste, ResultadoTeste } from '../types'
import { PlusCircle } from 'lucide-react'

export default function ViewTestes() {
  const { aeronaves, addTeste } = useApp()
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ aeroId: '', tipo: 'Elétrico', resultado: 'Aprovado' })

  const handleChange = (campo: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [campo]: e.target.value }))

  const todosOsTestes = aeronaves.flatMap(aeronave => aeronave.testes.map(teste => ({ ...teste, _aero: aeronave })))

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <SectionTitle>Testes</SectionTitle>
        <Btn icon={PlusCircle} onClick={() => setModalAberto(true)}>Registrar Teste</Btn>
      </div>

      <Card padding="0">
        <Table
          headers={['Aeronave', 'Tipo de Teste', 'Resultado']}
          empty="Nenhum teste registrado."
          rows={todosOsTestes.map(teste => ({
            cells: [
              { content: <span style={{ color: '#000000', fontSize: 12, fontWeight: 600 }}>{teste._aero.codigo}</span> },
              teste.tipo,
              { content: badgeForStatus(teste.resultado) },
            ],
          }))}
        />
      </Card>

      <Modal open={modalAberto} onClose={() => setModalAberto(false)} title="Registrar Teste">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormField label="Aeronave">
            <FSelect value={form.aeroId} onChange={handleChange('aeroId')}>
              <option value="">Selecione...</option>
              {aeronaves.map(aeronave => (
                <option key={aeronave.id} value={aeronave.id}>{aeronave.codigo} — {aeronave.modelo}</option>
              ))}
            </FSelect>
          </FormField>
          <FormField label="Tipo de Teste">
            <FSelect value={form.tipo} onChange={handleChange('tipo')}>
              {ENUMS.TipoTeste.map(tipo => <option key={tipo}>{tipo}</option>)}
            </FSelect>
          </FormField>
          <FormField label="Resultado">
            <FSelect value={form.resultado} onChange={handleChange('resultado')}>
              {ENUMS.ResultadoTeste.map(resultado => <option key={resultado}>{resultado}</option>)}
            </FSelect>
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <Btn variant="ghost" onClick={() => setModalAberto(false)}>Cancelar</Btn>
          <Btn onClick={() => {
            if (form.aeroId) {
              addTeste(Number(form.aeroId), { tipo: form.tipo as TipoTeste, resultado: form.resultado as ResultadoTeste })
              setModalAberto(false)
            }
          }}>Registrar</Btn>
        </div>
      </Modal>
    </div>
  )
}
