import SportCard from './SportCard.jsx'

function SportsSection({
  sportsList,
  selectedSport,
  onSelectSport,
  currentUser,
  onRequestLogin,
  loading,
  error,
}) {
  return (
    <section className="section sports-section" id="sports">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Discover Your Game</span>
          <h2 className="section-title">Our Varsity Sports</h2>
          <p className="section-subtitle">
            Select a sport to inspect active squads, team leadership, venues, and match fixtures.
          </p>
        </div>

        {loading && <p className="portal-state" role="status">Loading sports...</p>}
        {!loading && error && <p className="portal-state portal-state-error" role="alert">{error}</p>}
        {!loading && !error && sportsList.length === 0 && (
          <p className="portal-state">No sports are available yet.</p>
        )}

        {sportsList.length > 0 && (
        <div className="sports-grid">
          {sportsList.map((sport) => (
            <SportCard
              key={sport.id}
              sport={sport}
              isSelected={selectedSport?.id === sport.id}
              isAuthenticated={Boolean(currentUser)}
              onSelect={() => {
                if (!currentUser) {
                  onRequestLogin()
                  return
                }
                onSelectSport(selectedSport?.id === sport.id ? null : sport)
              }}
            />
          ))}
        </div>
        )}
      </div>
    </section>
  )
}

export default SportsSection
