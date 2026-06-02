import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAnalytics } from '../../api/endpoints'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await getAnalytics()
        setAnalytics(data)
      } catch (err) {
        setError('Failed to load analytics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-800">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const {
    counts,
    orderStats,
    monthlyRevenue,
    topCategories,
    lowStockProducts,
    recentOrders,
  } = analytics

  // Get max revenue for bar chart scaling
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue), 1)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}
          </p>
        </div>
        <div className="text-sm text-gray-400 dark:text-gray-500">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            ₹{counts.totalRevenue.toLocaleString()}
          </p>
          <p className="text-blue-500 text-sm mt-2">💰 All time sales</p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            Total Orders
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {counts.totalOrders}
          </p>
          <p className="text-green-500 text-sm mt-2">📦 All orders</p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            Total Users
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {counts.totalUsers}
          </p>
          <p className="text-purple-500 text-sm mt-2">👥 Registered users</p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            Total Products
          </p>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">
            {counts.totalProducts}
          </p>
          <p className="text-orange-500 text-sm mt-2">🛍️ Listed products</p>
        </div>

      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {orderStats.paidOrders}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Paid Orders
          </p>
        </div>

        <div className="bg-red-50 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">
            {orderStats.unpaidOrders}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Unpaid Orders
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {orderStats.deliveredOrders}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Delivered
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-gray-700 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {orderStats.pendingOrders}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Pending
          </p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Monthly Revenue Chart */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            📈 Monthly Revenue (Last 6 Months)
          </h2>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map((item, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                {/* Revenue label */}
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.revenue > 0
                    ? `₹${(item.revenue / 1000).toFixed(0)}k`
                    : '₹0'
                  }
                </span>
                {/* Bar */}
                <div
                  className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-lg transition-all duration-500 hover:bg-blue-600 cursor-pointer"
                  style={{
                    height: `${Math.max(
                      (item.revenue / maxRevenue) * 120, 4
                    )}px`
                  }}
                  title={`${item.month}: ₹${item.revenue.toLocaleString()}`}
                />
                {/* Month label */}
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            🏷️ Products by Category
          </h2>
          <div className="space-y-3">
            {topCategories.map((cat, index) => {
              const maxCount = Math.max(...topCategories.map((c) => c.count))
              const percentage = (cat.count / maxCount) * 100
              const colors = [
                'bg-blue-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-orange-500',
                'bg-red-500',
                'bg-yellow-500',
                'bg-pink-500',
              ]
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {cat.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {cat.count} products
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            ⚠️ Low Stock Alert
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              All products are well stocked!
            </p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center p-3 bg-red-50 dark:bg-gray-600 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {product.category}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    product.stock === 0
                      ? 'bg-red-200 text-red-700'
                      : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/admin/products"
            className="block text-center text-blue-600 hover:underline text-sm mt-4"
          >
            Manage Products →
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">
              🧾 Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-blue-600 hover:underline text-sm"
            >
              View All →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-600 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {order.user?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 text-sm">
                      ₹{order.totalPrice.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.isDelivered
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

    </div>
  )
}

export default Dashboard