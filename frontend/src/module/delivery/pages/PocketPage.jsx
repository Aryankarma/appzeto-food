import { useEffect, useRef, useState } from "react"
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
  FuelIcon,
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
import { useGigStore } from "../store/gigStore"
import FeedNavbar from "../components/FeedNavbar"
import AvailableCashLimit from "../components/AvailableCashLimit"
import BottomPopup from "../components/BottomPopup"
import DepositPopup from "../components/DepositPopup"

export default function PocketPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [animationKey, setAnimationKey] = useState(0)
  const [walletState, setWalletState] = useState(() => getDeliveryWalletState())

  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0)
  const carouselRef = useRef(null)
  const carouselStartX = useRef(0)
  const carouselIsSwiping = useRef(false)
  const carouselAutoRotateRef = useRef(null)

  const [showCashLimitPopup, setShowCashLimitPopup] = useState(false)
  const [showDepositPopup, setShowDepositPopup] = useState(false)

  const {
    isOnline,
    bookedGigs,
    goOnline,
    goOffline
  } = useGigStore()

  
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

  // Handle online toggle
  const handleToggleOnline = () => {
    if (isOnline) {
      goOffline()
    } else {
      if (bookedGigs.length === 0) {
        navigate("/delivery/gig")
      } else {
        goOnline()
      }
    }
  }

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
      <FeedNavbar
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        onEmergencyClick={() => { }}
        onHelpClick={() => { }}
        className=""
      />

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

      {/* Main Content */}
      <div className="px-4 py-6 bg-gray-100 pb-24 md:pb-6">
        {/* Earnings Section */}
        <Card onClick={() => navigate("/delivery/earnings")} className="py-4 bg-white border-0 shadow-none mb-4">
          <CardContent className="p-4 text-center">

            {/* Top text */}
            <div className="flex justify-center mb-2">
              <span className="text-black text-sm">
                Earnings: {getCurrentWeekRange()} →
              </span>
            </div>

            {/* Earnings number */}
            <div className="text-black text-3xl font-bold text-center">
              ₹{weeklyEarnings.toFixed(0)}
            </div>

          </CardContent>
        </Card>


        {/* Pocket Section */}
        <div className="my-6 ">
          <div className="relative mb-4 my-4">
            <div className="h-px bg-gray-300"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-100 -top-3 px-3">
              <span className="text-black text-xs font-medium">POCKET</span>
            </div>
          </div>

          <Card className=" py-0  bg-white border-0 shadow-none" >
            <CardContent className="p-4 space-y-4">
              {/* Pocket Balance */}
              <div onClick={() => navigate("/delivery/pocket-balance")} className="flex items-center justify-between">
                <span className="text-black text-sm">Pocket balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm font-medium">₹{pocketBalance.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              <hr />

              {/* Available Cash Limit */}
              <div onClick={()=> setShowCashLimitPopup(true)} className="flex items-center justify-between">
                <span className="text-black text-sm">Available cash limit</span>
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm font-medium">₹{availableCashLimit.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>

              {/* Warning Message */}
              {/* <div className="bg-yellow-500 rounded-lg p-3 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-yellow-500 text-xs font-bold leading-none">!</span>
                </div>
                <p className="text-black text-sm font-medium flex-1">
                  Deposit ₹{depositAmount.toFixed(2)} to avoid getting blocked
                </p>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowDepositPopup(true)}
                  className="flex-1 bg-white hover:bg-gray-300 text-black border  border-black  font-semibold py-3 rounded-lg"
                >
                  Deposit
                </Button>
                <Button
                  disabled
                  className="flex-1 bg-gray-500 text-black/90   font-medium py-3 rounded-lg cursor-not-allowed"
                >
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Tips Balance Section */}
        <Card className=" py-0  bg-white border-0 shadow-none mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div onClick={() => navigate("/delivery/customer-tips-balance")} className="flex items-center gap-3">
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
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-3 bg-gray-100 px-3">
              <span className="text-black text-xs font-medium">MORE SERVICES</span>
            </div>
          </div>

     
          <div className="grid grid-cols-2 gap-4">
            {/* Payout Card */}
            <Card
              className=" py-0  bg-white border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/payout")}
            >
              <CardContent className="p-4 flex flex-col items-start text-start">
                <div className="text-black text-2xl font-bold mb-2">₹{payoutAmount}</div>
                <div className="text-black text-sm font-medium mb-1">Payout</div>
                <div className="text-gray-600 text-xs">{payoutPeriod}</div>
              </CardContent>
            </Card>

            {/* Customer Tips Statement */}
            <Card
              className=" py-0  bg-white border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/tips-statement")}
            >
              <CardContent className="p-4 flex flex-col items-start text-start">
                <div className="w-12 h-12 flex items-start mb-3">
                  <Receipt className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium text-start">Customer tips statement</div>
              </CardContent>
            </Card>

            {/* Deduction Statement */}
            <Card
              className=" py-0  bg-white border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/deduction-statement")}
            >
              <CardContent className="p-4 flex flex-col items-start text-start">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <FileTextIcon className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Deduction statement</div>
              </CardContent>
            </Card>

            {/* Pocket Statement */}
            <Card
              className=" py-0  bg-white border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/pocket-statement")}
            >
              <CardContent className="p-4 flex flex-col items-start text-start">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <WalletIcon className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Pocket statement</div>
              </CardContent>
            </Card>
          
            {/* Fuel Payment */}
            <Card
              className=" py-0  bg-white border-0 shadow-none cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => navigate("/delivery/fuel-payment")}
            >
              <CardContent className="p-4 flex flex-col items-start text-start">
                <div className="w-12 h-12 flex items-center justify-center mb-3">
                  <FuelIcon className="w-8 h-8 text-black" />
                </div>
                <div className="text-black text-sm font-medium">Fuel Payment</div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      <BottomPopup
        isOpen={showCashLimitPopup}
        onClose={() => setShowCashLimitPopup(false)}
        title="Available Cash Limit?"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="60vh"
      >
     <AvailableCashLimit onClose={() => setShowCashLimitPopup(false)}/>
      </BottomPopup>

      <BottomPopup
        isOpen={showDepositPopup}
        onClose={() => setShowDepositPopup(false)}
        title="Deposit"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="50vh"
      >
        <DepositPopup/>
      </BottomPopup>
    </div>
  )
}

