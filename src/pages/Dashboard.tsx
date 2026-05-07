import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { Plane, Package, Clock, Users, PlusCircle, RefreshCw } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import Table from '../components/ui/Table'
import Badge from '../components/ui/Badge'
import Btn from '../components/ui/Btn'
import type { Aeronave, View } from '../types'

interface Props {
  setView: (view: View) => void
  setSelectedAero: (aero: Aeronave) => void
}

export default function Dashboard({ setView, setSelectedAero }: Props) {
  const { aeronaves, funcionarios } = useApp()
  const allEtapas = aeronaves.flatMap(a => a.etapas)
  const allPecas  = aeronaves.flatMap(a => a.pecas)
  const allTestes = aeronaves.flatMap(a => a.testes)

  const etapaData = [
    { name: 'Pendente',   value: allEtapas.filter(e => e.status === 'Pendente').length,     fill: '#f59e0b' },
    { name: 'Andamento',  value: allEtapas.filter(e => e.status === 'Em Andamento').length,  fill: '#007CC3' },
    { name: 'Concluído',  value: allEtapas.filter(e => e.status === 'Concluído').length,     fill: '#059669' },
  ]
  const testeData = [
    { name: 'Aprovados',  value: allTestes.filter(t => t.resultado === 'Aprovado').length,   fill: '#059669' },
    { name: 'Reprovados', value: allTestes.filter(t => t.resultado === 'Reprovado').length,  fill: '#dc2626' },
  ]
  const progressoData = aeronaves.map(a => ({
    name: a.codigo,
    pct: a.etapas.length
      ? Math.round((a.etapas.filter(e => e.status === 'Concluído').length / a.etapas.length) * 100)
      : 0,
  }))

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Home
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#003366', letterSpacing: '-0.5px' }}>
            Dashboard
          </h1>
        </div>
        
      </div>

      

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
        <Card padding="20px">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Status</div>
          {allEtapas.length === 0
            ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>Nao tem dado</div>
            : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={etapaData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
                  <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                    {etapaData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>

        <Card padding="20px">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Progresso:</div>
          {progressoData.length === 0
            ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>Não tem dado</div>
            : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={progressoData} layout="vertical" barSize={14}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={52} />
                  <Tooltip formatter={v => [`${v}%`, 'Progresso']} contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
                  <Bar dataKey="pct" fill="#007CC3" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>

        <Card padding="20px">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Testes</div>
          {allTestes.length === 0
            ? <div style={{ textAlign: 'center', color: '#9ca3af', padding: '30px 0', fontSize: 12 }}>Não tem dado</div>
            : (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={testeData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" paddingAngle={4}>
                    {testeData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e8eaed' }} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </Card>
      </div>


      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f3f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Aeronaves</div>
          </div>
          <Btn size="sm" icon={PlusCircle} onClick={() => setView('aeronaves')}>Cadastrar aeronave</Btn>
        </div>
        {aeronaves.length === 0
          ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: 13, border: '2px dashed #e8eaed', margin: 20, borderRadius: 12 }}>
              No aircraft registered yet. Use "Register aircraft" to add the first one.
            </div>
          )
          : (
            <Table
              headers={['Código', 'Modelo', 'Tipo', 'Capacidade', 'Alcance', 'Detalhes']}
              rows={aeronaves.map(a => {
                const pct = a.etapas.length
                  ? Math.round((a.etapas.filter(e => e.status === 'Concluído').length / a.etapas.length) * 100)
                  : 0
                return {
                  _onClick: () => { setSelectedAero(a); setView('aeroDetalhe') },
                  cells: [
                    { content: <span style={{  color: '#000000', fontWeight: 600 }}>{a.codigo}</span> },
                    a.modelo,
                    { content: <Badge variant={a.tipo === 'Militar' ? 'red' : 'blue'}>{a.tipo}</Badge> },
                    `${a.capacidade} pax`,
                    `${a.alcance} km`,
                    
                    { content: <span style={{ fontSize: 11, color: '#9ca3af' }}>Ver detalhes</span> },
                  ],
                }
              })}
            />
          )
        }
      </Card>
    </div>
  )
}
