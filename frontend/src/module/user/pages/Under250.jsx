import { Link } from "react-router-dom"
import AnimatedPage from "../components/AnimatedPage"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Clock, MapPin } from "lucide-react"

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
  },
]

export default function Under250() {
  return (
    <AnimatedPage className="min-h-screen bg-white pb-20">
      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Under ₹250
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Budget-friendly restaurants and cafes
          </p>
        </div>

        {/* Restaurant Cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {under250Restaurants.map((restaurant) => {
            const restaurantSlug = restaurant.name.toLowerCase().replace(/\s+/g, "-")
            return (
              <Link key={restaurant.id} to={`/user/restaurants/${restaurantSlug}`}>
                <Card className="overflow-hidden cursor-pointer border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 md:h-60 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop"
                    }}
                  />
                </div>
                
                {/* Content Section */}
                <CardContent className="p-4 sm:p-5 bg-white">
                  {/* Restaurant Name & Rating */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 flex-1">
                      {restaurant.name}
                    </h3>
                    <div className="flex-shrink-0 bg-green-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                      <span className="text-sm font-bold">{restaurant.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-white text-white" />
                    </div>
                  </div>
                  
                  {/* Delivery Time & Distance */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">{restaurant.deliveryTime}</span>
                    <span className="mx-1">|</span>
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    <span className="font-medium">{restaurant.distance}</span>
                  </div>
                  
                  {/* Cuisine & Price */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                    <p className="text-sm text-gray-600 font-medium">{restaurant.price}</p>
                  </div>
                </CardContent>
              </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </AnimatedPage>
  )
}

