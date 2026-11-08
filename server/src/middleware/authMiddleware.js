import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'rvu_sports_secret_jwt_key_2026_super_secure'

/**
 * Middleware to protect private routes requiring valid JWT token
 */
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing authorization token. Please log in with your @rvu.edu.in account.',
    })
  }

  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Session expired or invalid token. Please log in again.',
    })
  }

  try {
    const user = await User.findById(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: User account does not exist or has been deactivated.',
      })
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
    }
    return next()
  } catch (err) {
    return next(err)
  }
}

/**
 * Middleware to restrict access to specific roles (e.g., 'staff', 'faculty', 'admin')
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' })
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: This action requires one of the following roles: ${roles.join(', ')}.`,
      })
    }

    next()
  }
}
