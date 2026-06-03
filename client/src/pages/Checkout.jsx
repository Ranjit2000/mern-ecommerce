import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder } from '../api/endpoints'
import useRazorpay from '../hooks/useRazorpay'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { initiatePayment, paymentLoading, paymentError } = useRazorpay()

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('razorpay')

  const deliveryCharge = cartTotal > 500 ? 0 : 50
  const finalTotal = cartTotal + deliveryCharge

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

  const validateForm = () => {
    if (!formData.address || !formData.city || !formData.postalCode) {
      setError('Please fill in all address fields')
      return false
    }
    return true
  }

  // Create order in database
  const createDbOrder = async () => {
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
    return data
  }

  // Handle COD Payment
  const handleCOD = async () => {
    if (!validateForm()) return
    try {
      setLoading(true)
      const order = await createDbOrder()
      clearCart()
      navigate(`/order-success/${order._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  // Handle Razorpay Payment
  const handleRazorpay = async () => {
    if (!validateForm()) return
    setError('')

    try {
      setLoading(true)

      // Create order in DB first
      const order = await createDbOrder()

      // Initiate Razorpay payment
      await initiatePayment({
        amount: finalTotal,
        orderId: order._id,
        user,
        onSuccess: (data) => {
          clearCart()
          navigate(`/order-success/${order._id}`)
        },
        onError: (msg) => {
          setError(msg)
        }
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate payment')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpay()
    } else {
      handleCOD()
    }
  }

  if (!user || cartItems.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left - Forms */}
        <div className="lg:col-span-2 space-y-4">

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📦 Shipping Address
            </h2>

            {(error || paymentError) && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                {error || paymentError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="400001"
                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              👤 Account Details
            </h2>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
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

          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              💳 Payment Method
            </h2>

            <div className="space-y-3">

              {/* Razorpay Option */}
              <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                paymentMethod === 'razorpay'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Razorpay
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pay with Card, UPI, Net Banking, Wallet
                    </p>
                  </div>
                </div>
                <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                  Recommended
                </span>
              </label>

              {/* COD Option */}
              <label className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                paymentMethod === 'cod'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-600"
                />
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pay when your order arrives
                    </p>
                  </div>
                </div>
              </label>

            </div>

            {/* Razorpay Test Info */}
            {paymentMethod === 'razorpay' && (
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
                  🧪 Test Mode — Use these test credentials:
                </p>
                <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-300">
                  <p>Card Number: <span className="font-mono font-bold">4111 1111 1111 1111</span></p>
                  <p>Expiry: <span className="font-mono font-bold">Any future date</span></p>
                  <p>CVV: <span className="font-mono font-bold">Any 3 digits</span></p>
                  <p>UPI: <span className="font-mono font-bold">success@razorpay</span></p>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 sticky top-24">

            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🧾 Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 items-center">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.qty} x ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    ₹{(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <hr className="my-4 dark:border-gray-600" />

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
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

            <hr className="my-4 dark:border-gray-600" />

            {/* Total */}
            <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-white mb-2">
              <span>Total</span>
              <span className="text-blue-600">
                ₹{finalTotal.toLocaleString()}
              </span>
            </div>

            {/* Payment method label */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              via {paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}
            </p>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading || paymentLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading || paymentLoading
                ? 'Processing...'
                : paymentMethod === 'razorpay'
                ? '💳 Pay ₹' + finalTotal.toLocaleString()
                : '✓ Place Order (COD)'
              }
            </button>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
              By placing order you agree to our terms
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout