function FeaturesSection() {
  return (
    <section className="section features-section" id="features">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Everything in One Place</h2>
          <p className="section-subtitle">
            Built specifically for RV University athletes, coaches, students, and alumni.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-number">01</span>
            <h3 className="feature-title">Team History</h3>
            <p className="feature-desc">
              Explore longitudinal performances, championship trophies, and milestone achievements
              across different academic seasons.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-number">02</span>
            <h3 className="feature-title">Match Statistics</h3>
            <p className="feature-desc">
              Access comprehensive scorecards, individual player metrics, MVP recognition,
              and tournament outcome analytics.
            </p>
          </div>

          <div className="feature-card">
            <span className="feature-number">03</span>
            <h3 className="feature-title">Upcoming Events</h3>
            <p className="feature-desc">
              Never miss a game with synchronized tournament calendars, practice alerts,
              team trials, and athletic department notices.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
