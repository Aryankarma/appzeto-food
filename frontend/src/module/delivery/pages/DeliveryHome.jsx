import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import Lenis from "lenis"
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
  ArrowRight
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

export default function DeliveryHome() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [activeOrder, setActiveOrder] = useState(() => {
    // Check localStorage for active order
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

  // Listen for order acceptance
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('activeOrder')
      setActiveOrder(stored ? JSON.parse(stored) : null)
    }

    // Check on mount and when location changes
    handleStorageChange()

    // Listen for custom event (for same tab updates)
    window.addEventListener('activeOrderUpdated', handleStorageChange)
    // Listen for storage event (for cross-tab updates)
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

    // Check on mount
    handleWalletUpdate()

    // Listen for custom event (for same tab updates)
    window.addEventListener('deliveryWalletStateUpdated', handleWalletUpdate)
    // Listen for storage event (for cross-tab updates)
    window.addEventListener('storage', handleWalletUpdate)

    return () => {
      window.removeEventListener('deliveryWalletStateUpdated', handleWalletUpdate)
      window.removeEventListener('storage', handleWalletUpdate)
    }
  }, [location.pathname])

  // Listen for order status updates and update counts
  useEffect(() => {
    const handleOrderStatusUpdate = () => {
      setOrdersCount(getDeliveryOrdersCount())
    }

    // Check on mount
    handleOrderStatusUpdate()

    // Listen for custom event (for same tab updates)
    window.addEventListener('deliveryOrderStatusUpdated', handleOrderStatusUpdate)
    window.addEventListener('activeOrderUpdated', handleOrderStatusUpdate)
    // Listen for storage event (for cross-tab updates)
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

    // Check on mount
    handleNotificationUpdate()

    // Listen for custom event (for same tab updates)
    window.addEventListener('deliveryNotificationsUpdated', handleNotificationUpdate)
    // Listen for storage event (for cross-tab updates)
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
    weekStart.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0)

    let todayCount = 0
    let weekCount = 0

    allOrders.forEach(order => {
      // Try to get order date from localStorage or use current date
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
  
  // Update date counts when orders change
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
    // Initialize Lenis for smooth scrolling
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

    // Reset GSAP animations
    if (activeOrderRef.current) {
      gsap.set(activeOrderRef.current, { opacity: 0, y: 30 })
    }
    if (earningsRef.current) {
      gsap.set(earningsRef.current, { opacity: 0, y: 30 })
    }
    if (ordersRef.current) {
      gsap.set(ordersRef.current, { opacity: 0, y: 30 })
    }
    if (cashRef.current) {
      gsap.set(cashRef.current, { opacity: 0, y: 30 })
    }

    // GSAP animations
    const tl = gsap.timeline()
    
    if (activeOrderRef.current && activeOrder) {
      tl.to(activeOrderRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      })
    }

    if (earningsRef.current) {
      tl.to(earningsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, activeOrder ? "-=0.4" : "0")
    }

    if (ordersRef.current) {
      tl.to(ordersRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
    }

    if (cashRef.current) {
      tl.to(cashRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
    }

    return () => {
      lenis.destroy()
    }
  }, [location.pathname, animationKey])

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

      {/* Main Content */}
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
                        // Open direction in maps
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
