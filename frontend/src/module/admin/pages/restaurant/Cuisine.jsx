import { useState } from "react"
import { Search, Download, Plus, MapPin, Edit, Trash2, FileSpreadsheet, FileDown, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const MOCK_CUISINES = [
  {
    id: 8,
    sl: 1,
    name: "Sea Food",
    totalRestaurants: 1,
    status: true, // On
  },
  {
    id: 7,
    sl: 2,
    name: "Spanish",
    totalRestaurants: 1,
    status: true, // On
  },
  {
    id: 6,
    sl: 3,
    name: "Fast Food",
    totalRestaurants: 1,
    status: true, // On
  },
  {
    id: 5,
    sl: 4,
    name: "Indian",
    totalRestaurants: 1,
    status: true, // On
  },
  {
    id: 4,
    sl: 5,
    name: "Italian",
    totalRestaurants: 3,
    status: true, // On
  },
  {
    id: 3,
    sl: 6,
    name: "Japanese",
    totalRestaurants: 2,
    status: true, // On
  },
  {
    id: 2,
    sl: 7,
    name: "Chinese",
    totalRestaurants: 1,
    status: true, // On
  },
  {
    id: 1,
    sl: 8,
    name: "Bengali",
    totalRestaurants: 1,
    status: true, // On
  },
]

export default function Cuisine() {
  const totalCuisines = MOCK_CUISINES.length
  const [showExport, setShowExport] = useState(false)
  const [cuisines, setCuisines] = useState(MOCK_CUISINES)

  const toggleStatus = (id) => {
    setCuisines((prev) =>
      prev.map((cuisine) =>
        cuisine.id === id ? { ...cuisine, status: !cuisine.status } : cuisine
      )
    )
  }

  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-500" />
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Cuisine
          </h1>
        </div>
      </div>

      {/* Cuisine List Section */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="p-4">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-gray-900">Cuisine List</h2>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {totalCuisines}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Ex: search by name"
                className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[#006fbd] focus:ring-1 focus:ring-[#006fbd]"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setShowExport((v) => !v)
                }}
                className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors" style={{ backgroundColor: "#006fbd" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#005a9e"} onMouseLeave={(e) => e.target.style.backgroundColor = "#006fbd"}>
                <Plus className="w-4 h-4" />
                Add New Cuisine
              </button>
            </div>
          </div>

          {/* Export dropdown */}
          {showExport && (
            <div className="relative mb-4">
              <div className="absolute right-0 top-0 mt-1 w-52 rounded-xl bg-white shadow-xl border border-gray-100 z-20">
                <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-400">
                    DOWNLOAD OPTIONS
                  </p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="w-6 h-6 rounded-md bg-green-50 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Excel</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(0, 111, 189, 0.1)" }}>
                      <FileDown className="w-4 h-4" style={{ color: "#006fbd" }} />
                    </div>
                    <span>Csv</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="border-t border-gray-200">
            <div className="w-full overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead style={{ backgroundColor: "rgba(0, 111, 189, 0.1)" }}>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Sl
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Cuisine Id
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Cuisine Name
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total Restaurant
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {cuisines.map((cuisine) => (
                    <tr key={cuisine.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {cuisine.sl}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {cuisine.id}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {cuisine.name}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        {cuisine.totalRestaurants}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleStatus(cuisine.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#006fbd] focus:ring-offset-2 ${
                            cuisine.status
                              ? "bg-[#006fbd]"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
                              cuisine.status ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end gap-1.5">
                          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-white transition-colors" style={{ backgroundColor: "#006fbd" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#005a9e"} onMouseLeave={(e) => e.target.style.backgroundColor = "#006fbd"}>
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

