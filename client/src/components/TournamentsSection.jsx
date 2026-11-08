import TournamentCard from './TournamentCard.jsx'

function TournamentsSection({ tournamentsList, currentUser, onTournamentAction, loading, error }) {
  return (
    <section className="section tournaments-section" id="tournaments">
      <div className="section-container">
        <div className="section-header">
          <span className="section-label">Compete & Cheer</span>
          <h2 className="section-title">Upcoming Tournaments</h2>
          <p className="section-subtitle">
            Stay updated with ongoing collegiate championships, campus leagues, and trials.
          </p>
        </div>

        {loading && <p className="portal-state" role="status">Loading tournaments...</p>}
        {!loading && error && <p className="portal-state portal-state-error" role="alert">{error}</p>}
        {!loading && !error && tournamentsList.length === 0 && (
          <p className="portal-state">No tournaments are available yet.</p>
        )}

        {tournamentsList.length > 0 && (
        <div className="tournaments-grid">
          {tournamentsList.map((tournament) => (
            <TournamentCard
              key={tournament._id || tournament.id}
              tournament={tournament}
              currentUser={currentUser}
              onAction={onTournamentAction}
            />
          ))}
        </div>
        )}
      </div>
    </section>
  )
}

export default TournamentsSection
