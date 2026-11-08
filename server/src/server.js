import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000

// Initialize MongoDB Atlas connection before starting server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
=============================================================
  🏀 RVU SPORTS PORTAL — BACKEND SERVER RUNNING
=============================================================
  ⚡ Environment: ${process.env.NODE_ENV || 'development'}
  🔗 API Server:  http://localhost:${PORT}
  🍃 Database:    MongoDB Atlas (rvu_sports)
  🔒 Auth Domain: @rvu.edu.in strictly enforced
=============================================================
      `)
    })
  })
  .catch((err) => {
    console.error('❌ Failed to start server due to database connection error:', err.message)
    process.exit(1)
  })
