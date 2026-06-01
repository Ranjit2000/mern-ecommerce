import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// User Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import OrderSuccess from './pages/OrderSuccess'

// Admin Pages
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* User Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />

        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App