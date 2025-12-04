import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState, createContext, useContext } from "react"
import { ProfileProvider } from "../context/ProfileContext"
import Navbar from "./Navbar"
import LocationPrompt from "./LocationPrompt"
import { CartProvider } from "../context/CartContext"
import { OrdersProvider } from "../context/OrdersContext"
import SearchOverlay from "./SearchOverlay"
import LocationSelectorOverlay from "./LocationSelectorOverlay"
import BottomNavigation from "./BottomNavigation"

// Create SearchOverlay context
const SearchOverlayContext = createContext(null)

export function useSearchOverlay() {
  const context = useContext(SearchOverlayContext)
  if (!context) {
    throw new Error("useSearchOverlay must be used within SearchOverlayProvider")
  }
  return context
}

function SearchOverlayProvider({ children }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchValue("")
  }

  return (
    <SearchOverlayContext.Provider value={{ isSearchOpen, searchValue, setSearchValue, openSearch, closeSearch }}>
      {children}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={closeSearch}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </SearchOverlayContext.Provider>
  )
}

// Create LocationSelector context
const LocationSelectorContext = createContext(null)

export function useLocationSelector() {
  const context = useContext(LocationSelectorContext)
  if (!context) {
    throw new Error("useLocationSelector must be used within LocationSelectorProvider")
  }
  return context
}

function LocationSelectorProvider({ children }) {
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false)

  const openLocationSelector = () => {
    setIsLocationSelectorOpen(true)
  }

  const closeLocationSelector = () => {
    setIsLocationSelectorOpen(false)
  }

  return (
    <LocationSelectorContext.Provider value={{ isLocationSelectorOpen, openLocationSelector, closeLocationSelector }}>
      {children}
      <LocationSelectorOverlay
        isOpen={isLocationSelectorOpen}
        onClose={closeLocationSelector}
      />
    </LocationSelectorContext.Provider>
  )
}

export default function UserLayout() {
  const location = useLocation()

  useEffect(() => {
    // Reset scroll to top whenever location changes (pathname, search, or hash)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname, location.search, location.hash])

  // Hide bottom navigation on cart page, checkout, restaurant details, and profile pages
  const hideBottomNav = location.pathname === "/user/cart" || 
                        location.pathname === "/user/cart/checkout" ||
                        location.pathname.startsWith("/user/restaurants/") ||
                        location.pathname.startsWith("/user/profile") ||
                        location.pathname.startsWith("/user/orders") ||
                        location.pathname.startsWith("/user/offers") ||
                        location.pathname.startsWith("/user/gourmet") ||
                        location.pathname.startsWith("/user/top-10") ||
                        location.pathname.startsWith("/user/collections") ||
                        location.pathname.startsWith("/user/gift-card") ||
                        location.pathname.startsWith("/user/help") ||
                        location.pathname.startsWith("/user/notifications") ||
                        location.pathname.startsWith("/user/wallet") ||
                        location.pathname.startsWith("/user/auth")

  return (
    <CartProvider>
      <ProfileProvider>
        <OrdersProvider>
          <SearchOverlayProvider>
            <LocationSelectorProvider>
              {/* <Navbar /> */}
              <LocationPrompt />
              <Outlet />
              {!hideBottomNav && <BottomNavigation />}
            </LocationSelectorProvider>
          </SearchOverlayProvider>
        </OrdersProvider>
      </ProfileProvider>
    </CartProvider>
  )
}

