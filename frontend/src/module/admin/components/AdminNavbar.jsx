import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  User,
  MessageCircle,
  ShoppingCart,
  ChevronDown,
  Globe,
  UtensilsCrossed,
  Mail,
  LogOut,
  Settings,
  FileText,
  Package,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function AdminNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("En");
  const searchInputRef = useRef(null);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Mock search results - replace with actual search logic
  const searchResults = [
    { type: "Order", title: "Order #12345", description: "Pending delivery", icon: Package },
    { type: "User", title: "John Doe", description: "Customer profile", icon: Users },
    { type: "Product", title: "Chicken Biryani", description: "Food item", icon: UtensilsCrossed },
    { type: "Report", title: "Sales Report", description: "Monthly analytics", icon: FileText },
  ].filter((item) =>
    searchQuery.trim() === "" ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const languages = [
    { code: "En", name: "English", flag: "🇬🇧" },
    { code: "Bn", name: "Bengali - বাংলা", flag: "🇧🇩" },
    { code: "Ar", name: "Arabic - العربية", flag: "🇸🇦" },
    { code: "Es", name: "Spanish - español", flag: "🇪🇸" },
    { code: "Hi", name: "Hindi - हिन्दी", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  // Mock data for dropdowns
  const messages = [
    { id: 1, sender: "Sarah Johnson", message: "Order #12345 needs attention", time: "2m ago", unread: true },
    { id: 2, sender: "Mike Chen", message: "New restaurant registration", time: "15m ago", unread: true },
    { id: 3, sender: "Emma Wilson", message: "Payment issue resolved", time: "1h ago", unread: false },
  ];

  const emails = [
    { id: 1, subject: "Weekly Report Ready", from: "reports@appzeto.com", time: "5m ago", unread: true },
    { id: 2, subject: "New Order Notification", from: "orders@appzeto.com", time: "1h ago", unread: true },
    { id: 3, subject: "System Update", from: "admin@appzeto.com", time: "2h ago", unread: false },
  ];

  const cartItems = [
    { id: 1, name: "Chicken Biryani", quantity: 2, price: 450 },
    { id: 2, name: "Butter Naan", quantity: 4, price: 120 },
    { id: 3, name: "Mango Lassi", quantity: 2, price: 100 },
  ];

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors w-full"
            >
              <Search className="w-4 h-4 text-gray-600" />
              <span className="text-sm flex-1 text-left">Search</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white text-gray-500">
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right: Language, Notifications, and User Profile */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{currentLanguage.code}</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                    {lang.code === language && (
                      <CheckCircle2 className="ml-auto w-4 h-4 text-orange-500" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chat/MessageCircle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  {messages.filter((m) => m.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold px-1">
                      {messages.filter((m) => m.unread).length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Messages</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {messages.filter((m) => m.unread).length} new
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {messages.map((msg) => (
                    <DropdownMenuItem
                      key={msg.id}
                      className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{msg.sender}</p>
                            {msg.unread && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{msg.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center cursor-pointer text-orange-500 hover:text-orange-600"
                  onClick={() => navigate("/admin/chattings")}
                >
                  View all conversations
                  <ArrowRight className="ml-2 w-4 h-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages/Mail */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <Mail className="w-5 h-5" />
                  {emails.filter((e) => e.unread).length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold px-1">
                      {emails.filter((e) => e.unread).length}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Emails</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {emails.filter((e) => e.unread).length} new
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {emails.map((email) => (
                    <DropdownMenuItem
                      key={email.id}
                      className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{email.subject}</p>
                            {email.unread && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{email.from}</p>
                          <p className="text-xs text-gray-400 mt-1">{email.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center cursor-pointer text-orange-500 hover:text-orange-600">
                  View all emails
                  <ArrowRight className="ml-2 w-4 h-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shopping Cart with badge */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold px-1">
                      {totalCartItems > 9 ? "9+" : totalCartItems}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Shopping Cart</span>
                  <span className="text-xs text-gray-500 font-normal">
                    {totalCartItems} items
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <div className="p-6 text-center">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <DropdownMenuItem
                          key={item.id}
                          className="flex items-center justify-between p-3 cursor-default hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <div className="p-3 flex items-center justify-between bg-gray-50">
                        <span className="text-sm font-semibold text-gray-900">Total:</span>
                        <span className="text-lg font-bold text-orange-500">₹{totalCartPrice}</span>
                      </div>
                      <DropdownMenuItem className="justify-center cursor-pointer bg-orange-500 text-white hover:bg-orange-600 mt-2 mx-2 rounded-md">
                        Checkout
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </DropdownMenuItem>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-2xl">👨</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">Jhon Doe</p>
                    <p className="text-xs text-gray-500">a******@admin.com</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 hidden md:block" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
              >
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <span className="text-2xl">👨</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Jhon Doe</p>
                      <p className="text-xs text-gray-500">a******@admin.com</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 w-4 h-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 w-4 h-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <FileText className="mr-2 w-4 h-4" />
                    <span>Documentation</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="mr-2 w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl p-0 bg-white opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 transition-opacity duration-200 ease-in-out data-[state=open]:scale-100 data-[state=closed]:scale-100">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Universal Search
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search orders, users, products, reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {searchQuery.trim() === "" ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-500 mb-4">Quick Actions</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Package, label: "Orders", color: "bg-blue-50 text-blue-600" },
                    { icon: Users, label: "Users", color: "bg-green-50 text-green-600" },
                    { icon: UtensilsCrossed, label: "Products", color: "bg-orange-50 text-orange-600" },
                    { icon: FileText, label: "Reports", color: "bg-purple-50 text-purple-600" },
                  ].map((action, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                    >
                      <div className={`p-2 rounded-md ${action.color}`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-400 mb-2">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {["Order #12345", "John Doe", "Chicken Biryani"].map((term, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 mb-3">
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
                    </div>
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        className="w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                      >
                        <div className="p-2 rounded-md bg-gray-100">
                          <result.icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900">{result.title}</p>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                              {result.type}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{result.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}