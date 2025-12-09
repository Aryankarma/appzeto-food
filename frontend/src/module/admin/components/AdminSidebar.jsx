import { useState, useEffect, useMemo } from "react"
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
import { Input } from "@/components/ui/input"
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
  const [searchQuery, setSearchQuery] = useState("")

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

  // Filter menu items based on search query
  const filteredMenuData = useMemo(() => {
    if (!searchQuery.trim()) {
      return sidebarMenuData
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = []

    sidebarMenuData.forEach((item) => {
      if (item.type === "link") {
        if (item.label.toLowerCase().includes(query)) {
          filtered.push(item)
        }
      } else if (item.type === "section") {
        const filteredItems = []
        
        item.items.forEach((subItem) => {
          if (subItem.type === "link") {
            if (subItem.label.toLowerCase().includes(query)) {
              filteredItems.push(subItem)
            }
          } else if (subItem.type === "expandable") {
            const matchesLabel = subItem.label.toLowerCase().includes(query)
            const matchingSubItems = subItem.subItems?.filter(
              (si) => si.label.toLowerCase().includes(query)
            ) || []
            
            if (matchesLabel || matchingSubItems.length > 0) {
              filteredItems.push({
                ...subItem,
                subItems: matchesLabel ? subItem.subItems : matchingSubItems,
              })
            }
          }
        })

        if (filteredItems.length > 0) {
          filtered.push({
            ...item,
            items: filteredItems,
          })
        }
      }
    })

    return filtered
  }, [searchQuery])

  // Auto-expand sections with matches when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      
      setExpandedSections((prev) => {
        const newExpandedState = { ...prev }
        
        sidebarMenuData.forEach((item) => {
          if (item.type === "section") {
            item.items.forEach((subItem) => {
              if (subItem.type === "expandable") {
                const matchesLabel = subItem.label.toLowerCase().includes(query)
                const hasMatchingSubItems = subItem.subItems?.some(
                  (si) => si.label.toLowerCase().includes(query)
                )
                
                if (matchesLabel || hasMatchingSubItems) {
                  const sectionKey = subItem.label.toLowerCase().replace(/\s+/g, "")
                  newExpandedState[sectionKey] = true
                }
              }
            })
          }
        })
        
        return newExpandedState
      })
    }
  }, [searchQuery])

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
    <>
      <style>{`
        .admin-sidebar-scroll::-webkit-scrollbar {
          width: 2px;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .admin-sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .admin-sidebar-scroll:hover::-webkit-scrollbar {
          width: 3px;
        }
        .admin-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .admin-sidebar-scroll:hover {
          scrollbar-width: thin;
        }
      `}</style>
      <div
        className={`
          admin-sidebar-scroll
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-100 w-4 h-4 z-10" />
          <Input
            type="text"
            placeholder="Search Menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 py-2 bg-[#2a3648] border border-gray-600 rounded-md !text-gray-100 placeholder:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500",
              searchQuery ? "pr-10" : "pr-3"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-100 hover:text-white transition-colors z-10"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        {filteredMenuData.length === 0 && searchQuery.trim() ? (
          <div className="px-4 py-8 text-center">
            <p className="text-[#879DB6] text-sm">No menu items found</p>
            <p className="text-[#879DB6] text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          filteredMenuData.map((item, index) => {
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
          })
        )}
      </nav>
    </div>
    </>
  )
}
