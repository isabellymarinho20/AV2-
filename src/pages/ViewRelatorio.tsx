import { useState, ChangeEvent } from 'react'
import { FileText } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import SectionTitle from '../components/ui/SectionTitle'
import { FormField, FInput, FSelect } from '../components/ui/FormField'

export default function ViewRelatorio() {
  const { aeronaves } = useApp()
  const [aeronaveId, setAeronaveId] = useState('')
  const [nomeCliente, setNomeCliente] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [relatorio, setRelatorio] = useState('')

  const gerarRelatorio = () => {
    const aeronave = aeronaves.find(a => a.id === Number(aeronaveId))
    if (!aeronave || !nomeCliente) return

    const linhas = [
      '═══════════════════════════════════════════',
      '         RELATÓRIO TÉCNICO — AEROCODE      ',
      '═══════════════════════════════════════════',
      '',
      `AERONAVE : ${aeronave.codigo} — ${aeronave.modelo}`,
      `TIPO     : ${aeronave.tipo}`,
      `CAPACID. : ${aeronave.capacidade} `,
      `ALCANCE  : ${aeronave.alcance} km`,
      '',
      `CLIENTE  : ${nomeCliente}`,
      `ENTREGA  : ${dataEntrega || 'A definir'}`,
      '',
      '───────────────────────────────────────────',
      'ETAPAS:',
      '───────────────────────────────────────────',
      ...(aeronave.etapas.length
        ? aeronave.etapas.map((etapa, index) => `  ${index + 1}. ${etapa.nome} [${etapa.status}] — prazo: ${etapa.prazo}`)
        : ['  Nenhuma etapa registrada.']),
      '',
      '───────────────────────────────────────────',
      'PEÇAS:',
      '───────────────────────────────────────────',
      ...(aeronave.pecas.length
        ? aeronave.pecas.map(peca => `  • ${peca.nome} (${peca.tipo}) — ${peca.fornecedor} — ${peca.status}`)
        : ['  Nenhuma peça registrada.']),
      '',
      '───────────────────────────────────────────',
      'TESTES:',
      '───────────────────────────────────────────',
      ...(aeronave.testes.length
        ? aeronave.testes.map(teste => `  [${teste.resultado.toUpperCase()}] ${teste.tipo}`)
        : ['  Nenhum teste realizado.']),
      ''
      
    ]

    setRelatorio(linhas.join('\n'))
  }

  return (
    <div className="animate-fade-up">
      <SectionTitle >Relatório</SectionTitle>

      <div style={{
        display: 'grid',
        gridTemplateColumns: relatorio ? '360px 1fr' : '1fr',
        gap: 20,
        alignItems: 'start',
      }}>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Aeronave">
              <FSelect
                value={aeronaveId}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setAeronaveId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {aeronaves.map(aeronave => (
                  <option key={aeronave.id} value={aeronave.id}>
                    {aeronave.codigo} — {aeronave.modelo}
                  </option>
                ))}
              </FSelect>
            </FormField>
            <FormField label="Nome do Cliente">
              <FInput
                value={nomeCliente}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNomeCliente(e.target.value)}
                placeholder="Ex: Azul Linhas Aéreas"
              />
            </FormField>
            <FormField label="Data de Entrega">
              <FInput
                type="date"
                value={dataEntrega}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDataEntrega(e.target.value)}
              />
            </FormField>
          </div>
          <div style={{ marginTop: 20 }}>
            <Btn onClick={gerarRelatorio} icon={FileText}>Gerar Relatório</Btn>
          </div>
        </Card>

        {relatorio && (
          <Card>
            <div style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 12,
              color: '#374151',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.9,
              background: '#f8f9fb',
              padding: 20,
              borderRadius: 10,
              border: '1px solid #e8eaed',
            }}>
              {relatorio}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
