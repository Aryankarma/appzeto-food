import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import Lenis from "lenis"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Home,
  FileText,
  UtensilsCrossed,
  User,
  Edit,
  Settings,
  MessageSquare,
  Wallet,
  Wifi,
  FileText as TermsIcon,
  Shield,
  Trash2,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [onlineStatus, setOnlineStatus] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("delivery_authenticated") === "true"
  })
  const profileRef = useRef(null)
  const statsRef = useRef(null)
  const optionsRef = useRef(null)

  // Listen for authentication state changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("delivery_authenticated") === "true")
    }

    // Check on mount
    checkAuth()

    // Listen for storage changes
    window.addEventListener('storage', checkAuth)
    
    // Custom event for same-tab updates
    window.addEventListener('deliveryAuthChanged', checkAuth)

    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('deliveryAuthChanged', checkAuth)
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

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      // Reset GSAP animations
      if (profileRef.current) {
        gsap.set(profileRef.current, { opacity: 0, y: 30 })
      }
      if (statsRef.current) {
        gsap.set(statsRef.current, { opacity: 0, y: 30 })
      }
      if (optionsRef.current) {
        gsap.set(optionsRef.current, { opacity: 0, y: 30 })
      }

      // GSAP animations
      const tl = gsap.timeline()
      
      if (profileRef.current) {
        tl.to(profileRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        })
      }

      if (statsRef.current) {
        tl.to(statsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
      }

      if (optionsRef.current) {
        tl.to(optionsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.4")
      }
    }, 100)

    return () => {
      lenis.destroy()
      clearTimeout(timeoutId)
    }
  }, [location.pathname, animationKey])

  // Get profile options based on authentication state
  const getProfileOptions = () => {
    const baseOptions = [
      { id: "edit", label: "Edit Profile", icon: Edit },
      { id: "settings", label: "Settings", icon: Settings },
      { id: "conversation", label: "Conversation", icon: MessageSquare },
      { id: "wallet", label: "Wallet", icon: Wallet },
      { id: "terms", label: "Terms and Conditions", icon: TermsIcon },
      { id: "privacy", label: "Privacy Policy", icon: Shield },
      { id: "delete", label: "Delete Account", icon: Trash2, isDestructive: true },
    ]

    if (isAuthenticated) {
      // If authenticated, show logout at the end
      return [
        ...baseOptions,
        { id: "logout", label: "Logout", icon: LogOut, isDestructive: true }
      ]
    } else {
      // If not authenticated, show only login at the top
      return [
        { id: "login", label: "Login", icon: LogIn, route: "/delivery/login" },
        ...baseOptions
      ]
    }
  }

  const profileOptions = getProfileOptions()

  return (
    <div className="min-h-screen bg-[#f6e9dc] overflow-x-hidden">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 md:py-3 flex items-center justify-center rounded-b-3xl md:rounded-b-none">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 pb-24 md:pb-6">
        {/* Profile Information Card */}
        <div
          ref={profileRef}
          className="bg-[#ff8100] rounded-2xl p-4 md:p-6 mb-4 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                alt="Profile"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-1">Jhon Doe</h2>
              <p className="text-white/90 text-sm md:text-base">+8801700000000</p>
            </div>
          </div>
        </div>

        {/* Shift Information */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm md:text-base">
            Shift: <span className="font-semibold">Morning (04:00 AM - 11:59 AM)</span>
          </p>
        </div>

        {/* Statistics Cards */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <Card className="bg-white shadow-md border-0">
            <CardContent className="p-4 text-center py-0 gap-0">
              <p className="text-gray-900 text-3xl md:text-4xl font-bold mb-1">3</p>
              <p className="text-gray-600 text-sm md:text-base">Total Order</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md border-0">
            <CardContent className="p-4 text-center py-0 gap-0">
              <p className="text-gray-900 text-3xl md:text-4xl font-bold mb-1">3</p>
              <p className="text-gray-600 text-sm md:text-base">Complete Delivery</p>
            </CardContent>
          </Card>
        </div>

        {/* Profile Options List */}
        <div
          ref={optionsRef}
          className="space-y-2 md:space-y-3"
        >
          {/* Online Status */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardContent className="px-2 md:px-4 py-1.5 md:py-3 gap-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-gray-100 rounded-full p-1.5 md:p-2">
                    <Wifi className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </div>
                  <span className="text-gray-900 font-medium text-xs md:text-base">Online Status</span>
                </div>
                <Switch
                  checked={onlineStatus}
                  onCheckedChange={setOnlineStatus}
                  className="data-[state=checked]:bg-[#ff8100]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Other Options */}
          {profileOptions.map((option) => {
            const Icon = option.icon
            return (
              <div key={option.id}>
                <Card 
                  onClick={() => {
                    switch(option.id) {
                      case "login":
                        navigate("/delivery/login")
                        break
                      case "signup":
                        navigate("/delivery/signup")
                        break
                      case "edit":
                        navigate("/delivery/profile/edit")
                        break
                      case "settings":
                        navigate("/delivery/profile/settings")
                        break
                      case "conversation":
                        navigate("/delivery/profile/conversation")
                        break
                      case "wallet":
                        navigate("/delivery/account")
                        break
                      case "terms":
                        navigate("/delivery/profile/terms")
                        break
                      case "privacy":
                        navigate("/delivery/profile/privacy")
                        break
                      case "delete":
                        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                          // TODO: Delete account API call
                          console.log("Delete Account confirmed")
                        }
                        break
                      case "logout":
                        if (window.confirm("Are you sure you want to logout?")) {
                          // Clear authentication state
                          localStorage.removeItem("delivery_authenticated")
                          localStorage.removeItem("delivery_user")
                          setIsAuthenticated(false)
                          // Dispatch custom event for same-tab updates
                          window.dispatchEvent(new Event('deliveryAuthChanged'))
                          // Redirect to login
                          navigate("/delivery/login")
                        }
                        break
                      default:
                        if (option.route) {
                          navigate(option.route)
                        } else {
                          console.log(`${option.label} clicked`)
                        }
                    }
                  }}
                  className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <CardContent className="px-2 md:px-4 py-1.5 md:py-3 gap-0">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className={`rounded-full p-1.5 md:p-2 ${option.isDestructive ? 'bg-red-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${option.isDestructive ? 'text-red-600' : 'text-gray-600'}`} />
                      </div>
                      <span className={`font-medium text-xs md:text-base flex-1 ${option.isDestructive ? 'text-red-600' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
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
            onClick={() => {
              if (location.pathname === "/delivery/profile") {
                setAnimationKey(prev => prev + 1)
              } else {
                navigate("/delivery/profile")
              }
            }}
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

