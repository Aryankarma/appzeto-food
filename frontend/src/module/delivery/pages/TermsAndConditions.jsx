import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft,
  Home,
  FileText,
  UtensilsCrossed,
  User
} from "lucide-react"

export default function TermsAndConditions() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this delivery service, you accept and agree to be bound by the terms and provision of this agreement."
    },
    {
      title: "2. Service Description",
      content: "We provide food delivery services connecting customers with restaurants. We act as an intermediary between you and the restaurant."
    },
    {
      title: "3. User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      title: "4. Payment Terms",
      content: "Payment for orders must be made at the time of delivery or through the app. We accept cash, credit cards, and other payment methods as specified."
    },
    {
      title: "5. Delivery Terms",
      content: "Delivery times are estimates and not guaranteed. We are not responsible for delays due to weather, traffic, or other circumstances beyond our control."
    },
    {
      title: "6. Cancellation Policy",
      content: "Orders can be cancelled within 5 minutes of placement. After this time, cancellation may not be possible if the restaurant has started preparation."
    },
    {
      title: "7. Limitation of Liability",
      content: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service."
    },
    {
      title: "8. Changes to Terms",
      content: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms."
    }
  ]

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center gap-4 rounded-b-3xl md:rounded-b-none">
        <button 
          onClick={() => navigate("/delivery/profile")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-lg md:text-xl font-bold text-gray-900">Terms and Conditions</h1>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 py-6 pb-24 md:pb-6">
        <div className="w-full max-w-none">
          <p className="text-gray-600 text-sm md:text-base mb-6">
            Last updated: January 1, 2024
          </p>
          
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h3 className="text-gray-900 font-bold text-base md:text-lg mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
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
            onClick={() => navigate("/delivery/requests")}
            className="flex flex-col items-center gap-1 p-2 text-gray-600 relative"
          >
            <div className="relative">
              <FileText className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                5
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
            className="flex flex-col items-center gap-1 p-2 text-[#ff8100]"
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] text-[#ff8100] font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

