import { useNavigate, useLocation } from "react-router-dom"

// Heroicons Outline
import {
  HomeIcon as HomeOutline,
  WalletIcon as WalletOutline,
  SparklesIcon as SparklesOutline,
  ShoppingBagIcon as BagOutline,
  BellIcon as BellOutline,
  UserIcon as UserOutline
} from "@heroicons/react/24/outline"

// Heroicons Solid
import {
  HomeIcon as HomeSolid,
  WalletIcon as WalletSolid,
  SparklesIcon as SparklesSolid,
  ShoppingBagIcon as BagSolid,
  BellIcon as BellSolid,
  UserIcon as UserSolid
} from "@heroicons/react/24/solid"

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

  const unreadCount = requestBadgeCount !== undefined 
    ? requestBadgeCount 
    : getUnreadDeliveryNotificationCount()

  const isActive = (path) => {
    if (path === "/delivery") return location.pathname === "/delivery"
    return location.pathname.startsWith(path)
  }

  const iconClass = "w-6 h-6"

  const TabIcon = (active, Outline, Solid) => {
    const Icon = active ? Solid : Outline
    return <Icon className={iconClass} />
  }

  const TabLabel = (active, label) => (
    <span className={`text-[10px] font-medium ${active ? "text-black" : "text-gray-500"}`}>
      {label}
    </span>
  )

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-4">

        {/* Feed */}
        <button
          onClick={() => navigate("/delivery")}
          className="flex flex-col items-center gap-1 p-2"
        >
          {TabIcon(isActive("/delivery"), HomeOutline, HomeSolid)}
          {TabLabel(isActive("/delivery"), "Feed")}
        </button>

        {/* Pocket */}
        <button
          onClick={() => navigate("/delivery/requests")}
          className="flex flex-col items-center gap-1 p-2"
        >
          {TabIcon(isActive("/delivery/requests"), WalletOutline, WalletSolid)}
          {TabLabel(isActive("/delivery/requests"), "Pocket")}
        </button>

        {/* Gig */}
        <button
          onClick={() => navigate("/delivery/gig")}
          className="flex flex-col items-center gap-1 p-2"
        >
          {TabIcon(isActive("/delivery/gig"), SparklesOutline, SparklesSolid)}
          {TabLabel(isActive("/delivery/gig"), "Gig")}
        </button>

        {/* Orders */}
        <button
          onClick={() => navigate("/delivery/orders")}
          className="flex flex-col items-center gap-1 p-2"
        >
          {TabIcon(isActive("/delivery/orders"), BagOutline, BagSolid)}
          {TabLabel(isActive("/delivery/orders"), "Orders")}
        </button>

        {/* Updates */}
        <button
          onClick={() => navigate("/delivery/updates")}
          className="flex flex-col items-center gap-1 p-2 relative"
        >
          {TabIcon(isActive("/delivery/updates"), BellOutline, BellSolid)}
          
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

          {TabLabel(isActive("/delivery/updates"), "Updates")}
        </button>
      </div>
    </div>
  )
}
