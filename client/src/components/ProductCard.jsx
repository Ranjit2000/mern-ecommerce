import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import WishlistButton from './WishlistButton'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">

      {/* Image with Wishlist Button */}
      <div className="relative">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-48 object-cover hover:scale-105 transition duration-300"
          />
        </Link>

        {/* Wishlist Button on image */}
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
          <WishlistButton productId={product._id} />
        </div>
      </div>

      <div className="p-4">

        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 dark:text-white mb-1 hover:text-blue-600 truncate">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 dark:text-gray-300 text-xs mb-2 uppercase tracking-wide">
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
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>

        <p className={`text-xs mb-3 font-medium ${
          product.stock > 0 ? 'text-green-600' : 'text-red-500'
        }`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
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
  )
}

export default ProductCard