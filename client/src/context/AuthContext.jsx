import { createContext, useContext, useState } from 'react'

// Create context
const AuthContext = createContext()

// Provider component
export const AuthProvider = ({ children }) => {

  // Check if user already logged in from localStorage
  const [user, setUser] = useState(
    localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user'))
      : null
  )

  // Login - save user to state and localStorage
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Logout - remove user from state and localStorage
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for easy access in any component
export const useAuth = () => useContext(AuthContext)