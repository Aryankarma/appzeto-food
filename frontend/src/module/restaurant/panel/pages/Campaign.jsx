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
import { Megaphone, Search, FolderX } from "lucide-react"
import Footer from "../components/Footer"

export default function Campaign() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-orange to-orange-500 text-white shadow-md">
            <Megaphone className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Campaign</h1>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              0
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Ex : Search by Title name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-200 h-10"
          />
        </div>
      </div>

      {/* Campaign Table with No Data State */}
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-16 text-sm font-semibold text-gray-700">Sl</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Title</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Image</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Date Duration</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Time Duration</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-sm font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} className="py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <div className="flex items-center justify-center w-32 h-24 mb-4">
                        <FolderX className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="text-sm font-medium">No Data Found</div>
                    </div>
                  </TableCell>
                </TableRow>
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

