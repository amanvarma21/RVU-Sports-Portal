function AboutSection() {
  return (
    <section className="section about-section" id="about">
      <div className="section-container">
        <div className="about-grid">
          <div className="about-header">
            <span className="section-label">Our Purpose</span>
            <h2>
              One Platform.
              <br />
              Every Season.
            </h2>
          </div>
          <div className="about-text">
            <p>
              RVU Sports brings together college teams, matches, athletes, and tournaments
              into a unified digital home. Our mission is to celebrate student excellence,
              foster athletic pride, and preserve RV University's rich sporting heritage.
            </p>
            <div className="about-highlights">
              <div className="highlight-box">
                <strong>Centralized Archive</strong>
                <span>Every match score, roster, and season preserved.</span>
              </div>
              <div className="highlight-box">
                <strong>Athlete First</strong>
                <span>Spotlighting player milestones and team leaders.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
