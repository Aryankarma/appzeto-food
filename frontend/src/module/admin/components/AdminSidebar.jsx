import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  Search,
  FileText,
  Calendar,
  Clock,
  Receipt,
  MapPin,
  Link as LinkIcon,
  UtensilsCrossed,
  Building2,
  FolderTree,
  Plus,
  Utensils,
  Megaphone,
  ChevronDown,
  ChevronRight,
  X,
  LayoutDashboard,
  Gift,
  DollarSign,
  Image,
  Bell,
  MessageSquare,
  Mail,
  Users,
  Wallet,
  Award,
  Truck,
  Package,
  CreditCard,
  Settings,
  UserCog,
  User,
  Globe,
  Palette,
  Camera,
  LogIn,
  Database,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { sidebarMenuData } from "../data/sidebarMenu"

// Icon mapping
const iconMap = {
  LayoutDashboard,
  UtensilsCrossed,
  Building2,
  FileText,
  Calendar,
  Clock,
  Receipt,
  MapPin,
  Link: LinkIcon,
  FolderTree,
  Plus,
  Utensils,
  Megaphone,
  Gift,
  DollarSign,
  Image,
  Bell,
  MessageSquare,
  Mail,
  Users,
  Wallet,
  Award,
  Truck,
  Package,
  CreditCard,
  Settings,
  UserCog,
  User,
  Globe,
  Palette,
  Camera,
  LogIn,
  Database,
  Zap,
}

export default function AdminSidebar({ isOpen = false, onClose }) {
  const location = useLocation()

  // Generate initial expanded state from menu data
  const getInitialExpandedState = () => {
    try {
      const saved = localStorage.getItem('adminSidebarExpanded')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Error loading sidebar state:', e)
    }
    const state = {}
    sidebarMenuData.forEach((item) => {
      if (item.type === "section") {
        item.items.forEach((subItem) => {
          if (subItem.type === "expandable") {
            state[subItem.label.toLowerCase().replace(/\s+/g, "")] = false
          }
        })
      }
    })
    return state
  }

  const [expandedSections, setExpandedSections] = useState(getInitialExpandedState)

  const isActive = (path, allPaths = []) => {
    if (path === "/admin") {
      return location.pathname === path
    }
    
    // For subItems, check if this is the most specific match
    if (allPaths.length > 0) {
      // Sort paths by length (longest first) to find most specific match
      const sortedPaths = [...allPaths].sort((a, b) => b.length - a.length)
      const bestMatch = sortedPaths.find(p => location.pathname.startsWith(p))
      return bestMatch === path
    }
    
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    try {
      localStorage.setItem('adminSidebarExpanded', JSON.stringify(expandedSections))
    } catch (e) {
      console.error('Error saving sidebar state:', e)
    }
  }, [expandedSections])

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderMenuItem = (item, index, isInSection = false) => {
    if (item.type === "link") {
      const Icon = iconMap[item.icon] || Utensils
      return (
        <Link
          key={index}
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 1024 && onClose) {
              onClose()
            }
          }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
            isInSection ? "text-xs font-bold" : "",
            isActive(item.path)
              ? "bg-green-500/20 text-green-400"
              : "text-[#E9F3FF] hover:bg-gray-700/50"
          )}
        >
          <Icon className={cn("flex-shrink-0", isInSection ? "w-4 h-4" : "w-5 h-5")} />
          <span className={isInSection ? "font-bold" : ""}>{item.label}</span>
        </Link>
      )
    }

    if (item.type === "expandable") {
      const Icon = iconMap[item.icon] || Utensils
      const sectionKey = item.label.toLowerCase().replace(/\s+/g, "")
      const isExpanded = expandedSections[sectionKey] || false

      return (
        <div key={index}>
          <button
            onClick={() => toggleSection(sectionKey)}
            className={cn(
              "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
              "text-[#E9F3FF] hover:bg-gray-700/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 flex-shrink-0 text-[#879DB6]" />
            ) : (
              <ChevronRight className="w-4 h-4 flex-shrink-0 text-[#879DB6]" />
            )}
          </button>
          {isExpanded && item.subItems && (
            <div className="ml-4 mt-1 space-y-1">
              {item.subItems.map((subItem, subIndex) => {
                const allSubPaths = item.subItems.map(si => si.path)
                return (
                  <Link
                    key={subIndex}
                    to={subItem.path}
                    onClick={() => {
                      if (window.innerWidth < 1024 && onClose) {
                        onClose()
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-normal",
                      isActive(subItem.path, allSubPaths)
                        ? "bg-green-500/20 text-green-400"
                        : "text-[#E9F3FF] hover:bg-gray-700/50"
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#879DB6] flex-shrink-0"></span>
                    <span>{subItem.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className={`
        w-80 bg-[#334257] border-r border-gray-700 h-screen fixed left-0 top-0 overflow-y-auto z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Header with Logo and Brand */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-orange-500">Appzeto Food</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[#879DB6] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#879DB6] w-4 h-4" />
          <input
            type="text"
            placeholder="Search Menu..."
            className="w-full pl-10 pr-3 py-2 bg-[#2a3648] border border-gray-600 rounded-md text-[#E9F3FF] placeholder-[#879DB6] text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {sidebarMenuData.map((item, index) => {
          if (item.type === "link") {
            return renderMenuItem(item, index)
          }

          if (item.type === "section") {
            return (
              <div key={index} className={index > 0 ? "mt-4" : ""}>
                <div className="px-4 py-2">
                  <span className="text-[#879DB6] font-bold text-xs uppercase">
                    {item.label}
                  </span>
                </div>
                <div className="space-y-1">
                  {item.items.map((subItem, subIndex) => renderMenuItem(subItem, `${index}-${subIndex}`, true))}
                </div>
              </div>
            )
          }

          return null
        })}
      </nav>
    </div>
  )
}
