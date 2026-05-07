import { useState } from 'react'
import { AppProvider, useApp } from './context/AppContext'
import type { View, Aeronave } from './types'
import Sidebar from './components/Sidebar'
import Toast from './components/ui/Toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AeroDetalhe from './pages/AeroDetalhe'
import ViewAeronaves from './pages/ViewAeronaves'
import ViewPecas from './pages/ViewPecas'
import ViewEtapas from './pages/ViewEtapas'
import ViewTestes from './pages/ViewTestes'
import ViewFuncionarios from './pages/ViewFuncionarios'
import ViewRelatorio from './pages/ViewRelatorio'

function MainApp() {
  const { user } = useApp()
  const [view, setView] = useState<View>('dashboard')
  const [selectedAero, setSelectedAero] = useState<Aeronave | null>(null)

  if (!user) return <Login />

  const views: Partial<Record<View, React.ReactNode>> = {
    dashboard:    <Dashboard setView={setView} setSelectedAero={setSelectedAero} />,
    aeronaves:    <ViewAeronaves setView={setView} setSelectedAero={setSelectedAero} />,
    aeroDetalhe:  selectedAero ? <AeroDetalhe aero={selectedAero} onBack={() => setView('aeronaves')} /> : null,
    pecas:        <ViewPecas />,
    etapas:       <ViewEtapas />,
    testes:       <ViewTestes />,
    funcionarios: <ViewFuncionarios />,
    relatorio:    <ViewRelatorio />,
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar current={view} setCurrent={setView} />
      <main style={{ flex: 1, overflowY: 'auto', background: '#f8f9fb' }}>
        <div style={{ padding: '32px 36px', maxWidth: 1200, margin: '0 auto' }}>
          {views[view] ?? views.dashboard}
        </div>
      </main>
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  )
}
