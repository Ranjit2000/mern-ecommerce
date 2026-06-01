import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/endpoints'
import { useCart } from '../context/CartContext'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts()
        // Show only first 4 products
        setProducts(data.slice(0, 4))
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No products available yet.
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">

      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Featured Products
        </h2>
        <Link
          to="/products"
          className="text-blue-600 font-medium hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
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
              <Link to={`/products/${product._id}`}>
                <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 truncate">
                  {product.name}
                </h3>
              </Link>

              <p className="text-gray-500 text-sm mb-2 truncate">
                {product.category}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600">
                  {product.rating || 0} ({product.numReviews || 0})
                </span>
              </div>

              {/* Price & Button */}
              <div className="flex items-center justify-between">
                <span className="text-blue-600 font-bold text-lg">
                  ₹{product.price}
                </span>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default FeaturedProducts