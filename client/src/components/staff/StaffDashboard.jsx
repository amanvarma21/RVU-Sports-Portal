import { useState } from 'react'
import StaffSidebar from './StaffSidebar.jsx'
import SportsManagement from './SportsManagement.jsx'
import TournamentManagement from './TournamentManagement.jsx'

const STAFF_ROLES = new Set(['staff', 'faculty', 'admin'])

function StaffDashboard({
  currentUser,
  onLogout,
  sportsList,
  tournamentsList,
  sportsLoading,
  tournamentsLoading,
  sportsError,
  tournamentsError,
  onRefreshSports,
  onRefreshTournaments,
  onCreateSport,
  onUpdateSport,
  onDeleteSport,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
}) {
  const [activeSection, setActiveSection] = useState('overview')

  if (!STAFF_ROLES.has(currentUser?.role)) {
    return (
      <main className="staff-access-denied" role="alert">
        <h1>Staff access required</h1>
        <p>Your authenticated account does not have permission to access this dashboard.</p>
        <button className="staff-button staff-button-primary" onClick={onLogout}>Log out</button>
      </main>
    )
  }

  return (
    <div className="staff-layout">
      <StaffSidebar
        currentUser={currentUser}
        activeSection={activeSection}
        onNavigate={setActiveSection}
        onLogout={onLogout}
      />
      <main className="staff-main">
        <header className="staff-page-header">
          <div>
            <p className="staff-eyebrow">RV UNIVERSITY ATHLETICS</p>
            <h1>{activeSection === 'overview'
              ? 'Dashboard Overview'
              : activeSection === 'sports' ? 'Sports Management' : 'Tournament Management'}</h1>
            <p>Manage the records shared with the RVU Sports Portal.</p>
          </div>
          <span className="staff-role-badge">{currentUser.role}</span>
        </header>

        {activeSection === 'overview' && (
          <section className="staff-overview">
            <div className="staff-welcome-card">
              <span className="staff-welcome-icon">🏟️</span>
              <div>
                <h2>Welcome, {currentUser.name}</h2>
                <p>Sports and tournament changes are reflected in the student portal from the same database.</p>
              </div>
            </div>
            <div className="staff-summary-grid">
              <button className="staff-summary-card" onClick={() => setActiveSection('sports')}>
                <span>Sports records</span>
                <strong>{sportsLoading ? '…' : sportsList.length}</strong>
                <small>Open sports management →</small>
              </button>
              <button className="staff-summary-card" onClick={() => setActiveSection('tournaments')}>
                <span>Tournaments</span>
                <strong>{tournamentsLoading ? '…' : tournamentsList.length}</strong>
                <small>Open tournament management →</small>
              </button>
            </div>
            {(sportsError || tournamentsError) && (
              <p className="staff-alert staff-alert-error" role="alert">
                {sportsError || tournamentsError}
              </p>
            )}
          </section>
        )}

        {activeSection === 'sports' && (
          <SportsManagement
            sportsList={sportsList}
            loading={sportsLoading}
            error={sportsError}
            onRefresh={onRefreshSports}
            onCreateSport={onCreateSport}
            onUpdateSport={onUpdateSport}
            onDeleteSport={onDeleteSport}
          />
        )}

        {activeSection === 'tournaments' && (
          <TournamentManagement
            sportsList={sportsList}
            tournamentsList={tournamentsList}
            loading={tournamentsLoading}
            error={tournamentsError}
            onRefresh={onRefreshTournaments}
            onCreateTournament={onCreateTournament}
            onUpdateTournament={onUpdateTournament}
            onDeleteTournament={onDeleteTournament}
          />
        )}
      </main>
    </div>
  )
}

export default StaffDashboard
