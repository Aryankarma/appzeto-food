import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import Lenis from "lenis"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Home,
  FileText,
  UtensilsCrossed,
  User,
  ChefHat,
  MapPin,
  Navigation,
  X,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { saveDeliveryOrderStatus, DELIVERY_ORDER_STATUS } from "../utils/deliveryOrderStatus"

export default function OrderRequestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [showIgnoreSheet, setShowIgnoreSheet] = useState(false)
  const [showAcceptSheet, setShowAcceptSheet] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [orderToAccept, setOrderToAccept] = useState(null)
  const cardsRef = useRef([])

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

    // Small delay to ensure refs are set after render
    const timeoutId = setTimeout(() => {
      // Filter out null refs and reset GSAP animations
      const validCards = cardsRef.current.filter(card => card !== null && card !== undefined)
      
      validCards.forEach((card) => {
        if (card) {
          gsap.set(card, { opacity: 0, y: 40 })
        }
      })

      // GSAP animations for cards
      const tl = gsap.timeline()
      
      validCards.forEach((card, index) => {
        if (card) {
          tl.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out"
          }, index * 0.1)
        }
      })
    }, 100)

    return () => {
      lenis.destroy()
      clearTimeout(timeoutId)
    }
  }, [location.pathname, animationKey])

  // Base orders data
  const baseOrders = [
    {
      id: 1,
      orderId: "100102",
      payment: "COD",
      amount: 30.60,
      restaurant: "Hungry Puppets",
      items: 2,
      timeAgo: "2 Years ago",
      restaurantAddress: "House: 00, Road: 00, Test City",
      deliveryAddress: "R9HC+GHV, Dhaka 1216, Ban...",
      distance: "970.58 km"
    },
    {
      id: 2,
      orderId: "100103",
      payment: "COD",
      amount: 30.60,
      restaurant: "Hungry Puppets",
      items: 2,
      timeAgo: "2 Years ago",
      restaurantAddress: "House: 00, Road: 00, Test City",
      deliveryAddress: "R9HC+GHV, Dhaka 1216, Ban...",
      distance: "970.58 km"
    }
  ]

  // Get ignored orders from localStorage
  const getIgnoredOrders = () => {
    try {
      const ignoredOrdersKey = 'delivery_ignored_orders'
      return JSON.parse(localStorage.getItem(ignoredOrdersKey) || '[]')
    } catch (error) {
      return []
    }
  }

  // Filter out ignored and already accepted orders
  const [orders, setOrders] = useState(() => {
    const ignoredOrders = getIgnoredOrders()
    const activeOrder = localStorage.getItem('activeOrder')
    const activeOrderId = activeOrder ? JSON.parse(activeOrder).orderId : null
    
    return baseOrders.filter(order => {
      // Filter out ignored orders
      if (ignoredOrders.includes(order.orderId)) return false
      // Filter out already accepted orders
      if (activeOrderId === order.orderId) return false
      // Filter out orders that have status saved (already accepted)
      const orderStatus = localStorage.getItem(`delivery_order_status_${order.orderId}`)
      if (orderStatus) return false
      return true
    })
  })

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      const ignoredOrders = getIgnoredOrders()
      const activeOrder = localStorage.getItem('activeOrder')
      const activeOrderId = activeOrder ? JSON.parse(activeOrder).orderId : null
      
      setOrders(baseOrders.filter(order => {
        if (ignoredOrders.includes(order.orderId)) return false
        if (activeOrderId === order.orderId) return false
        const orderStatus = localStorage.getItem(`delivery_order_status_${order.orderId}`)
        if (orderStatus) return false
        return true
      }))
    }

    window.addEventListener('deliveryOrdersUpdated', handleOrderUpdate)
    window.addEventListener('activeOrderUpdated', handleOrderUpdate)
    window.addEventListener('deliveryOrderStatusUpdated', handleOrderUpdate)
    window.addEventListener('storage', handleOrderUpdate)

    return () => {
      window.removeEventListener('deliveryOrdersUpdated', handleOrderUpdate)
      window.removeEventListener('activeOrderUpdated', handleOrderUpdate)
      window.removeEventListener('deliveryOrderStatusUpdated', handleOrderUpdate)
      window.removeEventListener('storage', handleOrderUpdate)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-[#ff8100] rounded-lg p-1.5 md:p-1.5">
              <Navigation className="w-5 h-5 md:w-4 md:h-4 text-white" />
            </div>
            <span className="text-[#ff8100] font-bold text-xl md:text-lg">Appzeto Food</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24 md:pb-6">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Order Request</h1>

        {/* Order Request Cards */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order.id}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <Card className="bg-gray-100 border-0 shadow-sm">
                <CardContent className="p-4 md:p-6 py-0 gap-0">
                  {/* Payment and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700 text-sm md:text-base font-medium">
                      Payment - COD
                    </span>
                    <span className="bg-gray-300 text-gray-800 text-sm md:text-base font-semibold px-3 py-1 rounded-full">
                      ₹ {order.amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Restaurant Information */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white rounded-full p-2 border-2 border-dashed border-gray-300">
                        <ChefHat className="w-5 h-5 text-[#ff8100]" />
                      </div>
                      <div className="w-0.5 h-8 bg-gray-300 border-dashed"></div>
                      <div className="bg-white rounded-full p-2 border-2 border-dashed border-gray-300">
                        <Navigation className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-gray-900 font-bold text-base md:text-lg mb-1">
                            {order.restaurant}
                          </h3>
                          <p className="text-[#ff8100] text-sm md:text-base font-medium mb-1">
                            {order.items} Items
                          </p>
                        </div>
                        <span className="text-gray-500 text-xs md:text-sm">
                          {order.timeAgo}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs md:text-sm mb-4">
                        {order.restaurantAddress}
                      </p>

                      {/* Delivery Information */}
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm md:text-base font-medium mb-1">
                          Deliver to
                        </p>
                        <div className="flex items-start justify-between">
                          <p className="text-gray-600 text-xs md:text-sm flex-1">
                            {order.deliveryAddress}
                          </p>
                          <button 
                            onClick={() => {
                              const address = encodeURIComponent(order.deliveryAddress)
                              window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
                            }}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 ml-2"
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs md:text-sm font-medium">View map</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Distance and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <div>
                      <span className="text-gray-700 text-sm md:text-base">Restaurant is </span>
                      <span className="text-gray-900 font-bold text-sm md:text-base">
                        {order.distance} away
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedOrderId(order.orderId)
                          setShowIgnoreSheet(true)
                        }}
                        variant="outline"
                        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-4 py-2 rounded-lg"
                      >
                        Ignore
                      </Button>
                      <Button 
                        onClick={() => {
                          setOrderToAccept(order)
                          setShowAcceptSheet(true)
                        }}
                        className="bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold px-4 py-2 rounded-lg"
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex items-center justify-around py-2 px-4">
          <button 
            onClick={() => navigate("/delivery")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600"
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] text-gray-600 font-medium">Home</span>
          </button>
          <button 
            onClick={() => {
              if (location.pathname === "/delivery/requests") {
                setAnimationKey(prev => prev + 1)
              } else {
                navigate("/delivery/requests")
              }
            }}
            className="flex flex-col items-center gap-1 p-2 text-[#ff8100] relative"
          >
            <div className="relative">
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                5
              </span>
            </div>
            <span className="text-[10px] text-[#ff8100] font-medium">Request</span>
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

      {/* Bottom Sheet - Accept Confirmation */}
      <AnimatePresence>
        {showAcceptSheet && orderToAccept && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setShowAcceptSheet(false)
                setOrderToAccept(null)
              }}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[60vh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-2">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowAcceptSheet(false)
                    setOrderToAccept(null)
                  }}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Message */}
                <div className="mb-6 mt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Accept this order?
                  </h3>
                  <div className="space-y-2 text-gray-600 text-base">
                    <p className="leading-relaxed">
                      You are about to accept Order #{orderToAccept.orderId} from <span className="font-semibold text-gray-900">{orderToAccept.restaurant}</span>.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="font-semibold text-gray-900">₹ {orderToAccept.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Items:</span>
                        <span className="font-semibold text-gray-900">{orderToAccept.items} Item{orderToAccept.items > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Distance:</span>
                        <span className="font-semibold text-gray-900">{orderToAccept.distance}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Once accepted, you'll be redirected to the order details page.
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      setShowAcceptSheet(false)
                      setOrderToAccept(null)
                    }}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Save active order to localStorage
                      const activeOrderData = {
                        orderId: orderToAccept.orderId,
                        items: orderToAccept.items,
                        paymentStatus: "Unpaid",
                        paymentMethod: orderToAccept.payment,
                        restaurant: orderToAccept.restaurant,
                        deliveryAddress: orderToAccept.deliveryAddress,
                        restaurantAddress: orderToAccept.restaurantAddress
                      }
                      localStorage.setItem('activeOrder', JSON.stringify(activeOrderData))
                      
                      // Save order status as "Order is Accepted"
                      saveDeliveryOrderStatus(orderToAccept.orderId, DELIVERY_ORDER_STATUS.ACCEPTED)
                      
                      // Save order date for counting
                      const orderDateKey = `delivery_order_date_${orderToAccept.orderId}`
                      localStorage.setItem(orderDateKey, new Date().toISOString())
                      
                      // Trigger custom event for same tab
                      window.dispatchEvent(new CustomEvent('activeOrderUpdated'))
                      // Trigger storage event for other tabs
                      window.dispatchEvent(new Event('storage'))
                      setShowAcceptSheet(false)
                      setOrderToAccept(null)
                      navigate(`/delivery/order/${orderToAccept.orderId}`)
                    }}
                    className="flex-1 bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold py-3 rounded-lg"
                  >
                    Confirm & Accept
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Sheet - Ignore Confirmation */}
      <AnimatePresence>
        {showIgnoreSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowIgnoreSheet(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[50vh] overflow-hidden"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Content */}
              <div className="px-6 pb-6 pt-2">
                {/* Close Button */}
                <button
                  onClick={() => setShowIgnoreSheet(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Message */}
                <div className="mb-6 mt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Ignore this order
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Once you click 'Ignore', you will no longer be able to see this order.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowIgnoreSheet(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // Mark order as ignored in localStorage
                      if (selectedOrderId) {
                        const ignoredOrdersKey = 'delivery_ignored_orders'
                        const ignoredOrders = JSON.parse(localStorage.getItem(ignoredOrdersKey) || '[]')
                        if (!ignoredOrders.includes(selectedOrderId)) {
                          ignoredOrders.push(selectedOrderId)
                          localStorage.setItem(ignoredOrdersKey, JSON.stringify(ignoredOrders))
                        }
                        // Trigger event to update UI
                        window.dispatchEvent(new CustomEvent('deliveryOrdersUpdated'))
                      }
                      setShowIgnoreSheet(false)
                      setSelectedOrderId(null)
                    }}
                    className="flex-1 bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold py-3 rounded-lg"
                  >
                    Ignore
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

