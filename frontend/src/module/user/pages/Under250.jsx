import { Link } from "react-router-dom"
import { useState, useMemo, useCallback } from "react"
import { Star, Clock, MapPin, ArrowDownUp, Timer, ArrowRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AnimatedPage from "../components/AnimatedPage"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocationSelector } from "../components/UserLayout"
import { useLocation } from "../hooks/useLocation"
import { useCart } from "../context/CartContext"
import PageNavbar from "../components/PageNavbar"
import { foodImages } from "@/constants/images"
import appzetoFoodLogo from "@/assets/appzetofoodlogo.jpeg"
import under250Banner from "@/assets/under250banner.png"


const categories = [
  { id: 1, name: "Biryani", image: foodImages[0] },
  { id: 2, name: "Cake", image: foodImages[1] },
  { id: 3, name: "Chhole Bhature", image: foodImages[2] },
  { id: 4, name: "Chicken Tanduri", image: foodImages[3] },
  { id: 5, name: "Donuts", image: foodImages[4] },
  { id: 6, name: "Dosa", image: foodImages[5] },
  { id: 7, name: "French Fries", image: foodImages[6] },
  { id: 8, name: "Idli", image: foodImages[7] },
  { id: 9, name: "Momos", image: foodImages[8] },
  { id: 10, name: "Samosa", image: foodImages[9] },
  { id: 11, name: "Starters", image: foodImages[10] },
  { id: 12, name: "Biryani", image: foodImages[0] }, // Repeat first image
]

const under250Restaurants = [
  {
    id: 1,
    name: "Cafe Mocha",
    rating: 4.4,
    deliveryTime: "12-15 mins",
    distance: "0.4 km",
    cuisine: "Cafe • Continental",
    price: "₹120 for two",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop",
    menuItems: [
      {
        id: 1,
        name: "Butter Khichdi",
        price: 224.16,
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
      {
        id: 2,
        name: "Pav Bhaji",
        price: 200.16,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
      {
        id: 3,
        name: "Masala Dosa",
        price: 180.50,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: false,
      },
    ],
  },
  {
    id: 2,
    name: "Street Food Corner",
    rating: 4.2,
    deliveryTime: "10-12 mins",
    distance: "0.6 km",
    cuisine: "Street Food • Indian",
    price: "₹80 for two",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop",
    menuItems: [
      {
        id: 4,
        name: "Samosa Chaat",
        price: 120.00,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
      {
        id: 5,
        name: "Aloo Tikki",
        price: 95.50,
        image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: false,
      },
      {
        id: 6,
        name: "Chole Bhature",
        price: 150.00,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
    ],
  },
  {
    id: 3,
    name: "Quick Bites",
    rating: 4.3,
    deliveryTime: "15-18 mins",
    distance: "1.2 km",
    cuisine: "Fast Food • Snacks",
    price: "₹150 for two",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop",
    menuItems: [
      {
        id: 7,
        name: "French Fries",
        price: 99.00,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
      {
        id: 8,
        name: "Burger",
        price: 180.00,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop",
        isVeg: false,
        bestPrice: false,
      },
    ],
  },
  {
    id: 4,
    name: "Local Delights",
    rating: 4.1,
    deliveryTime: "18-20 mins",
    distance: "1.5 km",
    cuisine: "North Indian • Vegetarian",
    price: "₹200 for two",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop",
    menuItems: [
      {
        id: 9,
        name: "Dal Makhani",
        price: 220.00,
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
      {
        id: 10,
        name: "Paneer Butter Masala",
        price: 240.00,
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
        isVeg: true,
        bestPrice: true,
      },
    ],
  },
]

export default function Under250() {
  const { location } = useLocation()
  const [activeCategory, setActiveCategory] = useState(null)
  const [showSortPopup, setShowSortPopup] = useState(false)
  const [selectedSort, setSelectedSort] = useState(null)
  const [under30MinsFilter, setUnder30MinsFilter] = useState(false)

  const sortOptions = [
    { id: null, label: 'Relevance' },
    { id: 'rating-high', label: 'Rating: High to Low' },
    { id: 'delivery-time-low', label: 'Delivery Time: Low to High' },
    { id: 'distance-low', label: 'Distance: Low to High' },
  ]

  const handleClearAll = () => {
    setSelectedSort(null)
  }

  const handleApply = () => {
    setShowSortPopup(false)
    // Apply sorting logic here if needed
  }

  return (

    <div className="relative min-h-screen bg-white">
      {/* Banner Section with Navbar */}
      <div className="relative w-full" style={{ height: '30vh' }}>
        {/* Banner Image */}
        <div className="absolute top-0 left-0 right-0 bottom-0 z-0">
          <img
            src={under250Banner}
            alt="Under 250 Banner"
            className="w-screen h-full object-fill"
          />
        </div>

        {/* Navbar */}
        <PageNavbar textColor="black" zIndex={20} showProfile={true} />
      </div>

      {/* Content Section */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-0 pt-2 sm:pt-3">

        <section className="space-y-1 sm:space-y-1.5">
          <div
            className="flex gap-3 sm:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth px-2 sm:px-3 py-2 sm:py-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              touchAction: "pan-x pan-y pinch-zoom",
              overflowY: "hidden",
            }}
          >
            {/* All Button */}
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center gap-2 w-[62px] sm:w-24 md:w-28">
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md transition-all">
                  <img
                    src={foodImages[5]}
                    alt="All"
                    className="w-full h-full object-cover bg-white rounded-full"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = foodImages[0]
                    }}
                  />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 text-center pb-1">
                  All
                </span>
              </div>
            </div>
            {categories.map((category, index) => {
              const isActive = activeCategory === category.id
              return (
                <div key={category.id} className="flex-shrink-0">
                  <Link to={`/user/category/${category.name.toLowerCase()}`}>
                    <div
                      className="flex flex-col items-center gap-2 w-[62px] sm:w-24 md:w-28"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-md transition-all">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover bg-white rounded-full"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = foodImages[0]
                          }}
                        />
                      </div>
                      <span className={`text-xs sm:text-sm md:text-base font-semibold text-gray-800 text-center pb-1 ${isActive ? 'border-b-2 border-green-600' : ''}`}>
                        {category.name.length > 7 ? `${category.name.slice(0, 7)}...` : category.name}
                      </span>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </section>

        <section className="py-2 sm:py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSortPopup(true)}
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-md flex items-center gap-2 whitespace-nowrap flex-shrink-0 font-medium transition-all bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <ArrowDownUp className="h-4 w-4 rotate-90" />
              <span className="text-sm font-medium">
                {selectedSort ? sortOptions.find(opt => opt.id === selectedSort)?.label : 'Sort'}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setUnder30MinsFilter(!under30MinsFilter)}
              className={`h-8 sm:h-9 px-3 sm:px-4 rounded-md flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 font-medium transition-all ${
                under30MinsFilter
                  ? 'bg-green-600 text-white border border-green-600 hover:bg-green-600/90'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm font-medium">Under 30 mins</span>
            </Button>
          </div>
        </section>


        {/* Restaurant Menu Sections */}
        {under250Restaurants.map((restaurant) => {
          const restaurantSlug = restaurant.name.toLowerCase().replace(/\s+/g, "-")
          return (
            <section key={restaurant.id} className="pt-4 sm:pt-6">
              {/* Restaurant Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">{restaurant.deliveryTime}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-green-800 text-white px-1 py-1 rounded-full">
                    <div className="bg-white text-green-700 px-1 py-1 rounded-full">
                    <Star className="h-3.5 w-3.5 fill-green-800 text-green-800" />
                    </div>
                    <span className="text-xs font-bold">{restaurant.rating}</span>
                  </div>
                  <span className="text-xs text-gray-400 mt-0.5">By 24K+</span>
                </div>
              </div>

              {/* Menu Items Horizontal Scroll */}
              {restaurant.menuItems && restaurant.menuItems.length > 0 && (
                <div className="space-y-2">
                  <div
                    className="flex gap-3 sm:gap-4 overflow-x-auto overflow-y-visible scrollbar-hide scroll-smooth pb-2"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      touchAction: "pan-x pan-y pinch-zoom",
                      overflowY: "hidden",
                    }}
                  >
                    {restaurant.menuItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex-shrink-0 w-[200px] sm:w-[220px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {/* Item Image */}
                        <div className="relative w-full h-32 sm:h-36 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop"
                            }}
                          />
                          {/* Veg Indicator */}
                          {item.isVeg && (
                            <div className="absolute top-2 left-2 h-4 w-4 rounded border-2 border-green-600 bg-white flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-green-600" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1">
                            {item.isVeg && (
                              <div className="h-3 w-3 rounded border border-green-600 bg-green-50 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-600" />
                              </div>
                            )}
                            <span className="text-sm font-semibold text-gray-900">
                              1 x {item.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-base font-bold text-gray-900">
                                ₹{Math.round(item.price)}
                              </p>
                              {item.bestPrice && (
                                <p className="text-xs text-gray-500">Best price</p>
                              )}
                            </div>
                            <Button
                              variant={"outline"}
                              size="sm"
                              className="bg-green-600/10 text-green-500 border-green-500 hover:bg-green-700 hover:text-white h-7 px-3 text-xs"
                            >
                              View cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View Full Menu Button */}
                  <Link className="flex justify-center" to={`/user/restaurants/${restaurantSlug}`}>
                    <Button
                      variant="outline"
                      className="w-min align-center text-center rounded-lg mx-auto bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    >
                      View full menu <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Sort Popup - Bottom Sheet */}
      <AnimatePresence>
        {showSortPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowSortPopup(false)}
              className="fixed inset-0 bg-black/50 z-100"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[110] max-h-[60vh] overflow-hidden flex flex-col"
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">Sort By</h2>
                <button
                  onClick={handleClearAll}
                  className="text-green-600 font-medium text-sm"
                >
                  Clear all
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-3">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id || 'relevance'}
                      onClick={() => setSelectedSort(option.id)}
                      className={`px-4 py-3 rounded-xl border text-left transition-colors ${selectedSort === option.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-600'
                        }`}
                    >
                      <span className={`text-sm font-medium ${selectedSort === option.id ? 'text-green-600' : 'text-gray-700'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-4 border-t bg-white">
                <button
                  onClick={() => setShowSortPopup(false)}
                  className="flex-1 py-3 text-center font-semibold text-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={handleApply}
                  className={`flex-1 py-3 font-semibold rounded-xl transition-colors ${selectedSort
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
