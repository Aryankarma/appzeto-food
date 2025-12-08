import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell,
  Sun,
  HelpCircle,
  User,
  Plus,
  Trophy,
  X,
  ChevronRight,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock stories data
const stories = [
  {
    id: "your-story",
    title: "Your story",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isAdd: true,
    content: [
      { type: "image", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop" }
    ]
  },
  {
    id: "zomato",
    title: "Zomato",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&h=100&fit=crop",
    content: [
      { type: "image", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=1200&fit=crop" },
      { type: "image", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=1200&fit=crop" }
    ]
  },
  {
    id: "milestones",
    title: "Milestones",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    content: [
      { type: "image", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop" }
    ]
  },
  {
    id: "happy-children",
    title: "Happy Children",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=100&h=100&fit=crop&crop=face",
    content: [
      { type: "image", url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1200&fit=crop" }
    ]
  }
]

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "ad",
    title: "Heavy Winter Jacket",
    description: "Get yours today at a discounted rate",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
    date: "Today"
  },
  {
    id: 2,
    type: "ad",
    title: "Early Winter Deal on Heavy Winter",
    description: "Special offers just for you",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=600&fit=crop",
    date: "Today"
  },
  {
    id: 3,
    type: "update",
    title: "New Feature Available",
    description: "Check out the latest updates in the app",
    date: "Today"
  },
  {
    id: 4,
    type: "ad",
    title: "Special Weekend Offer",
    description: "50% off on all orders this weekend",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=600&fit=crop",
    date: "Today"
  },
  {
    id: 5,
    type: "update",
    title: "Order Completed Successfully",
    description: "Your order #12345 has been delivered",
    date: "2 hours ago"
  },
  {
    id: 6,
    type: "ad",
    title: "New Restaurant Added",
    description: "Check out the latest restaurant in your area",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=600&fit=crop",
    date: "Yesterday"
  },
  {
    id: 7,
    type: "update",
    title: "Payment Received",
    description: "₹500 has been credited to your wallet",
    date: "Yesterday"
  },
  {
    id: 8,
    type: "ad",
    title: "Flash Sale Alert",
    description: "Limited time offer - Don't miss out!",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=600&fit=crop",
    date: "2 days ago"
  },
  {
    id: 9,
    type: "update",
    title: "Rating Reminder",
    description: "Rate your recent delivery experience",
    date: "2 days ago"
  }
]

export default function UpdatesPage() {
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(true)
  const [selectedStory, setSelectedStory] = useState(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  const handleStoryClick = (story) => {
    if (story.isAdd) {
      // Handle add story action
      return
    }
    setSelectedStory(story)
    setCurrentStoryIndex(0)
  }

  const handleNextStory = () => {
    if (selectedStory && currentStoryIndex < selectedStory.content.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
    } else {
      // Move to next story or close
      setSelectedStory(null)
    }
  }

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    }
  }

  const getCurrentDate = () => {
    const today = new Date()
    const day = today.getDate()
    const month = today.toLocaleString('en-US', { month: 'long' })
    return `${day} ${month}`
  }

  return (
    <div className="min-h-screen bg-[#f6e9dc]  text-gray-900 overflow-x-hidden pb-24">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        {/* Online Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
            isOnline 
              ? "bg-green-100 border border-green-500 text-green-700" 
              : "bg-gray-100 border border-gray-300 text-gray-600"
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-500"}`} />
          <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
        </button>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Sun className="w-5 h-5 text-orange-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => navigate("/delivery/profile")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=User&background=ff8100&color=fff&size=32"
              }}
            />
          </button>
        </div>
      </div>

      {/* Stories Section */}
      <div className="px-4 py-4 overflow-x-auto scrollbar-hide bg-gray-50">
        <div className="flex gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(story)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                  {story.isAdd ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <img 
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover opacity-50"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <img 
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.title)}&background=ff8100&color=fff&size=64`
                      }}
                    />
                  )}
                </div>
                {story.isAdd && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border-2 border-white shadow-sm">
                    <Plus className="w-4 h-4 text-gray-800" />
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600 text-center max-w-[64px] truncate">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications Banner */}
      <div className="mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <Bell className="w-5 h-5 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Check all your notifications</p>
            <p className="text-xs text-gray-600">Today, {getCurrentDate()}</p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/delivery/notifications")}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 h-auto"
        >
          View
        </Button>
      </div>

      {/* Notifications Section Header */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
          <span>See all</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Cards */}
      <div className="px-4 space-y-4 pb-6">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            {notification.type === "ad" && notification.image ? (
              <div className="flex">
                {/* Text Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {notification.description}
                    </p>
                  </div>
                  <button className="self-start px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Info
                  </button>
                </div>
                {/* Image */}
                <div className="w-32 h-40 shrink-0 relative">
                  <img 
                    src={notification.image}
                    alt={notification.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=600&fit=crop"
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-500">{notification.date}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedStory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="fixed inset-0 bg-black z-50"
            />
            
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                if (x > rect.width / 2) {
                  handleNextStory()
                } else {
                  handlePrevStory()
                }
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Story Image */}
              {selectedStory.content[currentStoryIndex] && (
                <motion.img
                  key={currentStoryIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  src={selectedStory.content[currentStoryIndex].url}
                  alt={selectedStory.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStory.title)}&background=ff8100&color=fff&size=800`
                  }}
                />
              )}

              {/* Story Title Overlay */}
              <div className="absolute bottom-20 left-0 right-0 px-4">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                  <h3 className="text-white font-semibold">{selectedStory.title}</h3>
                </div>
              </div>

              {/* Progress Indicator */}
              {selectedStory.content.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {selectedStory.content.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full ${
                        index === currentStoryIndex ? "bg-white" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

