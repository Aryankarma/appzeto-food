import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Filter, FileText, ArrowUpDown } from "lucide-react"
import { expenseReportDummy } from "../../data/expenseReportDummy"

export default function ExpenseReport() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expenses, setExpenses] = useState(expenseReportDummy)
  const [filters, setFilters] = useState({
    zone: "All Zones",
    restaurant: "All restaurants",
    customer: "All customers",
    type: "All Type",
    time: "All Time",
  })

  const filteredExpenses = useMemo(() => {
    let result = [...expenses]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(expense =>
        expense.orderId.toLowerCase().includes(query) ||
        expense.expenseType.toLowerCase().includes(query) ||
        expense.customerName.toLowerCase().includes(query)
      )
    }

    return result
  }, [expenses, searchQuery])

  const totalExpenses = filteredExpenses.length

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Expense Report</h1>
              <p className="text-sm text-slate-500 mt-1">Expense report description</p>
            </div>
          </div>
        </div>

        {/* Search Data Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Zone
                </label>
                <select
                  value={filters.zone}
                  onChange={(e) => setFilters(prev => ({ ...prev, zone: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Zones">All Zones</option>
                  <option value="Zone 1">Zone 1</option>
                  <option value="Zone 2">Zone 2</option>
                  <option value="Zone 3">Zone 3</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Restaurant
                </label>
                <select
                  value={filters.restaurant}
                  onChange={(e) => setFilters(prev => ({ ...prev, restaurant: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All restaurants">All restaurants</option>
                  <option value="Restaurant 1">Restaurant 1</option>
                  <option value="Restaurant 2">Restaurant 2</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Customer
                </label>
                <select
                  value={filters.customer}
                  onChange={(e) => setFilters(prev => ({ ...prev, customer: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All customers">All customers</option>
                  <option value="Customer 1">Customer 1</option>
                  <option value="Customer 2">Customer 2</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Type">All Type</option>
                  <option value="Discount On Product">Discount On Product</option>
                  <option value="Cashback">Cashback</option>
                  <option value="Free Delivery">Free Delivery</option>
                  <option value="Add Fund Bonus">Add Fund Bonus</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Time
                </label>
                <select
                  value={filters.time}
                  onChange={(e) => setFilters(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full sm:w-48 px-4 py-2.5 pr-8 text-sm rounded-lg border border-slate-300 bg-white text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Time">All Time</option>
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="This Month">This Month</option>
                  <option value="This Year">This Year</option>
                </select>
                <ChevronDown className="absolute right-2 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              <div className="flex items-end">
                <button className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Lists Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Expense Lists {totalExpenses}</h2>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Search by Order ID or type"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>

              <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>SI</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Order Id</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Date & Time</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Expense Type</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Customer Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Expense Amount</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-lg font-semibold text-slate-700 mb-1">No Data Found</p>
                        <p className="text-sm text-slate-500">No expenses match your search</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.sl} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-700">{expense.sl}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`#order-${expense.orderId}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {expense.orderId}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{expense.dateTime}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{expense.expenseType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{expense.customerName}</span>
                          <span className="text-xs text-slate-500">{expense.customerPhone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-slate-900">{expense.expenseAmount}</span>
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
