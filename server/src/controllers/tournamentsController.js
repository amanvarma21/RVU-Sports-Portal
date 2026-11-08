import { Tournament } from '../models/Tournament.js'

const TOURNAMENT_STATUSES = ['Upcoming', 'Open', 'Live', 'Completed']
const STATUS_CLASSES = {
  Upcoming: 'status-upcoming',
  Open: 'status-open',
  Live: 'status-live',
  Completed: 'status-upcoming',
}
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i
const TOURNAMENT_FIELDS = ['title', 'sport', 'date', 'description', 'maxTeams', 'status']

const getTournamentUpdates = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A tournament object is required.' }
  }

  const updates = Object.fromEntries(
    TOURNAMENT_FIELDS.filter((field) => Object.hasOwn(body, field)).map((field) => [field, body[field]])
  )
  if (Object.keys(updates).length === 0) {
    return { error: 'Provide at least one valid tournament field to update.' }
  }

  for (const field of ['title', 'sport', 'date', 'description']) {
    if (Object.hasOwn(updates, field)
      && (typeof updates[field] !== 'string' || !updates[field].trim())) {
      return { error: `${field.charAt(0).toUpperCase()}${field.slice(1)} is required.` }
    }
    if (typeof updates[field] === 'string') updates[field] = updates[field].trim()
  }

  if (Object.hasOwn(updates, 'maxTeams')) {
    if (typeof updates.maxTeams !== 'number' && typeof updates.maxTeams !== 'string') {
      return { error: 'Maximum teams must be a positive whole number.' }
    }
    const maxTeams = Number(updates.maxTeams)
    if (!String(updates.maxTeams).trim() || !Number.isInteger(maxTeams) || maxTeams < 1) {
      return { error: 'Maximum teams must be a positive whole number.' }
    }
    updates.maxTeams = maxTeams
  }

  if (Object.hasOwn(updates, 'status')) {
    if (!TOURNAMENT_STATUSES.includes(updates.status)) {
      return { error: `Status must be one of: ${TOURNAMENT_STATUSES.join(', ')}.` }
    }
    updates.statusClass = STATUS_CLASSES[updates.status]
  }

  return { updates }
}

const handleTournamentWriteError = (err, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: err.message })
  }
  return next(err)
}

/**
 * GET /api/tournaments
 * Retrieve all collegiate tournaments from MongoDB Atlas (latest first)
 */
export const getAllTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find({}).sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/tournaments/:id
 * Retrieve single tournament with details
 */
export const getTournamentById = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!OBJECT_ID_PATTERN.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid tournament ID.' })
    }

    const tournament = await Tournament.findById(id)

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: `Tournament with ID '${id}' not found.`,
      })
    }

    res.status(200).json({
      success: true,
      data: tournament,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/tournaments
 * Protected endpoint (Faculty / Staff Only): Creates a new tournament in MongoDB Atlas
 */
export const createTournament = async (req, res, next) => {
  try {
    const body = { ...req.body }
    if (!Object.hasOwn(body, 'maxTeams')) body.maxTeams = 16
    if (!Object.hasOwn(body, 'status')) body.status = 'Upcoming'
    const { updates, error } = getTournamentUpdates(body)
    if (error) {
      return res.status(400).json({ success: false, message: error })
    }

    const newTournament = await Tournament.create({
      ...updates,
      registeredCount: 0,
      createdBy: req.user.id,
      createdByName: req.user.name,
      createdByEmail: req.user.email,
      registeredAthletes: [],
    })

    res.status(201).json({
      success: true,
      message: `Tournament '${newTournament.title}' hosted successfully by ${req.user.name}!`,
      data: newTournament,
    })
  } catch (err) {
    return handleTournamentWriteError(err, res, next)
  }
}

/**
 * PUT /api/tournaments/:id
 * Update editable fields without overwriting registrations or ownership metadata.
 */
export const updateTournament = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!OBJECT_ID_PATTERN.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid tournament ID.' })
    }

    const { updates, error } = getTournamentUpdates(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error })
    }

    const tournament = await Tournament.findByIdAndUpdate(
      id,
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    )
    if (!tournament) {
      return res.status(404).json({ success: false, message: `Tournament '${id}' not found.` })
    }

    return res.status(200).json({
      success: true,
      message: `Tournament '${tournament.title}' updated successfully.`,
      data: tournament,
    })
  } catch (err) {
    return handleTournamentWriteError(err, res, next)
  }
}

/**
 * DELETE /api/tournaments/:id
 * Delete the selected tournament and its embedded registrations.
 */
export const deleteTournament = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!OBJECT_ID_PATTERN.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid tournament ID.' })
    }

    const tournament = await Tournament.findByIdAndDelete(id)
    if (!tournament) {
      return res.status(404).json({ success: false, message: `Tournament '${id}' not found.` })
    }

    return res.status(200).json({
      success: true,
      message: `Tournament '${tournament.title}' deleted successfully.`,
      data: tournament,
    })
  } catch (err) {
    return handleTournamentWriteError(err, res, next)
  }
}

/**
 * POST /api/tournaments/:id/register
 * Protected endpoint: Registers authenticated student athlete for a tournament
 */
export const registerForTournament = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = req.user
    if (!OBJECT_ID_PATTERN.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid tournament ID.' })
    }

    const tournament = await Tournament.findById(id)

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: `Tournament '${id}' not found.`,
      })
    }

    // Check for duplicate registration
    const alreadyRegistered = tournament.registeredAthletes.some(
      (entry) => entry.userEmail.toLowerCase() === user.email.toLowerCase()
    )

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: `You are already registered for '${tournament.title}'.`,
      })
    }

    // Append athlete entry and increment counter
    tournament.registeredAthletes.push({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      registeredAt: new Date(),
    })
    tournament.registeredCount = (tournament.registeredCount || 0) + 1

    await tournament.save()

    res.status(200).json({
      success: true,
      message: `Successfully registered ${user.name} (${user.email}) for ${tournament.title}!`,
      data: tournament,
    })
  } catch (err) {
    next(err)
  }
}
