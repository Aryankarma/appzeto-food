import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import Lenis from "lenis"
import { 
  ArrowLeft,
  Home,
  ShoppingBag,
  Store,
  Wallet,
  Menu,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Package,
  Star,
  DollarSign,
  Users,
  TrendingUp
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import BottomNavbar from "../components/BottomNavbar"
import MenuOverlay from "../components/MenuOverlay"
import { getTransactionsByType, getTransactionsByStatus } from "../utils/walletState"
import { formatCurrency } from "../utils/currency"

export default function Notifications() {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  // Lenis smooth scrolling
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
  }, [])

  // Get wallet transactions for notifications
  const paymentTransactions = getTransactionsByType("payment").slice(0, 3) // Recent 3 payments
  const withdrawalTransactions = getTransactionsByType("withdrawal")
  const completedWithdrawals = getTransactionsByStatus("Completed").slice(0, 2) // Recent 2 completed

  // Generate notifications from wallet transactions
  const walletNotifications = [
    // Payment notifications
    ...paymentTransactions.map((transaction, index) => ({
      id: `payment-${transaction.id}`,
      type: "payment",
      title: "Payment Received",
      message: `Payment of ${formatCurrency(transaction.amount)} has been received${transaction.orderId ? ` for Order #${transaction.orderId}` : ''}. Funds added to your wallet.`,
      time: transaction.date || "Recently",
      read: index > 0, // Only first one is unread
      icon: DollarSign,
      color: "bg-green-500"
    })),
    // Completed withdrawal notifications
    ...completedWithdrawals.map((transaction) => ({
      id: `withdrawal-${transaction.id}`,
      type: "withdrawal",
      title: "Withdrawal Processed",
      message: `Your withdrawal request of ${formatCurrency(transaction.amount)}${transaction.paymentMethod ? ` via ${transaction.paymentMethod}` : ''} has been processed successfully.`,
      time: transaction.date || "Recently",
      read: true,
      icon: CheckCircle,
      color: "bg-green-500"
    }))
  ]

  // Static notifications (other types)
  const staticNotifications = [
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: `You have received a new order #100162 from John Doe. Amount: ${formatCurrency(3817.17)}`,
      time: "5 minutes ago",
      read: false,
      icon: Package,
      color: "bg-[#ff8100]"
    },
    {
      id: 3,
      type: "review",
      title: "New Review",
      message: "Sarah Johnson left a 5-star review for your restaurant. 'Great food and fast delivery!'",
      time: "2 hours ago",
      read: false,
      icon: Star,
      color: "bg-yellow-500"
    },
    {
      id: 4,
      type: "order",
      title: "Order Cancelled",
      message: "Order #100159 has been cancelled by the customer. Refund processed.",
      time: "3 hours ago",
      read: true,
      icon: Package,
      color: "bg-red-500"
    },
    {
      id: 5,
      type: "stock",
      title: "Low Stock Alert",
      message: "Item 'Chicken Biryani' is running low. Current stock: 5 units remaining.",
      time: "5 hours ago",
      read: true,
      icon: AlertCircle,
      color: "bg-orange-500"
    },
    {
      id: 6,
      type: "analytics",
      title: "Weekly Report",
      message: `Your weekly sales report is ready. Total earnings: ${formatCurrency(203350.00)} (↑15% from last week)`,
      time: "1 day ago",
      read: true,
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      id: 8,
      type: "info",
      title: "Menu Update",
      message: "Your menu has been updated successfully. New items are now live for customers.",
      time: "3 days ago",
      read: true,
      icon: Info,
      color: "bg-blue-500"
    },
    {
      id: 9,
      type: "customer",
      title: "New Customer",
      message: "You have 12 new customers this week. Your restaurant is gaining popularity!",
      time: "4 days ago",
      read: true,
      icon: Users,
      color: "bg-purple-500"
    }
  ]

  // Combine wallet notifications (first) with static notifications
  const notifications = [...walletNotifications, ...staticNotifications]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden pb-24 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-between rounded-b-3xl md:rounded-b-none sticky top-0 z-10">
        <div className="flex items-center gap-3 md:gap-4">
          <button 
            onClick={() => navigate("/restaurant")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <span className="bg-[#ff8100] text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {unreadCount} New
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification, index) => {
              const Icon = notification.icon
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`bg-white shadow-sm border border-gray-100 transition-all cursor-pointer ${
                    !notification.read ? 'border-l-4 border-l-[#ff8100]' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`${notification.color} p-2 rounded-full flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold text-sm md:text-base ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-[#ff8100] rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm md:text-base mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-base md:text-lg">No notifications</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar - Mobile Only */}
      <BottomNavbar onMenuClick={() => setShowMenu(true)} />
      
      {/* Menu Overlay */}
      <MenuOverlay showMenu={showMenu} setShowMenu={setShowMenu} />
    </div>
  )
}

