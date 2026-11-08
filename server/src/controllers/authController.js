import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'rvu_sports_secret_jwt_key_2026_super_secure'

/**
 * Validates that an email strictly ends with rvu.edu.in
 */
export const isRvuEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const clean = email.trim().toLowerCase()
  return /^[^\s@]+@(?:[a-z0-9-]+\.)*rvu\.edu\.in$/.test(clean)
}

/**
 * Derives a formatted full name from an RVU email
 */
const formatNameFromEmail = (email) => {
  const localPart = email.split('@')[0]
  const cleaned = localPart.replace(/([a-zA-Z]+)(bsc|btech|ba|bdes|llb|msc|phd)?[0-9]*$/i, '$1')
  const parts = cleaned.split(/[._-]+/)
  if (parts.length > 1) {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ')
  }
  const spaced = cleaned.replace(/([a-z])([A-Z])/g, '$1 $2')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/**
 * POST /api/auth/login
 * Authenticates user with strict @rvu.edu.in domain validation against MongoDB Atlas
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, role = 'student' } = req.body

    // 1. Validate Email Input
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'University email is required.',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    // 2. Strict @rvu.edu.in domain verification
    if (!isRvuEmail(cleanEmail)) {
      return res.status(403).json({
        success: false,
        message: 'Access Restricted: Only official RV University email addresses (@rvu.edu.in) are permitted.',
      })
    }

    // 3. Validate Password
    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters long.',
      })
    }

    // 4. Find user or auto-provision student accounts only. Staff roles must
    // already be assigned to the account by a trusted administrator.
    let user = await User.findOne({ email: cleanEmail })

    if (!user) {
      if (role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Staff accounts must be provisioned by an administrator before login.',
        })
      }

      // First-time login: auto-provision verified university student account
      const hashedPassword = await bcrypt.hash(password, 10)
      user = await User.create({
        email: cleanEmail,
        password: hashedPassword,
        name: formatNameFromEmail(cleanEmail),
        role: 'student',
        department: 'RV University Varsity Club',
      })
    } else {
      // Verify existing password
      const passwordMatch = await user.comparePassword(password)
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials: The password provided does not match our university records.',
        })
      }
    }

    // 5. Generate secure JWT token (7-day validity)
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/register
 * Explicit registration endpoint for new athletes or faculty
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, name, role = 'student', department } = req.body

    if (role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Staff accounts must be provisioned by an administrator.',
      })
    }

    if (!email || !isRvuEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'A valid @rvu.edu.in email is required.',
      })
    }

    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 4 characters long.',
      })
    }

    const cleanEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: cleanEmail })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this @rvu.edu.in email already exists. Please log in instead.',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: cleanEmail,
      password: hashedPassword,
      name: name?.trim() || formatNameFromEmail(cleanEmail),
      role: 'student',
      department: department?.trim() || 'RV University Athletics',
    })

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Retrieves profile of currently authenticated user via JWT
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  })
}
