function Footer({
  sportsList,
  currentUser,
  onSelectSport,
  onLogout,
  onOpenLogin,
  scrollToSection,
}) {
  const handleNavClick = (event, id) => {
    event.preventDefault()
    scrollToSection(id)
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>RVU SPORTS</h3>
            <p>Your Team. Your History. Your Game.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-column">
              <h4>Navigation</h4>
              <ul>
                <li><a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a></li>
                <li><a href="#sports" onClick={(e) => handleNavClick(e, 'sports')}>Sports</a></li>
                <li><a href="#tournaments" onClick={(e) => handleNavClick(e, 'tournaments')}>Tournaments</a></li>
                <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')}>Features</a></li>
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>About</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Varsity Sports</h4>
              <ul>
                {sportsList.map((sport) => (
                  <li key={sport.id}>
                    <a
                      href="#sports"
                      onClick={(e) => {
                        e.preventDefault()
                        onSelectSport(sport)
                        scrollToSection('sports')
                      }}
                    >
                      {sport.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h4>University</h4>
              <ul>
                <li><a href="https://rvu.edu.in" target="_blank" rel="noreferrer">RV University</a></li>
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')}>Sports Department</a></li>
                <li>
                  {currentUser ? (
                    <a href="#home" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                      Sign Out ({currentUser.name})
                    </a>
                  ) : (
                    <a href="#home" onClick={(e) => { e.preventDefault(); onOpenLogin(); }}>
                      Portal Sign In
                    </a>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RVU Sports Portal — RV University. All rights reserved.</p>
          <p>Full Stack Development (FSD) Project</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
