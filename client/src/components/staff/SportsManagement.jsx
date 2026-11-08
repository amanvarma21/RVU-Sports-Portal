import { useState } from 'react'
import SportForm from './SportForm.jsx'

function SportsManagement({
  sportsList,
  loading,
  error,
  onRefresh,
  onCreateSport,
  onUpdateSport,
  onDeleteSport,
}) {
  const [editingSport, setEditingSport] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState(null)

  const finishMutation = async (result) => {
    setShowForm(false)
    setEditingSport(null)
    setNotice({ type: 'success', message: result.message || 'Sport saved successfully.' })
    try {
      await onRefresh()
    } catch (refreshError) {
      setNotice({
        type: 'error',
        message: `The change was saved, but the sports list could not be refreshed: ${refreshError.message}`,
      })
    }
  }

  const handleSave = async (data) => {
    setNotice(null)
    const result = editingSport
      ? await onUpdateSport(editingSport.id, data)
      : await onCreateSport(data)
    await finishMutation(result)
  }

  const handleDelete = async (sport) => {
    if (!window.confirm(`Delete ${sport.name}? This action cannot be undone.`)) return
    setNotice(null)
    try {
      const result = await onDeleteSport(sport.id)
      setNotice({ type: 'success', message: result.message || 'Sport deleted successfully.' })
      try {
        await onRefresh()
      } catch (refreshError) {
        setNotice({
          type: 'error',
          message: `The sport was deleted, but the list could not be refreshed: ${refreshError.message}`,
        })
      }
    } catch (deleteError) {
      setNotice({ type: 'error', message: deleteError.message || 'Unable to delete sport.' })
    }
  }

  return (
    <section className="staff-management">
      <div className="staff-management-toolbar">
        <div>
          <h2>Sports</h2>
          <p>Manage the teams and roster details shown in the student portal.</p>
        </div>
        <div className="staff-toolbar-actions">
          <button className="staff-button staff-button-secondary" onClick={() => onRefresh().catch(() => {})} disabled={loading}>
            Refresh
          </button>
          <button
            className="staff-button staff-button-primary"
            onClick={() => { setEditingSport(null); setShowForm(true); setNotice(null) }}
          >
            Add sport
          </button>
        </div>
      </div>

      {notice && <p className={`staff-alert staff-alert-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.message}</p>}
      {error && <p className="staff-alert staff-alert-error" role="alert">{error}</p>}
      {showForm && (
        <SportForm
          key={editingSport?.id || 'new-sport'}
          sport={editingSport}
          onSubmit={handleSave}
          onCancel={() => { setShowForm(false); setEditingSport(null) }}
        />
      )}
      {loading && <p className="staff-empty-state" role="status">Loading sports…</p>}
      {!loading && !error && sportsList.length === 0 && (
        <p className="staff-empty-state">No sports found. Use “Add sport” to create the first record.</p>
      )}
      {sportsList.length > 0 && (
        <div className="staff-record-grid">
          {sportsList.map((sport) => (
            <article className="staff-record-card" key={sport.id}>
              <div className="staff-record-heading">
                <span className="staff-record-icon">{sport.icon}</span>
                <div>
                  <h3>{sport.name}</h3>
                  <span>{sport.id}</span>
                </div>
              </div>
              <p>{sport.tagline}</p>
              <dl className="staff-record-details">
                <div><dt>Captain</dt><dd>{sport.captain}</dd></div>
                <div><dt>Squad</dt><dd>{sport.squadSize}</dd></div>
                <div><dt>Ground</dt><dd>{sport.ground}</dd></div>
                <div><dt>Roster entries</dt><dd>{sport.roster?.length || 0}</dd></div>
              </dl>
              <div className="staff-record-actions">
                <button className="staff-button staff-button-secondary" onClick={() => { setEditingSport(sport); setShowForm(true); setNotice(null) }}>
                  Edit
                </button>
                <button className="staff-button staff-button-danger" onClick={() => handleDelete(sport)}>
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

export default SportsManagement
