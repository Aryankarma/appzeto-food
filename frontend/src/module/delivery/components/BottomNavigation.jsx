import { useNavigate, useLocation } from "react-router-dom"
import { 
  FileText,
  User,
  Sparkles,
  Wallet,
  Bell
} from "lucide-react"
import { MdFeed, MdShoppingBag } from "react-icons/md"
import { getUnreadDeliveryNotificationCount } from "../utils/deliveryNotifications"

export default function BottomNavigation({ 
  showGig = false, 
  showPocket = false,
  onHomeClick,
  onGigClick,
  requestBadgeCount
}) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get unread notification count if not provided
  const unreadCount = requestBadgeCount !== undefined 
    ? requestBadgeCount 
    : getUnreadDeliveryNotificationCount()

  const isActive = (path) => {
    if (path === "/delivery") {
      return location.pathname === "/delivery"
    }
    return location.pathname.startsWith(path)
  }

  const getActiveClass = (path) => {
    return isActive(path) 
      ? "text-[#ff8100]" 
      : "text-gray-600"
  }

  const handleHomeClick = () => {
    if (location.pathname === "/delivery") {
      // Trigger refresh event for components that listen to it
      window.dispatchEvent(new CustomEvent('deliveryHomeRefresh'))
    } else {
      navigate("/delivery")
    }
    if (onHomeClick) {
      onHomeClick()
    }
  }

  const handleGigClick = () => {
    if (location.pathname === "/delivery/gig") {
      // Trigger refresh event for components that listen to it
      window.dispatchEvent(new CustomEvent('deliveryGigRefresh'))
    } else {
      navigate("/delivery/gig")
    }
    if (onGigClick) {
      onGigClick()
    }
  }

  const handleProfileClick = () => {
    if (location.pathname === "/delivery/profile") {
      // Trigger refresh event for components that listen to it
      window.dispatchEvent(new CustomEvent('deliveryProfileRefresh'))
    } else {
      navigate("/delivery/profile")
    }
  }

  const handleRequestClick = () => {
    if (location.pathname === "/delivery/requests") {
      // Trigger refresh event for components that listen to it
      window.dispatchEvent(new CustomEvent('deliveryRequestRefresh'))
    } else {
      navigate("/delivery/requests")
    }
  }

  const handleUpdatesClick = () => {
    if (location.pathname === "/delivery/updates") {
      // Trigger refresh event for components that listen to it
      window.dispatchEvent(new CustomEvent('deliveryUpdatesRefresh'))
    } else {
      navigate("/delivery/updates")
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {/* Feed */}
        <button 
          onClick={handleHomeClick}
          className={`flex flex-col items-center gap-1 p-2 ${getActiveClass("/delivery")}`}
        >
          <MdFeed className="w-6 h-6" />
          <span className={`text-[10px] font-medium ${getActiveClass("/delivery")}`}>Feed</span>
        </button>

        {/* Request or Pocket */}
          <button 
            onClick={handleRequestClick}
            className={`flex flex-col items-center gap-1 p-2 ${getActiveClass("/delivery/requests")}`}
          >
            <Wallet className="w-6 h-6" />
            <span className={`text-[10px] font-medium ${getActiveClass("/delivery/requests")}`}>Pocket</span>
          </button>

          <button 
            onClick={handleGigClick}
            className={`flex flex-col items-center gap-1 p-2 ${getActiveClass("/delivery/gig")}`}
          >
            <Sparkles className="w-6 h-6" />
            <span className={`text-[10px] font-medium ${getActiveClass("/delivery/gig")}`}>Gig</span>
          </button>

        {/* Orders */}
        <button 
          onClick={() => navigate("/delivery/orders")}
          className={`flex flex-col items-center gap-1 p-2 ${getActiveClass("/delivery/orders")}`}
        >
          <MdShoppingBag className="w-6 h-6" />
          <span className={`text-[10px] font-medium ${getActiveClass("/delivery/orders")}`}>Orders</span>
        </button>

        {/* Updates */}
        <button 
          onClick={handleUpdatesClick}
          className={`flex flex-col items-center gap-1 p-2 relative ${getActiveClass("/delivery/updates")}`}
        >
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className={`text-[10px] font-medium ${getActiveClass("/delivery/updates")}`}>Updates</span>
        </button>
      </div>
    </div>
  )
}

