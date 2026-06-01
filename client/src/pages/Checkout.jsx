import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/endpoints'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const deliveryCharge = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + deliveryCharge

  // Fix - use useEffect for redirects
  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [user, cartItems, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    setError('')

    // Validation
    if (!formData.address || !formData.city || !formData.postalCode) {
      return setError('Please fill in all address fields')
    }

    if (cartItems.length === 0) {
      return setError('Your cart is empty')
    }

    try {
      setLoading(true)

      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: formData,
        totalPrice: finalTotal,
      }

      const { data } = await createOrder(orderData)
      clearCart()
      navigate(`/order-success/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  // Show nothing while redirecting
  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left - Shipping Form */}
        <div className="lg:col-span-2 space-y-4">

          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📦 Shipping Address
            </h2>

            {/* Error */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, Apartment 4B"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* City & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              👤 Account Details
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex gap-2">
                <span className="font-medium w-20">Name:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium w-20">Email:</span>
                <span>{user.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">

            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🧾 Order Summary
            </h2>

            {/* Items List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.qty} x ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                  {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            {/* Total */}
            <div className="flex justify-between font-bold text-lg text-gray-800 mb-6">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? 'Placing Order...' : '✓ Place Order'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By placing order you agree to our terms and conditions
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}


export default Checkout