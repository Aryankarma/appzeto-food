import { useNavigate } from "react-router-dom"
import { Search, Menu, ChevronRight, MapPin } from "lucide-react"

export default function RestaurantNavbar({
  restaurantName = "Kadhai Chammach Restaurant",
  location = "By Pass Road (South)",
  status = "Offline", // "Offline" or "Online"
  showSearch = true,
  showOfflineOnlineTag = true,
}) {
  const navigate = useNavigate()

  const handleStatusClick = () => {
    navigate("/restaurant/status")
  }

  const handleSearchClick = () => {
    console.log("Search clicked")
    // Add search functionality here if needed
  }

  const handleMenuClick = () => {
    navigate("/restaurant/explore")
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* Left Side - Restaurant Info */}
      <div className="flex-1 min-w-0 pr-4">
        {/* Restaurant Name */}
        <h1 className="text-base font-bold text-gray-900 truncate">
          {restaurantName}
        </h1>
        
        {/* Location */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
          <p className="text-xs text-gray-600 truncate">
            {location}
          </p>
        </div>
      </div>

      {/* Right Side - Interactive Elements */}
      <div className="flex items-center">
        {/* Offline/Online Status Tag */}
        {showOfflineOnlineTag && (
          <button
            onClick={handleStatusClick}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-300 rounded-full hover:bg-gray-200 transition-colors"
          >
            <span className="text-sm font-normal text-gray-700">
              {status}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        )}

        {/* Search Icon */}
        {showSearch && (
          <button
            onClick={handleSearchClick}
            className="p-2 ml-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Hamburger Menu Icon */}
        <button
          onClick={handleMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
