import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const isErr = toast.type === 'error'

  return (
    <div className="animate-slide-right" style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: isErr ? '#dc2626' : '#111827',
      color: '#fff', padding: '12px 20px', borderRadius: 12,
      fontSize: 13, fontWeight: 600, maxWidth: 340,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {isErr ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
      {toast.msg}
    </div>
  )//***************************** */
}
