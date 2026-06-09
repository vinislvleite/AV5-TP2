import { NavLink } from 'react-router-dom'
import {
  Users, UserPlus, Bed, BedDouble, FileText, LogOut, Hotel,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Dashboard', icon: Hotel },
  { to: '/titulares', label: 'Titulares', icon: Users },
  { to: '/dependentes', label: 'Dependentes', icon: UserPlus },
  { to: '/acomodacoes', label: 'Acomodações', icon: Bed },
  { to: '/acomodados', label: 'Hóspedes', icon: BedDouble },
  { to: '/documentos', label: 'Documentos', icon: FileText },
]

export default function Sidebar() {
  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      minHeight: '100vh',
      background: 'var(--bg2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: 'var(--font-head)',
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: '-0.5px',
          color: 'var(--accent)',
        }}>
          ATLANTIS
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, letterSpacing: 1 }}>
          SISTEMA HOTELEIRO
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 8,
              color: isActive ? 'var(--accent)' : 'var(--text2)',
              background: isActive ? 'var(--accent-glow)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
              fontSize: 13.5,
              transition: 'all 0.15s',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            })}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 12px',
          borderRadius: 8,
          color: 'var(--text3)',
          fontSize: 13,
          cursor: 'pointer',
        }}>
          <LogOut size={15} />
          v1.0.0
        </div>
      </div>
    </aside>
  )
}
