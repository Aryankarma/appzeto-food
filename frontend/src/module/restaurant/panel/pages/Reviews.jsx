import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Star, Search, Filter, CheckCircle2, Menu } from "lucide-react"
import Footer from "../components/Footer"

// Import food images
import topRated1 from "@/assets/restaurant icons/Top rated foods/1.png"
import topRated2 from "@/assets/restaurant icons/Top rated foods/2.png"
import topRated3 from "@/assets/restaurant icons/Top rated foods/3.png"

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    food: {
      image: topRated1,
      name: "Meat Pizza",
      orderId: "#100113",
    },
    reviewer: {
      name: "Purno Test",
      verified: true,
      phone: "+8*********",
    },
    review: {
      rating: 5,
      comment: "vvxvxvxv",
    },
    date: "01 Jun 2023",
    time: "11:55 am",
    hasReply: false,
  },
  {
    id: 2,
    food: {
      image: topRated2,
      name: "Meat Pizza",
      orderId: "#100080",
    },
    reviewer: {
      name: "Jane Doe",
      verified: true,
      phone: "+8*********",
    },
    review: {
      rating: 5,
      comment: "Pizza packaging and test was so good...",
    },
    date: "02 Jan 2023",
    time: "03:35 pm",
    hasReply: true,
  },
  {
    id: 3,
    food: {
      image: topRated3,
      name: "Meat Pizza",
      orderId: "#100008",
    },
    reviewer: {
      name: null,
      verified: false,
      phone: null,
    },
    review: {
      rating: 4,
      comment: "Nice",
    },
    date: "21 Aug 2021",
    time: "10:46 pm",
    hasReply: true,
  },
]

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReviews = mockReviews.filter(
    (review) =>
      review.food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewer.phone?.includes(searchQuery) ||
      review.food.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-orange to-orange-500 text-white shadow-md">
            <Star className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Customers Reviews</h1>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 font-semibold">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Ex : Search by food name or ph"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200 h-10"
        />
      </div>

      {/* Reviews Table */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-16 text-sm font-semibold text-gray-700">SI</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Food</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Reviewer</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Review</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review, index) => (
                  <TableRow
                    key={review.id}
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <TableCell className="text-sm text-gray-700 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={review.food.image}
                            alt={review.food.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {review.food.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {review.food.orderId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.reviewer.name ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {review.reviewer.name}
                            </span>
                            {review.reviewer.verified && (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          {review.reviewer.phone && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {review.reviewer.phone}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          Customer not found
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-primary-orange text-primary-orange" />
                          <span className="text-sm font-semibold text-gray-900">
                            {review.review.rating}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 max-w-md">
                          {review.review.comment}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm text-gray-700 font-medium">
                          {review.date}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {review.time}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {review.hasReply ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50 h-8 px-4"
                        >
                          View Reply
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white h-8 px-4"
                        >
                          Give Reply
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}

