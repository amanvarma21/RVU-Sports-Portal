import sportsLogo from '../assets/images/rvu-sports-logo.png'

function Navbar({
  currentUser,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
  onOpenLogin,
  scrollToSection,
}) {
  const handleNavClick = (event, id) => {
    event.preventDefault()
    scrollToSection(id)
  }

  return (
    <header className="header">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => scrollToSection('home')}>
          <img src={sportsLogo} alt="RVU Sports Logo" className="brand-logo" />
          <span className="brand-title">
            RVU <span className="accent">SPORTS PORTAL</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#home" className="nav-link" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#sports" className="nav-link" onClick={(e) => handleNavClick(e, 'sports')}>Sports</a>
          <a href="#tournaments" className="nav-link" onClick={(e) => handleNavClick(e, 'tournaments')}>Tournaments</a>
          <a href="#features" className="nav-link" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
          <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, 'about')}>About</a>
        </div>

        <div className="nav-actions">
          {currentUser ? (
            <div className="user-profile-badge">
              <span className="user-avatar">{currentUser.name.charAt(0).toUpperCase()}</span>
              <div className="user-details">
                <span className="user-name" title={currentUser.name}>{currentUser.name}</span>
                <span className="user-role-pill">
                  {currentUser.role === 'student' ? '🎓 Student' : '📋 Staff'}
                </span>
              </div>
              <button className="btn-logout" onClick={onLogout} title="Sign Out of Portal">
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => onOpenLogin()}>
              <span>🔐</span> Login
            </button>
          )}

          <button
            className="btn-menu-toggle"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
        <a href="#sports" onClick={(e) => handleNavClick(e, 'sports')}>Sports</a>
        <a href="#tournaments" onClick={(e) => handleNavClick(e, 'tournaments')}>Tournaments</a>
        <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a>
        <a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a>

        {currentUser ? (
          <div className="mobile-user-row">
            <div>
              <strong>{currentUser.name}</strong>
              <p style={{ fontSize: '0.8rem', color: '#f0c85c' }}>{currentUser.email}</p>
            </div>
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-login" onClick={() => onOpenLogin()}>
            Login with @rvu.edu.in
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
