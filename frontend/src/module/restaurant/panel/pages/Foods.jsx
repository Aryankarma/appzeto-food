import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Filter,
  Plus,
  Search,
  Download,
  ChevronDown,
  ArrowUpDown,
  Pencil,
  Trash2,
} from "lucide-react"
import Footer from "../components/Footer"

// Import Top Rated Foods images
import topRated1 from "@/assets/restaurant icons/Top rated foods/1.png"
import topRated2 from "@/assets/restaurant icons/Top rated foods/2.png"
import topRated3 from "@/assets/restaurant icons/Top rated foods/3.png"
import topRated4 from "@/assets/restaurant icons/Top rated foods/4.png"
import topRated5 from "@/assets/restaurant icons/Top rated foods/4.png"
import topRated6 from "@/assets/restaurant icons/Top rated foods/6.png"
import topRated7 from "@/assets/restaurant icons/Top rated foods/5.png"

// Mock food items data
const foodItems = [
  {
    id: 1,
    name: "Medu Vada",
    image: topRated1,
    category: "Varieties",
    price: 95.0,
    recommended: true,
    status: true,
  },
  {
    id: 2,
    name: "Grilled Lemon Herb M...",
    image: topRated2,
    category: "Varieties",
    price: 320.0,
    recommended: true,
    status: true,
  },
  {
    id: 3,
    name: "Meat Pizza",
    image: topRated3,
    category: "Italian",
    price: 400.0,
    recommended: true,
    status: true,
  },
  {
    id: 4,
    name: "Cheese Pizza",
    image: topRated4,
    category: "Italian",
    price: 250.0,
    recommended: false,
    status: true,
  },
  {
    id: 5,
    name: "Thai Fried Rice",
    image: topRated5,
    category: "Varieties",
    price: 160.0,
    recommended: false,
    status: true,
  },
  {
    id: 6,
    name: "FRIED RICE",
    image: topRated6,
    category: "Varieties",
    price: 120.0,
    recommended: false,
    status: true,
  },
  {
    id: 7,
    name: "Steak Kebabs",
    image: topRated7,
    category: "Varieties",
    price: 160.0,
    recommended: false,
    status: true,
  },
]

export default function Foods() {
  const [searchQuery, setSearchQuery] = useState("")
  const [foods, setFoods] = useState(foodItems)

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRecommendedToggle = (id) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, recommended: !food.recommended } : food
      )
    )
  }

  const handleStatusToggle = (id) => {
    setFoods(
      foods.map((food) =>
        food.id === id ? { ...food, status: !food.status } : food
      )
    )
  }

  const handleDelete = (id) => {
    setFoods(foods.filter((food) => food.id !== id))
  }

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-700" />
            <h1 className="text-xl font-bold text-gray-900">Food List</h1>
          </div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {filteredFoods.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            Out of Stock Foods
          </Button>
          <Link to="/restaurant-panel/foods/add">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Food
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Ex: Search Food Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-full h-10 text-sm bg-white border-gray-200"
          />
        </div>
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 h-10 px-4"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Food List Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    SI
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Category
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  <div className="flex items-center gap-1">
                    Price
                    <ArrowUpDown className="h-3 w-3 text-gray-400" />
                  </div>
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Recommended</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFoods.map((food, index) => (
                <TableRow key={food.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-gray-700">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900">{food.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{food.category}</TableCell>
                  <TableCell className="text-sm font-semibold text-gray-900">
                    $ {food.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={food.recommended}
                      onCheckedChange={() => handleRecommendedToggle(food.id)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={food.status}
                      onCheckedChange={() => handleStatusToggle(food.id)}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(food.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}
