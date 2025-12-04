// src/context/cart-context.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  // Safe init (works with SSR and bad JSON)
  const [cart, setCart] = useState(() => {
    if (typeof window === "undefined") return []
    try {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart))
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }, [cart])

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== itemId))
      return
    }
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))
    )
  }

  const getCartCount = () =>
    cart.reduce((total, item) => total + (item.quantity || 0), 0)

  const isInCart = (itemId) => cart.some((i) => i.id === itemId)

  const getCartItem = (itemId) => cart.find((i) => i.id === itemId)

  const clearCart = () => setCart([])

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartCount,
      isInCart,
      getCartItem,
      clearCart,
    }),
    [cart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
