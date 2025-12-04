import { useState, useMemo } from "react"
import { Search, Download, ChevronDown, Settings, Camera, FileText } from "lucide-react"
import { deliveryManPaymentsDummy } from "../../data/deliveryManPaymentsDummy"

export default function DeliveryManPayments() {
  const [formData, setFormData] = useState({
    deliveryman: "",
    amount: "",
    method: "",
    reference: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [payments, setPayments] = useState(deliveryManPaymentsDummy)

  const filteredPayments = useMemo(() => {
    if (!searchQuery.trim()) {
      return payments
    }
    
    const query = searchQuery.toLowerCase().trim()
    return payments.filter(payment =>
      payment.name?.toLowerCase().includes(query) ||
      payment.reference?.toLowerCase().includes(query)
    )
  }, [payments, searchQuery])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Earning provided successfully!")
  }

  const handleReset = () => {
    setFormData({
      deliveryman: "",
      amount: "",
      method: "",
      reference: "",
    })
  }

  return (
    <div className="p-4 lg:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Provide Delivery Man Earning Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">Provide Delivery Man Earning</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deliveryman
                </label>
                <select
                  value={formData.deliveryman}
                  onChange={(e) => handleInputChange("deliveryman", e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select Deliveryman</option>
                  <option value="leslie-alexander">Leslie Alexander</option>
                  <option value="jane-doe">Jane Doe</option>
                  <option value="jhon-doe">Jhon Doe</option>
                  <option value="jerome-bell">Jerome Bell</option>
                  <option value="kathryn-murphy">Kathryn Murphy</option>
                  <option value="robert-fox">Robert Fox</option>
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
                  placeholder="Ex: 100"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Method
                </label>
                <input
                  type="text"
                  value={formData.method}
                  onChange={(e) => handleInputChange("method", e.target.value)}
                  placeholder="Ex: Cash"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Reference
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => handleInputChange("reference", e.target.value)}
                  placeholder="Ex: Collect Cash"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Distribute DM Earning Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
          <button className="absolute top-6 right-6 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">Distribute DM Earning Table</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-initial min-w-[250px]">
                <input
                  type="text"
                  placeholder="Ex: Search here by Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <button className="px-4 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md">
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">SI</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Received At</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.sl} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{payment.sl}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                        {payment.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{payment.receivedAt}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">
                        $ {payment.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{payment.method}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-700">{payment.reference}</span>
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

