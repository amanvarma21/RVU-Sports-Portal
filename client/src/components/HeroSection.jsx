import footballBg from '../assets/images/Football.jpeg'

function HeroSection({ sportsCount, loading, scrollToSection }) {
  return (
    <section
      className="hero"
      id="home"
      style={{ backgroundImage: `url(${footballBg})` }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">RV University • Sports Portal</span>
          <h1 className="hero-title">
            Your Team.
            <br />
            Your History.
            <br />
            <span className="highlight">Your Game.</span>
          </h1>
          <p className="hero-description">
            Explore RVU varsity sports teams, season match histories, player statistics,
            and upcoming inter-collegiate tournaments — all organized in one place.
          </p>
          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => scrollToSection('sports')}>
              Explore Sports <span>→</span>
            </button>
            <button className="btn-secondary" onClick={() => scrollToSection('tournaments')}>
              View Tournaments
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <h4>{loading ? '…' : sportsCount}</h4>
            <p>Varsity Sports</p>
          </div>
          <div className="stat-item">
            <h4>200+</h4>
            <p>Student Athletes</p>
          </div>
          <div className="stat-item">
            <h4>15+</h4>
            <p>Annual Tournaments</p>
          </div>
          <div className="stat-item">
            <h4>100%</h4>
            <p>Centralized Records</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
