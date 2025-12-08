import { useEffect, useState } from "react"
import Lenis from "lenis"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Home,
  FileText,
  UtensilsCrossed,
  User,
  ArrowRight,
  Lightbulb,
  HelpCircle,
  Wallet,
  CheckCircle,
  Receipt,
  FileText as FileTextIcon,
  Wallet as WalletIcon,
  Sparkles
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  getDeliveryWalletState, 
  calculateDeliveryBalances,
  calculatePeriodEarnings
} from "../utils/deliveryWalletState"
import { formatCurrency } from "../../restaurant/utils/currency"

export default function OrderRequestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [walletState, setWalletState] = useState(() => getDeliveryWalletState())
  
  // Calculate balances
  const balances = calculateDeliveryBalances(walletState)
  
  // Calculate weekly earnings (17 Nov - 23 Nov)
  const weeklyEarnings = calculatePeriodEarnings(walletState, 'week')
  
  // Pocket balance and cash limit (from image: -₹428.04 and ₹1571.96)
  const pocketBalance = -428.04
  const availableCashLimit = 1571.96
  const depositAmount = Math.abs(pocketBalance) // 428.04
  
  // Customer tips balance
  const customerTipsBalance = 0
  
  // Payout data
  const payoutAmount = 10
  const payoutPeriod = "10 Nov - 16 Nov"

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

    return () => {
      lenis.destroy()
    }
  }, [location.pathname, animationKey])

  // Listen for refresh events from bottom navigation
  useEffect(() => {
    const handleRequestRefresh = () => {
      setAnimationKey(prev => prev + 1)
    }

    window.addEventListener('deliveryRequestRefresh', handleRequestRefresh)

    return () => {
      window.removeEventListener('deliveryRequestRefresh', handleRequestRefresh)
    }
  }, [])
  
  // Get current week date range (17 Nov - 23 Nov format)
  const getCurrentWeekRange = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - dayOfWeek)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    const formatDate = (date) => {
      const day = date.getDate()
      const month = date.toLocaleString('en-US', { month: 'short' })
      return `${day} ${month}`
    }
    
    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`
  }

  return (
    <div className="min-h-screen bg-[#f6e9dc]  overflow-x-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-200 rounded-b-3xl md:rounded-b-none">
        {/* Online Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`relative flex items-center h-8 rounded-full transition-all duration-300 ${
            isOnline ? 'bg-green-500' : 'bg-gray-300'
          }`}
          style={{ width: isOnline ? '80px' : '40px', paddingLeft: isOnline ? '8px' : '4px', paddingRight: isOnline ? '4px' : '4px' }}
        >
          <span className={`text-white text-xs font-medium whitespace-nowrap transition-all duration-300 ${
            isOnline ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'
          }`}>
            Online
          </span>
          <div className="w-6 h-6 rounded-full bg-white shadow-sm shrink-0" />
        </button>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-10 h-10 rounded-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="px-4 py-6 pb-24 md:pb-6">
        {/* Earnings Section */}
        <Card className=" py-0  bg-gray-100 border-0 shadow-none mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black text-sm">Earnings: {getCurrentWeekRange()} →</span>
            </div>
            <div className="text-black text-3xl font-bold">
              ₹{weeklyEarnings.toFixed(0)}
            </div>
          </CardContent>
        </Card>

        {/* Pocket Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <div className="h-px bg-gray-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white px-3">
              <span className="text-black text-xs font-medium">POCKET</span>
            </div>
          </div>
          
          <Card className=" py-0  bg-gray-100 border-0 shadow-none">
            <CardContent className="p-4 space-y-4">
              {/* Pocket Balance */}
              <div className="flex items-center justify-between">
                <span className="text-black text-sm">Pocket balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm font-medium">₹{pocketBalance.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Available Cash Limit */}
              <div className="flex items-center justify-between">
                <span className="text-black text-sm">Available cash limit</span>
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm font-medium">₹{availableCashLimit.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-500 rounded-lg p-3 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-xs font-bold leading-none">!</span>
                </div>
                <p className="text-black text-sm font-medium flex-1">
                  Deposit ₹{depositAmount.toFixed(2)} to avoid getting blocked
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    // TODO: Handle deposit
                    console.log("Deposit clicked")
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 font-medium py-2 rounded-lg"
                >
                  Deposit
                </Button>
                <Button
                  onClick={() => {
                    // TODO: Handle withdraw
                    console.log("Withdraw clicked")
                  }}
                  disabled
                  className="flex-1 bg-gray-100 text-gray-400 border border-gray-300 font-medium py-2 rounded-lg cursor-not-allowed"
                >
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Tips Balance Section */}
        <Card className=" py-0  bg-gray-100 border-0 shadow-none mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-black" />
                <span className="text-black text-sm">Customer tips balance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-black text-sm font-medium">₹{customerTipsBalance.toFixed(0)}</span>
                <ArrowRight className="w-4 h-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Services Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <div className="h-px bg-gray-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-white px-3">
              <span className="text-black text-xs font-medium">MORE SERVICES</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Payout Card */}
            <Card 
              className=" py-0  bg-gray-100 border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/payout")}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="text-black text-2xl font-bold mb-2">₹{payoutAmount}</div>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mb-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div className="text-black text-sm font-medium mb-1">Payout</div>
                <div className="text-gray-600 text-xs">{payoutPeriod}</div>
              </CardContent>
            </Card>

            {/* Customer Tips Statement */}
            <Card 
              className=" py-0  bg-gray-100 border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/tips-statement")}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <Receipt className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Customer tips statement</div>
              </CardContent>
            </Card>

            {/* Deduction Statement */}
            <Card 
              className=" py-0  bg-gray-100 border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/deduction-statement")}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <FileTextIcon className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Deduction statement</div>
              </CardContent>
            </Card>

            {/* Pocket Statement */}
            <Card 
              className=" py-0  bg-gray-100 border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/pocket-statement")}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <WalletIcon className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Pocket statement</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  )
}

