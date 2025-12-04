import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Filter, ArrowUpDown } from "lucide-react"
import { subscriptionReportDummy } from "../../data/subscriptionReportDummy"

export default function SubscriptionReport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [subscriptions, setSubscriptions] = useState(subscriptionReportDummy)
  const [filters, setFilters] = useState({
    restaurant: "All restaurants",
    package: "All packages",
    all: "All",
  })

  const filteredSubscriptions = useMemo(() => {
    let result = [...subscriptions]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(subscription =>
        subscription.transactionId.toLowerCase().includes(query) ||
        subscription.restaurantName.toLowerCase().includes(query)
      )
    }

    return result
  }, [subscriptions, searchQuery])

  const totalSubscriptions = filteredSubscriptions.length

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen overflow-x-hidden">
      <div className="w-full max-w-full">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Subscription Report</h1>
        </div>

        {/* Search Data Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Search Data</h3>
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Restaurant
                </label>
                <select
                  value={filters.restaurant}
                  onChange={(e) => setFilters(prev => ({ ...prev, restaurant: e.target.value }))}
                  className="w-full sm:w-48 px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All restaurants">All restaurants</option>
                  <option value="Cheese Burger">Cheese Burger</option>
                  <option value="Cheesy Restaurant">Cheesy Restaurant</option>
                  <option value="TEST">TEST</option>
                  <option value="Frying Nemo">Frying Nemo</option>
                  <option value="Tasty Lunch">Tasty Lunch</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Package
                </label>
                <select
                  value={filters.package}
                  onChange={(e) => setFilters(prev => ({ ...prev, package: e.target.value }))}
                  className="w-full sm:w-48 px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All packages">All packages</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Pro">Pro</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  All
                </label>
                <select
                  value={filters.all}
                  onChange={(e) => setFilters(prev => ({ ...prev, all: e.target.value }))}
                  className="w-full sm:w-48 px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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

        {/* Subscription Report Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Subscription Report ({totalSubscriptions})</h2>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by ID or Restaurant"
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>SI</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Transaction Id</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Transaction Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Restaurant Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Package Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Duration</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Pricing</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Payment Status</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Payment Method</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                        <p className="text-sm text-slate-500">No subscriptions match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.sl} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{subscription.sl}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700 font-mono break-all">{subscription.transactionId}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-700">{subscription.transactionDate}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-700">{subscription.restaurantName}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-700">{subscription.packageName}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs text-slate-700">{subscription.duration}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-900">{subscription.pricing}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-green-600">{subscription.pricing}</span>
                          <span className="px-2 py-1 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                            {subscription.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700 truncate block">{subscription.paymentMethod}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="p-1.5 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
