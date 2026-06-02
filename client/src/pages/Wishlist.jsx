import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'

const Wishlist = () => {
  const { wishlistItems, removeItem, clearAll, loading } = useWishlist()
  const { addToCart } = useCart()

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 dark:bg-gray-800">
        <div className="text-8xl">🤍</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Save products you love to your wishlist
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Wishlist ❤️
        </h1>
        <button
          onClick={clearAll}
          className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
        >
          Clear All
        </button>
      </div>

      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
      </p>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistItems.map((product) => (
          <div
            key={product._id}
            className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
          >
            {/* Image */}
            <div className="relative">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                />
              </Link>

              {/* Remove Button */}
              <button
                onClick={() => removeItem(product._id)}
                className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md text-red-500 hover:text-red-700 transition"
              >
                ❤️
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <Link to={`/products/${product._id}`}>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-1 hover:text-blue-600 truncate">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-400 dark:text-gray-300 text-xs mb-2 uppercase">
                {product.category}
              </p>

              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p className={`text-xs mb-3 font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold text-lg">
                  ₹{product.price.toLocaleString()}
                </span>
                <button
                  onClick={() => addToCart(product, 1)}
                  disabled={product.stock === 0}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Wishlist