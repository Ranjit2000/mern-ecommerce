import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getReviews, addReview, deleteReview } from '../api/endpoints'

const Reviews = ({ productId }) => {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await getReviews(productId)
      setReviews(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (formData.rating === 0) {
      return setError('Please select a rating')
    }
    if (!formData.comment.trim()) {
      return setError('Please write a comment')
    }

    try {
      setSubmitting(true)
      await addReview(productId, formData)
      setSuccess('Review added successfully!')
      setFormData({ rating: 0, comment: '' })
      setHoveredStar(0)
      fetchReviews()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return
    try {
      await deleteReview(productId, reviewId)
      fetchReviews()
    } catch (err) {
      console.error(err)
    }
  }

  const alreadyReviewed = reviews.find(
    (r) => r.user?._id === user?._id || r.user === user?._id
  )

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

  return (
    <div className="mt-12">

      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Reviews & Ratings
      </h2>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-center gap-6">

          {/* Average */}
          <div className="text-center">
            <p className="text-6xl font-bold text-blue-600">
              {averageRating.toFixed(1)}
            </p>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Breakdown */}
          <div className="flex-1 w-full">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const percentage = reviews.length > 0
                ? (count / reviews.length) * 100
                : 0
              return (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-300 w-4">
                    {star}
                  </span>
                  <span className="text-yellow-400 text-sm">★</span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-4">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* Add Review Form */}
      {user ? (
        !alreadyReviewed ? (
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 mb-8">

            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Write a Review
            </h3>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                {success}
              </div>
            )}

            {/* Star Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={
                      star <= (hoveredStar || formData.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }>
                      ★
                    </span>
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {ratingLabels[formData.rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Review
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>

          </div>
        ) : (
          <div className="bg-green-50 dark:bg-gray-700 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-8">
            <p className="text-green-700 dark:text-green-400 font-medium">
              ✓ You have already reviewed this product
            </p>
          </div>
        )
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Please login to write a review
          </p>
          
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium inline-block"
          <a>
            Login to Review
          </a>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-5xl mb-4">💬</p>
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-3">

                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                {user && (
                  user._id === review.user?._id ||
                  user._id === review.user ||
                  user.role === 'admin'
                ) && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                  >
                    Delete
                  </button>
                )}

              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {ratingLabels[review.rating]}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>

            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Reviews