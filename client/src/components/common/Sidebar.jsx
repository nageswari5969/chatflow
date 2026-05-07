import { NavLink, useNavigate } from 'react-router-dom'
import { MessageSquare, Users, Phone, Settings, LayoutDashboard, LogOut } from 'lucide-react'
import { useClerk, useUser } from '@clerk/react'
import Avatar from './Avatar'
import { useNotifications } from '../../context/NotificationContext'

const navItems = [
  { to: '/chat', icon: <MessageSquare size={20} />, label: 'Chats' },
  { to: '/groups', icon: <Users size={20} />, label: 'Groups' },
  { to: '/calls', icon: <Phone size={20} />, label: 'Calls' },
  { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
]

export default function Sidebar() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()

  // Check if admin from publicMetadata or our DB
  const isAdmin = user?.publicMetadata?.role === 'admin' || 
                user?.emailAddresses?.[0]?.emailAddress === 'nageswari5969@gmail.com'

  return (
    <nav style={{
      width: 72,
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 0',
      gap: 4,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 'var(--radius-md)',
        background: 'var(--accent)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        boxShadow: 'var(--shadow-accent)',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        color: '#fff',
        fontSize: 18,
        letterSpacing: -1,
      }}>
        CF
      </div>

      {/* Nav links */}
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            width: 44, height: 44,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? '#fff' : 'var(--text-muted)',
            background: isActive ? 'var(--accent)' : 'transparent',
            transition: 'all var(--transition)',
            position: 'relative',
          })}
          title={label}
        >
          {icon}
          {to === '/chat' && unreadCount > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--danger)',
              fontSize: 10, fontWeight: 700, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </NavLink>
      ))}

      {/* Admin link — ONLY for admin users */}
      {isAdmin && (
        <NavLink
          to="/admin"
          title="Admin"
          style={({ isActive }) => ({
            width: 44, height: 44,
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? '#fff' : 'var(--text-muted)',
            background: isActive ? 'var(--accent)' : 'transparent',
            transition: 'all var(--transition)',
          })}
        >
          <LayoutDashboard size={20} />
        </NavLink>
      )}

      <div style={{ flex: 1 }} />

      {/* Sign out */}
      <button
        onClick={() => signOut(() => navigate('/sign-in'))}
        title="Sign Out"
        style={{
          width: 44, height: 44,
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)',
          transition: 'all var(--transition)',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = 'var(--danger)' }}
        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)' }}
      >
        <LogOut size={18} />
      </button>

      {/* Avatar */}
      <div style={{ marginTop: 8 }}>
        <Avatar user={user} size="sm" online />
      </div>
    </nav>
  )
}