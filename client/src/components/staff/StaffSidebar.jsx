const ITEMS = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'sports', label: 'Sports Management', icon: '🏅' },
  { id: 'tournaments', label: 'Tournament Management', icon: '🏆' },
]

function StaffSidebar({ currentUser, activeSection, onNavigate, onLogout }) {
  return (
    <aside className="staff-sidebar">
      <div className="staff-sidebar-brand">
        <span className="staff-brand-mark">RVU</span>
        <div>
          <strong>SPORTS PORTAL</strong>
          <span>STAFF DASHBOARD</span>
        </div>
      </div>

      <nav className="staff-sidebar-nav" aria-label="Staff dashboard">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`staff-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            aria-current={activeSection === item.id ? 'page' : undefined}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="staff-sidebar-user">
        <div className="staff-user-avatar">{currentUser.name?.charAt(0).toUpperCase()}</div>
        <div className="staff-user-details">
          <strong>{currentUser.name}</strong>
          <span>{currentUser.role}</span>
        </div>
        <button className="staff-logout" onClick={onLogout}>Log out</button>
      </div>
    </aside>
  )
}

export default StaffSidebar
