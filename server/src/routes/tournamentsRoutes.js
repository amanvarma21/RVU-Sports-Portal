import { Router } from 'express'
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
} from '../controllers/tournamentsController.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'

const router = Router()

// Public: Get all tournaments & single tournament
router.get('/', getAllTournaments)
router.get('/:id', getTournamentById)

// Protected (Faculty / Staff Only): Host new tournament / add event
router.post('/', authenticateToken, requireRole(['staff', 'faculty', 'admin']), createTournament)
router.put('/:id', authenticateToken, requireRole(['staff', 'faculty', 'admin']), updateTournament)
router.delete('/:id', authenticateToken, requireRole(['staff', 'faculty', 'admin']), deleteTournament)

// Protected (Student / Athletes): Register for tournament
router.post('/:id/register', authenticateToken, registerForTournament)

export default router
