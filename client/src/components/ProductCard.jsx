import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden">

      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">

        {/* Name */}
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 truncate">
            {product.name}
          </h3>
        </Link>

        {/* Category */}
        <p className="text-gray-400 text-xs mb-2 uppercase tracking-wide">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={
                star <= Math.round(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
            >
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-1">
            ({product.numReviews || 0})
          </span>
        </div>

        {/* Stock */}
        <p className={`text-xs mb-3 font-medium ${
          product.stock > 0 ? 'text-green-600' : 'text-red-500'
        }`}>
          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
        </p>

        {/* Price & Button */}
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