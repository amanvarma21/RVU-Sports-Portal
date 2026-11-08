import { useState } from 'react'

const emptyTournament = {
  title: '',
  sport: '',
  date: '',
  status: 'Upcoming',
  description: '',
  maxTeams: 16,
}

function TournamentForm({ tournament, sportsList, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => tournament
    ? { ...emptyTournament, ...tournament }
    : emptyTournament)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        title: formData.title,
        sport: formData.sport,
        date: formData.date,
        status: formData.status,
        description: formData.description,
        maxTeams: Number(formData.maxTeams),
      })
    } catch (submitError) {
      setError(submitError.message || 'Unable to save this tournament.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="staff-form" onSubmit={handleSubmit}>
      <h3>{tournament ? 'Edit tournament' : 'Add a tournament'}</h3>
      {error && <p className="staff-alert staff-alert-error" role="alert">{error}</p>}
      <div className="staff-form-grid">
        <label className="staff-field">
          Tournament title
          <input
            value={formData.title}
            onChange={(event) => setFormData((current) => ({ ...current, title: event.target.value }))}
            required
          />
        </label>
        <label className="staff-field">
          Sport
          <input
            list="staff-sport-options"
            value={formData.sport}
            onChange={(event) => setFormData((current) => ({ ...current, sport: event.target.value }))}
            required
          />
          <datalist id="staff-sport-options">
            {sportsList.map((sport) => <option key={sport.id} value={sport.name} />)}
          </datalist>
        </label>
        <label className="staff-field">
          Date / schedule
          <input
            value={formData.date}
            onChange={(event) => setFormData((current) => ({ ...current, date: event.target.value }))}
            required
          />
        </label>
        <label className="staff-field">
          Status
          <select
            value={formData.status}
            onChange={(event) => setFormData((current) => ({ ...current, status: event.target.value }))}
          >
            {['Upcoming', 'Open', 'Live', 'Completed'].map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="staff-field">
          Maximum teams
          <input
            type="number"
            min="1"
            step="1"
            value={formData.maxTeams}
            onChange={(event) => setFormData((current) => ({ ...current, maxTeams: event.target.value }))}
            required
          />
        </label>
        <label className="staff-field staff-field-wide">
          Description
          <textarea
            rows="4"
            value={formData.description}
            onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
            required
          />
        </label>
      </div>
      <p className="staff-form-note">
        Registration counts, registered athletes, and creator details remain managed by the system.
      </p>
      <div className="staff-form-actions">
        <button type="button" className="staff-button staff-button-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="staff-button staff-button-primary" disabled={submitting}>
          {submitting ? 'Saving…' : tournament ? 'Save changes' : 'Create tournament'}
        </button>
      </div>
    </form>
  )
}

export default TournamentForm
