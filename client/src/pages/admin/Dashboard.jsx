import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders } from '../../api/endpoints'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await getAllOrders()
        setOrders(data.orders)
        setStats({
          totalOrders: data.orders.length,
          totalSales: data.totalSales,
          pendingOrders: data.orders.filter((o) => !o.isDelivered).length,
          deliveredOrders: data.orders.filter((o) => o.isDelivered).length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Total Sales */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm mb-1">Total Sales</p>
          <p className="text-3xl font-bold text-gray-800">
            ₹{stats.totalSales.toLocaleString()}
          </p>
          <p className="text-blue-500 text-sm mt-2">💰 Revenue</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-gray-500 text-sm mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalOrders}
          </p>
          <p className="text-green-500 text-sm mt-2">📦 All Orders</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.pendingOrders}
          </p>
          <p className="text-yellow-500 text-sm mt-2">⏳ Processing</p>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-gray-500 text-sm mb-1">Delivered</p>
          <p className="text-3xl font-bold text-gray-800">
            {stats.deliveredOrders}
          </p>
          <p className="text-purple-500 text-sm mt-2">✅ Completed</p>
        </div>

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link
          to="/admin/products"
          className="bg-blue-600 text-white rounded-xl p-6 flex items-center gap-4 hover:bg-blue-700 transition"
        >
          <span className="text-4xl">📦</span>
          <div>
            <p className="font-bold text-lg">Manage Products</p>
            <p className="text-blue-200 text-sm">Add, edit, delete products</p>
          </div>
        </Link>

        <Link
          to="/admin/orders"
          className="bg-green-600 text-white rounded-xl p-6 flex items-center gap-4 hover:bg-green-700 transition"
        >
          <span className="text-4xl">🧾</span>
          <div>
            <p className="font-bold text-lg">Manage Orders</p>
            <p className="text-green-200 text-sm">View and update orders</p>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-purple-600 text-white rounded-xl p-6 flex items-center gap-4 hover:bg-purple-700 transition"
        >
          <span className="text-4xl">👥</span>
          <div>
            <p className="font-bold text-lg">Manage Users</p>
            <p className="text-purple-200 text-sm">View all users</p>
          </div>
        </Link>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline text-sm"
          >
            View All →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No orders yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left px-4 py-3 rounded-l-lg">Order ID</th>
                  <th className="text-left px-4 py-3">Customer</th>
                  <th className="text-left px-4 py-3">Total</th>
                  <th className="text-left px-4 py-3">Paid</th>
                  <th className="text-left px-4 py-3 rounded-r-lg">Delivered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 5).map((order) => (
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
                    <td className="px-4 py-3 font-semibold text-gray-800">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard