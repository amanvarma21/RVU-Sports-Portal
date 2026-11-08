import { useState } from 'react'
import TournamentForm from './TournamentForm.jsx'

function TournamentManagement({
  sportsList,
  tournamentsList,
  loading,
  error,
  onRefresh,
  onCreateTournament,
  onUpdateTournament,
  onDeleteTournament,
}) {
  const [editingTournament, setEditingTournament] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState(null)

  const finishMutation = async (result) => {
    setShowForm(false)
    setEditingTournament(null)
    setNotice({ type: 'success', message: result.message || 'Tournament saved successfully.' })
    try {
      await onRefresh()
    } catch (refreshError) {
      setNotice({
        type: 'error',
        message: `The change was saved, but the tournament list could not be refreshed: ${refreshError.message}`,
      })
    }
  }

  const handleSave = async (data) => {
    setNotice(null)
    const id = editingTournament?._id || editingTournament?.id
    const result = editingTournament
      ? await onUpdateTournament(id, data)
      : await onCreateTournament(data)
    await finishMutation(result)
  }

  const handleDelete = async (tournament) => {
    if (!window.confirm(`Delete "${tournament.title}" and its registrations? This action cannot be undone.`)) return
    setNotice(null)
    try {
      const result = await onDeleteTournament(tournament._id || tournament.id)
      setNotice({ type: 'success', message: result.message || 'Tournament deleted successfully.' })
      try {
        await onRefresh()
      } catch (refreshError) {
        setNotice({
          type: 'error',
          message: `The tournament was deleted, but the list could not be refreshed: ${refreshError.message}`,
        })
      }
    } catch (deleteError) {
      setNotice({ type: 'error', message: deleteError.message || 'Unable to delete tournament.' })
    }
  }

  return (
    <section className="staff-management">
      <div className="staff-management-toolbar">
        <div>
          <h2>Tournaments</h2>
          <p>Manage the competitions, dates, and registration settings shown to students.</p>
        </div>
        <div className="staff-toolbar-actions">
          <button className="staff-button staff-button-secondary" onClick={() => onRefresh().catch(() => {})} disabled={loading}>
            Refresh
          </button>
          <button
            className="staff-button staff-button-primary"
            onClick={() => { setEditingTournament(null); setShowForm(true); setNotice(null) }}
          >
            Add tournament
          </button>
        </div>
      </div>

      {notice && <p className={`staff-alert staff-alert-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.message}</p>}
      {error && <p className="staff-alert staff-alert-error" role="alert">{error}</p>}
      {showForm && (
        <TournamentForm
          key={editingTournament?._id || editingTournament?.id || 'new-tournament'}
          tournament={editingTournament}
          sportsList={sportsList}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditingTournament(null) }}
        />
      )}
      {loading && <p className="staff-empty-state" role="status">Loading tournaments…</p>}
      {!loading && !error && tournamentsList.length === 0 && (
        <p className="staff-empty-state">No tournaments found. Use “Add tournament” to create the first record.</p>
      )}
      {tournamentsList.length > 0 && (
        <div className="staff-record-grid staff-tournament-grid">
          {tournamentsList.map((tournament) => (
            <article className="staff-record-card" key={tournament._id || tournament.id}>
              <div className="staff-record-heading">
                <span className={`status-pill ${tournament.statusClass}`}>{tournament.status}</span>
                <span className="staff-record-id">{tournament.sport}</span>
              </div>
              <h3>{tournament.title}</h3>
              <p>{tournament.date}</p>
              <p className="staff-record-description">{tournament.description}</p>
              <dl className="staff-record-details">
                <div><dt>Registered</dt><dd>{tournament.registeredCount || 0}</dd></div>
                <div><dt>Maximum teams</dt><dd>{tournament.maxTeams}</dd></div>
              </dl>
              <div className="staff-record-actions">
                <button className="staff-button staff-button-secondary" onClick={() => { setEditingTournament(tournament); setShowForm(true); setNotice(null) }}>
                  Edit
                </button>
                <button className="staff-button staff-button-danger" onClick={() => handleDelete(tournament)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default TournamentManagement
