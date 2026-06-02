import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} from '../api/endpoints'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setWishlistItems([])
    }
  }, [user])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const { data } = await getWishlist()
      setWishlistItems(data.products || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId) => {
    try {
      await addToWishlist(productId)
      fetchWishlist()
      return { success: true }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to add'
      }
    }
  }

  const removeItem = async (productId) => {
    try {
      await removeFromWishlist(productId)
      fetchWishlist()
    } catch (err) {
      console.error(err)
    }
  }

  const clearAll = async () => {
    try {
      await clearWishlist()
      setWishlistItems([])
    } catch (err) {
      console.error(err)
    }
  }

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => item._id === productId || item === productId
    )
  }

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      addItem,
      removeItem,
      clearAll,
      isInWishlist,
      fetchWishlist,
      wishlistCount: wishlistItems.length
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)