import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const { darkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-200 dark:hover:text-gray-300">
          🛒 ShopMERN
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="hover:text-blue-200 dark:hover:text-gray-300 transition font-medium">
            Products
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative hover:text-blue-200 dark:hover:text-gray-300 transition font-medium">
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="hover:text-blue-200 dark:hover:text-gray-300 transition font-medium">
                My Orders
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-lg font-semibold hover:bg-yellow-300 transition"
                >
                  Admin
                </Link>
              )}

              <div className="flex items-center gap-3">
                <span className="text-blue-200 dark:text-gray-300 text-sm">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-gray-600 transition text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 dark:hover:text-gray-300 transition font-medium">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white px-4 py-1 rounded-lg font-semibold hover:bg-blue-100 dark:hover:bg-gray-600 transition"
              >
                Register
              </Link>
            </>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-xl hover:scale-110 transition"
            title="Toggle Dark Mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleDarkMode} className="text-xl">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <Link to="/cart" className="relative">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold">
              Login
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar