import Wishlist from '../models/Wishlist.js';

// Get user wishlist
export const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products')

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: []
      })
    }

    res.json(wishlist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body

    let wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId]
      })
    } else {
      // Check if already in wishlist
      const alreadyAdded = wishlist.products.includes(productId)
      if (alreadyAdded) {
        return res.status(400).json({ message: 'Product already in wishlist' })
      }
      wishlist.products.push(productId)
      await wishlist.save()
    }

    res.status(201).json({ message: 'Added to wishlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId
    )

    await wishlist.save()
    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Clear wishlist
export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })

    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' })
    }

    wishlist.products = []
    await wishlist.save()
    res.json({ message: 'Wishlist cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}