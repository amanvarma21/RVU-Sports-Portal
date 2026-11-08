import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import sportsRoutes from './routes/sportsRoutes.js'
import tournamentsRoutes from './routes/tournamentsRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Global Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', "https://rvu-sports-portal.onrender.com"],
    credentials: true,
  })
)
app.use(express.json())

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// Root Welcome & API Directory Endpoint
app.get(['/', '/api'], (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏀 Welcome to RVU Sports Portal API Server!',
    university: 'RV University, Bengaluru',
    status: 'online',
    frontendUrl: CLIENT_URL,
    endpoints: {
      sports: '/api/sports',
      sportById: '/api/sports/:id (e.g., /api/sports/cricket, /api/sports/football)',
      recentMatches: '/api/sports/matches/recent',
      tournaments: '/api/tournaments',
      tournamentById: '/api/tournaments/:id (e.g., /api/tournaments/tourn_1)',
      registerTournament: 'POST /api/tournaments/:id/register (Requires Bearer Token)',
      login: 'POST /api/auth/login (Accepts @rvu.edu.in emails only)',
      registerUser: 'POST /api/auth/register',
      userProfile: 'GET /api/auth/me (Requires Bearer Token)',
    },
    demoAccounts: [
      { role: 'Student / Athlete', email: 'aman.varma@rvu.edu.in', password: 'password123' },
      { role: 'Coach / Faculty', email: 'coach.sharma@rvu.edu.in', password: 'password123' },
    ],
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/sports', sportsRoutes)
app.use('/api/tournaments', tournamentsRoutes)

// 404 & Centralized Error Handlers
app.use(notFoundHandler)
app.use(errorHandler)

export default app
