import { useState} from 'react'
import { useApp } from '../context/AppContext'



export default function Login() {
  const { login } = useApp()
  const [hov, setHov] = useState(false)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        <img
          src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?q=80&w=1974&auto=format&fit=crop"
          alt="Aeronave"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,51,102,0.75) 0%, rgba(0,124,195,0.4) 100%)' }} />
      </div>

      <div style={{ width: 460, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 60px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 340 }}>
          <div style={{ marginBottom: 40 }}>
              <img src='../../src/assets/logo.png' alt="Logo da Empresa" style={{ height: '350px', width: '380px' }} /></div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', marginBottom: 4 }}>Bem-vindo ao AeroCode</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Usuário:</label>
            <div style={{ padding: '11px 14px', border: '1.5px solid #e8eaed', borderRadius: 10, fontSize: 13, background: '#f8f9fb', color: '#9ca3af', fontStyle: 'italic' }}>usuário</div>
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Senha:</label>
            <div style={{ padding: '11px 14px', border: '1.5px solid #e8eaed', borderRadius: 10, fontSize: 13, background: '#f8f9fb', color: '#9ca3af', fontStyle: 'italic' }}>********</div>
          </div>
          <button
            onClick={login}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
              width: '100%', padding: '13px', border: 'none', borderRadius: 12, cursor: 'pointer',
              background: hov ? '#004080' : '#003366', color: '#fff',
              fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.15s', boxShadow: hov ? '0 8px 24px rgba(0,51,102,0.35)' : '0 4px 12px rgba(0,51,102,0.2)',
            }}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  )
}
