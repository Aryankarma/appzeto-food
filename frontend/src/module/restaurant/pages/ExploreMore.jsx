import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Lenis from "lenis"
import {
  ArrowLeft,
  Search,
  User,
  Store,
  ChevronRight,
  Info,
  Clock,
  Phone,
  Users,
  Settings,
  Bell,
  Truck,
  Hourglass,
  FileText,
  Star,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Edit,
  IndianRupee,
  Receipt,
  FileCheck,
  Building2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function ExploreMore() {
  const navigate = useNavigate()
  const [rushHourStatus, setRushHourStatus] = useState(false)

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

  // Section data
  const manageOutletItems = [
    { id: 1, label: "Outlet info", icon: Info, route: "/restaurant/details" },
    { id: 2, label: "Outlet timings", icon: Clock, route: "/restaurant/timings" },
    { id: 3, label: "Phone numbers", icon: Phone, route: "/restaurant/phone" },
    { id: 4, label: "Manage staff", icon: Users, route: "/restaurant/staff" },
  ]

  const settingsItems = [
    { id: 1, label: "Settings", icon: Settings, route: "/restaurant/settings" },
    { id: 2, label: "Manage communication", icon: Bell, route: "/restaurant/communication" },
    { id: 3, label: "Delivery settings", icon: Truck, route: "/restaurant/delivery-settings" },
    { id: 4, label: "Rush hour", icon: Hourglass, route: "/restaurant/rush-hour", badge: rushHourStatus ? null : "OFF" },
    { id: 5, label: "Schedule off", icon: Clock, route: "/restaurant/schedule-off" },
  ]

  const ordersItems = [
    { id: 1, label: "Order history", icon: FileText, route: "/restaurant/orders/all" },
    { id: 2, label: "Complaints", icon: Star, route: "/restaurant/complaints" },
    { id: 3, label: "Reviews", icon: MessageSquare, route: "/restaurant/reviews" },
  ]

  const helpItems = [
    { id: 1, label: "Help centre", icon: HelpCircle, route: "/restaurant/help" },
    { id: 2, label: "Learning centre", icon: Lightbulb, route: "/restaurant/learning" },
    { id: 3, label: "Share your feedback", icon: Edit, route: "/restaurant/feedback" },
  ]

  const accountingItems = [
    { id: 1, label: "Payout", icon: IndianRupee, route: "/restaurant/payout" },
    { id: 2, label: "Invoices", icon: Receipt, route: "/restaurant/invoices" },
    { id: 3, label: "Taxes", icon: FileCheck, route: "/restaurant/taxes" },
  ]

  const businessItems = [
    { id: 1, label: "Hyperpure", icon: Building2, route: "/restaurant/hyperpure", customIcon: true },
  ]

  const renderSection = (title, items, delay = 0) => (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="mb-8"
    >
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: delay + 0.05 }}
        className="text-base font-bold text-gray-900 mb-4"
      >
        {title}
      </motion.h2>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, index) => {
          const IconComponent = item.icon
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.25, 
                delay: delay + 0.1 + (index * 0.02),
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (item.route) {
                  navigate(item.route)
                }
              }}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 min-h-[100px]"
            >
              <div className="relative flex items-center justify-center">
                {item.customIcon ? (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <span className="text-base font-bold text-gray-900">hp</span>
                  </div>
                ) : (
                  <IconComponent className="w-6 h-6 text-gray-900" strokeWidth={1.5} />
                )}
                {item.badge && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.15 + (index * 0.02), type: "spring", stiffness: 500 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-xs text-gray-700 text-center leading-tight font-normal">
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className="min-h-screen bg-white overflow-x-hidden"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.25,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Explore more</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => console.log("Search clicked")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={() => navigate("/restaurant/profile/edit")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Restaurant Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3,
            delay: 0.05,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <Card className="bg-white border-gray-200 shadow-sm mb-6 rounded-lg">
            <CardContent className="p-4">
              <button
                onClick={() => navigate("/restaurant/details")}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Store className="w-5 h-5 text-gray-900" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h2 className="text-base font-bold text-gray-900 mb-0.5">
                      Kadhai Chammach Restaurant
                    </h2>
                    <p className="text-sm text-gray-500 truncate">
                      By Pass Road (South)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
              </button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sections */}
        {renderSection("Manage outlet", manageOutletItems, 0.1)}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.2 }}
          className="border-t border-gray-200 my-6"
        />
        {renderSection("Settings", settingsItems, 0.15)}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
          className="border-t border-gray-200 my-6"
        />
        {renderSection("Orders", ordersItems, 0.2)}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.2 }}
          className="border-t border-gray-200 my-6"
        />
        {renderSection("Help", helpItems, 0.25)}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
          className="border-t border-gray-200 my-6"
        />
        {renderSection("Accounting", accountingItems, 0.3)}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.2 }}
          className="border-t border-gray-200 my-6"
        />
        {renderSection("Business", businessItems, 0.35)}
      </div>
    </motion.div>
  )
}
