import Avatar from '../common/Avatar'

export default function GroupMembers({ members = [] }) {
  return (
    <div style={{ padding: '0 20px 20px' }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Members ({members.length})
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {members.map(member => (
          <div key={member._id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 'var(--radius-md)',
            transition: 'background var(--transition)',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <Avatar user={member} size="sm" online={member.online} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{member.name}</div>
              <div style={{ fontSize: 11, color: member.online ? 'var(--online)' : 'var(--text-muted)' }}>
                {member.online ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
