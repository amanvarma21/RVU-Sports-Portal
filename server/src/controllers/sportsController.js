import { Sport } from '../models/Sport.js'
import { Match } from '../models/Match.js'
import { Tournament } from '../models/Tournament.js'

/**
 * GET /api/sports
 * Retrieve all varsity sports from MongoDB Atlas
 */
export const getAllSports = async (req, res, next) => {
  try {
    const sports = await Sport.find({}).sort({ name: 1 })
    res.status(200).json({
      success: true,
      count: sports.length,
      data: sports,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/sports/:id
 * Retrieve single sport by ID with roster and matches
 */
export const getSportById = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!/^[a-z0-9-]+$/i.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID.' })
    }

    const sport = await Sport.findOne({ id: id.toLowerCase() })

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: `Sport '${id}' not found in RVU athletics directory.`,
      })
    }

    const matches = await Match.find({ sportId: sport.id }).sort({ date: -1 })

    res.status(200).json({
      success: true,
      data: {
        ...sport.toObject(),
        recentMatches: matches,
      },
    })
  } catch (err) {
    next(err)
  }
}

const SPORT_FIELDS = [
  'name',
  'icon',
  'themeClass',
  'tagline',
  'squadSize',
  'captain',
  'ground',
  'nextMatch',
  'recentForm',
  'roster',
]

const getSportUpdates = (body, { allowEmpty = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'A sport object is required.' }
  }

  const updates = Object.fromEntries(
    SPORT_FIELDS.filter((field) => Object.hasOwn(body, field)).map((field) => [field, body[field]])
  )

  if (!allowEmpty && Object.keys(updates).length === 0) {
    return { error: 'Provide at least one valid sport field to update.' }
  }

  for (const field of ['name', 'icon', 'captain', 'ground']) {
    if (Object.hasOwn(updates, field)
      && (typeof updates[field] !== 'string' || !updates[field].trim())) {
      return { error: `${field.charAt(0).toUpperCase()}${field.slice(1)} is required.` }
    }
  }

  for (const field of ['themeClass', 'tagline', 'nextMatch', 'recentForm']) {
    if (Object.hasOwn(updates, field) && typeof updates[field] !== 'string') {
      return { error: `${field} must be a string.` }
    }
  }

  if (Object.hasOwn(updates, 'squadSize')
    && ((typeof updates.squadSize !== 'number' && typeof updates.squadSize !== 'string')
      || !String(updates.squadSize).trim()
      || !Number.isInteger(Number(updates.squadSize))
      || Number(updates.squadSize) < 0)) {
    return { error: 'Squad size must be a non-negative whole number.' }
  }

  if (Object.hasOwn(updates, 'roster') && !Array.isArray(updates.roster)) {
    return { error: 'Roster must be an array of players.' }
  }
  if (Array.isArray(updates.roster) && updates.roster.some((player) => (
    !player
      || typeof player !== 'object'
      || Array.isArray(player)
      || typeof player.name !== 'string'
      || !player.name.trim()
      || (player.role !== undefined && typeof player.role !== 'string')
  ))) {
    return { error: 'Each roster entry must include a player name and an optional string role.' }
  }

  return { updates }
}

const handleSportWriteError = (err, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'A sport with this ID already exists.' })
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: err.message })
  }
  return next(err)
}

/**
 * POST /api/sports
 * Create a sport. The public slug ID is unique and is used by existing match records.
 */
export const createSport = async (req, res, next) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(400).json({ success: false, message: 'A sport object is required.' })
    }

    const id = typeof body.id === 'string' ? body.id.trim().toLowerCase() : ''
    if (!/^[a-z0-9-]+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Sport ID is required and may contain only lowercase letters, numbers, and hyphens.',
      })
    }

    const { updates, error } = getSportUpdates(body, { allowEmpty: true })
    if (error) {
      return res.status(400).json({ success: false, message: error })
    }

    const sport = await Sport.create({ id, ...updates })
    return res.status(201).json({
      success: true,
      message: `Sport '${sport.name}' created successfully.`,
      data: sport,
    })
  } catch (err) {
    return handleSportWriteError(err, res, next)
  }
}

/**
 * PUT /api/sports/:id
 * Update editable sport fields without changing the stable sport ID.
 */
export const updateSport = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!/^[a-z0-9-]+$/i.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID.' })
    }

    const { updates, error } = getSportUpdates(req.body)
    if (error) {
      return res.status(400).json({ success: false, message: error })
    }

    const existingSport = await Sport.findOne({ id: id.toLowerCase() })
    if (!existingSport) {
      return res.status(404).json({ success: false, message: `Sport '${id}' not found.` })
    }
    if (Object.hasOwn(updates, 'name') && updates.name.trim() !== existingSport.name
      && await Tournament.exists({ sport: existingSport.name })) {
      return res.status(409).json({
        success: false,
        message: `Sport '${existingSport.name}' is referenced by tournaments. Update those tournament records first.`,
      })
    }

    const sport = await Sport.findOneAndUpdate(
      { id: id.toLowerCase() },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    )
    if (!sport) {
      return res.status(404).json({ success: false, message: `Sport '${id}' not found.` })
    }

    return res.status(200).json({
      success: true,
      message: `Sport '${sport.name}' updated successfully.`,
      data: sport,
    })
  } catch (err) {
    return handleSportWriteError(err, res, next)
  }
}

/**
 * DELETE /api/sports/:id
 * Preserve existing Match records that reference the sport.
 */
export const deleteSport = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!/^[a-z0-9-]+$/i.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid sport ID.' })
    }

    const sport = await Sport.findOne({ id: id.toLowerCase() })
    if (!sport) {
      return res.status(404).json({ success: false, message: `Sport '${id}' not found.` })
    }

    if (await Match.exists({ sportId: sport.id })) {
      return res.status(409).json({
        success: false,
        message: `Sport '${sport.name}' has match records and cannot be deleted.`,
      })
    }

    if (await Tournament.exists({ sport: sport.name })) {
      return res.status(409).json({
        success: false,
        message: `Sport '${sport.name}' is referenced by tournaments and cannot be deleted.`,
      })
    }

    await sport.deleteOne()
    return res.status(200).json({
      success: true,
      message: `Sport '${sport.name}' deleted successfully.`,
      data: sport,
    })
  } catch (err) {
    return next(err)
  }
}

/**
 * GET /api/sports/matches/recent
 * Retrieve recent collegiate match scores and MVPs
 */
export const getRecentMatches = async (req, res, next) => {
  try {
    const matches = await Match.find({}).sort({ date: -1 })
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches,
    })
  } catch (err) {
    next(err)
  }
}
