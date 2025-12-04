import {
  Menu,
  Bell,
  Search,
  User,
  MessageCircle,
  ShoppingCart,
  ChevronDown,
  Globe,
  UtensilsCrossed,
  Mail,
} from "lucide-react";

export default function AdminNavbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Logo and Mobile Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          {/* Logo with orange hexagon and burger icon */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-orange-500">Appzeto Food</h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center max-w-md mx-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors w-full">
            <Search className="w-4 h-4 text-gray-600" />
            <span className="text-sm flex-1">Search</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white text-gray-500">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right: Language, Notifications, and User Profile */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
            <Globe className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">En</span>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </div>

          {/* Chat/MessageCircle */}
          <button
            className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            aria-label="Chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>

          {/* Messages/Mail */}
            <button
              className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Messages"
            >
            <Mail className="w-5 h-5" />
            </button>
  
          {/* Shopping Cart with 9+ badge */}
            <button
              className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold px-1">
              9+
              </span>
            </button>
  
            {/* User Profile */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span className="text-2xl">👨</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">Jhon Doe</p>
              <p className="text-xs text-gray-500">a******@admin.com</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
            </div>
          </div>
        </div>
      </header>
    );
  }