import { ArrowLeft, Plane } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Aeronave } from '../types'
import Card from '../components/ui/Card'
import Btn from '../components/ui/Btn'
import { badgeForStatus } from '../components/ui/Badge'

interface AeroDetalheProps {
  aero: Aeronave
  onBack: () => void
}

export default function AeroDetalhe({ aero, onBack }: AeroDetalheProps) {
  const { aeronaves, iniciarEtapa, concluirEtapa } = useApp()

  const aeronave = aeronaves.find(a => a.id === aero.id) ?? aero
  

  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, fontWeight: 600, marginBottom: 20, padding: 0 }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#007CC3' }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af' }}
      >
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div>
              <div style={{  fontSize: 13, color: '#000000', fontWeight: 600, marginBottom: 2 }}>{aeronave.codigo}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#000000', letterSpacing: '-0.5px' }}>{aeronave.modelo}</div>
              <div style={{ fontSize: 12, color: '#000000', marginTop: 4 }}>{aeronave.tipo} · {aeronave.capacidade} pax · {aeronave.alcance} km</div>
            </div>
          </div>
        </Card>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card padding="0">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>Etapas de Produção</div>
          {aeronave.etapas.length === 0
            ? <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhuma etapa vinculada.</div>
            : <div style={{ padding: 12 }}>
                {aeronave.etapas.map((etapa, indice) => (
                  <div key={etapa.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 10, background: '#fafbfc', marginBottom: 8, border: '1px solid #f1f3f7' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{indice + 1}. {etapa.nome}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2}}>prazo: {etapa.prazo} · {etapa.funcionarios.length} resp.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {badgeForStatus(etapa.status)}
                    </div>
                  </div>
                ))}
              </div>
          }
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>Peças ({aeronave.pecas.length})</div>
            {aeronave.pecas.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhuma peça.</div>
              : aeronave.pecas.map((peca, indice) => (
                <div key={indice} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: indice < aeronave.pecas.length - 1 ? '1px solid #f8f9fb' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{peca.nome}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{peca.fornecedor}</div>
                  </div>
                  {badgeForStatus(peca.status)}
                </div>
              ))
            }
          </Card>

          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', fontSize: 13, fontWeight: 700, color: '#111827' }}>Testes ({aeronave.testes.length})</div>
            {aeronave.testes.length === 0
              ? <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', fontSize: 12 }}>Nenhum teste realizado.</div>
              : aeronave.testes.map((teste, indice) => (
                <div key={indice} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: indice < aeronave.testes.length - 1 ? '1px solid #f8f9fb' : 'none' }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{teste.tipo}</span>
                  {badgeForStatus(teste.resultado)}
                </div>
              ))
            }
          </Card>
        </div>
      </div>
    </div>
  )
}
