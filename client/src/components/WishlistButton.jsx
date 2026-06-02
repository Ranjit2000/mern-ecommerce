import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

const WishlistButton = ({ productId, className = '' }) => {
  const { user } = useAuth()
  const { isInWishlist, addItem, removeItem } = useWishlist()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const inWishlist = isInWishlist(productId)

  const handleToggle = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)
      if (inWishlist) {
        await removeItem(productId)
      } else {
        await addItem(productId)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 ${className}`}
      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
    >
      <span className={`text-2xl ${inWishlist ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}>
        {inWishlist ? '❤️' : '🤍'}
      </span>
    </button>
  )
}

export default WishlistButton