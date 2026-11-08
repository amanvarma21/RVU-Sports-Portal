function AuthStatusBar({ currentUser, scrollToSection }) {
  return (
    <aside className="auth-status-bar" aria-label="Active User Session">
      <div className="auth-status-content">
        <div className="auth-status-text">
          <span className="auth-status-badge">Active Session</span>
          <span>
            Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}) • {currentUser.role === 'student' ? 'Varsity Athlete' : 'Athletic Staff'}
          </span>
        </div>
        <div className="auth-status-actions">
          <button className="auth-quick-link" onClick={() => scrollToSection('tournaments')}>
            View Registered Events
          </button>
          <button className="auth-quick-link" onClick={() => scrollToSection('sports')}>
            Varsity Rosters
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AuthStatusBar
