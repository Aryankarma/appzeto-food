import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Lenis from "lenis"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  Lightbulb,
  HelpCircle,
  Calendar,
  Clock,
  Lock,
  ArrowRight,
  ChevronUp,
  UtensilsCrossed,
  Wallet,
  TrendingUp,
  CheckCircle,
  Bell,
  MapPin,
  ChefHat,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGigStore } from "../store/gigStore"
import { formatTimeDisplay, calculateTotalHours } from "../utils/gigUtils"
import { 
  getDeliveryWalletState, 
  calculatePeriodEarnings 
} from "../utils/deliveryWalletState"
import { formatCurrency } from "../../restaurant/utils/currency"
import { getAllDeliveryOrders } from "../utils/deliveryOrderStatus"
import { getUnreadDeliveryNotificationCount } from "../utils/deliveryNotifications"
import referralBonusBg from "../../../assets/referralbonuscardbg.png"

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom icons
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      ${icon}
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

// Mock restaurants data
const mockRestaurants = [
  {
    id: 1,
    name: "Hotel Pankaj",
    address: "Opposite Midway, Behror Locality, Behror",
    lat: 28.2849,
    lng: 76.1209,
    distance: "3.56 km",
    timeAway: "4 mins",
    orders: 2,
    estimatedEarnings: 111.94,
    pickupDistance: "3.56 km",
    dropDistance: "12.2 km",
    payment: "COD",
    amount: 30.60,
    items: 2,
    phone: "+911234567890"
  },
  {
    id: 2,
    name: "Haldi",
    address: "B 2, Narnor-Alwar Rd, Indus Valley, Behror",
    lat: 28.2780,
    lng: 76.1150,
    distance: "4.2 km",
    timeAway: "4 mins",
    orders: 1,
    estimatedEarnings: 85.50,
    pickupDistance: "4.2 km",
    dropDistance: "8.5 km",
    payment: "COD",
    amount: 45.30,
    items: 3,
    phone: "+911234567891"
  },
  {
    id: 3,
    name: "Pandit Ji Samose Wale",
    address: "Near Govt. Senior Secondary School, Behror Locality, Behror",
    lat: 28.2870,
    lng: 76.1250,
    distance: "5.04 km",
    timeAway: "6 mins",
    orders: 1,
    estimatedEarnings: 65.00,
    pickupDistance: "5.04 km",
    dropDistance: "7.8 km",
    payment: "COD",
    amount: 35.20,
    items: 1,
    phone: "+911234567892"
  }
]

export default function DeliveryHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [walletState, setWalletState] = useState(() => getDeliveryWalletState())
  const [activeOrder, setActiveOrder] = useState(() => {
    const stored = localStorage.getItem('activeOrder')
    return stored ? JSON.parse(stored) : null
  })
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(() => getUnreadDeliveryNotificationCount())
  const [riderLocation, setRiderLocation] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false)
  const [acceptButtonProgress, setAcceptButtonProgress] = useState(0)
  const [isAnimatingToComplete, setIsAnimatingToComplete] = useState(false)
  const bottomSheetRef = useRef(null)
  const handleRef = useRef(null)
  const acceptButtonRef = useRef(null)
  const swipeStartY = useRef(0)
  const isSwiping = useRef(false)
  const acceptButtonSwipeStartX = useRef(0)
  const acceptButtonSwipeStartY = useRef(0)
  const acceptButtonIsSwiping = useRef(false)
  
  const {
    bookedGigs,
    isOnline,
    currentGig,
    goOnline,
    goOffline
  } = useGigStore()

  // Calculate today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayDateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  // Get today's gig (prioritize active, then booked)
  const todayGig = bookedGigs.find(gig => gig.date === todayDateKey && gig.status === 'active') ||
                   bookedGigs.find(gig => gig.date === todayDateKey && gig.status === 'booked')
  
  // Calculate login hours based on when gig started
  const calculateLoginHours = () => {
    if (!todayGig || todayGig.status !== 'active') return 0
    
    const now = new Date()
    let startTime = now
    
    // Use startedAt if available, otherwise use gig start time
    if (todayGig.startedAt) {
      startTime = new Date(todayGig.startedAt)
    } else if (todayGig.startTime) {
      const [hours, minutes] = todayGig.startTime.split(':').map(Number)
      startTime = new Date()
      startTime.setHours(hours, minutes, 0, 0)
      // If start time is in the future, use current time
      if (startTime > now) {
        startTime = now
      }
    }
    
    const diffMs = now - startTime
    const diffHours = diffMs / (1000 * 60 * 60)
    return Math.max(0, diffHours)
  }
  
  const loginHours = calculateLoginHours()
  const minimumHours = 2.67 // 2 hrs 40 mins = 2.67 hours
  const progressPercentage = Math.min((loginHours / minimumHours) * 100, 100)
  
  // Calculate today's earnings
  const todayEarnings = calculatePeriodEarnings(walletState, 'today')
  
  // Calculate today's trips
  const allOrders = getAllDeliveryOrders()
  const todayTrips = allOrders.filter(order => {
    const orderId = order.orderId || order.id
    const orderDateKey = `delivery_order_date_${orderId}`
    const orderDateStr = localStorage.getItem(orderDateKey)
    if (!orderDateStr) return false
    const orderDate = new Date(orderDateStr)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  }).length
  
  // Calculate today's gigs count
  const todayGigsCount = bookedGigs.filter(gig => gig.date === todayDateKey).length
  
  // Calculate total hours worked today
  const todayHoursWorked = bookedGigs
    .filter(gig => gig.date === todayDateKey)
    .reduce((total, gig) => total + (gig.totalHours || 0), 0)
  
  const formatHours = (hours) => {
    const h = Math.floor(hours)
    const m = Math.floor((hours - h) * 60)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }

  // Listen for wallet state updates
  useEffect(() => {
    const handleWalletUpdate = () => {
      setWalletState(getDeliveryWalletState())
    }

    handleWalletUpdate()
    window.addEventListener('deliveryWalletStateUpdated', handleWalletUpdate)
    window.addEventListener('storage', handleWalletUpdate)

    return () => {
      window.removeEventListener('deliveryWalletStateUpdated', handleWalletUpdate)
      window.removeEventListener('storage', handleWalletUpdate)
    }
  }, [location.pathname])

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [location.pathname, animationKey])

  // Get rider location when online
  useEffect(() => {
    if (isOnline && bookedGigs.length > 0) {
      // Set default location immediately so map can render
      setRiderLocation(prev => prev || [28.2849, 76.1209])
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setRiderLocation([position.coords.latitude, position.coords.longitude])
          },
          () => {
            // Keep default location if geolocation fails
            setRiderLocation(prev => prev || [28.2849, 76.1209])
          }
        )
        
        // Watch position updates
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            setRiderLocation([position.coords.latitude, position.coords.longitude])
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 10000 }
        )
        
        return () => navigator.geolocation.clearWatch(watchId)
      } else {
        // Default location if geolocation not available
        setRiderLocation(prev => prev || [28.2849, 76.1209])
      }
    }
  }, [isOnline, bookedGigs.length])

  // Handle accept orders button swipe
  const handleAcceptOrdersTouchStart = (e) => {
    acceptButtonSwipeStartX.current = e.touches[0].clientX
    acceptButtonSwipeStartY.current = e.touches[0].clientY
    acceptButtonIsSwiping.current = false
    setIsAnimatingToComplete(false)
    setAcceptButtonProgress(0)
  }

  const handleAcceptOrdersTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - acceptButtonSwipeStartX.current
    const deltaY = e.touches[0].clientY - acceptButtonSwipeStartY.current
    
    // Only handle horizontal swipes (swipe right)
    if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
      acceptButtonIsSwiping.current = true
      e.preventDefault()
      
      // Calculate max swipe distance
      const buttonWidth = acceptButtonRef.current?.offsetWidth || 300
      const circleWidth = 56 // w-14 = 56px
      const padding = 16 // px-4 = 16px
      const maxSwipe = buttonWidth - circleWidth - (padding * 2)
      
      const progress = Math.min(Math.max(deltaX / maxSwipe, 0), 1)
      setAcceptButtonProgress(progress)
    }
  }

  const handleAcceptOrdersTouchEnd = (e) => {
    if (!acceptButtonIsSwiping.current) {
      setAcceptButtonProgress(0)
      return
    }

    const deltaX = e.changedTouches[0].clientX - acceptButtonSwipeStartX.current
    const buttonWidth = acceptButtonRef.current?.offsetWidth || 300
    const circleWidth = 56
    const padding = 16
    const maxSwipe = buttonWidth - circleWidth - (padding * 2)
    const threshold = maxSwipe * 0.7 // 70% of max swipe
    
    if (deltaX > threshold) {
      // Animate to completion
      setIsAnimatingToComplete(true)
      setAcceptButtonProgress(1)
      
      // Navigate to pickup directions page after animation
      setTimeout(() => {
        navigate("/delivery/pickup-directions", {
          state: { restaurants: mockRestaurants },
          replace: false
        })
        
        // Reset after navigation
        setTimeout(() => {
          setAcceptButtonProgress(0)
          setIsAnimatingToComplete(false)
        }, 500)
      }, 200)
    } else {
      // Reset smoothly
      setAcceptButtonProgress(0)
    }
    
    acceptButtonSwipeStartX.current = 0
    acceptButtonSwipeStartY.current = 0
    acceptButtonIsSwiping.current = false
  }

  // Handle bottom sheet swipe
  const handleBottomSheetTouchStart = (e) => {
    const target = e.target
    const isHandle = handleRef.current?.contains(target)
    
    // Check if touch is in handle area or top 15% of bottom sheet
    const rect = bottomSheetRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const touchY = e.touches[0].clientY
    const handleArea = rect.top + 60 // Top 60px is handle area
    
    // Allow swipe if touching handle or top area
    if (isHandle || touchY <= handleArea) {
      e.stopPropagation()
      swipeStartY.current = touchY
      isSwiping.current = true
    }
  }

  const handleBottomSheetTouchMove = (e) => {
    if (!isSwiping.current) return
    
    const deltaY = swipeStartY.current - e.touches[0].clientY
    
    if (Math.abs(deltaY) > 5) {
      e.stopPropagation()
      
      // Swipe up to expand
      if (deltaY > 0 && !bottomSheetExpanded && bottomSheetRef.current) {
        e.preventDefault()
        bottomSheetRef.current.style.transform = `translateY(${-deltaY}px)`
      }
      // Swipe down to collapse
      else if (deltaY < 0 && bottomSheetExpanded && bottomSheetRef.current) {
        e.preventDefault()
        bottomSheetRef.current.style.transform = `translateY(${-deltaY}px)`
      }
    }
  }

  const handleBottomSheetTouchEnd = (e) => {
    if (!isSwiping.current) {
      isSwiping.current = false
      return
    }
    
    e.stopPropagation()
    
    const deltaY = swipeStartY.current - e.changedTouches[0].clientY
    const threshold = 50
    
    if (bottomSheetRef.current) {
      if (deltaY > threshold && !bottomSheetExpanded) {
        setBottomSheetExpanded(true)
      } else if (deltaY < -threshold && bottomSheetExpanded) {
        setBottomSheetExpanded(false)
      }
      // Reset transform
      bottomSheetRef.current.style.transform = ''
    }
    
    isSwiping.current = false
    swipeStartY.current = 0
  }

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      setAnimationKey(prev => prev + 1)
    }

    const handleActiveOrderUpdate = () => {
      const stored = localStorage.getItem('activeOrder')
      setActiveOrder(stored ? JSON.parse(stored) : null)
    }

    const handleNotificationUpdate = () => {
      setUnreadNotificationCount(getUnreadDeliveryNotificationCount())
    }

    window.addEventListener('deliveryHomeRefresh', handleRefresh)
    window.addEventListener('gigStateUpdated', handleRefresh)
    window.addEventListener('deliveryOrderStatusUpdated', handleRefresh)
    window.addEventListener('activeOrderUpdated', handleActiveOrderUpdate)
    window.addEventListener('storage', handleActiveOrderUpdate)
    window.addEventListener('deliveryNotificationsUpdated', handleNotificationUpdate)

    return () => {
      window.removeEventListener('deliveryHomeRefresh', handleRefresh)
      window.removeEventListener('gigStateUpdated', handleRefresh)
      window.removeEventListener('deliveryOrderStatusUpdated', handleRefresh)
      window.removeEventListener('activeOrderUpdated', handleActiveOrderUpdate)
      window.removeEventListener('storage', handleActiveOrderUpdate)
      window.removeEventListener('deliveryNotificationsUpdated', handleNotificationUpdate)
    }
  }, [])

  // Handle online toggle
  const handleToggleOnline = () => {
    if (isOnline) {
      goOffline()
    } else {
      if (bookedGigs.length === 0) {
        navigate("/delivery/gig")
      } else {
        goOnline()
      }
    }
  }

  // Get next available slot for booking
  const getNextAvailableSlot = () => {
    if (!todayGig) return null
    
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`
    
    // Find next slot after current gig ends
    if (todayGig.endTime && todayGig.endTime > currentTime) {
      const [hours, minutes] = todayGig.endTime.split(':').map(Number)
      const nextStartHour = hours
      const nextEndHour = hours + 1
      return {
        start: `${String(nextStartHour).padStart(2, '0')}:00`,
        end: `${String(nextEndHour).padStart(2, '0')}:00`
      }
    }
    return null
  }

  const nextSlot = getNextAvailableSlot()

  // Render map view when online and has booked gig
  // Show map even if riderLocation is not set yet (will show loading state)
  if (isOnline && bookedGigs.length > 0) {
    return (
      <div className="min-h-screen bg-gray-900 overflow-hidden relative">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#ff8100] rounded-lg p-1.5">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#ff8100] font-bold text-lg">Appzeto Food</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                goOffline()
                setSelectedRestaurant(null)
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200"
            >
              <div className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-sm">Go Offline</span>
            </button>
            <button 
              onClick={() => navigate("/delivery/notifications")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Map */}
        <div className="relative w-full" style={{ height: 'calc(100vh - 60px)' }}>
          {!riderLocation ? (
            <div className="flex items-center justify-center h-full bg-gray-200">
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#ff8100] border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapContainer
              key={`map-${riderLocation[0]}-${riderLocation[1]}`}
              center={riderLocation}
              zoom={13}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              zoomControl={true}
              scrollWheelZoom={true}
              whenCreated={(mapInstance) => {
                setTimeout(() => {
                  mapInstance.invalidateSize()
                }, 100)
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={riderLocation} />
              
              {/* Rider location marker */}
              <Marker
                position={riderLocation}
                icon={createCustomIcon('#10b981', '<div style="width: 20px; height: 20px; background: white; border-radius: 50%;"></div>')}
              >
                <Popup>Your Location</Popup>
              </Marker>

              {/* Restaurant markers */}
              {mockRestaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  position={[restaurant.lat, restaurant.lng]}
                  icon={createCustomIcon(
                    '#ff8100', 
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
                  )}
                  eventHandlers={{
                    click: () => {
                      setSelectedRestaurant(restaurant)
                      if (!bottomSheetExpanded) {
                        setBottomSheetExpanded(true)
                      }
                    }
                  }}
                >
                  <Popup>{restaurant.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Bottom Sheet with Restaurants */}
          <motion.div
            ref={bottomSheetRef}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-40 touch-none shadow-2xl"
            initial={false}
            animate={{
              height: bottomSheetExpanded ? '70vh' : '40vh',
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onTouchStart={handleBottomSheetTouchStart}
            onTouchMove={handleBottomSheetTouchMove}
            onTouchEnd={handleBottomSheetTouchEnd}
          >
            {/* Handle - Always visible at top */}
            <div 
              ref={handleRef}
              className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing touch-pan-y relative z-50 bg-gray-900 rounded-t-3xl"
              onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
              onTouchStart={handleBottomSheetTouchStart}
            >
              <div className="w-16 h-2 bg-white/50 rounded-full shadow-lg flex items-center justify-center border border-white/20">
                <div className="w-12 h-1 bg-white rounded-full" />
              </div>
            </div>

            {bottomSheetExpanded && selectedRestaurant ? (
              /* Expanded view with restaurant details */
              <div className="px-4 pb-4 overflow-y-auto h-full scrollable-content">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold">Restaurant Details</h3>
                  <button
                    onClick={() => {
                      setSelectedRestaurant(null)
                      setBottomSheetExpanded(false)
                    }}
                    className="p-2 hover:bg-gray-800 rounded-full"
                  >
                    <ChevronUp className="w-5 h-5 text-white rotate-180" />
                  </button>
                </div>

                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#ff8100] rounded-lg p-2">
                      <ChefHat className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg">{selectedRestaurant.name}</h4>
                      <p className="text-white/70 text-sm">{selectedRestaurant.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedRestaurant.timeAway} away</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedRestaurant.distance}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/70">Estimated Earnings</span>
                      <span className="text-white font-bold text-lg">₹{selectedRestaurant.estimatedEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/60">
                      <span>Pickup: {selectedRestaurant.pickupDistance}</span>
                      <span>Drop: {selectedRestaurant.dropDistance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Collapsed view with horizontal scrollable restaurants */
              <div className="px-4 pb-4 touch-pan-x">
                {/* Estimated Earnings Summary */}
                <div className="mb-3">
                  <p className="text-white text-sm mb-1">Estimated earnings</p>
                  <p className="text-white text-2xl font-bold mb-1">
                    ₹{mockRestaurants.reduce((sum, r) => sum + r.estimatedEarnings, 0).toFixed(2)}
                  </p>
                  <p className="text-white/70 text-xs">
                    {mockRestaurants.length} pickup{mockRestaurants.length > 1 ? 's' : ''}
                  </p>
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-700 mb-3" />

                {/* Restaurant cards */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
                  {mockRestaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      className="relative shrink-0 w-[280px] bg-gray-800 rounded-lg p-4 cursor-pointer"
                      onClick={() => {
                        setSelectedRestaurant(restaurant)
                        setBottomSheetExpanded(true)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute top-3 left-3 bg-gray-700 rounded px-2 py-0.5">
                        <span className="text-white text-xs font-medium">Pick up</span>
                      </div>
                      
                      <div className="mt-8 mb-3">
                        <h4 className="text-white font-bold text-base mb-1">{restaurant.name}</h4>
                        <p className="text-white/70 text-xs">{restaurant.address}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{restaurant.timeAway} away</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Accept Orders Button - Sticky at bottom, above navigation */}
          <div className="fixed bottom-20 left-0 right-0 z-50 px-4 pb-4 bg-gray-900/95 backdrop-blur-sm md:bottom-4">
            <motion.div
              ref={acceptButtonRef}
              className="relative w-full bg-green-600 rounded-full overflow-hidden shadow-xl"
              onTouchStart={handleAcceptOrdersTouchStart}
              onTouchMove={handleAcceptOrdersTouchMove}
              onTouchEnd={handleAcceptOrdersTouchEnd}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Swipe progress background */}
              <motion.div
                className="absolute inset-0 bg-green-500 rounded-full"
                animate={{
                  width: `${acceptButtonProgress * 100}%`
                }}
                transition={isAnimatingToComplete ? {
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                } : { duration: 0 }}
              />
              
              {/* Button content container */}
              <div className="relative flex items-center h-[64px] px-1">
                {/* Left: Black circle with arrow */}
                <motion.div
                  className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center shrink-0 relative z-20 shadow-2xl"
                  animate={{
                    x: acceptButtonProgress * (acceptButtonRef.current ? (acceptButtonRef.current.offsetWidth - 56 - 32) : 240)
                  }}
                  transition={isAnimatingToComplete ? {
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  } : { duration: 0 }}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </motion.div>
                
                {/* Text - centered and stays visible */}
                <div className="absolute inset-0 flex items-center justify-center left-16 right-4 pointer-events-none">
                  <motion.span 
                    className="text-white font-semibold flex items-center justify-center text-center text-base select-none"
                    animate={{
                      opacity: acceptButtonProgress > 0.5 ? Math.max(0.2, 1 - acceptButtonProgress * 0.8) : 1,
                      x: acceptButtonProgress > 0.5 ? acceptButtonProgress * 15 : 0
                    }}
                    transition={isAnimatingToComplete ? {
                      type: "spring",
                      stiffness: 200,
                      damping: 25
                    } : { duration: 0 }}
                  >
                    {acceptButtonProgress > 0.5 ? 'Release to Accept' : 'Accept orders'}
                  </motion.span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Render normal feed view when offline or no gig booked
  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden pb-24">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 rounded-b-3xl md:rounded-b-none">
        {/* Online Toggle */}
        <button
          onClick={handleToggleOnline}
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
          <button 
            onClick={() => navigate("/delivery/offers")}
            className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center hover:bg-orange-600 transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => navigate("/delivery/profile/settings")}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={() => navigate("/delivery/profile")}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-200"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Referral Bonus Banner */}
      <div className="px-4 pt-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-xl p-4 shadow-lg relative overflow-hidden min-h-[120px]"
          style={{
            backgroundImage: `url(${referralBonusBg})`,
            backgroundSize: '100% 100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }}
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex-1">
              <div className="text-white text-2xl font-bold mb-1">₹2,000</div>
              <div className="text-white/90 text-sm font-medium">Referral bonus</div>
              <div className="text-white/80 text-xs mt-1">Refer your friends now</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="px-4 space-y-4 pb-4">
        {/* Gig Details Card - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#ff8100] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">g</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Gig details</h3>
              </div>

              {todayGig ? (
                <>
                  {/* Gig Time and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-gray-900 font-semibold text-base">
                      {formatTimeDisplay(todayGig.startTime)} - {formatTimeDisplay(todayGig.endTime)}
                    </div>
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      todayGig.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {todayGig.status === 'active' ? 'IN PROGRESS' : 'BOOKED'}
                    </span>
                  </div>

                  {/* Login Hours */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-sm">Login Hours</span>
                    <span className="text-gray-900 font-semibold text-base">{formatHours(loginHours)} hrs</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="h-full bg-green-500 rounded-full"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Lock className="w-3.5 h-3.5 text-red-500" />
                      </div>
                    </div>
                    <div className="text-gray-600 text-xs mt-2">
                      Complete minimum {formatHours(minimumHours)}
                    </div>
                  </div>

                  {/* Booking Option */}
                  {nextSlot && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 bg-gray-50 -mx-4 px-4 py-3 rounded-b-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700 text-sm">
                          Booking open for {formatTimeDisplay(nextSlot.start)} - {formatTimeDisplay(nextSlot.end)} Gig
                        </span>
                      </div>
                      <Button
                        onClick={() => navigate("/delivery/gig")}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg h-auto shadow-md"
                      >
                        Book now
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm mb-3">No gig booked for today</p>
                  <Button
                    onClick={() => navigate("/delivery/gig")}
                    className="bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Book a Gig
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Progress Card - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="bg-[#ff8100] rounded-lg p-2">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <CheckCircle className="w-3 h-3 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" fill="currentColor" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Today's progress</h3>
              </div>

              {/* Earnings and Trips */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <button 
                  onClick={() => navigate("/delivery/account")}
                  className="flex flex-col items-start gap-1 hover:opacity-80 transition-opacity"
                >
                  <span className="text-gray-900 text-2xl font-bold">
                    {formatCurrency(todayEarnings)}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <span>Earnings</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
                <button 
                  onClick={() => navigate("/delivery/orders")}
                  className="flex flex-col items-end gap-1 hover:opacity-80 transition-opacity"
                >
                  <span className="text-gray-900 text-2xl font-bold">
                    {todayTrips}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <span>Trips</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>

              {/* Hours and Gigs */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 font-semibold text-base">
                    {formatHours(todayHoursWorked)} hrs
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 font-semibold text-base">
                    {todayGigsCount} Gigs
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Persistent Notification Banner */}
      {isOnline && activeOrder && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="fixed bottom-16 left-0 right-0 z-50 px-4"
        >
          <button
            onClick={() => navigate(`/delivery/order/${activeOrder.orderId}`)}
            className="w-full bg-blue-600 rounded-lg shadow-xl p-4 flex items-center gap-3 hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-white" />
              <UtensilsCrossed className="w-5 h-5 text-white -ml-3 opacity-50" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-semibold text-sm">Reach restaurant to collect order</div>
              <div className="text-white/90 text-xs">{activeOrder.restaurant || 'Restaurant'}</div>
            </div>
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      )}
    </div>
  )
}
