import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Flag } from 'lucide-react'

const items = [
  { to: '/admin', icon: <LayoutDashboard size={16} />, label: 'Overview' },
  { to: '/admin/users', icon: <Users size={16} />, label: 'Users' },
  { to: '/admin/reports', icon: <Flag size={16} />, label: 'Reports' },
]

export default function AdminSidebar() {
  return (
    <div style={{
      width: 200,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      padding: '20px 12px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>
        ADMIN PANEL
      </div>
      {items.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/admin'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px',
            borderRadius: 'var(--radius-md)',
            fontSize: 14, fontWeight: 500,
            color: isActive ? '#fff' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent)' : 'transparent',
            transition: 'all var(--transition)',
          })}
          onMouseEnter={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.background = 'var(--bg-hover)' }}
          onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.background = '' }}
        >
          {icon} {label}
        </NavLink>
      ))}
    </div>
  )
}
