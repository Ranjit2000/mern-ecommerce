import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getAnalytics = async (req, res) => {
  try {

    // Basic Counts
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    // Order Stats
    const orders = await Order.find()
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0)
    const paidOrders = orders.filter((o) => o.isPaid).length
    const unpaidOrders = orders.filter((o) => !o.isPaid).length
    const deliveredOrders = orders.filter((o) => o.isDelivered).length
    const pendingOrders = orders.filter((o) => !o.isDelivered).length

    // Monthly Revenue (last 6 months)
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const month = date.toLocaleString('default', { month: 'short' })
      const year = date.getFullYear()

      const monthOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt)
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === year
        )
      })

      const revenue = monthOrders.reduce(
        (acc, o) => acc + o.totalPrice, 0
      )

      monthlyRevenue.push({ month, revenue, orders: monthOrders.length })
    }

    // Top Categories
    const products = await Product.find()
    const categoryCount = {}
    products.forEach((p) => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1
    })
    const topCategories = Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Low Stock Products
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } })
      .select('name stock category')
      .sort({ stock: 1 })
      .limit(5)

    // Recent Orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      counts: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      orderStats: {
        paidOrders,
        unpaidOrders,
        deliveredOrders,
        pendingOrders,
      },
      monthlyRevenue,
      topCategories,
      lowStockProducts,
      recentOrders,
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}