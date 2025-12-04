import { Link } from "react-router-dom"
import { X, ChevronRight } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useState } from "react"

export default function StickyCartCard() {
  const { cart, getCartCount } = useCart()
  const [isVisible, setIsVisible] = useState(true)
  const cartCount = getCartCount()

  // Don't show if cart is empty or card is dismissed
  if (cartCount === 0 || !isVisible) return null

  // Get restaurant info from first cart item or use default
  const restaurantName = cart[0]?.restaurant || "Restaurant"
  const restaurantImage = cart[0]?.image || "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop"
  
  // Create restaurant slug from restaurant name
  const restaurantSlug = restaurantName.toLowerCase().replace(/\s+/g, "-")

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity * 83), 0)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 p-3">
            {/* Restaurant Image */}
            <div className="flex-shrink-0">
              <img 
                src={restaurantImage} 
                alt={restaurantName}
                className="w-14 h-14 rounded-lg object-cover"
              />
            </div>

            {/* Restaurant Info */}
            <Link to={`/user/restaurants/${restaurantSlug}`} className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base mb-0.5 line-clamp-1">
                {restaurantName}
              </h3>
              <div className="flex items-center gap-1 text-gray-600 text-sm">
                <span>View Menu</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </Link>

            {/* View Cart Button */}
            <Link 
              to="/user/cart"
              className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors"
            >
              <div className="text-left">
                <div className="text-xs opacity-90">View Cart</div>
                <div className="text-xs font-bold">{cartCount} {cartCount === 1 ? 'item' : 'items'}</div>
              </div>
            </Link>

            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

