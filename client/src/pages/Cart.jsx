import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, cartTotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 dark:bg-gray-800 transition-colors duration-300">
        <div className="text-8xl">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Add some products to get started
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Shopping Cart
        </h1>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-4 flex gap-4 items-center"
            >
              <img
                src={item.images?.[0] || 'https://via.placeholder.com/100'}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />

              <div className="flex-1">
                <Link
                  to={`/products/${item._id}`}
                  className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 line-clamp-1"
                >
                  {item.name}
                </Link>
                <p className="text-gray-400 dark:text-gray-300 text-sm mb-2">
                  {item.category}
                </p>
                <p className="text-blue-600 font-bold">
                  ₹{item.price.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center border border-gray-300 dark:border-gray-500 rounded-lg">
                <button
                  onClick={() =>
                    item.qty === 1
                      ? removeFromCart(item._id)
                      : addToCart(item, item.qty - 1)
                  }
                  className="px-3 py-1 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg transition"
                >
                  −
                </button>
                <span className="px-3 py-1 font-semibold border-x border-gray-300 dark:border-gray-500 dark:text-white">
                  {item.qty}
                </span>
                <button
                  onClick={() => addToCart(item, item.qty + 1)}
                  className="px-3 py-1 text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg transition"
                >
                  +
                </button>
              </div>

              <div className="text-right min-w-[80px]">
                <p className="font-bold text-gray-800 dark:text-white">
                  ₹{(item.price * item.qty).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-400 hover:text-red-600 transition text-xl"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 sticky top-24">

            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                  <span className="truncate flex-1 mr-2">
                    {item.name} x {item.qty}
                  </span>
                  <span className="font-medium">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <hr className="my-4 dark:border-gray-600" />

            <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
              <span>Subtotal</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
              <span>Delivery</span>
              <span className={cartTotal > 500 ? 'text-green-600' : ''}>
                {cartTotal > 500 ? 'FREE' : '₹50'}
              </span>
            </div>

            <hr className="my-4 dark:border-gray-600" />

            <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-white mb-6">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{(cartTotal > 500 ? cartTotal : cartTotal + 50).toLocaleString()}
              </span>
            </div>

            {cartTotal <= 500 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 text-center">
                Add ₹{(500 - cartTotal).toLocaleString()} more for FREE delivery
              </p>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>

            <Link
              to="/products"
              className="block text-center text-blue-600 hover:underline mt-3 text-sm"
            >
              ← Continue Shopping
            </Link>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart