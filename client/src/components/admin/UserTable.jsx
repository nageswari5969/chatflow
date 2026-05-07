import Avatar from '../common/Avatar'

export default function UserTable({ users = [], onBan }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['User', 'Email', 'Role', 'Status', 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar user={u} size="sm" />
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</span>
                </div>
              </td>
              <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: u.role === 'admin' ? 'var(--accent-dim)' : 'var(--bg-elevated)', color: u.role === 'admin' ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {u.role || 'user'}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: u.banned ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)', color: u.banned ? 'var(--danger)' : 'var(--success)' }}>
                  {u.banned ? 'Banned' : 'Active'}
                </span>
              </td>
              <td style={{ padding: '12px 16px' }}>
                <button onClick={() => onBan?.(u._id)} style={{ fontSize: 12, color: u.banned ? 'var(--success)' : 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}>
                  {u.banned ? 'Unban' : 'Ban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
