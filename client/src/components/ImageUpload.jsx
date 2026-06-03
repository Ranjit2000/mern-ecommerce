import { useState } from 'react'
import { uploadImage } from '../api/endpoints'

const ImageUpload = ({ onUpload, currentImage }) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return setError('Only JPG, PNG and WebP images are allowed')
    }

    // Validate file size 5MB
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image must be less than 5MB')
    }

    setError('')
    setSuccess(false)

    // Show local preview immediately
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)

    // Upload to Cloudinary via backend
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      const { data } = await uploadImage(formData)

      // Update preview with Cloudinary URL
      setPreview(data.url)

      // Call parent with URL
      onUpload(data.url, data.public_id)

      // Show success
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
      console.error('Upload error:', err)
      setError(
        err.response?.data?.message ||
        'Upload failed. Please try again.'
      )
      setPreview(currentImage || '')
      setSuccess(false)
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  return (
    <div className="w-full">

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
            : success
            ? 'border-green-500 bg-green-50 dark:bg-green-900'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >

        {/* Preview Image */}
        {preview ? (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-xl mx-auto shadow-md"
            />
          </div>
        ) : (
          <div className="mb-4">
            <div className="text-5xl mb-2">📸</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Drag and drop image here
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              or click to browse
            </p>
          </div>
        )}

        {/* Upload Button */}
        <label className={uploading ? 'cursor-not-allowed' : 'cursor-pointer'}>
          <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium transition ${
            uploading
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}>
            {uploading
              ? 'Uploading...'
              : preview
              ? 'Change Image'
              : 'Choose Image'
            }
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInputChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="mt-4 px-4">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-blue-600 text-xs mt-1">
              Uploading to Cloudinary...
            </p>
          </div>
        )}

        <p className="text-gray-400 dark:text-gray-500 text-xs mt-3">
          JPG, PNG, WebP up to 5MB
        </p>

      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-red-500 text-sm">❌ {error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 mt-2 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
          <span className="text-green-600 dark:text-green-400 text-sm font-medium">
            ✅ Image uploaded successfully to Cloudinary!
          </span>
        </div>
      )}

      {/* Image Ready - when preview exists but not just uploaded */}
      {preview && !uploading && !success && !error && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            🖼️ Image ready
          </span>
        </div>
      )}

    </div>
  )
}

export default ImageUpload