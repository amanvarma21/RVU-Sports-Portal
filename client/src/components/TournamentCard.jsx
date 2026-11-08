function TournamentCard({ tournament, currentUser, onAction }) {
  return (
    <div className="tournament-card">
      <div>
        <div className="tournament-tag-row">
          <span className="tournament-sport">{tournament.sport}</span>
          <span className={`status-pill ${tournament.statusClass}`}>{tournament.status}</span>
        </div>
        <h3 className="tournament-title">{tournament.title}</h3>
        <p className="tournament-date">📅 {tournament.date}</p>
        <p className="tournament-desc">{tournament.description}</p>
      </div>
      <button className="tournament-btn" onClick={() => onAction(tournament)}>
        {currentUser ? 'Register / View Fixtures →' : 'Sign in to Register →'}
      </button>
    </div>
  )
}

export default TournamentCard
