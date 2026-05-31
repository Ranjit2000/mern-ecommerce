import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  )

  // Add item to cart
  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id)

    let updatedCart
    if (existItem) {
      // If item exists update quantity
      updatedCart = cartItems.map((x) =>
        x._id === product._id ? { ...x, qty } : x
      )
    } else {
      // Add new item
      updatedCart = [...cartItems, { ...product, qty }]
    }

    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  // Remove item from cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((x) => x._id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  // Clear entire cart
  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cartItems')
  }

  // Calculate total price
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty, 0
  )

  // Total number of items
  const cartCount = cartItems.reduce(
    (acc, item) => acc + item.qty, 0
  )

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)