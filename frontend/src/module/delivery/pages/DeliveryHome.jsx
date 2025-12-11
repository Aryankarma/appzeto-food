import { useEffect, useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Lenis from "lenis"
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import {
  Lightbulb,
  HelpCircle,
  Calendar,
  Clock,
  Lock,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  UtensilsCrossed,
  Wallet,
  TrendingUp,
  CheckCircle,
  Bell,
  MapPin,
  ChefHat,
  Phone,
  X,
  TargetIcon,
} from "lucide-react"
import BottomPopup from "../components/BottomPopup"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGigStore } from "../store/gigStore"
import { useProgressStore } from "../store/progressStore"
import { formatTimeDisplay, calculateTotalHours } from "../utils/gigUtils"
import {
  getDeliveryWalletState,
  calculatePeriodEarnings
} from "../utils/deliveryWalletState"
import { formatCurrency } from "../../restaurant/utils/currency"
import { getAllDeliveryOrders } from "../utils/deliveryOrderStatus"
import { getUnreadDeliveryNotificationCount } from "../utils/deliveryNotifications"
import referralBonusBg from "../../../assets/referralbonuscardbg.png"
import dropLocationBanner from "../../../assets/droplocationbanner.png"

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
    html: `<div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
      <!-- Outer light blue circle -->
      <div style="position: absolute; width: 40px; height: 40px; background-color: #4285F4; border-radius: 50%; opacity: 0.3; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      <!-- Inner small blue circle -->
      <div style="position: absolute; width: 12px; height: 12px; background-color: #4285F4; border-radius: 50%; border: 2px solid white; z-index: 10;"></div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
  // Default location - Indore, India (based on image)
  const [riderLocation, setRiderLocation] = useState([22.7196, 75.8577]) // Indore coordinates
  const [isRefreshingLocation, setIsRefreshingLocation] = useState(false)
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
    goOffline,
    getSelectedDropLocation
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

  // Get today's progress from store
  const { getTodayProgress } = useProgressStore()
  const todayProgress = getTodayProgress()

  // Calculate today's earnings (use store value if available, otherwise calculate)
  const calculatedEarnings = calculatePeriodEarnings(walletState, 'today')
  const todayEarnings = todayProgress.earnings > 0 ? todayProgress.earnings : calculatedEarnings

  // Calculate today's trips (use store value if available, otherwise calculate)
  const allOrders = getAllDeliveryOrders()
  const calculatedTrips = allOrders.filter(order => {
    const orderId = order.orderId || order.id
    const orderDateKey = `delivery_order_date_${orderId}`
    const orderDateStr = localStorage.getItem(orderDateKey)
    if (!orderDateStr) return false
    const orderDate = new Date(orderDateStr)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  }).length
  const todayTrips = todayProgress.trips > 0 ? todayProgress.trips : calculatedTrips

  // Calculate today's gigs count
  const todayGigsCount = bookedGigs.filter(gig => gig.date === todayDateKey).length

  // Calculate total hours worked today (use store value if available, otherwise calculate)
  const calculatedHours = bookedGigs
    .filter(gig => gig.date === todayDateKey)
    .reduce((total, gig) => total + (gig.totalHours || 0), 0)
  const todayHoursWorked = todayProgress.timeOnOrders > 0 ? todayProgress.timeOnOrders : calculatedHours

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

  // Listen for progress data updates
  useEffect(() => {
    const handleProgressUpdate = () => {
      // Force re-render to show updated progress
      setAnimationKey(prev => prev + 1)
    }

    window.addEventListener('progressDataUpdated', handleProgressUpdate)
    window.addEventListener('storage', handleProgressUpdate)

    return () => {
      window.removeEventListener('progressDataUpdated', handleProgressUpdate)
      window.removeEventListener('storage', handleProgressUpdate)
    }
  }, [])

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
          () => { },
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

  // Handle online toggle - check for booked gigs
  const handleToggleOnline = () => {
    if (isOnline) {
      goOffline()
    } else {
      // Check if there are any booked gigs
      if (bookedGigs.length === 0) {
        // Show popup to book gigs
        setShowBookGigsPopup(true)
        return
      }
      
      // If gigs exist, proceed with going online
      const success = goOnline()
      if (!success) {
        // If goOnline fails (no gig), just set online status directly
        useGigStore.setState({ isOnline: true })
        localStorage.setItem('delivery_online_status', 'true')
        window.dispatchEvent(new CustomEvent('deliveryOnlineStatusChanged'))
      }
    }
  }

  // Carousel state
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0)
  const carouselRef = useRef(null)
  const carouselStartX = useRef(0)
  const carouselIsSwiping = useRef(false)
  const carouselAutoRotateRef = useRef(null)

  // Map view toggle state - Hotspot or Select drop (both show map, just different views)
  const [mapViewMode, setMapViewMode] = useState("hotspot") // "hotspot" or "selectDrop"

  // Swipe bar state - controls whether map or home sections are visible
  const [showHomeSections, setShowHomeSections] = useState(false) // false = map view, true = home sections
  const [swipeBarPosition, setSwipeBarPosition] = useState(0) // 0 = bottom (map), 1 = top (home)
  const [isDraggingSwipeBar, setIsDraggingSwipeBar] = useState(false)
  const swipeBarRef = useRef(null)
  const swipeBarStartY = useRef(0)
  const isSwipingBar = useRef(false)
  const homeSectionsScrollRef = useRef(null)
  const isScrollingHomeSections = useRef(false)

  // Emergency help popup state
  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false)

  // Help popup state
  const [showHelpPopup, setShowHelpPopup] = useState(false)

  // Book gigs popup state
  const [showBookGigsPopup, setShowBookGigsPopup] = useState(false)

  // Drop location selection popup state
  const [showDropLocationPopup, setShowDropLocationPopup] = useState(false)
  const [selectedDropLocation, setSelectedDropLocation] = useState(() => {
    return localStorage.getItem('selectedDropLocation') || null
  })

  // Help options
  const helpOptions = [
    {
      id: "helpCenter",
      title: "Help center",
      subtitle: "Find answers to queries and raise ticket",
      icon: "helpCenter",
      path: "/delivery/help/center"
    },
    {
      id: "supportTickets",
      title: "Support tickets",
      subtitle: "Check status of tickets raised",
      icon: "ticket",
      path: "/delivery/help/tickets"
    },
    {
      id: "idCard",
      title: "Show ID card",
      subtitle: "See your Zomato ID card",
      icon: "idCard",
      path: "/delivery/help/id-card"
    },
    {
      id: "changeLanguage",
      title: "Change language",
      subtitle: "Use app in your language of choice",
      icon: "language",
      path: "/delivery/help/language"
    }
  ]

  // Handle help option click
  const handleHelpOptionClick = (option) => {
    setShowHelpPopup(false)
    navigate(option.path)
  }

  // Emergency options with phone numbers
  const emergencyOptions = [
    {
      id: "ambulance",
      title: "Call ambulance (10 mins)",
      subtitle: "For medical emergencies",
      phone: "108", // Indian emergency ambulance number
      icon: "ambulance"
    },
    {
      id: "accident",
      title: "Call accident helpline",
      subtitle: "Talk to our emergency team",
      phone: "1073", // Indian accident helpline
      icon: "siren"
    },
    {
      id: "police",
      title: "Call police",
      subtitle: "Report a crime",
      phone: "100", // Indian police emergency number
      icon: "police"
    },
    {
      id: "insurance",
      title: "Insurance card",
      subtitle: "View your insurance details",
      phone: null, // No phone call for insurance
      icon: "insurance"
    }
  ]

  // Handle emergency option click
  const handleEmergencyOptionClick = (option) => {
    if (option.phone) {
      window.location.href = `tel:${option.phone}`
    } else if (option.id === "insurance") {
      // Navigate to insurance page or show insurance details
      navigate("/delivery/insurance")
    }
    setShowEmergencyPopup(false)
  }

  // Carousel slides data
  const carouselSlides = [
    {
      id: 1,
      title: "Work for 2 days",
      subtitle: "to get Zomato bag",
      icon: "bag",
      buttonText: "Know more",
      bgColor: "bg-gray-700"
    },
    {
      id: 2,
      title: "Submit bank details",
      subtitle: "PAN & bank details required for payouts",
      icon: "bank",
      buttonText: "Submit",
      bgColor: "bg-yellow-400"
    }
  ]

  // Auto-rotate carousel
  useEffect(() => {
    carouselAutoRotateRef.current = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 3000)
    return () => {
      if (carouselAutoRotateRef.current) {
        clearInterval(carouselAutoRotateRef.current)
      }
    }
  }, [carouselSlides.length])

  // Reset auto-rotate timer after manual swipe
  const resetCarouselAutoRotate = () => {
    if (carouselAutoRotateRef.current) {
      clearInterval(carouselAutoRotateRef.current)
    }
    carouselAutoRotateRef.current = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % carouselSlides.length)
    }, 3000)
  }

  // Handle carousel swipe touch events
  const carouselStartY = useRef(0)

  const handleCarouselTouchStart = (e) => {
    carouselIsSwiping.current = true
    carouselStartX.current = e.touches[0].clientX
    carouselStartY.current = e.touches[0].clientY
  }

  const handleCarouselTouchMove = (e) => {
    if (!carouselIsSwiping.current) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = Math.abs(currentX - carouselStartX.current)
    const deltaY = Math.abs(currentY - carouselStartY.current)

    // Only prevent default if horizontal swipe is dominant
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault()
    }
  }

  const handleCarouselTouchEnd = (e) => {
    if (!carouselIsSwiping.current) return

    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = carouselStartX.current - endX
    const deltaY = Math.abs(carouselStartY.current - endY)
    const threshold = 50 // Minimum swipe distance

    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
      if (deltaX > 0) {
        // Swiped left - go to next slide
        setCurrentCarouselSlide((prev) => (prev + 1) % carouselSlides.length)
      } else {
        // Swiped right - go to previous slide
        setCurrentCarouselSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
      }
      resetCarouselAutoRotate()
    }

    carouselIsSwiping.current = false
    carouselStartX.current = 0
    carouselStartY.current = 0
  }

  // Handle carousel mouse events for desktop
  const handleCarouselMouseDown = (e) => {
    carouselIsSwiping.current = true
    carouselStartX.current = e.clientX

    const handleMouseMove = (moveEvent) => {
      if (!carouselIsSwiping.current) return
      moveEvent.preventDefault()
    }

    const handleMouseUp = (upEvent) => {
      if (!carouselIsSwiping.current) {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        return
      }

      const endX = upEvent.clientX
      const deltaX = carouselStartX.current - endX
      const threshold = 50

      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          // Swiped left - go to next slide
          setCurrentCarouselSlide((prev) => (prev + 1) % carouselSlides.length)
        } else {
          // Swiped right - go to previous slide
          setCurrentCarouselSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
        }
        resetCarouselAutoRotate()
      }

      carouselIsSwiping.current = false
      carouselStartX.current = 0
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Handle swipe bar touch events
  const handleSwipeBarTouchStart = (e) => {
    // Check if touch is on a button or interactive element
    const target = e.target
    const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]')
    
    // If touching an interactive element, don't start swipe
    if (isInteractive && !target.closest('[data-swipe-handle]')) {
      return
    }
    
    // Check if we're at the top of the scrollable area (within first 50px)
    if (showHomeSections && homeSectionsScrollRef.current) {
      const scrollTop = homeSectionsScrollRef.current.scrollTop
      if (scrollTop > 50) {
        // User is scrolling, not dragging
        isScrollingHomeSections.current = true
        return
      }
    }
    
    isSwipingBar.current = true
    swipeBarStartY.current = e.touches[0].clientY
    setIsDraggingSwipeBar(true)
    isScrollingHomeSections.current = false
  }

  const handleSwipeBarTouchMove = (e) => {
    if (!isSwipingBar.current) return
    
    // If user was scrolling, don't handle as swipe
    if (isScrollingHomeSections.current) {
      return
    }

    const currentY = e.touches[0].clientY
    const deltaY = swipeBarStartY.current - currentY // Positive = swiping up, Negative = swiping down
    const windowHeight = window.innerHeight

    // Check if we're scrolling vs dragging
    if (showHomeSections && homeSectionsScrollRef.current) {
      const scrollTop = homeSectionsScrollRef.current.scrollTop
      // If scrolling down and content is scrollable, allow scrolling instead of dragging
      if (deltaY < 0 && scrollTop > 0) {
        return
      }
    }

    // Only prevent default if we're actually dragging (not scrolling)
    if (Math.abs(deltaY) > 5) {
      e.preventDefault()
    }

    if (showHomeSections) {
      // Currently showing home sections - swiping down should go back to map
      // Calculate position from 1 (top) to 0 (bottom)
      const newPosition = Math.max(0, Math.min(1, 1 + (deltaY / windowHeight)))
      setSwipeBarPosition(newPosition)
    } else {
      // Currently showing map - swiping up should show home sections
      // Calculate position from 0 (bottom) to 1 (top)
      const newPosition = Math.max(0, Math.min(1, deltaY / windowHeight))
      setSwipeBarPosition(newPosition)
    }
  }

  const handleSwipeBarTouchEnd = (e) => {
    if (!isSwipingBar.current) return
    
    // If user was scrolling, don't handle as swipe
    if (isScrollingHomeSections.current) {
      isSwipingBar.current = false
      setIsDraggingSwipeBar(false)
      isScrollingHomeSections.current = false
      return
    }

    const windowHeight = window.innerHeight
    const threshold = 50 // Small threshold - just 50px to trigger
    const finalY = e.changedTouches[0].clientY
    const finalDeltaY = swipeBarStartY.current - finalY

    if (showHomeSections) {
      // If showing home sections and swiped down, go back to map
      if (finalDeltaY < -threshold || swipeBarPosition < 0.95) {
        setShowHomeSections(false)
        setSwipeBarPosition(0)
      } else {
        // Keep it open
        setSwipeBarPosition(1)
        setShowHomeSections(true)
      }
    } else {
      // If showing map and swiped up, show home sections
      if (finalDeltaY > threshold || swipeBarPosition > 0.05) {
        setSwipeBarPosition(1)
        setShowHomeSections(true)
      } else {
        setSwipeBarPosition(0)
        setShowHomeSections(false)
      }
    }

    isSwipingBar.current = false
    setIsDraggingSwipeBar(false)
    swipeBarStartY.current = 0
    isScrollingHomeSections.current = false
  }

  // Handle mouse events for desktop
  const handleSwipeBarMouseDown = (e) => {
    // Check if click is on a button or interactive element
    const target = e.target
    const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]')
    
    // If clicking an interactive element, don't start swipe
    if (isInteractive && !target.closest('[data-swipe-handle]')) {
      return
    }
    
    isSwipingBar.current = true
    swipeBarStartY.current = e.clientY
    setIsDraggingSwipeBar(true)
  }

  const handleSwipeBarMouseMove = (e) => {
    if (!isSwipingBar.current) return

    const currentY = e.clientY
    const deltaY = swipeBarStartY.current - currentY
    const windowHeight = window.innerHeight

    // Prevent default to avoid text selection
    e.preventDefault()

    if (showHomeSections) {
      // Currently showing home sections - swiping down should go back to map
      // Calculate position from 1 (top) to 0 (bottom)
      const newPosition = Math.max(0, Math.min(1, 1 + (deltaY / windowHeight)))
      setSwipeBarPosition(newPosition)
    } else {
      // Currently showing map - swiping up should show home sections
      // Calculate position from 0 (bottom) to 1 (top)
      const newPosition = Math.max(0, Math.min(1, deltaY / windowHeight))
      setSwipeBarPosition(newPosition)
    }
  }

  const handleSwipeBarMouseUp = (e) => {
    if (!isSwipingBar.current) return

    const windowHeight = window.innerHeight
    const threshold = 50 // Small threshold - just 50px to trigger
    const finalY = e.clientY
    const finalDeltaY = swipeBarStartY.current - finalY

    if (showHomeSections) {
      // If showing home sections and swiped down, go back to map
      if (finalDeltaY < -threshold || swipeBarPosition < 0.95) {
        setShowHomeSections(false)
        setSwipeBarPosition(0)
      } else {
        // Keep it open
        setSwipeBarPosition(1)
        setShowHomeSections(true)
      }
    } else {
      // If showing map and swiped up, show home sections
      if (finalDeltaY > threshold || swipeBarPosition > 0.05) {
        setSwipeBarPosition(1)
        setShowHomeSections(true)
      } else {
        setSwipeBarPosition(0)
        setShowHomeSections(false)
      }
    }

    isSwipingBar.current = false
    setIsDraggingSwipeBar(false)
    swipeBarStartY.current = 0
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (isDraggingSwipeBar) {
      document.addEventListener('mousemove', handleSwipeBarMouseMove)
      document.addEventListener('mouseup', handleSwipeBarMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleSwipeBarMouseMove)
        document.removeEventListener('mouseup', handleSwipeBarMouseUp)
      }
    }
  }, [isDraggingSwipeBar, swipeBarPosition])

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
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
        {/* Online/Offline Toggle Switch */}
        <div className="relative" style={{ zIndex: 100 }}>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggleOnline()
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
            onClick={() => setShowEmergencyPopup(true)}
            className="w-10 h-10 rounded-full bg-gray-200  flex items-center justify-center hover:bg-red-600 transition-colors relative"
          >
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </button>

          {/* Help/Question Mark Icon */}
          <button
            onClick={() => setShowHelpPopup(true)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>

          {/* Profile Picture */}
          <button
            onClick={() => navigate("/delivery/profile")}
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

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="relative overflow-hidden bg-gray-700 cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleCarouselTouchStart}
        onTouchMove={handleCarouselTouchMove}
        onTouchEnd={handleCarouselTouchEnd}
        onMouseDown={handleCarouselMouseDown}
      >
        <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}>
          {carouselSlides.map((slide) => (
            <div key={slide.id} className="min-w-full">
              <div className={`${slide.bgColor} px-4 py-3 flex items-center gap-3 min-h-[80px]`}>
                {/* Icon */}
                <div className="flex-shrink-0">
                  {slide.icon === "bag" ? (
                    <div className="relative">
                      {/* Delivery Bag Icon - Reduced size */}
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center shadow-lg relative">
                        {/* Bag shape */}
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      {/* Shadow */}
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/30 rounded-full blur-sm"></div>
                    </div>
                  ) : (
                    <div className="relative w-10 h-10">
                      {/* Bank/Rupee Icon - Reduced size */}
                      <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center relative">
                        {/* Rupee symbol */}
                        <svg className="w-12 h-12 text-white absolute" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h3 className={`${slide.bgColor === "bg-gray-700" ? "text-white" : "text-black"} text-sm font-semibold mb-0.5`}>
                    {slide.title}
                  </h3>
                  <p className={`${slide.bgColor === "bg-gray-700" ? "text-white/90" : "text-black/80"} text-xs`}>
                    {slide.subtitle}
                  </p>
                </div>

                {/* Button */}
                <button className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors ${slide.bgColor === "bg-gray-700"
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-yellow-300 text-black hover:bg-yellow-200"
                  }`}>
                  {slide.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCarouselSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentCarouselSlide
                  ? (currentCarouselSlide === 0 ? "w-6 bg-white" : "w-6 bg-black")
                  : (index === 0 ? "w-1.5 bg-white/50" : "w-1.5 bg-black/30")
                }`}
            />
          ))}
        </div>
      </div>

      {/* Map View Toggle Bar - Only visible when map is shown, transparent overlay on map */}
      {!showHomeSections && (
        <>
          {/* Segmented Control - Hotspot/Select drop - Centered */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[155px] left-1/2 -translate-x-1/2 z-40"
          >
            <div className="relative inline-flex rounded-full bg-white backdrop-blur-md shadow-lg border border-gray-200 overflow-hidden p-1">
              {/* Animated sliding background */}
              <motion.div
                className="absolute top-1 bottom-1 rounded-full bg-black"
                initial={false}
                animate={{
                  left: mapViewMode === "hotspot" ? "4px" : "50%",
                  width: mapViewMode === "hotspot" ? "calc(50% - 4px)" : "calc(50% - 4px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
              />

              {/* Buttons */}
              <button
                onClick={() => setMapViewMode("hotspot")}
                className={`relative px-6 py-2.5 font-semibold text-sm transition-colors duration-200 whitespace-nowrap rounded-full z-10 ${mapViewMode === "hotspot"
                    ? "text-white"
                    : "text-black"
                  }`}
              >
                Hotspot
              </button>
              <button
                onClick={() => {
                  const selectedDropLocation = getSelectedDropLocation()
                  if (!selectedDropLocation) {
                    navigate("/delivery/select-drop-location")
                  } else {
                    setMapViewMode("selectDrop")
                  }
                }}
                className={`relative px-6 py-2.5 font-semibold text-sm transition-colors duration-200 whitespace-nowrap rounded-full z-10 ${mapViewMode === "selectDrop"
                    ? "text-white"
                    : "text-black"
                  }`}
              >
                Select drop
              </button>
            </div>
          </motion.div>

          {/* Hamburger Menu Button - Absolute Right */}
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-[160px] right-4 z-40 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-gray-300/50 flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </>
      )}

      {/* Conditional Content Based on Swipe Bar Position */}
      {!showHomeSections ? (
        /* Map View - Shows map with Hotspot or Select drop mode */
        <div className="relative flex-1" style={{ height: 'calc(100vh - 200px)' }}>
          <MapContainer
            key={`map-${mapViewMode}-${riderLocation[0]}-${riderLocation[1]}`}
            center={riderLocation}
            zoom={13}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapUpdater center={riderLocation} />

            {/* Yellow highlight circle around rider location */}
            <Circle
              center={riderLocation}
              radius={1000} // 500 meters radius
              pathOptions={{
                color: '#FCD34D',
                fillColor: '#FCD34D',
                fillOpacity: 0.3,
                weight: 4
              }}
            />

            {/* Rider Location Marker */}
            <Marker position={riderLocation} icon={createCustomIcon('#ADD8E6', '🔵')}>
              <Popup>Your Location</Popup>
            </Marker>

            {/* Refresh indicator - animated pulsing circles when refreshing location */}
            {isRefreshingLocation && (
              <>
                <Circle
                  key="circle-outer"
                  center={riderLocation}
                  radius={600}
                  pathOptions={{
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.15,
                    weight: 2
                  }}
                />
                <Circle
                  key="circle-middle"
                  center={riderLocation}
                  radius={400}
                  pathOptions={{
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.25,
                    weight: 2
                  }}
                />
                <Circle
                  key="circle-inner"
                  center={riderLocation}
                  radius={200}
                  pathOptions={{
                    color: '#3B82F6',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.35,
                    weight: 2
                  }}
                />
              </>
            )}

            {/* Show different markers based on map view mode */}
            {mapViewMode === "hotspot" ? (
              // Hotspot mode - show hotspot markers (currently none available)
              null
            ) : (
              // Select drop mode - show drop location markers
              null
            )}
          </MapContainer>

          {/* Map Refresh Overlay - Professional Loading Indicator */}
          {isRefreshingLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-blue-500/5 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none"
            >
              {/* Loading indicator container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="relative"
              >
                {/* Outer pulsing ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.3, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1], // Smooth ease-in-out
                    type: "tween",
                    times: [0, 0.5, 1]
                  }}
                  className="absolute inset-0 w-20 h-20 bg-blue-500/20 rounded-full"
                />
                
                {/* Middle ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.2, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1], // Smooth ease-in-out
                    type: "tween",
                    delay: 0.3,
                    times: [0, 0.5, 1]
                  }}
                  className="absolute inset-0 w-16 h-16 bg-blue-500/30 rounded-full m-2"
                />
                
                {/* Inner spinner */}
                <div className="relative w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                      type: "tween"
                    }}
                    className="w-8 h-8 border-[3px] border-blue-600 border-t-transparent rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Floating Action Button - My Location */}
          <motion.button
            onClick={() => {
              if (navigator.geolocation) {
                setIsRefreshingLocation(true)
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords
                    setRiderLocation([latitude, longitude])
                    // Stop refreshing animation after a short delay
                    setTimeout(() => {
                      setIsRefreshingLocation(false)
                    }, 800)
                  },
                  (error) => {
                    console.error('Error getting location:', error)
                    setIsRefreshingLocation(false)
                  }
                )
              }
            }}
            className="absolute bottom-44 right-3 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-20 overflow-visible"
            whileTap={{ scale: 0.92 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              mass: 0.5
            }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Ripple effect */}
              {isRefreshingLocation && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500/20"
                  initial={{ scale: 0.9, opacity: 0.6 }}
                  animate={{ 
                    scale: [0.9, 1.6, 1.8],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.25, 0.46, 0.45, 0.94], // Smooth ease-out
                    times: [0, 0.5, 1]
                  }}
                />
              )}
              
              {/* Icon with smooth animations */}
              <motion.div
                className="relative z-10"
                animate={{
                  rotate: isRefreshingLocation ? 360 : 0,
                  scale: isRefreshingLocation ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: isRefreshingLocation ? Infinity : 0,
                    ease: "linear", // Linear for smooth continuous rotation
                    type: "tween"
                  },
                  scale: {
                    duration: 1.5,
                    repeat: isRefreshingLocation ? Infinity : 0,
                    ease: [0.4, 0, 0.6, 1], // Smooth ease-in-out
                    type: "tween",
                    times: [0, 0.5, 1]
                  }
                }}
              >
                <MapPin 
                  className={`w-6 h-6 transition-colors duration-500 ease-in-out ${
                    isRefreshingLocation ? 'text-blue-600' : 'text-gray-700'
                  }`} 
                />
              </motion.div>
            </div>
          </motion.button>

          {/* Floating Banner - No Hotspots Available */}
          {mapViewMode === "hotspot" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-sm px-6 py-4 z-20 min-w-[96%] text-center"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1">No hotspots are available</h3>
              <p className="text-sm text-gray-600">Please go online to see hotspots</p>
            </motion.div>
          )}

          {/* Bottom Swipeable Bar - Can be dragged up to show home sections */}
          {!showHomeSections && (
            <motion.div
              ref={swipeBarRef}
              initial={{ y: "100%" }}
              animate={{
                y: isDraggingSwipeBar
                  ? `${-swipeBarPosition * (window.innerHeight * 0.8)}px`
                  : 0
              }}
              transition={isDraggingSwipeBar ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 300 }}
              onTouchStart={handleSwipeBarTouchStart}
              onTouchMove={handleSwipeBarTouchMove}
              onTouchEnd={handleSwipeBarTouchEnd}
              onMouseDown={handleSwipeBarMouseDown}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-10"
              style={{
                touchAction: 'pan-y'
              }}
            >
              {/* Swipe Handle */}
              <div
                className="flex flex-col items-center pt-4 pb-2 cursor-grab active:cursor-grabbing"
                style={{ touchAction: 'none' }}
              >
                <motion.div
                  className="flex flex-col items-center gap-1"
                  animate={{
                    y: isDraggingSwipeBar ? swipeBarPosition * 5 : 0,
                    opacity: isDraggingSwipeBar ? 0.7 : 1
                  }}
                  transition={{ duration: 0.1 }}
                >
              <ChevronUp className="!w-12 !h-8 scale-x-150 text-gray-400 -mt-2 font-bold" strokeWidth={3} />
              </motion.div>
              </div>

              {/* Content Area - Shows map info when down */}
              <div className="px-4 pb-6">
                {mapViewMode === "hotspot" ? (
                  <div className="flex flex-col items-center">
                    {/* <h3 className="text-lg font-bold text-gray-900 mb-2">No hotspots are available</h3>
                  <p className="text-sm text-gray-600 mb-4">Please go online to see hotspots</p> */}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* <h3 className="text-lg font-bold text-gray-900 mb-2">Select drop location</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose a drop location on the map</p> */}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        /* Home Sections View - Full screen when swipe bar is dragged up */
        <motion.div
          ref={swipeBarRef}
          initial={{ y: "100%" }}
          animate={{
            y: isDraggingSwipeBar
              ? `${(1 - swipeBarPosition) * (window.innerHeight * 0.8)}px`
              : 0
          }}
          exit={{ y: "100%" }}
          transition={isDraggingSwipeBar ? { duration: 0 } : { type: "spring", damping: 30, stiffness: 300 }}
          onTouchStart={handleSwipeBarTouchStart}
          onTouchMove={handleSwipeBarTouchMove}
          onTouchEnd={handleSwipeBarTouchEnd}
          onMouseDown={handleSwipeBarMouseDown}
          className="relative flex-1 bg-white rounded-t-3xl shadow-2xl overflow-hidden"
          style={{ height: 'calc(100vh - 200px)', touchAction: 'pan-y' }}
        >
          {/* Swipe Handle at Top - Can be dragged down to go back to map */}
          <div
            className="flex flex-col items-center pt-4 pb-2 cursor-grab active:cursor-grabbing bg-white sticky top-0 z-10"
            style={{ touchAction: 'none' }}
          >
            <motion.div
              className="flex flex-col items-center gap-1"
              animate={{
                y: isDraggingSwipeBar ? -swipeBarPosition * 5 : 0,
                opacity: isDraggingSwipeBar ? 0.7 : 1
              }}
              transition={{ duration: 0.1 }}
            >
<ChevronDown
  className="!w-12 !h-8 scale-x-150 text-gray-400 -mt-2 font-bold"
  strokeWidth={3}
/>
            </motion.div>
          </div>

          <div 
            ref={homeSectionsScrollRef}
            className="px-4 pt-4 pb-16 space-y-4 overflow-y-auto" 
            style={{ height: 'calc(100vh - 250px)' }}
          >
            {/* Referral Bonus Banner */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate("/delivery/refer-and-earn")}
              className="w-full rounded-xl p-6 shadow-lg relative overflow-hidden min-h-[70px] cursor-pointer"
              style={{
                backgroundImage: `url(${referralBonusBg})`,
                backgroundSize: '100% 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="relative z-10">
                <div className="text-white text-3xl font-bold mb-1">₹6,000                 <span className="text-white/90 text-base font-medium mb-1">referral bonus</span>
                 </div>
                <div className="text-white/80 text-sm">Refer your friends now</div>
              </div>
            </motion.div>

            {/* Unlock Offer Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-full rounded-xl p-6 shadow-lg bg-black text-white"
            >
              <div className="flex items-center text-center justify-center gap-2 mb-2">
                <div className="text-4xl font-bold text-center">₹100</div>
                <Lock className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/90 text-center text-sm mb-4">Complete 1 order to unlock ₹100</p>
              <div className="flex items-center text-center justify-center gap-2 text-white/70 text-xs mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-center">Valid till 10 December 2025</span>
              </div>
              <button
                onClick={() => {
                  if (isOnline) {
                    goOffline()
                  } else {
                    // Always show the popup when offline (same as navbar behavior)
                    setShowBookGigsPopup(true)
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <span>Go online</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Gig Details Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="w-full rounded-xl overflow-hidden shadow-lg bg-white"
            >
              {/* Header */}
              <div className="bg-black px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-sm">g</span>
                </div>
                <span className="text-white font-semibold">Gig details</span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Free Gig for you, 3pm - 5pm</h3>
                  <span className="text-2xl">🎉</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Special Gig - you can go online even now</p>
                <div className="flex items-center gap-2 text-gray-900 font-semibold mb-4 cursor-pointer">
                  <span>Know more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
                <button
                  onClick={() => {
                    navigate("/delivery/gig")
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Book and go online now
                </button>
              </div>
            </motion.div>

            {/* Today's Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="w-full rounded-xl overflow-hidden shadow-lg bg-white"
            >
              {/* Header */}
              <div className="bg-black px-4 py-3 flex items-center gap-3">
                <div className="relative">
                  <Calendar className="w-5 h-5 text-white" />
                  <CheckCircle className="w-3 h-3 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" fill="currentColor" />
                </div>
                <span className="text-white font-semibold">Today's progress</span>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Grid Layout - 2x2 */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Top Left - Earnings */}
                  <button
                    onClick={() => navigate("/delivery/earnings")}
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

                  {/* Top Right - Trips */}
                  <button
                    onClick={() => navigate("/delivery/trip-history")}
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

                  {/* Bottom Left - Time on orders */}
                  <button
                    onClick={() => navigate("/delivery/time-on-orders")}
                    className="flex flex-col items-start gap-1 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-gray-900 text-2xl font-bold">
                      {formatHours(todayHoursWorked)} hrs
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <span>Time on orders</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Bottom Right - Gigs History */}
                  <button
                    onClick={() => navigate("/delivery/gig")}
                    className="flex flex-col items-end gap-1 hover:opacity-80 transition-opacity"
                  >
                    <span className="text-gray-900 text-2xl font-bold">
                      {todayGigsCount} Gigs
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <span>History</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Help Popup */}
      <BottomPopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        title="How can we help?"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="70vh"
      >
        <div className="py-2">
          {helpOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleHelpOptionClick(option)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                {option.icon === "helpCenter" && (
                  <HelpCircle className="w-6 h-6 text-gray-700" />
                )}
                {option.icon === "ticket" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                )}
                {option.icon === "idCard" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                )}
                {option.icon === "language" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </BottomPopup>

      {/* Emergency Help Popup */}
      <BottomPopup
        isOpen={showEmergencyPopup}
        onClose={() => setShowEmergencyPopup(false)}
        title="Emergency help"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="70vh"
      >
        <div className="py-2">
          {emergencyOptions.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleEmergencyOptionClick(option)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              {/* Icon */}
              <div className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center">
                {option.icon === "ambulance" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative overflow-hidden">
                    {/* Ambulance vehicle */}
                    <div className="absolute inset-0 bg-blue-500"></div>
                    {/* Red and blue lights on roof */}
                    <div className="absolute top-1 left-2 w-2 h-3 bg-red-500 rounded-sm"></div>
                    <div className="absolute top-1 right-2 w-2 h-3 bg-blue-500 rounded-sm"></div>
                    {/* Star of Life emblem */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18l8 4v7.64l-8 4-8-4V8.18l8-4z" />
                        <path d="M12 8L6 11v6l6 3 6-3v-6l-6-3z" />
                      </svg>
                    </div>
                    {/* AMBULANCE text */}
                    <div className="absolute bottom-1 left-0 right-0 text-[6px] font-bold text-white text-center">AMBULANCE</div>
                  </div>
                )}
                {option.icon === "siren" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative">
                    {/* Red siren dome */}
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center relative">
                      {/* Yellow light rays */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                      {/* Phone icon inside */}
                      <Phone className="w-5 h-5 text-yellow-400 z-10" />
                    </div>
                  </div>
                )}
                {option.icon === "police" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    {/* Police officer bust */}
                    <div className="relative">
                      {/* Head */}
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      {/* Cap */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-700 rounded-t-lg"></div>
                      {/* Cap peak */}
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-amber-800"></div>
                      {/* Mustache */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                )}
                {option.icon === "insurance" && (
                  <div className="w-14 h-14 bg-yellow-400 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative">
                    {/* Card shape */}
                    <div className="w-12 h-8 bg-white rounded-sm relative">
                      {/* Red heart and cross on left */}
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <div className="w-0.5 h-3 bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>

              {/* Arrow Icon */}
              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </BottomPopup>

      {/* Book Gigs Popup */}
      <BottomPopup
        isOpen={showBookGigsPopup}
        onClose={() => setShowBookGigsPopup(false)}
        title="Book gigs to go online"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="auto"
      >
        <div className="py-4">
          {/* Gig Details Card */}
          <div className="mb-6 rounded-lg overflow-hidden shadow-sm border border-gray-200">
            {/* Header - Teal background */}
            <div className="bg-teal-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">g</span>
              </div>
              <span className="text-teal-700 font-semibold">Gig details</span>
            </div>
            
            {/* Body - White background */}
            <div className="bg-white px-4 py-4">
              <p className="text-gray-900 text-sm">Gig booking open in your zone</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-900 text-sm mb-6">
            Book your Gigs now to go online and start delivering orders
          </p>

          {/* Book Gigs Button */}
          <button
            onClick={() => {
              setShowBookGigsPopup(false)
              navigate("/delivery/gig")
            }}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Book gigs
          </button>
        </div>
      </BottomPopup>
    </div>
  )
}
