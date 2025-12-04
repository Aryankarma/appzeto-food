import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Filter, Calendar, ClipboardList, DollarSign, FileText, AlertCircle } from "lucide-react"
import { restaurantVATReportDummy, restaurantVATStats } from "../../data/restaurantVATReportDummy"

export default function RestaurantVATReport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [reports, setReports] = useState(restaurantVATReportDummy)
  const [filters, setFilters] = useState({
    dateRange: "",
    restaurant: "All Restaurants",
  })

  const filteredReports = useMemo(() => {
    let result = [...reports]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(report =>
        report.restaurantName?.toLowerCase().includes(query)
      )
    }

    return result
  }, [reports, searchQuery])

  const totalReports = filteredReports.length

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Restaurant Tax Report</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    placeholder="11/27/2025 - 12/03/2025"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Restaurant
                </label>
                <select
                  value={filters.restaurant}
                  onChange={(e) => setFilters(prev => ({ ...prev, restaurant: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Restaurants">All Restaurants</option>
                  <option value="Café Monarch">Café Monarch</option>
                  <option value="Hungry Puppets">Hungry Puppets</option>
                  <option value="Cheesy Restaurant">Cheesy Restaurant</option>
                  <option value="Cheese Burger">Cheese Burger</option>
                  <option value="Frying Nemo">Frying Nemo</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-end">
              <button className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Orders Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-1">Total Orders</p>
                <p className="text-xs text-slate-600 mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{restaurantVATStats.totalOrders}</p>
                <p className="text-lg font-semibold text-blue-600 mt-1">{restaurantVATStats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Order Amount Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-1">Total Order Amount</p>
                <p className="text-xs text-slate-600 mb-2">Total Order Amount</p>
                <p className="text-3xl font-bold text-green-600">{restaurantVATStats.totalOrderAmount}</p>
                <p className="text-lg font-semibold text-green-600 mt-1">{restaurantVATStats.totalOrderAmount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Total Tax Amount Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900 mb-1">Total Tax Amount</p>
                <p className="text-xs text-slate-600 mb-2">Total Tax Amount</p>
                <p className="text-3xl font-bold text-red-600">{restaurantVATStats.totalTaxAmount}</p>
                <p className="text-lg font-semibold text-red-600 mt-1">{restaurantVATStats.totalTaxAmount}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* All Restaurant Taxes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">All Restaurant Taxes</h2>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[200px]">
                <input
                  type="text"
                  placeholder="Ex: Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredReports.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-lg bg-slate-200 flex items-center justify-center mb-4">
                  <AlertCircle className="w-12 h-12 text-slate-500" />
                </div>
                <p className="text-lg font-semibold text-slate-700 mb-2">No Data Found</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      SI
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Restaurant Info
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Total Order
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Total Order Amount
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Tax Amount
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {filteredReports.map((report) => (
                    <tr key={report.sl} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{report.sl}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {report.icon && (
                            <img src={report.icon} alt={report.restaurantName} className="w-8 h-8 rounded" />
                          )}
                          <span className="text-sm text-slate-700">{report.restaurantName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{report.totalOrder}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{report.totalOrderAmount}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{report.taxAmount}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
