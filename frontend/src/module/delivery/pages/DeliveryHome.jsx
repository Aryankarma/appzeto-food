import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import Lenis from "lenis"
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { 
  Wallet,
  Bell,
  Home,
  FileText,
  UtensilsCrossed,
  User,
  Bike,
  Building2,
  MapPin,
  ArrowRight,
  Sparkles,
  Circle,
  Clock,
  Navigation,
  ChefHat,
  X
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getDeliveryWalletState, 
  calculateDeliveryBalances, 
  calculatePeriodEarnings 
} from "../utils/deliveryWalletState"
import { formatCurrency } from "../../restaurant/utils/currency"
import { getAllDeliveryOrders, getDeliveryOrdersCount } from "../utils/deliveryOrderStatus"
import { getUnreadDeliveryNotificationCount } from "../utils/deliveryNotifications"
import { useGigStore, initializeOnlineStatus } from "../store/gigStore"
import { saveDeliveryOrderStatus, DELIVERY_ORDER_STATUS } from "../utils/deliveryOrderStatus"
import { toast } from "sonner"

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
    html: `<div style="background-color: ${color}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
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

// Mock restaurant data with coordinates (Indore, India area)
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
  const [activeOrder, setActiveOrder] = useState(() => {
    const stored = localStorage.getItem('activeOrder')
    return stored ? JSON.parse(stored) : null
  })
  const [walletState, setWalletState] = useState(() => getDeliveryWalletState())
  const [ordersCount, setOrdersCount] = useState(() => getDeliveryOrdersCount())
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(() => getUnreadDeliveryNotificationCount())
  const earningsRef = useRef(null)
  const ordersRef = useRef(null)
  const cashRef = useRef(null)
  const activeOrderRef = useRef(null)
  
  // Map state
  const [riderLocation, setRiderLocation] = useState(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [acceptedRestaurants, setAcceptedRestaurants] = useState([])
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false)
  const [routePolylines, setRoutePolylines] = useState([])
  const [swipeProgress, setSwipeProgress] = useState({})
  const [acceptButtonProgress, setAcceptButtonProgress] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [isAnimatingToComplete, setIsAnimatingToComplete] = useState(false)
  const bottomSheetRef = useRef(null)
  const handleRef = useRef(null)
  const acceptButtonRef = useRef(null)
  const swipeStartX = useRef(0)
  const swipeStartY = useRef(0)
  const swipeDeltaX = useRef(0)
  const swipeDeltaY = useRef(0)
  const isVerticalSwipe = useRef(false)
  const bottomSheetY = useRef(0)
  
  // Gig store state
  const { isOnline, goOffline, goOnline } = useGigStore()
  
  // Initialize online status on mount
  useEffect(() => {
    initializeOnlineStatus()
  }, [])

  // Get rider location
  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRiderLocation([position.coords.latitude, position.coords.longitude])
        },
        () => {
          // Default to Indore, India if geolocation fails
          setRiderLocation([28.2849, 76.1209])
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
    } else if (isOnline) {
      // Default location if geolocation not available
      setRiderLocation([28.2849, 76.1209])
    }
  }, [isOnline])

  // Fetch routes when restaurants are accepted
  useEffect(() => {
    if (acceptedRestaurants.length > 0 && riderLocation) {
      const fetchAllRoutes = async () => {
        const routes = []
        let currentLocation = riderLocation
        
        for (const restaurant of acceptedRestaurants) {
          try {
            const route = await fetchRouteData(currentLocation, [restaurant.lat, restaurant.lng])
            if (route && route.length > 0) {
              routes.push(route)
              // Update current location to restaurant for next route
              currentLocation = [restaurant.lat, restaurant.lng]
            }
          } catch (error) {
            console.error('Error fetching route for restaurant:', restaurant.name, error)
          }
        }
        setRoutePolylines(routes)
      }
      
      fetchAllRoutes()
    } else {
      setRoutePolylines([])
    }
  }, [acceptedRestaurants, riderLocation])

  // Fetch route using OSRM (free routing service)
  const fetchRouteData = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const coordinates = data.routes[0].geometry.coordinates.map((coord) => [coord[1], coord[0]])
        return coordinates
      }
      return [start, end]
    } catch (error) {
      console.error('Error fetching route:', error)
      return [start, end]
    }
  }

  // Handle bottom sheet vertical swipe (expand/collapse)
  const handleBottomSheetTouchStart = (e) => {
    const target = e.target
    const isHandle = handleRef.current?.contains(target)
    const isBottomSheet = bottomSheetRef.current?.contains(target)
    
    // Only handle if touching handle or bottom sheet (but not restaurant cards)
    if (!isHandle && !isBottomSheet) return
    if (target.closest('.restaurant-card')) return
    
    e.stopPropagation()
    swipeStartY.current = e.touches[0].clientY
    swipeStartX.current = e.touches[0].clientX
    isVerticalSwipe.current = false
    setIsSwiping(true)
    bottomSheetY.current = e.touches[0].clientY
  }

  const handleBottomSheetTouchMove = (e) => {
    if (!isSwiping) return
    e.stopPropagation()
    
    const deltaY = e.touches[0].clientY - swipeStartY.current
    const deltaX = e.touches[0].clientX - swipeStartX.current
    
    // Determine swipe direction
    if (!isVerticalSwipe.current && Math.abs(deltaY) > 10) {
      isVerticalSwipe.current = Math.abs(deltaY) > Math.abs(deltaX)
    }
    
    // Only handle vertical swipes on bottom sheet
    if (isVerticalSwipe.current && bottomSheetRef.current) {
      e.preventDefault()
      const currentY = e.touches[0].clientY
      const movement = swipeStartY.current - currentY
      
      // Update bottom sheet height based on swipe
      if (movement > 0 && !bottomSheetExpanded) {
        // Swiping up to expand
        const maxMovement = window.innerHeight * 0.5
        const progress = Math.min(movement / maxMovement, 1)
        bottomSheetRef.current.style.transform = `translateY(${-movement}px)`
      } else if (movement < 0 && bottomSheetExpanded) {
        // Swiping down to collapse
        const maxMovement = window.innerHeight * 0.3
        const progress = Math.max(movement / maxMovement, -1)
        bottomSheetRef.current.style.transform = `translateY(${-movement}px)`
      }
    }
  }

  const handleBottomSheetTouchEnd = (e) => {
    if (!isSwiping) return
    e.stopPropagation()
    
    const deltaY = swipeStartY.current - e.changedTouches[0].clientY
    const threshold = 50
    
    if (isVerticalSwipe.current && bottomSheetRef.current) {
      if (deltaY > threshold && !bottomSheetExpanded) {
        // Expand
        setBottomSheetExpanded(true)
      } else if (deltaY < -threshold && bottomSheetExpanded) {
        // Collapse
        setBottomSheetExpanded(false)
      }
      // Reset transform
      if (bottomSheetRef.current) {
        bottomSheetRef.current.style.transform = ''
      }
    }
    
    setIsSwiping(false)
    isVerticalSwipe.current = false
    swipeStartY.current = 0
    swipeStartX.current = 0
  }

  // Handle restaurant card horizontal swipe (accept)
  const handleCardTouchStart = (e, restaurantId) => {
    e.stopPropagation()
    swipeStartX.current = e.touches[0].clientX
    swipeStartY.current = e.touches[0].clientY
    setSwipeProgress(prev => ({ ...prev, [restaurantId]: 0 }))
  }

  const handleCardTouchMove = (e, restaurantId) => {
    e.stopPropagation()
    const deltaX = e.touches[0].clientX - swipeStartX.current
    const deltaY = e.touches[0].clientY - swipeStartY.current
    
    // Only handle horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
      e.preventDefault()
      const maxSwipe = 120
      const progress = Math.min(deltaX / maxSwipe, 1)
      setSwipeProgress(prev => ({ ...prev, [restaurantId]: progress }))
    }
  }

  const handleCardTouchEnd = (e, restaurantId) => {
    e.stopPropagation()
    const deltaX = e.touches[0].clientX - swipeStartX.current
    const threshold = 80
    
    if (deltaX > threshold) {
      // Accept order
      handleAcceptOrder(restaurantId)
      setSwipeProgress(prev => ({ ...prev, [restaurantId]: 0 }))
    } else {
      // Reset
      setSwipeProgress(prev => ({ ...prev, [restaurantId]: 0 }))
    }
    
    swipeStartX.current = 0
    swipeStartY.current = 0
  }

  const handleAcceptOrder = (restaurantId) => {
    const restaurant = mockRestaurants.find(r => r.id === restaurantId)
    if (!restaurant) return

    // Reset swipe progress
    setSwipeProgress(prev => ({ ...prev, [restaurantId]: 0 }))

    // Add to accepted restaurants if not already accepted
    setAcceptedRestaurants(prev => {
      if (prev.find(r => r.id === restaurantId)) return prev
      return [...prev, restaurant]
    })
    
    // Save active order
    const orderData = {
      orderId: `ORD${Date.now()}`,
      restaurant: restaurant.name,
      restaurantAddress: restaurant.address,
      deliveryAddress: "Destination Address",
      items: restaurant.items,
      amount: restaurant.amount,
      paymentMethod: restaurant.payment,
      paymentStatus: "Pending"
    }
    
    localStorage.setItem('activeOrder', JSON.stringify(orderData))
    window.dispatchEvent(new Event('activeOrderUpdated'))
    
    // Save order status
    saveDeliveryOrderStatus(orderData.orderId, DELIVERY_ORDER_STATUS.ACCEPTED)
    
    toast.success(`Order accepted for ${restaurant.name}!`, {
      duration: 3000,
    })
  }

  // Handle accept all orders button swipe
  const acceptButtonSwipeStartX = useRef(0)
  const acceptButtonSwipeStartY = useRef(0)
  const acceptButtonIsSwiping = useRef(false)

  const handleAcceptAllTouchStart = (e) => {
    acceptButtonSwipeStartX.current = e.touches[0].clientX
    acceptButtonSwipeStartY.current = e.touches[0].clientY
    acceptButtonIsSwiping.current = false
    setIsAnimatingToComplete(false)
    setAcceptButtonProgress(0)
  }

  const handleAcceptAllTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - acceptButtonSwipeStartX.current
    const deltaY = e.touches[0].clientY - acceptButtonSwipeStartY.current
    
    // Only handle horizontal swipes (swipe right)
    if (Math.abs(deltaX) > 5 && Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
      acceptButtonIsSwiping.current = true
      e.preventDefault()
      
      // Calculate max swipe distance (button width minus circle width minus padding)
      const buttonWidth = acceptButtonRef.current?.offsetWidth || 300
      const circleWidth = 56 // w-14 = 56px
      const padding = 16 // px-4 = 16px
      const maxSwipe = buttonWidth - circleWidth - (padding * 2)
      
      const progress = Math.min(Math.max(deltaX / maxSwipe, 0), 1)
      setAcceptButtonProgress(progress)
    }
  }

  const handleAcceptAllTouchEnd = (e) => {
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
      
      // Accept all restaurants after animation
      setTimeout(() => {
        const unacceptedRestaurants = mockRestaurants.filter(
          r => !acceptedRestaurants.find(ar => ar.id === r.id)
        )
        
        if (unacceptedRestaurants.length > 0) {
          // Add all restaurants to accepted list
          const newAcceptedRestaurants = [...acceptedRestaurants, ...unacceptedRestaurants]
          
          // Update state immediately
          setAcceptedRestaurants(newAcceptedRestaurants)
          
          // Save orders for each restaurant
          unacceptedRestaurants.forEach(restaurant => {
            const orderData = {
              orderId: `ORD${Date.now()}-${restaurant.id}`,
              restaurant: restaurant.name,
              restaurantAddress: restaurant.address,
              deliveryAddress: "Destination Address",
              items: restaurant.items,
              amount: restaurant.amount,
              paymentMethod: restaurant.payment,
              paymentStatus: "Pending"
            }
            
            localStorage.setItem('activeOrder', JSON.stringify(orderData))
            saveDeliveryOrderStatus(orderData.orderId, DELIVERY_ORDER_STATUS.ACCEPTED)
          })
          
          window.dispatchEvent(new Event('activeOrderUpdated'))
          
          toast.success(`Accepted ${unacceptedRestaurants.length} order(s)!`, {
            duration: 1500,
          })

          // Navigate to directions page with smooth transition
          setTimeout(() => {
            navigate("/delivery/pickup-directions", {
              state: { restaurants: newAcceptedRestaurants },
              replace: false
            })
          }, 500)
        }
        
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

  // Listen for online status changes
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setAnimationKey(prev => prev + 1)
    }

    window.addEventListener('deliveryOnlineStatusChanged', handleOnlineStatusChange)
    window.addEventListener('storage', handleOnlineStatusChange)

    return () => {
      window.removeEventListener('deliveryOnlineStatusChanged', handleOnlineStatusChange)
      window.removeEventListener('storage', handleOnlineStatusChange)
    }
  }, [])

  // Listen for order acceptance
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('activeOrder')
      setActiveOrder(stored ? JSON.parse(stored) : null)
    }

    handleStorageChange()

    window.addEventListener('activeOrderUpdated', handleStorageChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('activeOrderUpdated', handleStorageChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [location.pathname])

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

  // Listen for order status updates
  useEffect(() => {
    const handleOrderStatusUpdate = () => {
      setOrdersCount(getDeliveryOrdersCount())
    }

    handleOrderStatusUpdate()

    window.addEventListener('deliveryOrderStatusUpdated', handleOrderStatusUpdate)
    window.addEventListener('activeOrderUpdated', handleOrderStatusUpdate)
    window.addEventListener('storage', handleOrderStatusUpdate)

    return () => {
      window.removeEventListener('deliveryOrderStatusUpdated', handleOrderStatusUpdate)
      window.removeEventListener('activeOrderUpdated', handleOrderStatusUpdate)
      window.removeEventListener('storage', handleOrderStatusUpdate)
    }
  }, [location.pathname])

  // Listen for notification updates
  useEffect(() => {
    const handleNotificationUpdate = () => {
      setUnreadNotificationCount(getUnreadDeliveryNotificationCount())
    }

    handleNotificationUpdate()

    window.addEventListener('deliveryNotificationsUpdated', handleNotificationUpdate)
    window.addEventListener('storage', handleNotificationUpdate)

    return () => {
      window.removeEventListener('deliveryNotificationsUpdated', handleNotificationUpdate)
      window.removeEventListener('storage', handleNotificationUpdate)
    }
  }, [location.pathname])

  // Calculate order counts by date
  const calculateDateBasedCounts = () => {
    const allOrders = getAllDeliveryOrders()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    weekStart.setHours(0, 0, 0, 0)

    let todayCount = 0
    let weekCount = 0

    allOrders.forEach(order => {
      const orderId = order.orderId || order.id
      const orderDateKey = `delivery_order_date_${orderId}`
      const orderDateStr = localStorage.getItem(orderDateKey)
      const orderDate = orderDateStr ? new Date(orderDateStr) : new Date()

      if (orderDate >= today) {
        todayCount++
      }
      if (orderDate >= weekStart) {
        weekCount++
      }
    })

    return {
      today: todayCount,
      week: weekCount,
      total: allOrders.length
    }
  }

  const [dateCounts, setDateCounts] = useState(() => calculateDateBasedCounts())
  
  useEffect(() => {
    const updateDateCounts = () => {
      setDateCounts(calculateDateBasedCounts())
    }
    
    updateDateCounts()
    
    window.addEventListener('deliveryOrderStatusUpdated', updateDateCounts)
    window.addEventListener('activeOrderUpdated', updateDateCounts)
    window.addEventListener('storage', updateDateCounts)
    
    return () => {
      window.removeEventListener('deliveryOrderStatusUpdated', updateDateCounts)
      window.removeEventListener('activeOrderUpdated', updateDateCounts)
      window.removeEventListener('storage', updateDateCounts)
    }
  }, [])

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

  // Render map view when online
  if (isOnline && riderLocation) {
    return (
      <div className="min-h-screen bg-gray-900 overflow-hidden relative">
        {/* Header Section */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="bg-[#ff8100] rounded-lg p-1.5">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#ff8100] font-bold text-lg">Appzeto Food</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                goOffline()
                setAcceptedRestaurant(null)
                setRoutePolyline(null)
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
                // Ensure map is properly initialized
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

            {/* Restaurant markers - show all restaurants */}
            {mockRestaurants.map((restaurant) => {
              const isAccepted = acceptedRestaurants.find(r => r.id === restaurant.id)
              return (
                <Marker
                  key={restaurant.id}
                  position={[restaurant.lat, restaurant.lng]}
                  icon={createCustomIcon(
                    isAccepted ? '#10b981' : '#ff8100', 
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
                  <Popup>{restaurant.name} {isAccepted ? '(Accepted)' : ''}</Popup>
                </Marker>
              )
            })}

            {/* Route polylines - show all accepted routes */}
            {routePolylines.map((route, index) => (
              <Polyline
                key={`route-${index}`}
                positions={route}
                pathOptions={{ color: '#10b981', weight: 5, opacity: 0.9 }}
              />
            ))}
            </MapContainer>
          )}

          {/* Bottom Sheet */}
          <motion.div
            ref={bottomSheetRef}
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl z-40 touch-none"
            initial={false}
            animate={{
              height: bottomSheetExpanded ? '70vh' : selectedRestaurant ? '40vh' : '35vh',
            }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onTouchStart={handleBottomSheetTouchStart}
            onTouchMove={handleBottomSheetTouchMove}
            onTouchEnd={handleBottomSheetTouchEnd}
          >
            {/* Handle */}
            <div 
              ref={handleRef}
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onTouchStart={handleBottomSheetTouchStart}
            >
              <motion.div
                className="w-12 h-1 bg-gray-600 rounded-full"
                whileTap={{ scale: 1.2 }}
                onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
              />
            </div>

            {bottomSheetExpanded && selectedRestaurant ? (
              /* Expanded view with restaurant details */
              <div className="px-4 pb-4 overflow-y-auto h-full touch-pan-y">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-lg font-bold">Restaurant Details</h3>
                  <button
                    onClick={() => {
                      setSelectedRestaurant(null)
                      setBottomSheetExpanded(false)
                    }}
                    className="p-2 hover:bg-gray-800 rounded-full"
                  >
                    <X className="w-5 h-5 text-white" />
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

                  <motion.div
                    className="relative w-full mt-4 overflow-hidden rounded-lg"
                    onTouchStart={(e) => handleCardTouchStart(e, selectedRestaurant.id)}
                    onTouchMove={(e) => handleCardTouchMove(e, selectedRestaurant.id)}
                    onTouchEnd={(e) => handleCardTouchEnd(e, selectedRestaurant.id)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-green-500 rounded-lg"
                      style={{
                        scaleX: swipeProgress[selectedRestaurant.id] || 0,
                        transformOrigin: 'left'
                      }}
                    />
                    <motion.button
                      className="relative w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      onClick={() => {
                        if ((swipeProgress[selectedRestaurant.id] || 0) < 0.3) {
                          handleAcceptOrder(selectedRestaurant.id)
                        }
                      }}
                      disabled={(swipeProgress[selectedRestaurant.id] || 0) > 0.3}
                      whileTap={{ scale: (swipeProgress[selectedRestaurant.id] || 0) < 0.3 ? 0.98 : 1 }}
                      animate={{
                        x: (swipeProgress[selectedRestaurant.id] || 0) * 120,
                        backgroundColor: (swipeProgress[selectedRestaurant.id] || 0) > 0.7 ? '#059669' : '#16a34a'
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <motion.div
                        animate={{
                          rotate: (swipeProgress[selectedRestaurant.id] || 0) * 360
                        }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <Navigation className="w-5 h-5" />
                      </motion.div>
                      <span>
                        {(swipeProgress[selectedRestaurant.id] || 0) > 0.7 ? 'Release to Accept ✓' : 'Swipe to Accept →'}
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            ) : (
              /* Collapsed view with horizontal scrollable restaurants */
              <div className="px-4 pb-4" onTouchStart={(e) => {
                if (e.target.closest('.restaurant-card') || e.target.closest('.accept-all-button')) return
                handleBottomSheetTouchStart(e)
              }}>
                {/* Estimated Earnings Summary */}
                <div className="mb-3">
                  <p className="text-white text-sm mb-1">Estimated earnings</p>
                  <p className="text-white text-2xl font-bold mb-1">
                    ₹{mockRestaurants.reduce((sum, r) => sum + r.estimatedEarnings, 0).toFixed(2)}
                  </p>
                  <p className="text-white/70 text-xs">
                    Pickup: {mockRestaurants.reduce((sum, r) => {
                      const pickup = parseFloat(r.pickupDistance.replace(' km', ''))
                      return sum + (isNaN(pickup) ? 0 : pickup)
                    }, 0).toFixed(2)} kms | Drop: {mockRestaurants.reduce((sum, r) => {
                      const drop = parseFloat(r.dropDistance.replace(' km', ''))
                      return sum + (isNaN(drop) ? 0 : drop)
                    }, 0).toFixed(1)} kms
                  </p>
                </div>

                {/* Separator */}
                <div className="h-px bg-gray-700 mb-3" />

                {/* Pickups count tag */}
                <div className="mb-3 flex justify-center">
                  <div className="bg-gray-800 rounded-full px-4 py-1.5 inline-flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">
                      {mockRestaurants.length} pickup{mockRestaurants.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Restaurant cards */}
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 touch-pan-x">
                  {mockRestaurants.map((restaurant) => {
                    const progress = swipeProgress[restaurant.id] || 0
                    const isAccepted = acceptedRestaurants.find(r => r.id === restaurant.id)
                    return (
                    <motion.div
                      key={restaurant.id}
                      data-restaurant-id={restaurant.id}
                      className="restaurant-card shrink-0 w-[280px] bg-gray-800 rounded-lg p-4 cursor-pointer relative overflow-hidden"
                      onClick={() => {
                        if (progress < 0.3 && !isAccepted) {
                          setSelectedRestaurant(restaurant)
                          setBottomSheetExpanded(true)
                        }
                      }}
                      onTouchStart={(e) => !isAccepted && handleCardTouchStart(e, restaurant.id)}
                      onTouchMove={(e) => !isAccepted && handleCardTouchMove(e, restaurant.id)}
                      onTouchEnd={(e) => !isAccepted && handleCardTouchEnd(e, restaurant.id)}
                      animate={{
                        x: progress * 120,
                        scale: progress > 0.5 ? 1.02 : 1,
                        opacity: isAccepted ? 0.6 : 1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Pick up tag */}
                      <div className="absolute top-3 left-3 bg-gray-700 rounded px-2 py-0.5">
                        <span className="text-white text-xs font-medium">Pick up</span>
                      </div>

                      {/* Accepted badge */}
                      {isAccepted && (
                        <div className="absolute top-3 right-3 bg-green-600 rounded-full px-2 py-1">
                          <span className="text-white text-xs font-semibold">✓ Accepted</span>
                        </div>
                      )}

                      {/* Swipe progress indicator */}
                      <motion.div
                        className="absolute inset-0 bg-green-500/20 rounded-lg"
                        style={{
                          scaleX: progress,
                          transformOrigin: 'left'
                        }}
                      />
                      
                      <div className="mt-8 mb-3">
                        <h4 className="text-white font-bold text-base mb-1">{restaurant.name}</h4>
                        <p className="text-white/70 text-xs">{restaurant.address}</p>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{restaurant.timeAway} away</span>
                      </div>
                    </motion.div>
                    )
                  })}
                </div>

                {/* Accept All Orders Button */}
                <div className="mt-4">
                  <motion.div
                    ref={acceptButtonRef}
                    className="accept-all-button relative w-full bg-green-600 rounded-full overflow-hidden shadow-xl"
                    onTouchStart={handleAcceptAllTouchStart}
                    onTouchMove={handleAcceptAllTouchMove}
                    onTouchEnd={handleAcceptAllTouchEnd}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Swipe progress background - lighter green overlay */}
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
                      {/* Left: Black circle with dot and arrow */}
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
                          <ArrowRight className="w-16 h-5 text-white" />
                        </div>
                      </motion.div>
                      
                      {/* Text - centered and stays visible */}
                      <div className="absolute inset-0 flex items-center justify-center left-16 right-4 pointer-events-none">
                        <motion.span 
                          className="text-gray-900 font-semibold flex items-center justify-center text-center text-base select-none"
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
            )}
          </motion.div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center justify-around py-2 px-4">
            <button 
              onClick={() => {
                if (location.pathname === "/delivery") {
                  setAnimationKey(prev => prev + 1)
                } else {
                  navigate("/delivery")
                }
              }}
              className="flex flex-col items-center gap-1 p-2 text-[#ff8100]"
            >
              <Home className="w-6 h-6" />
              <span className="text-[10px] text-[#ff8100] font-medium">Home</span>
            </button>
            <button 
              onClick={() => navigate("/delivery/requests")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600 relative"
            >
              <div className="relative">
                <FileText className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </span>
              </div>
              <span className="text-[10px] text-gray-600 font-medium">Request</span>
            </button>
            <button 
              onClick={() => navigate("/delivery/gig")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-[10px] text-gray-600 font-medium">Gig</span>
            </button>
            <button 
              onClick={() => navigate("/delivery/orders")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600"
            >
              <UtensilsCrossed className="w-6 h-6" />
              <span className="text-[10px] text-gray-600 font-medium">Orders</span>
            </button>
            <button 
              onClick={() => navigate("/delivery/profile")}
              className="flex flex-col items-center gap-1 p-2 text-gray-600"
            >
              <User className="w-6 h-6" />
              <span className="text-[10px] text-gray-600 font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render normal view when offline (existing code)
  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#ff8100] rounded-lg p-1.5 md:p-1.5">
              <Bike className="w-5 h-5 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[#ff8100] font-bold text-xl md:text-lg">Appzeto Food</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (isOnline) {
                goOffline()
              } else {
                navigate("/delivery/gig")
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isOnline
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-600" : "bg-red-600"}`} />
            <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
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

      {/* Main Content - Existing offline view */}
      <div className="px-4 py-6 pb-24 md:pb-6">
        {/* Active Order Section */}
        {activeOrder && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Active Order</h2>
            <motion.div
              ref={activeOrderRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card className="bg-white shadow-md border-0">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-gray-900 font-semibold text-base md:text-lg mb-1">
                        Order # {activeOrder.orderId} ({activeOrder.items} Item{activeOrder.items > 1 ? "s" : ""})
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-red-500 text-white text-xs font-medium px-3 py-1 rounded-full mb-1">
                        {activeOrder.paymentStatus}
                      </span>
                      <p className="text-gray-600 text-xs">{activeOrder.paymentMethod}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-900 font-medium text-sm md:text-base">{activeOrder.restaurant}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600 text-sm md:text-base">{activeOrder.deliveryAddress}</span>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => navigate(`/delivery/order/${activeOrder.orderId}`)}
                      className="text-[#ff8100] underline text-sm md:text-base font-medium"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        const address = encodeURIComponent(activeOrder.deliveryAddress)
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
                      }}
                      className="flex items-center gap-1 text-[#ff8100] text-sm md:text-base font-medium"
                    >
                      Direction
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Earnings Section */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Earnings</h2>
          <motion.div
            ref={earningsRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate("/delivery/account")}
            className="bg-[#1e3a5f] rounded-xl p-4 md:p-6 shadow-lg cursor-pointer hover:bg-[#1e3a5f]/90 transition-colors"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-3">
                <Wallet className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-xs md:text-sm mb-1">Balance</p>
                <p className="text-white text-3xl md:text-4xl font-bold">
                  {formatCurrency(calculateDeliveryBalances(walletState).totalBalance)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <p className="text-white/80 text-xs md:text-sm mb-1">Today</p>
                <p className="text-white text-lg md:text-xl font-bold">
                  {formatCurrency(calculatePeriodEarnings(walletState, 'today'))}
                </p>
              </div>
              <div className="text-center border-l border-r border-white/20">
                <p className="text-white/80 text-xs md:text-sm mb-1">This Week</p>
                <p className="text-white text-lg md:text-xl font-bold">
                  {formatCurrency(calculatePeriodEarnings(walletState, 'week'))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/80 text-xs md:text-sm mb-1">This Month</p>
                <p className="text-white text-lg md:text-xl font-bold">
                  {formatCurrency(calculatePeriodEarnings(walletState, 'month'))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Orders Section */}
        <div className="mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">Orders</h2>
          <motion.div
            ref={ordersRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-3 gap-3 md:gap-4"
          >
            <Card className="bg-white shadow-md border-0 py-0 gap-0">
              <CardContent className="p-4 text-center px-4">
                <p className="text-gray-900 text-2xl md:text-3xl font-bold mb-1">{dateCounts.today}</p>
                <p className="text-gray-600 text-xs md:text-sm">Today</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-0 py-0 gap-0">
              <CardContent className="p-4 text-center px-4">
                <p className="text-gray-900 text-2xl md:text-3xl font-bold mb-1">{dateCounts.week}</p>
                <p className="text-gray-600 text-xs md:text-sm">This Week</p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-md border-0 py-0 gap-0">
              <CardContent className="p-4 text-center px-4">
                <p className="text-gray-900 text-2xl md:text-3xl font-bold mb-1">{dateCounts.total}</p>
                <p className="text-gray-600 text-xs md:text-sm">Total</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Cash In Hand Section */}
        <motion.div
          ref={cashRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="bg-white shadow-md border-0 py-0 gap-0">
            <CardContent className="p-4 md:p-6 px-4 md:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 text-2xl md:text-3xl font-bold mb-1">
                    {formatCurrency(calculateDeliveryBalances(walletState).cashInHand)}
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">Cash In Your Hand</p>
                </div>
                <Button 
                  onClick={() => navigate("/delivery/account")}
                  className="bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold px-6 py-3 rounded-lg"
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => {
              if (location.pathname === "/delivery") {
                setAnimationKey(prev => prev + 1)
              } else {
                navigate("/delivery")
              }
            }}
            className="flex flex-col items-center gap-1 p-2 text-[#ff8100]"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] text-[#ff8100] font-medium">Home</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/requests")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600 relative"
          >
            <div className="relative">
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                4
              </span>
            </div>
            <span className="text-[10px] text-gray-600 font-medium">Request</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/gig")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Gig</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/orders")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Orders</span>
          </button>
          <button 
            onClick={() => navigate("/delivery/profile")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}
