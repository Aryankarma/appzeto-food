import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { 
  Home,
  FileText,
  UtensilsCrossed,
  User,
  Building2,
  Clock,
  MapPin,
  CheckCircle,
  DollarSign,
  Sparkles
} from "lucide-react"
import { formatCurrency } from "../../restaurant/utils/currency"
import FeedNavbar from "../components/FeedNavbar"
import { useGigStore } from "../store/gigStore"
import { 
  getAllDeliveryOrders, 
  getDeliveryOrderStatus,
  normalizeDeliveryStatus,
  matchesDeliveryFilter,
  saveDeliveryOrderStatus,
  DELIVERY_ORDER_STATUS 
} from "../utils/deliveryOrderStatus"

export default function MyOrders() {
  const navigate = useNavigate()
  const { isOnline, goOnline, goOffline } = useGigStore()
  const [activeTab, setActiveTab] = useState("orderHistory")
  const [activeFilter, setActiveFilter] = useState("all")
  const [allOrders, setAllOrders] = useState(() => getAllDeliveryOrders())

  // Initialize test data on mount
  useEffect(() => {
    // Test orders with different statuses
    const testOrders = [
      {
        orderId: "100161",
        status: DELIVERY_ORDER_STATUS.DELIVERED,
        items: 1,
        restaurant: "Hungry Puppets",
        deliveryAddress: "R9HC+GHV, Dhaka 1216, Ban...",
        paymentMethod: "COD",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        orderId: "100154",
        status: DELIVERY_ORDER_STATUS.DELIVERED,
        items: 2,
        restaurant: "Pizza Palace",
        deliveryAddress: "123 Main Street, Apt 4B",
        paymentMethod: "Card",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        orderId: "100109",
        status: DELIVERY_ORDER_STATUS.DELIVERED,
        items: 1,
        restaurant: "Burger King",
        deliveryAddress: "456 Oak Avenue",
        paymentMethod: "COD",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      },
      {
        orderId: "100088",
        status: DELIVERY_ORDER_STATUS.CANCELLED,
        items: 3,
        restaurant: "Sushi Express",
        deliveryAddress: "789 Pine Road",
        paymentMethod: "COD",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        orderId: "100075",
        status: DELIVERY_ORDER_STATUS.DELIVERED,
        items: 2,
        restaurant: "Taco Bell",
        deliveryAddress: "321 Elm Street",
        paymentMethod: "Card",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      }
    ]

    // Check if test data already exists by checking for one of the test order IDs
    const testDataExists = localStorage.getItem(`delivery_order_status_100161`)
    
    if (!testDataExists) {
      testOrders.forEach(order => {
        // Save order status
        saveDeliveryOrderStatus(order.orderId, order.status)
        // Save order date
        const orderDateKey = `delivery_order_date_${order.orderId}`
        localStorage.setItem(orderDateKey, order.date)
        // Save order details for getOrderDetails function
        const orderDetailsKey = `delivery_order_details_${order.orderId}`
        localStorage.setItem(orderDetailsKey, JSON.stringify({
          orderId: order.orderId,
          items: order.items,
          restaurant: order.restaurant,
          deliveryAddress: order.deliveryAddress,
          paymentMethod: order.paymentMethod,
          deliveryType: "Home Delivery"
        }))
      })
      // Trigger event to refresh
      window.dispatchEvent(new CustomEvent('deliveryOrderStatusUpdated'))
      // Refresh orders after initialization
      setAllOrders(getAllDeliveryOrders())
    }
  }, [])

  // Refresh orders when status updates
  useEffect(() => {
    const refreshOrders = () => {
      setAllOrders(getAllDeliveryOrders())
    }

    refreshOrders()

    window.addEventListener('deliveryOrderStatusUpdated', refreshOrders)
    window.addEventListener('activeOrderUpdated', refreshOrders)
    window.addEventListener('storage', refreshOrders)

    return () => {
      window.removeEventListener('deliveryOrderStatusUpdated', refreshOrders)
      window.removeEventListener('activeOrderUpdated', refreshOrders)
      window.removeEventListener('storage', refreshOrders)
    }
  }, [])

  // Helper function to get order details from activeOrder or localStorage or create default
  const getOrderDetails = (order) => {
    const orderId = order.orderId || order.id
    
    // Try to get from activeOrder first
    const activeOrder = localStorage.getItem('activeOrder')
    if (activeOrder) {
      const activeOrderData = JSON.parse(activeOrder)
      if (activeOrderData.orderId === orderId) {
        return {
          orderId: activeOrderData.orderId,
          items: activeOrderData.items || 1,
          restaurant: activeOrderData.restaurant || "Restaurant",
          deliveryAddress: activeOrderData.deliveryAddress || "Address",
          paymentMethod: activeOrderData.paymentMethod || "COD",
          deliveryType: "Home Delivery",
          amount: 0 // Will be calculated if needed
        }
      }
    }
    
    // Try to get from saved order details
    const orderDetailsKey = `delivery_order_details_${orderId}`
    const savedDetails = localStorage.getItem(orderDetailsKey)
    if (savedDetails) {
      try {
        const details = JSON.parse(savedDetails)
        return {
          orderId: details.orderId || orderId,
          items: details.items || 1,
          restaurant: details.restaurant || "Restaurant",
          deliveryAddress: details.deliveryAddress || "Address",
          paymentMethod: details.paymentMethod || "COD",
          deliveryType: details.deliveryType || "Home Delivery",
          amount: details.amount || 0
        }
      } catch (e) {
        console.error('Error parsing saved order details:', e)
      }
    }
    
    // Default fallback
    return {
      orderId: orderId,
      items: 1,
      restaurant: "Restaurant",
      deliveryAddress: "Address",
      paymentMethod: "COD",
      deliveryType: "Home Delivery",
      amount: 0
    }
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch (e) {
      return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  // Get time ago helper
  const getTimeAgo = (dateString) => {
    if (!dateString) return "Just now"
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      if (diffMins < 1) return "Just now"
      if (diffMins < 60) return `${diffMins} min ago`
      const diffHours = Math.floor(diffMins / 60)
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
      const diffDays = Math.floor(diffHours / 24)
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } catch (e) {
      return "Recently"
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    const normalized = normalizeDeliveryStatus(status)
    if (normalized === DELIVERY_ORDER_STATUS.ACCEPTED) return "bg-blue-500"
    if (normalized === DELIVERY_ORDER_STATUS.PICKED_UP) return "bg-yellow-500"
    if (normalized === DELIVERY_ORDER_STATUS.ON_THE_WAY) return "bg-orange-500"
    if (normalized === DELIVERY_ORDER_STATUS.DELIVERED) return "bg-green-500"
    if (normalized === DELIVERY_ORDER_STATUS.CANCELLED) return "bg-red-500"
    return "bg-gray-500"
  }

  // Get status display text
  const getStatusText = (status) => {
    const normalized = normalizeDeliveryStatus(status)
    if (normalized === DELIVERY_ORDER_STATUS.ACCEPTED) return "Accepted"
    if (normalized === DELIVERY_ORDER_STATUS.PICKED_UP) return "Picked Up"
    if (normalized === DELIVERY_ORDER_STATUS.ON_THE_WAY) return "On the Way"
    if (normalized === DELIVERY_ORDER_STATUS.DELIVERED) return "Delivered"
    if (normalized === DELIVERY_ORDER_STATUS.CANCELLED) return "Cancelled"
    return status
  }

  // Separate running orders (Accepted, Picked Up, On the Way) from history (Delivered, Cancelled)
  const runningOrders = allOrders
    .filter(order => {
      const status = normalizeDeliveryStatus(order.status)
      return status === DELIVERY_ORDER_STATUS.ACCEPTED || 
             status === DELIVERY_ORDER_STATUS.PICKED_UP || 
             status === DELIVERY_ORDER_STATUS.ON_THE_WAY
    })
    .map(order => {
      const details = getOrderDetails(order)
      const orderDateKey = `delivery_order_date_${order.orderId || order.id}`
      const orderDate = localStorage.getItem(orderDateKey)
      
      return {
        id: order.orderId || order.id,
        orderId: order.orderId || order.id,
        ...details,
        status: order.status,
        statusColor: getStatusColor(order.status),
        timeAgo: getTimeAgo(orderDate),
        estimatedTime: "15 min" // Can be calculated if needed
      }
    })

  // Order history (Delivered, Cancelled)
  const orderHistory = allOrders
    .filter(order => {
      const status = normalizeDeliveryStatus(order.status)
      return status === DELIVERY_ORDER_STATUS.DELIVERED || 
             status === DELIVERY_ORDER_STATUS.CANCELLED
    })
    .map(order => {
      const details = getOrderDetails(order)
      const orderDateKey = `delivery_order_date_${order.orderId || order.id}`
      const orderDate = localStorage.getItem(orderDateKey)
      
      return {
        id: order.orderId || order.id,
        orderId: order.orderId || order.id,
        date: formatDate(orderDate),
        time: formatTime(orderDate),
        ...details,
        status: order.status
      }
    })
    .sort((a, b) => {
      // Sort by date, newest first
      const orderDateKeyA = `delivery_order_date_${a.orderId || a.id}`
      const orderDateKeyB = `delivery_order_date_${b.orderId || b.id}`
      const dateStrA = localStorage.getItem(orderDateKeyA)
      const dateStrB = localStorage.getItem(orderDateKeyB)
      
      if (!dateStrA && !dateStrB) return 0
      if (!dateStrA) return 1
      if (!dateStrB) return -1
      
      const dateA = new Date(dateStrA)
      const dateB = new Date(dateStrB)
      return dateB - dateA
    })

  // Filter order history
  const filteredOrders = orderHistory.filter(order => {
    return matchesDeliveryFilter(order.status, activeFilter)
  })

  // Calculate filter counts
  const filterCounts = {
    all: orderHistory.length,
    delivered: orderHistory.filter(o => normalizeDeliveryStatus(o.status) === DELIVERY_ORDER_STATUS.DELIVERED).length,
    cancelled: orderHistory.filter(o => normalizeDeliveryStatus(o.status) === DELIVERY_ORDER_STATUS.CANCELLED).length,
    refund: 0 // No refund status yet
  }

  return (
    <div className="min-h-screen bg-gray-100  overflow-x-hidden">
  
      {/* Feed Navbar */}
      <FeedNavbar
        isOnline={isOnline}
        onToggleOnline={() => {
          if (isOnline) {
            goOffline()
          } else {
            goOnline()
          }
        }}
        onEmergencyClick={() => {}}
        onHelpClick={() => {}}
        className=""
      />

      {/* Primary Navigation Tabs */}
      <div className="px-4 py-4 flex gap-3">
        <button
          onClick={() => setActiveTab("runningOrders")}
          className={`relative flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "runningOrders"
              ? "text-white"
              : "bg-white text-gray-900 hover:bg-orange-50"
          }`}
        >
          {activeTab === "runningOrders" && (
            <motion.div
              layoutId="activeMainTab"
              className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">Running Orders</span>
        </button>
        <button
          onClick={() => setActiveTab("orderHistory")}
          className={`relative flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            activeTab === "orderHistory"
              ? "text-white"
              : "bg-white text-gray-900 hover:bg-orange-50"
          }`}
        >
          {activeTab === "orderHistory" && (
            <motion.div
              layoutId="activeMainTab"
              className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative z-10">Order History</span>
        </button>
      </div>

      {/* Secondary Navigation/Filters */}
      {activeTab === "orderHistory" && (
        <div className="px-4 pb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 relative">
            <button
              onClick={() => setActiveFilter("all")}
              className={`relative z-10 py-2 px-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeFilter === "all"
                  ? "text-white"
                  : "bg-white text-gray-900 hover:bg-orange-50"
              }`}
            >
              {activeFilter === "all" && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">All</span>
              <span className={`relative z-10 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                activeFilter === "all" ? "bg-white text-[#ff8100]" : "bg-[#ff8100]/10 text-[#ff8100]"
              }`}>
                {filterCounts.all}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("delivered")}
              className={`relative z-10 py-2 px-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeFilter === "delivered"
                  ? "text-white"
                  : "bg-white text-gray-900 hover:bg-orange-50"
              }`}
            >
              {activeFilter === "delivered" && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Delivered</span>
              <span className={`relative z-10 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                activeFilter === "delivered" ? "bg-white text-[#ff8100]" : "bg-[#ff8100]/10 text-[#ff8100]"
              }`}>
                {filterCounts.delivered}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("cancelled")}
              className={`relative z-10 py-2 px-3 rounded-lg font-medium text-sm whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeFilter === "cancelled"
                  ? "text-white"
                  : "bg-white text-gray-900 hover:bg-orange-50"
              }`}
            >
              {activeFilter === "cancelled" && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Cancelled</span>
              <span className={`relative z-10 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center ${
                activeFilter === "cancelled" ? "bg-white text-[#ff8100]" : "bg-[#ff8100]/10 text-[#ff8100]"
              }`}>
                {filterCounts.cancelled}
              </span>
            </button>
            <button
              onClick={() => setActiveFilter("refund")}
              className={`relative z-10 py-2 px-4 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                activeFilter === "refund"
                  ? "text-white"
                  : "bg-white text-gray-900 hover:bg-orange-50"
              }`}
            >
              {activeFilter === "refund" && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-[#ff8100] rounded-lg z-0"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">Refund</span>
            </button>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="px-4 pb-24 md:pb-6">
        {activeTab === "orderHistory" ? (
          <div>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No orders found in this category</p>
              </div>
            ) : (
              filteredOrders.map((order, index) => {
              // Group orders by date
              const showDate = index === 0 || filteredOrders[index - 1].date !== order.date
              
              return (
                <div key={order.id}>
                  {showDate && (
                    <p className="text-gray-600 text-sm mb-2 mt-4 first:mt-0">{order.date}</p>
                  )}
                  <div 
                    onClick={() => navigate(`/delivery/order/${order.id}`)}
                    className="bg-white rounded-lg p-4 mb-3 cursor-pointer hover:bg-orange-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-gray-900 font-medium text-sm">
                        Order # {order.id} ({order.items} Item{order.items > 1 ? "s" : ""})
                      </p>
                      <span className={`${getStatusColor(order.status)} text-white text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-900 font-medium text-sm">{order.restaurant}</span>
                      </div>
                      <span className="text-gray-600 text-xs">{order.time}</span>
                    </div>
                    <div>
                      <span className="text-blue-600 text-xs">{order.deliveryType}</span>
                    </div>
                  </div>
                </div>
              )
            }))}
          </div>
        ) : (
          <div className="space-y-4">
            {runningOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No running orders</p>
              </div>
            ) : (
              runningOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate(`/delivery/order/${order.orderId}`)}
                className="bg-white rounded-lg p-4 cursor-pointer hover:bg-orange-50 transition-colors shadow-sm"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold text-sm mb-1">
                      Order # {order.orderId} ({order.items} Item{order.items > 1 ? "s" : ""})
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900 font-medium text-sm">{order.restaurant}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`${getStatusColor(order.status)} text-white text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap mb-1 inline-block`}>
                      {getStatusText(order.status)}
                    </span>
                    <p className="text-gray-500 text-xs">{order.timeAgo}</p>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 text-xs flex-1">{order.deliveryAddress}</span>
                </div>

                {/* Payment and Time Info */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-900 font-semibold text-sm">{formatCurrency(order.amount)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-600 text-xs">{order.estimatedTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-600 text-xs font-medium">{order.deliveryType}</span>
                    <p className="text-gray-500 text-xs mt-0.5">{order.paymentMethod}</p>
                  </div>
                </div>
              </motion.div>
            )))}
          </div>
        )}
      </div>

    </div>
  )
}

