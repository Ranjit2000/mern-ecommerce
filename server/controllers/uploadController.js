import cloudinary from '../config/cloudinary.js'

// Upload Single Image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' })
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      message: 'Image uploaded successfully'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete Image
export const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body

    if (!public_id) {
      return res.status(400).json({ message: 'Public ID required' })
    }

    await cloudinary.uploader.destroy(public_id)
    res.json({ message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}