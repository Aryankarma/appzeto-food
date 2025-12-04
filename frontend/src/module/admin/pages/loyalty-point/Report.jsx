import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Filter, Calendar, Settings, TrendingUp, Wallet, Utensils } from "lucide-react"
import { loyaltyPointReportDummy } from "../../data/loyaltyPointReportDummy"

export default function Report() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(loyaltyPointReportDummy)
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    customer: "All",
  })

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(transaction =>
        transaction.transactionId.toLowerCase().includes(query) ||
        transaction.customer.toLowerCase().includes(query) ||
        transaction.reference.includes(query)
      )
    }

    return result
  }, [transactions, searchQuery])

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0)
  const balance = totalCredit - totalDebit

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Customer Loyalty Point Report</h1>

        {/* Filter Options */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Filter Options</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Customer
              </label>
              <select
                value={filters.customer}
                onChange={(e) => handleFilterChange("customer", e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="All">All</option>
                <option value="jane-doe">Jane Doe</option>
                <option value="john-doe">John Doe</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button className="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all">
                Reset
              </button>
              <button className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-green-800">Debit</h3>
              <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-700" />
              </div>
            </div>
            <p className="text-2xl font-bold text-green-900">{totalDebit.toFixed(3)}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-red-800">Credit</h3>
              <div className="w-10 h-10 rounded-lg bg-red-200 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-red-700" />
              </div>
            </div>
            <p className="text-2xl font-bold text-red-900">{totalCredit.toFixed(3)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-blue-800">Balance</h3>
              <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-blue-700" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-900">{balance}</p>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <input
                type="text"
                placeholder="Ex: Search by Transactionl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition-all">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="p-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Transaction Id</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Credit</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Debit</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Transaction Type</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.sl} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{transaction.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.transactionId}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{transaction.customer}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.credit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.debit}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-900">{transaction.balance}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.transactionType}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.reference}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-700">{transaction.createdAt}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
