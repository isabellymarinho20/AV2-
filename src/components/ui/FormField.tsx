import { useState } from 'react'
import type { CSSProperties, ReactNode, ChangeEvent } from 'react'

export const inputStyle: CSSProperties = {
  padding: '10px 14px',
  border: '1.5px solid #e8eaed',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 500,
  color: '#111827',
  background: '#fafbfc',
  outline: 'none',
  transition: 'border-color 0.15s',
  width: '100%',
}

interface FormFieldProps {
  label: string
  children: ReactNode
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

interface FInputProps {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
}

export function FInput({ value, onChange, placeholder, type = 'text' }: FInputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      style={{
        ...inputStyle,
        borderColor: focused ? '#007CC3' : '#e8eaed',
        boxShadow:   focused ? '0 0 0 3px rgba(0,124,195,0.1)' : 'none',
      }}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}

interface FSelectProps {
  value: string
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  children: ReactNode
}

export function FSelect({ value, onChange, children }: FSelectProps) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      style={{
        ...inputStyle,
        borderColor: focused ? '#007CC3' : '#e8eaed',
        boxShadow:   focused ? '0 0 0 3px rgba(0,124,195,0.1)' : 'none',
        cursor: 'pointer',
      }}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      {children}
    </select>
  )
}
