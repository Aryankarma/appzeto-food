import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { 
  ArrowLeft,
  Home,
  FileText,
  UtensilsCrossed,
  User
} from "lucide-react"

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes your name, email address, phone number, delivery address, and payment information."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you updates, and respond to your inquiries."
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell your personal information. We may share your information with restaurants and delivery partners to fulfill your orders, and with service providers who assist us in operating our platform."
    },
    {
      title: "4. Location Information",
      content: "We collect location information to provide delivery services, estimate delivery times, and improve our services. You can control location permissions through your device settings."
    },
    {
      title: "5. Data Security",
      content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure."
    },
    {
      title: "6. Your Rights",
      content: "You have the right to access, update, or delete your personal information. You can also opt-out of certain communications from us."
    },
    {
      title: "7. Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve user experience."
    },
    {
      title: "8. Children's Privacy",
      content: "Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13."
    },
    {
      title: "9. Changes to This Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."
    },
    {
      title: "10. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@appzetofood.com"
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
        <h1 className="text-lg md:text-xl font-bold text-gray-900">Privacy Policy</h1>
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

