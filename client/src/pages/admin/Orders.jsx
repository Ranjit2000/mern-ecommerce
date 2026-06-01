import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAllOrders, updateOrderToDelivered } from '../../api/endpoints'

const AdminOrders = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/')
  }, [user, navigate])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data } = await getAllOrders()
      setOrders(data.orders)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeliver = async (id) => {
    try {
      await updateOrderToDelivered(id)
      setSuccess('Order marked as delivered')
      fetchOrders()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Orders
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="text-left px-4 py-3">Order ID</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Total</th>
                <th className="text-left px-4 py-3">Paid</th>
                <th className="text-left px-4 py-3">Delivered</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">
                      {order.user?.name || 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.isPaid
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.isDelivered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!order.isDelivered && (
                      <button
                        onClick={() => handleDeliver(order._id)}
                        className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-200 transition"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AdminOrders