import { useState } from "react"
import { Search, Download, Filter, Eye, Printer, X, FileSpreadsheet, FileDown, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"

const MOCK_REFUND_ORDERS = [
  {
    id: "100111",
    sl: 1,
    date: "01 JUN 2023",
    time: "10:37 AM",
    customerName: "Munam ShahariEr Test",
    customerPhone: "+8**********",
    restaurant: "Hungry Puppets",
    total: "$ 129.75",
    paymentStatus: "Paid",
    orderStatus: "Refund Requested",
    deliveryType: "Home Delivery",
  },
  {
    id: "100067",
    sl: 2,
    date: "11 JAN 2022",
    time: "01:42 PM",
    customerName: "Jane Cooper",
    customerPhone: "+8**********",
    restaurant: "Hungry Puppets",
    total: "$ 99.75",
    paymentStatus: "Paid",
    orderStatus: "Refund Requested",
    deliveryType: "Home Delivery",
  },
]

export default function NewRefundRequests() {
  const totalRefunds = MOCK_REFUND_ORDERS.length
  const [showRefundDropdown, setShowRefundDropdown] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
            Requested Orders
          </h1>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {totalRefunds}
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-2 p-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto">
              <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-2.5 flex items-center text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search your order..."
                  className="w-full rounded-md border border-gray-300 bg-white py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => {
                    setShowRefundDropdown((v) => !v)
                    setShowExport(false)
                  }}
                  className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Refund Requests
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </button>
                <button
                  onClick={() => {
                    setShowExport((v) => !v)
                    setShowRefundDropdown(false)
                  }}
                  className="relative inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Export
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </button>
                <button
                  onClick={() => setShowFilters(true)}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Refund Requests dropdown */}
          {showRefundDropdown && (
            <div className="relative">
              <div className="absolute right-4 top-0 mt-1 w-52 rounded-xl bg-white shadow-xl border border-gray-100 z-20">
                <div className="px-4 pt-3 pb-2 border-b border-gray-100">
                  <p className="text-[11px] font-semibold tracking-[0.12em] text-gray-400">
                    REFUND OPTIONS
                  </p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                    <span>New Refund Requests</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left">
                    <span>Processed Refunds</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export dropdown */}
          {showExport && (
            <div className="relative">
              <div className="absolute right-4 top-0 mt-1 w-52 rounded-xl bg-white shadow-xl border border-gray-100 z-20">
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
                    <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                      <FileDown className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Csv</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="border-t border-gray-200">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer Information
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {MOCK_REFUND_ORDERS.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 whitespace-nowrap text-gray-700 text-sm font-semibold">
                      {order.sl}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-blue-600 font-bold">
                      {order.id}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="font-semibold">{order.date}</div>
                      <div className="text-gray-500 font-medium text-xs mt-0.5">{order.time}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-gray-500 font-semibold text-xs mt-0.5">{order.customerPhone}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {order.restaurant}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <div className="text-gray-900 font-bold text-emerald-500">
                        {order.total}
                      </div>
                      <div className="text-xs text-emerald-500 font-semibold mt-0.5">{order.paymentStatus}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <div className="text-red-500 font-bold">{order.orderStatus}</div>
                      <div className="text-gray-500 mt-1 font-semibold text-xs">{order.deliveryType}</div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-1.5">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-orange-200 bg-orange-50 text-orange-500 hover:bg-orange-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100">
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Filter side panel */}
      {showFilters && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Order filter
              </h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  ZONE
                </p>
                <div className="relative">
                  <select className="w-full h-11 rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>Select zone</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  RESTAURANT
                </p>
                <input
                  type="text"
                  className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  DATE BETWEEN
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      className="w-full h-11 rounded-md border border-gray-300 px-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      🗓
                    </span>
                  </div>
                  <div className="text-center text-xs text-gray-400">
                    ----to----
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd-mm-yyyy"
                      className="w-full h-11 rounded-md border border-gray-300 px-3 pr-9 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 text-xs">
                      🗓
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
              <button className="flex-1 h-11 rounded-md border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Clear all filters
              </button>
              <button className="flex-1 h-11 rounded-md bg-[#2563eb] text-white text-sm font-semibold hover:bg-[#1d4ed8]">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

