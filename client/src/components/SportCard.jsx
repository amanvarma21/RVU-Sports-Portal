function SportCard({ sport, isSelected, isAuthenticated, onSelect }) {
  const showDetails = isAuthenticated && isSelected

  return (
    <article className={`sport-card-item ${showDetails ? 'expanded' : ''}`}>
      <button
        type="button"
        className={`sport-card ${showDetails ? 'active' : ''}`}
        onClick={onSelect}
        aria-expanded={showDetails}
        aria-controls={`sport-details-${sport.id}`}
      >
        <div className="sport-icon">{sport.icon}</div>
        <div>
          <h3 className="sport-name">{sport.name}</h3>
          <p className="sport-meta">{sport.tagline}</p>
          <span className="sport-action">
            {!isAuthenticated
              ? 'Sign in to View Details →'
              : showDetails
                ? '− Hide Details'
                : 'View Details →'}
          </span>
        </div>
      </button>
      {showDetails && (
        <div className="sport-card-details" id={`sport-details-${sport.id}`}>
          <div className="sport-details-info">
            <h3>{sport.icon} {sport.name} Varsity Team</h3>
            <p>
              <strong>Next Fixture:</strong> {sport.nextMatch || 'To be announced'}
              {' • '}
              <strong>Home Ground:</strong> {sport.ground || 'To be announced'}
            </p>
          </div>
          <div className="sport-quick-stats">
            <div className="quick-stat-badge">
              <span>Captain</span>
              <strong>{sport.captain || 'To be announced'}</strong>
            </div>
            <div className="quick-stat-badge">
              <span>Active Squad</span>
              <strong>{sport.squadSize ?? sport.roster?.length ?? 0} Players</strong>
            </div>
            <div className="quick-stat-badge">
              <span>Recent Form</span>
              <strong>{sport.recentForm || 'Not available'}</strong>
            </div>
          </div>
          <div className="sport-roster">
            <h4>Team Roster</h4>
            {sport.roster?.length ? (
              <ul>
                {sport.roster.map((player, index) => (
                  <li key={`${player.name}-${index}`}>
                    <span>{player.name}</span>
                    <span>{player.role || 'Squad Player'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sport-roster-empty">Roster details have not been added yet.</p>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default SportCard
