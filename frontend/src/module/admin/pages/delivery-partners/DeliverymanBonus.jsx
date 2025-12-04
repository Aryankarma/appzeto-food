import { useState, useMemo } from "react"
import { Search, Wallet, Settings, Folder } from "lucide-react"
import { deliverymanBonusDummy } from "../../data/deliverymanBonusDummy"

export default function DeliverymanBonus() {
  const [formData, setFormData] = useState({
    deliveryman: "",
    amount: "",
    reference: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(deliverymanBonusDummy)

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) {
      return transactions
    }
    
    const query = searchQuery.toLowerCase().trim()
    return transactions.filter(transaction =>
      transaction.deliveryman?.toLowerCase().includes(query) ||
      transaction.transactionId?.toLowerCase().includes(query)
    )
  }, [transactions, searchQuery])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Bonus added successfully!")
  }

  const handleReset = () => {
    setFormData({
      deliveryman: "",
      amount: "",
      reference: "",
    })
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Bonus Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6 relative">
          <button className="absolute top-6 right-6 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Bonus</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  DeliveryMan
                </label>
                <select
                  value={formData.deliveryman}
                  onChange={(e) => handleInputChange("deliveryman", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select Delivery Man</option>
                  <option value="jhon-doe">Jhon Doe</option>
                  <option value="jane-doe">Jane Doe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reference (Optional)
                </label>
                <textarea
                  value={formData.reference}
                  onChange={(e) => handleInputChange("reference", e.target.value)}
                  placeholder="Enter reference"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-medium rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Transactions</h2>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700">
                {filteredTransactions.length}
              </span>
            </div>

            <div className="relative flex-1 sm:flex-initial min-w-[250px]">
              <input
                type="text"
                placeholder="Search by name or transac"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Table */}
          {filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-md">
                  <div className="relative">
                    <Folder className="w-12 h-12 text-slate-400" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center z-10">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-700">No Data Found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Transaction Id</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">DeliveryMan</th>
                    <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Bonus</th>
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
                        <span className="text-sm text-slate-700">{transaction.deliveryman}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-700">{transaction.bonus}</span>
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
          )}
        </div>
      </div>
    </div>
  )
}
