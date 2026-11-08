import { useState } from 'react'

const emptySport = {
  id: '',
  name: '',
  icon: '',
  tagline: 'Varsity Team',
  squadSize: 15,
  captain: '',
  ground: '',
  nextMatch: 'Upcoming fixture to be announced',
  recentForm: 'W - W - W - D',
  roster: [],
}

function SportForm({ sport, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => sport
    ? { ...emptySport, ...sport, roster: sport.roster || [] }
    : emptySport)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const updateRosterPlayer = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      roster: current.roster.map((player, playerIndex) => (
        playerIndex === index ? { ...player, [field]: value } : player
      )),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const payload = {
      ...formData,
      squadSize: Number(formData.squadSize),
      roster: formData.roster
        .filter((player) => player.name?.trim())
        .map((player) => ({ name: player.name.trim(), role: player.role?.trim() || 'Squad Player' })),
    }
    if (sport) delete payload.id

    try {
      await onSubmit(payload)
    } catch (submitError) {
      setError(submitError.message || 'Unable to save this sport.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="staff-form" onSubmit={handleSubmit}>
      <h3>{sport ? 'Edit sport' : 'Add a sport'}</h3>
      {error && <p className="staff-alert staff-alert-error" role="alert">{error}</p>}
      <div className="staff-form-grid">
        <label className="staff-field">
          Sport ID
          <input name="id" value={formData.id} onChange={updateField} required disabled={Boolean(sport)} pattern="[a-z0-9-]+" title="Use lowercase letters, numbers, and hyphens." />
          {sport && <small>The ID remains fixed to preserve match references.</small>}
        </label>
        <label className="staff-field">
          Name
          <input name="name" value={formData.name} onChange={updateField} required />
        </label>
        <label className="staff-field">
          Icon
          <input name="icon" value={formData.icon} onChange={updateField} required />
        </label>
        <label className="staff-field">
          Tagline
          <input name="tagline" value={formData.tagline} onChange={updateField} />
        </label>
        <label className="staff-field">
          Squad size
          <input name="squadSize" type="number" min="0" step="1" value={formData.squadSize} onChange={updateField} />
        </label>
        <label className="staff-field">
          Captain
          <input name="captain" value={formData.captain} onChange={updateField} required />
        </label>
        <label className="staff-field">
          Home ground
          <input name="ground" value={formData.ground} onChange={updateField} required />
        </label>
        <label className="staff-field">
          Next match
          <input name="nextMatch" value={formData.nextMatch} onChange={updateField} />
        </label>
        <label className="staff-field">
          Recent form
          <input name="recentForm" value={formData.recentForm} onChange={updateField} />
        </label>
      </div>

      <div className="staff-roster-editor">
        <div className="staff-roster-heading">
          <h4>Roster</h4>
          <button
            type="button"
            className="staff-button staff-button-secondary"
            onClick={() => setFormData((current) => ({
              ...current,
              roster: [...current.roster, { name: '', role: 'Squad Player' }],
            }))}
          >
            Add player
          </button>
        </div>
        {formData.roster.map((player, index) => (
          <div className="staff-roster-row" key={index}>
            <input
              aria-label={`Player ${index + 1} name`}
              placeholder="Player name"
              value={player.name || ''}
              onChange={(event) => updateRosterPlayer(index, 'name', event.target.value)}
            />
            <input
              aria-label={`Player ${index + 1} role`}
              placeholder="Player role"
              value={player.role || ''}
              onChange={(event) => updateRosterPlayer(index, 'role', event.target.value)}
            />
            <button
              type="button"
              className="staff-button staff-button-danger"
              onClick={() => setFormData((current) => ({
                ...current,
                roster: current.roster.filter((_, playerIndex) => playerIndex !== index),
              }))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="staff-form-actions">
        <button type="button" className="staff-button staff-button-secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
        <button type="submit" className="staff-button staff-button-primary" disabled={submitting}>
          {submitting ? 'Saving…' : sport ? 'Save changes' : 'Create sport'}
        </button>
      </div>
    </form>
  )
}

export default SportForm
