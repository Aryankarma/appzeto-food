import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { HelpCircle } from "lucide-react"

export default function FeedNavbar({
  isOnline,
  onToggleOnline,
  onEmergencyClick,
  onHelpClick,
  onProfileClick,
  className = ""
}) {
  const navigate = useNavigate()

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick()
    } else {
      navigate("/delivery/profile")
    }
  }

  return (
    <div className={`bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200 ${className}`}>
      {/* Online/Offline Toggle Switch */}
      <div className="relative" style={{ zIndex: 100 }}>
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (onToggleOnline) {
              onToggleOnline()
            }
          }}
          onTouchStart={(e) => {
            e.stopPropagation()
          }}
          className="focus:outline-none relative cursor-pointer"
          type="button"
          style={{
            pointerEvents: 'auto',
            zIndex: 100,
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <div className={`relative w-20 h-8 rounded-full transition-colors duration-300 ${isOnline ? "bg-green-500" : "bg-gray-400"
            }`}>
            {/* Label inside switch - positioned based on state, visible when handle is not covering */}
            <span
              className={`text-[11px] font-bold text-white absolute top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${isOnline ? "left-2" : "right-2"
                }`}
              style={{
                opacity: 1,
                zIndex: 2,
                pointerEvents: 'none'
              }}
            >
              {isOnline ? "Online" : "Offline"}
            </span>

            {/* Toggle handle */}
            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              animate={{
                x: isOnline ? 48 : 2
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              style={{
                pointerEvents: 'none',
                zIndex: 10
              }}
            />
          </div>
        </button>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Emergency Icon */}
        <button
          onClick={onEmergencyClick}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-600 transition-colors relative"
        >
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </button>

        {/* Help/Question Mark Icon */}
        <button
          onClick={onHelpClick}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-gray-700" />
        </button>

        {/* Profile Picture */}
        <button
          onClick={handleProfileClick}
          className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-300"
        >
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://ui-avatars.com/api/?name=User&background=ff8100&color=fff&size=40"
            }}
          />
        </button>
      </div>
    </div>
  )
}

