import { useState, useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Avatar from '../../components/common/Avatar'
import SearchBar from '../../components/common/SearchBar'
import Loader from '../../components/common/Loader'
import { Shield, Ban, Trash2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(query.toLowerCase()) ||
    u.email?.toLowerCase().includes(query.toLowerCase())
  )

  const handleBan = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/ban`)
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, banned: !u.banned } : u))
      toast.success('User updated')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{users.length} total users</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <SearchBar placeholder="Search users..." onSearch={setQuery} style={{ maxWidth: 360, marginBottom: 20 }} />

          {loading ? <Loader /> : (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = ''}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar user={user} size="sm" />
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)',
                          background: user.role === 'admin' ? 'var(--accent-dim)' : 'var(--bg-elevated)',
                          color: user.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)',
                        }}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)',
                          background: user.banned ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                          color: user.banned ? 'var(--danger)' : 'var(--success)',
                        }}>
                          {user.banned ? 'Banned' : 'Active'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => handleBan(user._id)}
                            title={user.banned ? 'Unban' : 'Ban'}
                            style={{
                              width: 30, height: 30, borderRadius: 'var(--radius-sm)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'var(--warning)', cursor: 'pointer',
                              background: 'rgba(245,158,11,0.1)',
                            }}
                          >
                            <Ban size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
