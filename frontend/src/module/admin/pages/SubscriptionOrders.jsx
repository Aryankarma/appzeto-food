import { useState, useMemo, useEffect } from "react"
import { Search, Eye, Printer, ArrowUpDown, Calendar, Package, Filter, Download, ChevronDown, X, Settings, CheckCircle } from "lucide-react"
import { subscriptionOrdersDummy } from "../data/subscriptionOrdersDummy"

export default function SubscriptionOrders() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "",
    orderType: "",
    restaurant: "",
  })
  const itemsPerPage = 10

  const filteredOrders = useMemo(() => {
    let result = [...subscriptionOrdersDummy]
    
    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(order =>
        order.subscriptionId.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.restaurant.toLowerCase().includes(query) ||
        order.customerPhone.includes(query)
      )
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(order => order.status === filters.status)
    }

    if (filters.orderType) {
      result = result.filter(order => order.orderType === filters.orderType)
    }

    if (filters.restaurant) {
      result = result.filter(order => order.restaurant === filters.restaurant)
    }

    return result
  }, [searchQuery, filters])

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredOrders.slice(start, end)
  }, [filteredOrders, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filteredOrders.length])

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== "").length
  }, [filters])

  // Statistics
  const stats = useMemo(() => {
    const total = subscriptionOrdersDummy.length
    const expired = subscriptionOrdersDummy.filter(o => o.status === "Expired").length
    const active = subscriptionOrdersDummy.filter(o => o.status === "Active").length
    const totalDelivered = subscriptionOrdersDummy.reduce((sum, o) => sum + o.delivered, 0)
    return { total, expired, active, totalDelivered }
  }, [])

  const getStatusColor = (status) => {
    if (status === "Expired") return "bg-blue-100 text-blue-700"
    if (status === "Active") return "bg-emerald-100 text-emerald-700"
    if (status === "Pending") return "bg-amber-100 text-amber-700"
    return "bg-slate-100 text-slate-700"
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              Subscription Orders
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredOrders.length}
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
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all relative ${
                activeFiltersCount > 0 ? "border-emerald-500 bg-emerald-50" : ""
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Subscriptions</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Active</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Expired</p>
              <p className="text-2xl font-bold text-blue-600">{stats.expired}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 mb-1">Total Delivered</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalDelivered}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>


      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsFilterOpen(false)}>
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Filter Subscription Orders</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Active", "Expired", "Pending"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters(prev => ({ ...prev, status: status === "All" ? "" : status }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.status === status || (status === "All" && !filters.status)
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Order Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["All", "Daily", "Weekly", "Monthly"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters(prev => ({ ...prev, orderType: type === "All" ? "" : type }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.orderType === type || (type === "All" && !filters.orderType)
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

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
                  {[...new Set(subscriptionOrdersDummy.map(o => o.restaurant))].map((rest) => (
                    <option key={rest} value={rest}>{rest}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setFilters({ status: "", orderType: "", restaurant: "" })
                  setIsFilterOpen(false)
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
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
                    <span>Subscription ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Order Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Duration</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Restaurant</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md">
                          <span className="text-5xl text-orange-500 font-bold">!</span>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                      <p className="text-sm text-slate-500">No subscription orders match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order, index) => (
                  <tr
                    key={order.subscriptionId}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{(currentPage - 1) * itemsPerPage + index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{order.subscriptionId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{order.orderType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{order.duration}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{order.restaurant}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">{order.customerName}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{order.customerPhone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <div className="text-xs text-slate-600">
                          Total Order: <span className="font-medium text-slate-900">{order.totalOrders}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          Delivered: <span className="font-medium text-emerald-600">{order.delivered}</span>
                        </div>
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
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of{" "}
              <span className="font-semibold">{filteredOrders.length}</span> subscriptions
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
    </div>
  )
}

