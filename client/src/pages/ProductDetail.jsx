import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../api/endpoints'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Reviews from '../components/Reviews'
import WishlistButton from '../components/WishlistButton'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const { data } = await getProductById(id)
        setProduct(data)
      } catch (err) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(product, qty)
    navigate('/cart')
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4 dark:bg-gray-800">
        <p className="text-red-500 text-xl">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 hover:underline mb-6 flex items-center gap-1"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Left - Images */}
        <div>

          {/* Main Image */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-4">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/500'}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${
                    selectedImage === index
                      ? 'border-blue-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Info */}
        <div>

          {/* Category */}
          <p className="text-blue-600 text-sm font-medium uppercase tracking-wide mb-2">
            {product.category}
          </p>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={
                    star <= Math.round(product.rating)
                      ? 'text-yellow-400 text-xl'
                      : 'text-gray-300 text-xl'
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-4xl font-bold text-blue-600 mb-4">
            ₹{product.price.toLocaleString()}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                ✗ Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg transition"
                >
                  −
                </button>
                <span className="px-4 py-2 font-semibold border-x border-gray-300 dark:border-gray-600 dark:text-white">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((prev) => Math.min(product.stock, prev + 1))}
                  className="px-3 py-2 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg transition"
                >
                  +
                </button>
              </div>
              <span className="text-gray-400 dark:text-gray-400 text-sm">
                Max {product.stock}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 py-3 rounded-lg font-semibold transition ${
                addedToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>
          <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>

              {/* Wishlist Button */}
              <div className="flex items-center justify-center w-14 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                <WishlistButton productId={product._id} />
              </div>
            </div>

          {/* Extra Info */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
            <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>🚚</span>
              <span>Free delivery on orders above ₹500</span>
            </div>
            <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>↩️</span>
              <span>Easy 7 day returns</span>
            </div>
            <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>✅</span>
              <span>100% genuine products</span>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-gray-200 dark:border-gray-600 mt-12 pt-8">
        <Reviews productId={id} />
      </div>

    </div>
  )
}

export default ProductDetail