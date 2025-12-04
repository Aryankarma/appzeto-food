import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useParams } from "react-router-dom"
import { 
  ArrowLeft,
  MoreVertical,
  MapPin,
  Phone,
  MessageCircle,
  Wallet,
  ChevronUp,
  Edit,
  ArrowRight,
  Download,
  Printer,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BottomNavbar from "../components/BottomNavbar"
import MenuOverlay from "../components/MenuOverlay"
import { addOrderPayment, getOrderPaymentStatus } from "../utils/walletState"
import { formatCurrency, usdToInr } from "../utils/currency"

export default function OrderDetails() {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [isItemExpanded, setIsItemExpanded] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  
  // Load status from localStorage or default to "Pending"
  const getInitialStatus = () => {
    if (orderId) {
      const savedStatus = localStorage.getItem(`order_status_${orderId}`)
      return savedStatus || "Pending"
    }
    return "Pending"
  }
  
  const [orderStatus, setOrderStatus] = useState(getInitialStatus) // Pending -> Confirmed -> Cooking -> Ready to handover
  const [showStatusBanner, setShowStatusBanner] = useState(false)
  const [showHandoverMessage, setShowHandoverMessage] = useState(false)
  
  // Save status to localStorage whenever it changes
  useEffect(() => {
    if (orderId && orderStatus) {
      localStorage.setItem(`order_status_${orderId}`, orderStatus)
      // Dispatch custom event to notify other components (like RestaurantHome)
      window.dispatchEvent(new CustomEvent('orderStatusUpdated'))
    }
  }, [orderStatus, orderId])
  const [showSwipeModal, setShowSwipeModal] = useState(false)
  const [processingTime, setProcessingTime] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [showInvoiceMenu, setShowInvoiceMenu] = useState(false)
  const invoiceMenuRef = useRef(null)
  
  // Close invoice menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (invoiceMenuRef.current && !invoiceMenuRef.current.contains(event.target)) {
        setShowInvoiceMenu(false)
      }
    }

    if (showInvoiceMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [showInvoiceMenu])
  
  // Swipe gesture handlers
  const cancelButtonRef = useRef(null)
  const swipeToCookingRef = useRef(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const currentX = useRef(0)
  const swipeJustHappened = useRef(false)
  const isTracking = useRef(false)
  
  const minSwipeDistance = 50 // Minimum distance for a swipe to be detected
  
  const handleStart = (clientX, clientY) => {
    isTracking.current = true
    startX.current = clientX
    startY.current = clientY
    currentX.current = clientX
    swipeJustHappened.current = false
  }
  
  const handleMove = (clientX) => {
    if (!isTracking.current) return
    currentX.current = clientX
  }
  
  const handleEnd = (clientX, clientY) => {
    if (!isTracking.current) {
      startX.current = 0
      startY.current = 0
      currentX.current = 0
      return
    }
    
    const endX = clientX || currentX.current
    const endY = clientY || startY.current
    
    const deltaX = endX - startX.current
    const deltaY = Math.abs(endY - startY.current)
    const absDeltaX = Math.abs(deltaX)
    
    // Check if it's a horizontal swipe (left to right) and not vertical scroll
    if (absDeltaX > minSwipeDistance && absDeltaX > deltaY && deltaX > 0) {
      swipeJustHappened.current = true
      
      // If status is "Confirmed", show modal for first swipe (cooking)
      if (orderStatus === "Confirmed") {
        setShowSwipeModal(true)
      // Calculate processing time based on delivery time
      const timeMatch = orderData.deliveryTime.match(/(\d+)/)
      if (timeMatch) {
        setProcessingTime(timeMatch[1])
        }
      } 
      // If status is "Cooking", directly change to "Ready to handover"
      else if (orderStatus === "Cooking") {
        setOrderStatus("Ready to handover")
        setShowStatusBanner(true)
        setTimeout(() => setShowStatusBanner(false), 2500)
        // Show center message for 2 seconds
        setShowHandoverMessage(true)
        setTimeout(() => setShowHandoverMessage(false), 2000)
      }
      
      // Reset swipe flag after a delay to prevent click
      setTimeout(() => {
        swipeJustHappened.current = false
      }, 500)
    }
    
    // Reset
    isTracking.current = false
    startX.current = 0
    startY.current = 0
    currentX.current = 0
  }
  
  // Touch events
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }
  
  const handleTouchMove = (e) => {
    if (!isTracking.current) return
    const touch = e.touches[0]
    handleMove(touch.clientX)
  }
  
  const handleTouchEnd = (e) => {
    const touch = e.changedTouches?.[0] || e.touches?.[0]
    if (touch) {
      handleEnd(touch.clientX, touch.clientY)
    } else {
      handleEnd(0, 0)
    }
  }
  
  // Mouse events (for desktop testing)
  const handleMouseDown = (e) => {
    handleStart(e.clientX, e.clientY)
  }
  
  const handleMouseMove = (e) => {
    if (isTracking.current) {
      handleMove(e.clientX)
    }
  }
  
  const handleMouseUp = (e) => {
    handleEnd(e.clientX, e.clientY)
  }
  
  // Pointer events (fallback)
  const handlePointerDown = (e) => {
    handleStart(e.clientX, e.clientY)
  }
  
  const handlePointerMove = (e) => {
    if (isTracking.current) {
      handleMove(e.clientX)
    }
  }
  
  const handlePointerUp = (e) => {
    handleEnd(e.clientX, e.clientY)
  }
  
  const handlePointerCancel = () => {
    isTracking.current = false
    startX.current = 0
    startY.current = 0
    currentX.current = 0
  }

  // Get payment status from wallet (with state to refresh on wallet updates)
  const [paymentStatus, setPaymentStatus] = useState(() => getOrderPaymentStatus(orderId || "100139"))
  
  // Refresh payment status when wallet updates
  useEffect(() => {
    const refreshPaymentStatus = () => {
      setPaymentStatus(getOrderPaymentStatus(orderId || "100139"))
    }
    
    refreshPaymentStatus()
    window.addEventListener('walletStateUpdated', refreshPaymentStatus)
    
    return () => {
      window.removeEventListener('walletStateUpdated', refreshPaymentStatus)
    }
  }, [orderId])
  
  // Order data matching the image exactly
  const orderData = {
    id: orderId || "100139",
    status: "Pending",
    deliveryTime: "1 - 5 Min",
    generalInfo: {
      orderDate: "04/06/2023, 11:39 AM",
      orderType: "Delivery",
      paymentStatus: "Cash On Delivery",
      itemStatus: "Pending",
      itemsCount: 1,
      cutlery: "No"
    },
    item: {
      name: "Medu Vada",
      price: 95.00,
      quantity: 1,
      variation: "Capacity (1 Person)",
      type: "Veg"
    },
    delivery: {
      recipientName: "Jvjggjjh Fjkhggh",
      phone: "+8801733774499",
      address: "593 Avenue 5, Dhaka, Bangladesh"
    },
    customer: {
      name: "Jvjggjjh Fjkhggh",
      address: "593 Avenue 5, Dhaka, Banglade...",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    payment: {
      status: paymentStatus,
      method: "Cash On Delivery"
    },
    billing: {
      itemPrice: 95.00,
      addons: 0.00,
      subtotal: 95.00,
      discount: 0.00,
      vatTax: 4.75,
      deliveryManTips: 0.00,
      deliveryFee: 687.16,
      total: 786.91
    }
  }

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden pb-24 md:pb-6">
      {/* Header - Fixed */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none fixed top-0 left-0 right-0 z-50">
        <button 
          onClick={() => navigate("/restaurant/orders")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 text-center">
          <p className="text-gray-900 font-medium">Order # {orderData.id}</p>
          <p className="text-[#ff8100] text-sm font-medium">Order is {orderStatus}</p>
        </div>
        <div className="relative" ref={invoiceMenuRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation()
              setShowInvoiceMenu(!showInvoiceMenu)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
          
          {/* Invoice Context Menu */}
          <AnimatePresence>
            {showInvoiceMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[180px]"
              >
                {[
                  { icon: Download, label: "Download Invoice", action: () => {
                    console.log("Download invoice for order:", orderData.id)
                    // TODO: Implement download invoice functionality
                    setShowInvoiceMenu(false)
                  }},
                  { icon: Printer, label: "Print Invoice", action: () => {
                    console.log("Print invoice for order:", orderData.id)
                    // TODO: Implement print invoice functionality
                    window.print()
                    setShowInvoiceMenu(false)
                  }}
                ].map((option, idx) => {
                  const IconComponent = option.icon
                  return (
                    <motion.button
                      key={option.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        option.action()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{option.label}</span>
                    </motion.button>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-16"></div>

      {/* Delivery Illustration */}
      <div className="px-4 py-4 bg-transparent">
        <div className="flex items-center justify-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-[#ff8100]" />
          <div className="relative">
            {/* Delivery Person Illustration */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  🛵
                </div>
              </div>
            </div>
          </div>
          <MapPin className="w-5 h-5 text-[#ff8100]" />
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-1">Food need to delivered within</p>
          <p className="text-green-600 font-bold text-lg">{orderData.deliveryTime}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-3 space-y-3">
        <AnimatePresence>
          {showStatusBanner && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#ecfdf3] border border-[#bbf7d0] text-[#166534] text-sm rounded-lg px-3 py-2 shadow-sm flex items-center justify-center"
            >
              <div className="text-center">
                Order status changed to <span className="font-semibold">
                  {orderStatus === "Cooking" ? "Cooking" : orderStatus === "Ready to handover" ? "Ready to handover" : "Confirmed"}
                </span>.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* General Info */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 py-3">
            <h3 className="text-gray-900 font-semibold mb-3 text-base">General Info</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Order date</span>
                <span className="text-gray-900 font-medium text-sm">{orderData.generalInfo.orderDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Order Type</span>
                <span className="text-gray-900 font-medium text-sm">{orderData.generalInfo.orderType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Payment Status</span>
                <span className="bg-orange-100 text-[#ff8100] text-xs font-medium px-2.5 py-1 rounded">
                  {orderData.generalInfo.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Item:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-900 font-medium text-sm">{orderData.generalInfo.itemsCount}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium text-sm">{orderData.generalInfo.itemStatus}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Cutlery:</span>
                <span className="text-gray-900 font-medium text-sm">{orderData.generalInfo.cutlery}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Info */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900 font-semibold text-base">Item Info</h3>
                <span className="bg-[#ff8100] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {orderData.generalInfo.itemsCount}
                </span>
              </div>
              <button
                onClick={() => setIsItemExpanded(!isItemExpanded)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <ChevronUp className={`w-4 h-4 text-gray-600 transition-transform ${isItemExpanded ? '' : 'rotate-180'}`} />
              </button>
            </div>
            {isItemExpanded && (
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span>
                      <span className="text-gray-900 font-medium text-sm">{orderData.item.name}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">Variations: {orderData.item.variation}</p>
                    <p className="text-[#ff8100] font-semibold text-sm">{formatCurrency(orderData.item.price)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#ff8100] font-medium text-sm">Qty: {orderData.item.quantity}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 pt-2 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold text-base md:text-lg">Delivery Information</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-medium text-sm">{orderData.delivery.recipientName}</span>
                <span className="text-gray-600 text-sm">({orderData.delivery.phone})</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{orderData.delivery.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 pt-2 pb-4">
            <h3 className="text-gray-900 font-semibold mb-3 text-base md:text-lg">Customer Details</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xl">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium mb-1">{orderData.customer.name}</p>
                <p className="text-gray-600 text-sm">{orderData.customer.address}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => window.open(`tel:${orderData.delivery.phone}`, '_self')}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-5 h-5 text-white" />
                </button>
                <button 
                  onClick={() => {
                    // TODO: Open chat
                    console.log("Chat with customer clicked")
                  }}
                  className="w-10 h-10 rounded-full bg-[#ff8100] flex items-center justify-center hover:bg-[#e67300] transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 pt-2 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold text-base md:text-lg">Payment Method</h3>
              <span className="text-red-600 font-medium text-sm">{orderData.payment.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-gray-900 font-medium">{orderData.payment.method}</span>
            </div>
          </CardContent>
        </Card>

        {/* Billing Info */}
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardContent className="px-4 pt-2 pb-4 space-y-2">
            <h3 className="text-gray-900 font-semibold mb-3 text-base md:text-lg">Billing Info</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Item Price</span>
              <span className="text-gray-900 font-medium">{formatCurrency(orderData.billing.itemPrice)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Addons</span>
              <span className="text-gray-900 font-medium">(+) {formatCurrency(orderData.billing.addons)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-semibold">Subtotal</span>
              <span className="text-gray-900 font-bold">{formatCurrency(orderData.billing.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Discount</span>
              <span className="text-green-600 font-medium">(-) {formatCurrency(orderData.billing.discount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Vat/Tax</span>
              <span className="text-gray-900 font-medium">(+) {formatCurrency(orderData.billing.vatTax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Delivery man tips</span>
              <span className="text-gray-900 font-medium">(+) {formatCurrency(orderData.billing.deliveryManTips)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Delivery Fee</span>
              <span className="text-gray-900 font-medium">(+) {formatCurrency(orderData.billing.deliveryFee)}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300 mt-2">
              <span className="text-[#ff8100] font-bold text-lg">Total Amount</span>
              <span className="text-[#ff8100] font-bold text-xl">{formatCurrency(orderData.billing.total)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowConfirmModal(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full px-5 py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                Confirm this order?
              </h3>
              <p className="text-sm text-gray-600 mb-6 text-center">
                Are you sure you want to confirm Order #{orderData.id}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#ff8100] hover:bg-[#e67300] text-white"
                  onClick={() => {
                    console.log("Order confirmed from modal")
                    setShowConfirmModal(false)
                    setOrderStatus("Confirmed")
                    setShowStatusBanner(true)
                    setTimeout(() => setShowStatusBanner(false), 2500)
                    
                    // Add payment to wallet if payment method is Cash on Delivery
                    // (Payment is received when order is confirmed for COD)
                    // Amount is already in INR (converted in orderData.billing.total)
                    if (orderData.payment.method === "Cash On Delivery" && orderData.payment.status === "Unpaid") {
                      addOrderPayment(
                        orderData.billing.total,
                        orderData.id,
                        `Payment received for Order #${orderData.id}`
                      )
                    }
                  }}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Confirmation Modal */}
      <AnimatePresence>
        {showSwipeModal && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => {
                setShowSwipeModal(false)
                setInputValue("")
              }}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full px-5 py-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Are you sure to confirm?
              </h3>
              
              {/* Processing Time */}
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Processing Time</p>
                <p className="text-[#ff8100] font-bold text-lg">
                  {processingTime} minutes
                </p>
              </div>

              {/* Input Box */}
              <div className="mb-6">
                <Input
                  type="text"
                  placeholder="Enter confirmation details..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg border-0"
                  onClick={() => {
                    setShowSwipeModal(false)
                    setInputValue("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold py-3 rounded-lg"
                  onClick={() => {
                    console.log("Order confirmed from swipe modal", { inputValue, processingTime })
                    setShowSwipeModal(false)
                    setInputValue("")
                    setOrderStatus("Cooking")
                    setShowStatusBanner(true)
                    setTimeout(() => setShowStatusBanner(false), 2500)
                  }}
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action + Swipe to cooking - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50 md:relative md:border-t-0 md:px-4 md:py-4 md:mt-6">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Total Amount - Separate div */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 px-4 py-2">
            <div className="flex items-center justify-between">
              <p className="text-gray-500 text-xs">Total Amount</p>
              <p className="text-[#ff8100] font-bold text-lg">
                {formatCurrency(orderData.billing.total)}
              </p>
            </div>
          </div>

          {/* Swipe to cooking - Show when Confirmed */}
          {orderStatus === "Confirmed" && (
            <div 
              ref={swipeToCookingRef}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleTouchStart(e)
              }}
              onTouchMove={(e) => {
                e.stopPropagation()
                handleTouchMove(e)
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                handleTouchEnd(e)
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e)
              }}
              onMouseMove={(e) => {
                if (isTracking.current) {
                  e.stopPropagation()
                  handleMouseMove(e)
                }
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                handleMouseUp(e)
              }}
              onMouseLeave={() => {
                handlePointerCancel()
              }}
              className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 cursor-grab active:cursor-grabbing select-none"
              style={{ 
                touchAction: 'pan-x pan-y', 
                WebkitUserSelect: 'none', 
                userSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6 text-[#ff8100]" />
                </motion.div>
                <span className="text-gray-700 text-base font-medium">
                  Swipe to cooking
                </span>
              </div>
            </div>
          )}

          {/* Swipe if ready to handover - Show when Cooking */}
          {orderStatus === "Cooking" && (
            <div 
              ref={swipeToCookingRef}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleTouchStart(e)
              }}
              onTouchMove={(e) => {
                e.stopPropagation()
                handleTouchMove(e)
              }}
              onTouchEnd={(e) => {
                e.stopPropagation()
                handleTouchEnd(e)
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleMouseDown(e)
              }}
              onMouseMove={(e) => {
                if (isTracking.current) {
                  e.stopPropagation()
                  handleMouseMove(e)
                }
              }}
              onMouseUp={(e) => {
                e.stopPropagation()
                handleMouseUp(e)
              }}
              onMouseLeave={() => {
                handlePointerCancel()
              }}
              className="bg-white rounded-xl shadow-md border border-gray-100 px-6 py-4 cursor-grab active:cursor-grabbing select-none"
              style={{ 
                touchAction: 'pan-x pan-y', 
                WebkitUserSelect: 'none', 
                userSelect: 'none',
                WebkitTouchCallout: 'none'
              }}
            >
              <div className="flex items-center justify-between">
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  <ArrowRight className="w-6 h-6 text-[#ff8100]" />
                </motion.div>
                <span className="text-gray-700 text-base font-medium">
                  Swipe if it is ready to handover
                </span>
              </div>
            </div>
          )}

          {/* Buttons (hide after confirmation) */}
          {orderStatus === "Pending" && (
            <div className="flex gap-3">
              <Button
                ref={cancelButtonRef}
                onTouchStart={(e) => {
                  e.stopPropagation()
                  handleTouchStart(e)
                }}
                onTouchMove={(e) => {
                  e.stopPropagation()
                  handleTouchMove(e)
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation()
                  handleTouchEnd(e)
                }}
                onMouseDown={(e) => {
                  e.stopPropagation()
                  handleMouseDown(e)
                }}
                onMouseMove={(e) => {
                  if (isTracking.current) {
                    e.stopPropagation()
                    handleMouseMove(e)
                  }
                }}
                onMouseUp={(e) => {
                  e.stopPropagation()
                  handleMouseUp(e)
                }}
                onMouseLeave={() => {
                  handlePointerCancel()
                }}
                onClick={(e) => {
                  // Prevent click if it was a swipe
                  if (swipeJustHappened.current) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                  }
                  console.log("Cancel order clicked")
                  navigate("/restaurant/orders")
                }}
                variant="outline"
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg border-0 select-none"
                style={{ 
                  touchAction: 'pan-y', 
                  WebkitUserSelect: 'none', 
                  userSelect: 'none',
                  WebkitTouchCallout: 'none'
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Confirm button clicked - open modal")
                  setShowConfirmModal(true)
                }}
                className="flex-1 bg-[#ff8100] hover:bg-[#e67300] text-white font-semibold py-3 rounded-lg"
              >
                Confirm
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Center Screen Message for Ready to Handover */}
      <AnimatePresence>
        {showHandoverMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl px-8 py-6 mx-4 max-w-sm"
            >
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Ready to Handover
                </h3>
                <p className="text-gray-600 text-sm">
                  Order is ready for handover
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
