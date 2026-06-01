import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById } from '../api/endpoints'

const OrderSuccess = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await getOrderById(id)
        setOrder(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchOrder()
  }, [id])

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">

      {/* Success Icon */}
      <div className="text-8xl mb-6">🎉</div>

      <h1 className="text-3xl font-bold text-green-600 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-500 mb-6">
        Thank you for your order. We'll deliver it soon!
      </p>

      {/* Order ID */}
      {order && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">

          <h2 className="font-bold text-gray-800 mb-4">Order Details</h2>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="font-mono text-xs">{order._id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total:</span>
              <span className="font-bold text-blue-600">
                ₹{order.totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-orange-500 font-medium">
                Processing
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Delivery to:</span>
              <span>
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <h3 className="font-bold text-gray-800 mb-3">Items Ordered</h3>
          <div className="space-y-2">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.name} x {item.qty}
                </span>
                <span className="font-medium">
                  ₹{(item.price * item.qty).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Link
          to="/orders"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          View My Orders
        </Link>
        <Link
          to="/products"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Continue Shopping
        </Link>
      </div>

    </div>
  )
}

export default OrderSuccess