import express from 'express'
import User from '../models/User.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Get all users - admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router