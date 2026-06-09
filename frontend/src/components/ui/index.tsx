import React from 'react'

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: 24,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 24, letterSpacing: '-0.5px' }}>
          {title}
        </h1>
        {subtitle && <p style={{ color: 'var(--text2)', fontSize: 13, marginTop: 2 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({
  children, onClick, variant = 'primary', size = 'md', disabled, style, type = 'button'
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  disabled?: boolean
  style?: React.CSSProperties
  type?: 'button' | 'submit'
}) {
  const variants = {
    primary: { background: 'var(--accent)', color: '#0d0f14', fontWeight: 600 },
    secondary: { background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' },
    danger: { background: 'rgba(248,113,113,0.15)', color: 'var(--danger)', border: '1px solid rgba(248,113,113,0.3)' },
    ghost: { background: 'transparent', color: 'var(--text2)' },
  }
  const sizes = {
    sm: { padding: '5px 12px', fontSize: 12, borderRadius: 6 },
    md: { padding: '9px 18px', fontSize: 13.5, borderRadius: 8 },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-body)',
        transition: 'opacity 0.15s',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({
  label, value, onChange, placeholder, type = 'text', required
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, letterSpacing: 0.3 }}>
        {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '9px 12px',
          color: 'var(--text)',
          fontSize: 14,
          width: '100%',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({
  label, value, onChange, options, required
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  required?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, letterSpacing: 0.3 }}>
        {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 2 }}>*</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '9px 12px',
          color: value ? 'var(--text)' : 'var(--text3)',
          fontSize: 14,
          width: '100%',
          cursor: 'pointer',
        }}
      >
        <option value="">Selecione...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, color = 'accent' }: { label: string; color?: 'accent' | 'success' | 'danger' | 'warning' | 'neutral' }) {
  const colors = {
    accent: { bg: 'var(--accent-glow)', color: 'var(--accent)' },
    success: { bg: 'rgba(52,211,153,0.12)', color: 'var(--success)' },
    danger: { bg: 'rgba(248,113,113,0.12)', color: 'var(--danger)' },
    warning: { bg: 'rgba(251,191,36,0.12)', color: 'var(--warning)' },
    neutral: { bg: 'var(--bg3)', color: 'var(--text2)' },
  }
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 99,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 0.3,
      ...colors[color],
    }}>
      {label}
    </span>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, children, onClose }: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 520,
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 17 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'var(--bg3)', border: 'none', color: 'var(--text2)',
            width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      textAlign: 'center', padding: '48px 24px',
      color: 'var(--text3)', fontSize: 14,
    }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>🏨</div>
      {message}
    </div>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, type, onClose }: {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}) {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: type === 'success' ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)',
      border: `1px solid ${type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
      color: type === 'success' ? 'var(--success)' : 'var(--danger)',
      padding: '12px 20px',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 500,
      maxWidth: 320,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    }}>
      {message}
    </div>
  )
}

// ─── FormGrid ─────────────────────────────────────────────────────────────────
export function FormGrid({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: 16,
    }}>
      {children}
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label && <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: 0.5 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 28, fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--accent)' }}>{value}</div>
        </div>
        <div style={{ color: 'var(--accent)', opacity: 0.6 }}>{icon}</div>
      </div>
    </Card>
  )
}
