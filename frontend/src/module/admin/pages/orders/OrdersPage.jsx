import { useMemo, useState, useEffect } from "react"
import { Search, Eye, Printer, Filter, Download, ChevronDown, ArrowUpDown, FileText, Settings, X, Calendar, Package } from "lucide-react"
import { ordersDummy } from "../../data/ordersDummy"

// Status configuration with titles, colors, and icons
const statusConfig = {
  "all": { title: "All Orders", color: "emerald", icon: FileText },
  "scheduled": { title: "Scheduled Orders", color: "blue", icon: Calendar },
  "pending": { title: "Pending Orders", color: "amber", icon: Package },
  "accepted": { title: "Accepted Orders", color: "green", icon: Package },
  "processing": { title: "Processing Orders", color: "orange", icon: Package },
  "food-on-the-way": { title: "Food On The Way Orders", color: "amber", icon: Package },
  "delivered": { title: "Delivered Orders", color: "emerald", icon: Package },
  "canceled": { title: "Canceled Orders", color: "rose", icon: Package },
  "payment-failed": { title: "Payment Failed Orders", color: "red", icon: Package },
  "refunded": { title: "Refunded Orders", color: "sky", icon: Package },
  "dine-in": { title: "Dine In Orders", color: "blue", icon: Package },
  "offline-payments": { title: "Offline Payments", color: "slate", icon: Package },
}

function FilterPanel({ isOpen, onClose, filters, setFilters, onApply, onReset }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Filter Orders</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Payment Status
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "Paid", "Unpaid", "Failed", "Refunded"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, paymentStatus: status === "All" ? "" : status }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.paymentStatus === status || (status === "All" && !filters.paymentStatus)
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Type Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Delivery Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["All", "Home Delivery", "Take Away", "Dine In"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters(prev => ({ ...prev, deliveryType: type === "All" ? "" : type }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filters.deliveryType === type || (type === "All" && !filters.deliveryType)
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Min Amount ($)
              </label>
              <input
                type="number"
                value={filters.minAmount || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                placeholder="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Max Amount ($)
              </label>
              <input
                type="number"
                value={filters.maxAmount || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                placeholder="10000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Restaurant Filter */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Restaurant
            </label>
            <select
              value={filters.restaurant || ""}
              onChange={(e) => setFilters(prev => ({ ...prev, restaurant: e.target.value }))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Restaurants</option>
              {[...new Set(ordersDummy.map(o => o.restaurant))].map((rest) => (
                <option key={rest} value={rest}>{rest}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
          >
            Reset
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

function OrdersFilterHeader({ title, count, statusKey, searchQuery, setSearchQuery, onFilterClick, activeFiltersCount }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            {title}
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
              {count}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search your order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-12 py-2.5 w-full sm:w-80 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-slate-100">
              <Search className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="relative">
            <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" />
              <span className="text-black font-bold">Export</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <button 
            onClick={onFilterClick}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all relative ${
              activeFiltersCount > 0 ? "border-emerald-500 bg-emerald-50" : ""
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-black font-bold">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function OrdersTable({ orders, statusKey }) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  
  // Reset to page 1 when orders change
  useEffect(() => {
    setCurrentPage(1)
  }, [orders.length])
  
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return orders.slice(start, end)
  }, [orders, currentPage])

  const getStatusColor = (orderStatus) => {
    const colors = {
      "Delivered": "bg-emerald-100 text-emerald-700",
      "Pending": "bg-blue-100 text-blue-700",
      "Scheduled": "bg-blue-100 text-blue-700",
      "Accepted": "bg-green-100 text-green-700",
      "Processing": "bg-orange-100 text-orange-700",
      "Food On The Way": "bg-yellow-100 text-yellow-700",
      "Canceled": "bg-rose-100 text-rose-700",
      "Payment Failed": "bg-red-100 text-red-700",
      "Refunded": "bg-sky-100 text-sky-700",
      "Dine In": "bg-indigo-100 text-indigo-700",
      "Offline Payments": "bg-slate-100 text-slate-700",
    }
    return colors[orderStatus] || "bg-slate-100 text-slate-700"
  }

  const getPaymentStatusColor = (paymentStatus) => {
    if (paymentStatus === "Paid") return "text-emerald-600"
    if (paymentStatus === "Unpaid" || paymentStatus === "Failed") return "text-red-600"
    return "text-slate-600"
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md">
              <span className="text-5xl text-orange-500 font-bold">!</span>
            </div>
          </div>
          <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
          <p className="text-sm text-slate-500">There are no orders matching your criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>SI</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Order ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Order Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Customer Information</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Restaurant</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center justify-end gap-2">
                  <span>Total Amount</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span>Order Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                </div>
              </th>
              <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {paginatedOrders.map((order, index) => {
              // Format restaurant name to match screenshot (e.g., "Café Monarch")
              const formatRestaurantName = (name) => {
                if (name === "Cafe Monarch") return "Café Monarch"
                return name
              }
              
              return (
                <tr 
                  key={order.orderId} 
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-900">{order.orderId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700">{order.date}, {order.time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{order.customerName}</span>
                      <span className="text-xs text-slate-500 mt-0.5">{order.customerPhone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-slate-700">{formatRestaurantName(order.restaurant)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-slate-900">
                      $ {order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-xs mt-0.5 ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className="text-xs text-slate-500">{order.deliveryType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        className="p-1.5 rounded text-orange-600 hover:bg-orange-50 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Print Order"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold">{Math.min(currentPage * itemsPerPage, orders.length)}</span> of{" "}
            <span className="font-semibold">{orders.length}</span> orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      currentPage === pageNum
                        ? "bg-emerald-500 text-white shadow-md"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrdersPage({ statusKey = "all" }) {
  const config = statusConfig[statusKey] || statusConfig["all"]
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    paymentStatus: "",
    deliveryType: "",
    minAmount: "",
    maxAmount: "",
    fromDate: "",
    toDate: "",
    restaurant: "",
  })

  // Get base filtered orders by status
  const baseFilteredOrders = useMemo(() => {
    if (statusKey === "all") {
      return ordersDummy
    }
    
    // Map route keys to order status values
    const statusMap = {
      "scheduled": "Scheduled",
      "pending": "Pending",
      "accepted": "Accepted",
      "processing": "Processing",
      "food-on-the-way": "Food On The Way",
      "delivered": "Delivered",
      "canceled": "Canceled",
      "payment-failed": "Payment Failed",
      "refunded": "Refunded",
      "dine-in": "Dine In",
      "offline-payments": "Offline Payments",
    }
    
    const targetStatus = statusMap[statusKey]
    return ordersDummy.filter(order => order.orderStatus === targetStatus)
  }, [statusKey])

  // Apply search and filters
  const filteredOrders = useMemo(() => {
    let result = [...baseFilteredOrders]

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(order => 
        order.orderId.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.restaurant.toLowerCase().includes(query) ||
        order.customerPhone.includes(query) ||
        order.totalAmount.toString().includes(query)
      )
    }

    // Apply filters
    if (filters.paymentStatus) {
      result = result.filter(order => order.paymentStatus === filters.paymentStatus)
    }

    if (filters.deliveryType) {
      result = result.filter(order => order.deliveryType === filters.deliveryType)
    }

    if (filters.minAmount) {
      result = result.filter(order => order.totalAmount >= parseFloat(filters.minAmount))
    }

    if (filters.maxAmount) {
      result = result.filter(order => order.totalAmount <= parseFloat(filters.maxAmount))
    }

    if (filters.restaurant) {
      result = result.filter(order => order.restaurant === filters.restaurant)
    }

    // Helper function to parse date format "16 JUL 2025"
    const parseOrderDate = (dateStr) => {
      const months = {
        "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06",
        "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12"
      }
      const parts = dateStr.split(" ")
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0")
        const month = months[parts[1].toUpperCase()] || "01"
        const year = parts[2]
        return new Date(`${year}-${month}-${day}`)
      }
      return new Date(dateStr)
    }

    if (filters.fromDate) {
      result = result.filter(order => {
        const orderDate = parseOrderDate(order.date)
        const fromDate = new Date(filters.fromDate)
        return orderDate >= fromDate
      })
    }

    if (filters.toDate) {
      result = result.filter(order => {
        const orderDate = parseOrderDate(order.date)
        const toDate = new Date(filters.toDate)
        toDate.setHours(23, 59, 59, 999) // Include entire day
        return orderDate <= toDate
      })
    }

    return result
  }, [baseFilteredOrders, searchQuery, filters])

  const count = filteredOrders.length

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== "").length
  }, [filters])

  const handleApplyFilters = () => {
    setIsFilterOpen(false)
  }

  const handleResetFilters = () => {
    setFilters({
      paymentStatus: "",
      deliveryType: "",
      minAmount: "",
      maxAmount: "",
      fromDate: "",
      toDate: "",
      restaurant: "",
    })
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <OrdersFilterHeader 
        title={config.title} 
        count={count} 
        statusKey={statusKey}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => setIsFilterOpen(true)}
        activeFiltersCount={activeFiltersCount}
      />
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
      <OrdersTable orders={filteredOrders} statusKey={statusKey} />
    </div>
  )
}

