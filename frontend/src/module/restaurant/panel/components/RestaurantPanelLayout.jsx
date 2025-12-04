import { useState } from "react"
import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  CheckSquare,
  Utensils,
  FolderTree,
  Plus,
  Star,
  Megaphone,
  Tag,
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  Wallet,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Tv,
  List,
  Building2,
  Camera,
  Clock,
  Briefcase,
  FileText,
  Receipt,
  Home,
  Crown,
  QrCode,
  Users,
  UserCog,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { promoIcon } from "@/constants/restaurantIcons"

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/restaurant-panel/dashboard",
  },
  {
    id: "pos",
    label: "Point Of Sale",
    icon: ShoppingBag,
    path: "/restaurant-panel/pos",
  },
  {
    id: "divider-orders",
    label: "ORDER MANAGEMENT",
    type: "divider",
  },
  {
    id: "regular-orders",
    label: "Regular Orders",
    icon: ShoppingCart,
    path: "/restaurant-panel/orders",
  },
  {
    id: "subscription-orders",
    label: "Subscription Orders",
    icon: CheckSquare,
    path: "/restaurant-panel/subscription-orders",
  },
  {
    id: "divider-food",
    label: "FOOD MANAGEMENT",
    type: "divider",
  },
  {
    id: "foods",
    label: "Foods",
    icon: Utensils,
    path: "/restaurant-panel/foods",
  },
  {
    id: "categories",
    label: "Categories",
    icon: FolderTree,
    path: "/restaurant-panel/categories",
  },
  {
    id: "addons",
    label: "Addons",
    icon: Plus,
    path: "/restaurant-panel/addons",
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    path: "/restaurant-panel/reviews",
  },
  {
    id: "divider-promotions",
    label: "PROMOTIONS MANAGEMENT",
    type: "divider",
  },
  {
    id: "campaign",
    label: "Campaign",
    icon: Megaphone,
    path: "/restaurant-panel/campaign",
  },
  {
    id: "coupons",
    label: "Coupons",
    icon: Tag,
    path: "/restaurant-panel/coupons",
  },
  {
    id: "divider-help",
    label: "HELP & SUPPORT",
    type: "divider",
  },
  {
    id: "chat",
    label: "Chat",
    icon: MessageCircle,
    path: "/restaurant-panel/chat",
  },
  {
    id: "divider-ads",
    label: "ADS MANAGEMENT",
    type: "divider",
  },
  {
    id: "new-ads",
    label: "New Ads",
    icon: Tv,
    path: "/restaurant-panel/new-ads",
  },
  {
    id: "ads-list",
    label: "Ads List",
    icon: List,
    path: "/restaurant-panel/ads-list",
  },
  {
    id: "divider-wallet",
    label: "WALLET MANAGEMENT",
    type: "divider",
  },
  {
    id: "my-wallet",
    label: "My Wallet",
    icon: Wallet,
    path: "/restaurant-panel/my-wallet",
  },
  {
    id: "wallet-method",
    label: "Wallet Method",
    icon: Building2,
    path: "/restaurant-panel/wallet-method",
  },
  {
    id: "divider-reports",
    label: "REPORTS",
    type: "divider",
  },
  {
    id: "expense-report",
    label: "Expense Report",
    icon: Camera,
    path: "/restaurant-panel/expense-report",
  },
  {
    id: "transaction",
    label: "Transaction",
    icon: Clock,
    path: "/restaurant-panel/transaction",
  },
  {
    id: "disbursement-report",
    label: "Disbursement Report",
    icon: Briefcase,
    path: "/restaurant-panel/disbursement-report",
  },
  {
    id: "order-report",
    label: "Order Report",
    icon: User,
    path: "/restaurant-panel/order-report",
  },
  {
    id: "food-report",
    label: "Food Report",
    icon: Utensils,
    path: "/restaurant-panel/food-report",
  },
  {
    id: "tax-report",
    label: "Tax Report",
    icon: Receipt,
    path: "/restaurant-panel/tax-report",
  },
  {
    id: "divider-business",
    label: "BUSINESS MANAGEMENT",
    type: "divider",
  },
  {
    id: "my-restaurant",
    label: "My Restaurant",
    icon: Home,
    path: "/restaurant-panel/my-restaurant",
  },
  {
    id: "restaurant-config",
    label: "Restaurant Config",
    icon: Settings,
    path: "/restaurant-panel/restaurant-config",
  },
  {
    id: "my-business-plan",
    label: "My Business Plan",
    icon: Crown,
    path: "/restaurant-panel/my-business-plan",
  },
  {
    id: "my-qr-code",
    label: "My Qr Code",
    icon: QrCode,
    path: "/restaurant-panel/my-qr-code",
  },
  {
    id: "notification-setup",
    label: "Notification Setup",
    icon: Bell,
    path: "/restaurant-panel/notification-setup",
  },
  {
    id: "divider-employee",
    label: "EMPLOYEE MANAGEMENT",
    type: "divider",
  },
  {
    id: "employee-role",
    label: "Employee Role",
    icon: UserCog,
    path: "/restaurant-panel/employee-role",
  },
  {
    id: "all-employee",
    label: "All Employee",
    icon: Users,
    path: "/restaurant-panel/all-employee",
  },
]

// Regular Orders sub-categories with counts
const regularOrderStatuses = [
  { label: "All", count: 67, color: "text-blue-400" },
  { label: "Pending", count: 35, color: "text-green-400" },
  { label: "Confirmed", count: 2, color: "text-green-400" },
  { label: "Accepted", count: 1, color: "text-green-400" },
  { label: "Cooking", count: 0, color: "text-gray-400" },
  { label: "Ready For Delivery", count: 1, color: "text-blue-400" },
  { label: "Food On The Way", count: 1, color: "text-blue-400" },
  { label: "Delivered", count: 25, color: "text-green-400" },
  { label: "Dine In", count: 0, color: "text-gray-400" },
  { label: "Refunded", count: 0, color: "text-red-400", pill: true },
  { label: "Refund Requested", count: 2, color: "text-red-400", pill: true },
  { label: "Scheduled", count: 1, color: "text-blue-400" },
  { label: "Payment Failed", count: 0, color: "text-gray-400" },
  { label: "Canceled", count: 4, color: "text-green-400" },
]

// Foods sub-menu items
const foodsSubMenu = [
  { label: "Add New", path: "/restaurant-panel/foods/add" },
  { label: "List", path: "/restaurant-panel/foods" },
  { label: "Bulk Import", path: "/restaurant-panel/foods/bulk-import" },
  { label: "Bulk Export", path: "/restaurant-panel/foods/bulk-export" },
]

// Categories sub-menu items
const categoriesSubMenu = [
  { label: "Category", path: "/restaurant-panel/categories" },
  { label: "Sub Category", path: "/restaurant-panel/categories/sub-category" },
]

// Campaign sub-menu items
const campaignSubMenu = [
  { label: "Basic Campaign", path: "/restaurant-panel/campaign/basic" },
  { label: "Food Campaign", path: "/restaurant-panel/campaign/food" },
]

// Ads List sub-menu items
const adsListSubMenu = [
  { label: "Pending", path: "/restaurant-panel/ads-list/pending" },
  { label: "List", path: "/restaurant-panel/ads-list" },
]

// Order Report sub-menu items
const orderReportSubMenu = [
  { label: "Regular Order Report", path: "/restaurant-panel/order-report/regular" },
  { label: "Campaign Order Report", path: "/restaurant-panel/order-report/campaign" },
]

// All Employee sub-menu items
const allEmployeeSubMenu = [
  { label: "Add New Employee", path: "/restaurant-panel/all-employee/add" },
  { label: "List", path: "/restaurant-panel/all-employee" },
]

export default function RestaurantPanelLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [regularOrdersExpanded, setRegularOrdersExpanded] = useState(true)
  const [foodsExpanded, setFoodsExpanded] = useState(true)
  const [categoriesExpanded, setCategoriesExpanded] = useState(true)
  const [campaignExpanded, setCampaignExpanded] = useState(false)
  const [adsListExpanded, setAdsListExpanded] = useState(false)
  const [orderReportExpanded, setOrderReportExpanded] = useState(false)
  const [allEmployeeExpanded, setAllEmployeeExpanded] = useState(false)

  const handleLogout = () => {
    navigate("/restaurant/auth/sign-in")
  }

  const isActive = (path) => {
    const currentPath = location.pathname
    // Remove trailing slash for comparison
    const normalizedPath = path.replace(/\/$/, "")
    const normalizedCurrent = currentPath.replace(/\/$/, "")
    return normalizedCurrent === normalizedPath || normalizedCurrent.startsWith(normalizedPath + "/")
  }

  const getPageTitle = () => {
    const path = location.pathname
    if (path.includes("/dashboard")) return "Dashboard"
    if (path.includes("/pos")) return "Point Of Sale"
    if (path.includes("/orders") && !path.includes("/subscription")) return "Regular Orders"
    if (path.includes("/subscription-orders")) return "Subscription Orders"
    if (path.includes("/foods")) return "Foods"
    if (path.includes("/categories") && !path.includes("/sub-category")) return "Category List"
    if (path.includes("/categories/sub-category")) return "Sub Category List"
    if (path.includes("/addons")) return "Addons"
    if (path.includes("/reviews")) return "Customers Reviews"
    if (path.includes("/campaign/food")) return "Food Campaign"
    if (path.includes("/campaign/basic")) return "Basic Campaign"
    if (path.includes("/campaign")) return "Campaign"
    if (path.includes("/coupons")) return "Coupons"
    if (path.includes("/ads-list")) return "Ads List"
    if (path.includes("/new-ads")) return "Create Advertisement"
    if (path.includes("/my-wallet")) return "Restaurant Wallet"
    if (path.includes("/wallet-method")) return "Withdraw Method Setup"
    if (path.includes("/expense-report")) return "Expense Report"
    if (path.includes("/transaction")) return "Transaction Report"
    if (path.includes("/disbursement-report")) return "Disbursement Report"
    if (path.includes("/order-report")) return "Order Report"
    if (path.includes("/tax-report")) return "Tax Report"
    if (path.includes("/my-restaurant")) return "Shop Details"
    if (path.includes("/my-business-plan")) return "Hungry Puppets Business Plan"
    if (path.includes("/restaurant-config")) return "Restaurant Setup"
    if (path.includes("/settings")) return "Settings"
    return "Dashboard"
  }

  const getPageIcon = () => {
    const path = location.pathname
    if (path.includes("/dashboard")) return LayoutDashboard
    if (path.includes("/pos")) return ShoppingBag
    if (path.includes("/orders") && !path.includes("/subscription")) return ShoppingCart
    if (path.includes("/subscription-orders")) return CheckSquare
    if (path.includes("/foods")) return Utensils
    if (path.includes("/categories")) return FolderTree
    if (path.includes("/addons")) return Plus
    if (path.includes("/reviews")) return Star
    if (path.includes("/campaign")) return Megaphone
    if (path.includes("/coupons")) return Tag
    if (path.includes("/expense-report")) return FileText
    if (path.includes("/transaction")) return PieChart
    if (path.includes("/disbursement-report")) return Receipt
    if (path.includes("/order-report")) return FileText
    if (path.includes("/tax-report")) return Receipt
    if (path.includes("/my-restaurant")) return Home
    if (path.includes("/my-business-plan")) return Crown
    if (path.includes("/restaurant-config")) return Settings
    return LayoutDashboard
  }

  const PageIcon = getPageIcon()

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#1e293b] text-white transition-all duration-300 ease-in-out flex flex-col overflow-hidden`}
        style={{ willChange: "width" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-lg bg-primary-orange flex items-center justify-center flex-shrink-0">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                sidebarOpen ? "opacity-100 max-w-full" : "opacity-0 max-w-0"
              }`}
            >
              <div className="whitespace-nowrap">
                <div className="text-lg font-bold">Appzeto Food</div>
                <div className="text-xs text-gray-400">Restaurant Panel</div>
              </div>
            </div>
          </div>
          <div
            className={`transition-all duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-gray-700 h-8 w-8"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
          {menuItems.map((item) => {
            if (item.type === "divider") {
              return (
                <div
                  key={item.id}
                  className={`px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider transition-all duration-300 ${
                    sidebarOpen
                      ? "opacity-100 max-h-20"
                      : "opacity-0 max-h-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </div>
              )
            }

            // Handle Regular Orders as expandable section
            if (item.id === "regular-orders") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/orders")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setRegularOrdersExpanded(!regularOrdersExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {regularOrdersExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-categories */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && regularOrdersExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {regularOrderStatuses.map((status) => {
                        // "All" should go to the main orders page, others with status filter
                        const linkPath = status.label === "All" 
                          ? item.path 
                          : `${item.path}?status=${status.label.toLowerCase().replace(/\s+/g, "-")}`
                        
                        const statusParam = searchParams.get("status")
                        const normalizedStatus = status.label.toLowerCase().replace(/\s+/g, "-")
                        const isSubActive = status.label === "All" 
                          ? location.pathname === item.path && !statusParam
                          : statusParam === normalizedStatus
                        
                        return (
                          <Link
                            key={status.label}
                            to={linkPath}
                            className={`flex items-center justify-between px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                              }`}></span>
                              <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{status.label}</span>
                            </div>
                            {status.pill ? (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${status.color} border-red-400 bg-white`}>
                                {status.count}
                              </span>
                            ) : (
                              <span className={`text-xs font-medium ${status.color}`}>
                                {status.count}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle Foods as expandable section
            if (item.id === "foods") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/foods")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setFoodsExpanded(!foodsExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {foodsExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && foodsExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {foodsSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded hover:bg-gray-700 transition-colors group ${
                              isSubActive ? "bg-gray-700" : ""
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-gray-400"></span>
                            <span className="text-sm text-white">{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle Categories as expandable section
            if (item.id === "categories") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/categories")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {categoriesExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && categoriesExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {categoriesSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path || 
                          (subItem.label === "Category" && location.pathname === "/restaurant-panel/categories")
                        
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                            }`}></span>
                            <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle Campaign as expandable section
            if (item.id === "campaign") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/campaign")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setCampaignExpanded(!campaignExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {campaignExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && campaignExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {campaignSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                            }`}></span>
                            <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle Ads List as expandable section
            if (item.id === "ads-list") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/ads-list")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setAdsListExpanded(!adsListExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {adsListExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && adsListExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {adsListSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                            }`}></span>
                            <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle Order Report as expandable section
            if (item.id === "order-report") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/order-report")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setOrderReportExpanded(!orderReportExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {orderReportExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && orderReportExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {orderReportSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                            }`}></span>
                            <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            // Handle All Employee as expandable section
            if (item.id === "all-employee") {
              const Icon = item.icon
              const active = isActive(item.path) || location.pathname.startsWith("/restaurant-panel/all-employee")

              return (
                <div key={item.id} className="mb-1">
                  <button
                    onClick={() => setAllEmployeeExpanded(!allEmployeeExpanded)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-primary-orange text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        active ? "bg-white/20" : ""
                      }`}>
                        <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                          sidebarOpen
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div
                      className={`transition-all duration-300 flex-shrink-0 ${
                        sidebarOpen ? "opacity-100" : "opacity-0 w-0"
                      }`}
                    >
                      {allEmployeeExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </button>

                  {/* Sub-menu items */}
                  <div
                    className={`mt-1 ml-4 space-y-1 transition-all duration-300 overflow-hidden ${
                      sidebarOpen && allEmployeeExpanded
                        ? "opacity-100 max-h-96"
                        : "opacity-0 max-h-0"
                    }`}
                  >
                      {allEmployeeSubMenu.map((subItem) => {
                        const isSubActive = location.pathname === subItem.path
                        return (
                          <Link
                            key={subItem.label}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-colors group ${
                              isSubActive ? "bg-primary-orange text-white" : "hover:bg-gray-700"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isSubActive ? "bg-white" : "bg-gray-500 group-hover:bg-gray-400"
                            }`}></span>
                            <span className={`text-sm ${isSubActive ? "text-white" : "text-white"}`}>{subItem.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                </div>
              )
            }

            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                  active
                    ? "bg-primary-orange text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                title={!sidebarOpen ? item.label : ""}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  active ? "bg-white/20" : ""
                }`}>
                  <Icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
                </div>
                <span
                  className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    sidebarOpen
                      ? "opacity-100 max-w-full"
                      : "opacity-0 max-w-0 overflow-hidden"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* Advertisement Card - Inside scrollable nav */}
          <div
            className={`px-2 pb-4 mt-4 transition-all duration-300 overflow-hidden ${
              sidebarOpen ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
            }`}
          >
              <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 relative overflow-hidden">
                {/* Promo Image */}
                <div className="mb-3 flex justify-center">
                  <img
                    src={promoIcon}
                    alt="Promo"
                    className="h-24 w-auto object-contain"
                  />
                </div>
                <div className="text-center mb-3">
                  <div className="text-base font-bold text-gray-900 mb-1">
                    Want To Get Highlighted?
                  </div>
                  <div className="text-xs text-gray-600 leading-relaxed">
                    Create Ads To Get Highlighted On The App And Web Browser
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm font-semibold"
                  onClick={() => navigate("/restaurant-panel/new-ads")}
                >
                  Create Ads
                </Button>
              </div>
            </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Menu Button - Only show when sidebar is collapsed */}
            {!sidebarOpen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-8 w-8 text-gray-600 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search... (Ctrl+K)"
                className="pl-10 pr-4 w-64 h-9 text-sm"
              />
            </div>

            {/* Language */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              En
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
            </Button>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-primary-orange flex items-center justify-center text-white text-sm font-semibold">
                      P
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">Pichart</div>
                    <div className="text-xs text-gray-500">t**********@gmail...</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
                <DropdownMenuItem className="bg-white hover:bg-gray-50">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="bg-white hover:bg-gray-50">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="bg-white hover:bg-gray-50">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="bg-white hover:bg-gray-50 text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

