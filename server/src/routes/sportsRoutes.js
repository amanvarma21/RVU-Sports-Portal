import { Router } from 'express'
import {
  getAllSports,
  getSportById,
  getRecentMatches,
  createSport,
  updateSport,
  deleteSport,
} from '../controllers/sportsController.js'
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/', getAllSports)
router.get('/matches/recent', getRecentMatches)
router.get('/:id', getSportById)
router.post('/', authenticateToken, requireRole(['staff', 'faculty', 'admin']), createSport)
router.put('/:id', authenticateToken, requireRole(['staff', 'faculty', 'admin']), updateSport)
router.delete('/:id', authenticateToken, requireRole(['staff', 'faculty', 'admin']), deleteSport)

export default router
