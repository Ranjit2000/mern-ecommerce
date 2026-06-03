import express from 'express'
import { uploadImage, deleteImage } from '../controllers/uploadController.js'
import { upload } from '../config/cloudinary.js'
import { protect, admin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Upload image - admin only
router.post('/', protect, admin, upload.single('image'), uploadImage)

// Delete image - admin only
router.delete('/', protect, admin, deleteImage)

export default router